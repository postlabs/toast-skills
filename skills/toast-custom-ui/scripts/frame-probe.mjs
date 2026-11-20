// frame-probe: draw any sealed frame headless at card width, under a shipped look, with your data.
// Nothing in the user's Toast changes.
//   node frame-probe.mjs <frameUrl> <outPng> <look> <data.json|none> [typeJs]
// frameUrl: http://atoms.localhost:<port>/api/v1/sealed/frame?jar=…&family=…&atom=…&chat=…
// look: one of the 8 shipped looks (values from ../reference/look-values.css, or LOOKS=<css file>).
// typeJs: optional JS run after drawing (e.g. typing into a field), to capture a state.
// WIDTH / HEIGHT env set the viewport (default 380 x 420). Prints the font check, height and text.
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const [url, outPng, skin, dataFile, typeJs] = process.argv.slice(2);
if (!url || !outPng || !skin) { console.error('usage: node frame-probe.mjs <frameUrl> <outPng> <look> <data.json|none> [typeJs]'); process.exit(2); }
const LOOKS = process.env.LOOKS || join(dirname(fileURLToPath(import.meta.url)), '..', 'reference', 'look-values.css');
const W = +(process.env.WIDTH || 380), H = +(process.env.HEIGHT || 420);
const css = readFileSync(LOOKS, 'utf8');
const start = css.indexOf(`[data-skin="${skin}"] {`);
const block = css.slice(start, css.indexOf('\n}', start));
const raw = {};
for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) raw[m[1]] = m[2].trim();
const resolve = (v, d = 0) => d > 8 ? v : v.replace(/var\((--[\w-]+)(?:,\s*([^)]*))?\)/g, (_, k, f) => raw[k] ? resolve(raw[k], d + 1) : (f || ''));
const tokens = {};
for (const k of Object.keys(raw)) if (/^--(?:bg|text|border)-(?:neutral|brand|success|warning|danger|info|question)(?:-[a-z]+)*$/.test(k)) tokens[k] = resolve(raw[k]);
const surface = tokens['--bg-neutral-base'] || '#fff';
const data = dataFile && dataFile !== 'none' ? JSON.parse(readFileSync(dataFile, 'utf8')) : undefined;

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
const port = 9300 + Math.floor(Math.random() * 400);
const prof = mkdtempSync(join(tmpdir(), 'fx-edge-'));
const proc = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
  '--host-resolver-rules=MAP atoms.localhost 127.0.0.1', `--window-size=${W},${H}`, '--force-device-scale-factor=2', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {} await sleep(200); }
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: false });
await send('Page.navigate', { url });
await sleep(2500);
await ev(`document.body.style.background=${JSON.stringify(surface)}; 1`);
await ev(`window.postMessage({sealed:true,kind:'theme',theme:{version:1,tokens:${JSON.stringify(tokens)},reducedMotion:true}},'*'); 1`);
if (data !== undefined) await ev(`window.postMessage({sealed:true,kind:'data',data:${JSON.stringify(data)}},'*'); 1`);
await sleep(1500);
if (typeJs) { await ev(typeJs); await sleep(400); }
const info = await ev(`JSON.stringify({font: document.fonts.check('13px Pretendard','가'), loaded:[...document.fonts].filter(f=>f.status==='loaded').length, h: document.getElementById('root').scrollHeight, text: document.getElementById('root').innerText.slice(0,400), ff: getComputedStyle(document.querySelector('#root > div')||document.body).fontFamily})`);
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(outPng, Buffer.from(shot.result.data, 'base64'));
console.log(info); if (logs.length) console.log(logs.join('\n'));
ws.close(); proc.kill();

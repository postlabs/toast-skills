// Load a sealed frame top-level in headless Edge, post it data the way the host does,
// wait, then read the probe's results and save a screenshot.
// usage: node probe_frame.mjs <frameUrl> <outPng> <outJson> [dark]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, outPng, outJson, dark] = process.argv.slice(2);
import { existsSync } from 'node:fs';
const EDGE = [
  process.env.PROBE_BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean).find(existsSync);
if (!EDGE) { console.error('No Edge or Chrome found; set PROBE_BROWSER to one.'); process.exit(2); }
const port = 9300 + Math.floor(Math.random() * 400);
const prof = mkdtempSync(join(tmpdir(), 'probe-edge-'));
const proc = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
  '--window-size=760,900', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {}
  await sleep(200);
}
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Log.entryAdded') logs.push('LOG ' + m.params.entry.level + ' ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
await send('Page.navigate', { url });
await sleep(1000); await send('Runtime.evaluate', { expression: "window.__msgs=[]; addEventListener('message', e=>window.__msgs.push(JSON.stringify(e.data).slice(0,300)))" }); await sleep(2000);
await send('Runtime.evaluate', { expression: `window.postMessage({sealed:true,kind:'data',data:{dark:${dark ? 'true' : 'false'}}},'*')` });
let res;
for (let i = 0; i < 120; i++) {
  await sleep(500);
  res = await send('Runtime.evaluate', { expression: 'JSON.stringify(globalThis.__probe||null)', returnByValue: true });
  if (res.result?.result?.value && res.result.result.value !== 'null') break;
}
await sleep(1500);
const dbg = await send('Runtime.evaluate', { expression: 'JSON.stringify({msgs: window.__msgs, root: document.getElementById("root").innerHTML.slice(0,300)})', returnByValue: true }); logs.push('DBG ' + dbg.result?.result?.value);
const fonts = await send('Runtime.evaluate', { expression: `document.fonts.check('16px "Pretendard Variable"', '가') + ' / ' + [...document.fonts].filter(f=>f.status==='loaded').length + ' faces loaded'`, returnByValue: true });
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(outPng, Buffer.from(shot.result.data, 'base64'));
writeFileSync(outJson, JSON.stringify({ probe: JSON.parse(res.result.result.value || 'null'), fonts: fonts.result?.result?.value, logs }, null, 1));
ws.close(); proc.kill();
console.log('done');

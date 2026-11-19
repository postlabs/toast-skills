// piece-probe: draw an app-window piece (sealed atom mounted in a shadow root) headless, with the
// app's real token file and Pretendard, in any skin, in any state, and save a PNG per case.
// Nothing in the user's Toast changes. Use it for states you cannot reach on the live window:
// light skin, empty / scanning, long names, a filter with no matches.
//
//   node piece-probe.mjs <cases.json>
//
// cases.json:
// { "atom": "<path to atom.js>", "export": "devtreelist",
//   "tokens": "<repo>/src/frontend/src/styles/tokens.base-vocab.css",
//   "fonts":  "<repo>/src/frontend/public/fonts/pretendard",
//   "outDir": "shots/probe", "title": "Dev Tree",
//   "cases": [ { "name": "dark-default", "skin": "nocturne", "data": "fixtures/devtree.json",
//                "frame": "card" | "page", "width": 560, "height": 880,
//                "type": "zzz" (typed into the first input), "click": "Collapse" (button text),
//                "theme": { "--text-neutral": "#000" } (ctx.theme.tokens) } ] }
//
// The card frame is a stand-in for the desk card's own bar (icon, title, close) so the piece is
// judged in context; judge the real bar on a see-it.ps1 capture of the live window.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve, extname } from 'node:path';

const specPath = resolve(process.argv[2] || 'cases.json');
const base = dirname(specPath);
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const rel = (p) => resolve(base, p);
const outDir = rel(spec.outDir || 'shots/probe');
mkdirSync(outDir, { recursive: true });

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.otf': 'font/otf', '.html': 'text/html' };

function page(c) {
  const W = c.width || 560, H = c.height || 880;
  const card = (c.frame || 'card') === 'card';
  return `<!doctype html><html data-skin="${c.skin || 'nocturne'}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/tokens.css">
<style>
@font-face{font-family:Pretendard;font-weight:400;src:url(/fonts/Pretendard-Regular.otf)}
@font-face{font-family:Pretendard;font-weight:500;src:url(/fonts/Pretendard-Medium.otf)}
@font-face{font-family:Pretendard;font-weight:600;src:url(/fonts/Pretendard-SemiBold.otf)}
html,body{margin:0;background:${card ? '#6b7280' : 'var(--bg-neutral-base)'};font-family:Pretendard,sans-serif;color:var(--text-neutral)}
#frame{width:${W}px;height:${H}px;display:flex;flex-direction:column;overflow:hidden;background:var(--bg-neutral-base);
  ${card ? 'margin:16px;border-radius:12px;border:1px solid var(--border-neutral);' : ''}}
#bar{flex:none;height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;font-size:13px;font-weight:600;
  border-bottom:1px solid var(--border-neutral);background:color-mix(in srgb,var(--text-neutral) 4%,var(--bg-neutral-base))}
#bar .x{margin-left:auto;opacity:.7;font-weight:400;font-size:16px}
#body{flex:1;overflow:auto;position:relative}
</style></head><body><div id="frame">${card ? `<div id="bar"><span>▣</span><span>${spec.title || 'Widget'}</span><span class="x">×</span></div>` : ''}
<div id="body"><div id="host"></div></div></div>
<script type="module">
const mod = await import('/atom.js');
const data = await (await fetch('/data.json')).json();
const host = document.getElementById('host');
const root = host.attachShadow({ mode: 'open' });
const a = mod.atoms[${JSON.stringify(spec.export)}];
const ctx = { theme: { tokens: ${JSON.stringify(c.theme || {})}, reducedMotion: true } };
await a.render(root, data, ctx);
await document.fonts.ready;
window.__root = root; window.__ready = true;
</script></body></html>`;
}

let current = null;
const server = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let file = null;
  if (u === '/' || u === '/index.html') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page(current)); }
  if (u === '/atom.js') file = rel(spec.atom);
  else if (u === '/tokens.css') file = spec.tokens;
  else if (u === '/data.json') file = current.data ? rel(current.data) : null;
  else if (u.startsWith('/fonts/')) file = join(spec.fonts, u.slice(7));
  if (u === '/data.json' && !file) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{}'); }
  if (!file || !existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const http = `http://127.0.0.1:${server.address().port}`;

const port = 9700 + Math.floor(Math.random() * 200);
const prof = mkdtempSync(join(tmpdir(), 'piece-probe-'));
const proc = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
  '--window-size=1200,1400', '--force-device-scale-factor=1.25', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
let targets;
for (let i = 0; i < 60; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {}
  await sleep(200);
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); let logs = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Runtime.enable'); await send('Page.enable');

const report = [];
for (const c of spec.cases) {
  current = c; logs = [];
  await send('Page.navigate', { url: `${http}/?${encodeURIComponent(c.name)}` });
  let ok = false;
  for (let i = 0; i < 60 && !ok; i++) { await sleep(150); ok = await evalJs('!!window.__ready'); }
  if (c.click) await evalJs(`(()=>{const b=[...__root.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(c.click)}); b&&b.click(); return !!b})()`);
  if (c.type != null) await evalJs(`(()=>{const i=__root.querySelector('input'); if(!i) return false; i.value=${JSON.stringify(c.type)}; i.dispatchEvent(new Event('input',{bubbles:true})); return true})()`);
  if (c.hover) await evalJs(`(()=>{const r=__root.querySelectorAll(${JSON.stringify(c.hover)})[0]; r&&r.classList.add('__hover'); return !!r})()`);
  await sleep(250);
  const box = await evalJs(`(()=>{const r=document.getElementById('frame').getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}})()`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: box.x, y: box.y, width: box.w, height: box.h, scale: 1 } });
  const out = join(outDir, `${c.name}.png`);
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  const facts = await evalJs(`(()=>{const q=s=>[...__root.querySelectorAll(s)];
    const cut=q('*').filter(e=>e.scrollWidth>e.clientWidth+1 && getComputedStyle(e).textOverflow==='ellipsis').map(e=>({text:e.textContent.slice(0,60), title: !!(e.title||e.closest('[title]'))}));
    const sizes=[...new Set(q('*').map(e=>getComputedStyle(e).fontSize))];
    const fam=[...new Set(q('*').map(e=>getComputedStyle(e).fontFamily))];
    return {rows:q('.dt-row, [role=row], li').length, empty:(q('.dt-empty')[0]||{}).textContent||null, truncated:cut, font_sizes:sizes, font_families:fam};})()`);
  report.push({ case: c.name, png: out, ready: ok, ...facts, errors: logs });
  console.log(`${ok ? 'ok ' : 'NOT READY'} ${c.name} -> ${out}${logs.length ? '  ' + logs.join(' | ') : ''}`);
}
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 1));
ws.close(); proc.kill(); server.close();
process.exit(0);

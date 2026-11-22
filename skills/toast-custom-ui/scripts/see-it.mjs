#!/usr/bin/env node
// see-it: picture what the user sees, through the Toast backend alone. It changes nothing.
//
//   node see-it.mjs desk [window ids...] [--out dir]  each desk window (card, pinned, wallpaper) as it draws now,
//                                                  covered or not. No ids = every window in interface config.
//   node see-it.mjs app [--out dir]                 the app window: whatever page it shows now (check "page")
//
// Prints one JSON line per picture: {surface, id?, page?, path, w, h, ok, reason?}.
// The window ids are interface(op=read).config.windows[].id.
//
// Routes (the same ones interface apply uses for its own pictures):
//   POST {PEEL_BASE_URL}/interface/preview/desk {ids}  -> windows[].jpeg_b64 (electron capturePage per window)
//   POST {PEEL_BASE_URL}/interface/preview {}          -> snapshot.png_b64 + snapshot_state.page
//   GET  {PEEL_BASE_URL}/interface                     -> config.windows
// PEEL_BASE_URL defaults to http://127.0.0.1:18587/api/v1. A backend with no desktop app answers
// "unavailable": there is nothing on a screen to picture; use piece-probe.mjs (headless) instead.
// Wallpaper windows are pictured from a hidden copy of their page (the app's own rule), so they show
// the layout, not the live desktop around them.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const outDir = resolve(outAt >= 0 ? args[outAt + 1] : 'shots');
const rest = args.filter((a, i) => i !== outAt && i !== outAt + 1);
const [what, ...ids] = rest;
const API = (process.env.PEEL_BASE_URL || 'http://127.0.0.1:18587/api/v1').replace(/\/$/, '');
// The backend's local API token: TOAST_API_TOKEN, else the api-token file in Toast's data folder.
// Older backends have none and ignore the header.
function apiToken() {
  if (process.env.TOAST_API_TOKEN) return process.env.TOAST_API_TOKEN.trim();
  const home = homedir();
  const dir = process.env.TOAST_DATA_DIR || (process.platform === 'win32'
    ? join(process.env.APPDATA || join(home, 'AppData', 'Roaming'), 'Toast')
    : process.platform === 'darwin' ? join(home, 'Library', 'Application Support', 'Toast')
    : join(process.env.XDG_DATA_HOME || join(home, '.local', 'share'), 'Toast'));
  try { return readFileSync(join(dir, 'api-token'), 'ascii').trim(); } catch { return ''; }
}
const token = apiToken();
const headers = { 'content-type': 'application/json', 'x-peel-pid': String(process.ppid || process.pid),
  ...(token ? { 'x-toast-token': token } : {}) };
mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
const say = (o) => console.log(JSON.stringify(o));

async function call(method, path, body) {
  const r = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${path} -> ${r.status}`);
  return r.json();
}

if (what === 'desk') {
  const config = (await call('GET', '/interface')).config || {};
  const windows = config.windows || [];
  const want = ids.length ? ids : windows.map((w) => w.id);
  if (!want.length) { say({ surface: 'desk', ok: false, reason: 'no desk windows in the interface config' }); process.exit(1); }
  const shot = await call('POST', '/interface/preview/desk', { ids: want });
  if (shot.unavailable || shot.refused) { say({ surface: 'desk', ok: false, reason: shot.unavailable || shot.refused }); process.exit(1); }
  const pages = Object.fromEntries(windows.map((w) => [w.id, w.page]));
  let bad = 0;
  for (const id of want) {
    const w = (shot.windows || []).find((x) => x.id === id) || { ok: false, reason: 'the app did not answer for it' };
    if (!w.ok || !w.jpeg_b64) { bad++; say({ surface: 'desk', id, page: pages[id], ok: false, reason: w.reason }); continue; }
    const path = join(outDir, `desk-${id}-${stamp}.jpg`);
    writeFileSync(path, Buffer.from(w.jpeg_b64, 'base64'));
    say({ surface: 'desk', id, page: pages[id], path, w: w.w, h: w.h, ok: true,
      ...(w.ready === false ? { settling: true } : {}), ...(w.from ? { from: w.from } : {}) });
  }
  process.exit(bad ? 1 : 0);
} else if (what === 'app') {
  const shot = await call('POST', '/interface/preview', {});
  const s = shot.snapshot;
  if (!s || !s.png_b64) { say({ surface: 'app', ok: false, reason: shot.snapshot_state?.unavailable || 'no picture' }); process.exit(1); }
  const path = join(outDir, `app-${stamp}.png`);
  writeFileSync(path, Buffer.from(s.png_b64, 'base64'));
  say({ surface: 'app', page: shot.snapshot_state?.page || s.route || null, path, ok: true });
} else {
  console.log('usage: node see-it.mjs desk [ids...] [--out dir] | node see-it.mjs app [--out dir]');
  process.exit(2);
}

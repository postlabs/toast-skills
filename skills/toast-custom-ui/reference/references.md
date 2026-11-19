# Outside libraries and references for widgets, pages and mini-apps

**Bottom line.** Every library below was loaded inside a real sealed frame on this PC
(18 of 18 pins load, light and dark: `shots/libprobe-light.png`, `shots/libprobe-dark.png`).
The probe family is in `libprobe/` so you can copy it. No session had ever used `js_deps` before
this one: the install-wide store `{user_data}/.state/jar-deps` did not exist until the probe ran.
Sessions have been hand-drawing SVG icons and system-ui text when a pinned icon set
and font were available.

---

## 1. Rules a pin must pass (from the source, not memory)

Sources: `backend/app/spreads/sealed.py`, `backend/app/artifacts/api/sealed.py`,
`backend/app/artifacts/loading/jsdeps.py`, `frontend/.../atoms/loader/pieces.md`,
`backend/app/cli/instructions/CHAT.md` §sealed atom.

| Rule | What it means for a session |
|---|---|
| `js_deps` is a **map** `import-name: name@x.y.z/path/to/file` | A list (`js_deps: []`, as in the doctor `specbars` draft) fails validation. Exact versions only, never `^` or `latest`. |
| Import name must match `^(@scope/)?name$` | `htm/preact` and `@floating-ui/utils/dom` are refused as keys. Use `htm-preact`, `lucide-umd` and similar. |
| The frame gets an **import map**: name → `/api/v1/sealed/d/<pin>/<file>` | The file must be **ESM** (or a UMD you import for its side effect, see below). Every bare import inside it needs its own `js_deps` key (chart.js → `@kurkle/color`; floating-ui/dom → `@floating-ui/core`). |
| `/sealed/d/` serves **any file in the package** | Relative imports and CSS `url()` fonts inside a package work. Extensionless relative imports (`./utils`, which dayjs's `esm/` uses) 404. |
| Tarball ≤ **64 MB** (`MAX_TARBALL_BYTES`) | `pretendard@1.3.9` is 70 MB and 404s. Use `@fontsource/pretendard` or `pretendard-std` instead. |
| Family files ≤ 2 MB, served suffixes `.js .mjs .css .json .png .svg .jpg .webp` | Vendor nothing into the family. Libraries go in `js_deps`. Fonts must come from a pinned package, since `.woff2` is not a served family suffix. |
| CSP: `default-src 'none'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: blob: <hosts>`, `connect-src <hosts or 'none'>`, `font-src 'self' data:` | No CDNs (unpkg, jsdelivr, Google Fonts) and no remote images unless `hosts` names them. Inline `<style>` is fine. Inline `<script>` and `eval` are not. |
| `hosts: []` → runs with no approval. Naming any host → the person approves **each version** | Default to no hosts. Pass images in `data` as data URIs or captured files. |
| `styles:` takes `name@x.y.z/file.css` list | It is loaded as `<link>` before the module. Use it for Radix colours, fonts and library CSS. |
| First use fetches the tarball (echarts is 12 MB) | The first draw on a new machine waits seconds. ESM lucide (about 2,100 files) took 6–9 s **on every cold load**, so use the UMD build. |
| `ctx.theme.reducedMotion` defaults to **true** in the frame bootstrap | Motion must check it. Animate only when it is false. |
| `ctx.theme.tokens` carries the app's `--bg-* / --text-* / --border-*` (neutral, brand, success, warning, danger, info) | Copy them onto `el` (`el.style.setProperty(k, v)`) so the atom follows the user's theme and skin. Use Radix scales only as the fallback: `var(--bg-neutral-base, var(--slate-1))`. |
| **App-window piece** (shadow root, trusted, `kind: piece`) | `hosts` does not apply there. `@font-face` inside a shadow stylesheet is unreliable in Chromium, so inherit the app font (Pretendard is already loaded) and don't pin one. Libraries that write to `document.head` (Tailwind browser, some tooltip libs) restyle the whole app: **frame only**. |

UMD trick (verified): `import 'motion-umd'` runs the UMD wrapper with `this === undefined`,
so it falls back to `globalThis`. Then read `globalThis.Motion`, `globalThis.lucide` or
`globalThis.dayjs`. This makes single-file UMD builds usable when the ESM build is a tree
of bare or extensionless imports.

### Canvas preview trap (found while testing, belongs to the failure audit)
`render(picture: true)` of a **tray-draft** sealed family shows "이 디자인이 설치되어 있지 않아요" ("this design isn't installed").
Cause: `foundation/atoms/sealed/atom.tsx:60` reads the conversation id from the closest
`[data-chat-id]`. The picture capture has none, so `chat=''` makes the consent call look only in the library
and it returns 404 (`/v1/sealed-consent` → 200 with `chat=<id>`, 404 without; checked with curl).
So the "blank / not installed until finalize" seen on Dev Tree is a capture bug, not a family bug.
**Workaround that works today:** load the frame headless and screenshot it with
`libprobe/probe_frame.mjs <frame url> <png> <json> [dark]`. Frame URL:
`http://atoms.localhost:<API_PORT>/api/v1/sealed/frame?jar=<handle.set>&family=<f>&atom=<a>&chat=<PEEL_CHAT_SESSION>`.
Change the data it posts to your own.

---

## 2. Vetted libraries with pin lines

All loaded in the probe frame (`libprobe/family.yaml`), checked against npm `latest` on 2026-11-19.
Load times are for a warm load. Paste a line under `js_deps:` or `styles:` as shown.

### Look: colour, type, base CSS
```yaml
styles:
  - "@radix-ui/colors@3.0.0/slate.css"          # 12-step neutral; also mauve/sage/olive/sand
  - "@radix-ui/colors@3.0.0/slate-dark.css"     # active under .dark / .dark-theme on <html>
  - "@radix-ui/colors@3.0.0/blue.css"           # one accent scale; pick 1 (blue, violet, grass, amber, tomato…)
  - "@radix-ui/colors@3.0.0/blue-dark.css"
  - "@fontsource/pretendard@5.3.0/400.css"      # family 'Pretendard', Hangul OK (frame only)
  - "@fontsource/pretendard@5.3.0/700.css"
  - "pretendard-std@1.3.9/dist/web/variable/pretendardvariable-std-dynamic-subset.css"  # 'Pretendard Std Variable', all weights
  - "@fontsource-variable/inter@5.3.0/wght.css"             # Latin-only UI alt
  - "@fontsource-variable/jetbrains-mono@5.3.0/index.css"   # code / figures
```
- **shadcn look without React:** `basecoat-css@1.1.0/dist/basecoat.cdn.min.css` (231 KB, shadcn
  tokens and classes in plain CSS). Copy shadcn's *values* (radius 0.5–0.75rem, 1px `--border`,
  muted foreground and ring) more than the whole sheet. In a frame, 231 KB is fine.
- Classless fallback: `@picocss/pico@2.1.1/css/pico.classless.min.css`. It looks generic, so use it for forms only.
- `open-props@1.7.23/open-props.min.css` gives easings, shadows and sizes as CSS vars, if you want ready tokens.
- `@tailwindcss/browser@4.3.5/dist/index.global.js` (js_deps, side-effect import) loads and
  compiles classes at runtime. **Frame only.** It costs 280 KB and a startup pass, so prefer plain CSS.

### Icons (TASTE T2: only search, close, pin, folder, file, plus content icons the user asked for)
```yaml
js_deps:
  lucide-umd: lucide@1.76.0/dist/umd/lucide.min.js   # import 'lucide-umd'; lucide.createElement(lucide.Calendar)
```
Don't use `lucide@1.76.0/dist/esm/lucide.mjs`: it loads, but makes about 2,100 requests and takes 6–9 s.
`lucide-static@1.76.0` has the same problem.
Alternatives: `@tabler/icons-webfont@3.52.0/dist/tabler-icons.min.css` (styles, icon font) or
`@phosphor-icons/web@2.1.2/src/regular/style.css` (styles). Both are untested in the frame and their fonts are woff2 from the package, so prove them first.
Brand logos: `simple-icons@16.38.0/index.mjs` is 5 MB. Copy the single path into the family instead.

### UI framework (only when state is real)
```yaml
js_deps:
  htm-preact: htm@3.1.1/preact/standalone.module.js   # { html, render, useState, useEffect } — 12 KB, no build
  petite-vue: petite-vue@0.4.1/dist/petite-vue.es.js  # 16 KB, v-scope on plain HTML
  lit-html: lit-html@3.3.3/lit-html.js                # 7 KB templates
```
Plain DOM is fine for most widgets. Use `htm-preact` once there are lists with state, tabs or forms.

### Charts
```yaml
js_deps:
  chart.js: chart.js@4.6.1/dist/chart.js
  "@kurkle/color": "@kurkle/color@0.3.4/dist/color.esm.js"   # required by chart.js; 0.3.x, not latest 0.6
  echarts: echarts@6.1.0/dist/echarts.esm.min.js              # 1.1 MB; init(el,null,{renderer:'svg'})
  uplot: uplot@1.6.32/dist/uPlot.esm.js                        # 142 KB, fastest time series
styles:
  - uplot@1.6.32/dist/uPlot.min.css
```
Pick by job: a **sparkline or KPI trend** uses inline SVG or uPlot. A **standard
line, bar or donut** uses Chart.js (`Chart.register(...registerables)`, `animation:false` when
reducedMotion). **Dense dashboards, heatmaps, treemaps, calendars or geo** use ECharts, with the svg renderer for crisp
screenshots. Follow the `dataviz` skill for colour and marks. Avoid `apexcharts@8.9.1`, which makes unmapped
template imports (`apexcharts/${module}`), and `frappe-charts`, which has had no release in years.

### Motion (TASTE T5: no drama; default is no motion)
Use motion only for state changes (open, reorder, refresh), 150–200 ms opacity or position changes, and skip it when `ctx.theme.reducedMotion`.
Count-up, confetti and hand-drawn highlights fail T5 in ordinary UI: they are proven to load, but use them only when the user asks for them.
```yaml
js_deps:
  motion-umd: motion@14.14.0/dist/motion.js        # import 'motion-umd'; Motion.animate(el,{opacity:[0,1]},{duration:.2})
  animejs: animejs@4.5.0/dist/modules/index.js     # { animate, stagger }
  countup.js: countup.js@2.10.1/dist/countUp.min.js  # { CountUp } for figures
  canvas-confetti: canvas-confetti@1.9.4/dist/confetti.module.mjs   # done / celebration only
  rough-notation: rough-notation@0.5.1/lib/rough-notation.esm.js     # hand-drawn highlight
```
`motion`'s ESM build (`dist/es/*`) imports `framer-motion` and `motion-dom` as bare packages, so use the UMD build.
`gsap@3.15.1/dist/gsap.min.js` is UMD and works the same way, but its licence is GreenSock's
"standard" licence, not MIT, so prefer Motion or anime.

### Behaviour helpers
```yaml
js_deps:
  "@floating-ui/dom": "@floating-ui/dom@1.8.0/dist/floating-ui.dom.browser.min.mjs"
  "@floating-ui/core": "@floating-ui/core@1.8.0/dist/floating-ui.core.browser.min.mjs"   # needed
  sortablejs: sortablejs@1.15.7/modular/sortable.esm.js     # drag reorder
  dayjs-umd: dayjs@1.11.23/dayjs.min.js                     # import 'dayjs-umd'; globalThis.dayjs (ESM build 404s)
  marked: marked@18.2.1/lib/marked.esm.js                   # markdown → HTML (sanitize your own input)
```
`tinykeys@4.0.1/dist/tinykeys.mjs` (keyboard shortcuts) has two relative imports and was not probed.
`@lottiefiles/dotlottie-web@0.83.2/dist/index.js` is a single ESM file but needs a WASM fetch, which is untested.

---

## 3. Reference gallery

Use these to borrow **decisions** (density, type scale, radius, accent use, motion), not pixels.

| Ref | Link | Borrow |
|---|---|---|
| Apple HIG: Widgets | https://developer.apple.com/design/human-interface-guidelines/widgets | One purpose per widget. Glanceable in about 2 s. Tap opens the app. Larger sizes add data, not new purposes. Content adapts to full-colour, tinted and clear appearances. |
| Windows widget design fundamentals | https://learn.microsoft.com/windows/apps/design/widgets/widgets-design-fundamentals | Three sizes, each designed rather than scaled. Large size has at most 3–4 touch targets. Spacing on a 4 px grid. Caption 12/16, body 14/20. Light and dark at WCAG AA. |
| Fluent 2 / Mica | https://fluent2.microsoft.design/ · https://learn.microsoft.com/windows/apps/design/style/mica | How a desktop surface sits on Windows 11: layered neutrals, a subtle 1 px stroke, an 8 px radius on windows and 4 px on controls. |
| Raycast | https://developers.raycast.com/api-reference/user-interface · https://www.raycast.com/blog/a-fresh-look-and-feel | Popouts: list, detail and action panel, keyboard first. Tight 4 px rhythm. Accessories (tags, dates) right-aligned in muted text. |
| Linear | https://linear.app/now/how-we-redesigned-the-linear-ui · https://linear.app/blog/behind-the-latest-design-refresh | Themes generated in LCH from a base, an accent and contrast. Low-chroma neutrals. Hierarchy from weight and opacity, not boxes. |
| Arc (The Browser Company) | https://arc.net | A sidebar as a home. Colour from the user's own space. Soft gradients and generous radius on a chrome-less window. |
| Notion | https://www.notion.so | Calm pages: one column, about 720 px max, big title, quiet blocks, emoji or icon as page identity, colour only in tags. |
| Vercel Geist | https://vercel.com/geist | Neutral-first system with a clear 10-step grey and a type scale. A good model for the "Toast native" default. |
| Radix Colors scale guide | https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale | What each of the 12 steps is for: 1–2 backgrounds, 3–5 components, 6–8 borders, 9–10 solid, 11–12 text. Use it to stop guessing colours. |
| shadcn/ui · Basecoat | https://ui.shadcn.com · https://basecoatui.com | Card, badge, tabs and command-menu proportions people already find slick. |
| Übersicht widget gallery | https://tracesof.net/uebersicht-widgets/ | Real desktop widgets on wallpaper, good and bad. Shows how type-only widgets read over photos. |
| Dribbble / Mobbin / Refero | https://dribbble.com/search/desktop-widget · https://mobbin.com · https://refero.design | Mood board sources. Dribbble for vibe (often impractical), Mobbin and Refero for real shipped screens. |
| ECharts examples | https://echarts.apache.org/examples | Pick a chart by its picture, then copy the option object. |
| Pretendard | https://github.com/orioncactus/pretendard | The app font. Weights 400/500/600/700. Use tabular numbers for figures. |

---

## 4. Per-surface patterns (scored against TASTE.md)

TASTE.md wins wherever it disagrees with a reference. The external guides use more type sizes
and more chrome than the user wants. Take their *structure* (one job, few targets, designed sizes),
not their type scale.

### Every surface
- **Frame first** (T1): a real window bar with icon, title (13 px, weight 600), pin and close. Under it, one toolbar row. Under that, the content.
- **Two sizes** (T3): 13 px body and 12 px meta. Weights 400 and 500 for names; 600 only for the window title. No hero figures and no 22–40 px titles.
  `font: inherit`; colours are `var(--text-neutral, …)`, `var(--bg-neutral-base, …)` and `var(--text-brand, …)`.
- **Words over glyphs** (T2): "Expand", "Open", "More" as text buttons. Icons only for search, close, pin, folder and file.
- **Less text** (T4): 877k, 1.5M. Exact values go in `title=`, and units are stated once in the header, not on every row.
- **No drama** (T5): no glows, share bars, delta chips or badges unless they carry the decision. One colour accent.
- **One surface** (T6): the window is the card. No inner bordered card, no header card.

### Widget (desk window `kind: card | pinned`, roughly 240–360 px wide)
- One job. Window bar, then a few 13 px rows (name 500, value 400 aligned right, tabular numbers). Readable in 2 s.
- 3–4 targets at most (Windows guidance). No scrollbars: show the top N and put "N more" as a word.
- On wallpaper (`kind: wallpaper`), use a 40–60 % neutral scrim behind the text, not a glow.
- Small and large sizes are designed separately: large adds rows, not bigger type.

### Page (`config.pages`)
- Page title in the window bar or toolbar, with no separate 24 px header block. Actions go as words on the toolbar row.
- Spreads first for records (`find(op=spreads)`). Use a sealed atom only for what no spread draws.
- One column of 680–760 px for reading. A grid only for peer items. Hierarchy from spacing (sections 24 px, rows 8 px) and weight, not borders.

### Dashboard
- Use a plain row of 3–4 numbers (12 px label over a 13 px/500 value) rather than tiles; colour only on a number that is off.
- One chart across the width, then tables. One chart library. Neutral series, with the accent on the series that matters (dataviz skill).

### Popout / command surface (Raycast structure)
- Search field, then 32 px rows: name (500) with a muted 12 px accessory on the right. Selection is a filled neutral row.
- Keyboard: ↑↓ Enter Esc. Don't show shortcut glyph strips. Put one line of words in the footer only if it is needed.

### Default look ("Toast native")
Inherit the app font and tokens (a piece) or copy `ctx.theme.tokens` onto `el` (a frame, with `@fontsource/pretendard`
as the font). One accent: the brand token. Radius from the host. 4 px spacing grid. 13 and 12 px only. No shadows inside
the window. Light and dark both checked.

---

## 5. "Choose a look": the procedure before building

1. **Name the surface and host** in one line: widget, page, dashboard or popout. Frame (canvas
   or sealed spread) or piece (app window). Which `kind` of window.
2. **Look at what the user already has:** their theme and skin (`interface op=read_theme`) and
   pages that already exist. A new piece must look like it belongs next to them.
3. **Check the spreads library first** (`find(op=spreads)` by form). Build a sealed atom only for the part no spread covers.
4. **Make a mood board of 2–3 refs** from §3. Add one more only if the user named a vibe. For each, write
   *what to borrow* in one line, for example "Raycast: list rows 34 px, muted accessories; Linear:
   low-chroma neutrals; Apple widget: one job". Then check each against TASTE.md: a reference never overrides it. Put the three lines in your plan or result so
   a reviewer can check the build against them.
5. **Ask, or decide.** Ask with AskUserQuestion when the piece is personal or decorative
   (widget look, wallpaper, theme), when the user named a vibe that two refs read differently,
   or when there is no theme signal at all. Give 2–3 options, each a ref plus a `preview`
   mockup (ASCII or a short spec), recommended first. Otherwise decide: use "Toast
   native" (§4) and say which refs you followed.
6. **Lock the tokens before writing code:** inherited font, one accent (brand), host radius, 4 px spacing,
   13/12 px only, and dark mode. Then write the pins from §2.
7. **Build, then see it.** Screenshot light and dark with `libprobe/probe_frame.mjs` for frames, or
   PrintWindow for desk windows. Compare against the mood board lines and the §4 surface
   checklist before showing the user (the see-it loop).

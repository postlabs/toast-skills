---
name: toast-custom-ui
description: Build or change something the person will look at in Toast, such as a desk widget, a page, a dashboard, a pop-out, a mini app, a sealed atom or a window, or changes the app's look (a theme, colours, corners, fonts, pictures, animation or a code skin), so it is right the first time. Use whenever the ask is to make, design, restyle or fix a UI surface on the user layer (interface pages, windows, pieces, spreads, sealed atoms). The method is to echo the ask, ask or default, reuse, pick a reference, build the frame first, look at the real surface, and score it before saying done.
---

# Custom UI in Toast: right the first time

Most awkward UI comes from three habits (failure audit, 85 cases):
- shipping without looking at the real surface (51 %);
- guessing taste alone (42 %);
- building new parts when the app already had them (25 %).

This skill replaces those habits with steps. Do them in order and skip none. Each step
leaves a line in your plan or result, so a reviewer can see it was done.

## 0. The user's taste: standing rules (they override every reference)

1. **Frame first.** A real window bar: icon, title, pin, close. Under it, one toolbar, then
   the content. Get the header right before polishing anything.
2. **Words over glyphs.** Write "Expand", "Collapse", "More" as text. Icons only for search, close,
   pin, folder and file. No chevron rows, grips or kebabs.
3. **Two type sizes.** 13 px body and 12 px meta. Weight 400, 500 for names, and 600 only for the window title.
   Use the app font: `font: inherit` in a piece, and Pretendard pinned in a frame (§5). The one exception
   is one display figure when it is the widget's whole job (a clock, one count, a metric spread's headline):
   one number, weight 400, at most 40 px. Every other line stays 13/12.
4. **Less text.** Use 877k and 1.5M; exact values go in `title=`. State a unit once, not on every row.
   Detail goes on hover or in a menu.
5. **No drama.** No glows, gradients, share bars, extra chips or badges unless they carry the
   decision. Colour goes on one thing (the brand), with warning colour only where something is wrong.
6. **One surface.** Never a card inside a card. A widget's window *is* the card.
7. **Keep what works.** Behaviour the user approved stays: right-click, cache, refresh on open.

## 1. Echo the ask as checkpoints

Restate every point of the request as a numbered checkpoint, using the user's words:
"small", "one list", "like the chat pop-out", "wallpaper = a Toast window". Report against each point at the
end. A point you drop or change is said, never silent. Misreads were 22 % of failures.

## 2. Ask, or state the default

Ask with **one** AskUserQuestion card (≤ 4 questions, recommended option first, each option a
concrete thing, never "what style do you like?") when:
- the purpose is unclear;
- it replaces something they have (a page, the menu, a skin);
- it changes a look they chose;
- it adds actions that reach outside the PC;
- or it is personal or decorative (widget look, wallpaper) with no reference given.

The questions worth asking:
1. What it is for: glance at it (widget), work in it (page), or be told (alert, no window).
2. Where it lives: desk card 380×520, pinned, wallpaper, a sidebar page, or the canvas.
3. The look: 2–3 options, each one a reference. Use "like the app's own panels (recommended)", a named
   spread, or the site or picture they name, with a `preview` mockup drawn from real components.
4. The data and freshness, only when the source is not obvious.

**Don't ask** when the request already answers it, when it is a revision of something they saw, or when
the user is away. Take the defaults instead and say them in the result:
- the app look and stock tokens;
- a `card` window at 380×520;
- refresh on open;
- the nearest existing app pattern.

Two defaults are never English by accident:
- **Copy language** is the app's UI language (Korean on this user's Toast). Dates and times use that
  locale (`toLocaleDateString('ko-KR', …)`), not `en-GB`.
- **Place-bound data** (weather, time zone, transit) uses the user's saved place when one exists. Otherwise
  pick one and name it in the first line of the result.

The request to *make* the thing is the go to add it, since a new window or page is reversible. The interface
guide's ask-before-change covers the list above: replacing or restyling what they already have.

Only the owner approves taste. A coordinator's answer is not theirs.

## 3. Reuse first: the spreads library, then code

Load `toast-spread-composing`. Search `find(op=spreads)` by **form**, in the user's intent words.
Each recipe below is proven, with a shot, and is the #1 hit for its query
(`reference/spread-recipes.md` has the full slots and values):

| Intent | Spread | Find query | Watch |
|---|---|---|---|
| Widget: one number | `postlab.sp-803ff7ed20ec444abdef6022f9fd53a2` metric | `a single number given the whole card` | Draws its own border, so in a card window use progress_ring `postlab.sp-ac0b7d1cbda84ff4949e5e15cb3410b8`. Leave `delta` off the value. |
| Dashboard | `postlab.sp-18f46dcb12e24ee2a3b27a9cb55d83da` metric_ribbon + `postlab.sp-a9c405bacb604c438682c14a9fc5bb78` trend | `open metric strip` · `values measured over time line chart` | 3 items. `tone: brand`. `mode: line` for a reference line. `title` is a field key. |
| Tracker / habit | `postlab.sp-f67214017a2d418f8e7edd7c272aed8a` calendar_heatmap | `day-by-day activity calendar` | `days: [{date, value}]`, `weekStart: mon`, and `monthLabels: false` for spans under 6 months. |
| To-do / checklist | `postlab.sp-327f35e24cd54ab9bcefe4be07d7fb01` task_list | `checkable to-do list` | Done rows go in `doneItems`. `priority: null`. Short due words. |
| Today's schedule | `postlab.sp-3d99b91b2c71422b9062ba3b3e828a7e` day_timeline | `hourly calendar timetable` | `knobs.view: calendar` in narrow cards. Trim with `hourStart`/`hourEnd`. |

**Check the frontend manual before you write any atom, prop or action.** It is generated from the
running app, so it is the truth when this skill and the app disagree:
`GET http://127.0.0.1:18587/api/v1/contract/frontend?section=index` lists the components, then
`?section=components&name=<name>` gives one component's props and actions. Don't use a prop or action
the manual doesn't list. If the route answers 503, the backend is missing its generated contract.
Say so; don't guess around it.

Don't use kpis or watchlist in a widget: they break rules 5 and 6. Write a sealed atom only for the
part no spread draws, and say why in one line. Never build a second token system, engine or
hand-made mockup.

## 4. Pick the reference before building

Write three lines in your plan, each a reference and *what to borrow* from it:
- **The nearest app surface** always comes first: the chat pop-out header for a window bar, the subquest
  card, QuestSessionPill, the user's own pages. A new piece must look like it belongs next to them.
- One or two outside references, from `reference/references.md` §3:
  - Apple and Windows widget guides: one job, ≤ 3–4 targets, sizes designed separately;
  - Raycast: 32 px list rows, muted accessory on the right, keyboard first;
  - Linear: low-chroma neutrals, hierarchy from weight rather than boxes;
  - Notion: a calm single column.

  Borrow structure, never their type scale: rule 3 wins.
- If the user named a picture, site or app, it replaces the outside references.

## 5. Build: frame, then tokens, then content

- **Frame.** Open or change one window with `patch.add_windows: [{id, page, kind, ...}]`; on an id that exists it keeps the fields you leave out, so flipping `kind` or `on_top` never moves it. `remove_windows` closes ids. Never resend the whole `windows` list for one window.
- **Frame.** Choose the window kind (`card`, `pinned`, `wallpaper`, `normal`). Card windows get a
  real bar (icon, title, pin, close). Use it, and never ship a grip strip; if the build lacks it, say so. Build and check the bar before any row.
- **Block kind decides whether the user must approve before anything shows.** A `kind: piece` block runs trusted
  app code. It shows "창 보기" (open window) as a placeholder until the user approves that code, so you cannot see it live until they do.
  If the atom needs no app access (no `navigate` or `refresh` action), draw it through the `sealed` spread
  `postlab.sp-8a0c3270532b4db68ece64c763b209c7` in a `kind: spread` block instead. That is a frame, and with `hosts: []`
  it runs without approval (the backend approves a family with no `hosts` by itself). This is not yet proven on a desk card, so capture it.
  If it must be a piece, say in the first line of the result that their approval is needed, and score
  `interface(op=preview, piece=…)` shots in the meantime.
- **Tokens.** Read the worn values with `interface(op=skin_values, prefix="--text-")` (or `GET /api/v1/interface/skin-values`); it also names the font. Start with the core set and stay in it: colours are `var(--bg-neutral-base, …)`, `var(--text-neutral, …)`, `var(--text-brand, …)`,
  `var(--border-neutral, …)`. Hex appears only as a `var()` fallback, and the fallbacks must work on light *and* dark.
  In a sealed frame, copy `ctx.theme.tokens` onto `el` (`el.style.setProperty(k, v)`).
- **Sealed atom rules** (from source; full list in `reference/references.md` §1):
  - `js_deps` is a **map** `name: pkg@x.y.z/file`, with exact versions. Keys are `^(@scope/)?name$` only.
  - Every bare import inside a library needs its own key (chart.js → `@kurkle/color@0.3.4`).
  - No CDN, no remote font, and no remote image unless `hosts` names it (that triggers per-version approval). Keep `hosts: []`.
  - Tarballs must be ≤ 64 MB, so the `pretendard` npm package fails. Use `@fontsource/pretendard@5.3.0/400.css` in `styles`.
  - The ESM builds of lucide, Motion and dayjs are slow or broken: import their UMD file and read `globalThis.X`.
  - `ctx.theme.reducedMotion` defaults to true. Animate only state changes, for 150–200 ms, and only when it is false.
  - In an app-window piece, inherit the font; libraries that write to `document.head` restyle the whole app.
- **Proven pins**, copied from `reference/references.md` §2: Radix colours, lucide UMD, htm-preact, Chart.js, ECharts,
  uPlot, Motion UMD, floating-ui.
- **Content** is built last, at two type sizes, with short numbers, words for actions, and one accent.

## 6. Look at the real surface, in every state

Capture what the user will see. A shot of a different surface does not count. Every capture below goes
through the Toast backend (peel tools or its local HTTP API at `PEEL_BASE_URL`, default
`http://127.0.0.1:18587/api/v1`): no Toast source checkout, no OS screenshot, nothing changed.

| Surface | Capture |
|---|---|
| Desk window (card, pinned, wallpaper) | `interface(op=apply)` already returns a small `desk_pictures` JPEG for every window it touched. To score it, call `interface(op=preview, windows=[id], full=true)`: a PNG at the window's own device pixels, with 1 px borders and type sizes intact (older backends: `node scripts/see-it.mjs desk [ids]`). It shows each window's own page as it draws now, even when covered; the ids are `config.windows[].id`. A wallpaper is pictured from a copy of its page. |
| App window | `interface(op=preview, windows=["app"], full=true)` (older backends: `interface(op=preview)` or `node scripts/see-it.mjs app`). It shows whatever page the window shows now (`page=` is ignored), so check `snapshot_state.page` / `page` before scoring. To see your page, put it in a desk window and use `see-it.mjs desk`. |
| App-window piece, before approval | `interface(op=preview, piece={jar, family, atom, data, width, height?})` draws it alone in a sandbox with no network, approved or not, for you only. It returns the PNG, errors, console and the action calls it made (recorded, not run). Use it for every state's data. It approves nothing and the person never sees it. |
| App-window piece, any skin | `node scripts/piece-probe.mjs cases.json` draws it headless (Edge or Chrome), with the skins' tokens (`reference/skin-tokens.css`) and Pretendard served by the backend. Skins: `classic` (light), `nocturne` (dark), `office`, `pastel`, `sage`, `sunset`, `rpg`, `rpg-paper`; there is no `default`. If its report says `font: fallback`, the backend did not answer: do not score R3 from it. |
| Canvas pane (spread) | `render(..., picture: true)`. The receipt's `instance_keys` shows what each instance read: if your data's keys are missing, the binding is wrong. A canvas pane adds a card frame a desk window does not, so judge a window only by its desk picture. |
| Sealed atom draft | `render(..., picture: true)` draws this conversation's draft families. Older backends say "not installed"; there, load the frame headless with `scripts/probe_frame.mjs <frame url> <png> <json> [dark]` and post your own data. The frame URL is the backend's `http://atoms.localhost:<port>/api/v1/sealed/frame?jar=…&family=…&atom=…&chat=…`. |
| No desktop app (a backend on its own) | Nothing is on a screen, so `see-it.mjs` answers `unavailable`. Score the `piece-probe.mjs` and `render` pictures, and say in the result that the live window is not seen. |

Capture these states: default, hover or selected, 1 / 3 / 8+ items, the longest real name, empty, loading and error,
light and dark, Korean and English if both ship. Crop and enlarge the header, a row and the corners 2×. Never score a
blank capture (`verdict: blank`); retry with a wait.

## 7. Compare: score before saying done

1. `python scripts/ui-lint.py <atom.js | folder>` checks the code against the taste rules (T1–T7) and the rubric. It exits 1 on a major.
2. `python scripts/shot-check.py <shot.png>` measures the capture: surface bands (card in a card), insets and right edges.
3. Score the rubric from `reference/see-it-loop.md` §2, one line each with its evidence:
   R1 window chrome, R2 hierarchy, R3 app font, R4 tokens, R5 one surface, R6 spacing, R7 alignment,
   R8 overlap, R9 truncation, R10 empty/loading/error, R11 contrast, R12 light and dark, R13 icon meaning,
   R14 copy, R15 fits the place.
4. Put the capture beside the §4 references and ask: does it look like it belongs next to the app's own surface?

**Any blocker or major means you fix it and capture again.** "Not yet seen running" means not done.

## 8. Report

The result names:
- the final capture file(s);
- each checkpoint from §1 with ✓ or what changed;
- the defaults taken (§2) and the references followed (§4);
- any rubric line left "not seen", and why.

Keep it short: the picture carries it.

## 9. Looks: themes, pictures, skins and motion

A look changes **how the whole app reads**, not one surface. The same steps apply (echo, ask, reuse,
reference, build, look, score), with three differences: the level comes first, the user always
approves before it is worn, and everything you built before must still read under it.

### 9.1 Name the level first (the smallest that says the ask)

| Level | Says | Ask → level |
|---|---|---|
| **Bundled** | Wear a look that ships: `{"skin": id}` for colours only, `{"theme": x, "skin": x}` for rpg/office pieces and art | "make it dark" → `nocturne` · "something warmer" → `sunset` or `pastel` · "game-like" → `rpg` · "like Office" → `office` |
| **A values** | A `version: 2` data-only theme: colour, corners, spacing, type, motion | "my brand green" · "rounder corners" · "calmer, less motion" · "use this font" |
| **B images** | Image slots and border frames over stock surfaces | "my photo in the header" · "frame the boards with that art" |
| **E code** | A skin package: trusted TSX replacing registered components | "redraw the sidebar as a ship's log" · "an animated scene" · anything no token or slot can say |

Rules:
- Try **bundled** before A, and A before E. A request for colour is never a code skin.
- **Motion is level A.** `motion` holds six named targets: `hover`, `dockOpen`, `dockClose`,
  `scrollUnfold`, `questDraw` and `sparkle`. A moving scene beyond those is level E (rpg's `questScene`).
- A look for **one page** goes on that page's own `theme`/`skin` fields, not the app's.
- Your own widgets follow a look **only through tokens**. A hex outside a `var()` fallback is a bug that
  shows the first time the user changes skin (`ui-lint.py` R4).

### 9.2 Ask (always) — one card

Every look change asks first, even a follow-up in the same chat. One AskUserQuestion card holds:
- the **level** and, for E, that it is **code** needing their approval in a Toast dialog;
- **what changes**, in their words, and **what stays** (layout, pages, widgets, data);
- **how it is undone**: the earlier skin or theme is selected again (today `skin: null`). Use `undo` or
  `restore` only when read's `undoScope` says the whole UI is retained (it says `arrangement_only` now);
- 2–3 options, each a real look, with a `preview` drawn from `piece-probe` shots (§9.4). Recommend a bundled skin
  when one is close.

Never apply, install a theme that is worn, or install a skin before the answer. A coordinator's yes is not theirs.

### 9.3 Build

**Bundled.** Pick from `schema.skins`: `classic` (light, stock), `nocturne` (dark), `sunset`, `pastel`,
`sage`, `rpg`, `rpg-paper` and `office`. Nothing to build.

**A values**. Use `reference/look-recipes.md` §2 (examples in `examples/`) for exact shapes.
- **Changing a hue: use `seeds.colour`, not tokens.** Seeds rebuild the whole family: fills, soft text,
  borders, ramps and the `--brand-50…900` rungs. A few brand tokens leave the soft variants on the old hue:
  icons and tints stay purple. `seeds.colour.chromatic` needs **all seven tones** (brand, danger, warning,
  success, secondary, info, question); copy the base set's hues and change one.
- **Tokens** are for single values beside the seeds: corners (`--radius-card`, `--radius-control`),
  spacing rungs, `--type-family-sans`. Tokens next to seeds win.
- A theme is one scheme. `seeds.from: classic` is light and `nocturne` is dark. A user who wants both
  gets two themes, and the ask says so.
- **Motion** (TASTE rule 5 for movement): animate state changes only. Hover takes 120–150 ms, open and unfold
  160–200 ms, `ease-out` in and `ease-in` out. `sparkle` and `questDraw` are `"off"` unless asked. No
  `bouncy` preset and nothing over 300 ms unless the user asks by name. Stock is slower (dock 340 ms,
  unfold 650 ms, sparkle 2.6 s): leave stock alone unless the ask is about motion. The app already zeroes
  every target under the OS's reduced-motion setting; your own atoms check `ctx.theme.reducedMotion`. **validate does not police durations or fonts**: you do.

**B images.** Use embedded data URLs only (png, webp or jpeg; ≤ 4096 px edge, ≤ 6 MB). `base: "$worn"` keeps the worn look's
pieces. Frames slice the slot image (`frames.board: {slice, width}`), or borrow rpg's art with an asset
binding (`schema.skin_images`). Dark art needs light text: the frame check refuses unreadable text.

**E code.** Follow `skin(op=guide)` and `skin(op=contract)`.
- Fork `office` for 1–2 components and `rpg` for many. Delete every copied component you don't replace.
- Only registered component names apply. One authored skin is active at a time, so put everything the user wants in one package.
- An `appLayout` must call `docks(lanes)`, or the ask dock disappears.
- `build` compiles; `install` waits for the user's code approval in Toast. Tell them to look for the dialog.

### 9.4 Look before it is worn

`interface(op=preview)` cannot show an unworn theme, and `validate` draws nothing. So:

| What | How it is seen before wearing |
|---|---|
| Your widget under every bundled skin | `piece-probe.mjs` cases with `"skin": <id>` |
| Your widget under an A theme's **tokens** | the same cases with `"look": "<theme>.json"`, which lays the package's tokens on `:root` over the skin |
| An A theme's **values**, seeds included | `interface(op=skin_values, theme=<package>, core=true)` (or `file=`) builds what the package would give, without saving or wearing it: the core values and text-on-background contrast ratios. Older backends lack it; there, say "not seen" for the hue. |
| An A theme's **seeds**, pictured | not seeable yet: the probe does not run the colour engine. Check the values above, and say the hue is not seen in a picture. |
| Spreads under a look | `render(picture: true)` shows the **worn** look only |
| B images, E skins | only after wearing: `apply`/`skin install` return a picture. That is why the ask comes first. |

Validate with `interface(op=validate)` and the same arguments as the apply, `points` included. Read
`issues` (legibility ratios and unpublished tokens are refused with the reason) and `revisionWarnings`.

### 9.5 Score the look

Run the §7 rubric on probe shots of **the user's own pages and widgets** under the new look, not only on
a stock screen. Then check three lines just for looks:
- **L1 reach.** Every accent moved, including icons, soft text and tints. If anything kept the old hue, the
  look was set by tokens where seeds were needed.
- **L2 legibility.** The text on brand fills and on images reads at ≥ 4.5:1 (validate states ratios).
- **L3 motion.** Each animated target is listed with its duration, and none is idle or looping.

Report it as in §8, plus the level, the theme or skin id, and what was "not seen" (always the seeds hue and
any B/E surface until it is worn).

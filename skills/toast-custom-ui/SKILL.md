---
name: toast-custom-ui
description: Build or change something the person will look at in Toast, such as a desk widget, a page, a dashboard, a pop-out, a mini app, a sealed atom or a window, so it is right the first time. Use whenever the ask is to make, design, restyle or fix a UI surface on the user layer (interface pages, windows, pieces, spreads, sealed atoms). The method is to echo the ask, ask or default, reuse, pick a reference, build the frame first, look at the real surface, and score it before saying done.
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

- **Frame.** Choose the window kind (`card`, `pinned`, `wallpaper`, `normal`). Card windows get a
  real bar (icon, title, pin, close). Use it, and never ship a grip strip; if the build lacks it, say so. Build and check the bar before any row.
- **Block kind decides whether the user must approve before anything shows.** A `kind: piece` block runs trusted
  app code. It shows "창 보기" (open window) as a placeholder until the user approves that code, so you cannot see it live until they do.
  If the atom needs no app access (no `navigate` or `refresh` action), draw it through the `sealed` spread
  `postlab.sp-8a0c3270532b4db68ece64c763b209c7` in a `kind: spread` block instead. That is a frame, and with `hosts: []`
  it runs without approval (`api/sealed.py _is_approved`). This is not yet proven on a desk card, so capture it.
  If it must be a piece, say in the first line of the result that their approval is needed, and score the
  headless `scripts/piece-probe.mjs` shots in the meantime.
- **Tokens.** Colours are `var(--bg-neutral-base, …)`, `var(--text-neutral, …)`, `var(--text-brand, …)`,
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

Capture what the user will see. A shot of a different surface does not count.

| Surface | Capture |
|---|---|
| Desk window (card, pinned, wallpaper) or the app window | `scripts/see-it.ps1 -DipBounds "<x,y,w,h>"` uses PrintWindow and works even when the window is covered. Take the bounds from `interface(op=read).desktop.open[]` **after** apply, not from your patch: a content-sized card changes its height. A size miss falls back to the corner, and a miss lists the Toast windows. Every Toast window is titled "Toast", so match by bounds or `-Hwnd`. |
| App-window piece, any skin or state | `node scripts/piece-probe.mjs cases.json` draws it headless with the app's own tokens and font. Skins: `classic` (light), `nocturne` (dark), `office`, `pastel`, `sage`, `sunset`, `rpg`, `rpg-paper`. There is no `default`. |
| App page | `interface(op=preview)`. Its `page=` is ignored, so check `snapshot_state.page` before scoring. If it shows another page, open yours in a window and use `scripts/see-it.ps1`. |
| Canvas pane (spread) | `render(..., picture: true)` |
| Sealed atom draft | The canvas picture wrongly says "not installed" (the capture has no chat id). Load the frame headless with `scripts/probe_frame.mjs <frame url> <png> <json> [dark]` and post your own data. |

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

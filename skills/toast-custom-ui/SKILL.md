---
name: toast-custom-ui
description: Build or change something the person will look at in Toast, such as a desk widget, a page, a dashboard, a pop-out, a mini app, a sealed atom or a window, or changes the app's look (colours, type, corners, pictures, motion or redrawn parts, packaged as one look), so it is right the first time. Use whenever the ask is to make, design, restyle or fix a UI surface on the user layer (interface pages, windows, pieces, spreads, sealed atoms). The method is to echo the ask, ask or default, reuse, pick a reference, build the frame first, look at the real surface, and score it before saying done.
---

# Custom UI in Toast: right the first time

Most awkward UI comes from three habits (failure audit, 85 cases):
- shipping without looking at the real surface (51 %);
- guessing taste alone (42 %);
- building new parts when the app already had them (25 %).

This skill replaces those habits with steps. Do them in order and skip none. Each step
leaves a line in your plan or result, so a reviewer can see it was done.

## 0. The user's taste: standing rules (they override every reference)

1. **Frame first.** A real window bar: icon, title, pin, close. A desk card's host bar draws these; the icon is the
   page's menu `icon` (dev-hj 63084d9611 and later; older builds show none). Under it, one toolbar, then the content. Get the header right before polishing anything.
2. **Words over glyphs.** Write "Expand", "Collapse", "More" as text. Icons only for search, close,
   pin, folder and file. No chevron rows, grips or kebabs.
3. **Two type sizes.** 13 px body and 12 px meta. Weight 400, 500 for names, and 600 only for the window title.
   Use the worn look's font (Pretendard unless the look changes it): `font: inherit` in a piece; in a frame, which cannot inherit, `font-family: var(--type-family-sans, Pretendard, system-ui, sans-serif)` with Pretendard loaded (§5). The one exception
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
- it replaces something they have (a page, the menu, their look);
- it changes a look they chose;
- it adds actions that reach outside the PC;
- it is decorative, meaning its look is the point (wallpaper, an ornament), with no reference given. A widget
  with a clear job (a count, a list, a converter) is not decorative: build it with the defaults;
- or the data is unknown and no source is obvious (whose stocks, which account, which list).

The questions worth asking:
1. What it is for: glance at it (widget), work in it (page), or be told (alert, no window).
2. Where it lives: desk card 380×520, pinned, wallpaper, a sidebar page, or the canvas.
3. The look: 2–3 options, each one a reference. Use "like the app's own panels (recommended)", a named
   spread, or the site or picture they name, with a `preview` mockup drawn from real components.
4. The data and freshness, only when the source is not obvious.

When the card offers looks or layouts, do §3 (reuse) before it, so each option can show a real picture.

**A look or layout option's `preview` is a picture**; other options (which stocks, how often) need none. Capture it
first (§6, `piece=`, a probe shot or `render(picture)`), copy the PNG into the chat's own tray folder (a `render` picture
sits under `tool-results` at a path too long for Windows: copy it to a short path first), and put that **absolute path**,
or a `data:` image, as the option's `preview`. Toast draws it
in a 240×150 frame above the label. It draws nothing else: text, markdown or a path outside the tray is
ignored. A picture-less option says only what it is.

**Don't ask** when the request already answers it, when it is a revision of something they saw, or when
the user is away. Take the defaults instead and say them in the result:
- the app look and stock tokens;
- a `card` window at 380×520. When they say "small", or it shows one figure, use `place` 300×200 (the card takes its
  content's height up to that);
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
| Widget: one number | `postlab.sp-803ff7ed20ec444abdef6022f9fd53a2` metric | `a single number given the whole card` | Draws its own border (R5 in a card) and progress_ring `postlab.sp-ac0b7d1cbda84ff4949e5e15cb3410b8` is ≈ 50 px with no size knob (R15). In a small card neither fits yet: write a small sealed atom (one figure, one label) and say why. On a page, metric is fine. Leave `delta` off. |
| Page: stocks I watch | `postlab.sp-5fbb84ffc9824d039a84a28448f0405b` watchlist | `stock watchlist with price and daily change` | Pages only. Feed: a quote dough (Naver Finance for KRX codes, Yahoo for others); ask which stocks when no list or account is known. |
| Dashboard | `postlab.sp-18f46dcb12e24ee2a3b27a9cb55d83da` metric_ribbon + `postlab.sp-a9c405bacb604c438682c14a9fc5bb78` trend | `open metric strip` · `values measured over time line chart` | 3 items. `tone: brand`. `mode: line` for a reference line. `title` is a field key. |
| Tracker / habit | `postlab.sp-f67214017a2d418f8e7edd7c272aed8a` calendar_heatmap | `day-by-day activity calendar` | `days: [{date, value}]`, `weekStart: mon`, and `monthLabels: false` for spans under 6 months. |
| To-do / checklist | `postlab.sp-327f35e24cd54ab9bcefe4be07d7fb01` task_list | `checkable to-do list` | Done rows go in `doneItems`. `priority: null`. Short due words. |
| Today's schedule | `postlab.sp-3d99b91b2c71422b9062ba3b3e828a7e` day_timeline | `hourly calendar timetable` | `knobs.view: calendar` in narrow cards. Trim with `hourStart`/`hourEnd`. |

**Check the frontend manual before you write any atom, prop or action.** It is generated from the
running app, so it is the truth when this skill and the app disagree:
`GET http://127.0.0.1:18587/api/v1/contract/frontend?section=index` lists the components, then
`?section=components&name=<name>` gives one component's props and actions. Don't use a prop or action
the manual doesn't list. Send `X-Toast-Token: $TOAST_API_TOKEN` with it. If the route answers 503, the backend is missing its generated contract.
Say so; don't guess around it.

Don't use kpis or watchlist in a small widget: they break rules 5 and 6. On a page they are fine. Write a sealed atom only for the
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
  it runs without approval (the backend approves a family with no `hosts` by itself).
  A family still in your tray is a draft: its block needs `chat: <read's caller.chat>` to find it, and the page then lives
  only as long as that chat. Say so in the result until the family is published.
  If it must be a piece, say in the first line of the result that their approval is needed, and score
  `interface(op=preview, piece=…)` shots in the meantime.
- **Tokens.** Read the worn look's values with `interface(op=skin_values, prefix="--text-")` (or `GET /api/v1/interface/skin-values`); it also names the font. `core=true` returns the core set only, without `--text-neutral-muted`; read with a prefix to get it. Start with the core set and stay in it. Secondary and meta text is `--text-neutral-muted`; `--text-neutral-soft` fails contrast under every light look, so use it only for a placeholder, never for body or meta text, and never put muted text on a tinted fill. Colours are `var(--bg-neutral-base, …)`, `var(--text-neutral, …)`, `var(--text-brand, …)`,
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
Every `/api/` call sends `X-Toast-Token: $TOAST_API_TOKEN` (outside a Toast session, the token is the file `api-token` in Toast's data folder); `/health` and the sealed routes need none.

Pick the capture for your surface from `reference/capture.md`: desk window, app window, piece (before approval or
under any look), canvas pane, sealed draft, or no desktop app.

Capture these states: default, hover or selected, 1 / 3 / 8+ items, the longest real name, empty, loading and error,
light and dark, Korean and English if both ship. Crop and enlarge the header, a row and the corners 2×. Never score a
blank capture (`verdict: blank`); retry with a wait.

## 7. Compare: score before saying done

1. `python scripts/ui-lint.py <atom.js | folder>` checks the code against the taste rules (T1–T7) and the rubric. It exits 1 on a major.
2. `python scripts/shot-check.py <shot.png>` measures the capture: surface bands (card in a card), insets and right edges.
3. Score the rubric from `reference/see-it-loop.md` §2, one line each with its evidence:
   R1 window chrome, R2 hierarchy, R3 app font, R4 tokens, R5 one surface, R6 spacing, R7 alignment,
   R8 overlap, R9 truncation, R10 empty/loading/error, R11 contrast, R12 light and dark, R13 icon meaning,
   R14 copy, R15 fits the place, R16 less text, R17 no drama.
4. Put the capture beside the §4 references and ask: does it look like it belongs next to the app's own surface?

**Any blocker or major means you fix it and capture again.** "Not yet seen running" means not done.

## 8. Report

The result names:
- the final capture file(s);
- each checkpoint from §1 with ✓ or what changed;
- the defaults taken (§2) and the references followed (§4);
- any rubric line left "not seen", and why.

Keep it short: the picture carries it.

## 9. Looks

To the person, a look is one thing: how the app reads. Underneath, a look is **one package of layers**:

| Layer | Holds |
|---|---|
| values | colour, type, spacing, corners |
| images | pictures and frames over the app's surfaces |
| motion | how hover, docks, unfold, quest draw and sparkle move |
| code (optional) | redrawn parts |
| interface changes | a page, a menu entry or a window that comes with it |

**A look fills the layers it needs, and every other layer comes from the look underneath.** It is packaging, not a new
system: build each layer the way this skill already says, then name the bundle, ask for it on one card, and give it one way back.
On the card and in the result there is only "a look", never "theme" or "skin".

There are 8 shipped looks: `nocturne` (dark, stock), `classic` (light), `sunset`, `pastel`, `sage`, `rpg`, `rpg-paper` and `office`.
`rpg` and `office` bring their own art and parts. rpg's art is painted, not pixel art.

From §1–8, a look keeps: echo (§1), the ask (§2, done as §9.2), look (§6) and score (§7, through §9.5). It skips the widget
steps: spread reuse (§3), the frame and 380×520 defaults (§5) and R1 window chrome. What a look adds: you choose the layers
first, the person approves before it is worn, and everything built before must still read under it.

### 9.1–9.6 in short (the full rules: `reference/looks.md`)

1. **Fill as few layers as the ask needs.** Start from a shipped look. "warmer" means the light looks; "warm and dark" means
   nocturne plus a warm accent seed and hand-set neutrals. Motion that isn't one of the six (hover, dock open/close,
   unfold, quest draw, sparkle) belongs to a widget, not a look. A one-page look holds values and images only, because code
   is app-wide.
2. **Ask every time, with one card**: what changes, what stays, whether it carries code, and how to go back (from `undoScope`
   read just now), with 2–3 whole looks, each with a `preview`. Nothing is worn before the answer.
3. **Build each layer.**
   - Accents go through seeds (all seven tones); surfaces and text are hand-set, as one set, each ≥ 4.5:1.
   - Motion is state changes only, ≤ 300 ms, including a celebration. A loop is allowed only while bound to a working state.
   - Images are embedded data URLs.
   - Code is a fork with every unused part deleted; install only after the yes.
4. **See it before it is worn.** Read the revision just before validate and before apply, then validate the whole look. Previews:
   piece-probe under the look, a labelled "approximate colour" for seeds, and a "not yet worn" frame sheet for art and code.
5. **Score**: the §7 rubric on the person's own surfaces, plus L1 reach, L2 legibility and L3 motion.
6. **Packaging**: today's calls still say theme and skin. Those names are for you only (`look-recipes.md` §6).

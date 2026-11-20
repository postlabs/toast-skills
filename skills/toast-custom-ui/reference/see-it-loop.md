# See-it loop — catch your own UI flaws before the user does

The loop, for any session that builds or changes a page, widget, window or pane:

```
ASK (only if needed) → BUILD → CAPTURE → SCORE against the rubric → FIX → CAPTURE again
```

Ship only when a fresh capture scores no **blocker** and no **major**. Put the final
capture in the result (the user should be able to see what you saw).
Taste comes from **TASTE.md** (the user's own rules T1–T7); the rubric below carries them.

## Run it (backend only)

```sh
S=<this skill folder>/scripts
# 1. picture the real surface: every desk window, or the ids you name (config.windows[].id)
node $S/see-it.mjs desk dev-tree --out shots
# 2. measure it and lint the code; each exits 1 on a major or a flag
python $S/shot-check.py shots/desk-dev-tree-<stamp>.jpg
python $S/ui-lint.py <your atom.js or folder>
# 3. states and looks the live window cannot show: headless, with the looks' values and the backend's font
node $S/piece-probe.mjs cases.json
# 4. open the pictures (Read tool), crop + 2x the bar, a row and the corners, score R1-R17 below
```

Everything goes through the Toast backend (`PEEL_BASE_URL`, default `http://127.0.0.1:18587/api/v1`).
Every `/api/` call sends `X-Toast-Token: $TOAST_API_TOKEN` (outside a Toast session, the token is the file `api-token` in Toast's data folder); `/health` and the sealed routes need none.
There is no OS screenshot and no Toast source checkout, and nothing in the user's Toast changes.

| Tool | Sees | Catches without judgment |
|---|---|---|
| `see-it.mjs desk / app` | the real window as the app draws it, covered or not | an unavailable or unpainted window (`ok: false` with the reason) |
| `piece-probe.mjs` | a piece under any look and in any state, headless | rendered font sizes, whether Pretendard loaded, truncated text without a title |
| `shot-check.py <png or jpg>` | pixels | a blank capture, extra body fills (a card in a card, or full-width highlight or share bars), a vertical panel edge inside the window, number columns ending at different x |
| `ui-lint.py <atom.js or folder>` | code | non-app font, more than two type sizes and odd weights, chevrons and icon-only controls, raw colours outside tokens, share bars, glows and gradients, filled+rounded+bordered boxes (a card in a card), `visibility:hidden` column shifts, "1 files" plurals, missing empty/loading/error states, ellipsis without a title |

Calibration: the same tools on three Dev Tree versions:

| Version | ui-lint | shot-check | What the user said |
|---|---|---|---|
| devtree (v1) | **3 major**: system-ui font, icon-only "more"/"dots" | (no capture kept) | font, strip, no title |
| devtreeview (v1.5) | **6 major**: 5 type sizes, icon-only expand/collapse/more/dots, share bar | **2 flags**: 3 body fills (share bars), numbers at x=618 vs 652 | header card in card, too many sizes, chevrons |
| devtreelist (v2) | **0 major**, 4 minor ("1 files" in the hover title, no error state, one raw shadow colour) | **0 flags**: one body fill, one numbers edge | the lead's reference |

The tools rank the versions the way the user did, with no human in the loop. They do not
replace looking: alignment of names, contrast, overlap and whether the bar is right are
still read from the picture. Known blind spots: a subtle gradient body reads as one fill,
which is correct for the stock card window, whose body is a dithered gradient. Tolerances are tuned on dark looks only.

---

## 1. Capture: one way per surface

| Surface | How | Notes |
|---|---|---|
| Desk window (card, pinned, wallpaper) | `interface(op=apply)` returns `desk_pictures` for every window it touched; `see-it.mjs desk [ids]` looks again without a change | Each window's own page as it draws now (Electron `capturePage`), so other windows on top do not matter. A wallpaper is pictured from a hidden copy of its page. A window outside the app is not pictured. |
| App window | `interface(op=preview)` or `see-it.mjs app` | **`page=` is ignored**: it pictures whatever page the window shows now (asked for `/pages/dev-tree`, got `/quests`). Read `snapshot_state.page` before scoring. To see your page, put it in a desk window (`windows` patch) and use `see-it.mjs desk`. |
| A piece in states and looks you cannot reach live | `piece-probe.mjs cases.json` | Uses the shipped looks' values (`look-values.css`) or your own look's package and the backend's Pretendard. `font: fallback` in its report means the backend did not answer: do not score R3 then. |
| Canvas pane | `render(..., picture: true)` | A sealed atom draws blank or "not installed" in the canvas until finalize, so score sealed pieces through their desk window, `piece-probe.mjs` or `frame-probe.mjs`. |
| No desktop app | none | A backend on its own has no screen: `see-it.mjs` answers `unavailable`. Score the headless pictures and say the live window was not seen. |

- Look closer: crop and enlarge 2× the region you are judging. Spacing and double-surface defects are
  invisible at full-window scale.
- Measure, don't eyeball: sample pixels to answer "same surface?", and measure column x-edges for alignment.
- Never score a blank or `ok: false` picture; retry after the window has drawn.

---

## 2. Rubric — score the capture, one line per check

Score each: **pass / minor / major / blocker**, with the evidence (crop, pixel value,
line of code). Blocker or major → fix and re-capture.

| # | Check | Pass when | Typical miss |
|---|---|---|---|
| R1 | **Window chrome** (T1) | A desk window has a real bar: icon and title on the left, pin and close on the right, matching the app's own windows (the icon is the page's menu `icon`). | six-dot strip and a bare × (Dev Tree v1) |
| R2 | **Hierarchy** | In 2 s a stranger can say what this is and what matters most: one title, one lead figure, then detail. Weight/size steps are visible between levels. | no title / no colour (Dev Tree v1); every row the same weight |
| R3 | **App font, two sizes** (T3) | Text inherits the app font (`font: inherit`; Pretendard on stock). Two sizes: 13 px body, 12 px meta; weight 400, 500 for names, 600 only for the window title. | system-ui (Dev Tree v1) |
| R4 | **Tokens, not hex** | Every colour, radius and spacing is a look's token (`var(--bg-neutral-base, …)` etc.). Hex only as a fallback inside `var()`. Count raw hex outside `var()`: 0. | hard-coded palette that breaks under another look |
| R5 | **One surface** (T6) | One card per window. A header, toolbar or list sits on the window's surface, not in a second inset card with its own fill/radius/border. Sample the pixels: header and body the same fill, or separated only by a hairline. | header as a second card inside the window card (Dev Tree v2); content panel inset with its own rounded corner under the window bar |
| R6 | **Spacing rhythm** | Padding comes from one scale (4/8/12/16); the gap from window edge to content equals the gap between groups; no element touches an edge. | 3 different left insets in one pane |
| R7 | **Alignment** | Shared columns line up across row kinds (numbers right-aligned to one edge; names on one indent per depth). Measure x-edges. | numbers ending at two different x |
| R8 | **Overlap / clipping** | Nothing covers anything: icons, badges, scrollbars, share/strip bars, popovers. Check corners and the bar zone. | icon hidden under the share bar (Dev Tree v1) |
| R9 | **Truncation** | Long text ellipsizes on one line with the full value in a tooltip; nothing wraps mid-word or runs under a neighbour. Test with the longest real value. | commit subject cut with no way to read it |
| R10 | **Empty / loading / error** | Each state has a designed look in the same frame: loading says what it waits for, empty says why and what to do, error says what failed. Capture all three (feed `refresh: manual` before first run; a bad input). | blank frame while the feed runs |
| R11 | **Contrast** | Body text ≥ 4.5:1, secondary ≥ 3:1 against its actual surface (sample both pixels). | soft grey on tinted bar |
| R12 | **Light and dark** | Captured under both a light and a dark look; every surface follows. (Changing the user's look is a user-visible change: ask first, or verify by reading the code: R4 = 0 raw colours.) | dark fallbacks showing under a light look |
| R13 | **Words over glyphs** (T2) | Controls are words (Expand, Collapse, More). Icons only for search, close, pin, folder, file. A decoration that looks like state (selection, progress) is not used for something else. | size bars that read as selection highlights |
| R14 | **Copy** | User's language; plurals right; numbers grouped; no internal ids or field names. | "1 files" |
| R16 | **Less text** (T4) | Short numbers (877k, 1.5M) with the exact value in the hover title; no unit repeated on every row. | "12,422 files · 876,886 lines" on every row |
| R17 | **No drama** (T5) | No share bars, glows, extra chips or badges unless they carry the decision. Colour on one thing (brand on the branch; warning only when dirty). | share bars, coloured chips everywhere |
| R15 | **Fits the place** | Content fits the window size asked (card 380×520 small) with no horizontal scroll; a long list scrolls inside, the header stays. | — |

### Calibration on Dev Tree

Old flaws from BRIEF.md, as the rubric catches them:

| BRIEF flaw | Caught by |
|---|---|
| six-dot strip and bare × instead of a window bar | R1 blocker |
| no title or colour | R2 major |
| system-ui instead of Pretendard | R3 major (grep the atom for `font-family`) |
| header as a second card inside the window card | R5 major |
| icon hidden under the share bar | R8 major |

The **current** Dev Tree card (capture `shots/devtree-card.png`, code
`dev-menu-interface/project_tree/devtreeview/atom.js`), scored cold by this rubric:

| # | Score | Evidence |
|---|---|---|
| R1 | pass | Bar with icon, "Dev Tree", × |
| R2 | minor | `src` and `backend` the same weight/size; depth only shows by indent |
| R3 | pass | `.ft{font:inherit}`; no font-family in atom.js |
| R4 | minor | all colours are `var(--token, #fallback)`; but the fallbacks are dark-only hexes (`#16182a`, `#e6e8f0`), so any missing token shows dark under a light look |
| R5 | **major** | still three nested surfaces: window bar → content panel with its own rounded top-right corner (2× crop) → header block. Pixel samples: body (21,26,52) vs list (28,29,62); the header is `--bg-neutral-base` sticky on a different tint |
| R6 | minor | header left inset 41 px, row icons at 44/66 px, panel inset 5 px: no single edge |
| R7 | **major** | numbers end at x=618 on folder rows but x=652 on file rows (measured, 34 px physical = 27 DIP). Cause: `.ft-dots` (16 px icon + 2 px padding ×2 + 7 px gap = 27 DIP) is `visibility:hidden`, which still takes its space, and only folder rows have it. Fix: `position:absolute` the dots or reserve the slot on every row |
| R8 | minor | the `.ft-bar` share bar runs under the numbers ("backend" bar touches "12,422") and a 3 px sliver on "electron" looks like a glitch |
| R9 | pass | commit subject ellipsizes (no tooltip checked) |
| R10 | not seen | needs a capture before the first feed run |
| R11 | pass | meta text sampled (128,134,146) on row bg (25,27,59) = 4.55:1 (antialiased sample, a floor); secondary text needs ≥3:1 |
| R12 | not seen | user's look is dark; not switched (user-visible) |
| R13 | **major** | the line-share bars look like selection/hover highlights; nothing says they are a share. Expand/collapse icons (⇕ / ⇳) are unlabeled lookalikes |
| R14 | minor | "1 files · 23 lines" (config) |
| R15 | pass | scrolls inside, header sticky |

**Verdict: not shippable — 3 major (R5 one surface, R7 alignment, R13 meaning).** None of
these three were in the user's list; the loop finds the next round of flaws before the user does.

---

## 3. Ask first — the questions worth asking before building

Ask with one AskUserQuestion card, at most 4 questions, each with a recommended option first.

1. **What is it for, in one sentence?** — "glance at it" (status widget), "work in it" (tool
   page), "be told" (alert, no window). Decides the form: card, page, or feed rule only.
2. **Where does it live?** — small desk card (380×520) / pinned over windows / wallpaper /
   a page in the sidebar / the canvas. Decides window kind and size budget.
3. **What should it look like?** — offer 2–3 concrete references as options: "like the app's
   own panels (recommended)", a library spread by name ("Status verdict", "Pick and shortlist"),
   or a picture/site they name. Never ask "what style do you like?" open-ended.
4. **What data, and how fresh?** — which source (their folder, a site, a dough), and refresh:
   on open / every N min / at a time. Only when the source is not obvious.
5. *(only for actions)* **What may it do without asking?** — read-only vs. buttons that act.

**Skip asking when:**
- the request already answers it (named place, size, source, look);
- it is a revision of something they have seen ("move the count left") — just do it, capture, show;
- a default is safe and reversible: app look + stock tokens, desk card 380×520, `on_open` refresh;
  say the default in the result instead of asking;
- the user said they are away / not at the screen — choose the defaults, ship, and attach the capture.

**Always ask when:** it replaces something they have (a page, the menu, their look), changes a
look they chose, adds actions that reach outside the PC, or the purpose itself is unclear.

---

## 4. The loop in one checklist (paste into a plan)

- [ ] Ask (or state the defaults taken) — §3
- [ ] Pick the form from the spreads library first (`find(op=spreads)` by form); code only when no spread fits
- [ ] Build; open it where it will live (window / page)
- [ ] `see-it.mjs desk <id>` (desk window) or `interface(op=preview)` with `snapshot_state.page` checked (app page); `piece-probe.mjs` for the other looks and states
- [ ] Crop + 2× the header, a row, the corners; sample pixels for R5/R11; measure x-edges for R7
- [ ] Score R1–R17; fix every blocker/major; capture again
- [ ] Capture the empty/loading state once (R10)
- [ ] Result names the final capture file and any check left "not seen" and why

---

## 5. The loop run on its own output (canvas route proven)

The scorecard pane for this item ("Status verdict" spread, `render(picture: true)`) failed
two checks on its first capture, both fixed in the second render:
- R11/R13: the 3rd segment colour of the spread's progress bar is near the page background
  (the "Major" legend dot was invisible). Worked around by putting Major first; the
  palette defect stays in the spread — for the spreads library: the
  3rd segment of `postlab.composite.status_verdict` progress has no contrast on dark.
- R7: the threshold meter's "0 to ship" target label floated left of the axis for a
  lower-is-better value. Dropped the threshold section (`thresholdValue: null`).

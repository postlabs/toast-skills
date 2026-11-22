# Looks in detail

SKILL.md "Looks in short" holds the short form. Everything here is the full rule set; exact call shapes are in `look-recipes.md`.

### Fill as few layers as the ask needs

Start from a shipped look. Then fill values, motion, images, and code only for what no other layer can say.

| The person says | Layers filled |
|---|---|
| "dark", "lighter", "softer", "like Office" | none: wear a shipped look |
| "warmer" | none (`sunset`, `pastel` and `sage` are all light) |
| "warm and dark", "night café" | values: nocturne with a warm accent seed and warm neutral values |
| "game-like" | none: `rpg`, a painted look |
| "my brand green", "rounder", "this font" | values |
| "calmer", "less motion", "no sparkles" | motion |
| "my photo in the header", "framed boards" | images (+ values) |
| "redraw the sidebar", "an animated scene", "pixel art" | code (+ images, values) |
| "…and on its own page / in the menu" | + interface changes |

- **Motion** has six things that move: hover, dock open and close, unfold, quest draw and sparkle. Anything else that moves
  ("when I finish a task") is not a look:
  - If a widget already shows the tasks, add the motion there (`widget.md`).
  - If none does, the smallest route is a new widget that does (SKILL.md, the method).
  - Redrawing a stock part with code is the larger option.
  - Say which one in the ask.
- **A look for one page** can hold values and images only (`pages[...]`). Code is app-wide, so a part the look redraws changes
  everywhere it is drawn. Quest-only parts: `questScene`, `questOverviewRow`, `questToolbar`, `questBoard`.
  `questWorkspace`, `questChat` and `questActivity` render elsewhere too. Say this in the ask.
- Your widgets follow any look only through tokens. A hex outside a `var()` fallback breaks the first time the look
  changes (`ui-lint.py` catches it).

### Ask every time, in plain words

Every look change asks first, follow-ups included, in plain words with pictures of the look applied (no option cards). The ask names the look and says:
- **what changes**, in their words (the accent goes ink green, corners soften, the dock opens faster);
- **what stays**: pages, widgets, data, and every layer the look does not fill;
- **whether it carries code**. If it does, Toast shows an approval dialog;
- **how to go back**, from `undoScope` read just now, never from memory:
  - `whole_ui`: "undo";
  - otherwise "pick your earlier look again" (read's current `theme`/`skin`), plus "the code is rolled back" if the look carries code;
- pictures of the look on the person's own pages (`interface(op=preview, look=…)`). With two directions, show both
  pictures and ask which reads right. When a shipped look is close, it is the smallest change.

Nothing is worn before the answer. A coordinator's yes is not the person's.

### Build each layer

- **Values.**
  - **Accents** (brand and the other six tones) change through the colour seeds, all seven tones. Hand-set accent values leave
    icons and soft text on the hue underneath.
  - **Surfaces and text** can't be seeded (a `neutral` seed is refused), so set them by hand as one set: base, page, raised and
    sunken backgrounds, borders, and the text ramp down to `--text-neutral-muted`. Check each text step on base for ≥ 4.5:1.
  - Single values (corners, spacing, font) sit beside the seeds and win over them.
  - A look is one scheme, light or dark; someone who wants both gets two looks, and the ask says so.
- **Motion.**
  - Animate state changes only, never over 300 ms: hover 120–150 ms, open and unfold 160–200 ms.
  - A celebration ("when I finish") is one state change of ≤ 300 ms, never confetti or a burst.
  - A loop is allowed only while it is bound to a working state, and it stops when the work stops; never idle.
  - Quest draw and sparkle stay off unless asked. Nothing bouncy.
  - The app zeroes motion under the OS's reduced-motion setting, and your atoms check `ctx.theme.reducedMotion`.
  - **Validation does not check durations or fonts**: you do.
- **Images.** Use embedded data URLs only (png, webp or jpeg; ≤ 4096 px, ≤ 6 MB). Borrow a shipped look's art by binding it.
  Dark art needs light text: the check refuses text that does not read.
- **Code.** Fork a shipped look's source.
  - `office` copies 4 parts. `rpg` copies 1 part (`questScene`) plus 3 value bindings, not the 16 the skin guide says.
  - Delete every copied part you don't redraw, and keep `docks(lanes)` in a replaced app layout.
  - One look with code is active at a time, so put everything in it.
  - Build in your tray. Install only after the person's yes, and tell the person to look for the approval dialog.
- **Interface changes** go in the same write as the look.

Exact shapes are in `look-recipes.md` §2–5.

### See it before it is worn

Read the revision just before you validate, and again just before you apply. Another session's write moves it, and a stale
one is refused with a 409. Validate the whole look with the same arguments the write will send, `points` included.
- **A look with images:** the `interface` tool takes no `file` for validate, so send it to the backend:
  `POST /api/v1/interface` with `{op: "validate", ...}` and the `X-Toast-Token` header.
- **Read the answer:** the issues (unknown names and illegible pairs are refused with the reason) and the revision warnings.

Validation draws nothing, so each option's `preview` is one of these:

| What | Preview |
|---|---|
| Your widgets under a shipped look | `piece-probe.mjs`, case `"look": "<name>"` |
| Your widgets under your look's values | the same, with `"look": "<package>.json", "under": "<shipped look>"` |
| A seeded hue | an approximation: hand-set the accent you expect in a probe case, and label it "approximate colour" in the ask |
| Images and code | a frame sheet: the art and the parts' key frames side by side in one PNG, labelled "not yet worn" |
| Spreads on the canvas | `render(picture)`: the worn look only |

For the look underneath, read `interface(op=skin_values, core=true)`. `look-values.css` is the fallback; say which one you used.

### Score the look

Run the critique (SKILL.md step 5) on probe shots of **the person's own pages and widgets** under the look, then three more lines:
- **L1 reach:** every accent moved, including icons, soft text and tints.
- **L2 legibility:** text on brand fills, on hand-set surfaces and on images is ≥ 4.5:1.
- **L3 motion:** each moving thing is listed with its duration (≤ 300 ms). A loop names the working state that bounds it.

Report as SKILL.md step 6 does, plus the layers the look fills and what was not seen.

### Packaging, until the look API lands

Today a look's layers go through calls whose names still say "theme" and "skin". Those names are for you only. The full
table is in `look-recipes.md` §6. In short:
- values, motion and images form one package (`themes: [package]` in `interface apply`);
- `patch.skin` wears only the package's values and motion, so the worn art and parts stay. `patch.theme` wears the whole package
  (images, `base`, `components`). For one page, use `pages[...].theme` / `.skin`;
- `base` is a real name: `default`, `rpg`, `palace`, `office` or `easy` (the worn look's, from read). `$worn` in the schema
  examples is a placeholder, and the literal is refused;
- the code layer goes through `skin op=fork → build → install`;
- interface changes ride in the same apply;
- validate the whole look first.

When the look API lands, this collapses into one call.

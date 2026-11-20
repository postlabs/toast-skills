# Look recipes: exact shapes, proven against the live backend (2026-11-20, validate only)

A **look** is one package of layers. It fills the layers it needs, and every layer it leaves out comes from the look underneath:

| Layer | What it holds |
|---|---|
| values | colour, type, spacing, corners |
| images | pictures and frames over the app's surfaces |
| motion | how hover, docks, unfold, quest draw and sparkle move |
| code (optional) | redrawn parts |
| interface changes | a page, a menu entry or a window that comes with it |

A look is packaging, not a new system. Each layer is built with today's calls (§6). The look names the bundle,
is asked for on one card, and goes back as one.

Everything here was checked with `interface(op=validate)` on DESKTOP-JKWONOFFICE (interface rev 22, nothing
worn). Nothing was applied or installed.

## 1. Ask → the layers the look fills

| The person says | Layers filled | Recipe |
|---|---|---|
| "dark mode" / "lighter" | none: wear a shipped look | `nocturne` / `classic` |
| "warmer" / "softer" / "greener, calmer" | none, first | `sunset`, `pastel`, `sage`. Offer these before building one. All three are **light**. |
| "warm and dark", "night café", "cozy" at night | values: accent seed + hand-set neutrals | §2.3 (`examples/user-night-cafe.json`) |
| "game-like", "like an RPG", "paper" | none: the shipped look already has art and parts | `rpg` / `rpg-paper`. The art is painted, not pixel. |
| "like Office" | none | `office` |
| "my brand colour #xxxxxx" | values (hue) | §2.1 |
| "rounder / sharper corners", "tighter spacing" | values | §2.2 |
| "use font X" | values | `--type-family-sans`. The font must already load in the app; validate does **not** check it. |
| "less animation", "snappier", "no sparkles" | motion | §3 |
| "my photo in the header", "a background picture" | images | §4 |
| "frame my boards with the RPG art" | images, borrowed | §4 |
| "replace the sidebar with …", "an animated scene", "pixel art", a part that must look different, not just recoloured | code (+ images, values) | §5 |

**The 8 shipped looks:** `nocturne` (dark, stock), `classic` (light), `sunset`, `pastel`, `sage`, `rpg`, `rpg-paper` and `office`.
- `rpg` and `office` bring their own art and parts.
- `rpg` lends its art: images `board`, `card`, `check`, `dock`, `header`, `mark` and `sidebar`, and frames `board`, `card`, `dock`, `header` and `sidebar`.
- A look can also swap the stock controls `controlCheck`, `controlProgress`, `controlButton`, `controlBadge`, `controlDisclosure` and `appMark`
  for a shipped look's version: `default`, `rpg`, `palace`, `office` or `easy`.

## 2. The values layer

### 2.1 A hue: seeds, all seven tones (proven: `examples/user-ink-calm.json`, validate ok)

```json
{"version": 2, "id": "user-ink-calm", "name": "Ink calm",
 "seeds": {"from": "classic", "colour": {"chromatic": [
   {"key": "brand", "hue": 170, "depth": 0},
   {"key": "danger", "hue": 29, "depth": 0.2}, {"key": "warning", "hue": 92, "depth": 0.05},
   {"key": "success", "hue": 153, "depth": 0.2}, {"key": "secondary", "hue": 184, "depth": 0.2},
   {"key": "info", "hue": 218, "depth": 0.2}, {"key": "question", "hue": 60, "depth": 0.1}]}}}
```

- `hue` is an OKLCH hue in degrees. Convert the person's hex: `#2f5d50` ≈ 173 (170 is close enough; the engine sets lightness).
- The hues to copy from the look underneath:
  - **classic:** brand 290, danger 29, warning 92, success 153, secondary 184, info 218, question 60.
  - **nocturne:** brand 292, danger 25, warning 85, success 155, secondary 190, info 225, question 58.
  - Depths are the same in both: brand 0, warning 0.05, question 0.1, the rest 0.2.
- A partial list is refused: `chromatic is missing the "danger" tone …`. A `{brand: …}` key is refused:
  `Unrecognized key(s) in object: 'brand'`.
- `from` is the scheme: `classic` is light and `nocturne` is dark. One look is one scheme. A person who wants both gets two looks.

### 2.2 Single values (they win over seeds)

Worth setting (the full list is in `schema theme_v2.values`):
- **Corners:** `--radius-card`, `--radius-panel`, `--radius-control`, `--radius-field`, `--radius-chip`. These are lengths, so `"soft"` is refused.
- **Space:** `--gap-{row,group,section}`, `--pad-{card,panel}`.
- **Type:** `--type-family-sans`, `--type-family-mono`. Leave `--type-size-*` alone: TASTE rule 3's sizes come from them.
- **The brand pair**, only when you must set it by hand: `--bg-brand`, `--ramp-brand` and `--text-brand-on`, all three together. Any you leave out
  come from the look underneath, and the legibility check compares your text with *its* ramp
  (it refused `#35604f` on `ramp-brand start #7f30ff`: 1.28:1).

**The trap (seen).** `examples/user-ink-tokens-only.json` sets `--bg-brand`, `--text-brand` and `--border-brand` to ink green.
Under `piece-probe` the branch name turns green, but the folder icons read `--text-brand-soft` and stay
purple: the look underneath still fills that value. Half-moved accents look like a bug. Change any **accent** hue through seeds.
The trap is about accents only: surfaces and text can't be seeded (§2.3).

Refusals seen:
- an unpublished name (`--glow-thing not published`);
- a length keyword (`'soft' is not a length keyword`);
- an illegible pair (the ratio and both colours are stated).

### 2.3 Warm or tinted surfaces: hand-set neutrals (proven: `examples/user-night-cafe.json`, validate ok)

A `neutral` seed is refused (`Unrecognized key(s) in object: 'neutral'`), so surfaces and text are set by hand, as one set:
- the ramp `--neutral-50` … `--neutral-900`;
- backgrounds `--bg-neutral-{page,base,raised,sunken}` and the veils `--bg-neutral-veil{,-hover,-active}`;
- borders `--border-neutral{,-rim,-guide,-rail,-veil}`;
- text `--text-neutral{,-secondary,-tertiary,-muted,-soft,-inverse}`.

Check each text step against `--bg-neutral-base` (≥ 4.5:1, except `-soft`, which is for placeholders only). The night-café
example: text 14.4, muted 6.6, white on brand 5.0. Pair it with an accent seed (`from: nocturne`, brand hue ≈ 62 for amber).

**Not checked:** font names (`Comic Sans MS` passed), motion durations (900 ms passed) and presets (`bouncy` on sparkle passed).

## 3. The motion layer

Things that move, with their values in the stock look (`frontend/src/features/interface/themeMotion.ts`):

| Target | Stock | Calm recipe |
|---|---|---|
| `hover` | 150 ms | `{preset: snappy, durationMs: 150, easing: ease-out}` |
| `dockOpen` | 340 ms | `{durationMs: 200, easing: ease-out}` |
| `dockClose` | 340 ms | `{durationMs: 160, easing: ease-in}` |
| `scrollUnfold` | 650 ms | `{durationMs: 180, easing: ease-out}` |
| `questDraw` | 600 ms | `"off"` |
| `sparkle` | 2600 ms (idle) | `"off"` |

- Preset factors on stock: `gentle` ×1.6, `snappy` ×0.65 and `bouncy` ×1.2 (with an overshoot curve).
  `durationMs` wins over the preset, and `durationMs: 0` turns it off.
- The app zeroes every target under the OS reduced-motion setting and `data-motion-<name>="off"`.
- The rule for looks we make:
  - state changes only, never over 300 ms;
  - a celebration is one state change of ≤ 300 ms (no confetti, no burst);
  - a loop is allowed only while bound to a working state, and stops with it;
  - `bouncy` only on request.

  Fill this layer only when the ask is about motion or the look is "calm".
- Anything else that moves ("when I finish a task") is not in this layer. Put it in the widget that shows it (SKILL §5).
  If none exists, a new widget is the smallest route, and code is the larger one.

## 4. The images layer

- Embedded data URLs only: png, webp or jpeg, ≤ 4096 px edge, ≤ 6 MB. Never paths or web URLs.
- Slots: `header`, `sidebar`, `pane`, `dock`, `bar`, `board`, `chat`, `session`, `card`, `mark`, `check`, `questArt`. The
  `character` slot is drawn only by the Palace look.
- Frames slice a slot's image as a border: `frames.board: {slice: [40], width: [12]}`.
- To borrow a shipped look's art, add a binding: `requires.bindings: [{as: "board", kind: "asset", package: {kind: "skin", id: "rpg"}, slot: "board"}]`.
- Dark art needs light text. The frame check refuses text that does not read on it and states the ratio.
- `base` keeps a look's parts and art under the new images. It is a real name: `default`, `rpg`, `palace`, `office` or `easy`, the worn
  one from read. `"$worn"` in the schema examples is a placeholder, and the literal is refused (422).
- To validate a package with images, use `POST /api/v1/interface` with `{op: "validate", ...}` and `X-Toast-Token`. The
  `interface` tool takes no `file` for validate, and data URLs are too big to paste.

## 5. The code layer

- Fork a shipped look's source. `office` copies 4 parts and no bindings. `rpg` copies 1 part (`questScene`) and 3 value
  bindings, not the 16 the skin guide says. Delete every copied part you don't redraw.
- Code is app-wide, even when the look's values and images sit on one page. These parts are drawn only on the quest pages:
  `questScene`, `questOverviewRow`, `questToolbar` and `questBoard`. `questWorkspace`, `questChat` and `questActivity` render elsewhere too.
- Only registered part names apply (`skin(op=contract)` lists them).
- An app layout you replace must call `docks(lanes)`.
- Only one look with code is active at a time, so put every redrawn part in it.
- Build in your tray. Install only after the card's yes; it asks the person to approve the code in a Toast dialog.

## 6. Packaging: how a look maps to calls, until the look API lands (i-bd057f0db51e)

Today a look is spread across fields whose names still say "theme" and "skin". Those names are for you only: the card, the result and the person
never see them. When the look API lands, this table collapses into one call.

| Layer / step | Today's call |
|---|---|
| Wear a shipped look, values only | `interface apply patch: {skin: "<id>"}` |
| Wear a shipped look with its art and parts | `patch: {theme: "<id>", skin: "<id>"}` (rpg, office) |
| Your look: values, motion, images | `apply {patch: {skin: "user-…"} or {theme: "user-…"}, themes: [package]}`. Both are valid; the guide's example shows `theme`. Use `patch.skin` for values and motion only, so the worn art and parts stay. Use `patch.theme` when the package carries images, `base` or `components`. |
| A look on one page | `patch.pages["/quests"].theme` (or `.skin`), plus `"/quests/:questId"` for the quest pages. Values and images only. |
| Swapped stock controls | the package's `components` |
| Code layer | `skin op=fork → build → install` (code approval), and back with `skin op=rollback` / `reset` |
| Interface changes | the same `apply`: `pages`, `add_navigation`, `windows` |
| Validate the whole look | `interface op=validate` with the same arguments, `themes` included |
| Revise your installed look | `read_theme` → `update_theme`, or `apply` with `theme_revisions: {id: rev}` |
| The look underneath, read as values | `interface op=skin_values`: `core=true` for the core set; a `prefix` read for the rest (`--text-neutral-muted` is not in core) |

```
read     → revision                                                                          # just before
validate {revision, patch: {skin: "user-ink-calm"}, themes: [<package>], points: [...]}
read     → revision again; validate again if it moved                                        # after the person's yes
apply    {same arguments}
```

Another session's write moves the revision; a stale one is refused with a 409.

**One undo.** Read `undoScope` live, at the time you write the card. With `whole_ui`, `interface undo` reverts the write.
Otherwise the way back is "pick the earlier look again": the `theme`/`skin` values from that read, plus `skin op=rollback` if
the look carried code.

`candidateDigest` hashes the config only: two different packages under one id gave the same digest, so it does not prove the package is unchanged.

## 7. See a look before it is worn

| Want to see | How | Seen? |
|---|---|---|
| A widget under a shipped look | `piece-probe` case `"look": "<name>"` | yes |
| A widget under your look's values | `piece-probe` case `"look": "<package>.json"`, `"under": "<shipped look>"` | yes, for the values it sets |
| Your look's seeded hue | an approximation: hand-set the accent you expect in a probe case | approximate. Label it "approximate colour" on the card. Platform ask: a preview that draws an unworn package. |
| Spreads on the canvas | `render(picture)` | the worn look only |
| Images and code layers | a frame sheet: the art and the parts' key frames side by side in one PNG | the art, not the app. Label it "not yet worn"; the app picture comes after the yes. |

# Look recipes: exact shapes, proven against the live backend (2026-11-20, validate only)

Everything here was checked with `interface(op=validate)` on DESKTOP-JKWONOFFICE (interface rev 22, nothing
worn). Nothing was applied or installed.

## 1. Ask → level

| The user says | Level | Call shape |
|---|---|---|
| "dark mode" / "lighter" | bundled | `patch: {skin: "nocturne"}` / `{skin: "classic"}` |
| "warmer" / "softer" / "greener, calmer" | bundled first | `sunset`, `pastel`, `sage`. Offer them before building one. |
| "game-like", "like an RPG", "paper" | bundled + pieces | `patch: {theme: "rpg", skin: "rpg"}` (or `rpg-paper`) |
| "like Office" | bundled + pieces | `patch: {theme: "office", skin: "office"}` |
| "my brand colour #xxxxxx" | A seeds | §2.1 |
| "rounder / sharper corners", "tighter spacing" | A tokens | §2.2 |
| "use font X" | A tokens | `--type-family-sans`. The font must already load in the app: validate does **not** check it. |
| "less animation", "snappier", "no sparkles" | A motion | §3 |
| "my photo in the header", "a background picture" | B image | `images.header: "data:image/png;base64,…"`, `base: "$worn"` |
| "frame my boards with the RPG art" | B borrowed | `frames.board` + an asset binding to `rpg` (schema example `B_borrowed_image`) |
| "replace the sidebar with …", "an animated scene", a component that looks different, not just recoloured | E skin | `skin(op=fork, base=office|rpg)` → build → install (code approval) |

`schema.skins`: `nocturne`, `classic`, `sunset`, `pastel`, `sage`, `rpg`, `rpg-paper`, `office`.
`schema.skin_images.rpg`: images `board`, `card`, `check`, `dock`, `header`, `mark`, `sidebar`; frames `board`, `card`, `dock`, `header`, `sidebar`.
Theme `base` / `components`: `default`, `rpg`, `palace`, `office`, `easy`. `components` swaps only `controlCheck`,
`controlProgress`, `controlButton`, `controlBadge`, `controlDisclosure` and `appMark` (level D).

## 2. Level A shapes

### 2.1 A hue: seeds, all seven tones (proven: `examples/user-ink-calm.json`, validate ok)

```json
{"version": 2, "id": "user-ink-calm", "name": "Ink calm",
 "seeds": {"from": "classic", "colour": {"chromatic": [
   {"key": "brand", "hue": 170, "depth": 0},
   {"key": "danger", "hue": 29, "depth": 0.2}, {"key": "warning", "hue": 92, "depth": 0.05},
   {"key": "success", "hue": 153, "depth": 0.2}, {"key": "secondary", "hue": 184, "depth": 0.2},
   {"key": "info", "hue": 218, "depth": 0.2}, {"key": "question", "hue": 60, "depth": 0.1}]}}}
```

- `hue` is an OKLCH hue in degrees. Convert the user's hex: `#2f5d50` ≈ 173 (170 is close enough; the engine sets lightness).
- The base hues to copy: **classic** brand 290, danger 29, warning 92, success 153, secondary 184, info 218,
  question 60. **nocturne** brand 292, danger 25, warning 85, success 155, secondary 190, info 225, question 58.
  Depths are the same in both: brand 0, warning 0.05, question 0.1, the rest 0.2.
- A partial list is refused: `chromatic is missing the "danger" tone …`. A `{brand: …}` key is refused:
  `Unrecognized key(s) in object: 'brand'`.
- `from` is the scheme: `classic` light, `nocturne` dark. One theme is one scheme.

### 2.2 Single values: tokens (they win over seeds)

These tokens are worth setting (full list in `schema theme_v2.values`):
- **Corners:** `--radius-card`, `--radius-panel`, `--radius-control`, `--radius-field`, `--radius-chip`. These are lengths, so `"soft"` is refused.
- **Space:** `--gap-{row,group,section}`, `--pad-{card,panel}`.
- **Type:** `--type-family-sans`, `--type-family-mono`. Leave `--type-size-*` alone: TASTE rule 3 sizes come from them.
- **Brand pair**, only when you must hand-set it: `--bg-brand`, `--ramp-brand`, `--text-brand-on`. Set all three together, or
  the missing ones fill from the worn set. The legibility check then compares your text with the *worn* ramp
  (it refused `#35604f` on `ramp-brand start #7f30ff`: 1.28:1).

**The trap (seen):** `examples/user-ink-tokens-only.json` sets `--bg-brand`, `--text-brand` and `--border-brand` to ink green.
Under `piece-probe` the branch name turns green, but the folder icons read `--text-brand-soft` and stay
purple (`shots/look-trap-tokens-only-light.png` and `-dark.png` beside `shots/look-stock-light.png`). Half-moved
accents look like a bug. Use seeds for any hue change.

Refusals seen: an unpublished name (`--glow-thing not published`), a length keyword (`'soft' is not a length
keyword`), and illegible pairs (the ratio and both colours are stated). **Not checked:** font names (`Comic
Sans MS` passed), motion durations (900 ms passed) and presets (`bouncy` on sparkle passed).

## 3. Motion

Targets and stock values (`frontend/src/features/interface/themeMotion.ts`):

| Target | Stock | Calm recipe |
|---|---|---|
| `hover` | 150 ms | `{preset: snappy, durationMs: 150, easing: ease-out}` |
| `dockOpen` | 340 ms | `{durationMs: 200, easing: ease-out}` |
| `dockClose` | 340 ms | `{durationMs: 160, easing: ease-in}` |
| `scrollUnfold` | 650 ms | `{durationMs: 180, easing: ease-out}` |
| `questDraw` | 600 ms | `"off"` |
| `sparkle` | 2600 ms (idle) | `"off"` |

- Preset factors on stock: `gentle` ×1.6, `snappy` ×0.65 and `bouncy` ×1.2 (with an overshoot curve).
  `durationMs` wins over the preset, and `durationMs: 0` is off.
- The app zeroes every target under the OS reduced-motion setting and `data-motion-<name>="off"`.
- Rule for our looks: state changes only, 150–200 ms, no idle loops, and `bouncy` only on request. Only touch
  motion when the ask is about motion or the look is "calm".

## 4. One write, and the ask before it

```
validate {revision, patch: {skin: "user-ink-calm"}, themes: [<package>], points: [...]}   # now
apply    {same arguments}                                                                    # only after the user's yes
```

- `patch.skin` wears colours only, and the worn pieces and art stay. Use `patch.theme` when the package carries `base`,
  images or components.
- To update an installed theme, add `theme_revisions: {id: rev}` (from `read_theme`).
- `candidateDigest` hashed only the config: two different packages under the same id gave the same digest.
  It is not proof that the package is unchanged.
- `revisionWarnings` said "base build unavailable … undo limited", and read says `undoScope: arrangement_only`.
  So the undo line in the ask is "select the earlier look again (now: none)", not `undo`.

## 5. Preview before wearing

| Want to see | Tool | Seen? |
|---|---|---|
| A widget or piece under a bundled skin | `piece-probe` `"skin": id` | yes |
| A widget under a theme's tokens | `piece-probe` `"look": "theme.json"` (look/scripts copy) | yes, tokens only |
| A theme's seeds (hue) | none yet | **no**: the colour engine does not run headless. Platform ask: `interface(op=preview, themes=[pkg])` drawing an unworn package. |
| Spreads on the canvas | `render(picture)` | worn look only |
| B images, E skins | `apply` / `skin install` picture | only after wearing |

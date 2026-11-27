# Drawings no spread makes: sealed atoms and pieces

Write your own drawing for the part no spread or composition already draws as the person asked. It must look like it belongs next to the
app's own surfaces: the look's tokens, the look's font, two type sizes.

## Which kind
- A `kind: piece` block runs trusted app code. It shows a placeholder until the person approves that code, so you
  cannot see it live before they do. Use it only when the drawing needs the app (a `navigate` or `refresh` action),
  and say in the first line of the result that approval is needed. Meanwhile picture it with
  `interface(op=preview, piece=…)`.
- Otherwise draw it through the `sealed` spread (`postlab.sp-8a0c3270532b4db68ece64c763b209c7`) in a
  `kind: spread` block. That is a sandboxed frame; with `hosts: []` it runs without approval.
- A family still in your conversation's tray is a draft: its block needs `chat: <your chat id>` to find it, and the
  page lives only as long as that chat until the family is published. Say so in the result.

## Tokens and type
- Read the worn look's values with `interface(op=skin_values, prefix="--text-")` (or `core=true` for the core set).
  Colours are `var(--bg-neutral-base, …)`, `var(--text-neutral, …)`, `var(--text-brand, …)`,
  `var(--border-neutral, …)`; hex only as a `var()` fallback that works on light and dark.
- Secondary and meta text is `--text-neutral-muted`. `--text-neutral-soft` fails contrast on light looks: only for
  placeholders. Never muted text on a tinted fill.
- In a sealed frame, copy `ctx.theme.tokens` onto your root (`el.style.setProperty(k, v)`), and set the font as
  `var(--type-family-sans, Pretendard, system-ui, sans-serif)` with Pretendard loaded from a pinned package. In a
  piece, `font: inherit`.
- 13 px body, 12 px meta, weights 400 and 500; one display figure at most, weight 400, up to 40 px.

## Sealed atom rules
- `js_deps` is a **map** `name: pkg@x.y.z/file`, exact versions. Keys match `^(@scope/)?name$`.
- Every bare import inside a library needs its own key (chart.js needs `@kurkle/color@0.3.4`).
- No CDN, no remote font, no remote image unless `hosts` names it (which asks the person to approve each version).
  Keep `hosts: []`; pass images as data.
- Tarballs must be ≤ 64 MB, so the `pretendard` package fails: use `@fontsource/pretendard@5.3.0/400.css` in
  `styles`.
- The ESM builds of lucide, Motion and dayjs are slow or broken: import the UMD file and read `globalThis.X`.
- `ctx.theme.reducedMotion` defaults to true. Animate only state changes, 150–200 ms, only when it is false.
- In an app-window piece, inherit the font; libraries that write to `document.head` restyle the whole app.
- Keep CSS flat: one class per element. Uneven gaps between sections usually come from two rules cancelling.
- Quality floor: a visible keyboard focus on every control, reduced motion respected, contrast met, nothing
  breaking at the narrowest size.

Proven library pins and the full rules with their reasons: `references.md`.

## Checking the code
`python scripts/ui-lint.py <atom.js | folder>` checks a drawing's code for a non-app font, more than two type sizes,
icon-only controls, raw colours, glows and gradients, and a card in a card; it exits 1 on a major.
`python scripts/shot-check.py <picture.png>` measures a picture for nested surfaces and ragged right edges. Both
catch slips; neither replaces the critique in SKILL.md step 5.

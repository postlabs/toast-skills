# Pages and dashboards

A page is a menu entry or a window's content: a title, then blocks top to bottom. The page draws the frame; you
decide what goes in each block, how wide the page is and what leads.

## What a page can say

```yaml
/pages/<name>:
  title: <page title>
  width: full | reading        # reading: one calm column (about 512 px), for rows and text
  arrangement: stack | columns # columns: blocks two across on a wide window; only for true peers
  blocks:
    - id: <name>
      kind: spread
      title: <block heading>   # optional; the block's own title row
      surface: sheet | none    # sheet (default): one sheet under the block. none: the content is its own cards or band
      layout: [ {spread, slots, knobs}, ... ]   # one or more spread instances, stacked inside this one block
      value: {...}             # the data the instances read; or source: a feed that fills it
```

Other block kinds: `piece` (a trusted drawing, approved by the person), `canvas` (a chat's canvas pane),
`conversation` (a chat beside the page), `links`. Read the interface guide (`interface(op=guide)`) and schema for
the exact fields before writing a patch.

The frame: the page title sits at the top left; each block is its title row over one sheet (or nothing, with
`surface: none`). A block's title already names it, so the spread inside does not need a second heading.

## Choosing the page's shape

- **One column of rows or text** (a list someone works through, a spending page, a plan): `width: reading`. The
  eye reads down one line; nothing stretches across an empty half. See `examples/gallery/`.
- **Something wide by nature** (a week of seven days, a table with many columns, a chart over months): `width:
  full`, and that block gets the width. Do not put a one-line block at full width beside it in equal weight.
- **Two peers** (two accounts, two plans compared): `arrangement: columns`. Not for a lead and its detail.
- **How many blocks:** one per question in the layout note. Several spread instances that answer one question go
  in one block's `layout` (a headline, then its rows), so they share one sheet.

## Treating the lead

The lead is first and alone. Ways to make it stand apart, best first:
- **The thing to act on** as a band at the top: `cta_band` (`postlab.sp-f7539ca9988f41b79ae68e4099b2035a`) with
  `surface: none`, an icon that names the kind of thing (`bell` for waiting on you, `calendar` for a date), the
  label saying what to do in the person's words, the detail saying why now. Not drawn when nothing waits.
- **The finding as a headline** at the top of the first sheet: `feature_lead`
  (`postlab.sp-3baab7778a594bfd80e44fbceb28bde4`, `knobs.layout: stacked`): eyebrow for where it is from, the title
  stating the answer, one line of support.
- **One figure that is the page's whole job**: `metric` (`postlab.sp-803ff7ed20ec444abdef6022f9fd53a2`), or the
  `metric` text role in your own drawing; the change beside it, coloured only when it is bad news.

The rest of the page is quieter: neutral rows, one heading level, no accent.

## Parts that read well, by what a section shows

Search by form to find more (`find(op=spreads, query=...)`); these are known to draw well on a page.

| The section shows | Spread | Notes |
|---|---|---|
| Where a plan or job stands, and each step | `status_verdict` composite `postlab.sp-816752b3e5ee4bb2a7656ae160c4e659` | Headline, one split bar, each check with its state. Tone only on steps that need the person (`warning`) or are moving (`info`). |
| Money spent and on what | `feature_lead` + `record_ledger` `postlab.sp-bbdecacc140245f883afdc536c830d06` + `expandable` with `rows` | Photos lead the rows when the source has them; amounts right-aligned, short (21.9만). The `spend_summary` composite bundles these. |
| A week | `week_calendar` `postlab.sp-3a9a1915c3fd4f99a0f6b2f793a6067d` | Seven days, today outlined. Keep it whole; it is usually the page's craft. |
| Today's hours | `day_timeline` `postlab.sp-3d99b91b2c71422b9062ba3b3e828a7e` | Trim with `hourStart`/`hourEnd`. |
| A to-do list | `task_list` `postlab.sp-327f35e24cd54ab9bcefe4be07d7fb01` | Done rows in `doneItems`; `layout: flow` in narrow places. |
| Items grouped by area, with progress | `task_board` `postlab.sp-b48ddb3916af42709b798fee3bfc69ce` | Areas as columns with `surface: none`; no box around the cards. |
| A value over time | `trend` `postlab.sp-a9c405bacb604c438682c14a9fc5bb78` | One line; a reference line (`mode: line`) for a goal. |
| Things ranked by a value | `ranked` `postlab.sp-94e8db89a75749738653df91bdd573fe` | Bars neutral except the one that matters. |
| Days of a habit | `calendar_heatmap` `postlab.sp-f67214017a2d418f8e7edd7c272aed8a` | `monthLabels: false` under six months. |
| A table that is really a table | `grid` `postlab.sp-68bc1b6c64d24c77b77525aea01c6d2a` | Only when the person compares across columns. |

Before binding one, read its contract (`find(op=spreads, uid=...)`): slots name *fields*, not literal text.

## Composing your own block

When no spread fits a section, compose one from the primitives instead of drawing code: `stack`, `grid`,
`cluster`, `repeat`, `when`, `text` (with a `role` and an optional `tone`), and small atoms (`card`, `iconBox`,
`progress`, `divider`, `badge`, `avatar`, `statusText`). The frontend manual lists every atom and prop:
`GET <PEEL_BASE_URL>/contract/frontend?section=index`, then `?section=components&name=<name>`, with the
`X-Toast-Token` header. Do not use a prop the manual does not list.

- A grid of siblings shares one height; a row that opens with a title keeps its quiet parts (count, chip) on the
  title's line.
- Give colour with a text `tone` rather than a chip.
- Keep the shipped spread when it is good and only your section is missing; do not rebuild a page from primitives
  to escape one weak part.

## Known limits (say so rather than work around them)

- Text roles stop at 24 px (`display`, `metric`). There is no larger, lighter figure.
- `cta_band` is a white card with an icon box; there is no filled lead band.
- `stacked_bar` in a narrow column draws horizontal bars in the brand tone whatever `orientation` and `tones` say.

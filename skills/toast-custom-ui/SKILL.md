---
name: toast-custom-ui
description: Build or change something the person will look at in Toast, such as a desk widget, a page, a dashboard, a pop-out, a mini app, a sealed atom or a window, or changes the app's look (colours, type, corners, pictures, motion or redrawn parts, packaged as one look), so it is right the first time. Use whenever the ask is to make, design, restyle or fix a UI surface on the user layer (interface pages, windows, pieces, spreads, sealed atoms). The method is to decide the design first (purpose, what leads, what sits together, each block's size, where the craft goes), check it is not a default, ask for the person's reference, reuse, build the frame first, look at the real surface, and refine it before saying done.
---

# Custom UI in Toast: right the first time

A good surface is decided before it is drawn. Someone comes to it to do something; the design is
the set of decisions that lets them do it at a glance: what they see first, what sits beside what,
how big each thing is. Polish cannot rescue a page nobody decided, and a list of things to avoid
does not produce one. So this skill starts with four principles and worked examples, then the
steps, and ends with a short checklist to run once the design exists.

## The four principles

**1. Purpose. Say what the person comes here to do, ranked.**
Write it as their questions, most important first: "is anything waiting on me?", "what is on this
week?", "how is it going overall?". Three or four at most. Everything on the surface answers one
of them; what answers none is cut. If you cannot rank them, ask (step 2), because the ranking is
the design.

**2. Hierarchy. One thing leads, and it is the thing they act on.**
The top question gets the first position and the surface's single accent. The lead is as big as
its content, not as big as its importance: one item with one action is a band one row high, and
it still leads because it is first and alone. Everything else is quieter than the lead and
ordered by the ranking. When nothing needs the person, the lead is not drawn and the next
question leads.

**3. Grouping. Things sit together when one explains the other.**
A summary belongs to the list it summarises, as that list's first line; apart from it, it is a
box with nothing to do. A control belongs to the thing it changes, on that thing's row. Things
that answer different questions are separate sections with space between them, not a border
around each. A group is shown by nearness and a shared heading before it is shown by a box.

**4. Sizing. Each block is as wide and as tall as what it holds.**
Seven days side by side need the full width; one sentence does not. A glance figure is one
line; a list is as tall as its rows. Equal boxes for unequal content say that nobody looked.
Decide each block's width from what it must show side by side, and its height from its busiest
case, then check the empty and the long case.

## Where the craft goes: a clear direction inside the app's look

A surface that follows the four principles can still look generated. What separates a designed
surface from a template is a few deliberate choices made for *this* subject. In Toast those
choices live inside the worn look: colours, font and corners come from its tokens, so a bold
direction is never a new palette or font per widget. It is craft within the system:

- **Ground it in the subject.** What the surface is about decides its form. A family week reads
  as days with names in them; a rate reads as one figure that moved; an order list reads as
  things on their way. Take the subject's own shapes, words, units and pictures (the source's
  photos, logos and icons) before reaching for a generic card. A stock watcher and a child's
  chore chart differ in form and density even under the same look.
- **Spend the boldness in one place.** One element is the memorable thing, almost always the
  lead: the one display figure, the week grid with today marked, the photo of the pick.
  Everything around it stays quiet. If you cannot name that one place, the surface has none.
- **Structure is information.** Borders, dividers, numbering, chips, eyebrows and labels are
  there because they say something about the content, never as decoration. Numbered markers
  only for a real sequence; a chip only for a state the person acts on; a divider only between
  things that differ; an eyebrow only when it says where the content is from.
- **Motion answers the person.** Opening, expanding and confirming may move, briefly, to show
  what changed. No entrance animation per section, no hover lift on every card.
- **Words are design.** Name things the way the person would, not the way the system is built
  (their "orders", not "records"). A button says what happens ("Answer", not "Submit") and keeps
  that name through the flow. Empty and error states give direction: what happened and what to
  do, without apologising. Sentence case, no filler.

These are the defaults that make agent-built UI look generated. Each is fine when the content
asks for it, never as a reflex:
- the card kit: everything chopped into identical rounded cards with the same shadow, one radius
  on everything whatever its rank, gradient washes as decoration;
- a big number with a small label and an accent as the lead when the top question is not a number;
- template chrome: a tracked ALL-CAPS label above every heading, meta chained with middle dots,
  `WORD — fragment` labels, a `→` appended to links and buttons, monospace for small data
  labels, one word of a heading picked out in another colour or weight;
- a chip, badge or status colour on every row;
- every section at full width, stacked in the order the data arrived.

Behind all of this: **the target is the person's own reference.** Ask once for pictures or
references of the look they want (step 2). What they give outranks every default here. The
shipped spreads are the floor: study the closest ones before designing (step 3) so the result is
never below them, then go toward the person's references.

## The layout note: write it before placing anything

Put these lines in your plan, and give them to the person with the picture at the end. They are
the design; the build follows them.

```
Comes here to:   1. <question>   2. <question>   3. <question>
Leads:           <block>, because <it is what they act on / the top question>
Together:        <A with B, because A summarises B> ...
Sizes:           <block>: <width>, <height>, because <its content>
Craft:           <the one place the boldness goes, drawn in this subject's terms>
Cut:             <what was asked for or available but answers no question>
```

Before building from it:
- **Sketch two arrangements** in ASCII in the plan, a few lines each, and say in one line why
  you pick one. The second sketch is what keeps the first from being a reflex.
- **Check it against a default.** Imagine a similar ask from someone else ("a dashboard", "a
  rate widget") and the note you would write for it. Any line that comes out the same is a
  default, not a decision: revise it for this subject and say what changed. The generated
  defaults above are the usual source.

### Worked example: a personal dashboard

The data: a week of family events, nine quests in four areas, one quest waiting on an answer.

A first build placed four equal full-width boxes in the order the data arrived: calendar,
progress, the waiting quest, quests by area. Every part was tidy, and the page still read as
things put down wherever they landed: the one item needing an action was third, a single
percentage had a box as big as the calendar, and the area cards sat inside another box.

The layout note that fixed it:

```
Comes here to:   1. see whether anything waits on me, and answer it
                 2. see this week, today first
                 3. glance at how the quests are going
                 4. find a quest by its area
Leads:           the waiting quest: the only thing to act on, so the only accent and action.
                 One item, so a band one row high. Not drawn when nothing waits.
Together:        overall progress with the areas: it is their summary, so it is the first line
                 of that section, not a box of its own.
Sizes:           waiting quest: full width, one row.
                 week: full width (seven columns), as tall as the busiest day, today marked.
                 quests: summary one line; areas as many columns as fit, a card each, no box
                 around the cards.
Craft:           the week: today's column carries the accent, and each day's events read as
                 short lines of text in their day, not as coloured chips.
Cut:             per-quest progress bars and status colours: the count says it; colour stays
                 for the one waiting.
```

The result has three sections instead of four boxes, and a person can say what each is for.

### Worked example: a small desk widget

Ask: "a small card for the dollar rate".

```
Comes here to:   1. read today's rate   2. see whether it moved
Leads:           the rate: the widget's whole job, so the one display figure.
Together:        the change sits on the rate's line: it explains the figure.
Sizes:           300 x 200 card; the figure one line, the change beside it, the time under it.
Craft:           the figure, set alone at the one display size; the change is plain meta text,
                 coloured only when it is a fall worth noticing.
Cut:             a chart, a currency picker, a refresh button (it refreshes on open).
```

One figure, one line of meta. A chart was available and answered neither question, so it is cut.

### Worked example: a list someone works through

Ask: "a page for my open orders".

```
Comes here to:   1. find the order that needs something from me   2. check when the rest arrive
Leads:           orders needing action, first in the list and the only rows with an accent.
Together:        each order's status and date on its own row; the total count in the heading.
Sizes:           one column of rows; a row is one line plus one line of meta.
Craft:           the rows needing action: what is needed in the person's words, the action
                 named at the row's end ("Confirm address"); the shop's logo leads each row.
Cut:             a summary strip of counts by status: the list is short enough to read.
```

More examples, with the reasoning for each choice: `reference/layout.md`.

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
3. The look. First ask for theirs: "Do you have a picture, a site or an app whose look you want
   here?" (free text; a path or a link is enough). What they give is the target. If they have
   none, offer 2–3 options, each one a reference: "like the app's own panels (recommended)", a
   named spread, with a `preview` mockup drawn from real components.
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

Load `toast-spread-composing`. Search `find(op=spreads)` by **form**, in the user's intent words,
once for each block in your layout note. Read the two or three closest with
`find(op=spreads, uid=..., sections=[render])` and look at how they handle hierarchy, spacing and
the empty case: they are the floor your result must not fall below, and usually the part itself.
On a page, a block whose spread is already cards or a band (a card grid, day cards, one action
band) takes `surface: none`, so no box is drawn around the cards.
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

Don't use kpis or watchlist in a small widget: they break checklist lines 5 and 6. On a page they are fine. Write a sealed atom only for the
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

  Borrow structure, never their type scale: checklist line 3 holds unless the person's own reference says otherwise.
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
  - Keep CSS flat: one class per element, no type selector fighting a class over padding or
    margin. Uneven gaps between sections usually come from two rules cancelling each other.
- **Proven pins**, copied from `reference/references.md` §2: Radix colours, lucide UMD, htm-preact, Chart.js, ECharts,
  uPlot, Motion UMD, floating-ui.
- **Content** is built last, at two type sizes, with short numbers, words for actions, and one accent.
  Build with the real data and the person's real names from the start: placeholder copy hides
  the long name, the empty day and the wrapping title until the person finds them.
- **Quality floor**, without announcing it: a visible keyboard focus on every control, reduced
  motion respected, contrast met, nothing breaking at the narrowest size the place allows.

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

1. `python scripts/ui-lint.py <atom.js | folder>` checks the code against the checklist (T1–T7) and the rubric. It exits 1 on a major.
2. `python scripts/shot-check.py <shot.png>` measures the capture: surface bands (card in a card), insets and right edges.
3. Score the rubric from `reference/see-it-loop.md` §2, one line each with its evidence:
   R1 window chrome, R2 hierarchy, R3 app font, R4 tokens, R5 one surface, R6 spacing, R7 alignment,
   R8 overlap, R9 truncation, R10 empty/loading/error, R11 contrast, R12 light and dark, R13 icon meaning,
   R14 copy, R15 fits the place, R16 less text, R17 no drama.
4. Put the capture beside the §4 references and ask: does it look like it belongs next to the app's own surface?
5. Read the capture against the layout note: is the lead the first thing the eye lands on, is each
   group readable as a group, does each block's size match its content? Can you point to the
   one place the craft went, and is any generated default left that nobody chose? A page that
   passes every check above and fails this one is not done.

**Any blocker or major means you fix it and capture again.** "Not yet seen running" means not done.

### Iterate until it is good, before anyone sees it

Passing the checks is the floor, not the finish. The first build is a draft, and only your best
version goes to the person. After each capture:
1. Look at it as a demanding designer would. Name the three weakest things in the picture, the
   ones a person would notice first: a ragged row of cards, a title wrapping around a chip, a
   count hanging off a line, a block too big for what it holds, uneven gaps, a lead that does
   not lead.
2. Fix those three, capture again, and put the new capture beside the old one. Keep whichever is
   better. Fix by refining what is there (an alignment, a gap, a weight, a cut) before adding
   anything: when the instinct is to add a shape, a chip or a colour, ask instead how to make
   what is already there more finished.
3. Before each new capture, remove one thing the surface reads fine without: a label, a
   divider, a chip, a line of meta.
4. Repeat. Do at least two rounds, and stop only when you would put it beside the person's
   reference or the closest shipped spread without it looking worse. It should look finished,
   not merely correct.

Show the person one result, not drafts. List the rounds in the report, one line each: what was
weak and what changed.

## 8. Report

The result names:
- the final capture file(s), with the layout note beside them: the person judges the reasoning
  and the picture together;
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
   - A look is the one place a new palette is right. Name its direction in one line, rooted in
     the person's words or reference, and set 4–6 named values before seeding. Check them against
     the generated palettes (warm cream with a serif and a terracotta accent, near-black with one
     acid green or vermilion, purple gradients); use one only when the person asked for it.
   - Accents go through seeds (all seven tones); surfaces and text are hand-set, as one set, each ≥ 4.5:1.
   - Motion is state changes only, ≤ 300 ms, including a celebration. A loop is allowed only while bound to a working state.
   - Images are embedded data URLs.
   - Code is a fork with every unused part deleted; install only after the yes.
4. **See it before it is worn.** Read the revision just before validate and before apply, then validate the whole look. Previews:
   piece-probe under the look, a labelled "approximate colour" for seeds, and a "not yet worn" frame sheet for art and code.
5. **Score**: the §7 rubric on the person's own surfaces, plus L1 reach, L2 legibility and L3 motion.
6. **Packaging**: today's calls still say theme and skin. Those names are for you only (`look-recipes.md` §6).

## Checklist: run it after the design exists

These are the person's standing preferences. They do not make a design; they catch slips in one.
A reference the person gave for this surface outranks any line here (`reference/TASTE.md` has
their own words).

1. **Frame first.** A real window bar: icon, title, pin, close. A desk card's host bar draws these; the icon is the
   page's menu `icon` (dev-hj 63084d9611 and later; older builds show none). Under it, one toolbar, then the content. Get the header right before polishing anything.
2. **Fold sparingly; icons and controls in line with the text.** Content is open by default; fold only what is
   long and secondary, one level deep. Icons are welcome: each icon and control sits on the same line as its
   text, on the baseline, at the text's size, in a consistent place (leading icon before the label, actions at
   the row's end). No grip strips or kebab dots; put those actions in the right-click menu.
3. **Two type sizes.** 13 px body and 12 px meta. Weight 400, 500 for names, and 600 only for the window title.
   Use the worn look's font (Pretendard unless the look changes it): `font: inherit` in a piece; in a frame, which cannot inherit, `font-family: var(--type-family-sans, Pretendard, system-ui, sans-serif)` with Pretendard loaded (§5). The one exception
   is one display figure when it is the widget's whole job (a clock, one count, a metric spread's headline):
   one number, weight 400, at most 40 px. Every other line stays 13/12.
4. **Less text.** Use 877k and 1.5M; exact values go in `title=`. State a unit once, not on every row.
   Detail goes on hover or in a menu.
5. **No drama, no template chrome.** No glows, gradients, share bars, extra chips or badges unless
   they carry the decision. Colour goes on one thing (the brand), with warning colour only where
   something is wrong. None of the generated defaults (the card kit, ALL-CAPS labels, dot-chained
   meta, `→` on buttons, numbers on things that are not a sequence) without a reason.
6. **One surface.** Never a card inside a card. A widget's window *is* the card.
7. **Keep what works.** Behaviour the user approved stays: right-click, cache, refresh on open.
8. **Their reference is the target.** You asked once for the look they want and built toward it;
   nothing lands below the closest shipped spread.
9. **Placed with a reason.** The layout note was written before placing and goes to the person with the picture.
10. **Grounded, and bold once.** You can name what in this subject shaped the form and the one
   place the boldness went. Words name things the person's way; buttons say what they do.
11. **Keep good designs; never regress.** A design the person likes is reused, not redrawn. Replace it only with
   something clearly better, checked side by side before showing; if it is not better, the old one stays.

---
name: toast-custom-ui
description: Design and build something a person will look at in Toast — a page, a dashboard, a desk widget, a pop-out, a mini app, a sealed atom or window — or change the app's look (colours, type, corners, pictures, motion, redrawn parts). Use whenever the ask is to make, design, restyle or fix a UI surface on the user layer (interface pages, windows, pieces, spreads, sealed atoms, looks). The method is to decide the design, pick a finished picture to beat, build with real data, then look at the real surface and critique it against that picture until it holds up, and show the person the picture.
---

# Design in Toast

People judge a surface with their eyes in two seconds: what is this, what matters, what do I do. Your job is a
surface that answers that at a glance and looks finished next to the app's own screens. Rules alone do not get
there; a decided layout, a picture to beat and an honest look at your own result do.

## The bar: what a finished Toast surface looks like

Hold every surface to this. It is stated as what to do; the generated defaults below are what to catch.

1. **One lead.** The first thing the eye lands on is the answer to the person's top question: the thing to act on,
   or the one figure that matters. It stands apart by position, by being alone, and by carrying the surface's one
   accent. Everything else is quieter.
2. **The headline states the finding.** A section or page opens with what the content says ("84만 원 썼어요,
   지난달보다 12만 원 적어요"), not with what it is ("지출 요약").
3. **One surface per thing.** A page block is already titled and laid on one sheet; content that is its own cards
   or band takes `surface: none`. Never a card inside a card, never sheets of equal weight for unequal things.
4. **Colour means something.** Brand on the lead. Warning or danger only where something is wrong or waiting on
   the person. Everything else neutral. A colour on every row, bar or chip says nothing.
5. **Type from the app's roles, not sizes.** Use the renderer's text roles (`display` / `metric` for the one
   figure, `sectionTitle`, `title`, `body`, `caption` / `label` for meta) and the look's font. In your own code:
   13 px body, 12 px meta, one display figure at most, weights 400/500 (600 only for a window title).
6. **The subject shapes the form.** A week reads as days with things in them; money as one figure and the
   purchases behind it, with the shop's photos; a plan as what is done, what is mine, what is next. Use the
   source's own pictures, names and units.
7. **Craft lives in one place, and it is kept.** Name the one element that makes this surface good (the week with
   today marked, the photo-led rows, the figure set alone). Refine it; never strip it to satisfy a rule.
8. **Less text, open by default.** Short numbers (877k, 1.5M; exact value on hover), a unit stated once, details on
   hover or in a menu. Fold only what is long and secondary, one level. Controls and icons sit on their text's line;
   actions are words.

### Generated defaults to catch

These make agent-built UI look generated. Each is fine when the content asks for it, never as a reflex:
- everything chopped into identical rounded cards, or every section the same full-width white sheet;
- a big number with a small label as the lead when the top question is not a number;
- template chrome: tracked ALL-CAPS eyebrows on every heading, meta chained with middle dots, `→` on buttons and
  links, monospace for small labels, one word of a heading picked out in colour;
- a chip, badge, status colour or bar on every row;
- sections stacked in the order the data arrived, all at full width;
- the opposite failure: a page stripped so bare that nothing leads and nothing is shown with care.

## The method

### 1. Read the ask as checkpoints
Restate each point in the person's words: "small", "one list", "this week", "on my desktop". Report against each
at the end. A point you change or drop is said, never silent.

Ask only when the purpose is unclear, it replaces something they have (a page, the menu, their look), it reaches
outside the PC, the data source is unknown (whose stocks, which account), or the surface is decorative with no
reference. Ask in plain words and invite a picture: "Do you have a screenshot, site or app whose look you want
here?" Otherwise take the defaults and name them in the result: the worn look, the app's UI language for copy and
dates, the nearest app pattern, refresh on open, the person's saved place for place-bound data.

### 2. Decide the design before placing anything
Write the layout note in your plan; it goes to the person with the picture.

```
Comes here to:   1. <question>   2. <question>   3. <question>
Leads:           <block>, because <it is what they act on / the top question>
Together:        <A with B, because A summarises B> ...
Sizes:           <block>: <width>, <height>, because <its content>
Craft:           <the one place the care goes, in this subject's terms>
Cut:             <what was available but answers no question>
```

Sketch two arrangements in a few ASCII lines and say why you pick one. Then check the note against a default:
write the note you would give a similar ask from someone else; any line that comes out the same is not a
decision yet. `reference/layout.md` has the reasoning on more cases.

### 3. Pick the picture to beat
Before building, find a finished surface to hold yours against:
- the person's own reference, if they gave one: it outranks everything here;
- `examples/gallery/` — finished Toast pages with the note that made them; open the pictures;
- the closest shipped spreads, searched by form (`find(op=spreads, query=<form in the person's words>)`, one search
  per block of your note) and read with `find(op=spreads, uid=…, sections=[render])`. Draw the two closest with
  your data before deciding; a spread you have not seen drawn is a guess.

Name the picture you are beating in your plan. A spread the person has praised is kept, not redrawn.

### 4. Build with real data, the frame first
Use the person's real data and names from the first build: placeholders hide the long name, the empty day and the
wrapping title. Get the frame right before the content. The details for each kind of surface:

| Building | Read |
|---|---|
| A page, a dashboard, a list someone works through | `reference/page.md` |
| A desk widget, a pinned card, a pop-out, a wallpaper window | `reference/widget.md` |
| A drawing no spread makes: a sealed atom or piece, outside libraries | `reference/sealed.md` |
| The app's look: colours, type, pictures, motion, redrawn parts | `reference/looks.md` |
| How to picture each surface | `reference/capture.md` |

Write your own drawing only for the part no spread draws, and say why in one line. Never a second token system,
engine or hand-made mockup.

### 5. Look, critique, refine
Picture the real surface the person will see (`reference/capture.md`); a different surface does not count. Then
put your picture beside the picture you are beating and answer, in writing, from the picture:

1. What does the eye land on first? Is it the lead from the note?
2. Can you say in one line what each section is for? Does each look like a group?
3. Is the accent on the lead alone? Is any colour there that the content did not ask for?
4. Does each block's size match what it holds? Any box too big for one line, any empty half?
5. Do edges line up: text starts, number columns, gaps between sections?
6. Is anything cut, wrapped badly or overlapping: long names, counts, chips beside titles?
7. Is any generated default left that nobody chose?
8. Where did the craft go, and does it read as made with care, not merely correct?

Name the three weakest things, fix them, picture again, and keep whichever version is better. Refine what is
there before adding anything. Stop only when you would put your picture beside the one you are beating without
yours looking worse; at least two rounds. Check the empty case and the longest real name before you finish.

If the platform stops you (a spread lacks a knob, a size is missing), say so in the result instead of working
around it with a weaker design.

### 6. Show the picture and ask
Show the person the final picture with the layout note and the checkpoints. Ask what they think in plain words.
No option cards for taste: they say when they accept. Say what you did not see (dark look, narrow width, a state
you could not reach). One result, not your drafts; list the rounds in a line each.

## Looks in short
A look is how the whole app reads: values (colour, type, spacing, corners), images, motion, and optionally redrawn
parts, as one package. Start from a shipped look and fill as few layers as the ask needs. A look changes what the
person already has, so it is always asked first, in plain words with pictures of it applied, and it always has a
way back. Everything else is in `reference/looks.md` and `reference/look-recipes.md`.

## Before you say done
- The layout note exists and the picture matches it.
- You compared against a named picture and wrote the critique.
- No generated default is left without a reason.
- The checkpoints are answered, the defaults named, what was not seen said.

For desktop widget sets, also follow [Desktop widgets](../toast-desktop-widgets/SKILL.md).

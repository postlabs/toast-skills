# The user's taste: standing rules for every UI this route produces

What people keep finding wrong in agent-built UI:

> You tend to use a lot of chevrons, you tend to use a lot of different font sizes, you tend
> to use a lot of text. Also, you kind of dramatize certain things too much, whereas what users
> want will be a sleek, minimalistic, but still very, very well represented designs. You have the
> components, you have the work, it's just that your priorities are all wrong most of the time.

## Rules
1. **Structure first: the frame, then the content.** A real window bar comes first: icon,
   title, pin, close. Under it, one toolbar. Under that, the content. Get the header right
   before polishing anything else.
2. **No chevrons.** No chevrons, carets or arrow glyphs: not on rows, buttons, folds or links.
   This is about chevrons only. Icons are fine and often better than words; use clear,
   familiar icons from the app's own set wherever they read at a glance, and a word only where
   no icon would.
3. **Two type sizes.** 13 px for body text and 12 px for meta. Weight 400, 500 for names, and
   600 only for the window title. Use the worn look's font (Pretendard by default) by inheriting it: a
   piece's shadow root inherits the app's font and its token CSS variables
   (`--text-neutral`, `--bg-neutral-base`, `--text-brand`, ...), so use `font: inherit` and
   `var(--token, fallback)`.
4. **Less text.** Use short numbers (877k, 1.5M); exact values go in the hover title. Cut
   repeated units ("files · lines" on every row). Detail goes on hover or in a menu.
5. **No drama.** No share bars, glows, extra chips or badges unless they carry the decision.
   Colour goes on one thing: the brand on the branch, warning only when something is dirty.
6. **One surface.** Never draw a card inside a card. A widget's window is the card.
7. **Keep what works.** Logic the user approved stays: right-click, the cache, refresh on open.

## Worked example
Dev Tree v2: `dev-menu-interface/project_tree/devtreelist/atom.js`. Shots are in the lead's
tray `mock/devtree-v2*.png`.

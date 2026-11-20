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
2. **Fold sparingly; keep icons and controls in line with the text.** Show content open by
   default. Fold only what is long and secondary, and then one level, never fold inside fold;
   a page full of expand toggles is the failure. Icons are welcome: set each icon and control
   on the same line as the text it belongs to, on its baseline, at the text's size, in a
   consistent position (leading icon before the label, actions at the row's end). Nothing
   floats above, below or off to the side of its text.
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
8. **Ask for the look, and study good ones first.** Before designing, ask the person once for
   images or references of the look they want: screenshots, an app or site they like, a sketch.
   Use what they give as the target. Then study the shipped spreads as examples of good design
   (`find(op=spreads)` by form, read the closest ones and their render trees) and build to that
   level; a result that looks worse than the shipped spread for the same form is not done.

## Worked example
Dev Tree v2: `dev-menu-interface/project_tree/devtreelist/atom.js`. Shots are in the lead's
tray `mock/devtree-v2*.png`.

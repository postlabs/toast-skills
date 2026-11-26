# Desk widgets, pinned cards, pop-outs and wallpaper windows

A desk window shows one page outside the app window. The window is the card: what you put in it sits directly on
its surface.

## The frame
- Open or change one window with `patch.add_windows: [{id, page, kind, ...}]`. On an id that exists it keeps the
  fields you leave out, so changing `kind` or `on_top` never moves it. `remove_windows` closes ids. Never resend the
  whole `windows` list for one window.
- Kinds: `card` (a small window with a real bar), `pinned` (stays on top), `wallpaper` (behind everything),
  `normal`.
- A card's bar draws the icon, title, pin and close. The icon is the page's menu `icon`, or the page's own `icon`
  when only a window draws it. Under the bar: at most one toolbar, then the content. Check the bar before any row.
- Keep the frame’s header pinned while the body scrolls. Put long content in the body’s scroll area and keep its scrollbar visible whenever content overflows. Scroll a populated widget midway in the desktop preview and verify its title and window controls stay in place.
- Sizes: `card` at 380×520 by default; "small", or one figure, is `place` 300×200 (a card takes its content's
  height up to that). Choose each block's size from what it shows at that width, and check the narrowest.

## What fits in a small window
- One job, three or four things to touch at most. A widget is glanced at; a page is worked in.
- One figure that is the widget's whole job may be set at the display size; everything else at body and meta.
- A spread meant for a page often draws its own border or is too large for a card: in a card, the
  `metric` spread draws a second border, and `progress_ring` is about 50 px with no size knob. Write a small drawing
  for those and say why (`reference/sealed.md`).
- `task_list` in a 380 px card wants `layout: flow` so due words stay on the task's line.
- Never a card inside the card. No grip strips or kebab dots: those actions go in the right-click menu.

## Picturing it
`interface(op=apply)` returns a small picture of every desk window it touched. To judge one, picture it at full
size with `interface(op=preview, windows=[id], full=true)`; see `capture.md`. A picture of the app window or of a
canvas pane is not a picture of the widget.

## Keep what works
Behaviour the person approved stays when you restyle: right-click menus, caching, refresh on open.

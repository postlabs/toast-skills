# Desk widgets, pinned cards, pop-outs and wallpaper windows

A desk window shows one page outside the app window. The window is the card: what you put in it sits directly on
its surface.

## What a desk tool is made of
A desk tool has up to three parts. Settle each from the ask before building; a tool with no model work gets no
agent part.

- **Visual**: what appears. Start from the look and interaction the person asked for. A bespoke design is your own
  drawing (`reference/sealed.md`); a shipped spread is used where it already draws that design, such as a calendar,
  a table or a chart. One page can mix both.
- **Code**: what runs on a click, a schedule or an event. A dough is the usual route for live data, refresh and
  actions: write it with the dough-authoring skill and give it to the block as the feed that fills it (`source:`).
  A piece's own frontend code, an installed kit or a Toast operation also serve. A dough step runs Python or
  browser JavaScript; nothing launches other programs, so say so when the ask needs one.
- **Agent**: work handed to a model, such as interpreting, summarising or writing. Add it only to the action that
  needs it. Showing a saved answer, refreshing a source and arithmetic run without one.

Keep the parts apart: the drawing takes its data and actions as inputs, so the person can restyle it without
touching what runs, and another view can use the same data. Use what is already there when it fits (a shipped
spread, an installed dough or kit); build what does not.

A widget is one way a tool appears; the same tool can also be a page. The person's data, sign-ins and settings
belong to their own copy and are never part of what is shared.

## The frame
- Open or change one window with `patch.add_windows: [{id, page, kind, ...}]`. On an id that exists it keeps the
  fields you leave out, so changing `kind` or `on_top` never moves it. `remove_windows` closes ids. Never resend the
  whole `windows` list for one window.
- Kinds: `card` (a small window with a real bar), `pinned` (stays on top), `wallpaper` (behind everything),
  `normal`.
- Use the shared window header. Keep the icon and title visible. Group Pin, Resize and Close at the trailing edge as supported. Give each control a non-draggable hit area and keep the title draggable.
- Reveal controls on header hover or keyboard focus, and keep them visible during resize. Use the window icon menu to choose **Always** or **Never**, including by keyboard. Authors can set `controls_visibility` to `"hover"` (default), `"always"` or `"never"` on a card in `patch.add_windows`.
- Give each window action one home. Keep the body for content. Check the idle, hover and keyboard states at the narrowest supported width.
- The icon is the page's menu `icon`, or the page's own `icon`
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

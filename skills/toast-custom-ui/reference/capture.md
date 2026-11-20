# Capture: how to picture each surface (from toast-custom-ui SKILL §6)

Every capture goes through the Toast backend (peel tools or its local HTTP API at `PEEL_BASE_URL`, default
`http://127.0.0.1:18587/api/v1`): no Toast source checkout, no OS screenshot, nothing changed. Every `/api/` call
sends `X-Toast-Token: $TOAST_API_TOKEN`.

| Surface | Capture |
|---|---|
| Desk window (card, pinned, wallpaper) | `interface(op=apply)` already returns a small `desk_pictures` JPEG for every window it touched. To score it, call `interface(op=preview, windows=[id], full=true)`: a PNG at the window's own device pixels, with 1 px borders and type sizes intact (older backends: `node scripts/see-it.mjs desk [ids]`). It shows each window's own page as it draws now, even when covered; the ids are `config.windows[].id`. A wallpaper is pictured from a copy of its page. |
| App window | `interface(op=preview, windows=["app"], full=true)` (older backends: `interface(op=preview)` or `node scripts/see-it.mjs app`). It shows whatever page the window shows now (`page=` is ignored), so check `snapshot_state.page` / `page` before scoring. To see your page, put it in a desk window and use `see-it.mjs desk`. |
| App-window piece, before approval | `interface(op=preview, piece={jar, family, atom, data, width, height?})` draws it alone in a sandbox with no network, approved or not, for you only. It returns the PNG, errors, console and the action calls it made (recorded, not run). Use it for every state's data. It approves nothing and the person never sees it. |
| App-window piece, under any look | `node scripts/piece-probe.mjs cases.json` draws it headless (Edge or Chrome), with each case's `look`: one of the 8 shipped looks (values in `reference/look-values.css`) or your own look's package over the one `under` it, and Pretendard served by the backend. Shipped looks: `classic` (light), `nocturne` (dark), `office`, `pastel`, `sage`, `sunset`, `rpg`, `rpg-paper`; there is no `default`. If its report says `font: fallback`, the backend did not answer: do not score R3 from it. |
| Canvas pane (spread) | `render(..., picture: true)`. The receipt's `instance_keys` shows what each instance read: if your data's keys are missing, the binding is wrong. A canvas pane adds a card frame a desk window does not, so judge a window only by its desk picture. |
| Sealed atom draft | `render(..., picture: true)` draws this conversation's draft families. Older backends say "not installed"; there, load the frame headless with `scripts/probe_frame.mjs <frame url> <png> <json> [dark]` and post your own data. The frame URL is the backend's `http://atoms.localhost:<port>/api/v1/sealed/frame?jar=…&family=…&atom=…&chat=…`. |
| No desktop app (a backend on its own) | Nothing is on a screen, so `see-it.mjs` answers `unavailable`. Score the `piece-probe.mjs` and `render` pictures, and say in the result that the live window is not seen. |

Picture paths under `tool-results` can pass Windows' 260-character limit. Copy a picture to a short path before a script opens it.

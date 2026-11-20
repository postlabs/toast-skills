# Design route: the order for any custom page, widget or app

The full procedure is `skill-draft/toast-custom-ui/SKILL.md`, which will be installed as a skill (`skill-draft/INSTALL.md`).
This page is the one-screen order, with the file that holds the detail for each step.

| # | Step | Done when | Detail |
|---|---|---|---|
| 0 | Read the taste rules | Frame first; fold sparingly, icons in line with text; 13/12 px in the app font; less text; no drama; one surface; keep what works | `TASTE.md` |
| 1 | Echo the ask | Every point of the request is a numbered checkpoint | `failure-audit.md` fix 5 |
| 2 | Ask, or state the default | One AskUserQuestion card (purpose, place, look as 2–3 references, data), or defaults written down | `see-it-loop.md` §3 |
| 3 | Reuse first | Spread found by intent (widget, dashboard, tracker, to-do, schedule). Code only for the rest, with the reason | `spread-recipes.md`, `spreads-audit.md` |
| 4 | Choose a look | 3 lines: nearest app surface + 1–2 outside references, each with what to borrow | `references.md` §3–5 |
| 5 | Build frame-first | Window bar, then toolbar, then content. Tokens with light and dark fallbacks. Sealed pins proven | `references.md` §1–2 |
| 6 | See it | A capture of the real surface: desk window, page, pane or sealed draft. States: hover, 1/3/8+, long name, empty/loading/error, light/dark | `see-it-loop.md` §1, `scripts/see-it.mjs`, `scripts/piece-probe.mjs`, `scripts/probe_frame.mjs` |
| 7 | Score, fix, re-capture | `ui-lint.py` clean of majors, `shot-check.py` measured, R1–R15 scored. No blocker or major left | `see-it-loop.md` §2, `ui-lint.py`, `shot-check.py` |
| 8 | Report | Final capture, checkpoints ✓, defaults and references named, "not seen" lines explained | SKILL.md §8 |

Why this order: of 85 audited failures, 51 % had no look at the real surface, 42 % had guessed taste, 25 % didn't reuse,
and 22 % misread the request (`failure-audit.md`). Steps 6–7, 2 + 4, 3 and 1 answer those four in turn.

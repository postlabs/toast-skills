# Toast Skills

Skills for agents building with [Toast](https://postlabs.io): desk widgets, pages,
pop-outs and mini apps that come out right the first time.

| Skill | What it does |
|---|---|
| `toast-custom-ui` | Design for anything a person looks at in Toast: pages, dashboards, desk widgets, sealed drawings and looks. Decide the layout, pick a finished picture to beat, build with real data, then picture the real surface and critique it against that picture until it holds up. |

## Install

In Toast: ask a session to add the plugin `toast-skills@toast-skills` from
`https://github.com/postlabs/toast-skills`.

Claude Code:

```
claude plugin marketplace add https://github.com/postlabs/toast-skills
claude plugin install toast-skills@toast-skills
```

Codex:

```
codex plugin marketplace add https://github.com/postlabs/toast-skills
codex plugin add toast-skills@toast-skills
```

Antigravity (agy) and Gemini CLI read the same repo: `plugin.json` is the
[Agent Plugins 1.0](https://agent-plugins.org) source, and `gemini-extension.json` is generated from it.

The skill needs only a running Toast backend: no source checkout, no app window in front.

## Layout

```
plugin.json              the one source; edit this
skills/toast-custom-ui/
  SKILL.md               the bar, the method, the generated defaults to catch
  reference/             page, widget, sealed drawings, layout reasoning, capture routes, outside libraries, looks
  examples/gallery/      finished pages: picture, layout note, page patch and data
  examples/looks/        look packages
  scripts/               see-it.mjs (capture through the backend), shot-check.py, ui-lint.py, probes
tools/build-plugins.mjs  writes .claude-plugin/, .codex-plugin/, gemini-extension.json; --check for CI
```

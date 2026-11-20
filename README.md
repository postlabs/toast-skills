# Toast Skills

Skills for agents building with [Toast](https://postlabs.io): desk widgets, pages,
pop-outs and mini apps that come out right the first time.

| Skill | What it does |
|---|---|
| `toast-custom-ui` | The method for any UI a person looks at in Toast. Echo the ask, then ask or state the defaults. Reuse a spread recipe and pick a reference look. Build the window frame first, then capture the real surface and score it against a checklist before saying done. |

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
  SKILL.md               the procedure
  reference/             taste rules, spread recipes, outside references, the see-it loop, capture routes, looks in detail, look recipes, the shipped looks' values
  scripts/               see-it.mjs (capture through the backend), shot-check.py, ui-lint.py, probes
tools/build-plugins.mjs  writes .claude-plugin/, .codex-plugin/, gemini-extension.json; --check for CI
```

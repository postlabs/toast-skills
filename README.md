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
```

## Layout

```
skills/toast-custom-ui/
  SKILL.md        the procedure
  reference/      taste rules, spread recipes, outside references, the see-it loop
  scripts/        see-it.ps1 (capture any window), shot-check.py, ui-lint.py, probes
```

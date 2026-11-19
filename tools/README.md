# One source, every CLI

The plugin is written once, as an [Agent Plugins 1.0](https://agent-plugins.org) package.
`build-plugins.mjs` writes the few files Claude Code and Gemini CLI need on top of that.
The output is committed, because marketplaces clone the repo and run no build.

```
plugin.json        source: name, version, description, author, keywords, extensions
skills/<name>/     source: Agent Skills
mcp.json           source (optional): stdio / streamable-http servers, ${PLUGIN_ROOT} ${PLUGIN_DATA}
---- generated (do not edit) ----
.claude-plugin/plugin.json, marketplace.json, mcp.json   Claude Code (and the marketplace Codex reads)
.codex-plugin/plugin.json                                Codex store card (interface) only
mcp_config.json                                          agy's native MCP file (only with servers)
gemini-extension.json                                    Gemini CLI
```

```
node tools/build-plugins.mjs            # write
node tools/build-plugins.mjs --check    # CI: exit 1 when a generated file is stale
```

Client-only data goes under `plugin.json` → `extensions`:

| Namespace | Used for |
|---|---|
| `dev.toast` | `marketplaceName` (default: the plugin name) |
| `com.anthropic.claude-code` | `owner`, `marketplace` (extra entry fields), `plugin` (extra plugin.json keys) |
| `com.openai` | Codex `interface` (display name, card text, category, prompts) |
| `com.google.gemini-cli` | `contextFileName`, `excludeTools`, … |

Rules for the source `mcp.json`: use `stdio` or `streamable-http`. agy rejects `sse`, and Codex
has no SSE transport. Paths inside the plugin are `${PLUGIN_ROOT}/…` in args and env. Codex
and Gemini cannot expand `${PLUGIN_DATA}`.

Install, per CLI:

```
claude plugin marketplace add https://github.com/postlabs/toast-skills && claude plugin install toast-skills@toast-skills
codex  plugin marketplace add https://github.com/postlabs/toast-skills && codex plugin add toast-skills@toast-skills
agy    plugin install <a clone of the repo>
gemini extensions install https://github.com/postlabs/toast-skills
```
VS Code, Cursor, Copilot and Kiro list Agent Plugins support, so they take the source as is
(not verified here).

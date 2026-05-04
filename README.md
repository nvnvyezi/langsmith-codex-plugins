# langsmith-codex-plugins

Trace [OpenAI Codex](https://openai.com/codex/) transcripts to LangSmith. Inspect agent turns, tool calls, model metadata and subagent threads within LangSmith.

## Prerequisites

- Node >= 22.x
- Codex >= 0.128
- A LangSmith account and API key

## Installation

Add this marketplace to Codex:

```bash
codex plugin marketplace add langchain-ai/langsmith-codex-plugins
```

Enable plugin hooks and the Tracing plugin in `~/.codex/config.toml` or your project's `.codex/config.toml`:

```toml
[features]
plugin_hooks = true

[plugins."tracing@langsmith-codex-plugins"]
enabled = true
```

Set your LangSmith credentials and enable tracing:

```bash
export LANGSMITH_API_KEY="<your-api-key>"
export TRACE_TO_LANGSMITH=true
```

Complete a Codex turn, then look for runs in the `codex` project in LangSmith.

## Configuration

Tracing is disabled unless `TRACE_TO_LANGSMITH` or `enabled` is set to true.

| Setting        | Environment variable                                         | JSON config key | Default           |
| -------------- | ------------------------------------------------------------ | --------------- | ----------------- |
| Enable tracing | `TRACE_TO_LANGSMITH`                                         | `enabled`       | `false`           |
| API key        | `LANGSMITH_CODEX_API_KEY`, `LANGSMITH_API_KEY`               | `api_key`       | unset             |
| API endpoint   | `LANGSMITH_CODEX_ENDPOINT`, `LANGSMITH_ENDPOINT`             | `api_url`       | LangSmith default |
| Project        | `LANGSMITH_CODEX_PROJECT`, `LANGSMITH_PROJECT`               | `project`       | `codex`           |
| Metadata       | `LANGSMITH_CODEX_METADATA`, `LANGSMITH_METADATA`             | `metadata`      | unset             |
| Replicas       | `LANGSMITH_CODEX_RUNS_ENDPOINTS`, `LANGSMITH_RUNS_ENDPOINTS` | `replicas`      | unset             |

JSON config files are loaded from `~/.codex/langsmith.json` and then `<project>/.codex/langsmith.json`. Environment variables take precedence over both.

```json
{
  "enabled": true,
  "project": "codex"
}
```

`LANGSMITH_CODEX_*` variables take precedence over the matching standard `LANGSMITH_*` variables. Prefer environment variables or global config for API keys, especially in shared repositories.

## LangSmith API Keys

To create an API key:

1. Go to [smith.langchain.com](https://smith.langchain.com).
2. Sign in or create an account.
3. Open **Settings** -> **API Keys**.
4. Click **Create API Key**.
5. Set it as `LANGSMITH_API_KEY`, `LANGSMITH_CODEX_API_KEY`, or `api_key` in a local config file.

## Data Sent

When enabled, the plugin uploads completed Codex transcript data to LangSmith, including messages, tool call inputs and outputs, model metadata, token usage metadata and subagent thread structure. Do not enable tracing for sessions that contain data you do not want stored in LangSmith.

## Troubleshooting

- No runs appear: confirm `plugin_hooks = true`, the plugin is enabled and `TRACE_TO_LANGSMITH=true` is visible to the Codex process.
- Authentication fails: check that `LANGSMITH_CODEX_API_KEY` or `LANGSMITH_API_KEY` is set and valid.
- Runs are in the wrong place: set `LANGSMITH_CODEX_PROJECT` or `project`.
- Custom endpoint not used: set `LANGSMITH_CODEX_ENDPOINT` or `api_url`.

## Development

```bash
pnpm install
pnpm test
pnpm lint
pnpm build
```

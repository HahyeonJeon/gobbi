# CLI as Runtime API (agent-facing)

Feature description for the gobbi CLI's role as an agent-facing runtime contract. Read this to understand which operations the CLI handles on behalf of agents, and why agents should always use CLI commands rather than manual alternatives.

---

> **Every manual alternative an agent might reach for has a CLI command that handles naming, metadata, and format consistency correctly.**

The gobbi CLI is not a user convenience layer — it is the runtime interface agents use to do things that are hard to do correctly by hand. Manual `mkdir` misses `metadata.json`. Manual file writes miss round-suffixed naming conventions. Manual transcript inspection misses the JSONL schema. The CLI exists precisely to encapsulate these details so agents do not get them wrong.

The "hard-for-agents" helpers that ship in v0.5.0:

`gobbi image` analyzes images (metadata extraction, resize), compares images side-by-side as comparison sheets. Agents cannot do this with Read — images require specialized tooling.

`gobbi video` analyzes video files and extracts frames. Frame extraction is a multi-step process with format-specific edge cases; the CLI handles it.

`gobbi web` takes screenshots of web pages and captures images from URLs. Agents working on visual tasks or UI review need a way to see what a page looks like; `gobbi web screenshot` provides it.

`gobbi note` captures subagent output from JSONL transcripts (`gobbi note collect`) and extracts plans from session transcripts (`gobbi note plan`). The transcript schema is not self-evident; the CLI knows where to look and what to extract.

`gobbi notify` sends Slack, Telegram, and Desktop notifications with properly formatted payloads. Agents should fire notifications at workflow milestones without needing to know channel-specific APIs.

`gobbi validate` checks agent, skill, gotcha, and doc files against their expected structure. Structural problems caught before a session are cheaper than failures discovered mid-workflow.

The intent-first access pattern matters here: the `_gobbi-cli` skill maps agent intent to CLI command. When an agent does not know which command to use, it loads `_gobbi-cli` and looks up the intent — it does not invent commands or reach for shell utilities.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../v050-cli.md` | Full command structure, plugin-CLI boundary, verification command support |
| `../../skills/_gobbi-cli/SKILL.md` | Intent-first CLI reference organized by what agents need to accomplish |

# CLI as Runtime API (agent-facing)

Feature description for the gobbi CLI's role as the complete agent-facing runtime API. Read this to understand the full scope of CLI operations — from driving the workflow state machine to rendering docs to running helpers agents cannot do alone — and why the CLI surface is being redesigned alongside the v0.5.0 feature set.

---

> **The gobbi CLI is not a user convenience layer — it is the entire runtime contract agents operate against.**

Agents do not reach for raw shell utilities, write files by hand, or invent command names. Every category of operation — driving the workflow, reading and writing configuration, managing memory, rendering docs, and running specialized helpers — has a CLI group dedicated to it. The command names and parameter names across all five categories are being redesigned (name TBD — CLI is being redesigned) to align with the new feature set: the deterministic state machine, three-tier configuration, three-tier memory, JSON-source rendering, and the hard-for-agents helpers.

---

## Workflow control

This is the spine of orchestration. The workflow group drives the deterministic six-step cycle described in `deterministic-orchestration.md`. It includes: a command to initialize a session and write the initial state record; a command to compile the next step's injected prompt from the current state; a command to read current state so agents know where they are; a command to record a step transition and validate it against the predicate registry; a command to resume after an interruption, replaying state from the event store; and a command to emit hook payloads at `PreToolUse` and `SubagentStop` boundaries. Nothing in orchestration is hand-written — the CLI enforces naming conventions, metadata structure, and predicate constraints that agents cannot reliably reproduce by hand.

## Configuration

The configuration group reads and writes the three-tier cascade at user, project, and session scopes. It includes commands to get and set individual keys at any scope, to list the merged view an agent sees at runtime, and to set up session environment — loading env vars from the appropriate `.env` file and exposing session metadata so agents do not need to discover it themselves. Re-running environment setup is a no-op when the session is already initialized (idempotent by design). See `gobbi-config/README.md` for the full cascade semantics.

The two verbs are `gobbi config get <key>` (cascade-resolved across workspace → project → session `settings.json` files) and `gobbi config set <key> <value>` (writes to a target level). See `gobbi-config/README.md` for the full cascade semantics and CLI surface.

## Memory

The memory group operates on the session event store and the memory stores described in `gobbi-memory/README.md`. It includes: a command to promote a gotcha from session-level capture (transient) into the project-level gotcha store at `.gobbi/project/{project_name}/gotchas/`, or into cross-project plugin gotchas at `.claude/skills/_gotcha/`; a command to extract subagent transcripts from JSONL and write the result into the active step's `rawdata/` directory; and a command to extract plan artifacts from session transcripts. The JSONL schema is not self-evident — the CLI knows the schema and where to look, so agents do not have to parse it.

## Rendering

The render group transforms JSON source files under `.gobbi/skills/`, `.gobbi/agents/`, and `.gobbi/rules/` into the markdown Claude Code loads from `.claude/`. This is covered in depth in `claude-docs-management.md`. Rendering is deterministic: the same JSON source always produces the same markdown output. Agents trigger a render after modifying source files; they never write to `.claude/` directly.

## Hard-for-agents helpers

Some operations require specialized tooling that agents cannot perform with Read, Grep, or Bash alone. The helper groups encapsulate this tooling behind a stable interface:

**Image** — analyzes images (metadata extraction, resize), compares images side-by-side as comparison sheets. Agents working on visual tasks load the CLI rather than attempt image processing inline.

**Video** — analyzes video files and extracts frames. Frame extraction has format-specific edge cases; the CLI handles them.

**Web** — takes screenshots of web pages and captures images from URLs. Agents performing UI review or visual diffing use this rather than a bare browser invocation.

**Notify** — sends notifications via Slack, Telegram, and Desktop with channel-specific formatting. Agents fire notifications at workflow milestones without needing channel-specific API knowledge.

---

## Properties of the redesigned surface

**Agent-oriented** — the CLI is designed for subagents and orchestrators, not for interactive human use. Human-friendly output is not a design goal; structured, parseable output for agent consumption is.

**Deterministic** — the same input always produces the same output. Agents can call workflow or render commands in scripts or retries without unexpected side effects.

**Idempotent where meaningful** — setup and environment commands are safe to re-run. Running session initialization twice produces the same state as running it once.

**Structured output preferred** — commands emit JSON-compatible output where possible so agents can parse and forward results reliably, rather than scraping human-readable text.

---

## Intent-first access pattern

When an agent does not know which command fits its need, it consults an intent map (today carried by the `_gobbi-cli` skill — itself subject to redesign) that maps goals to command groups. Agents do not invent command names or reach for shell utilities that bypass gobbi's naming and state conventions. The intent map is the first stop; the command group docs are the second.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | The workflow commands and the six-step state machine they drive |
| `gobbi-config/README.md` | The three-tier configuration cascade that config commands navigate |
| `gobbi-memory/README.md` | The session event store and memory stores that memory commands operate on |
| `claude-docs-management.md` | The render command and the JSON-source-to-`.claude/` pipeline |

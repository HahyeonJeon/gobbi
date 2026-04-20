# `.gobbi/` Long-Term Memory

Feature description for gobbi's cross-session persistence model. Read this to understand how memory is organized across three tiers, how the Memorization Loop grows project knowledge over time, and how a session resumes cleanly after any interruption.

---

> **Memory and configuration share the same three-tier structure under `.gobbi/` — but memory answers "what did we learn?" while configuration answers "how should this behave?"**

Gobbi organizes everything that must persist across sessions under a `.gobbi/` directory at the workspace root. The directory mirrors the three scopes of the configuration cascade: user, project, and session. Each tier holds a different class of knowledge, and the Memorization Loop is the mechanism that moves learnings upward from session to project over time.

---

## Tier 1 — User (`.gobbi/`)

The outermost scope. Holds workspace-wide artifacts:

- `settings.json` — user-wide preferences (covered in `gobbi-config.md`)
- `gobbi.db` — the single SQLite event store for the entire workspace. Every workflow event across every project and every session is written here: `workflow.start`, step transitions, delegation events, evaluation verdicts, and artifact writes. Events carry project and session identifiers so they can be filtered and replayed on demand.
- `skills/`, `agents/`, `rules/` — workspace-level Claude docs that the rendering pipeline uses as JSON source. These are not project-scoped; they apply across all projects in the workspace. How they relate to the plugin-shipped originals is covered in `claude-docs-management.md`.

---

## Tier 2 — Project (`.gobbi/projects/{project_name}/`)

The durable memory layer. A single workspace such as a monorepo may host multiple sub-projects, each with an independent directory under `projects/`. The plural `projects/` is intentional: one `.gobbi/` can serve many.

Project memory splits into three groups:

**Identity and inputs**
- `README.md` — project overview
- `settings.json` — project-tier config (covered in `gobbi-config.md`)

**Project memories** — one subdirectory each, grown by the Memorization Loop over successive sessions:
- `design/` — design documents
- `decisions/` — architectural and scope decisions
- `scenarios/` — user scenarios and expected behaviors
- `verifications/` — verification criteria and verified outcomes
- `operations/` — operational procedures and runbooks
- `references/` — external references, papers, and links
- `backlogs/` — deferred work and open questions
- `gotchas/` — per-project corrections agents must check before acting
- `insights/` — observations and learnings that do not fit the other categories

Skills, agents, and rules live at the workspace tier (`.gobbi/skills/`, `.gobbi/agents/`, `.gobbi/rules/`) — not the project tier. How workspace-level Claude docs relate to the plugin-shipped originals is covered in `claude-docs-management.md`.

---

## Tier 3 — Session (`.gobbi/projects/{project_name}/sessions/{session_id}/`)

One directory per workflow run. Contents:

- `README.md` — session overview
- `settings.json` — session-tier config written during Workflow Configuration (covered in `gobbi-config.md`)

Per-step subdirectories, one for each of the four middle workflow steps:
- `ideation/` — Ideation Loop workspace: `README.md` (synthesized summary) and `rawdata/` (subagent transcripts, raw research output)
- `planning/` — Planning Loop workspace: `README.md` and `rawdata/`
- `execution/` — Execution Loop workspace: `README.md` and `rawdata/`
- `memorization/` — Memorization Loop workspace: `README.md` and `rawdata/`

Workflow Configuration (step 1) and Hand-off (step 6) do not produce per-step subdirectories. Configuration's output is the session directory itself plus `settings.json`. Hand-off writes its final events to `gobbi.db` at `.gobbi/` without adding new artifacts to the session directory.

The `rawdata/` directories hold high-volume, unsynthesized material. The step's `README.md` is the synthesized product the next agent reads.

---

## The Memorization Loop

Step 5 of every workflow is Memorization. The loop reads the full record of the session — every event in `.gobbi/gobbi.db`, every `rawdata/` artifact captured by the JIT hooks during Ideation, Planning, and Execution, and every intermediate step `README.md` — and writes the outcomes into the right project-tier directories: decisions into `decisions/`, corrections into `gotchas/`, design changes into `design/`, deferred items into `backlogs/`, and so on. Exactly which classes of session artifact graduate into which project memory directory is a design area still under discussion — the loop guarantees preservation of the raw material and a mechanism for distilling it, without locking to a final extraction policy. This is how `.gobbi/projects/{project_name}/` grows richer with each session. Without Memorization, every session restarts from zero; with it, each session builds on the last.

---

## Resume

`.gobbi/gobbi.db` is the authoritative record of what happened across all workflows in the workspace. On resume — after a crash, `/compact`, `/clear`, or a fresh session targeting the same workflow — the CLI queries events for the matching project and session identifiers and replays them through the reducer to reconstruct state. No workflow progress is lost; the event store survives anything short of SQLite file corruption. a status-read command (name TBD) exposes current step, completed steps, and evaluation rounds directly from the event store, without parsing conversation history.

---

## Gotchas

Gotchas are the highest-leverage memory in the system. Each entry exists because an agent made a specific mistake and a user identified the correct behavior. They short-circuit investigation: the next agent reads the gotcha and skips to the correct approach without rediscovering the failure.

Per-project gotchas live in `.gobbi/projects/{project_name}/gotchas/` and apply only to that project. Cross-project gotchas — those that apply regardless of which project is active — ship with the gobbi plugin under `.claude/skills/_gotcha/`. The `_gotcha` skill governs how agents check before acting and how corrections get recorded.

---

## Config vs. Memory

Configuration and memory share the three-tier structure under `.gobbi/` but hold different classes of data. Configuration (`settings.json` at each tier) answers "how does this user / project / session behave?" Memory (project memory subdirectories, session event store) answers "what happened and what did we learn?" They are stored separately and serve separate purposes. The configuration model is covered in `gobbi-config.md`.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `gobbi-config.md` | `settings.json` cascade at the same three tiers |
| `deterministic-orchestration.md` | Memorization Loop (step 5) and how session events promote to project memory |
| `claude-docs-management.md` | How workspace-level `agents/`, `rules/`, `skills/` relate to plugin-shipped Claude docs |

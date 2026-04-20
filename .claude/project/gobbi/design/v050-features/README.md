# v0.5.0 Feature Docs

Feature description docs for gobbi v0.5.0 — read these to understand what the release delivers. For mechanism and implementation detail, read `../v050-*.md`.

---

| Document | Feature |
|----------|---------|
| [one-command-install.md](one-command-install.md) | Plugin-based distribution: install once, updates pull CLI + skills + rules + hooks atomically |
| [deterministic-orchestration.md](deterministic-orchestration.md) | State machine workflow: typed reducer, stance-diverse Ideation, mandatory Evaluation |
| [gobbi-config.md](gobbi-config.md) | Per-session configuration in `.gobbi/`: trivialRange, evalMode, gitWorkflow, notify settings |
| [gobbi-memory.md](gobbi-memory.md) | Cross-session persistence: SQLite event store, resumable state, gotcha promotion pipeline |
| [just-in-time-prompt-injection.md](just-in-time-prompt-injection.md) | Prompts emitted at the moment of need, not always-loaded; skills injected per-step |
| [claude-docs-management.md](claude-docs-management.md) | Docs lifecycle: gobbi docs/doctor/validate + evaluation rubrics embedded in authoring skills |
| [cli-as-runtime-api.md](cli-as-runtime-api.md) | Agent-facing CLI contract: image/video/web/note/notify/validate helpers for hard-for-agents ops |
| [token-budget-and-cache.md](token-budget-and-cache.md) | Cache-prefix ordering invariant + token budget allocation with section minimums |
| [prompts-as-data.md](prompts-as-data.md) | Step specs as JSON data: versioned, testable, statically validated via predicate registry |
| [worktree-based-operation.md](worktree-based-operation.md) | One worktree per task: branch exclusivity, base-branch verification, subagents commit/orchestrator pushes |

---

See `../v050-overview.md` for the architecture overview and philosophy behind the release.

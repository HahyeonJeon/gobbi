# v0.5.0 Feature Docs

Feature description docs for gobbi v0.5.0 — read these to understand what the release delivers. Each doc is a short, focused description of one feature with links to peer docs for related concepts.

---

| Document | Feature |
|----------|---------|
| [one-command-install.md](one-command-install.md) | Plugin install + `/gobbi` in a session auto-installs or updates gobbi-cli; rules, agents, skills refresh on plugin update. |
| [deterministic-orchestration.md](deterministic-orchestration.md) | Stub redirect to [`orchestration/README.md`](orchestration/README.md) — retired in Wave A.2. The six-step workflow, loop configuration, and reproducibility design now lives in the orchestration/ docs. |
| [gobbi-config/README.md](gobbi-config/README.md) | Unified `settings.json` cascade under `.gobbi/` (workspace / project / session). Session wins; project wins over workspace. Two-verb CLI: `gobbi config get` + `set`. |
| [gobbi-memory.md](gobbi-memory.md) | Three-tier memory under `.gobbi/`. Project memory subdirs (design, decisions, gotchas, ...). Workspace-wide `state.db` event log + `gobbi.db` memories projection. |
| [just-in-time-prompt-injection.md](just-in-time-prompt-injection.md) | Stub redirect to [`orchestration/README.md`](orchestration/README.md) — retired in Wave A.2. The JIT footer pattern design now lives in `orchestration/README.md` § 5 and § 6. |
| [claude-docs-management.md](claude-docs-management.md) | JSON source at `.gobbi/skills\|agents\|rules/` rendered to `.claude/` by the CLI. Evaluation rubrics travel with authoring skills. |
| [cli-as-runtime-api.md](cli-as-runtime-api.md) | Agent-facing runtime API spanning workflow control, configuration, memory, rendering, and hard-for-agents helpers. |
| [token-budget-and-cache.md](token-budget-and-cache.md) | Cache-prefix ordering invariant + token budget allocation with section minimums. |
| [prompts-as-data.md](prompts-as-data.md) | Step specs as JSON data; CQRS for spec evolution (state.db::events truth, prompt_patches projection, JSONL chain foldable to spec.json); operator-only `gobbi prompt render | patch | rebuild` mutation surface. |
| [worktree-based-operation.md](worktree-based-operation.md) | One worktree per task under `.gobbi/worktrees/`. Branch exclusivity, base-branch verification, subagents commit / orchestrator pushes. |

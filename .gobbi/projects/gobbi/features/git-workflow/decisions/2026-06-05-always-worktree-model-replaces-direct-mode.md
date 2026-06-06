---
name: always-worktree-model-replaces-direct-mode
description: Gobbi adopts an always-worktree session model; direct mode is dropped entirely; every session creates a per-session worktree at Configuration Step 1.
type: decisions
scope: feature
feature: git-workflow
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [git-workflow, orchestration, configuration, worktree, conventions]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Always-Worktree Session Model Replaces Direct Mode

## Context

Gobbi's Configuration step previously offered two modes: worktree mode (the recommended path) and direct-commit mode (a fallback when the user opted out or when infrastructure constraints prevented worktree creation). Maintaining both paths created documentation complexity, split test coverage, and left an escape hatch that in practice was never exercised safely. The `step1-configuration-restructure` task (task-03, session `06668274`) restructured the Step-1 procedure to make worktree creation unconditional and drop direct mode entirely.

## Decision

Every Gobbi session creates a per-session git worktree at Configuration Step 1. Direct mode is removed — there is no opt-out, no fallback, and no code path that operates in the main working tree. If `gh`, remote auth, or network is unavailable, the session still proceeds in its worktree and commits locally; only PR creation is deferred. The session never falls back to working in the main tree.

## Rationale

- **Consistency.** A single code path is easier to reason about, test, and document than a conditional branch that is rarely exercised.
- **Safety.** Working in the main tree risks polluting or breaking the canonical checkout. The worktree is always an isolated surface.
- **No-gh resilience replaces "fall back to direct commit mode."** The old framing conflated two distinct concerns: git isolation (worktree vs. main tree) and GitHub API availability (PR creation). These are now decoupled. Local git operations (worktree creation, commits) are always available. PR creation via `gh` is gated separately; when `gh`/auth/remote is unavailable the manager commits on the branch and emits a user-facing "PR deferred" message. `session.json.git.pr` stays `null` — no sentinel value needed (resolved open question OQ-1).

## Alternatives considered

- **Keep direct mode as an opt-out** — rejected because the opt-out was never exercised in practice and its presence required maintaining two documentation paths and conditional behavior in the orchestration skill.
- **Keep direct mode as a CI/headless fallback** — rejected; the worktree creation machinery is lightweight and does not require a remote, so it works in headless environments too.
- **Use a sentinel value in `session.json.git.pr` to signal "deferred"** — rejected; `null` is sufficient and sentinel values add a parsing obligation for every reader of that field.

## Consequences

1. **Branch naming convention changed.** Session branches now follow `{system}-{date}-{ssid-full}`: `claude-<YYYY-MM-DD>-<full-uuid>` for claude-code, `codex-<YYYY-MM-DD>-<full-uuid>` for codex. No `type/` prefix; full session UUID is used. `conventions.md` gained a "§ Session-Worktree Branches" rule with strict regex `^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`. Session branches are explicitly exempted from the existing type-prefix (e.g., `feat/`, `chore/`) and 3-50 character rules; those constraints continue to apply to non-session feature branches.
2. **Step-1 table restructured.** The 7-row procedure table became 4 rows: Create Worktree / Resolve Settings / Init state.json / Init session.json. Columns are `# | Action | Description | Refs | Agent`. The direct-mode LOCK #5 block, the Smoke-test T1.h gate, the 3-tier bootstrap table, and the interview row 7 (interview gate now owned solely by `gobbi/SKILL.md`) were all removed.
3. **11 files changed in iter1, 3 in iter2 remediation.** Files affected: `orchestration/SKILL.md`, `auto-mode.md`, five `workflow/*.md` sub-documents, `git/SKILL.md`, `conventions.md`, `interview/SKILL.md`, `delegation/SKILL.md`. Iter2 remediation corrected 6 dangling row-number cross-references (see companion mistake-candidate).
4. **Settings templates unchanged.** The settings YAML templates never carried a `git.workflow.mode` key — that config path was dead and required no cleanup.
5. **Current session branch (`chore/session-...`) was NOT renamed.** The new convention is forward-looking; branches created before this change are grandfathered.

## Related

- Companion process mistake: `features/guardrails/mistakes/table-renumber-must-sweep-inbound-row-references.md` — documents the planning gap that caused iter2 remediation.
- Commits: `46d93c8` (iter1 implementation) + `72cee33` (iter2 remediation).
- Feature: `git-workflow` conventions.

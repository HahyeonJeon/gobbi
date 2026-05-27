---
name: preparation-decisions-log
description: Decisions log for the Preparation Loop evaluation cycle — env-var-audit + SessionStart hook; three evaluation findings resolved across two iterations.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [preparation, env-var-audit, session-start-hook, decisions-log]
verdict: pass
---

# Preparation Loop — Readiness Decision (env-var audit + SessionStart hook)

## Context

Before the env-var-audit + SessionStart-hook feature could advance from Preparation to Planning, its readiness artifact had to clear a dual-system evaluation gate. The first evaluation round returned REVISE from both Claude and Codex; this decision records the readiness verdict, the findings that drove it, and their dispositions.

## Decision

**The Preparation loop is PASS — the feature is ready to advance to Planning.** The first round returned REVISE/REVISE; after the accepted remediations were applied, the second round returned PASS/PASS.

| Round | Claude verdict | Codex verdict | Outcome |
|------|---------------|---------------|---------|
| 1 | REVISE | REVISE | Remediation applied |
| 2 | PASS | PASS | Advance to Planning |

## Rationale

Three findings from the first round were accepted and remediated in the second round:

- **Finding α — Branch name (`feature/` → `feat/`), High (convention violation).** The artifact used `feature/env-var-audit-sessionstart-hook` as the suggested branch name. `git/conventions.md` Step-1 regex requires `feat/` and explicitly lists `feature/oauth` as the FAIL example. Disposition: accepted; `feature/` replaced with `feat/` at the two pre-planning locations. Historical references in the changelog description were preserved as-is.
- **Finding β — `jq -e` two-step verification, High (incorrect verification command).** The single `jq -e '.transcriptPath' ...` command cannot distinguish present-with-null from absent; `jq -e` exits nonzero on `null` and `false`, so the check would false-fail on a correctly-set null value. Disposition: accepted; replaced with a two-step verification — `jq -e 'has("transcriptPath")'` for presence, then plain `jq '.transcriptPath'` for value, with an inline note that the two steps are needed because `jq -e` returns nonzero on null.
- **Finding γ — Main-tree absolute session-write path note, Medium (missing Planning/Execution guard).** The artifact lacked an explicit reminder that all session writes (session.json stamping, staging files, mistake notes) must use the main-tree absolute path, not the executor's worktree path. Disposition: accepted; added pre-planning item 10 "Session-write path discipline (main-tree absolute)" with authority citations (`git/SKILL.md:31-33` Memory Access Matrix + `git/SKILL.md:276` Output paths).

## Alternatives considered

- **Finding δ — `gh auth` dispute (Codex filed High).** The Codex evaluator reported the active `HahyeonJeon` token as invalid, challenging the §3 "tooling verified" exit criterion. Disposition: **disputed as an environment mismatch, not accepted.** The manager independently re-ran `gh auth status` in the main session shell and received a valid, active login ("Logged in to github.com account HahyeonJeon, Active account: true, Token scopes: admin:public_key, gist, read:org, repo"). The Codex sandbox subprocess lacked auth credentials — a runtime artifact of the sandbox, not a real Preparation gap. No code change applied; mitigation is that the manager re-verifies `gh auth status` at point of use if Execution subagents shell out to `gh`.
- **Two carry-forward deferred items (Low; do not block Planning).** (1) A stale `rg` version claim — the artifact cites `rg` 14.1.1; the actual installed version may differ, but Planning re-greps at point of use regardless. (2) An absent-vs-empty staging-subdir wording imprecision — cosmetic; does not affect Planning or Execution. Both were judged pre-existing/cosmetic and deferred rather than fixed.

## Consequences

- The feature advances to Planning with the three accepted remediations baked into the readiness artifact.
- The `gh auth` re-verification mitigation carries into Execution: the manager re-checks `gh auth status` at point of use before any subagent shells out to `gh`.
- The two deferred items remain open as low-priority cosmetics; neither blocks Planning or Execution.

## Related

- `decisions/env-file-load-semantics-decisions.md` — the design decisions this readiness gate protected.
- `notes/2026-05-22-env-var-audit-sessionstart-hook.md` — the project session journal for this work.

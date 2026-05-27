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

# Preparation Loop — Decisions Log

## Evaluation summary

| Iter | Claude verdict | Codex verdict | Outcome |
|------|---------------|---------------|---------|
| 1 | REVISE | REVISE | Remediation applied |
| 2 | PASS | PASS | Advance to Planning |

---

## Iter1 findings and dispositions

### Finding α — Branch name (`feature/` → `feat/`)

- **Severity:** High (convention violation)
- **Finding:** The artifact used `feature/env-var-audit-sessionstart-hook` as the suggested branch name. `git/conventions.md` Step-1 regex requires `feat/` and explicitly lists `feature/oauth` as the FAIL example.
- **Disposition:** Accepted. Applied in iter2 — replaced `feature/` with `feat/` at the two pre-planning locations in the artifact. Historical references in the iter2-changelog description were preserved as-is.

### Finding β — `jq -e` two-step verification

- **Severity:** High (incorrect verification command)
- **Finding:** The single `jq -e '.transcriptPath' ...` command cannot distinguish present-with-null from absent; `jq -e` exits nonzero on `null` and `false`, so the check would false-fail on a correctly-set null value.
- **Disposition:** Accepted. Applied in iter2 — replaced with a two-step verification: `jq -e 'has("transcriptPath")'` for presence, then plain `jq '.transcriptPath'` for value. Inline note added: "two-step verification because `jq -e` returns nonzero on null".

### Finding γ — Main-tree absolute session-write path note

- **Severity:** Medium (missing Planning/Execution guard)
- **Finding:** The artifact lacked an explicit reminder that all session writes (session.json stamping, staging files, mistake notes) must use the main-tree absolute path, not the executor's worktree path.
- **Disposition:** Accepted. Applied in iter2 — added pre-planning item 10 "Session-write path discipline (main-tree absolute)" with authority citations (`git/SKILL.md:31-33` Memory Access Matrix + `git/SKILL.md:276` Output paths).

### Finding δ — `gh auth` dispute

- **Severity:** High (as filed by Codex iter1 evaluator)
- **Finding:** Codex iter1 evaluator reported the active `HahyeonJeon` token as invalid, challenging the §3 "tooling verified" exit criterion.
- **Disposition:** Disputed — environment-mismatch. Manager independently re-ran `gh auth status` in the main session shell and received: "Logged in to github.com account HahyeonJeon, Active account: true, Token: gho_*, Token scopes: admin:public_key, gist, read:org, repo". The Codex `codex:codex-rescue` sandbox subprocess lacked auth credentials; this is a runtime-environment artifact of the sandbox, not a real Preparation gap. No code change applied. Mitigation: manager re-verifies `gh auth status` at point of use if Execution subagents shell out to `gh`.

---

## Iter2 result

Both Claude and Codex returned PASS on iter2. No further findings requiring disposition. Preparation Loop verdict: **pass**.

---

## Carry-forward deferred items (Low priority — do not block Planning)

These two items were noted as pre-existing or cosmetic and are deferred; they do not constitute gaps:

1. **Stale `rg` version claim** — artifact cites `rg` 14.1.1; actual installed version may differ. Pre-existing cosmetic issue; Planning re-greps at point of use regardless of the cited version.
2. **Absent-vs-empty staging subdir wording** — minor precision gap in how the artifact describes empty staging subdirs. Cosmetic; does not affect Planning or Execution.

Neither item requires action before advancing to Planning.

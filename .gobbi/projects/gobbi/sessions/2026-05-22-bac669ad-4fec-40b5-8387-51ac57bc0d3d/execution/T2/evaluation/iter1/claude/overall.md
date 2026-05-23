# T2 Evaluation — Overall — iter1

Date: 2026-05-22
Evaluator: claude/sonnet-4-6
Target: commit 6a575f2 — `.claude/settings.json` SessionStart hook registration
Perspectives run: project, structure, consistency, risk

## 6-Criterion Summary

| # | Criterion | Result |
|---|-----------|--------|
| C1 | Valid JSON (`jq -e .`) | PASS |
| C2 | `hooks.SessionStart` non-null array length >= 1 | PASS (length = 1) |
| C3 | Matcher == `startup\|resume\|clear\|compact` | PASS (exact, matches PR #229 precedent 756c155) |
| C4 | Command references `session-start.sh` | PASS (`.claude/hooks/session-start.sh`) |
| C5 | `permissions` + `enabledPlugins` byte-identical to baseline | PASS (diff empty) |
| C6 | Commit shape: subject <=72, AI-Provenance-Record trailer, no Co-Authored-By, scope = 1 file | PASS (57 chars, trailer present, 1 file) |

## Commit Shape Detail

- Subject: `feat: register SessionStart hook in .claude/settings.json` (57 chars)
- Trailer: `AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T2`
- Co-Authored-By: absent
- Files changed: `.claude/settings.json` only (+10/-0)

## Consolidated Findings

| ID | Type | Domain | Severity | Confidence | Disposition |
|----|------|--------|----------|------------|-------------|
| F-STR-01 | assumption_risk | config | Medium | 50 | open |

**F-STR-01:** Relative path `.claude/hooks/session-start.sh` in the hook `command` field relies on Claude Code resolving the hook command from `$CLAUDE_PROJECT_DIR` at hook-fire time. If the cwd at hook dispatch differs from project root, the script silently fails to fire. Confidence 50: Claude Code docs state `$CLAUDE_PROJECT_DIR` is the hook execution context, but this has not been empirically confirmed for this project's hook setup.

No Critical or High findings. F-STR-01 at Medium/50 does not trigger REVISE threshold.

## Cross-Perspective Tensions

None. All four perspectives converged on the same reading.

## Karpathy Failure Mode Check

- "Looks good because it's small" — checked: small doesn't mean no risk; F-STR-01 was surfaced.
- "Tests pass so it's done" — no tests exist for hook registration; evaluated by close-reading + jq verification + precedent check.
- Silent failures — explicitly considered in structure and risk perspectives.

## Must-Preserve List

1. Matcher value `startup|resume|clear|compact` — canonical across PRs #229 and this commit.
2. `permissions` and `enabledPlugins` contents — verified unchanged; any future edit to settings.json must preserve these exactly.
3. T1 (session-start.sh) and T2 (.claude/settings.json) must be merged together — T2 alone is non-functional.
4. `type: "command"` in hook object — required Claude Code field.

## Overall Verdict

PASS

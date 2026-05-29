VERDICT: REVISE

# Risk Perspective - Wrap-up iter1

## Artifact Summary

**What:** Evaluate risks if this wrap-up is accepted as-is. **Why:** Wrap-up errors poison the next session through false completion claims, stale state, or lost audit trails. **How:** I checked git cleanliness, branch commit state, session scratch preservation, archive moves, user memory, and project-memory schema conformance.

Memory reads:
- `.agents/skills/git/SKILL.md`
- `.agents/skills/wrap-up/SKILL.md`
- `.agents/skills/memorization/rules.md`
- `wrap-up/artifacts/handoff.md`
- `session.json`
- `state.json`
- project mistakes related to evaluation, git, and wrap-up promotion

## Locked Frame (Stage 1)

Scenario 1 - No uncommitted work is left dangling.
- Check 1.1: Worktree git status is clean or only this evaluation output is untracked.
- Check 1.2: Session branch contains commits for the shipped work.

Scenario 2 - Audit trail is preserved.
- Check 2.1: Session scratch directories still exist.
- Check 2.2: Wrap-up inventory and promotion manifest exist.
- Check 2.3: Current-session staging contents are not silently dropped.

Scenario 3 - Project memory is not polluted.
- Check 3.1: Newly created note follows base frontmatter.
- Check 3.2: Newly created backlog follows base frontmatter.
- Check 3.3: Archive moves use terminal-state frontmatter.

Scenario 4 - Sensitive or costly side effects are surfaced.
- Check 4.1: Handoff records cost if anomalous.
- Check 4.2: No production data or sensitive-data handling is claimed.

Scenario 5 (adversarial) - Wrap-up hides a dangerous incomplete state behind "ready for PR".
- Check 5.1: Handoff's PR guidance is safe to follow immediately.

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| 1.1 | no | `git status --short` shows staged archive renames, modified product files, untracked product files, notes, backlog, and session files. |
| 1.2 | no | `git log --oneline -10` shows HEAD at `87563f3`, same as `origin/develop`; no session commit appears. |
| 2.1 | yes | Session directories for ideation, planning, execution, and wrap-up exist. |
| 2.2 | no | `staging-inventory.md` and `promotion-manifest.md` are absent. |
| 2.3 | partial | Current-session staging file search returned no files, but absence is not recorded in an inventory. |
| 3.1 | no | Journal note lacks required base frontmatter fields. |
| 3.2 | yes | New backlog includes base frontmatter and valid backlog-specific fields. |
| 3.3 | yes | Archive frontmatter has closed/addressed/archive fields. |
| 4.1 | yes | No anomalous paid API/cloud-cost is indicated by the inspected artifacts; no cost issue found. |
| 4.2 | yes | No sensitive-data workflow is claimed in the handoff or journal. |
| 5.1 | no | Following PR guidance now would omit uncommitted shipped changes. |

## Typed findings

### COD-RISK-001 - Shipped work is not committed before PR handoff

- Type: `design_flaw`
- Domain: `git-workflow`
- Confidence: 100
- Severity: High
- Disposition: open
- Evidence: `git status --short` shows non-evaluation changes; `git log --oneline -10` shows no session commit above `origin/develop`; handoff says branch is ready for PR.
- Risk: The manager can open an empty or partial PR, or lose untracked files during cleanup.

### COD-RISK-002 - Missing wrap-up inventory leaves silent-drop risk unclosed

- Type: `checklist_gap`
- Domain: `process`
- Confidence: 100
- Severity: Medium
- Disposition: open
- Evidence: `rawdata/staging-inventory.md` and `rawdata/promotion-manifest.md` are missing. Current staging is empty, but the empty result is not recorded.
- Risk: Future readers cannot distinguish "no staging existed" from "staging was not checked."

### COD-RISK-003 - Journal memory schema drift can break future tooling

- Type: `general`
- Domain: `project-memory`
- Confidence: 100
- Severity: Medium
- Disposition: open
- Evidence: Journal frontmatter lacks `name`, `description`, `scope`, `feature`, `status`, and `created`.
- Risk: Project-memory consumers relying on base fields may skip or misclassify the note.

## Low-confidence appendix

No privacy or paid-cost concern found.

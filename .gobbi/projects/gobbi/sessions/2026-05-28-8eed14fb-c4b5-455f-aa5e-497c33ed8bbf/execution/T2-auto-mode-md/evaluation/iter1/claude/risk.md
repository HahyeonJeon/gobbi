# T2 auto-mode.md — Risk Perspective (iter1, claude)

## Artifact Summary

(See `project.md`.)

## Memory reads

- Idea §4 (especially §4.4 "flag don't fix" notes)
- Plan T2 `estimated-risk: Low` / `risk-rationale`
- `orchestration/SKILL.md` line 405 contract
- `mistakes/skills-mirror-symlinks-not-copies.md`

## Locked Frame (Stage 1)

**Scenario R1.** Reversibility — can this change be rolled back cleanly?
- [x] Single-file edit at `auto-mode.md` (canonical); mirror auto-reflects via symlink — `git revert` of the T2 commit fully reverses
- [x] No schema changes, no runtime behavior change (§1 declares "Auto Mode's runtime shape is unchanged")
- [x] No deletion of prior content (placeholder was 636 B / not a load-bearing spec — superseded, not destroyed)

**Scenario R2.** Blast radius if a future reader misapplies the doc.
- [x] §2 Always-Ask categories cite `discussion/SKILL.md` as authoritative — a reader who finds §2 ambiguous can fall back to the upstream skill
- [x] §4 anticipates the banner-rationalization vector and closes it explicitly — the highest-blast-radius failure mode (a manager auto-deciding a Design / Scope / Destructive call because the banner said "keep going") is named

**Scenario R3 (adversarial).** Mirror-symlink false-positive — was the canonical file actually edited, or did the executor accidentally write to the symlink?
- [x] Verified by `ls -la`: `.claude/skills/orchestration/auto-mode.md` is a symlink (size 64, lrwxrwxrwx); `.gobbi/projects/.../auto-mode.md` is a regular 12 267-byte file
- [x] `readlink` confirms target points to canonical path under `.gobbi/projects/gobbi/skills/orchestration/`
- [x] No double-edit risk (single source of truth preserved)

**Scenario R4 (adversarial).** Auto-decide / Always-Ask gray-zone misclassification by a future manager.
- [x] §2.3 examples are concrete enough that the canonical gray zones (mid-Planning library choice, mid-Execution out-of-scope path, mid-Wrap-up `git reset --hard`) are pre-classified
- [x] §1 explicitly excludes "I'm not sure" and "this might be surprising" as Always-Ask triggers — closes the over-pause failure mode
- [x] §2.4 escalates USER CHALLENGE for substantive leader-user disagreement — covers the gray zone between Always-Ask and Auto-decide

**Scenario R5 (adversarial).** maxIterations exhaustion silence — does the doc create a silent-failure trap?
- [x] §5 explicitly labels the silence as "by design" and routes the failure into Wrap-up MEMORIZATION + session handoff — a future reader is told where to look for the failure surface
- [x] §5 "Exception" paragraph covers the case where the abort makes downstream steps unsound (forces AskUserQuestion) — closes the worst case

## Stage 2 — Risk verdict

- **Verdict: PASS.**

## Findings

None at Conf ≥ 50.

## Low-confidence appendix

- (Conf 25) The §3 row for `evaluate.mode` says `"skip"` is a "power-user per-session override". This is a forward-looking claim about a feature surface that may not be implemented yet; if the resolver does not honor `evaluate.mode: skip` at the session level, the doc creates a false-promise risk. Out-of-scope to verify here (resolver code is out-of-scope per Plan T2 `out-of-scope-files`).

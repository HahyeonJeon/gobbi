# Project — T03 (commit 0632ad8)

## Artifact Summary + Memory reads
**What:** Docs change-set to `mistake/SKILL.md` (canonical target of `.claude/skills/mistake/SKILL.md` symlink) + `backlogs/hooks-domain-mistakes-watchlist.md`. Edits A (add `hooks` domain-tag example at P1 step 3 + P3 step 5), B (rewrite `{session-id}` Path-conventions row to locked M2 wording), C (rewrite 5 `gobbi mistake promote` CLI references to Wrap-up-phase agent promotion), D (reconcile "agents never write to project memory" claim with Wrap-up sole-writer exception), E (backlog deferred→in-progress + perpetual-capture + N≥2 trigger clarifier).
**Why:** Witness = backlog `gobbi-mistake-promote-command-does-not-exist` (user correction 2026-05-25) + idea DL-5 (M2) + plan-addendum (T03 expansion). The CLI command does not exist; the doc described a non-existent mechanism.
**How:** Edit canonical paths (not symlink, per `edit-tool-refuses-symlink-paths` mistake); keep staging→promotion model; mechanism = Wrap-up agent promotion, no CLI.
**Scope Contract source:** delegation prompt (Task T03 contract, edits A-E + OOS list).
**Memory reads:** principles/SKILL.md; evaluation/SKILL.md; mistake/SKILL.md (edited); execution/evaluation.md; rules/stub-redirect-format.md; mistakes/{edit-tool-refuses-symlink-paths, claude-evaluator-step4-only-vs-codex-whole-file-grep, leader-iter2-verification-claim-without-evidence}.md; backlog; executor draft-iter1.md.

## Locked Frame (Stage 1)

**S1 — change-set matches contract edits A-E 1:1**
- [ ] All five edits A-E present in diff
- [ ] No contracted edit omitted

**S2 — only the 2 contracted files touched**
- [ ] `git diff --name-only` = exactly mistake/SKILL.md + backlog
- [ ] No OOS file (CLAUDE.md, gobbi/SKILL.md, wrap-up/SKILL.md, orchestration/SKILL.md, sweep skills, other backlogs, session.json/state.json)

**S3 — commit message names the task + matches diff**
- [ ] Commit references T03/CL-3 and witness
- [ ] No over/understatement vs actual diff

**S4 (adversarial) — "while I'm here" cleanup slips in**
- [ ] Every diff hunk maps to a contracted edit
- [ ] No incidental rewording outside A-E

## Per-scenario per-check results
- S1.1 YES — diff shows A (lines 63,90), B (line 129 row), C (desc/11/27/45-47/94-96), D (desc/11/17/21-22/47/105), E (backlog status + suggested-approach). All five present.
- S1.2 YES — none omitted.
- S2.1 YES — `git diff --name-only 0632ad8~1 0632ad8` = exactly the 2 files.
- S2.2 YES — no OOS file touched. Note: CLAUDE.md still references `gobbi mistake promote` but it is explicitly OOS for T03; not a Project finding here (see P-1 below, Low).
- S3.1 YES — commit subject `docs(mistake): add hooks domain tag, M2 {session-id} row, drop gobbi-mistake-promote CLI (T03, CL-3)`; body cites witness.
- S3.2 YES — body accurately enumerates A-E; matches `git show --stat` (2 files, +22/-18).
- S4.1 YES — every hunk maps to A/B/C/D/E.
- S4.2 YES — no rewording outside scope; the only adjacent edits (Memory Access Matrix rows, description) are direct D reconciliation, contracted.

## Typed findings

### P-1 (Low) — Out-of-scope sibling doc (CLAUDE.md) still references the non-existent CLI command
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Low
- Evidence: project `.claude/CLAUDE.md` "Gobbi-specific tooling" section still says "run `gobbi mistake promote` to promote corrections" — a command this very change-set establishes does not exist. CLAUDE.md is explicitly OOS for T03.
- Why it matters: T03 removes the CLI fiction from mistake/SKILL.md but leaves the same fiction in the top-level CLAUDE.md, so the project still documents a non-existent command. Not a T03 defect (OOS), but a real residual that should be a tracked follow-up so the campaign closing this fiction is complete.
- Suggested direction: file a follow-up to sweep CLAUDE.md's "Gobbi-specific tooling" paragraph in the same fashion. Do NOT touch it in T03 (OOS). FP-check: Out-of-scope category → confidence on it being a *T03 defect* is 0; confidence on it being a *real residual worth a follow-up* is 100. Recorded as Low because it does not block T03.

## Verdict: PASS
All five contracted edits present, exactly the 2 contracted files touched, commit message honest, no scope creep. The one finding is an explicitly-OOS residual recorded as a follow-up, not a T03 defect.

## Low-confidence appendix
(none)

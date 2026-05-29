# T2 auto-mode.md — Consistency Perspective (iter1, claude)

## Artifact Summary

(See `project.md`.)

## Memory reads

- Idea §4 (lines 272–306) + §5 defaults table (lines 314–335)
- Plan T2 (lines 176–234)
- `.claude/skills/discussion/SKILL.md` (§ Decision Classification @ line 125 / § Always-Ask categories @ line 140)
- `.claude/skills/planning/SKILL.md` (§ Core Principles @ line 45 / § USER CHALLENGE @ line 69)
- `orchestration/SKILL.md` (line 405 maxIterations-exhaustion contract — verified live)
- Companion `chat-mode.md` (28 258 bytes — for symmetric cite alignment)
- `.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md` (mirror discipline)

## Locked Frame (Stage 1)

**Scenario C1.** Cross-skill citations match live source-of-truth section names.
- [x] `discussion/SKILL.md § Decision Classification` — `## Decision Classification` exists at line 125 ✓
- [x] `discussion/SKILL.md § Always-Ask categories (override auto-decide; the user decides)` — verbatim `### Always-Ask categories (override auto-decide; the user decides)` at line 140 ✓
- [x] `planning/SKILL.md § Core Principles § USER CHALLENGE` — `## Core Principles` @ line 45; `> **USER CHALLENGE — structured escalation when leader disagrees with user.**` @ line 69 (within Core Principles) ✓
- [x] `orchestration/SKILL.md` line 405 contract — line 405 reads "`maxIterations` exhaustion in Auto Mode does NOT interrupt the user. The loop aborts; the failure is captured in MEMORIZATION and surfaces in the Wrap-up Loop's session report." ✓ — auto-mode.md §5 paraphrases accurately

**Scenario C2.** Defaults table values match Idea §5 (Auto column).
- [x] `ideation.maxIterations: 3` ✓ / `preparation.maxIterations: 3` ✓ / `planning.maxIterations: 3` ✓ / `execution.maxIterations: 3` ✓ / `wrap-up.maxIterations: 1` ✓
- [x] `evaluate.mode: always` for every loop ✓
- [x] `discuss.mode: user` for ideation+preparation; `agent` for planning/execution/wrap-up ✓

**Scenario C3.** Mirror-symlink discipline followed.
- [x] Canonical file lives at `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` (12 267 B, regular file)
- [x] `.claude/skills/orchestration/auto-mode.md` is a symlink to `../../../.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` (verified `readlink`)
- [x] Plan T2 `out-of-scope-files` lists `.claude/skills/orchestration/auto-mode.md` as "mirror symlink — auto-reflects" → executor honored

**Scenario C4 (adversarial).** Internal consistency — same value stated twice should match.
- [x] §3 + §6 defaults tables: cell-by-cell identical (manually compared all 11 rows)
- [x] §2.2 says "Always-Ask … regardless of any per-step `discuss.mode: agent` setting" — §3 footnote rows for planning/execution/wrap-up restate "Always-Ask categories still fire (§2)" — symmetric

**Scenario C5 (adversarial).** Companion-doc symmetry with chat-mode.md.
- [x] Both docs sub-document under `orchestration` skill
- [x] Both reference `discussion/SKILL.md § Decision Classification` (auto-mode.md §2.1+Cross-references; chat-mode.md verified present)
- [x] Both reference `memorization/SKILL.md` (chat-mode does the narrowed-PASS-path; auto-mode states unmodified base-procedure)

## Stage 2 — Consistency verdict

- **Verdict: PASS.** Every cross-skill citation resolves on-disk; defaults table matches Idea §5; companion-doc symmetry holds; mirror symlink intact.

## Findings

### F-C1 (Low / Conf 50, open) — §3 ↔ §6 internal redundancy is a future-drift risk

**Evidence.** Lines 90–102 (§3) and lines 164–178 (§6) carry the same 11-row defaults table. They are currently consistent (cell-by-cell match). The Consistency-perspective risk is that a future single-table edit will introduce internal drift between §3 and §6 of the same doc.

**Why it matters.** Same-doc duplication is the easiest consistency violation to introduce by an unwary editor. The Project / Aesthetics findings flag the same line items from different lenses.

**Type/Domain/Confidence/Severity/Disposition.** general / docs-sync / 50 / Low / open.

## Low-confidence appendix

- (Conf 25) §3 row "single mode question … per PR #267 lock" — could not verify PR #267 contents in the worktree (no `gh` access from this evaluator), so the citation is taken on prose evidence only. Project history reads consistent with the claim; no contradicting evidence found.

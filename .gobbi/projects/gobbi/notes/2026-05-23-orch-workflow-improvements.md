---
date: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
type: journal
---

# Session Journal — 2026-05-23 — Orchestration Workflow Improvements (Bundle A)

## What we shipped

Bundle A: six discipline gaps in gobbi orchestration/workflow repaired in a single PR
(`feat/266-orch-workflow-improvements`, HEAD `b9970dc`, 8 commits, +522/-38, 10 files).
Issue #266.

1. **gobbi/SKILL.md Step 4 polish** — 1-question mode (mode: chat/auto, default auto) + optional
   customize gate replacing the previous 2-question setup. Glossary moved to post-bootstrap position.
   6 stale cross-references ("2 setup questions", "setup Q1") eliminated via iter2 surgical fix.

2. **Memorization moment-of-capture** — New Core Principle in memorization/SKILL.md stating
   corrections/decisions/mistake-candidates are written at moment-of-occurrence during WORK, not
   deferred to MEMORIZATION. Reciprocal cross-link to mistake/SKILL.md P2.

3. **Delegation memorization hard gate** — New Core Principle in delegation/SKILL.md; Load
   Directives block updated in all 3 delegation templates (assistant/leader/executor) to mandate
   `memorization/SKILL.md` in the Skills tier for any MEMORIZATION-phase dispatch.

4. **Wrap-up Step 2.5** — New `### Step 2.5 — prior-loop MEMORIZATION compliance check` H3
   inserted in wrap-up/SKILL.md. 4-category gap table (zero-staging, shape-mismatch,
   template-mismatch, directory-absent); 5-Type classification (mechanical auto-backfill vs
   judgment-required NEEDS_CONTEXT); collision policy. Dogfooded today — 0 gaps found.

5. **Coverage Ownership Matrix row + Path conventions H3** — New row in evaluation/SKILL.md's
   Coverage Ownership Matrix for "Memorization staging shape + naming" (Consistency + Aesthetics).
   memorization/SKILL.md `**Path conventions**` promoted to `### Path conventions` H3 for stable
   anchor. COD-CONS-003 micro-fix: `testing` → `test` domain value in example text.

6. **Codex skill content** — 415-line codex/SKILL.md, 8 H2 sections. Key content: invocation
   priority hierarchy (codex exec universal, plugin agent manager-only, slash command user-only);
   assistant-wrapper dual-system evaluation topology (empirically derived from 3 failure modes);
   sandbox/CWD absolute-path mandate; timeout(1) wrapping; cost + budget awareness; anti-patterns.
   All 12 empirical witnesses (I1-I14, E1-E5) cited. Symlinks wired.

7. **Cross-link sweep** — 10/10 Cross-Link Manifest entries verified wired post-ship.

## Notable workflow events

- **Ideation FAIL at iter2**: Leader claimed vocabulary fix (COD-STRUCT-001) but substituted one
  wrong vocabulary for another. Triggered by "Looks good to me" trap — cited source line range but
  did not verify new values appeared there. → `leader-iter2-verification-claim-without-evidence.md`
  promoted to project mistakes.

- **Preparation iter2 REVISE**: Manager brief miscited locked Idea Design A from memory
  (wrong H2 section 7, wrong frontmatter key). Leader followed brief faithfully → REVISE.
  Iron Law 7 violation at the brief-construction step. → `manager-iter2-brief-failed-iron-law-7`
  promoted to project mistakes.

- **codex:codex-rescue fire-and-forget**: Manager spawned `codex:codex-rescue` in Ideation iter3
  for Codex evaluation. Agent returned immediately with placeholder; evaluation dir empty.
  Recovered via direct `codex exec` synchronous invocation. → promoted to project mistakes.

- **T01 Claude evaluator scope-narrowed**: Claude evaluator checked only the changed Step 4 section;
  Codex whole-file grep found 5-6 stale cross-references in other sections. Codex REVISE, iter2
  surgical fix PASS. → `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` to project mistakes.

- **T05 Claude evaluator inline response**: Claude evaluator returned PASS verdict inline with no
  per-perspective files written. Manager wrote proxy overall.md. Root cause: `evaluator.md` tools
  list lacks `Write`; evaluator chose inline rather than Bash-heredoc write.
  → `evaluator-returned-verdict-inline-no-per-perspective-files.md` to project mistakes.

- **T02 manager override**: Codex flagged plan's diff-scope gate as wrong (branch-scope under
  bundled PR topology). Manager override applied — plan's `verifies:` was written for per-task PR
  topology that no longer applied. Commit-scope semantics adopted for T03-T07 evaluations.

## What we learned

6 new process mistakes promoted to project memory. The most durable: (1) manager memory is
insufficient for "paste-inline-verbatim" spec work — Read the source before briefs; (2) evaluator
tool surface (no Write) requires explicit Bash-heredoc instruction in evaluator briefs OR Write
tool addition to evaluator agent definition; (3) codex:codex-rescue is async/fire-and-forget —
use codex exec directly for any evaluation workflow.

## Open items carried to next session

- `backlogs/normalize-path-conventions-h3.md` — H3 promotion at mistake/ and planning/ sites.
- Deferred design items (out-of-scope): 1-2 (skill-loading discipline), 1-3 (worktree-first
  session architecture), 2-1 (Auto-mode silence), 2-2 (Chat mode redesign), 4-1 (subagent hook).
- PR #266 needs: `git push -u origin feat/266-orch-workflow-improvements` + `gh pr create`.
- Prior session carry-forward: #1 (memory tool auth), #2 (task batch size), #4 (eval coverage).

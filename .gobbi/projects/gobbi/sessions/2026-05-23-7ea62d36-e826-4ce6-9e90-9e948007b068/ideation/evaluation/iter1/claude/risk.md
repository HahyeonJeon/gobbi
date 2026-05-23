---
artifact_type: per-perspective-evaluation
system: claude
perspective: risk
loop: ideation
iter: 1
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
verdict: PASS
---

# Risk — Claude evaluator iter1

## Artifact Summary + Memory reads

Same as project.md. Cross-checked against mistake file `codex-eval-session-write-path-nested-in-worktree.md`.

## Locked Frame (Stage 1)

**S-R1 — Rollback path identified for irreversible steps.**
**S-R2 — Blast radius bounded.**
**S-R3 — Security surface delta named or "none".**
**S-R4 — Two-week smell test.**
**S-R5 (adversarial) — Scope drift: design touches files outside the Scope Contract.**
**S-R6 — Coverage Matrix: Privacy / Licensing / Cost** — `not-applicable: this bundle is internal docs/skill edits with no new dep, no new dataset, no new external surface`.
**S-R7 (mistake-anchored) — Does Design A genuinely prevent the `codex-eval-session-write-path-nested-in-worktree` mistake from recurring?**
**S-R8 (mistake-anchored) — Does Design C prevent silent MEMORIZATION-skip regression (the actual α failure)?**

## Per-scenario per-check results

- [yes] S-R1: every change is a docs/skill edit; rollback = git revert.
- [yes] S-R2: blast radius = 6 skills + 1 new skill + 4 delegation templates. Enumerated in Scope Contract deliverable surface column.
- [yes/`not-applicable`] S-R3: no auth / no token / no network surface change.
- [partial] S-R4: see F-CLAUDE-R-01.
- [yes] S-R5: scope drift check passes — Design A-G only touches in-scope files.
- [`not-applicable`] S-R6.
- [partial] S-R7: see F-CLAUDE-R-02.
- [yes] S-R8: Design C anchors at `delegation/SKILL.md § Load Directives` block which is the exact failure surface of the α pathology.

## Typed findings

### F-CLAUDE-R-01 — Two-week smell test: Step 2.5 + naming-convention seed scenario double-implementation risks long-term redundancy

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Item D (Step 2.5 at Wrap-up) detects staging gaps. Item E (Consistency + Aesthetics seed scenario at every loop's EVALUATION) detects the same staging-shape gap one phase earlier. Both fire on the same class of regression. In two weeks, a maintainer sees two enforcement vehicles for the same concern and has to decide which to trust / extend.
- **Why it matters**: redundant guards drift apart (one strengthens, one weakens; they diverge). The draft's argument is "Item D is detective; Item E is preventive at earlier loops". This is genuinely valid (defense in depth), but the maintenance discipline of keeping both in sync is not documented.
- **Suggested direction**: at Planning, decide whether Item E's seed scenario explicitly delegates the *check definition* to Item D's classification table (single source of truth, dual enforcement points), or stands on its own (double truth, drift risk). Recommendation: single source of truth.

### F-CLAUDE-R-02 — Design A's "CWD + absolute-path discipline" does encode the mistake's lesson, but the mistake-prevention witness needs to be enumerated more concretely

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Mistake `codex-eval-session-write-path-nested-in-worktree.md` (loaded) § Corrected approach says: "Every evaluator delegation prompt that involves session writes must carry an explicit line: 'All session writes MUST use the absolute main-tree path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...`. Do NOT use relative paths or `pwd`-derived paths. The worktree CWD is NOT the session-write root.'" Plus "Manager-proxy when sandbox blocks." Plus "Post-eval sanity check." Three concrete prescriptions.
  
  Design A § Section 4 (Sandbox + CWD discipline) names the absolute-path-mandate and the manager-proxy fallback, but does NOT name the **post-eval sanity check** ("After any Codex evaluator completes, verify the staging files landed at the correct main-tree path before advancing to the next loop"). The mistake's third corrective is not represented in the Design.
  
  Design A Edge scenario "Codex CWD inheritance from worktree" (line 257) walks through the prevention path but stops at the manager-proxy fallback — does not include the sanity check.
- **Why it matters**: the mistake explicitly enumerates 3 correctives; Design A captures 2 of 3. The skipped one (post-eval sanity check) is the one that catches the regression when the first two fail (e.g., the manager forgets to inline the absolute path, codex writes to worktree, manager-proxy didn't fire). Without it, the same mistake can recur silently.
- **Suggested direction**: Design A section 6 (Use cases) or section 7 (Anti-patterns) should explicitly carry "Post-eval sanity check: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/...` to confirm files landed at the expected paths before advancing." Add to checklist item 14.

### F-CLAUDE-R-03 — Item G removes legacy setup questions; `orchestration/templates/settings.default.json` is asserted to encode defaults but not verified

- **Type**: assumption_risk
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Implementation Checklist item 13: "verify `orchestration/templates/settings.default.json` already encodes these (it should)". Design G (line 474): "The eval-mode and git-mode defaults move to `orchestration/templates/settings.default.json` (likely already there — verify in Execution)." Both phrasings are speculative; the verification is deferred from Ideation to Execution. If the defaults are NOT in settings.default.json, Item G is *broken* — there's no fallback for users who don't customize.
- **Why it matters**: a critical-path verification (the assumed settings defaults exist) is left to Execution. If the assumption breaks, Execution has to add the defaults *plus* the doc edit — scope creep. The Ideation phase should de-risk this with a 1-line `cat` or `jq`.
- **Suggested direction**: at Planning DISCUSSION first task: verify `cat orchestration/templates/settings.default.json | jq '.evaluation, .git'` returns the defaults. If yes, Item G is safe. If no, Item G expands to "add defaults to settings.default.json + rewrite Step 4". This is a 30-second check the Ideation draft should have stamped.

## Per-perspective verdict: **PASS**

Three `Medium` findings, all `Confidence 50`; no `High` ≥ 50.

## Low-confidence appendix

None.

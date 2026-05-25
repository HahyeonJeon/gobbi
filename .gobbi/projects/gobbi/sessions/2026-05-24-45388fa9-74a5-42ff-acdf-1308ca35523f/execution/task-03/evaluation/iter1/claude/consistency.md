# Consistency — T03 (commit 0632ad8)

## Artifact Summary + Memory reads
See project.md. The most load-bearing perspective for this change (per `claude-evaluator-step4-only-vs-codex-whole-file-grep` mistake: a docs edit that RETIRES a concept — the CLI command — requires whole-file grep for the retired vocabulary, not just the changed section). I ran whole-file greps and read the full edited file.

## Locked Frame (Stage 1)

**S1 — the retired vocabulary (`gobbi mistake promote`, CLI, post-session) is gone EVERYWHERE in the file, not just at the 5 named sites**
- [ ] `grep -c 'gobbi mistake promote'` over the WHOLE file = 0
- [ ] No residual "post-session" / "outside the session" / "user-facing command" / "separate command" framing
- [ ] cite: derived from project mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`

**S2 — everything that should change together changed together (the "agents never write" claim reconciled at every site)**
- [ ] Every absolute "never write" claim qualified with the Wrap-up exception
- [ ] Description frontmatter ↔ body ↔ Matrix ↔ Constraints all agree

**S3 — mistake/SKILL.md ↔ wrap-up/SKILL.md cross-artifact coherence**
- [ ] The "Wrap-up assistant promotes" claim matches wrap-up/SKILL.md's own model
- [ ] No contradiction with evaluation/SKILL.md's staging-routing description

**S4 — backlog ↔ mistake/SKILL.md cross-reference is accurate**
- [ ] Backlog's claim "the `hooks` tag is already added … as of Bundle C, T03" is true after this commit
- [ ] Backlog status/triggers internally consistent

**S5 (adversarial) — grep passes but a stale claim survives in unchanged prose**
- [ ] Whole-file read confirms no sentence still implies a CLI promotion path
- [ ] N=2 vs N≥2 inconsistency in backlog resolved

## Per-scenario per-check results
- S1.1 YES — whole-file `grep -c 'gobbi mistake promote'` = 0.
- S1.2 YES — `grep -niE 'gobbi mistake|post-session|outside the session|user-facing command|separate command'` over the whole file returned EMPTY. The retired framing is fully gone.
- S2.1 YES — three "never write" sites (desc/11/105) + Matrix rows 21-22 all qualified with the Wrap-up-assistant exception.
- S2.2 YES — description (line 3) now matches body; no frontmatter/body drift.
- S3.1 YES — wrap-up/SKILL.md line 16: "Wrap-up's WORK is the sole writer to project memory for cross-loop session artifacts"; mistake/SKILL.md's "Wrap-up assistant promotes" is consistent. (Minor: wrap-up notes the manager promotes Preparation's generate-now skills — an unrelated narrow exception, not contradicted here.)
- S3.2 YES — evaluation/SKILL.md routes `process` domain mistake-candidates to `staging/decisions/{slug}.md` with `mistake-candidate: true`; mistake/SKILL.md P3 + Output-paths match exactly.
- S4.1 YES — after this commit the `hooks` tag IS present at P1 step 3 + P3 step 5; backlog's claim is now true.
- S4.2 YES — backlog: status `in-progress`, perpetual-capture, N≥2 trigger all coherent.
- S5.1 YES — full read: no surviving sentence implies a CLI path.
- S5.2 YES — old "N=2 trigger" (pre-edit line) was corrected to "N≥2" in the Effort-estimate line; backlog now uses N≥2 consistently (verified: grep shows N≥2 at lines 19/29/34/38/44; no stray "N=2" remains).

## Typed findings

### C-1 (Low) — Cross-doc residual: CLAUDE.md still documents `gobbi mistake promote` (OOS for T03)
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Low
- Evidence: `.claude/CLAUDE.md` "Gobbi-specific tooling" still instructs "run `gobbi mistake promote`". This change-set retires that fiction in mistake/SKILL.md but the two docs now disagree on whether the CLI exists.
- Why it matters: "everything that should change together" — CLAUDE.md is the other half of the same claim. T03's contract explicitly excludes CLAUDE.md (OOS), so this is NOT a T03 defect, but the doc-set is transiently inconsistent until a follow-up sweeps CLAUDE.md.
- Suggested direction: track a follow-up to sweep CLAUDE.md (and any other consumer) in the same campaign. Do not touch in T03. FP-check: Out-of-scope → 0 confidence as a T03 defect; 100 as a real cross-doc residual. Low because OOS and non-blocking.

## Verdict: PASS
Whole-file grep (the load-bearing check per the prior mistake) confirms the retired CLI vocabulary is gone everywhere; all "never write" sites reconciled; cross-doc coherence with wrap-up + evaluation skills holds; backlog↔SKILL cross-reference now true; N≥2 normalized. The one finding is the explicitly-OOS CLAUDE.md residual.

## Low-confidence appendix
(none)

# Overall (Stage 3) — Cross-cutting Batch (iter1, claude)

## Stage 0 Recap

7 cross-cutting skills + child docs. W/W/H clear. No phase-mismatch.

## Stage 3 — Holistic Pass

### Cross-perspective tensions

**Tension A**: Structure and Risk both flag F-S-02 / F-R-01. Aesthetics says PASS. The 8× spawn ambiguity ranges from a polish concern (Aesthetics) to a Critical process-design break (Risk + Structure + Consistency) depending on whether you read it as "docs slightly out of sync" or "incompatible spawn topologies for the same loop." Risk's escalation to Critical is correct — the topology contradiction breaks Stage 3 Karpathy coverage entirely (no single agent sees all 7 perspectives if the per-perspective-agent reading is followed).

**Tension B**: Project (F-P-01) and Consistency (F-C-03) and Risk (F-R-02) all converge on Interview's invisibility. Three perspectives surface the same root: Interview is treated as a peer of the 6-step workflow but is invisible to orchestration/SKILL.md and memorization/SKILL.md's access matrix. Either Interview is a 7th step (then orchestration needs to enumerate it), or it's an out-of-band utility (then memorization's access matrix needs an explicit "interview exception" row).

### Cross-cutting findings

### F-O-01 — Pattern: load-bearing contracts repeated across skills without a canonical owner

**Type**: `general` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: The Scope Contract (F-P-02), evaluator spawn topology (F-S-02), user-question schema (F-U-02), and Type+Domain finding routing all live in 2-4 different docs. The redesign attempted single-source-of-truth via cross-reference (e.g., `delegation/templates/evaluator.md:89` "Load from `evaluation/SKILL.md` § Finding Metadata"), but the spawn topology was not unified the same way. Suggested pattern: pick ONE canonical doc per load-bearing contract, and replace cited duplicates with link-and-paraphrase one-liners.

### F-O-02 — Workflow phase doc child-pair pattern is asymmetric

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: Medium / **Disposition**: open

**Evidence**: Per-loop pattern is supposed to be: `{loop}/SKILL.md` (the leader/executor/assistant-facing contract) + `orchestration/workflow/{loop}.md` (the manager-facing orchestration). The pair pattern works for ideation / planning / execution / preparation. For Wrap-up, `wrap-up/SKILL.md` and `workflow/wrap-up.md` both exist. For Memorization, there's `memorization/SKILL.md` (assistant-facing) and `orchestration/workflow/memorization.md` (manager-facing) — but Memorization is a sub-phase, not a loop. The asymmetry: Evaluation has `evaluation/SKILL.md` + `workflow/evaluation.md` for the same reason. But these two are not loops either. The pattern is doc-organization, not state-machine semantics — would benefit from being explicit (e.g., "Sub-phase skills" section in memory-map.md).

### Karpathy 4-modes check

| Mode | Verdict | Evidence |
|---|---|---|
| **Wrong assumptions** | HIT | The redesign assumed single-source-of-truth was achieved for evaluator spawn — F-S-02 shows it wasn't. The Interview exception assumed memorization access matrix would absorb it — F-C-03 shows it didn't. |
| **Overcomplexity** | partial | `evaluation/SKILL.md` at 551 lines is large but defensible (integrated 4-stage). `memorization/memory-map.md` is comprehensive without bloat. The per-loop subdivisions of `orchestration/workflow/` are appropriate. Not overcomplex. |
| **Orthogonal edits** | mitigated | The 7 skills are tightly coupled by design (cross-cutting concerns share a manager+state-machine substrate). Cross-doc edits to fix F-S-02 will touch 4 files — but they all sync the same contract, not orthogonal changes. |
| **Imperative-over-declarative** | mitigated | The docs describe contracts and behaviors, not step-by-step mechanism. Frame-build + scenario-checklist pattern is declarative throughout. |

### Preserve list

**Must NOT touch on REVISE**:
- The 4-stage evaluation procedure structure (Stage 0/1/2/3) — well-designed, integrated
- The Type / Domain / Disposition / Confidence / Severity 5-field finding metadata
- The cumulative-staging-on-PASS contract (`memorization/SKILL.md:65-68` + workflow gate 4)
- The Question Card template structure in `discussion/SKILL.md:39-107` (Decision:/Description: + Reason/Evidence-to-change/Pros/Cons)
- The Anti-Sycophancy banned-phrase table in `discussion/SKILL.md:184-205`
- The 5-wave Interview structure (waves 1-5 in `interview/SKILL.md:99-217`)
- The Sole-writer-to-project-memory invariant + narrow-exception pattern (Preparation skills + Interview bootstrap + Wrap-up authority)
- The frontmatter-discriminator vs directory-discriminator pattern for finding-routed vs derivative staging (`workflow/memorization.md:143-175`) — load-bearing distinction, do not collapse

## Overall Verdict

**FAIL** — F-R-01 (Critical conf 75) inherited; F-O-01 (High conf 75) cross-cutting. Two perspectives (Structure + Consistency) returned FAIL at Stage 2; Risk returned FAIL. The contract contradiction at the heart of the evaluator spawn topology is the load-bearing process-design issue this batch surfaces.

## Per-perspective verdict table

| # | Perspective | Verdict |
|---|---|---|
| 1 | Project | REVISE |
| 2 | Structure | FAIL |
| 3 | Performance | REVISE |
| 4 | Aesthetics | PASS |
| 5 | Usage | REVISE |
| 6 | Consistency | FAIL |
| 7 | Risk | FAIL |
| — | Overall | FAIL |

## Loop verdict

**FAIL** — 3 perspectives FAIL, 3 REVISE, 1 PASS, Overall FAIL. The dominant theme is contract-divergence on load-bearing surfaces (evaluator spawn topology + Scope Contract anchor + user-question schema + Interview exception in access matrix). Remediation requires aligning 4 docs on a single evaluator-spawn narrative, defining the Scope Contract artifact_type schema canonically, schema'ing the NEEDS_CONTEXT `user-question:` block, and adding Interview to memorization's access matrix.

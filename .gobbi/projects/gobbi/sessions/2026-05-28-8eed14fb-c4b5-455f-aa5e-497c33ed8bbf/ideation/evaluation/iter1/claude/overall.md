# Evaluation — Overall (Claude · ideation iter1)

**Verdict: FAIL**

## Per-perspective verdicts

| Perspective | Verdict |
|---|---|
| Project | REVISE |
| Structure | REVISE |
| Performance | PASS |
| Aesthetics | PASS |
| Usage | REVISE |
| Consistency | FAIL |
| Risk | REVISE |

Aggregate worst-of: **FAIL** (Consistency).

## Stage 3 — cross-perspective tensions

**Tension 1 — Project says "specification" / Structure says "the spec is too thin to plan against."**

Project F-P1 finds that the artifact's §6.1 + §6.6 cross from specification-of-what-to-write into prose-of-what-to-write — i.e., too much Execution-stage prose for an Ideation deliverable. Structure F-S2 and Usage F-U1 + F-U2 find the OPPOSITE: the artifact does not contain a state-transition table for the Chat per-task slice, does not have explicit Scenarios / Implementation Checklist sections, and defers several foundational decisions (R1/R2/R3/R5) to Planning. **Both readings are correct simultaneously**: the artifact is over-specified in §6.1 + §6.6 (a particular sentence is written verbatim) and under-specified in §3.2 (the per-task slice's state-table is a diagram, not a contract) and §8 (R1/R2/R3 leave foundational design questions for Planning).

The pattern: the artifact mixes "what to write" (specification) with "how the prose should read" (Execution-stage) on the easy-to-write surface (the SKILL.md sentence) and stops at "Planning will figure it out" (deferral) on the hard-to-write surface (per-task state-table, on-disk shape under `chat/tasks/`, settings resolver behavior). Across-the-board, the spec should be uniformly at the spec level — and that means lifting §6.1 prose up to "spec the shape" AND lifting R1/R2/R3 down to "spec the resolution."

**Tension 2 — Aesthetics PASS / Consistency FAIL.**

The Idea doc reads well (Aesthetics PASS — only synonym drift at Low). But Consistency catches a Critical · 100 model-assignment inversion (F-C1) that the polished prose hid. This is the classic "looks fine" failure mode: the doc is well-written, so the leader and Aesthetics evaluator both miss the fact that a specific footnote says the opposite of what `settings.default.json` actually has on disk. Per `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`: "An evaluator that reports PASS after a normalization wave without providing a per-file order verification check — means the evaluator checked heading text, not position." Replace "order" with "content" — the same pattern.

**Tension 3 — Risk says "rollback path stated" / Usage says "rollback story incomplete."**

Risk R-Sc1.1 and R-Sc1.2 pass on rollback (CORRECTION + placeholder pattern). But Risk F-R1 + Usage F-U1 both note that the settings-cascade and state.json shape rollback is undocumented. The doc-level rollback is clear; the systems-level rollback is not. The Idea conflates "rollback the diff" with "rollback the change."

## Karpathy's four failure modes

| Mode | Check result |
|---|---|
| **Wrong assumptions** | Yes — F-C1 model-assignment inversion is an unverified premise that contradicts on-disk source-of-truth. F-U3 (placeholder existence) is a similar unverified premise. |
| **Overcomplexity** | Possibly — F-P2 (counterfactual not steel-manned) leaves open whether the simpler "add 3 more AskUserQuestion gates to existing 6-step shape" alternative would satisfy both backlogs without the state-machine supersession. Not conclusive, but the steel-man absence is the smell. |
| **Orthogonal edits** | Borderline — the Idea bundles two backlogs (chat-mode-tiki-taka + auto-mode-silence-vs-always-ask). The two backlogs are mechanically related ("modes need to behave differently") but the work is orthogonal at the artifact level (one redesigns Chat shape; the other codifies a matrix). Bundling is reasonable here per the 9 pre-resolved decisions (decisions 1-6 are about Chat shape; decision 7 is about Auto Always-Ask; decision 8 is about shared schema). The bundling is shallow, not deep — neither change requires the other. Acceptable; flagged as Low. |
| **Imperative-over-declarative** | Partial — §6.1 + §6.6 prescribe the exact wording (imperative), where a declarative spec would say "the line-241 lock supersedes to mode-dispatch semantics; preserve evaluation + memorization rigor" without writing the verbatim sentence. F-P1 captures this. |

## Cross-cutting findings

### F-O1 — The Idea doc passed "looks right" scrutiny while carrying a Critical factual error in §5

- **Type:** `general`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 100
- **Severity:** Critical
- **Evidence:** F-C1 (Consistency) found the executor↔evaluator model inversion. This is the kind of finding the project's own mistake `section-order-is-part-of-the-contract-not-just-the-set.md` warns about: "An evaluator that reports PASS after a normalization wave without providing a per-file order verification check — means the evaluator checked heading text, not position." Substitute "model assignment" — the leader (creator) cited `delegation/SKILL.md § Model Selection` but did not ground-truth against the settings file. The artifact's "13 self-flagged risks" approach catches structural risks well but does not catch factual claims that look plausible. This is a process gap: the leader's research step (Ideation Sub-step C) did not include a cross-check verification on the settings JSON.
- **Why it matters:** Recurring pattern. Layer-2 candidate: a leader-step discipline that "for every claim made about an on-disk source-of-truth (settings JSON, state JSON, mistake names), the leader runs a verification command and records its output in `research/{slug}.md`." This is mistake-stage memory.

### F-O2 — "Flag don't fix" is overused in §8 — 4 of 13 are structural decisions, not flags

- **Type:** `design_flaw`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** High
- **Evidence:** Aggregating Usage F-U1, Risk F-R1, and Structure F-S3: R1 (`maxIterations:0` semantics), R2 + R3 (per-task slice persistence in session.json + state.json), R5 (MEMORIZATION-narrowed contract scope), and R6 (Wrap-up's Chat input handling) are all "flagged for Planning" but each requires a design-level decision that Planning cannot make without re-doing the Ideation work. "Flag don't fix" should apply to **tactics** (whether to add a settings-validator gate, whether to ship two bundled defaults vs a companion file). It should NOT apply to data-model and contract decisions.
- **Why it matters:** Per Iron Law 12 (clear What / Why / How for any task). The current Idea hands Planning a How that is missing 4 foundational decisions. Planning is then forced into one of: (a) bounce to user → costs an Ideation round, (b) make the decisions without explicit user alignment → violates Iron Law 5, (c) escalate. Each is a workflow tax. The proper resolution is to bring the 4 deferred questions back into Ideation iter2 with proposed answers + AskUserQuestion.

## Preserve list

If the artifact returns from REVISE, the following are well-formed and should not be touched:

1. **§1 WHAT / WHY / HOW structure and the two-backlog witness framing.** The trigger is concrete, both backlogs are real, the framing is honest about what's being redesigned.
2. **§2 Scope Contract enumeration of the 9 pre-resolved decisions.** Clean restatement of the user-locked input set; do not re-litigate.
3. **§3.2 ASCII per-task slice diagram.** It correctly visualizes the shape; keep it (and add a state-table beside it per F-S2).
4. **§3.3 Per-loop discipline.** Five concrete sub-rules (forced user-driven DISCUSSION, three mode-specific gates, maxIter=2, evaluation-always, fresh-context, moment-of-capture). Each is well-anchored to existing project patterns.
5. **§3.4 task-record body shape (5-10 lines, the 5 H2 sections).** Conforms to memorization/rules.md notes type; small and pragmatic.
6. **§3.5 Explicit Wrap-up trigger — symmetric to the Destructive Always-Ask category.** Good analogical anchor.
7. **§4.2 Auto-Mode Always-Ask codification by reference + restatement.** Correct pattern (reference the canonical source in discussion/SKILL.md, restate in Auto-mode-specific language).
8. **§7 CRUD blast radius enumeration.** Complete, well-organized; per Iron Law 13 ("NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN") — this one section satisfies the rule.
9. **§8 R12 / R13 (Low) handling.** Pre-flight checks are appropriate; correct severity calibration.
10. **§6.6 ADR-style CORRECTION pattern.** Matches the precedent in `design-literal-retire-instruction-without-replacement.md`. The pattern is fine — only the exact verbatim wording is what F-P1 flags.

## Overall verdict

**FAIL.**

The single Critical · 100 finding (F-C1 = F-O1 — model-assignment inversion) is dispositive per the Stage 2 / Stage 3 verdict rule. Three other clusters (F-P1/F-S2/F-U2 = "spec is both over- and under-specified"; F-U1/F-O2 = "flag don't fix overused"; F-R1/F-R2 = "rollback path incomplete") are independently REVISE-worthy. The Aesthetics and Performance PASS verdicts stand — the doc is well-written and bounded in cost — but those do not offset the factual error and structural under-specification.

**Suggested direction (findings only, not prescriptions):**

- Correct the model-assignment footnote in §5 to match `settings.default.json`.
- Either drop the §6.1 + §6.6 verbatim prose down to "spec the shape, not the wording" (preferred) OR widen the §2 Scope Contract to include "spec the exact SKILL.md edit prose" (less preferred — pushes Execution into Ideation).
- Bring R1, R2, R3, R5 back into Ideation iter2 with proposed answers + AskUserQuestion (do not let Planning resolve them).
- Add a state-transition table for the Chat per-task slice (parallel to SKILL.md §358-365 Loop states).
- State a measurable acceptance criterion that confirms the redesign worked (e.g., "next post-merge Chat session produces ≥1 `chat/tasks/01-…/task-record.md` artifact conforming to §3.4 frontmatter schema"). Smoke-test gate analogous to §124 T1.h.
- Resolve the Chat per-sub-step layout under `chat/tasks/{NN}-{slug}/execution/...` (the F-S3 ambiguity).
- Steel-man the "do nothing structurally — add 3 more AskUserQuestion gates inside the existing 6-step shape" alternative and state why it fails.

These directions are recommendations to the manager + user, not prescriptions. The user decides which to address, defer, or dispute.

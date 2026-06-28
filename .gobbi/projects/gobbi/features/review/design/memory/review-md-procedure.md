---
name: review-md-procedure
description: Design for the Phase 0–5 review procedure — who-runs-review, preflight, understand-change, frame-building, broadest-first review, findings, verdict
type: design
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [design]
keywords: [procedure, phase-0-5, who-runs-review, findings-schema, verdict, handoff, broadest-first]
author: claude
supersedes: null
---

# Design: `review.md` code-review procedure (Phase 0–5 + Who-runs-review)

## Problem

A reviewer (human or agent) who wants to conduct a structured code review needs a concrete procedure: who conducts the review, in what order, what to check, how to write findings, and how to declare a verdict. The taxonomy alone is not sufficient — it names what to check but not how to run the review.

## Scope

- The procedure is the execution-guide half of `review.md`.
- It reuses gobbi's canonical vocabulary verbatim: 7 perspectives, finding schema fields, UPPERCASE verdicts.
- It adopts the dual-system and creator≠evaluator discipline from `evaluation/SKILL.md`.
- Availability: standalone/manual use NOW; automatic EVALUATION integration DEFERRED.

## Approach

### Who runs review

| Role | Responsibility |
|---|---|
| Executor (self-review) | Preflight only; catches obvious issues before submission; NOT the final reviewer |
| Reviewer (formal) | An agent or human OTHER than the creator; applies the taxonomy + procedure |
| Evaluator (formal agentic) | Two independent reviewers (Claude + Codex), spawned fresh, never continued across reviews, never shared context |
| Reviewer | NEVER edits the artifact — only reports findings |
| Manager | Re-delegates fixes to the executor after review; owns user-facing decisions |
| User decision | Via manager → active runtime's user-decision primitive; manager never auto-applies a user-decision finding |

**Availability now vs. deferred:**
- Manual / standalone / executor preflight self-review use of `review.md` is available NOW.
- Automatic use of `review.md` as part of the formal gobbi EVALUATION sub-phase is DEFERRED until wiring ships.

### Phase 0 — Preflight

- Confirm review target and scope contract (what the change claims to do).
- Identify all public API surfaces that changed.
- Load relevant project mistakes + conventions (what past reviews flagged in this codebase).
- **Confirm the change is small and self-contained.** If too large: push back and request a split before reviewing. (A reviewer may decline to review an overly large change.)
- List the safe verification commands (test runner invocation, type check, lint).

### Phase 1 — Understand the change

Read in this order:
1. Requirement / plan / issue (what the change should accomplish)
2. Diff summary (which files changed, what kind of change)
3. Public API changes (exported names, parameter shapes, return types)
4. Tests (what was tested; whether tests existed before)
5. Implementation (the actual code changes)
6. Docs / comments / examples

Reading implementation LAST avoids anchoring on the producer's shape before forming an independent understanding of the requirement.

### Phase 2 — Build the review frame

- Use the taxonomy to build a per-change checklist: which of the 13 points apply to this specific change?
- Prioritize by changed surface: a pure doc change does not warrant #1/#7/#8/#10 as high priority.
- Include ≥1 adversarial scenario: what is the worst realistic way this change could fail?
- Record the frame before reading the implementation a second time (prevents post-hoc rationalization).

### Phase 3 — Review in priority order (broadest-first)

Priority order mirrors Google's "what to look for" guidance:

1. Correctness / requirement fit (#1)
2. Public API & caller ergonomics (#2)
3. Error handling / trust boundaries / risk (#8)
4. Architecture / classes / state (#5, #7)
5. Tests & verifiability (#9)
6. Performance (#10)
7. Naming / comments / docstrings / imports / style (#3a, #3b, #6a, #6b, #11, #12)
8. Review communication (#13) — applies throughout; finalized in Phase 4

Reviewing broad concerns first prevents nitpick-driven REVISE verdicts on structurally sound changes.

### Phase 4 — Write findings

Each finding carries the **canonical gobbi schema** (no additions, no omissions):

| Field | Values |
|---|---|
| `finding-id` | `{reviewer}-{loop}-{perspective}-{seq}` |
| `Type` | `design_flaw` / `assumption_risk` / `scenario_gap` / `checklist_gap` / `general` |
| `Domain` | canonical domain from `evaluation/SKILL.md` |
| `Severity` | `Critical` / `High` / `Medium` / `Low` |
| `Confidence` | `0` / `25` / `50` / `75` / `100` |
| `Disposition` | `addressed` / `open` / `deferred` / `rejected` / `superseded` |
| `location` | file path + line ref |
| `Issue` | one sentence |
| `Evidence` | quote or path:line |
| `Why-it-matters` | impact if not fixed |
| `Change-needed` | concrete action |

**NO `blocking` field.** `blocking` is not a canonical finding field. Do not add it.

**Conventional Comments decoration (comment-level only, not a stored field):**
Inline review comments may use Conventional Comments labels + a `(blocking)` / `(non-blocking)` / `(if-minor)` decoration. This decoration maps onto Severity + Disposition for readability in PR comments; it is not stored in the finding schema.

### Phase 5 — Verdict & handoff

**UPPERCASE canonical verdicts** (mechanical thresholds):
- `FAIL`: any Critical finding with Confidence >= 75, or explicitly marked Critical by the manager.
- `REVISE`: any High-**severity** finding with Confidence >= 50.
- `PASS`: only Medium/Low severity findings.

**Qualitative bar (Google standard)**: approve once the change **improves overall code health**. Use principle / data to back up a required change; mark style preferences as non-blocking. Do not block for days on nits.

**Handoff package:**
- Verdict (UPPERCASE).
- Blocking findings (Severity >= High, Confidence >= 50): each with full schema + Change-needed.
- Non-blocking findings: full schema + Change-needed or "no action required."
- **Preserve-list**: items the reviewer confirms should NOT be changed — protects deliberate design choices from reflex-fix.

## Scenarios

- **B1** — Both Python and TS in one review: Phase 0 identifies two public API surfaces; Phase 4 findings cite property-led evidence, no language-siloed language.
- **B2** — Third language: general points still apply; Python/TS are illustrations, not gates. Phase 0 notes language; taxonomy applies.
- **B3** — Boundary disambiguation: a reader unsure whether to use `review.md` or `evaluation.md` opens the relationship section and resolves in one read.
- **B6** — Nitpick weaponization: the qualitative bar (improve overall health; principle over preference; mark nits non-blocking) defuses this at Phase 5.

## Validation

- [ ] Finished `review.md` carries the full Who-runs-review table with creator≠evaluator discipline.
- [ ] Availability note (now vs. deferred) present in Who-runs-review.
- [ ] Phases 0–5 present and in order.
- [ ] Phase 3 uses the broadest-first priority order.
- [ ] Phase 4 lists canonical schema fields verbatim; no `blocking` field.
- [ ] Phase 4 describes Conventional Comments decoration as a comment-level signal, not a finding field.
- [ ] Phase 5 uses UPPERCASE verdicts; REVISE threshold says "High-severity" not "High-confidence."
- [ ] Phase 5 includes Preserve-list in handoff package.

## Trade-offs

- **Phases 0–5 is verbose for small reviews**: practitioners calibrate phase depth to change size. Phase 0 preflight is the minimum for any review.
- **Dual-system pairing at every formal review**: expensive, but matches gobbi's anti-groupthink discipline. Standalone one-reviewer use is explicitly allowed for preflight self-review.

## Open issues

None for the procedure design. Open findings from iter2 (`codex-structure-002`, `codex-project-002`, `codex-aesthetics-003`) are managed in their respective staging files; none require procedure changes.

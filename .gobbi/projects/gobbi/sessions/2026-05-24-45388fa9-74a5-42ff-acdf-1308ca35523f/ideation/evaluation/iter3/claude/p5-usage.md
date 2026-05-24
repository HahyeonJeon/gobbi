# Perspective 5 — Usage
**Evaluator**: claude (iter3)
**Phase**: ideation
**Artifact**: draft-iter3.md — Bundle C foundation follow-ups (iter3)

## Artifact Summary + Memory reads

Same artifact as p1-project. Usage perspective evaluates the artifact from the Planner's, Executor's, and future-self's point of view.

**Memory reads**: same as p1-project.md.

**not-applicable (Accessibility / I18n)**: Documentation-only artifact with no user-facing strings or UI surface.

**Observability**: The artifact names diagnostic paths (session.json agents[] length check for SC-2.3, bounded awk grep for SC-5). Adequate for a docs-change scope.

---

## Locked Frame (Stage 1)

**Scenario A — Planner produces task list without going back to user for clarification**
- All 7 DL decisions are locked. SC-1..SC-8 provide grep-verifiable anchors. Per-Deliverable table enumerates files-may-touch and files-must-not-touch for all 6 CLs. DAG is explicit.
- BUT: DL-7 Option B is locked in the Open Questions section (line 549) but NOT propagated to SC-8.2 (line 161), CK-9 (line 329), D-9 (line 464), Decisions Log (line 464). A Planner reading SC-8.2 sees "A/B/C — user picks via the open question" — they cannot produce the CL-6 task without re-checking the Open Questions section.

**Scenario B — Executor reads each scenario and knows exactly what to change**
- CL-1..CL-4: one-file-each, explicit paths. Clear.
- CL-5: 11 files explicitly enumerated in Per-Deliverable table. M2 wording locked at Ideation (line 84-86). SC-5 gives per-file bounded commands.
- CL-6: Depends on Option B being propagated to CK-9. CK-9 currently says "per the user-locked Option (A/B/C)" — executor would need to read the Open Questions section to know which option is locked. Not self-contained for the Executor.

**Scenario C — Consumer reads SC-8.2 and knows what to verify (adversarial)**
- SC-8.2 (line 161) says "locked Option (A/B/C — user picks via the open question; Planning locks)." DL-7 is locked but SC-8.2 does not say Option B. A Planner verifying CL-6 post-execution against SC-8.2 must additionally know to apply the "If B" sub-clause. This is navigable but not self-evident at 3am.

---

## Per-scenario per-check results

1. **Scenario A + B + C**: The stale "open question" language at SC-8.2, CK-9, and D-9 makes CL-6 not self-contained for consumers. DL-7 is buried in the Open Questions section at the bottom of the artifact. This is the same root cause as I3-P1-001/I3-P4-001 but from the consumer's POV.

---

## Typed findings

### I3-P5-001 — CL-6 executor brief (CK-9) and verification anchor (SC-8.2) not self-contained after DL-7 lock

- **id**: I3-P5-001
- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: CK-9 (line 329): "Edit ... per the user-locked Option (A/B/C)". SC-8.2 (line 161): "locked Option (A/B/C — user picks via the open question; Planning locks)". DL-7 (line 549) locks Option B but is 540 lines below CK-9 and 390 lines below SC-8.2. A Planner building an executor brief from CK-9 alone would produce an ambiguous brief ("apply option X" with X unspecified). SC-8.2 verification would need the reader to resolve "If B" subcondition by consulting the Open Questions section.
- **Why it matters**: Usage principle: "The Planner asking the user is a failure mode for the Ideation artifact." CK-9 and SC-8.2 both require the reader to go find DL-7 to be actionable. This is avoidable with a one-line update.
- **Suggested direction**: Update CK-9 to say "apply Option B (DL-7)"; update SC-8.2 to say "Option B is locked (DL-7); verify using the 'If B' sub-clause below."

Note: root cause shared with I3-P1-001 and I3-P4-001. Single remediation resolves all three.

---

## Per-perspective verdict

**PASS** — Finding I3-P5-001 is Medium severity, confidence 100. Does not trigger REVISE per threshold rules. Otherwise the artifact is highly usable: all files enumerated, verification commands explicit, M2 wording locked, DAG clear.

---

## Low-confidence appendix

None.

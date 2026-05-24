# Perspective 3 — Scope
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

(Same artifact summary as p1-project.md; see that file. Memory reads identical.)

---

## Locked Frame (Stage 1)

**Scenario A — The 5 locked CLs bound the scope completely (no silent expansion)**
- Adversarial question: is there anything in the Design, Implementation Checklist, or Scenarios that touches files or scope not covered by CL-1..CL-5?
- [YES] Design D-7 (CL-3/CL-5 coordination) explicitly calls out the file-overlap and scopes it as a single task — no expansion beyond CL-3 + CL-5's already-defined scope.
- [YES] Backlog Deltas section covers exactly the 5 backlog files that correspond to the 5 CLs — no additional backlog closures.
- [PARTIAL] SC-6 contains: "PR description references the witness per Iron Law 10 for each of CL-1..CL-5" AND "backlog file `f-risk-01-subagent-ccsi-semantics.md` is **updated**, not closed." The second clause (backlog NOT closed, stays as alternatives-considered) is a scope boundary call that is mentioned once in SC-6 but NOT reflected in the Per-Deliverable table. The Per-Deliverable table CL-5 verification anchor does not specify whether the backlog file's `status:` field should remain open, close, or change to "addressed". This is a scope-boundary ambiguity for the executor.

**Scenario B — In-Scope and Out-of-Scope lists have no overlap**
- [YES] M1/M3 are Out-of-Scope; DL-5 locks M2 In-Scope. No overlap.
- [YES] "Refactoring session-start.sh or post-tool-use-agents.sh" is Out-of-Scope; they are witnesses (read-only) for CL-2. No overlap with CL-2's allowed files.
- [YES] "Additional backlog items (normalize-path-conventions-h3, item-1-2-broader-delegation-contract-verifier)" are Out-of-Scope with explicit Iron Law 10 rationale.
- [YES] CL-3 edits mistake/SKILL.md; CL-5 also edits mistake/SKILL.md. The Out-of-Scope list says "Editing mistake/SKILL.md beyond CL-3's domain-tag list change AND beyond CL-5's session-id-source paragraph change." This is correctly bounded — no overlap between the two CL scopes on this file since they address different sections.

**Scenario C — Nothing authorized is missing from In-Scope**
- [YES] All 5 user-locked DL-1..DL-5 decisions have corresponding In-Scope items (CL-1 for DL-3, CL-2 for the implicit hook-skill approval, CL-3 for iter1 DL-3 carryover, CL-4 for DL-1, CL-5 for DL-4+DL-5).
- [YES] DL-3's iter1 "mistake/SKILL.md small edit" is preserved as CL-3 with explicit carryover note ("iter1 DL-1/DL-2/DL-3... are preserved unchanged where compatible").
- [YES] f-risk-01 backlog disposition update (SC-6) is captured — the backlog stays open/addressed, not deleted.

**Scenario D — Nothing in Out-of-Scope that the user actually wanted in**
- [YES] DL-1 (β-1) is In-Scope as CL-4. Theme β is not out-of-scope.
- [YES] DL-4 (f-risk-01 absorption) is In-Scope as CL-5. f-risk-01 is not out-of-scope.
- [YES] The Out-of-Scope entry "Re-litigating DL-1 (β-1 ship-this-session)" correctly notes that evaluation must not surface this as an open question. User locked it.
- [YES] The Deferred section does not defer anything the user locked as In-Scope.

**Scenario E — CL-5's scope is bounded: exactly M2 codification, not M1 or M3 (adversarial)**
- [YES] Out-of-Scope explicitly states "M1 or M3 mitigation paths for f-risk-01."
- [YES] CL-5's files-must-not-touch includes "Any other skill file" (open-ended but anchored by the 12-file list in files-may-touch).
- [FAIL] There is a latent scope-gap: the files-may-touch for CL-5 lists 12 `.claude/skills/` files PLUS the f-risk-01 backlog file. But it does NOT mention whether `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (created by CL-2 in the same bundle) gets the M2 treatment. If the new skill body follows the existing convention of citing `$CLAUDE_CODE_SESSION_ID` in its Path Conventions section (following the current skill template), then either: (a) CL-5 must also update the new skill, or (b) the new skill is authored with M2 from the start. Neither is stated. The new gobbi-hook-authoring skill is not in the CL-5 12-file list, but it will be created in the same PR. If authored from a pre-M2 template, it may ship with `$CLAUDE_CODE_SESSION_ID` in its Path Conventions.

**Scenario F — Smoke-test gate T1.h scope-exclusion is correctly bounded**
- [YES] Smoke-test gate T1.h is explicitly Out-of-Scope ("orchestration row 5.5 ships in develop; the smoke gate is Memorization-scope, not Ideation. Flag in Wrap-up briefing."). Correct exclusion.

---

## Per-scenario per-check results

The critical failure: Scenario E reveals a gap where the new gobbi-hook-authoring skill (CL-2) may ship with the old `$CLAUDE_CODE_SESSION_ID` wording in its Path Conventions section if authored from a pre-M2 template, unless the executor brief explicitly covers this edge case.

---

## Typed findings

### S3-001 — gobbi-hook-authoring skill (CL-2) may ship with pre-M2 session-id wording if authored from old template

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: 
  - CL-5 12-skill list (§ In-Scope item 5, Per-Deliverable table CL-5 files-may-touch): does NOT include `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`.
  - The `interview/templates/project-skill.md` is cited as the template for CL-2. That template's Output paths section likely follows the existing skill convention of citing `$CLAUDE_CODE_SESSION_ID` (all 12 existing skills do, per I-3 evidence in draft-iter2.md which confirms the pattern persists across those files).
  - If the executor authors CL-2 from the template and does not apply the M2 update to the new skill (since it's not in the CL-5 list), the new skill will ship with the pre-M2 wording.
  - Confirmed: checked `.claude/skills/mistake/SKILL.md:129` — `{session-id} — Claude Code session ID from $CLAUDE_CODE_SESSION_ID`. This is the template wording the new skill will likely inherit.
- **Why it matters**: The Bundle C PR would land a new skill with the exact wording CL-5 is sweeping away from 12 existing skills. A future agent loads the new gobbi-hook-authoring skill and follows its Path Conventions literally, deriving a subagent-UUID path — the exact failure mode f-risk-01 describes. It undermines CL-5's intent on its first day.
- **Suggested direction**: Either (a) add gobbi-hook-authoring skill to the CL-5 12-file sweep scope (making it 13 files), or (b) require the CL-2 executor to author the new skill with M2 wording from the start, and add this as a verification check in SC-2 ("Path Conventions section uses delegation-prompt wording per M2, not $CLAUDE_CODE_SESSION_ID").

### S3-002 — Out-of-Scope note on mistake/SKILL.md edits uses "AND...AND" logic that could be misread

- **Type**: `checklist_gap`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: § Out-of-Scope: "Editing `mistake/SKILL.md` beyond CL-3's domain-tag list change AND beyond CL-5's `{session-id}`-source paragraph change. Anything else is out." The "AND...AND" phrasing could be read as "both edits are OK simultaneously" OR as "you must not exceed EITHER boundary." The intended reading is the second, but D-7 clarifies this: CL-3 domain-tag edit + CL-5 session-id edit are both permitted in the same file, coordinated as a single executor task. The Out-of-Scope clause is consistent with D-7 but the phrasing is awkward.
- **Why it matters**: An executor reading only the Out-of-Scope list (without D-7) might conclude that touching mistake/SKILL.md beyond its "own" CL is always prohibited. D-7 corrects this but is in the Design section, not the Scope Contract.
- **Suggested direction**: Add a cross-reference from the Out-of-Scope clause to D-7, or restate as "Only the domain-tag list change (CL-3) and the {session-id} Path Conventions row (CL-5) are in-scope for mistake/SKILL.md; any other edit is out."

---

## Per-perspective verdict

**REVISE** — Finding S3-001 is High severity at Confidence 75. Per verdict thresholds: any High finding with confidence ≥ 50 → REVISE. The gobbi-hook-authoring skill (CL-2) may ship with pre-M2 session-id wording, directly undermining the bundle's own CL-5 goal if not addressed. This is a real coordination gap in the scope definition.

---

## Low-confidence appendix

- S3-002 (Confidence 50, Low): Out-of-Scope "AND...AND" phrasing is ambiguous but D-7 resolves it. Real but low impact.

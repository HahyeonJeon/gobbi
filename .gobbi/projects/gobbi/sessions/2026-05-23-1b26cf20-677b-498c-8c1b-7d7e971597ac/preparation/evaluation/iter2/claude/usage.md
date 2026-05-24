# Preparation iter2 — USAGE perspective (Claude)

Perspective: usage (downstream consumer perspective — Planning's perspective)
Verdict: **PASS**

## Frame (Stage 1)

Scenario U1: Planning task brief author can cite mirror-policy without ambiguity.
Scenario U2: Planning can enumerate the 5 workflow phase docs without re-deriving from `ls`.
Scenario U3: Planning evaluator can mechanically verify T1 brief compliance with the D-4 grep gate.
Scenario U4: Downstream notes for Planning intake stay accurate.
Scenario U5 (adversarial): Planning author reading the iter2 draft + 5 staging files arrives at one unambiguous edit topology.

## Per-scenario results

U1: PASS. The corrected mirror-policy lock says "Planning briefs can cite either path; prefer the workspace `.claude/skills/...` path" (draft line 185, new decision file line 37, Notes-for-Planning line 235). One recommendation, one rationale, no contradictions.

U2: PASS. D-4 design file lines 37-43 enumerate the 5 files as a markdown table with explicit canonical paths. Planning copy-pastes the 5-row table directly into the T1 brief.

U3: PASS. D-4 design file lines 102-109 give the exact bash command for Planning's smoke test (5 expected matches + 0 expected matches). Mechanical, scriptable, evaluator-friendly.

U4: PASS. Notes for Planning intake section (draft lines 232-239) updated 1-for-1 to match the corrected mirror lock; D-4 verification gate added as a Planning intake item.

U5: PASS. Cross-referencing draft (Mirror propagation policy section + Notes for Planning) → mirror-canonical-symlinks decision → D-4 design (Approach + Excluded section) all converge to: "edit either path, prefer workspace path, no mirror-edit needed, validate with the dual grep gate." One model, three pieces of evidence reinforcing it.

## Findings

### F-U1-iter2 (Low, Confidence 100, general / docs-sync)

**Cross-iter disposition: iter1 F-U1 (High/100 5-vs-7 downstream ambiguity) → addressed.**

Evidence: D-4 design file "## Excluded files + rationale (added iter2)" + the F-1 scenario at line 51 explicitly names the 5-vs-7 trap and points the executor at the fix.

### F-U2-iter2 (Low, Confidence 100, general / process)

**Cross-iter disposition: iter1 F-U2 (High/100 contradictory mirror guidance) → addressed.**

Evidence: iter1 had three rules ("workspace canonical / manual mirror-edit recommended / executors flag drift"); iter2 collapses to one rule ("either path works, prefer workspace path, no mirror-edit needed"). The Notes for Planning intake "Mirror awareness (iter2 corrected)" entry (draft line 235) is the single canonical Planning-facing statement.

### F-U3-iter2 (Low, Confidence 100, general / docs-sync)

**Cross-iter disposition: iter1 F-U3 (Medium/100) → preserved.**

D-3 mistake-citation discipline is untouched in iter2; Planning evaluator can still grep each T1 brief for the 3 mistake basenames as iter1 mandated.

### F-U4-iter2 (Low, Confidence 100, general / process)

**Cross-iter disposition: iter1 F-U4 (Medium/100) → preserved.**

Sub-step A → D findings rawdata is referenced in iter2 (draft line 24) with the explicit note that iter1 outputs remain valid. Planning intake can still rely on it.

## Must-preserve list

- The "prefer workspace path" recommendation (matches loader read-path convention).
- The dual grep gate (5 matches + 0 matches) — mechanically enforceable.
- The Notes for Planning intake section as the single landing page for Planning brief authors.

## Verdict

**PASS.** All iter1 High findings on the usage axis are closed. Downstream Planning consumer has one unambiguous edit topology + one mechanical verification gate.

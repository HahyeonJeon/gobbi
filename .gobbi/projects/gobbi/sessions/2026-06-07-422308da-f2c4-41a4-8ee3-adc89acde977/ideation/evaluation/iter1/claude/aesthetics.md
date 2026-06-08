# Aesthetics — Ideation Idea: Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads
(See project.md for Stage-0 summary + memory reads.)

## Locked Frame (Stage 1)

**S1 — The Idea doc itself is self-evident and readable**
- [ ] A new reader understands the 3 problems + the fix from the doc alone
- [ ] Section headings follow the project's Ideation-draft convention

**S2 — Proposed rule text leads with the imperative, not agent-psychology**
- [ ] The §X sketch text leads with the rule (per principle-text-lead-with-imperative mistake)
- [ ] No unrequested cross-refs / carve-outs padded in

**S3 — Naming is concrete; a Planner could lift names directly**
- [ ] Section names (§X.1-§X.4) are descriptive
- [ ] No internal contradiction where the same section has two names/numbers

**S4 (adversarial) — A skimmer walks away with a wrong impression**
- [ ] Headlines accurately summarize the section that follows

## Per-scenario per-check results

**S1** — PASS. The doc is self-evident: Scope Contract → Framed Problem (with per-problem root cause) → Canonical-home verification → CRUD plan per file → restructure summary → consistency risks → scenarios → checklist → decisions log. A fresh reader can follow it. (verified)

**S2** — PASS. The §X sketch text leads with imperatives: "Evaluation is mandatory and never a question," "The manager MUST NOT evaluate," "On REVISE, auto-iterate." Line 84 explicitly commits to this discipline citing the mistake. (verified)

**S3** — REVISE (see F5). The section is named both "§X" (placeholder, lines 90, 96-113, 156-163) AND concretely "new §4" / "trailing §7" depending on the placement option. Because the placement is unresolved IN THE DOC (despite being locked in the brief), the section has two competing numbers, and the cross-references (§X.3 cites "§6"; §X.2 cites "§3") are written against the §X placeholder, not the locked trailing position. A Planner cannot lift a stable section number.

**S4** — PASS. Headlines match content. The restructure-summary (lines 154-163) accurately maps each sub-block to its problem.

## Typed findings

### F5 — Section number is unresolved in the doc (§X placeholder + two competing concrete numbers)
- **Type:** general
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** The new section is referred to as "§X" (lines 90, 96-113, 156-161), as "new §4" (line 92), and as "trailing §7" (lines 173, 214). The §X.3 sketch cross-links to "§6" and §X.2 to "§3" — anchor numbers that are only correct under one placement option.
- **Why it matters:** Aesthetic/clarity: the artifact does not commit to one section number, so its internal cross-references are written against a placeholder. Downstream of F1 (the locked-placement contradiction) — once trailing-append is adopted as the single placement, the §X label and its cross-links should resolve to concrete, correct numbers.
- **Suggested direction:** Resolve §X to the trailing-append concrete number; fix the §X.2/§X.3 internal anchor citations to match.

## Low-confidence appendix
(none)

## Verdict: PASS

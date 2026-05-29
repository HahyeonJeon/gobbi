# Structure Perspective — chat-mode.md (T1, iter1)

**Verdict:** PASS

**Scope:** Section ordering, heading hierarchy, internal cross-references, code-fence integrity, table structure, navigability.

## Heading map (verified literally)

```
H1  Chat Mode                                      (L1)
H2  §1 — Overview                                  (L15)
H2  §2 — Mode posture                              (L32)
H2  §3 — Per-task slice workflow shape             (L59)   ← contains diagram fence
H2  §4 — Chat MEMORIZATION canonical (R5 lock)     (L133)
H2  §5 — Per-loop discipline                       (L178)
H2  §6 — task-record artifact spec                 (L210)
  H3 6.1 Path and layout                           (L215)
  H3 6.2 Frontmatter type — deferred to Planning   (L251)
  H3 6.3 Body structure                            (L268)  ← body H2s inside fence
  H3 6.4 Writer                                    (L289)
  H3 6.5 Wrap-up role                              (L299)
H2  §7 — Wrap-up trigger                           (L309)
H2  §8 — Workflow Status Display                   (L337)
  H3 8.1 Rendering shape                           (L339)
  H3 8.2 Per-task state-transition table (F-S2)    (L380)
  H3 8.3 Worked example — Status Display           (L407)
H2  §9 — Settings defaults                         (L446)
H2  §10 — Discuss-first contract                   (L472)
H2  Cross-references                               (L485)
```

10 numbered sections + Cross-references. The hierarchy is two-deep (H2 / H3), consistent. No H4. No skipped levels.

## Section-order coherence (vs Idea §3)

The doc's section ordering re-frames the Idea-doc structure into a sub-document layout:

| Idea source | chat-mode.md target | Note |
|---|---|---|
| §3.1 Mode posture | §2 | Plus a §1 Overview added at the top (orientation) |
| §3.2 Per-task slice diagram | §3 | Diagram body identical in shape (Steps 2-5 + boundary + gate) |
| §3.3 R5 canonical statement | §4 | Single canonical anchor (correct R5 lock) |
| §3.4 Per-loop discipline | §5 | |
| §3.5 task-record artifact spec | §6 (split into 6.1-6.5) | Re-shaped from a 6-row table into 5 H3 subsections; richer than source |
| §3.6 Wrap-up trigger | §7 | |
| §6.3 Worked Status-Display example | §8.3 | |
| §8 F-S2 state-transition table | §8.2 | |
| Settings | §9 | Added — Idea §3.6/§5 cross-cuts; consolidated here |
| Discuss-first contract | §10 | Re-stated separately at mode-level after appearing in §5 |

Mistake `section-order-is-part-of-the-contract-not-just-the-set` check: the Idea-doc explicit ordering (§3.1 → §3.6) is preserved in canonical sequence at sections §2 → §7. The added §1 (Overview) and §8-§10 are post-spec sections that don't perturb the canonical order. ✓

## Internal cross-references (every back-pointer verified)

- L5: "(R5 lock — see §4 for the canonical statement)" — §4 exists at L133 ✓
- L11: front-link to `memorization/SKILL.md` — back-link from §4 at L158-L160 ✓
- L76, L94, L100: diagram references "see §4 canonical" / "§4" — match ✓
- L129: "See §4 for the single canonical statement" — match ✓
- L172-L174: "any reference … is a short-form pointer to this section" — declarative anchor, intentional ✓
- L195: "with the §4 narrowed PASS path" — match ✓
- L388, L394, L398: state-table cells cite "§4 narrowed PASS path runs" — match ✓
- L351-L353: "see §7" for Wrap-up trigger — match (§7 at L309) ✓
- L467-L468: "see §8.2 per-task state-transition table above" — match ✓
- L488-L490: cross-references back to `orchestration/SKILL.md §` sections — load-bearing forward links to the parent skill ✓

No dangling references found.

## Code-fence integrity

Three fenced blocks verified:
1. Diagram fence L61-L120 (104 lines, ASCII flowchart) — opens with ```` ``` ```` and closes with ```` ``` ```` ✓
2. Path-and-layout fences L221-L223 (4 lines) and L236-L245 (10 lines) — both balanced ✓
3. Body-structure fence L272-L287 (16 lines, language tag `markdown`) — balanced ✓
4. Status-display fence L412-L431 (20 lines) — balanced ✓

## Findings

**No findings above Low severity.**

Low / observational:
- L273-L285 body-structure example renders `## What the user asked` etc. inside a `markdown`-tagged fence. Correct as authored (the body schema literally uses H2). A consumer that strips fences before extracting a ToC could mis-list these as real headings — but no such consumer exists in this project today. Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `docs-sync`.
- §9 settings-defaults table introduces `workflow.wrap-up.discuss.mode` etc. which the Idea doc and Plan didn't explicitly require this sub-doc to ship. Scope-creep risk if Planning later disagrees with these specific defaults, but the table is bounded and labels them as Chat-specific, and the Plan T1 trace cites "Idea §3.6 — Wrap-up trigger" implicitly covers Wrap-up wiring. Confidence: 25. Severity: Low. Type: `scenario_gap` (gap in Plan vs delivery scope clarity).

## Must-preserve list

- Heading numbering scheme (§1-§10 + Cross-references) — re-ordering would break the internal `§4` / `§7` / `§8.2` cross-pointers.
- Diagram fence L61-L120 as a single block (do NOT split for prettiness — the visual unity carries the structural argument).
- §6 split into 5 H3 subsections (6.1-6.5) rather than collapsed into a 6-row table — improves discoverability of D-A and D-B in particular.
- §8.2 18-row state-transition table preserved as-is for state-machine readers.

## Overall verdict

**PASS.** Structure is well-organized, internally consistent, with verified cross-references and a clear two-level hierarchy. The doc re-shapes Idea §3 into a sub-document layout while preserving the canonical order of spec items.

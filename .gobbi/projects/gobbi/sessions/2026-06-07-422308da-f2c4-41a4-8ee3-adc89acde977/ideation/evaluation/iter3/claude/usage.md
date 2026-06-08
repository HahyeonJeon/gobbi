# Usage (Stage 2) — iter3

## Locked Frame (Stage 1)
- **Planner can act without going back to the user** — every edit is specified to section + sketch wording.
- **Executor knows exactly which evaluation.md sections to mode-split vs keep** — the boundary is unambiguous.
- **(adversarial) A consumer forms the wrong mental model** — applies the no-interrupt rule to a safety gate, or fails to mode-split a routine-triage path.
- **Accessibility/I18n** — not-applicable: docs-only, no user-facing UI strings.

## Per-scenario per-check results
- The implementation checklist (draft 247-256) now item 4 enumerates: mode-split Iteration Caps + Stuck detection + Regression marking; KEEP Degraded-mode + Severity-gated-major + both-fail interrupting; add the half-line label to Severity-gated divergence. A Planner can map each to a section 1:1. YES.
- The classification table (69-77) is the single lookup that tells the Executor which class each section is. Each row names the exact evaluation.md section + the Auto behavior + the class. Unambiguous. YES.
- Over-application guard: §7.3 carve-out + §7.4 NEVER-row + File-2 framing sentence each independently state the safety gates still interrupt. A consumer reading any one of the three docs reaches the boundary. YES.
- Under-application guard: the framing sentence (draft 159) names all three routine-triage sections explicitly, so none is left mode-agnostic by omission. YES.

## iter1/iter2 finding disposition
- **F6 (High) — locked decision handed to Planner as open.** disposition: **addressed** (unchanged). Placement locked in D5 + body + checklist.

## Typed findings
None above Low. The boundary is consumable both ways (cannot over- or under-apply).

## Low-confidence appendix
None.

## Verdict: PASS

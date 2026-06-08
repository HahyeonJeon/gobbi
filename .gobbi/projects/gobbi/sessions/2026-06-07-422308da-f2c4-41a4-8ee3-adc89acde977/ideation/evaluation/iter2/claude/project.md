# Project (Stage 2) — iter2 — Harden Auto-mode evaluation discipline

## Stage 0 — Target understanding
- **What:** Docs-only Idea hardening Auto-mode evaluation discipline across 3 files (auto-mode.md, workflow/evaluation.md, .claude/CLAUDE.md) to root-fix 3 manager misbehaviors.
- **Why:** Auto manager invents an eval-policy question, self-evaluates, and idles asking "defer or not."
- **How:** New trailing §7 in auto-mode.md + sharpen evaluation.md + mode-split CLAUDE.md and evaluation.md § Iteration Caps.

## Frame — scenarios + checks
- Does the Idea solve the briefed problem (the 3 manager misbehaviors)? Yes — §7.1/§7.2/§7.3 map 1:1 to Problems 1/2/3, each with verified root cause (draft 40-57).
- Does it stay inside the locked 3-file Scope Contract? Yes — Scope Contract (draft 20-24) names exactly the 3 files; out-of-scope files explicitly flagged never-edit.
- Any scope drift from the iter1 §4-insert path? NO. Verified: the only §4-insert/renumber mentions are labeled "rejected and removed" (draft 224) or refer to the existing §4 defaults table (draft 119). No design path touches orchestration/SKILL.md.

## iter1 finding disposition
- **F1 (High, conf 100) — placement committed to rejected §4-insert.** disposition: **addressed**. Every chosen-path reference is now LOCKED trailing-append §7 (draft 91-93, 164, 207, 224). §4-insert appears only as rejected (224). orchestration/SKILL.md:247 stays untouched (verified: SKILL.md:247 points at "auto-mode.md §3 / §6", both unchanged under no-renumber).

## Stage 2 findings
None above Low. The chosen design solves the right problem and stays in scope.

- **Type:** general / **Domain:** docs-sync / **Disposition:** open / **Confidence:** 75 / **Severity:** Low
  **Evidence:** draft lines 57 and 187 retain "§X" tokens ("hardening §X alone", "the §X.2 iter1 sketch").
  **Why it matters:** These are retrospective references to the iter1 sketch, not live placeholders, but a Planning reader could momentarily mis-read them as unresolved. Cosmetic.
  **Suggested direction:** optionally reword to "the prior-iter sketch" — Planning-stage polish, not blocking.

## Verdict: PASS

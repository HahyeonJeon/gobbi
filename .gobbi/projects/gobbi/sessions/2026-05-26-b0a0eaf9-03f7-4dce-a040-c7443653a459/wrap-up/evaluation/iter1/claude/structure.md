# Wrap-up Evaluation — Structure (Claude, iter1)

## Artifact Summary + Memory reads
(See project.md for full W/W/H + memory reads.) Structure lens: is the promoted memory well-structured and routed per the deterministic table without inventing destinations?

## Locked Frame (Stage 1)
1. Promoted files match directory conventions — checklist: each lands at a path the routing table defines.
2. Slugs consistent with existing patterns — checklist: kebab-case, ≤60 chars, no collisions.
3. No new top-level memory dirs invented — checklist: only features/project-memory subdirs + backlogs/reviews/mistakes/notes used.
4. Frontmatter complete — checklist: promoted files (mistakes, journal, plan) carry required base fields.
5. Every staging file landed at its deterministic destination per routing table — checklist: each manifest row's destination matches wrap-up/SKILL.md routing.
6. (adversarial) Wrap-up invents a new schema — checklist: diff destinations vs documented routing table.

## Per-scenario per-check results
1. PASS — feature subdirs (decisions/checklists/references/discussions/scenarios/design/plans) all exist under features/project-memory; bootstrapped lazily.
2. PASS — slugs kebab-case; review + plan carry {date}- prefix per table; backlog/mistake slugs unprefixed per table.
3. PASS — no invented top-level dir; backlogs/, reviews/, mistakes/, notes/ are all documented destinations.
4. PASS — 5 mistakes carry name/type/scope/feature/status/created/session/domain frontmatter; journal carries notes frontmatter; plan carries plans frontmatter.
5. PASS — verified mechanically:
   - backlogs/project/{slug} -> backlogs/{slug} (manifest #1) ✓
   - checklists/{slug} -> features/{f}/checklists/{slug} ✓
   - decisions/{slug} (default) -> features/{f}/decisions/{slug} ✓
   - decisions/{slug} mistake-candidate:true -> mistakes/{slug} (manifest #27, project-scope) ✓
   - references/discussions/scenarios/design -> features/{f}/... ✓
   - planning/staging/plans/{slug} -> features/{f}/plans/{date}-{slug} (manifest #31) ✓
   - reviews/{slug} -> reviews/{date}-{slug} (manifest #32) ✓
6. PASS (adversarial) — no schema invention; all destinations are routing-table rows.

## Typed findings
- Type: general | Domain: docs-sync | Disposition: open | Confidence: 50 | Severity: Low
  Evidence: on-disk `find features/project-memory -name '*.md'` = 31, but git shows 13 of 14 promoted decisions are untracked-new (1 decision slug matched a pre-existing tracked file). The manifest claims 28 feature PROMOTE; the extra on-disk files are a pre-existing tracked README + a decision file that pre-dated this session's snapshot enumeration.
  Why it matters: count auditors may see 31 vs claimed 28 and suspect drift; in fact it is pre-existing content + idempotent overwrite, not a routing error.
  Suggested direction: none required — additive + idempotent overwrite is correct behavior. Recorded for transparency only.

## Low-confidence appendix
(none)

VERDICT: PASS

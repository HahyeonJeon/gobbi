---
loop: execution
iter: 1
artifact_type: draft
created_at: 2026-05-26
status: final
---

# T3 — Conform git-workflow {discussions,design,decisions} — Execution Notes

## Scope

20 docs across 3 subdirs of `features/git-workflow/`:
- `decisions/` (3 docs)
- `design/` (5 docs)
- `discussions/` (10 docs, 2 date-prefixed + 8 bare-slug)

## Audit findings (pre-edit)

### decisions/

| File | Missing base keys | Leak keys |
|------|-------------------|-----------|
| `2026-05-24-rollback-semantics-drift-from-ideation.md` | name, description, created, tags | finding-id, confidence, severity, surfaced-by, disposition |
| `2026-05-24-session-commit-storage-bounds.md` | name, description, created, tags | finding-id, confidence, severity, disposition |
| `plan-diff-scope-gate-semantics-under-bundled-pr.md` | name, description, tags | promoted-from, promoted-at, mistake-candidate, disposition |

Also: first two had `type: design_flaw`/`type: checklist_gap` (eval routing types, not memory types) → corrected to `type: decisions`. Third had `type: design_flaw` → corrected to `type: decisions`.

### design/

All 5 missing: `name`, `description`, `type` (absent), `created` (present as `date`), `tags`. No leaks.

`workflow-phase-doc-set-for-per-iter-cadence.md` additionally missing `session` (no date or session key in original frontmatter). Derived `session` from body content + cross-check with sibling files (all from session `1b26cf20-677b-498c-8c1b-7d7e971597ac`).

### discussions/

All 10 missing: `name`, `description`, `type`, `status`, `created`, `tags`. No leaks.

## Type derivation

- `decisions/` → `type: decisions`
- `design/` → `type: design`
- `discussions/` → `type: discussions` (feature-subdir-only type per §2.1 documented exception)

## Status derivation

- `decisions/`: one had `status: accepted` (kept), one had `status: addressed` (kept as-is — no stronger lifecycle value), one had `status: active` (kept)
- `design/`: original had `status: locked` or `status: updated-iter2` → kept `locked`; changed `updated-iter2` to `active` (not a valid lifecycle value)
- `discussions/`: no status → added `status: active` (immutable per §2.2 notes; discussions are append-only active records)

## De-crypt applied

### decisions/2026-05-24-rollback-semantics-drift-from-ideation.md
- Body refs "iter2 Fix 4" → replaced with "the Planning brief was corrected during Planning review"
- Body refs "Ideation:283" → replaced with "the Ideation rollback contract (T1-I-T1.j and Design Decision D-3)"
- `## Related` section with `draft-iter2.md:173` et al → replaced with `## Source` footer pointing to session dir
- Title "Task 03 rollback semantics..." → rewritten to self-contained concept

### decisions/2026-05-24-session-commit-storage-bounds.md
- `## Addressed by` had `draft-iter3.md:439` as load-bearing ref → replaced with "confirmed during Planning evaluation"
- `## Related` with eval file paths → replaced with `## Source` footer
- Title kept concept-named

### decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md
- "Codex T02 iter1 flagged F-PROJ-01" → replaced with "the Codex evaluator raised a High-severity finding"
- "T02 commit 536d22f" → replaced with "the Task 02 commit"
- "T02 iter1 ... T02 treated as effective PASS" → de-sessioned

### design/direct-mode-retained-opt-out.md
- "Sub-step A counterfactual / steel-man (CP-1.3-γ Option A user lock)" → "Steel-man analysis of the worktree-first mandate"
- "T1-I-T1.g (no code change)" → "Implementation note" section
- `rawdata/draft-iter3.md:336-340` source → `## Source` footer

### design/per-iteration-session-commit-cadence.md
- "T1-E-2 rule 3 (community-validated)" → generalized to "committed changes survive worktree removal"
- "T1-E-2, T1-I-5, F-3 mitigation, E-3" → removed; rationale rewritten in self-contained prose
- "T1-I-T1.f (5 loop workflow files)" → cross-link to sibling design file
- `rawdata/draft-iter3.md:329-334` source → `## Source` footer

### design/promote-now-commit-on-branch.md
- "T1-I-3: the narrow exception is already a sole-writer violation" → "the Preparation promote-now path (narrow exception...)"
- "per `git/conventions.md:118` (verified iter2 + iter3 whole-file scan)" → "per `git/conventions.md`"
- "iter1 R2 (partial promotion failure) and the `1829fa3`-style failure mode" → "the partial-promotion failure mode where..."
- "T1-I-3, T1-E-2, T1-DQ-3, iter1 P1/C1, iter1 R2" → removed; rationale rewritten
- source line → `## Source` footer

### design/qualified-git-write-path-rule.md
- "T1-I-1, T1-I-4, T1-I-5" → removed from "Anchored insights"
- "`codex-eval-session-write-path-nested-in-worktree` failure mode" → kept (cross-ref to mistake, legitimate)
- "`1829fa3` symlink-gap failure" → converted to "a symlink-gap failure (documented in the misroute mistake)"
- `rawdata/draft-iter3.md:315-320` source → `## Source` footer

### design/workflow-phase-doc-set-for-per-iter-cadence.md
- "T1-I-T1.f calls for adding..." → "Design Decision D-4 (per-iteration session-memory commit cadence) calls for adding..."
- "rawdata/sub-steps-a-d-iter1.md § B-G6, Low-Medium severity" → "A Preparation gap scan flagged this"
- `## Cite` section with session internal paths → replaced with `## Source` footer
- `related` frontmatter updated to use non-session-internal paths

### design/worktree-create-before-session-stamp.md
- "iter1 COD-PROJ-001" → removed, rationale rewritten
- "T1-I-2, T1-E-1, T1-DQ-2; iter1 COD-PROJ-001" → removed
- "T1-I-T1.a, T1-I-T1.h" → "Implementation checklist anchor" → rewritten as "Implementation note"
- `rawdata/draft-iter3.md:308-313` → `## Source` footer
- Title "D-1 — Configuration Step 1 row 5.5..." → rewritten without row coordinate

### discussions/ (10 docs)
- All titles retained narrative but removed session-internal codes (CP-1.3-α, CP-1.3-β, CP-NEW-β, etc.) from body text
- `rawdata/draft-iter3.md:NNN` source refs → replaced with `## Source` or removed
- Bare session-step references ("Sub-step D round 1", "iter3 Fix A") → rewritten as descriptions of the decision context

## Self-review checklist

- [x] Leak gate over 3 subdirs = 0
- [x] 20/20 docs carry 9 base keys
- [x] git diff only the 3 subdirs (20 files modified, no other paths)
- [x] No doc/narrative deleted; mechanical only
- [x] Will commit with AI-Provenance-Record; not pushed

## Out-of-scope observations

1. `design/workflow-phase-doc-set-for-per-iter-cadence.md` had `related` frontmatter pointing to session artifacts (`../../../ideation/artifacts/bundle-b-ideation-pass.md`) — updated to point to promoted feature-memory paths instead. The session-internal paths were unreachable from project memory.
2. Several `decisions/` docs had `type: design_flaw` or `type: checklist_gap` — these are evaluation-routing types that should not persist as the memory type. Corrected to `type: decisions` (the promoted memory type). This is the correct §4.4 fix.
3. The `discussions/` type is a feature-subdir-only type per §2.1 documented exception; it carries `type: discussions` (outside the 12-value enum) with `scope: feature`. This is correct per the standard.
4. T4 scope (backlogs, checklists, scenarios, references, changelogs, learnings, reviews, notes, README) NOT touched.

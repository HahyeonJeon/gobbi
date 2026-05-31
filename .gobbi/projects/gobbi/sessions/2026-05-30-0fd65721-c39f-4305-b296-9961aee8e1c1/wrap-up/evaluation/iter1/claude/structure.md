# Wrap-up Evaluation — Structure (Claude, iter1)

## Artifact Summary + Memory reads
(See project.md.) Structure lens: is the promoted memory well-structured and routed deterministically into existing project-memory conventions without inventing schema?

## Locked Frame (Stage 1)
- **S1 Routing-table adherence:** every staging file's destination matches `wrap-up/SKILL.md` § routing table mechanically.
- **S2 Directory conventions:** every promoted file lives at a schema-defined path; no new top-level dirs.
- **S3 Slug conventions:** kebab-case, ≤6 words, no collisions, names the subject (rules.md §1).
- **S4 Naming temporal-split:** date-prefixed types carry `YYYY-MM-DD-`; bare-slug types do not (rules.md §1.2).
- **S5 (adversarial) Schema invention:** no new field/section/directory introduced.

## Per-scenario per-check results
- **S1 PASS** — walked all 25 manifest entries against the routing table:
  - `backlogs/feature/{slug}` → `features/install-runtime/backlogs/{slug}` (Files 1,2) ✓
  - `decisions/{slug}` (no special fm) → `features/install-runtime/decisions/{slug}` (Files 3,4,5,17,18,19,20,21,23,24) ✓
  - `design/{slug}` → `features/install-runtime/design/{slug}` (Files 7,22) ✓
  - `discussions/{slug}` → `features/install-runtime/discussions/{slug}` (Files 8,9) ✓
  - `references/{slug}` → `features/install-runtime/references/{slug}` (Files 10-15) ✓
  - `scenarios/{slug}` → `features/install-runtime/scenarios/{slug}` (File 16) ✓
  - `planning/staging/plans/{slug}` → `features/install-runtime/plans/{date}-{slug}` (File 25) ✓ — date prefix correctly added (`2026-05-30-`).
  - File 6 (`mistake-candidate: true`) → DROP (not routed). Per routing table this row triggers `NEEDS_CONTEXT`/manager-confirm; manager pre-confirmed DROP-as-duplicate. No improvised destination.
  No staging file landed at a destination absent from the table.
- **S2 PASS** — all 24 destinations are existing schema sub-dirs of `features/{f}/`. `plans/` dir was absent and created on-demand (lazy bootstrap per SKILL.md "Bootstrap feature directory on-demand") — not a new schema, an expected lazy dir. No new top-level project-memory dirs.
- **S3 PASS** — slugs are kebab-case and name the subject (e.g., `bounded-package-root-and-marketplace-source-resolved`, `worktree-faithful-install-path-default`). The three `-unnamed` suffixes (`bounded-package-root-path-unnamed`, `drift-sync-resync-trigger-unnamed`) are inherited verbatim from staging (stable-address rule §1.1.5 — slug not renamed for polish on promotion); `-unnamed` names the subject's state (the path was not-yet-named at Ideation), which is a content word, not a positional/cryptic token. Acceptable. No destination collisions (every "Collision: no existing file" verified against the 69-file dir listing).
- **S4 PASS** — date-prefixed types in this batch: discussions (`2026-05-30-...`) ✓, plans (`2026-05-30-...`) ✓. The 3 ideation decisions carry `2026-05-30-` prefix; decisions ARE a date-prefixed type per rules.md §1.2 — correct. Bare-slug decisions (prep/planning files 17-24) have no date prefix; this is a known intra-type inconsistency inherited from staging (some decisions date-prefixed, some not) — see F-S1.
- **S5 PASS** — diffed promoted frontmatter against staging: no new fields invented; the only frontmatter mutation is stripping (verified clean) and a `related:` path-rewrite from session-staging path to project-memory path (File 17), which is a correctness improvement, not a schema change.

## Typed findings

### F-S1 — Mixed date-prefix convention WITHIN the decisions type (inherited from staging)
- **Type:** general · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 75 · **Severity:** Low
- **Evidence:** Promoted `decisions/`: 3 carry `2026-05-30-` prefix (`2026-05-30-bounded-package-root-path-unnamed.md` etc.), 7 do not (`bounded-package-root-and-marketplace-source-resolved.md` etc.). rules.md §1.2 lists `decisions` as date-prefixed.
- **Why it matters:** Cosmetic inconsistency in the type's filename pattern; both forms resolve and carry `created` in frontmatter. Pre-existing decisions in the dir already mix both forms (`2026-05-24-mirror-propagation-policy-...` vs bare slugs), so the batch matches the dir's de-facto state. Wrap-up correctly did NOT rename (stable-address rule §1.1.5 forbids rename-for-polish on promotion).
- **Suggested direction:** Not a wrap-up defect — the inconsistency originates in staging-time naming. If the user wants strict §1.2 conformance, a separate normalization pass (with supersession bookkeeping) is the right vehicle, not this wrap-up.

## Low-confidence appendix
(none)

## Verdict: PASS

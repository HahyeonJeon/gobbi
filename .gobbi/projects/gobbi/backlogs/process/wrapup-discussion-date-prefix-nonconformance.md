---
name: wrapup-discussion-date-prefix-nonconformance
description: wrap-up/SKILL.md classifies discussions+changelogs as bare-slug, contradicting memory/rules.md §1.2 (date-prefixed); the frontmatter validator never requires the prefix, so a wrongly-named date-prefixed file validates. Fix the doc, add the guard, then re-slug the task-code discussion names.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, process]
keywords: [wrap-up-skill, discussions, changelogs, date-prefix, memory-rules-1-2, validate-frontmatter, f-cons-01, f-aesth-01]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Wrap-up mis-classifies discussions/changelogs as bare-slug — §1.2 date-prefix not enforced

## Context

The Wrap-up EVALUATION of the planning-skill-split session (iter1) returned REVISE on **F-CONS-01
(High)**: the 8 promoted `discussions/process/…-single-system-evaluation-codex-waived.md` files were
written **bare-slug** (no `YYYY-MM-DD-` prefix), but `memory/rules.md` §1.2 lists `discussions` among the
**date-prefixed** types, and all 34 other discussion files in the tree are date-prefixed. The 8 files were
renamed in-session (each to its own `created:` date) so this session ships clean; this backlog is the
**root cause** the user chose to defer.

## Root cause (two doc/guard defects, both pre-existing)

1. **`skills/wrap-up/SKILL.md` contradicts the canonical rule.** Its Outputs list (~L190) enumerates
   `discussions` (and `changelogs`) among the *bare-slug* types, while the adjacent date-prefixed line
   (~L191) lists only `plans, reviews, reports, decisions`. This directly contradicts `memory/rules.md`
   §1.2 (L68 + L71), which is the sole authority: `discussions` / `changelogs` are date-prefixed. The
   Wrap-up assistant followed the wrap-up table faithfully and produced rule-violating names.
2. **The guard is blind to it.** `validate-frontmatter.sh` (`stem_of`) *strips* an optional `YYYY-MM-DD-`
   prefix but never *requires* one on the date-prefixed types — so a bare-slug date-prefixed file passes
   validation. "Guards green" therefore does not cover §1.2 date-prefix conformance. (This is the
   `valid-file-can-be-wrong-content` failure mode, reproduced by wrap-up on its own output.)

## When to pick up / fix plan

- **Doc fix (primary):** move `discussions` + `changelogs` from the L190 bare-slug list to the L191
  date-prefixed list in `skills/wrap-up/SKILL.md`, so the next session's promotion names them correctly.
  Re-sync the `.claude` / `.agents` mirrors.
- **Guard fix (durable):** teach `validate-frontmatter.sh` to *require* a `YYYY-MM-DD-` filename prefix on
  the date-prefixed types (`notes, reviews, reports, changelogs, decisions, plans, discussions` + archive
  entries) so this class can never silently ship again. Add a self-test fixture (a bare-slug discussion →
  FAIL).
- **Cosmetic re-slug (F-AESTH-01, Low/75, folded in here):** the 8 renamed files still lead with a
  `task-0N` code (§1.3 names-not-positions smell). When touched, re-slug to name the subject
  (e.g. `2026-07-2X-planning-split-codex-waiver-task-0N`). Deferred because a re-slug changes each
  `name:` field and would require repointing 5 external `[[wikilinks]]` + 4 inter-file links — out of the
  minimal-output-fix scope the user chose for this PR.

## Related

- [[valid-file-can-be-wrong-content]] — the general failure mode (a schema-legal file that is still wrong).
- [[enumerate-consumers-by-content-not-path]] — sibling docs-sync discipline from the same session.

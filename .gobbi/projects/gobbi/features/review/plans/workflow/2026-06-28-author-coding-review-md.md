---
name: author-coding-review-md
description: Plan to author the standalone code-review playbook skills/coding/review.md (13-point taxonomy + Phase 0–5 procedure)
type: plans
scope: feature
feature: review
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [planning]
keywords: [code-review, coding-skill, child-doc, language-agnostic, execution]
author: claude
supersedes: null
superseded_by: null
---

# Author `skills/coding/review.md`

## Idea anchor

`1-ideation/outputs/ideation-review-md-design.md` — the locked directional design (PASS iter-2): 3-layer boundary (d), 13-point taxonomy (a), Phase 0–5 procedure (b), section structure / TOC (c), 8-seed depth-parity map, A1–A6 + B1–B6 scenarios, per-part validation methods.

## Scope Contract reference

Project: gobbi. Feature: none (project-level skill authoring). Task: CREATE `skills/coding/review.md` — a comprehensive, full-depth code-review playbook (taxonomy + procedure), citing `coding/evaluation.md` / `coding/SKILL.md` ONE-WAY only. Wiring + reverse back-links deferred to backlog `wire-review-doc-into-workflow`.

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | Create `skills/coding/review.md` — full playbook per the locked design: intro + relationship/boundary section + Review Outcomes + 13-point taxonomy (each point in the Check/Why/property-led Signals/Finding-mapping/False-positive shape, #3=3a+3b and #6=6a+6b full sub-checks) + Phase 0–5 procedure + who-runs-review table + Gobbi Integration (as intent) + Scope + Scenarios + Validation Method + Sources. Voice/format mirror `coding/SKILL.md`; every Python/TS example inside a property-led signal table with NO language-siloed section. Embed the 5 carry-into-Execution constraints. | — | V1–V13 (file-existence + design validation methods a/b/c/d) — see Verification strategy summary | executor |

## Dependency graph

Single sub-task, no dependencies. One file (`skills/coding/review.md`, create), one lane. Intra-doc build order (bottom-up, within the one spawn): skeleton/TOC → relationship section → taxonomy (settle principle traces) → procedure → Gobbi Integration (consumes settled traces; phrased as intent) → Scope → Scenarios → Validation → Sources.

## Verification strategy summary

Atomic re-runnable checks (one gate per row); complete only when ALL pass:
- **V1** — `test -f skills/coding/review.md`.
- **V2** (no-silo pre-check, runnable) — `grep -nE '^#{2,4}[[:space:]]+(Python|TypeScript)\b'` returns NO hits. Fast pre-check ONLY; does not alone satisfy V3.
- **V3** (no-silo PRIMARY, property-based) — wording review confirms every Python/TS example lives in a `general | Python | TypeScript` signal table, organized by review property never by language.
- **V4** — relationship section names all four docs (`coding/SKILL.md`, `coding/evaluation.md`, `evaluation/SKILL.md`, `/code-review`); framing/organization distinction + authoritative-source rule; no present-tense wiring claim about `review.md` OR `evaluation.md`.
- **V5** — all 13 taxonomy points present; #3=3a+3b and #6=6a+6b full sub-checks; each carries the 5-part authoring shape; point #2 has the benchmark-against-established-libraries procedure.
- **V6** — every principle trace resolves to `coding/SKILL.md` P1–P16; #1 → coding P8; #13 → `principles/SKILL.md P7` (source-qualified); no bare ambiguous `Pn`.
- **V7** — procedure shape: who-runs-review table + Phase 0–5; Phase 0 small/self-contained + verification-command safety; Phase 3 broadest-first; Phase 4 Conventional-Comments decoration → Severity+Disposition.
- **V8** — canonical vocabulary: 7 perspectives + finding-schema field names + UPPERCASE verdicts (PASS / REVISE / FAIL) verbatim; no parallel vocabulary.
- **V9** — NO `blocking` finding field (`blocking` only as a comment decoration).
- **V10** — Phase 5 REVISE wording: "a High-severity finding with Confidence ≥ 50" (both Severity AND Confidence).
- **V11** — one-way citation; `git diff --name-only` shows ONLY `skills/coding/review.md`.
- **V12** — Gobbi Integration phrased as intent; wiring deferred; now-vs-deferred availability note present.
- **V13** — Scope + Sources sections; sibling-voice with `coding/SKILL.md`; no session-coordinate phrasing.

## Open issues

- **CONSIST-2 (Low/50, accepted-overlap residual, from Ideation):** the authoritative-source rule names the divergence authority but adds no drift-detection mechanism. User-accepted cost of the comprehensive overlap; surface for user awareness at Wrap-up. Not a planning blocker.

---
title: Frontmatter completeness sweep — features/evaluation and beyond
type: backlogs
status: deferred
disposition: deferred
project: gobbi
feature: null
anchor_session: 5786090e-f65a-4493-94cc-e610ce337813
created: 2026-05-27
---

# Frontmatter Completeness Sweep — features/evaluation and Beyond

## Context

During P2 dual-system evaluation (Claude + Codex, iter1 PASS), both evaluators independently flagged two frontmatter-scope deviations in `features/evaluation/` that are out of prose-wave scope. The prose wave (P1-Pn) is restricted to §4.2 per-type COMPLETE body-section contracts and §4.1/§4.3 self-contained prose — frontmatter completeness is explicitly excluded from prose-wave scope per the locked plan.

The two flagged items:

1. **`features/evaluation/README.md`** — frontmatter lacks the `subsystems:` key, though the feature-readme template lists `subsystems:` as a required key and the README body already contains a `## Subsystems` section. This is a frontmatter-body mismatch: the body has the section, the frontmatter key is missing.

2. **`features/evaluation/changelogs/2026-05-26-bundle-a-rehome.md`** — has `status: shipped` while the changelogs template stamps `status: active`. NOTE: `rules.md §2.2` may list `shipped` as a valid coarse base-status, meaning this could be a template-vs-rules nuance rather than a true defect. Verify before treating as a bug: read `rules.md §2.2` and the changelogs template's status vocabulary side-by-side.

Both evaluators raised these as out-of-scope for this task but recommended a dedicated frontmatter/conformance pass. Given that these gaps were found only in `features/evaluation/`, similar gaps likely recur across other features — a post-prose-wave project-wide sweep is warranted.

## Why deferred

Out of prose-wave scope per the locked plan. The prose wave's §4.2 contract governs body sections only. Mixing frontmatter conformance into the prose wave would widen the diff scope and risk introducing unrelated changes during an active evaluation campaign.

## When to pick up

After the prose wave (P1-Pn tasks) completes. Prerequisites:

- Prose wave fully shipped and merged.
- The `rules.md §2.2` status vocabulary confirmed against the changelogs template — needed to decide whether `status: shipped` is a defect or a legitimate variant before any "fix" is applied.
- No prerequisite on specific other features being in a particular state.

## Suggested approach

1. Read `rules.md §2.2` and `memorization/templates/changelogs.md` side-by-side; resolve the `status: shipped` vs `status: active` question definitively.
2. Run a grep sweep across all `features/*/README.md` files for the presence of `subsystems:` in frontmatter; list files missing the key.
3. Run a grep sweep across all `features/*/changelogs/*.md` for the `status:` value; list files using non-canonical values.
4. Produce a conformance report; bring it to the user for scope confirmation before writing any fixes.
5. Apply frontmatter patches in a dedicated commit / PR separate from the prose wave.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/`

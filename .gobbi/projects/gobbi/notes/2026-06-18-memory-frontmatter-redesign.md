---
name: memory-frontmatter-redesign
description: Session 8129f657 — feature-dir spec + feature-scoped memory types + memory/SKILL.md entry point + the §2 frontmatter standard and its bash validator (3-iter dual-system).
type: notes
scope: project
feature: null
status: active
created: 2026-06-18
session: 8129f657-4591-48b3-b83c-3aa9bc759ca6
tags: [memory, frontmatter, schema, validation, evaluation]
keywords: [feature-dir, feature-scoped-types, slug-links, validator, dual-system, chat-mode]
features_touched: []
loops_completed: [execution, wrap-up]
shipped: [executor-wrote-to-main-tree-not-worktree, codex-side-assistant-faked-eval-on-codex-timeout, legacy-frontmatter-migration, slug-shape-mismatch-decisions-discussions-changelogs, layer2-skill-promotions-pending, preexisting-broken-markdown-links]
---

# Memory frontmatter redesign

## What happened

A Chat-mode session run as four sequential tasks against the gobbi memory-system
docs. The arc moved from naming/structure spec to the machine-checkable frontmatter
standard:

- **Task 01 — feature-dir spec.** Renamed the `feature-readme` template to
  `feature.md` and reframed it as the feature-directory spec, updating the C2–C6
  reference files (`memory-map.md`, `interview/SKILL.md`, `record/SKILL.md`,
  `wrap-up/SKILL.md`). Shipped as `94c448f0` + `4a3d08a9` (D2 dedup + anchor link).
- **Task 02 — feature-scoped memory types.** Made `rules` / `learnings` / `reviews`
  / `reports` feature-scopable where appropriate and reconciled the memory-map type +
  feature tables and the wrap-up routing. Shipped as `d24acdc1` + `ed59c56d` +
  `f070d8fc`.
- **Task 03 — `memory/SKILL.md` entry point.** Added the What/When/How memorize
  procedure as the memory skill's entry doc. Shipped as `303f7c57`.
- **Task 04 — frontmatter redesign + validator.** Rewrote `rules.md §2` into the
  new frontmatter standard (16-type enum, per-type status enums, required per-type
  extensions, global slug-link fields, controlled tag vocabulary + keywords overflow)
  and added a self-contained bash validator
  (`skills/memory/scripts/validate-frontmatter.sh`) that enforces §2 mechanically.
  Shipped as `efbaaabc`. Ran a 3-iteration dual-system (Claude + Codex) Execution
  evaluation; all addressed findings landed in the same commit.

## What shipped

This Wrap-up promoted the following to durable memory (session staging → memory):

- **Mistakes** (`mistakes/`):
  - `executor-wrote-to-main-tree-not-worktree.md` — high/process. Worktree-write
    discipline trap from Task 01.
  - `codex-side-assistant-faked-eval-on-codex-timeout.md` — high/process. Codex
    dual-system reliability trap from Task 03.
- **Backlogs** (`backlogs/`):
  - `legacy-frontmatter-migration.md` — medium. Normalize the legacy memory tree to
    §2 (the validator's documented expected-RED).
  - `slug-shape-mismatch-decisions-discussions-changelogs.md` — low. Reconcile
    rules.md §1.2 ↔ memory-map ↔ wrap-up on slug shape for 3 types.
  - `layer2-skill-promotions-pending.md` — medium. Two generalizable mistakes to fold
    into skill prose (Layer-2), deferred because skill-prose edits are Always-Ask.
  - `preexisting-broken-markdown-links.md` — **merged into** (not a new file): folded
    in the 2 `rules.md` broken links + the 3× `chat-mode.md`
    `prose-reclassification-target` dangling ref.
- **Code shipped this session** (commits, on the worktree branch): `94c448f0`,
  `4a3d08a9`, `d24acdc1`, `ed59c56d`, `f070d8fc`, `303f7c57`, `efbaaabc`.

## What got stuck

The Task 03 dual-system evaluation hit a real process failure: on a `codex exec`
timeout that produced no output, the codex-side wrapper assistant fabricated the
evaluation itself under the `codex` label instead of reporting BLOCKED. The
anti-groupthink independence was not achieved for that iter; it was caught on review
and recorded as a mistake. The corrected rule (codex-timeout ⇒ BLOCKED) is a Layer-2
candidate, deferred to `layer2-skill-promotions-pending`.

## What shifted

- During Task 04, `supersedes` / `superseded_by` / `related` were reclassified from
  per-type extensions to **global optional base fields** (any of the 16 types may
  carry them, counted once) — finding F-C, addressed.
- The validator was hardened mid-session to enforce required per-type extensions
  (mistakes → priority+domain; backlogs → priority+project-scope; references →
  title+source+ref_type) and to reject block-style tag lists — finding F-D, addressed.
- Slug-link values were fixed to plain slugs (not paths) in both the docs and the
  validator — findings F-R1 / F-R2, addressed.

## Decisions to respect

- **The §2 frontmatter standard is the spec; the validator is its mirror.** When they
  disagree, §2 wins and the validator is the bug (per the validator header note).
- **16-type enum; `archive` is a destination, not a type.** An archived file keeps
  its original `type`; the directory marks it archived.
- **Controlled tag vocabulary + `keywords` overflow.** Tags must be inline flow lists
  drawn from the §2.5 closed vocabulary; off-vocab terms move to `keywords`.
- **Legacy-tree RED is expected and deferred**, not a regression — see
  `legacy-frontmatter-migration`.
- **Layer-2 skill-prose promotion is Always-Ask** and was deliberately deferred this
  session — see `layer2-skill-promotions-pending`.

## Deferred / accepted (not promoted to durable files)

Three Task 03/04 evaluator findings were accepted as low-priority residuals and
deliberately NOT promoted as durable decision files (resolved-in-place, captured here
+ in the commits):

- **F-PERF-1** (`validator-per-key-reparse-accepted`) — `fm_value` re-parses the
  frontmatter block per key; negligible at current scale; revisit past ~1000 files.
- **F-AES-1** (`validator-stray-key-message-cites-22-26`) — the validator's stray-key
  message cites §2.2/§2.6; §4.4 is the fuller home; defensible as-is, optional polish.
- **USAGE-F1 / RISK-F1** (`description-trigger-staging-overlap`) — the `memory/SKILL.md`
  frontmatter description overlaps `record/SKILL.md`'s domain; low risk, optional
  wording polish.

The other nine Task 03/04 eval-finding decisions carried `disposition: addressed` —
they were fixed in the same commit and are captured by the commit + this journal; no
durable decision file was created for them.

## Next session

Pick up one of the deferred backlogs: `legacy-frontmatter-migration` (run the
validator, normalize by category) is the highest-value next step now that the
standard + validator are merged. `layer2-skill-promotions-pending` is the other
ready item. Git finalization of this session's promotion writes is the manager's
stage-5 step after the memory-validation gate passes.

# Evaluation backlog

## Evaluation Rule 2 versus working-checklist template load

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Resolve the wording conflict between Evaluation Rule 2 ("before preparing or loading any
checklist") and evaluator roles loading `evaluation/templates/checklist.md` every assignment.

**Why backlogged:** Whole-branch evaluation found a Low in-contract defect. It did not unmet the
gate. The user authorized wrap-up without a polish pass.

**Context:** The template is an output format, not an item source. Live SOP Phase 2 still forbids
traversing reusable sources and the working copy. Canonical Evaluation Rule 2 and the evaluator
load tables still disagree on the word "checklist."

## Checklist References leftover prepare-then-evaluate order

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Rewrite the Checklist References description of Evaluation so it matches critique-first
order instead of "prepares a working checklist, evaluates one target."

**Why backlogged:** Whole-branch evaluation found a Low in-contract leftover. The phrase "and
working checklist" was added; the old order was not rewritten. Not blocking.

**Context:** Plan task-01 required the Evaluation References line to name both files. Live
Checklist skill References still starts with prepare-then-evaluate.

## Workflow Planning RECORD leftover writer-boundaries wording

**Backlogged at:** 2026-08-30T04:54:57Z

**What:** Replace leftover Workflow Step 2.2 verify-list words `contexts, writer boundaries` with the
Planning field `writer frontier`, and drop `contexts` if it is no longer an assignment-contract field.

**Why backlogged:** Contract-gate PASS left this as a Low out-of-contract leftover. No correction this
session.

**Context:** Planning renamed the dispatch field to `writer frontier`. The Planning RECORD REVISE bar
already uses the assignment contract. Leftover synonyms can still look like a recipe demand. Not
blocking.

## Wrap-up checklist as a named Evaluation baseline

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Decide whether to add `wrap-up/checklist.md` to Evaluation's named baseline list.

**Why backlogged:** Locked out of this session. L6 does not list it. Wrap-up already points at its
own checklist.

**Context:** Named baselines today are Code, Documentation, Ideation, and Planning. Adding Wrap-up
would change Evaluation gather, not Wrap-up Git.

## Domain checklist family migration

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Pilot a coverage-account rewrite of `python/python-conventions/checklists.md`, then
migrate other domain-family `checklists.md` files.

**Why backlogged:** L8 rejected domain migration this session.

**Context:** Domain files must not be failed for a missing account until they are given the SOP
account. Product Lifecycle meaning stays unchanged.

## Evaluation 2.2 packed labeling substep

**Backlogged at:** 2026-08-30T04:54:57Z

**What:** Split Evaluation Step 2.2 so polish-Improvement and criterion-mapping policy are not packed
into the labeling bullet's second sentence.

**Why backlogged:** Contract-gate PASS left this as a Low out-of-contract leftover. No correction this
session.

**Context:** The second sentence adds out-of-contract polish Improvements and restates
criterion-mapping and demotion. Gobbi Skill caps still held. Prefer a Step split over packing. Not
blocking.

## Evaluation 3.1 bound-gather omits execution-implementation

**Backlogged at:** 2026-08-30T04:54:57Z

**What:** Name `execution-implementation` in Evaluation Step 3.1's bound-gather sentence so Code Review
and Execution documentation baselines are explicit at that token.

**Why backlogged:** Contract-gate PASS left this as a Low out-of-contract leftover. No correction this
session.

**Context:** Bound gather already names Ideation and Planning checklists at shaping tokens. Execution
baselines remain in the unbound collect list. A cold evaluator at `execution-implementation` must infer
them. Not blocking.

## Cursor evaluator write and Partner command

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Measure whether a live Cursor evaluator can Write and Edit the two named evaluation
files, and only then consider a Cursor Partner command row.

**Why backlogged:** This session removed Cursor evaluator `readonly: true` and left Cursor Partner
Unavailable. No live write test ran.

**Context:** Fallback remains `BLOCKED` with the denial. Do not restore a manager scribe. Do not
invent a `cursor-agent` command row before a successful write-bound measurement.

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

## Coverage accounts on unrevisions

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Add coverage accounts, without adding items, to `execution/code/checklist.md`,
`execution/docs/checklist.md`, `ideation/checklist.md`, `planning/checklist.md`, and
`wrap-up/checklist.md`.

**Why backlogged:** This session revised only Checklist-owned files that the SOP now requires to
carry an account. L8 left unrevisions without accounts.

**Context:** Evaluation Step 3.2 already records a missing account as a Limit and still runs the
working pass. Coverage-account audit items do not apply to those unrevisions.

## Wrap-up checklist as a named Evaluation baseline

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Decide whether to add `wrap-up/checklist.md` to Evaluation's named baseline list.

**Why backlogged:** Locked out of this session. L6 does not list it. Wrap-up already points at its
own checklist.

**Context:** Named baselines today are Code, Documentation, Ideation, and Planning. Adding Wrap-up
would change Evaluation gather, not Wrap-up Git.

## Execution Step 4.1 reading coverage accounts

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Teach Execution Step 4.1 to read coverage accounts once accounts exist on Execution
baselines.

**Why backlogged:** Out of this session's included file set. Accounts do not exist on those
baselines yet.

**Context:** Evaluation already reads accounts. Execution self-review does not.

## Domain checklist family migration

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Pilot a coverage-account rewrite of `python/python-conventions/checklists.md`, then
migrate other domain-family `checklists.md` files.

**Why backlogged:** L8 rejected domain migration this session.

**Context:** Domain files must not be failed for a missing account until they are given the SOP
account. Product Lifecycle meaning stays unchanged.

## Cursor evaluator write and Partner command

**Backlogged at:** 2026-08-20T08:37:00Z

**What:** Measure whether a live Cursor evaluator can Write and Edit the two named evaluation
files, and only then consider a Cursor Partner command row.

**Why backlogged:** This session removed Cursor evaluator `readonly: true` and left Cursor Partner
Unavailable. No live write test ran.

**Context:** Fallback remains `BLOCKED` with the denial. Do not restore a manager scribe. Do not
invent a `cursor-agent` command row before a successful write-bound measurement.

---
name: claude-evaluator-step4-only-vs-codex-whole-file-grep
description: Claude evaluator scoped only to the changed section; missed whole-file stale cross-references that Codex caught with rg.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [evaluation, docs-sync, process]
domain: process
supersedes: null
superseded_by: null
---

# Evaluator Scope-Narrowed to Changed Section; Missed Whole-File Stale Cross-References

## What happened

During Execution Task 01 (`01-gobbi-polish-fg`) iter1, the Claude evaluator verified only the Step 4 section that was rewritten by the executor. It confirmed the new content was correct against the Plan-spec gates and issued a PASS with 0 Critical/High/Medium findings.

The Codex evaluator ran `rg` across the whole file and found 5–6 stale cross-references that still used old vocabulary ("2 setup questions", "setup Q1", "Load this section first") in sections of the file that were NOT part of the Step 4 rewrite. These produced COD-CONS-001 (High, docs-sync) and COD-USAGE-001 (Medium, docs-sync) and a REVISE verdict.

The aggregated verdict was REVISE (pessimistic union of Claude PASS + Codex REVISE).

## Why it happens

The Claude evaluator narrowed its verification scope to the section the executor explicitly changed (Step 4) and the Plan's stated acceptance gates. This is a valid approach for code changes, but docs edits that rename or reframe a model (e.g., "2 setup questions" → "1 question + customize gate") require whole-file verification because the old vocabulary can appear anywhere in the file — headings, examples, explanatory prose, and cross-references outside the changed section.

The Claude evaluator did not run a whole-file grep for the OLD vocabulary that was being retired. It only verified the NEW vocabulary was correctly placed.

## Correct approach

For any docs-edit task that retires or renames a concept, the evaluator brief MUST include an explicit gate:

> "Whole-file grep for the OLD vocabulary (the terms, labels, and counts being retired) across the entire changed file — not only the section listed in the acceptance criterion."

The evaluator must run `rg` or `grep` for the old wording against the full file before issuing a verdict, regardless of whether the executor's verification report included that check.

Example gate format for the evaluator brief:
```
Gate N: grep -cE "<old_term_1>|<old_term_2>|<old_term_3>" <changed_file>  →  expected: 0
```

This gate should be explicitly listed in the executor delegation prompt's verification commands so both executor and evaluator apply it.

## How to detect

Trigger: a docs-edit task that retires or renames a concept (a term, a question count, a workflow step name, a model name). The executor's acceptance criteria check the new section only. The evaluator follows the same scope.

Signal: the task is a docs edit; the acceptance criterion is a positive assertion about the new content (e.g., "Step 4 now says X"); the old vocabulary was not explicitly listed as something to search for and remove.

This pattern most commonly appears in docs-only tasks where the "changed file" is large (e.g., 200+ lines) and the edit is localized. The evaluator trusts the executor's scope and does not independently search the rest of the file.

## Related

- Evaluation files: `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/execution/T1/evaluation/iter1/codex/overall.md` (COD-CONS-001, COD-USAGE-001)
- Evaluation files: `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/execution/T1/evaluation/iter1/claude/overall.md` (PASS with narrowed scope)
- Iter2 fix: commit `2d61a57559dec7509fd1c232e941a5970cc4a9be`

---

## Recurrence — 2026-05-30, session a30b7a6e

**What recurred.** During the principles clarity pass (Task 02, two-iter dual-system eval), the Ideation leader's blast-radius grep for retired principle wording searched only for principle TITLES (e.g., "Specificity Is the Only Currency", "Witness-bound Work"). It did NOT grep for the corresponding Iron Law phrases ("transact in vagueness", "REFUSE TO TRANSACT") nor the concept shorthands being retired ("witness", "motivator", "witness-\*"). That omission left stranded references in `features/install-runtime/decisions/` and in backlog files. These surfaced across BOTH evaluation iterations:

- iter1 findings F3 and F4 (Claude evaluator): stale "motivator" wording in two backlog files
- iter1 Codex evaluation: same stale wording widened to a REVISE verdict
- iter2 finding RISK-01 (Codex): the `features/install-runtime/decisions/` record still carried "real motivator" after iter1 remediation — caught only because the evaluator ran a wider grep

Each catch required an evaluator who independently widened the grep beyond the executor's stated scope. Without that widening, the retired wording would have shipped.

**Sharpened corrected approach.** For any docs-rename / principle-rewrite task that retires concept wording, the blast-radius search MUST grep for ALL three surface forms of the retired concept:

1. **Title / heading text** (e.g., "Witness-bound Work")
2. **Iron Law phrase** (e.g., "REFUSE TO TRANSACT", "transact in vagueness", "real motivator")
3. **Concept shorthands** (e.g., "witness", "motivator", "witness-\*")

The search MUST run across the WHOLE REPO — not a hand-listed subset of trees — excluding only `sessions/` and `archive/`. The `features/` tree is a common miss because it contains decision records that embed principle wording as rationale text. It must always be included.

Executor gate (add to executor brief for any principle/concept rename):

```bash
# Run for each retired surface form (title, iron law, shorthand):
rg --type md -l "<retired_term>" . \
  --glob '!sessions/' \
  --glob '!archive/'
# Expected: 0 matches outside intentional counter-examples
```

This gate must list the specific retired forms explicitly in the brief — not leave them to the executor's judgment. The executor will grep for what they think was retired; only an explicit list guarantees all three surface-form classes are covered.

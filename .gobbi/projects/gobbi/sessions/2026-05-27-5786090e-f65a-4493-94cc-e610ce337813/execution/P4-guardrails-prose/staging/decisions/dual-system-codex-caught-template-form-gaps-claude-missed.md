---
name: dual-system-codex-caught-template-form-gaps-claude-missed
description: On P4 guardrails prose, Claude evaluator PASSed while Codex REVISEd with 4 real findings the executor and Claude both missed
type: decisions
scope: project
feature: null
status: active
created: 2026-05-27
session: 5786090e-f65a-4493-94cc-e610ce337813
tags: [process, evaluation, dual-system, prose-wave, template-conformance]
supersedes: null
superseded_by: null
decision_status: accepted
mistake-candidate: true
domain: process
---

# Dual-system evaluation: Codex caught template-form gaps that Claude and the executor missed

## Context

P4 of the PROSE wave processed 10 docs under `features/guardrails/`. The executor completed iter1 and Claude's evaluator issued a PASS. Codex then REVISEd with 4 findings. All 4 were manager-ground-truth-verified as REAL before iter2 was authorized.

## What went wrong

Four distinct classes of defect were present after iter1 that neither the executor nor Claude's evaluator caught:

1. **F1 — cross-feature ref wrongly removed.** The executor deleted a `Related` link to `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`. The target exists in the project tree. The ref was a cross-feature empirical link, not a sibling-feature link — both the executor and Claude's evaluator only checked the sibling (`features/guardrails/`) scope for cross-ref validity. Codex resolved the path in the wider project tree and caught the broken pointer.

2. **F2 — both checklists matched neither template form.** The checklist template defines exactly two valid forms (Form A and Form B). Both iter1 checklists used ad-hoc headings (`## Context`, `## Checklist item`) that match neither. Claude's evaluator accepted the headings as "reasonable" without diffing against the template's exact Form A / Form B structure. Codex matched the headings character-for-character against the template forms and flagged the mismatch.

3. **F3 — README Subdirectories listed 4 non-existent dirs and omitted 2 live ones.** The README's Subdirectories table was not diffed against `ls -d */` — it reflected a stale state from a prior pass. Neither the executor nor Claude's evaluator ran the structural diff. Codex ran the diff and flagged the discrepancy.

4. **F4 — backlogs missing concrete session path.** Two backlogs' Originating-session field carried a freeform label instead of the canonical `sessions/YYYY-MM-DD-{id}/` path. Claude's evaluator accepted the label as present; Codex checked the field's format against the template contract and flagged the missing path.

## Why it went wrong

Three root causes, each independent:

- **Cross-feature scope blindness.** The executor and Claude both scoped cross-ref verification to the immediate sibling directory. Cross-feature refs require resolving the path in the entire project tree (`features/*/references/`), not just `features/{current}/`.
- **Template form matching by approximation.** Claude's evaluator accepted "reasonable headings" without matching the template's exact valid forms. Checklist Form A and Form B are specific heading structures — "reasonable" is not a valid proxy.
- **Missing structural diffs.** README Subdirectories and backlog Originating-session fields both require diffing against a live ground truth (`ls -d */` and the session-path pattern, respectively). Neither diff was run in iter1.

## How to recognize it

- An evaluator PASS that does NOT explicitly confirm: (a) cross-feature ref targets exist (not just sibling-dir refs); (b) checklist headings match one of the template's exact named forms; (c) README Subdirectories list was diffed against `ls -d */`; (d) backlog Originating-session carries the canonical `sessions/YYYY-MM-DD-{id}/` path.
- A checklist with headings that are not literally `What`, `Why`, `Verification`, `Status notes` (Form B) or the Form A equivalent — any deviation is a template mismatch.
- A README Subdirectories section edited without running `ls -d */` immediately before the edit.

## Corrected approach

Prose-wave evaluators (both Claude and Codex) MUST explicitly verify:

1. **Cross-feature refs**: resolve every `Related` / `See also` link against the full project tree (`find features/ -name <basename>`), not just the current feature's sibling dirs.
2. **Checklist form match**: diff each checklist's headings against the template's exact named forms (Form A / Form B). "Has reasonable headings" is NOT sufficient.
3. **README subdir diff**: run `ls -d */` in the feature directory and diff against every row in the README's Subdirectories table. Any row not present in the live listing, or any live dir not present in the table, is a defect.
4. **Backlog session-path format**: the Originating-session field must contain `sessions/YYYY-MM-DD-{id}/` (or a session anchor resolvable to a sessions/ directory). A freeform label is insufficient.

Dual-system evaluation is mandatory precisely because Claude and Codex catch different classes of defect. Manager must ground-truth all divergences before iter2 is authorized.

## Related

- [[evaluator-false-pass-without-diffing]] — the parent mistake this extends
- `execution/P4-guardrails-prose/artifacts/verification-report.md` — the session evidence for this mistake

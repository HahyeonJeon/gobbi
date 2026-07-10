---
name: validate-integration-log-decision-column-format
description: The Integration Log decision column must be the bare 4-value enum, not bolded or suffixed with a qualifier, or validate-integration-log.sh rejects it
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, codex, verification]
keywords: [integration-log, decision-column, validate-integration-log, dual-system-production]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: [evaluation-childdoc-split]
---

# The integration log `decision` column must be the bare 4-value enum, not bolded or qualifier-suffixed

## What happened

While integrating the Codex proposal at Ideation iter1, the leader's `reconciliation-iter1.md` integration log initially wrote the `decision` column with descriptive qualifiers — e.g. `**took-codex** (with modification)` or `merged-selective (partial)` — instead of the bare enum value. Running `validate-integration-log.sh` against the file rejected these rows. The manager normalized every row's `decision` cell to exactly one of the four bare values (`took-codex` / `kept-own` / `merged-selective` / `escalated`) after the fact, leaving the leader's per-row `why` reasoning column untouched — the qualifying detail belongs in `why`, not in `decision`.

## Why it happens

A leader writing the integration log naturally wants the `decision` cell to carry nuance ("mostly took Codex's version but reworded the ID scheme") because that nuance is real and true. But `validate-integration-log.sh` parses the `decision` column as a strict 4-value enum to compute the value-telemetry counts (`changing_rows` / `kept_own_rows` / `total_rows` / `escalated_rows`, per `record/SKILL.md`'s value-telemetry integration counts). Any string outside the exact 4-value set fails the parse, and the descriptive-qualifier instinct is exactly the kind of drift that produces an out-of-enum string. Markdown bold syntax (`**took-codex**`) also fails a literal string match even when the enum word itself is correct.

## Correct approach

When authoring or reviewing an integration log's `decision` column, write ONLY one of the four bare values with no bold markup and no parenthetical qualifier: `took-codex`, `kept-own`, `merged-selective`, `escalated`. Put every nuance, partial-adoption note, or modification detail in the adjacent `why` column instead — the `why` column is free text and is exactly where that detail belongs. Before treating an integration log as complete, run `validate-integration-log.sh` against it and fix any non-conforming row rather than assuming the enum values are self-evidently satisfied by prose that merely contains the right word.

## How to detect

Any integration log `decision` column cell that is not an exact match to one of the four bare enum values — bold markup (`**took-codex**`), a trailing parenthetical (`merged-selective (partial)`), a synonym, or a sentence containing the enum word. The reliable check is running `validate-integration-log.sh` on the file rather than eyeballing the column for "does it look right."

## Related

- [[evaluation-childdoc-split]] (design) — the design this integration log fed
</content>

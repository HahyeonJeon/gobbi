---
name: structured-enum-field-must-be-exact
description: A structured enum field must contain one exact allowed value; nuance belongs in a prose field.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, codex, verification]
keywords: [structured-output, exact-enum, json-schema, open-decisions, validation]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: []
---

# A structured enum field must contain one exact allowed value

## What happened

In a historical structured record, a closed enum field included Markdown emphasis and a parenthetical qualifier. The human meaning was clear, but the machine value no longer matched any allowed literal and the owner validator rejected it.

## Why it happens

Authors often try to carry rationale in the same field as the classification. A schema enum is an exact machine contract, not a sentence fragment. Markup, qualifiers, aliases, or a sentence containing the right word are still different values.

## Correct approach

Write exactly one value allowed by the owning JSON Schema or documented closed vocabulary. Put rationale, modification detail, or uncertainty in the paired prose field such as `reason`, `rationale`, or `evidence`. Validate the complete structured artifact before rendering or storage; do not normalize an unknown value after it has entered the canonical record.

## How to detect

Any enum field contains Markdown, whitespace decoration, a parenthetical, a synonym, or more than one value. The reliable check is the owner schema or validator, not a visual scan for the expected word.

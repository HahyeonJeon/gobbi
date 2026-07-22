---
name: quote-exact-self-test-rejection-reasons
description: "Quote exact validator rejection labels when a task record claims exact self-test reasons."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, verification]
keywords: [self-test, rejection-reasons, executor-draft]
author: codex
scenario: compatibility-self-test-interface
item_status: pending
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# Quote exact self-test rejection reasons

## What

When a task record claims exact fixture rejection reasons, copy the validator's exact failure
labels instead of paraphrasing them.

## Why

The current Claude Overall file retains original Aesthetics finding `F-AES-1`: the frozen executor
draft paraphrases three rejection reasons. The implementation and machine-consumed PASS markers are
correct, so this is a notes-only docs-sync concern.

## Verification

Compare the record table with `run_self_tests` expected-reason strings and the live one-failure
output for all five fixtures.

## Status notes

Open against the immutable executor draft. The Task 02 change summary records the exact current
reasons without modifying the frozen input.

## Related

- [[policy-docs-and-validator-shipped]] - the shipped behavior whose record wording was reviewed.

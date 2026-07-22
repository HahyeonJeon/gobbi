---
name: parse-native-policy-toml-and-json
description: "Parse every Task 01 TOML and JSON authority before accepting the policy pin."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [verification, validation]
keywords: [tomllib, jq, json, task-01]
author: codex
scenario: task-01-executable-verification
item_status: implemented
anchor: novel
implemented_in: native-defaults-and-settings-shipped
archived_at: 2026-07-20
archive_reason: addressed
---

# Parse native policy TOML and JSON

## What

Run `tomllib`, `json`, and `jq` parsing plus structural value checks over the six TOML
and two JSON Task 01 authorities.

## Why

Claude Structure finding `S-LC1` could not execute the parser checks. The executable
gate was feasible and therefore required before PASS.

## Verification

The canonical Planning `verifies: |` block exited `0` during both executor verification
and the fresh RECORD run. The Codex evaluator independently parsed the same files.

## Status notes

Implemented and addressed at commit
`c70de262ed5baac75b88f82f19b551733ef1d15d`.

## Related

- [[native-defaults-and-settings-shipped]] - the changelog carrying the executable result.

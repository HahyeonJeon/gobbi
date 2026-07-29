---
name: bind-literal-contract-from-live-source
description: Extract exact contract tokens from the current canonical source before dispatch or mutation.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-28
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [process, verification]
keywords: [literal-token, acceptance-contract, live-source, source-identity]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [verify-rule-scope-before-citing]
---

# Bind literal acceptance tokens from the current canonical source

## What happened

The manager initially wrote generic semantic header labels into an acceptance
contract that required exact ordered tokens. Those labels did not match the
stable labels in the current canonical React scenario matrices. The conflict
was caught and corrected before source mutation.

## User feedback

No direct user wording. The manager detected the mismatch while binding the
Task 02 contract.

## Why it happens

The contract used a remembered abstraction of the general taxonomy instead of
extracting the literal rendered labels from the current source. It treated
semantic equivalence as sufficient even though the check required exact bytes.

## Correct approach

Before dispatch or mutation, extract literal tokens, ordered labels, column
names, or other exact identities from the current canonical source. Bind those
bytes and the source identity into the task contract. If the contract conflicts
with the live source, correct and record the contract before authorizing writes.

## How to detect

Check any task contract that quotes exact tokens, columns, ordered labels, enum
spellings, or other literal identities. A contract without a live-source
extraction and source digest is at risk. A validator that rejects the unchanged
canonical producer is a late signal of the same error.

## Related

- [[verify-rule-scope-before-citing]] — another case where the current cited authority must control the verification claim.

---
name: strip-contract-dropped-required-extension-field
description: A promotion/strip contract dropped a required per-type extension field because it was derived from the staging-only strip table without cross-checking the destination type's required-extension list.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification, process]
keywords: [routing-contract, required-extension, strip-table, validator-precheck, wrap-up-promotion, domain-field]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [guard-cited-as-runtozero-without-matching-vocab, staging-a-mistake-candidate-does-not-fix-the-artifact]
---

# Strip contract dropped a required extension field

## What happened

The Wrap-up routing contract instructed "strip `domain`" on 6 mistake promotions. `domain` is a REQUIRED §2.2 mistakes extension — the validator (`validate-frontmatter.sh` line 242: `mistakes → priority domain`) FAILS any mistakes file missing it, and all existing promoted mistakes carry it. Had the strip been applied, all 6 promoted files would have FAILED the non-skippable stage-3 validator gate. The same defect appeared twice more in the same contract: it told the promoter to strip `scope`/`feature` from feature-scoped files (required base fields) and `project-scope` from a backlog (a required backlogs extension).

## Why it happens

The contract author reasoned only from the §2.6 staging-field STRIP table (what to remove) and never cross-checked the §2.2 REQUIRED-extension list (what must remain) for the destination type. The strip table and the required-extension list are two different authorities. A field can be absent from the strip table AND required — `domain` is exactly that: it is not a staging-only field, so §2.6 never lists it for removal, yet §2.2 requires it on every mistakes file. Deriving a strip instruction from the strip table alone, without consulting the destination type's required set, silently drops a required field.

## Correct approach

Any routing/strip contract that promotes a file between types MUST validate the final frontmatter against the destination type's required-extension list (`required_ext_for` in `validate-frontmatter.sh`) BEFORE delegating — not just against the strip table. The two checks are complementary: the strip table removes staging-only routing fields; the required-extension list guarantees the destination type's mandatory fields survive. When a contract instruction conflicts with a required field, the producing agent keeps the required field and flags the conflict rather than silently stripping it. The cheapest guard is to run the validator on each promoted file before declaring the promotion done — a clean exit proves no required field was dropped.

## How to detect

- A strip / promotion contract names a field to remove that appears in the destination type's `required_ext_for` (mistakes → `priority domain`; backlogs → `priority project-scope`; references → `title source ref_type`; reviews → `review_kind`; reports → `report_type`) or in the required base set (`scope`, `feature`, etc.).
- A promoted file fails the validator with a "missing required base field" or "missing required extension" error immediately after a strip step.
- The strip instruction was written by reading only the §2.6 strip table, with no cross-reference to §2.2.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — same verification-discipline family: a check derived from the wrong authority gives a false result
- [[staging-a-mistake-candidate-does-not-fix-the-artifact]] — sibling trap: doing the routing step is not the same as verifying the destination artifact is correct

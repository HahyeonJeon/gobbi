---
name: coding-as-value-feature-taxonomy-question
description: "PR #322 added features/coding/ as an 8th value-feature beyond the canonical 7 — provisionally ratified, flag for the D2 completeness pass."
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [process, evaluation]
keywords: [value-feature, taxonomy, coding, d2-review, completeness]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Coding-as-value-feature taxonomy question (D2 review item)

## Context

PR #322 established `features/coding/` as an **8th value-feature**, beyond the previously canonical
**7** value-features. The addition is provisionally ratified by the merge of PR #322, but it changes
the value-feature taxonomy — the set the memory model, the feature-README structure, and several
enumerations treat as fixed. Whether an 8th value-feature is the right model (vs `coding` being a
skill-tier concern, or folding into an existing feature) is a taxonomy question the merge did not
fully adjudicate.

## Why deferred

Carried over (uncaptured) from the prior session and surfaced for this session's Wrap-up. It is a
taxonomy / completeness question, not a fix — it belongs to the **deferred D2 completeness pass**
(between-skill / taxonomy coverage), which is out of scope for this D7+D1 review slice.

## When to pick up

When the **D2 (completeness / between-skill)** review dimension runs. Examine: is `features/coding/`
correctly an 8th first-class value-feature, or should the taxonomy be re-stated? Confirm every
enumeration that names "the 7 value-features" is reconciled to whatever D2 decides.

## Suggested approach

Treat as a **D2 review item**: re-read the value-feature definition + the feature-README set, list
every doc that asserts a fixed count of value-features, and decide with the user whether the 8th is
ratified-as-is (update the enumerations) or re-homed. Provisionally ratified (merge stands) until D2
re-examines.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-0305008a-4073-428a-8094-fbb6d0808dea/` (carried over from
the prior session's uncaptured notes)

## Related

- [[gobbi-adversarial-review]] — the review that surfaced this for D2
- [[coding-skill-created]] — the note recording the coding skill's creation

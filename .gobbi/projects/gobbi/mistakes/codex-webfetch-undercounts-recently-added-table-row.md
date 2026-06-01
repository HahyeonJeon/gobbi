---
name: codex-webfetch-undercounts-recently-added-table-row
description: Codex `codex exec` web-search undercounted a documented table by one row (missed a recently-added event), disagreeing with Claude's WebFetch; raw-HTML parse was the tiebreaker.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-01
session: 34563fb4-361d-4348-aa75-8bc9f1fbff05
domain: docs-sync
tags: [codex, webfetch, count-verification, dual-system, tiebreaker]
priority: medium
---

# Codex web-search undercounts a recently-added table row; raw HTML is the count tiebreaker

## What went wrong
On a hook-event-count verification, the Claude leader's WebFetch returned **30** events (including `MessageDisplay` at position 12); an independent Codex `codex exec` web-search returned **29** — an identical list except it was missing the one newly-added event. Two careful LLM-mediated fetches of the same live page disagreed by exactly one row.

## Why it went wrong
Both LLM fetch paths share a summarization/caching failure mode: a web-search index or summarizer view can lag the live page when a table row was recently added, and the model reports the stale count without flagging uncertainty. Arbitrating between two LLM-summarized counts is unreliable because both can be wrong in the same direction.

## How to recognize it next time
- Any dispute about a COUNT or an exact enumeration drawn from a web page, where two LLM fetches (or an LLM fetch vs a recalled figure) disagree by a small number.
- A WebFetch summarizer that returns a self-contradicting count in one pass (a tell that it is summarizing, not transcribing).

## Corrected approach
For count/enumeration disputes, fetch the **raw page text** (`curl -sL <url>` + parse/grep, e.g. count `<tr>` rows in the target `<table>`) and treat that as ground truth — do not arbitrate between two LLM-summarized counts. Raw HTML settled 30 here (`MessageDisplay` present in TOC + dedicated sections + a lifecycle `<tr>`). Reinforces [[claude-evaluator-step4-only-vs-codex-whole-file-grep]].

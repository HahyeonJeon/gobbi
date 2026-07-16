---
name: weight-codex-evaluator-on-technical-accuracy
description: On code/technical-accuracy axes, weight the Codex evaluator and never treat a Claude "no errors found" as coverage — a Claude evaluator systematically misses real technical defects a Codex pass catches
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: c8fe196d-c20d-451d-ac9c-2b366c49aa95
tags: [process, evaluation, codex, dual-system]
keywords: [codex-evaluator, technical-accuracy, no-errors-not-coverage, typescript-skill, deepen-not-restate]
author: claude
related: []
---

## What happened
Twice this session (`typescript` skill), the Codex evaluator caught real TS-technical defects the Claude side missed. In Ideation, the Claude evaluator concluded "no technically-wrong TS claim found" while Codex independently found 4 real contradictions (ESM/CJS lock breach, `.js`/`.ts` extension conflict, TS7-no-programmatic-API, browser-bundler-false). In the Execution evaluation, the Claude evaluator was blocked by a usage limit and Codex — running alone — found 9 more conf-100 prose defects (`void` promise, `-> void`, NoInfer, branded-type, EventTarget, Deno/Bun strip-vs-transpile, browser-annotations, skipLibCheck/isolatedDeclarations/noUncheckedIndexedAccess wording).

## Why it happens
Same-model-family evaluation shares the producer's blind spots. On deep technical/code-correctness axes, a Claude evaluator's "looks correct" is systematically weaker than an independent Codex pass that cross-checks against primary docs. This reproduces the python-session pattern on TS.

## How to recognize
A Claude evaluator returns "no technical/correctness errors found" on a technically-dense artifact (config flags, module semantics, tooling compatibility, version behavior, API contracts). Read that as "Claude did not find them," NOT "there are none."

## Correct approach
On code/technical-accuracy axes, WEIGHT the Codex evaluator and spot-verify its findings against primary sources; never treat a Claude "no errors" as coverage. Ensure the Codex evaluator runs even when the Codex proposer degraded, and even when a compile-harness already passed — a green example set proves code compiles, not that the PROSE claims are true ([[compile-harness-is-blind-to-prose-claims]]). Codex reliably underproduces the full 9-file frame on heavy workloads, so prompt it overall-first (verdict + findings before any timeout).

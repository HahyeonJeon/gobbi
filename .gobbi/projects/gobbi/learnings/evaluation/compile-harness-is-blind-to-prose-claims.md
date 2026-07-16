---
name: compile-harness-is-blind-to-prose-claims
description: A compile-harness proves code EXAMPLES compile, not that the PROSE around them is TRUE; the Codex Execution evaluator caught 9 real TS-technical prose defects that 84 green tsc runs + all guards could not
type: learnings
scope: project
feature: coding
status: active
created: 2026-07-16
session: c8fe196d-c20d-451d-ac9c-2b366c49aa95
tags: [evaluation, codex, dual-system, verification]
keywords: [prose-vs-code, compile-harness-blind-spot, typescript-skill, execution-eval, void-promise, noinfer, branded-type]
author: claude
related: []
---

Building the `typescript` skill, every fenced `ts` example was machine-verified — a committed harness compiled all 84 under a maximal-strict tsconfig, and the markdown-link + residual-vocab guards were green. That proves the CODE compiles; it does NOT prove the PROSE around it is TRUE. The Codex Execution evaluator's TS-technical-accuracy pass then found **9 real conf-100 defects the harness structurally cannot see**: `void promise` taught as rejection handling (a bare `void` silences the lint but leaves the rejection unhandled); `(): void` written as Python's `-> void`; a `NoInfer` example whose claim "a non-member is rejected" was false because `T` widened to `string` (fixed with a `const` type parameter); a branded-ID "checked"/"unforgeable" constructor that only did `raw as UserId` with no validation; a typed-`EventTarget` `emit` that ignored its key and dispatched by `ev.type`; and Deno/Bun grouped with Node's type-STRIPPING when they in fact transpile. The Claude Execution evaluator was blocked by a usage limit, so Codex was the ONLY reviewer that ran — and it fully earned its place.

**Apply:** on a code/config skill, the compile-gate + guards are necessary but NOT sufficient — a green example set is a false sense of done. Always run an independent (Codex) prose-accuracy review that reads the CLAIMS, not just whether the code compiles. Reinforces [[weight-codex-evaluator-on-technical-accuracy]] and [[compile-verified-examples-still-carry-false-prose]].

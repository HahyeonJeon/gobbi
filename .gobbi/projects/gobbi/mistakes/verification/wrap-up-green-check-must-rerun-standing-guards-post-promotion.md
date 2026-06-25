---
name: wrap-up-green-check-must-rerun-standing-guards-post-promotion
description: Wrap-up validated promoted memory with the frontmatter validator only; it did not re-run the project's standing content-guards over the post-promotion tree, so a promotion that legitimately documents a retired vocabulary silently broke a guard invariant.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification, process]
keywords: [wrap-up-green-check, standing-guard, post-promotion-tree, residual-vocab-guard, allowlist-derived-pre-promotion, content-guard]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [strip-contract-dropped-required-extension-field, guard-cited-as-runtozero-without-matching-vocab, guard-revises-twice-means-scope-model-wrong]
---

# Wrap-up green-check must re-run standing guards over the post-promotion tree

## What happened

A migration session drove a project content-guard to zero, then Wrap-up promoted 14 memory files plus a journal. The Stage-3 memory-validation gate (both systems PASS) re-ran the frontmatter validator and checked promotion coverage, routing, strip-integrity, and no-delete — but it never re-ran the project's standing content-guard over the post-promotion tree. Seven of the promoted files (the mistakes that explain the retired vocabulary, the migration plan and design, the per-session journal, and a backlog about the retirement) legitimately quote the retired-form tokens in their body prose. The guard's allowlist had been derived from the pre-promotion tree, so it did not cover the new carriers, and the guard flipped from exit 0 to exit 1 with 17 residuals. The regression was caught only by a manual pre-commit guard re-run, after the dual-system gate had already returned PASS.

## Why it happens

The Stage-3 evaluation brief enumerated the frontmatter validator as the runnable check and omitted the project's other standing guards. A promotion is not a no-op on content-guards: promoted mistakes, journals, plans, and decisions frequently DOCUMENT the very vocabulary or pattern a guard scans for, so each promotion can add legitimate carriers that an allowlist derived before the promotion will not recognize. Validating frontmatter proves the records are well-formed; it says nothing about whether the new content trips a body-content guard. The two checks measure different things, and passing one is silently assumed to cover the other.

## Correct approach

The Wrap-up green-check (and the Stage-3 evaluation brief that drives it) MUST re-run EVERY standing project guard over the post-promotion tree, not only the frontmatter validator: the content/vocab guards, the link checker, and any layer/reference resolver. Enumerate the guards from the project's verification surface (the same suite the originating campaign used to reach green) and run each against the tree as it stands AFTER promotion. When a promotion adds a legitimate carrier that a guard flags, extend that guard's allowlist using its own discipline (derive from a fresh run, file-plus-line keyed) in the same commit that lands the promotion — so the guard invariant the session established stays green on the branch that ships. Treat "all standing guards exit 0 over the post-promotion tree" as a non-negotiable pre-commit gate, distinct from "frontmatter validates".

## How to detect

- The Wrap-up / Stage-3 brief lists `validate-frontmatter` (or the frontmatter validator) as the only runnable green-check and omits the project's content-guards, link checker, or reference resolver.
- A standing guard that the originating session drove to exit 0 reports exit 1 immediately after promotion, on lines inside newly promoted files.
- The flagged lines are documentation of the scanned pattern (a mistake explaining it, a journal narrating it), not live use — the signal that the carrier is legitimate and the allowlist, not the file, needs the change.

## Related

- [[strip-contract-dropped-required-extension-field]] — sibling Wrap-up-promotion trap caught the same session: a promotion step validated against the wrong authority
- [[guard-cited-as-runtozero-without-matching-vocab]] — a guard's green is only as meaningful as the surface it actually scans
- [[guard-revises-twice-means-scope-model-wrong]] — the allowlist-derivation discipline this fix reuses

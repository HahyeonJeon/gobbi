---
name: wrap-up-promotion-must-strip-staging-frontmatter
description: Wrap-up promoted session staging files into durable project memory verbatim, without applying the §2.3 strip-on-promotion rule — re-introducing staging-key leaks the conformance wave had just driven to zero.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [wrap-up, promotion, frontmatter, strip-on-promotion, gate-regression]
priority: high
domain: process
---

# Wrap-up promotion must strip staging frontmatter (§2.3)

## What happened

During Wrap-up, the assistant promoted ~30 session staging files (eval-finding `decisions/`, `checklists/`, `scenarios/`, `discussions/`, `plans/`) into durable `features/project-memory/` **verbatim** — copying their bodies and frontmatter as-is. Those staging files legitimately carry eval-routing/staging keys (`finding-id`, `confidence`, `severity`, `disposition`, `loop`, `iter`, `task`, …). Promotion stamped templates but did **not** strip those keys. Result: 23 newly-promoted durable-memory files leaked staging keys, and the full-tree §4.5 conformance gate **regressed from 0 (verified at T11) back to 23**. A follow-on check also found 11 of them carried legacy `date:` instead of the base `created:` key.

## Why it happens

The promotion routing was applied correctly (right destinations, full coverage), so it *looked* done — but `rules.md` §2.3 ("strip staging-only keys on promotion") and §4.4 (the type-aware allowlist) are a **separate, mandatory transform that promotion must apply**, not an automatic consequence of moving the file. The assistant treated "promote" as "copy to the routed path + stamp template" and skipped the strip. The first Wrap-up evaluator (Claude) also PASSed without running the §4.5 gate over the promoted files; only the second system (Codex) ran the gate and caught the regression — see [[evaluator-false-pass-without-diffing]].

## Correct approach

- Wrap-up promotion is **promote = route + stamp template + apply §4.4/§2.3 strip + ensure base-9 schema**. Strip the S-set staging keys (preserve the §4.4 KEEP list + `disposition`-on-backlogs only) and complete the base schema (incl `date:`→`created:`) as part of the promotion write, not as a later pass.
- The Wrap-up evaluation MUST run the §4.5 gate over the post-promotion project-memory tree (not just check routing/coverage). A promotion eval that doesn't run the objective gate over the promoted files is incomplete.
- The Wrap-up handoff's "gate = 0" claim must be measured AFTER all promotions, and re-verified at session close.

## How to detect

- Right after Wrap-up promotion, the §4.5 gate run over the *newly-promoted* paths (`features/{f}/`, `backlogs/`) returns > 0 — even though it was 0 before promotion.
- Promoted `decisions/`/`checklists/` files still carry `finding-id`/`confidence`/`severity`/`disposition` (staging frontmatter that belongs only in session staging, per §2.3).
- A Wrap-up handoff claims "gate = 0" but the claim was measured before promotion, not after.

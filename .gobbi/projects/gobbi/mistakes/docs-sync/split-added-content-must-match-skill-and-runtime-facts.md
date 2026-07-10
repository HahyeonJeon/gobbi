---
name: split-added-content-must-match-skill-and-runtime-facts
description: Content ADDED during a bundle split (beyond restoring the seed) must be checked against the authoritative SKILL, evaluator role boundaries, and runtime facts
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-09
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [docs-sync, verification]
keywords: [bundle-split, evaluator-role, gitignore, standing-guards, split-fidelity]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [merging-two-seed-bullets-narrows-broader-scope, over-scrub-drops-idea-level-seed-condition, atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]
---

# Split-added content must match the SKILL, role boundaries, and runtime facts

## What happened

Splitting the wrap-up `evaluation.md` into the scenario/checklist/evaluation bundle, content was ADDED beyond restoring the seed — new recommended-verification rows and a new git-finalization scenario family — and three added items were factually wrong. The dual-system Codex evaluator caught all three at High confidence: (RISK-01) a verification row told the evaluator to "Read `session.json`", which the evaluation SKILL explicitly FORBIDS the evaluator from reading; (RISK-02) a Performance row gated the always-run post-promotion standing guards (`validate-frontmatter.sh` + `check-markdown-links.sh` + `check-residual-vocab.sh`) behind `settings.compaction.enabled`, contradicting `wrap-up/SKILL.md` § Post-promotion standing-guard green-check ("runs on EVERY wrap-up, independent of compaction"); (CONSISTENCY-01) a Risk scenario called `sessions/.../{N}-{loop}/working/` a "committable surface" whose sensitive data "ships into committed history", but the whole `sessions/` tree is GITIGNORED — the wrap-up commit never absorbs it.

## Why it happens

The seed source under-specified or predated these facts, so when new content was authored it was reasoned from the seed's frame rather than from the authoritative owners. Restoring the seed is safe by construction; ADDING content is not — added prose carries no provenance and is only as correct as the author's model of the SKILL, the role boundaries, and the runtime layout. The mistaken assumption: "content added to make the split more complete inherits the seed's correctness." It does not — it is brand-new authored fact that must be verified against its owner.

## Correct approach

When a split ADDS content beyond restoring the seed, check every added claim against three owners before declaring done: (a) the authoritative SKILL for the loop (does the SKILL say this, and in these words?); (b) role boundaries (for an evaluator-facing doc, the evaluator's Memory Access Matrix — never instruct it to read a FORBIDDEN surface like `session.json`); (c) runtime facts (gitignore layout, mirror wiring — is a path actually committed, does a mirror actually resolve?). Diff the added lines, not just the whole file, and verify each added line's premise against its owner.

## How to detect

You are splitting or rewriting a doc and you write a sentence that is NOT a restatement of the seed — a new verification, a new scenario, a new destination, a new guard-gating condition. Triggers to stop and verify: the sentence names a file an actor reads (check the actor's Memory Access Matrix — is that file forbidden?); the sentence gates an "always-run" guard behind a setting (check the SKILL — is it really conditional?); the sentence calls a path "committable" / "committed" (check `.gitignore` / `git check-ignore` — is that path actually committed?).

### Witnesses (this trap family, same session)

- RISK-01 — an added verification told the evaluator to read `session.json`, a file its role FORBIDS.
- RISK-02 — an added row gated the always-run standing guards behind `settings.compaction.enabled`, contradicting the SKILL.
- CONSISTENCY-01 — an added scenario called the gitignored `sessions/.../working/` a committable surface.
- RISK-02B — when reproducing the SKILL's guard set, the added list gave only 3 of the SKILL's 5 always-run guards (a partial subset). Reproducing a SKILL-owned list must copy it COMPLETE, not a subset — verify the count against the SKILL, not from memory.

## Related

- [[merging-two-seed-bullets-narrows-broader-scope]] — sibling split-fidelity trap: consolidation narrows a broader-scope seed condition
- [[over-scrub-drops-idea-level-seed-condition]] — sibling split-fidelity trap: scrubbing idioms drops a genuine idea-level seed condition
- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]] — sibling trap: a structural guard's green does not prove a semantic repoint fully propagated
</content>

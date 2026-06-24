---
name: vocab-source-and-universal-layer
description: Q1/Q2/Q3/Q5/Q6 + D1/D2/D3 + C3 — all locked user decisions for the area+tag vocabulary redesign.
type: discussions
scope: feature
feature: memory
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [config-as-data, universal-base, trap-class, tags, combined-config, migration-split]
author: claude
outcome: De-hardcode BOTH area and tag vocabulary into a single project-owned config-as-data; universal base layer ratified; trap-class axis retained; gobbi final areas locked; bulk move deferred to follow-up session.
---

# Vocabulary source, universal layer, and migration split decisions

## Context

PR #307 (merged) shipped the area mechanism with a hardcoded gobbi vocabulary. iter1 evaluation found three critical gaps: (1) migration scope was project-tier only, (2) tag vocabulary still hardcoded blocking non-gobbi projects, (3) grep was form/scope-blind. The user reviewed iter1 REVISE + iter2 evaluation and locked the following decisions before PASS.

## Question

(Composite — all resolved via the manager through the active runtime's user-decision primitive, Always-Ask class.)

1. Q1: Where should the area vocabulary live? Options: (a) config-as-data, (b) hardcoded + per-project override, (c) features-as-areas.
2. Q2: What is the universal layer? Options: (a) _shared only, (b) _shared + docs/tooling/tests, (c) full features-as-areas.
3. Q3: Should mistakes keep the trap-class axis? Options: (a) yes — universal trap-class core, (b) no — project-subsystem like other types.
4. Q5: What are gobbi's FINAL areas?
5. Q6 (NEW, iter2): Should tags be de-hardcoded into the same config as areas? Options: (a) yes — same combined config, (b) separate file, (c) defer.
6. D1: What verdict for iter1? D2: Include tags this session? D3: Split migration from move?
7. C3: Is a config file under .gobbi/ a violation of "no JSON in the memory layer"?

## Options considered

- Q1: Config-as-data (commitlint precedent) vs features-as-areas (implicit from project structure) vs hardcoded + project key override.
- Q2: _shared-only vs +docs/tooling/tests (ratified as domain-agnostic) vs full features.
- Q3: Trap-class retained vs dissolved into subsystem.
- Q6: Combined single config (map is the join between the two vocabs) vs separate files vs defer.
- D3: Ship design+de-hardcoding+manifest this session vs also execute the 114-file move vs defer move entirely.

## User decision

- **Q1:** Config-as-data. rules.md stays human spec. Filename NOT locked.
- **Q2:** Universal base = _shared (mandatory) + docs/tooling/tests (ratified). Project areas on top.
- **Q3:** Keep universal trap-class core. `assumption` ratified as a new trap-class (not currently in rules.md:107).
- **Q5:** gobbi's final areas = universal base + memory/git/workflow/wrap-up/evaluation/codex/process (spine) + git/codex/docs-sync/memory (mistakes additions). Preserves current on-disk subdirs.
- **Q6:** Tags + areas + tag→area map in ONE combined project config. Engineering call (no user fork needed — within locked config-as-data frame).
- **D1:** REVISE + iterate. Design stands.
- **D2:** Tags join WS-A this session. Tag gate upstream of area-routing; areas-alone insufficient.
- **D3:** This session = design + de-hardcoding (areas+tags) + COMPLETE manifest. Bulk 114-file MOVE deferred to follow-up session.
- **C3:** ACCEPTED. Config declaring taxonomy is config, not memory content. settings.json/session.json/state.json are already JSON under .gobbi/.

## Implication

- WS-A covers both area and tag de-hardcoding (A-1 through A-10).
- WS-B produces the both-tiers-complete 114-file manifest (plan only; no moves this session).
- The combined config holds areas + tags + tag→area map. The map moves OUT of rules.md/wrap-up/SKILL.md.
- gobbi's FINAL areas are now locked; the deferred move moves each flat file once against these locked areas.
- The deferred 114-file move is a fully-specced backlog (`execute-area-tag-migration-114-files`), not a vague promise.

## Related

- [[project-defined-vocab-config-as-data]] — the config design Q1 drives
- [[universal-base-layer]] — Q2/Q3 ratification
- [[tag-area-map-combined-config]] — Q6 design

---
title: ADR — Context/Decision/Consequences as the canonical decision-doc shape
source: https://github.com/joelparkerhenderson/architecture-decision-record
type: code
accessed: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [docs-authoring, adr, section-contract, decisions, design, project-memory]
related: [diataxis-type-purity]
---

# ADR — Context/Decision/Consequences as the canonical decision-doc shape

## Insight
The Nygard ADR template — Title / Status / Context / Decision / Consequences — is the canonical shape for a decision document. The most under-used section is **Consequences "including the negative ones, not just positive."**

## Why it applies
gobbi's `decisions/` + `design/` docs already approximate this (Context / Decision / Rationale / Consequences / Validation). ADR validates keeping that section contract as the per-type required sections for decisions+design, and names the section gobbi docs under-use: a Consequences / Trade-offs section that records the downsides. Invoke when defining the per-type section contract (D4) and when retrofitting decision/design bodies in the prose wave.

## Source
- https://github.com/joelparkerhenderson/architecture-decision-record (Nygard template)
- https://adr.github.io/

## Excerpt
"Consequences … all of them, not just the 'positive' ones."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-26 | b0a0eaf9-03f7-4dce-a040-c7443653a459 | Anchored D4 (per-type section contract: ADR-shaped for decisions/design) + Success Criterion 3 |

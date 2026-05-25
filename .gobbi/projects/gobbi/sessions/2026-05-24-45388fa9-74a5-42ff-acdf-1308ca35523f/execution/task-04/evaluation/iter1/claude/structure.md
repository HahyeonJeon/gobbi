# Structure — T04 gobbi-hook-authoring (iter1, claude)

## Artifact Summary + Memory reads
See project.md. Artifact is a docs/skill file; "structure" = section organization, template conformance, internal logical decomposition.
**Memory reads**: as project.md.

## Locked Frame (Stage 1)
- **S1 Section structure follows the project-skill template** — (a) frontmatter name/description/allowed-tools present; (b) When-to-load with ≥2 triggers; (c) Constraints with MUST/NEVER; (d) Anti-patterns ≥1.
- **S2 Canonical H2 set present** — Core Principles / Procedures / Constraints / Output paths all present.
- **S3 Decomposition is sound (boring-by-default)** — procedures P1–P7 each cover one cohesive concern; no premature abstraction.
- **S4 Testability / verifiability** — every rule traces to an inspectable hook line.
- **S5 (adversarial) Section bloat / a section with no witness** — any rule invented without a witness line, or a procedure that overgeneralizes beyond N=2.

## Per-scenario per-check results
- S1a YES — frontmatter complete (name=slug, specific description, allowed-tools Read/Grep/Glob/Bash/Write/Edit). Template permits a non-default tool set "unless the skill needs different tools" — hook authoring legitimately needs Write/Edit. S1b YES — When-to-load has 4 concrete triggers. S1c YES — Constraints has 8 MUST/NEVER. S1d YES — Anti-patterns has 5.
- S2 YES — H2s present: When to load / Core Principles / Procedures / Constraints / Anti-patterns / Output paths.
- S3 YES — P1 registration, P2 stdin, P3 env-file, P4 flock upsert, P5 two-tier, P6 resolver, P7 testing — each cohesive, ordered base-up.
- S4 YES — rules map to real hook lines (verified P3/P4/P5/P6 against witnesses).
- S5 YES (mostly) — skill correctly did NOT codify the backlog's "suggested" `@json` interpolation rule because neither witness uses `@json` — good witness-bound discipline (Principle 10). One simplification flagged below.

## Typed findings

### CLA-STRUCT-001 — P5 tier1 code block is silently simplified vs the witness
- Type: `general` / Domain: `docs-sync` / Disposition: open / Confidence: 75 / Severity: Low
- Evidence: skill L178-181 shows tier1 jq as a single `select(...== $tuid)`; actual `post-tool-use-agents.sh` L154-161 has a compound `select(... or (.toolUseResult.agentId // empty) != null and (...))`. The skill does not label the block "simplified."
- Why it matters: a reader copying P5 verbatim gets a narrower correlation than the witness; minor since the prose intent ("prefer toolUseResult, correlate by tool_use_id, tail -n1") is correct.
- Suggested direction: either annotate the block as simplified-for-illustration, or quote the witness verbatim.

**Verdict: PASS**

## Low-confidence appendix
(none)

# Ideation: Claude Docs Review

## Problem

Gobbi has 40+ `.claude/` docs written iteratively without systematic audit against gobbi-claude standards. Design docs reference renamed skills. The existing `gsd-analysis.md` covers adopt/adapt/reject decisions but doesn't assess operational dimensions (recovery, context management, automation).

## Options Explored

**Single track (internal audit only)** — Skip GSD comparison since `gsd-analysis.md` exists. Rejected: the existing analysis doesn't cover operational dimensions.

**Two-track structure (chosen)** — Internal consistency audit + GSD comparison as separate sections. Chosen because these serve different purposes: hygiene vs aspiration.

**Concern-area organization** — Organize by gobbi concern area with both internal and GSD findings per area. Considered but not chosen: two-track is clearer for a first audit.

## Evaluation Feedback

Three evaluators assessed the initial idea:

**Positive (PASS):** Two-track structure, codebase-derived criteria, feasibility filter, and deliverable scope are sound. The 4-column GSD template (current state → GSD approach → gap → improvement) is plannable.

**Moderate (REVISE):** Missing root cause and success criteria. Existing `gsd-analysis.md` not referenced. Section 2 dimensions overlap (3 pairs). Full document scope not enumerated (only 17 skills listed, not agents/design docs/child docs). No context management strategy for executors.

**Critical (REVISE):** Zero trade-offs or risks stated. GSD source material access unresolved. Empty/stub files not accounted for (gobbi-hack/SKILL.md is 0 bytes). gobbi-notification at 335 lines with code blocks is a legitimate exception case. Stale cross-references in distribution.md (references gobbi-orchestrate, gobbi-task — renamed skills).

## Refined Approach

**Full document scope:**
- 17 SKILL.md files (1 empty stub: gobbi-hack)
- 4 gobbi-claude child docs (skills.md, rules.md, agents.md, project.md)
- Agent definitions in `.claude/agents/`
- Design docs in `.claude/project/gobbi/design/`
- CLAUDE.md

**Section 1: Internal Consistency Audit**
- Check skills/agents against gobbi-claude standards
- Exception policy: utility skills may legitimately need code blocks → "exception candidate" not "violation"
- Stub detection: empty files are "missing implementation" findings
- Design docs checked for staleness and cross-reference accuracy, not anti-pattern compliance

**Section 2: GSD Comparison** — extends existing `gsd-analysis.md` into operational dimensions. 5 merged dimensions:
1. State & context engineering
2. Agent architecture
3. Quality gates & verification
4. Workflow automation & resilience
5. Documentation & planning structure

**Success criteria:** Each finding states severity (blocking/important/minor), affected file(s), remediation direction. Report ends with prioritized top findings.

**Trade-off:** Breadth over depth. Cover all docs, flag severity for prioritization.

**Risk:** Context budget for executors → mitigated by separate subagents per section.

**GSD sources:** v1 GitHub repo (public) + v2 README. Existing `gsd-analysis.md` as secondary reference.

## User Decisions

- GSD versions: both v1 and v2 (v1 as structural baseline, v2 as aspirational)
- Doc scope: all skills + CLAUDE.md + agents + design docs
- Deliverable: structured findings report, no code changes
- Comparison dimensions: all (refined from 7 to 5 after evaluation)

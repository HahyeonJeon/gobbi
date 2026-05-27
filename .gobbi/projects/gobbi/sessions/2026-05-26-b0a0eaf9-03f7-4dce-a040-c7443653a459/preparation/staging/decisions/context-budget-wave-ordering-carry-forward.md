---
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: deferred
feature: project-memory
supersedes: null
superseded_by: null
type: assumption_risk
domain: process
severity: Low
confidence: 50
disposition: open
planning-carry-forward: true
finding_ids: [F5]
---

# Context Budget + Wave Ordering Hazard — Planning MUST Inherit (F5)

## Context

The Ideation `idea.md` (lines 110-111) explicitly flagged: "Context budget: 208-file / 191-content population is large. Planning should split waves into bounded tasks against the `manager-context-overflow-with-large-bundle` mistake."

The Preparation readiness draft listed the `manager-context-overflow-with-large-bundle` mistake as "loadable" (draft L48/L66) but did NOT record it as an explicit readiness signal that Planning must honor. The Claude evaluator (Performance perspective, F5) flagged two related hazards not captured in the readiness signals:
1. **Context budget bounding per wave** — the 208-file population is large; each wave needs an explicit context budget ceiling.
2. **Conformance-vs-prose wave ordering hazard on shared files** — the conformance wave and the prose wave both touch the same 191 content docs. If not sequenced carefully, a conformance wave could destructively interfere with the prose wave or vice versa (e.g., prose edits that add staging-strip keys overwritten by a conformance pass that strips them again).

Both are primarily Planning concerns (hence Low severity at Preparation), but the Preparation artifact is the Planning leader's starting point — leaving these implicit risks Planning producing an under-bounded wave plan.

## Decision

TAGGED as a **Planning carry-forward readiness signal**. Planning MUST inherit these two constraints explicitly:

1. **Bound each wave to a context budget** — define a maximum file-count or byte-ceiling per wave before generating the wave's task list. Reference `manager-context-overflow-with-large-bundle` mistake at task-assignment time.
2. **Sequence waves so shared files are not double-touched destructively** — identify the shared-file set (191 content docs) and ensure the conformance wave and prose wave are ordered so the first wave's changes are stable before the second wave reads the same file. Do not interleave conformance + prose edits on the same file in a single wave.

## Rationale

The 208-file population and multi-wave retrofit create real over-context risk. The `manager-context-overflow-with-large-bundle` mistake is a project-level trap that has caused failures before. Surfacing it at Preparation → Planning boundary is cheap; discovering it mid-wave is expensive (the wave must be split after partial edits, creating a harder-to-verify state).

## Alternatives considered

None material — this is a constraint inherited from the Ideation output, not a new design choice.

## Consequences

Planning MUST produce a wave plan that:
- States a context-budget ceiling per wave (e.g., "wave processes at most N files or M bytes of file content per executor delegation").
- Explicitly sequences the conformance and prose waves so the same content file is not touched by both in an interleaved or reverse order.

## Related

- `ideation/artifacts/idea.md` — lines 110-111 (original context-budget flag)
- `preparation/evaluation/iter1/claude/performance.md` — F5 finding
- `.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md` — the referenced mistake

---
name: vocabulary-rename-blast-radius
description: The 71-file vocabulary rename has a real runtime-break surface on skill-dir split
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [vocabulary-sweep, blast-radius, risk]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Vocabulary rename scope: 71 in-scope files + real runtime-break surface on split

## Context
The vocabulary rename (MEMORIZATION → RECORD, session memory → session record, project memory → memory) spans 71 in-scope files across skills, agents, hooks, scripts, and wrapper files. Additionally the skill-dir split (`skills/memorization/` → `skills/memory/` + `skills/record/`) has a runtime-break surface: removing or renaming `skills/memorization/` without re-creating loader symlinks breaks skill loading for native Codex (`.agents/skills/`) and Claude Code (`.claude/skills/`).

## Decision
Acknowledge and document the full blast radius. The 71-file prose sweep is a vocabulary-only rename (no JSON enum, no hook regex change). The runtime-break risk is mitigated by: (1) the command-derived manifest (D-e) making every file countable and regenerable; (2) the exhaustive-vocabulary grep covering all forms (not just `MEMORIZATION`); (3) the two post-split gates (no-broken-symlink + presence). Proceed per the counter-evidence in Framed Problem § Counterfactual.

## Rationale
The rename is a clarity/maintenance improvement with a well-bounded risk surface. The form-blindness mistake (`mistakes/sweep-grep-literal-loop-name-blindspot.md`) is the risk; the command-derived manifest is its direct mitigation.

## Alternatives considered
- Narrow scope to reduce blast radius (rejected: D12 locks the full scope including CLAUDE.md/AGENTS.md and the skill-dir split; partial rename leaves ambiguity intact).

## Consequences
Planning must sequence the tasks to do the skill-dir split + mirror fixup as an atomic unit (not split across multiple PRs that leave a broken intermediate state). The two post-split gates must run before any PR merges the split work.

## Related
- Design § D-e (command-derived manifest)
- `features/workflow/decisions/2026-06-13-three-surface-loader-fixup.md`
- `evaluation/iter1/claude/risk.md` (risk-blast-radius-omits-workflow-memorization-referrers)

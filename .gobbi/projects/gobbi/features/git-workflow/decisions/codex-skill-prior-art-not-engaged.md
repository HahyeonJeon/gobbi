---
name: codex-skill-prior-art-not-engaged
description: The draft did not engage skills/codex/SKILL.md before asserting zero sandbox-term hits across skills/; causing a false absence claim and leaving internal prior art out of scope
type: decisions
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [docs-sync, research, prior-art, alignment]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Engage skills/codex/SKILL.md as internal prior art before asserting sandbox-term absence across skills/

## Context

The ideation iter1 artifact asserted "grep confirms zero hits for sandbox/approval/network terms
across `skills/`" and treated the skill tree as blank with respect to Codex sandbox vocabulary.
Both evaluators (Claude PROJ-1/PROJ-2/CONSIST-1/OVR-1, Codex C1) independently flagged this as
High/100: `skills/codex/SKILL.md` already contains `sandbox_mode`, `workspace-write`, and
`danger-full-access`, and cross-references the git skill via a dangling link at `:254`. The gap is
the GIT skill's — not the skill tree's. The iter1 artifact had not read `codex/SKILL.md` at all
before making the absence claim.

## Decision

Engage `skills/codex/SKILL.md` as internal prior art before asserting any absence claim about
Codex sandbox vocabulary across the skill tree. The git-skill change must ALIGN with it (add
cross-reference; do not duplicate or contradict its definitions). Add `codex/SKILL.md` as an
alignment file in the Scope Contract (item g). Correct the false absence claim in the artifact.

## Rationale

Principle 3 (design on prior art): no design without consulting what already exists. The codex
skill already owns the Codex sandbox vocabulary; the git skill is catching up, not starting from
zero. The dangling `codex/SKILL.md:254` link (pointing at `git/SKILL.md § Worktree CWD discipline`,
a section that does not exist) is also a link-integrity bug that the `file-move-needs-link-resolution-check`
mistake class covers.

## Alternatives considered

- Treat the codex skill as out-of-scope for git-skill research: rejected — the dangling link proves
  the gobbi design intent is for the git skill to serve as the CWD discipline reference.
- Consolidate sandbox vocab from codex/SKILL.md into git/SKILL.md: rejected — the codex skill
  already owns sandbox MODE definitions; git skill should cross-reference, not duplicate.

## Consequences

- `skills/codex/SKILL.md` becomes an affected/alignment file in the Scope Contract.
- DD-1 carries an explicit alignment note: cross-reference codex/SKILL.md, do not duplicate.
- DD-7 adds `git/SKILL.md § Worktree CWD discipline` so the dangling link at `codex/SKILL.md:254`
  resolves.
- C20 is added to the must-contain checklist.
- INT-7 is added to the internal insights.

## Related

- `staging/references/codex-skill-prior-art.md`
- `working/draft-iter2.md` § R1, DD-1, DD-7, C20, S31, INT-7

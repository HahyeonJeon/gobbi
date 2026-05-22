# Ideation iter2 — Project perspective (codex)

## Stage 0 Artifact Summary

The artifact is a 535-line iter2 Ideation draft for a destructive pre-rebuild reset of the gobbi repository: delete runtime/package surfaces, codex/plugin mirrors, most historical project memory, worktrees, branches, and sibling sessions while preserving `.gobbi/projects/gobbi/{agents,skills,rules}`, the current date-prefixed session, `.claude/` runtime guidance, root README/CHANGELOG/LICENSE, and a pre-reset tag. It exists because 17 user-locked cleanup decisions aim to give the next bottom-up rebuild a clean baseline; the approach is a single worktree PR off `develop` with bisect-safe sweep-branch commits, squash-merged to one commit on `develop`, followed by local cleanup and verification.

## Stage 1 Locked Frame

- Scenario P1: The reset remains inside the 17 user locks.
  - Checklist: Q1-Q8, Q-A-Q-G, Q-Survivor, and Q-StageE are all preserved; narrow iter2 edits are explicitly tied to evaluator remediations; no new survivor directories are smuggled in.
- Scenario P2: Surviving content does not cite deleted content.
  - Checklist: `.claude/CLAUDE.md` design links are removed; `.claude/agents/*` and `.claude/skills/*` symlink targets survive; session-scoped backlog fate is explicit.
- Scenario P3: The reset's counterfactual is real.
  - Checklist: the "do not reset" alternative is represented, not only the "tag before deleting" refinement; rejection is evidence-backed.
- Scenario P4 (adversarial): A structurally distinct sibling session or promoted mistake source is quietly deleted.
  - Checklist: `2026-05-21-c676684d-...` is named; the three mistake files' deletion is user-accepted; recovery path is tag-based, not dependent on project memory surviving.

## Inherited Iter1 Findings

- F-P-01 (`.claude/CLAUDE.md` dangling design links): addressed. Iter2 puts the narrow CLAUDE.md edit in scope at lines 39-40, Stage B lines 253-254, and Success #12 line 105.
- F-P-02 (counterfactual is "do less" rather than "do nothing"): open. The counterfactual remains the tag-before-delete argument at lines 136-138; it still does not steel-man "do not reset at all."
- F-P-03 (`2026-05-21-c676684d-...` not named): addressed. Iter2 names it in I5 lines 173-178 and Stage E.1 lines 281-283.

## Stage 2 Findings

### F-CX-P-01 — The real no-reset counterfactual remains underdeveloped

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: The counterfactual still frames the strongest argument as "Archive the prior state via a tag" at lines 136-138. That argument is satisfied by Q-F, so it is a mitigation inside the reset, not a counterproposal to the reset.
- **Why-it-matters**: This does not breach the verdict threshold because Q3 and Q-F are user-locked, but it weakens the Project perspective's proof that destructive reset is the right problem rather than the preferred implementation.

## Per-perspective Verdict

PASS. The remaining Project finding is Medium/75; no High>=50 or Critical>=75 finding is present in this perspective.

## Must-Preserve

- Preserve the 17 user locks exactly, especially Q-A's `agents/` + `skills/` + `rules/` survivor set.
- Preserve the narrow CLAUDE.md citation fix instead of expanding the design survivor set.
- Preserve explicit naming of `2026-05-21-c676684d-...` and the accepted mistake-file deletion trade-off.

# Ideation iter3 — Project perspective (codex)

## Stage 0 Artifact Summary

The iter3 artifact is the final Ideation draft for a destructive gobbi repo reset: delete runtime/package surfaces and obsolete mirrors, preserve `.gobbi/projects/gobbi/{agents,skills,rules}` plus the current date-prefixed session, placeholder most project memory, track sessions going forward, archive pre-reset state with a lightweight tag, and land the sweep through a worktree PR squash-merged into `develop`. Iter3 specifically replaces iter2's impossible SHA-in-session gate with a `git log` + `git ls-tree` gate and adds a Stage G head-SHA check around PR merge.

## Stage 1 Locked Frame

- Scenario P1: All 18 user locks remain in force.
  - Checklist: Q1-Q8, Q-A-Q-G, Q-Survivor, Q-StageE, and Q-Gate-Redesign are represented without expansion or rollback.
- Scenario P2: Project memory remains usable after placeholdering.
  - Checklist: `agents/`, `skills/`, and `rules/` content survives; session-scoped backlog fate is documented; deleted mistakes' lessons are encoded in the draft.
- Scenario P3: Iter3 addresses prior Codex findings without changing scope.
  - Checklist: no SHA is written into tracked session files; E.2 still preserves NEEDS_CONTEXT discipline; Stage G merge-head mitigation is scoped to the existing PR workflow.
- Scenario P4 (adversarial): The cleanup drops an audit signal future sessions depend on.
  - Checklist: future sessions can recover the reset commit via git history/tag/session draft; no survivor skill requires a sweep SHA inside `session.json`.

## Stage 2 Findings

No new project-scope threshold finding.

The project-level decision to drop SHA-in-session.json does not appear to remove a project-memory dependency. The current survivor guidance treats `session.json` as workflow telemetry, not a durable commit-audit ledger: `.claude/CLAUDE.md:13` describes per-session telemetry and plain markdown project memory separately, and the iter3 draft replaces SHA duplication with git-native traceability at `draft-iter3.md:326` and `draft-iter3.md:470`.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-OV-01: addressed. The project contract now explicitly puts "writing the sweep commit SHA into any tracked file" out of scope at `draft-iter3.md:77`, and the E.2 gate uses only `git log` plus `git ls-tree` at `draft-iter3.md:318-324`.
- F-CX-OV-02: open, Medium. The Stage G mitigation is in scope at `draft-iter3.md:66` and `draft-iter3.md:343-350`, but it relies on commit-body grep rather than the atomic `gh pr merge --match-head-commit` guard exposed by `gh pr merge --help`.

## Per-perspective Verdict

PASS. No High>=50 or Critical>=75 project finding.

## Must-Preserve

- Preserve all 18 locked decisions, especially Q-Gate-Redesign's "no SHA in tracked files" rule.
- Preserve the `agents/` + `skills/` + `rules/` survivor set and `.claude/CLAUDE.md` two-row citation excision.
- Preserve the session-scoped backlog narrative for `cli-regenerates-gobbi-gitignore.md`.
- Preserve the pre-reset tag at `487fc35` before any destructive sweep work.

# Ideation iter3 — Consistency perspective (codex)

## Stage 0 Artifact Summary

The iter3 draft must keep the Scope Contract, scenario table, implementation checklist, design notes, decisions log, and preserve list synchronized. The E.2 fix is consistently propagated across those sections. The remaining consistency problem is Stage G: the artifact consistently says commit-body SHA grep proves merge-head stability, but that claim conflicts with the repo's git convention and the available `gh pr merge` head-match option.

## Stage 1 Locked Frame

- Scenario C1: Every representation of E.2 says the same non-circular thing.
  - Checklist: Scope success criteria, S6, Stage E.2, D2, D9, Decisions Log, and exit checklist all use `git log` + `git ls-tree`, not SHA-in-session.
- Scenario C2: Every representation of Stage G proves the same merge invariant.
  - Checklist: success criteria, S6b, Stage G, D2, D11, and critical invariant #7 either all use an atomic head match or clearly state they are only message verification.
- Scenario C3 (adversarial): A remediation fixes one contradiction while introducing a new one.
  - Checklist: no section claims a GitHub squash body always contains source SHAs unless the repository settings/merge command guarantee it.
- Scenario C4: Previously accepted trade-offs stay documented.
  - Checklist: mistake deletion, backlog session-scoping, and CLAUDE.md citation excision remain aligned.

## Stage 2 Findings

### F-CX-C-03 — Stage G's proof claim conflicts with local git merge conventions

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Success Criterion #14 says the squash commit body includes the captured SHA because "GitHub's squash-merge commit body cites the source SHA(s)" at `draft-iter3.md:126`. I11 repeats that claim at `draft-iter3.md:218-220`; Stage G and D11 operationalize it with body grep at `draft-iter3.md:347-350` and `draft-iter3.md:486-488`. But `.gobbi/projects/gobbi/skills/git/conventions.md:207-211` says this repository's squashed commit subject is the PR title and the body is the PR body's `## Summary` section, and `gh pr merge --help` exposes `--match-head-commit SHA` for the actual head-match invariant.
- **Why-it-matters**: The document is internally consistent around the wrong assumption. If the PR Summary does not contain the source SHA, correct merges can fail verification; if user-controlled PR text does contain a stale captured SHA, a wrong-head merge can false-positive. The consistency fix is to use `--match-head-commit "$HEAD_SHA"` and then verify `mergeCommit.oid`/develop tip, not commit-body ancestry text.

### F-CX-C-04 — D1 order text places HEAD_SHA capture before PR open

- **Type**: `checklist_gap`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence with line numbers**: Stage G correctly orders push, PR open, PR body, review, then `HEAD_SHA` capture at `draft-iter3.md:338-346`. D1 summarizes the order as "(G) HEAD_SHA capture -> PR open + squash-merge" at `draft-iter3.md:372`.
- **Why-it-matters**: `gh pr view <pr-num>` requires a PR number, so the summary order is impossible if read literally. The detailed checklist is correct, so this is a low-severity summary mismatch.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-C-01: addressed. All E.2 representations now use `git log` and `git ls-tree`; see `draft-iter3.md:125`, `draft-iter3.md:238`, `draft-iter3.md:318-324`, `draft-iter3.md:394-397`, and `draft-iter3.md:461-470`.
- F-CX-C-02: partially addressed/open. Head capture was added at `draft-iter3.md:343-345`, but the verification path is not equivalent to an atomic head-stability check.
- Iter1 consistency fixes F-C-01 through F-C-04: remain addressed.

## Per-perspective Verdict

PASS. The consistency defects are Medium and Low, below threshold.

## Must-Preserve

- Preserve post-merge-only definition of "one new commit on develop."
- Preserve explicit local sweep-branch deletion after merge.
- Preserve symlink verification across `.claude/skills` and `.claude/agents`.
- Preserve the E.2 non-circular wording across all sections.

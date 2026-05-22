---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: gates-codex-rebuild-deferred
design-decisions: [D6, D7, D8, D9, D10, D11]
---

# Gates, Codex/Agents, Rebuild Intent, E.2 Gate, CLAUDE.md Edit, Atomic Merge

## D6 — Design Decision Summary Table

D6 is the summary table cross-referencing all 11 design decisions, the user locks that drove them, and the Success Criteria they satisfy. Key entries:
- D1 stage shape → Q1-Q8 + Q-A through Q-G
- D4 stub template → Q2 + Q-A
- D9 E.2 gate → Q-B + Q-Gate-Redesign
- D11 atomic guard → Q-iter4-Override

The table is the canonical cross-reference for Planning. Planning should read D6 to trace each implementation bullet back to its user lock.

## D7 — Codex and Agents: Delete Both, Defer Rebuild

`.codex/` and `.agents/` are deleted in the sweep (git rm -r). The focus for the rebuild is Claude-only first. Codex support is a high-priority follow-up but will be implemented in a later session. The current `.codex/` is a symlink farm into `.claude/`; once `.claude/` is stabilized post-rebuild, the Codex mirror can be re-generated. No Codex-specific logic is preserved in the sweep artifacts.

## D8 — Rebuild Intent and Deferred Follow-Ups

The sweep creates a clean slate for bottom-up rebuild. Known deferred follow-ups:
1. **CLI regenerator fragility**: CLI bootstrap may regenerate `.gobbi/.gitignore` and `.gobbi/.gitignore`-related patterns; adjust the regen logic in the rebuild. Filed as `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`.
2. **`rules/stub-redirect-format.md` extension**: Add "Variant C — placeholder stub after content wipe" (F-U-02 deferred follow-up).
3. **Codex support**: re-implement `.codex/` mirror after Claude-only rebuild stabilizes.
4. **`--delete-branch` local cleanup normalization**: Resolve whether explicit `git branch -d` is needed after `gh pr merge --delete-branch` (F-CX-O4-01 deferred).

## D9 — Bare-UUID Session Dir Delete Sequencing (Q-B + Q-Gate-Redesign)

The bare-UUID dir `.gobbi/projects/gobbi/sessions/6637e759-84d9-403d-87bd-0a484abec245/` is the CLI runtime's session pointer. It must be deleted LAST to avoid losing the live session state mid-sweep.

Stage E.2 gate (non-circular, from Q-Gate-Redesign, iter3):
- Pre-condition 1: `git log --format=%H -1 <sweep-branch>` returns non-empty SHA
- Pre-condition 2: `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../` lists at least one entry
- Both conditions pass → proceed to `rm -rf` the bare-UUID dir
- Either fails → NEEDS_CONTEXT (per `executor-rationalized-failing-verification-gate.md`, no rationalization)

Out-of-Scope: writing the sweep SHA into any tracked file (this was the iter2 self-referential gate, explicitly removed in iter3).

## D10 — CLAUDE.md Surgical Excision (H-1, from F-P-01)

`.claude/CLAUDE.md` lines 61-62 contain two table rows pointing to `design/v050-overview.md` and `design/v050-cli.md` under `.gobbi/projects/gobbi/design/`. Both files are in the `design/` placeholder dir (content wiped). Rather than expanding the survivor set to include `design/`, Stage B performs a surgical 2-line excision of exactly those two rows. All other CLAUDE.md content is preserved.

Verification: `grep -c 'v050-overview\|v050-cli' .claude/CLAUDE.md` → 0 after Stage B.

## D11 — Atomic Merge Guard (Q-iter4-Override, from F-CX-OV-02)

Stage G merge mechanism:
1. Push sweep branch: `git push origin <sweep-branch>`
2. Open PR: `gh pr create --title "chore: pre-rebuild destructive reset" --base develop`
3. Capture head: `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)` (audit log)
4. Atomic merge: `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`
5. If exit 0 → merge succeeded, head matched; proceed to M-2 local cleanup
6. If exit non-zero → NEEDS_CONTEXT (report old HEAD_SHA, current PR head, stderr; no retry, no rationalization)

Historical context (preserved in D11 preamble as Iron Law 10 witness):
- iter2 (Codex REVISE): identified SHA-gate self-reference (F-CX-OV-01)
- iter3 attempt: added body-grep verify `grep -F "$HEAD_SHA"` against squash commit body — empirically refuted by Claude against 5 recent squash-merges on this repo (none contain source-SHA trailers)
- iter4 (Codex prescription): `--match-head-commit` flag enforces head-match atomically at the server-side merge transaction; no post-merge inference needed

The `--match-head-commit` flag is documented in `gh pr merge --help` and backed by the GitHub REST merge endpoint's `sha` parameter. Verified via `gh pr merge --help` on the local machine (gh 2.45.0).

## Related

- `ideation/artifacts/design-direction.md` § D6-D11
- `ideation/staging/decisions/sha-gate-self-referential.md` (F-CX-OV-01)
- `ideation/staging/decisions/merge-head-stability.md` (F-CX-OV-02)
- `ideation/staging/decisions/claude-md-dangling-links-post-sweep.md` (F-P-01)

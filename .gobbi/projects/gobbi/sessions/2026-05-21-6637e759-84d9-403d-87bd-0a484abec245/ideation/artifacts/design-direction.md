---
loop: ideation
iter: 4
artifact_type: design-direction
created_at: 2026-05-21
status: final
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/implementation-checklist.md
  - ideation/rawdata/draft-iter4.md
---

# Design Direction — Repo Reset (iter4 PASS)

The design surface for a destructive cleanup is small but the ordering and verification are the load-bearing decisions.

## D1 — Deletion order across the 7 items + H-1 CLAUDE.md edit + iter4 atomic-guard merge

Order: (0) tag → (A) pre-flight + branch open → (B) code/plugin/root + `.claude/project/gobbi/` + CLAUDE.md lines 61-62 excision → (C) adversarial-review + placeholder reset → (D) gitignore edits committed → (E.1) sessions sweep in-commit (52 dirs incl. `c676684d-`) → (E.2) bare-UUID FS-only delete gated by `git log` + `git ls-tree` → (F) worktree removal + branch deletion → (G) `HEAD_SHA` capture (audit-log) → `gh pr merge --match-head-commit "$HEAD_SHA"` atomic guard → local sweep-branch delete.

Rationale: the tag must point at the PRE-reset commit; `.gitignore` edits must be committed before `git add` on the kept session dir; the bare-UUID delete is terminal-post-commit (not part of any commit) and gated by NON-CIRCULAR pre-conditions; CLAUDE.md surgical 2-line excision lands in Stage B alongside the other Stage-B deletions; worktree removal must precede branch deletion; `HEAD_SHA` capture happens immediately before merge as audit-log, and `--match-head-commit` enforces head-match atomically at merge time; local sweep-branch deletion is the post-merge tail.

## D2 — Verification at the end (20 commands)

The Plan's verification gate enumerates 20 commands covering: no broken symlinks, exactly one session dir, tag at `487fc35` locally+remotely, CLAUDE.md table rows removed, worktrees cleaned, branches removed, gitignore policy verified on both files, stub README count (14), sessions tracking verified, E.2 non-circular gate (2 pre-conditions), and Stage G atomic-guard merge exit code.

Key: D2 #16 uses `$`-anchored `grep -c` (safe for line-count where one match per line guaranteed) per `manager-mispec-grep-c-for-occurrence-count.md`. For occurrence counts where lines might collide, use `grep -o … | wc -l`.

## D3 — Where session-memory tracking is enforced

Two files coordinate: root `.gitignore` (drop `.gobbi/projects/*/sessions/`) AND `.gobbi/.gitignore` (drop `sessions/` and `project/note/`). Both must be edited because the latter is workspace-scoped and could shadow the root.

## D4 — Stub README format (inline template, NOT cited from stub-redirect-format.md)

`stub-redirect-format.md` covers supersession stubs (a file's content has moved). These placeholders are different: no successor, just an emptied dir with a one-line "this is the seat" marker.

Authoritative template:
```
# <subdir-name>

<one-line description of the subdir's pre-reset role>. See git tag `pre-reset-2026-05-21` for pre-reset content.
```

For root `.gobbi/projects/gobbi/README.md`: `Gobbi project memory root — see git tag pre-reset-2026-05-21 for pre-reset state.`

Validation: `find .gobbi/projects/gobbi/ -maxdepth 2 -name README.md -exec wc -l {} \;` → each result ≤ 4 lines.

Deferred follow-up: extend `rules/stub-redirect-format.md` with a "Variant C — placeholder stub after content wipe."

## D5 — `git branch -D` handling

Q-G pre-authorizes `-D` for the 2 non-ancestor branches. The Plan encodes them as explicit `-D` tasks; no AskUserQuestion gate at Execution. Alternative considered (pre-merge them into `develop`) rejected because they're not actually merge-targets.

## D6 — Validation strategy summary

| Decision | Validation method |
|---|---|
| D1 ordering | Plan-encoded gate checks at each stage's exit |
| D2 verification | 20 verification commands at PR ready-for-merge / post-merge |
| D3 gitignore policy | `git check-ignore` regression test post-edit (both files) |
| D4 stub format | `wc -l` line-count gate + spot-check by manager |
| D5 force-delete | Pre-authorized by Q-G; no runtime gate |
| D7 tag archival | `git rev-parse` + `git ls-remote` checks |
| D9 E.2 gate (iter3 Q-Gate-Redesign) | Two non-circular pre-conditions: `git log` SHA non-empty + `git ls-tree` shows kept session dir |
| D10 CLAUDE.md surgical edit (iter2 H-1) | Pre/post `grep -nE` of the two table-row patterns |
| D11 merge-head atomic guard (iter4 Q-iter4-Override) | Pre-merge `gh pr view --json headRefOid` capture (audit-log); merge via `gh pr merge --match-head-commit "$HEAD_SHA"`; exit code 0 is the contract |

## D7 — Pre-sweep tag (Q-F)

Lightweight tag `pre-reset-2026-05-21` at `487fc35`. Created BEFORE the sweep branch opens so the tag references the pre-reset commit. Pushed to origin. Recovery via `git checkout pre-reset-2026-05-21` is a one-command operation.

## D8 — CLI-regenerator follow-up risk (Q-E) + post-sweep backlog fate (iter2 H-4)

Editing `.gobbi/.gitignore` is a point-in-time fix; the regenerator that produces this file lives in `packages/cli/` which is being deleted this session. A future rebuilt CLI may regenerate the file with the OLD policy. Mitigation: backlog entry staged at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`. Per H-4: the post-sweep promotion target `.gobbi/projects/gobbi/backlogs/` is in the PLACEHOLDER set. The backlog stays session-scoped; the Wrap-up handoff narrative explicitly references it.

## D9 — Bare-UUID session-dir delete sequencing (Q-B + iter3 Q-Gate-Redesign)

The CLI bare-UUID dir `6637e759-...` is Stage E.2 — a TERMINAL post-commit FS-only operation. Gate: two non-circular pre-conditions via plain `git` plumbing:

1. `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA (concrete: `[ -n "$(git log --format=%H -1 <sweep-branch>)" ]`).
2. `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/ | grep -q .` (exit 0 ⇒ pass).

On either failure: NEEDS_CONTEXT (no rationalization). The sweep SHA is NEVER written into `session.json` or any other tracked file.

## D10 — Surgical CLAUDE.md edit (iter2 H-1)

`.claude/CLAUDE.md` lines 61-62 cite `.gobbi/projects/gobbi/design/{v050-overview,v050-cli}.md`, which are placeholdered in Stage C. Resolved by deleting those two table rows from CLAUDE.md in the same sweep commit. A 2-line edit; no other CLAUDE.md content is touched.

Verification: `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` returns empty.

## D11 — Merge-head atomic guard (iter4 Q-iter4-Override — supersedes iter3's body-grep verify)

Claude iter3 empirically refuted iter3's post-merge body-grep step by running `git log` against this repo's 5 most recent squash-merged PRs (`487fc35`, `228fbdc`, `cd9eb86`, `adae51e`, `f3769cc`) — none contain the source-branch head SHA in the merge commit body. Codex iter3 independently prescribed the surgical fix: `--match-head-commit "$HEAD_SHA"` on the merge command (gh 2.45.0+, verified via `gh pr merge --help | grep match-head-commit`).

iter4 Stage G mechanism:
- **Capture (immediately before merge)**: `HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)`. Echoed/logged to executor's session log as audit-log.
- **Atomic-guard merge**: `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. Exit 0 ⇒ head-match enforced server-side at merge time. Exit ≠ 0 ⇒ NEEDS_CONTEXT (report HEAD_SHA, current headRefOid, gh stderr; do NOT retry).

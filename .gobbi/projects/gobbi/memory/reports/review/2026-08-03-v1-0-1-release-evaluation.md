# Gobbi v1.0.1 release evaluation

Independent Codex evaluation of the frozen Cowork release branch through candidate
`890bf7fedfd4bec810349095b8c067d5626a7b27`. The user explicitly called `evaluate` and explicitly waived
Claude Code for this named round.

## Subject and limits

The review covered the whole frozen release branch and its mechanical release and package behavior. The
accepted release scope was the accumulated development line, disclosed by PR #373 as 239 files including 17
canonical skill files. Semantic review of the accumulated skill and agent behavior was excluded. Version
1.0.1 was an explicit user decision despite a documented minor-version concern.

## Verdict

`REVISE`

| Finding | Judgment | Evidence | User disposition |
|---|---|---|---|
| `REL-CONS-001` | High; confidence 100; blocking | `.codex/AGENTS.md` and the canonical and packaged Codex skill described the obsolete symlink/manifests-only install, contradicting the materialized package and passing installed-cache smoke. The materialization change had not propagated to every authoritative document, and topology checks proved equality without checking cross-document truth. | Correct only this finding while retaining version 1.0.1. |
| `REL-PLAN-002` | Medium; confidence 100; non-blocking | Frozen `tasks.md` and `plan.md` omitted the legacy-PR inspection and 17-skill disclosure gates, although GitHub evidence proved both occurred. | Accepted without correction; not backlogged. |
| `REL-GIT-003` | Low; confidence 100; non-blocking | PR #374 recorded `Branch: develop` instead of the Cowork session branch in its Gobbi provenance block. | Accepted without correction; not backlogged. |

## REL-CONS-001 correction and release state

- Cowork commit `3788211c471225e01609f7065f4c93171f9ba5e2` corrected `.codex/AGENTS.md`, the
  canonical and generated Codex skill, and the installed-cache smoke. The smoke now rejects the obsolete
  manifests-only guidance and asserts the complete nested skill-tree contract.
- Reusing the retained Cowork branch for PR #375 exposed the old merge base after the branch's earlier work
  was squash-merged. GitHub displayed 239 files and 42 commits although the local delta from current
  `develop` was four files. Pre-merge inspection caught the mismatch, and #375 was closed unmerged as
  superseded.
- Clean publication branch `hotfix/codex-install-guidance` started at current `develop` and received the
  verified correction as `ab4480dfe1e037cd71d46d9287e304388eeaf469`. PR #376 squash-merged its exact
  one-commit, four-file diff to `develop` as `b61a46ccec638b3c869d119451b87b58aceda918`. PR #377
  normal-merged that state to `main` as `71889484dc4fa12ca529eb6cf28ecc05ce7cf467`, preserving
  `develop` ancestry.
- The current `develop` and `main` tree is `7f02c3dd1e25eeb4d26cda3efc963034029c7ac5`. Both plugin
  manifests and the Claude marketplace remain at 1.0.1. The existing annotated v1.0.1 tag was intentionally
  not moved, so it still peels to original release commit `7e44b5831eb59eaf8d7cf8e19a1d73f19efcbf0d` and does
  not contain the same-version hotfix now present on the default branch.

## Verification

The exact hotfix tree passed canonical/package sync, all 20 sync fixtures, the installed-cache smoke with
the new guidance assertion, strict Claude plugin validation, focused Markdown link checks, diff checks,
canonical/package byte equality, public version and guidance checks, branch/tag/PR reference checks, and
clean-worktree checks. PRs #375, #376, and #377 are respectively closed as superseded, merged, and merged;
no pull request remains open.

## Evaluation freshness

This verdict covers only the original frozen subject through candidate `890bf7fedfd4bec810349095b8c067d5626a7b27`.
The accepted REL-CONS-001 hotfix changed that subject, so the verdict became stale after the correction. No
fresh independent verdict covers Cowork commit `3788211c471225e01609f7065f4c93171f9ba5e2` or released
`main` commit `71889484dc4fa12ca529eb6cf28ecc05ce7cf467`. Cowork requires another explicit user `evaluate`
call for that coverage.

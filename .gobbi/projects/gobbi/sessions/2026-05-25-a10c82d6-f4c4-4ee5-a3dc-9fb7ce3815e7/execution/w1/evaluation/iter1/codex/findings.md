# Wave 1 Frontmatter Fixes - Codex Adversarial Evaluation

Target: `71b69ab..HEAD` under `.gobbi/projects/gobbi/` (verified 3 commits).

## Findings

- [HIGH|checklist_gap|100] `mistakes/README.md` violates the literal W1-T1 gate that every `mistakes/*.md` file starts with frontmatter and has base fields.
  Evidence from `.gobbi/projects/gobbi`: the requested check over `mistakes/*.md` reports `missing-open`, `missing-name`, `missing-description`, `missing-type`, `missing-scope`, and `missing-created` for `mistakes/README.md`. Re-running the same base-field check while excluding `README.md` reports no failures, so the miss is isolated to the README placeholder.
  Impact: the Wave 1 acceptance criterion as written is not satisfied. Either add base frontmatter to `mistakes/README.md`, or explicitly rescope the gate to exclude directory README placeholders consistently with the `design/ learnings/ rules/ backlogs/` grep.

## Verification Notes

- W1-T1 staging-only keys: `grep -rl '^mistake-candidate:' mistakes/`, `'^finding-id:'`, `'^promoted-from:'`, and `'^promoted-at:'` each returned count `0`.
- W1-T1 protected body: body-only diff for `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` against `71b69ab` was empty; only frontmatter changed.
- W1-T2: `rules/stub-redirect-format.md` starts with `---`, has `type: rules`, and the no-frontmatter clause is scoped to stub-redirect TARGET docs.
- W1-T3: changed `design/` and `learnings/` files start with `---` and have `type`, `scope`, and `created`; the aggregate `grep -rL '^---' design/ learnings/ rules/ backlogs/ | grep -v '/README.md$' | wc -l` returned `0`.
- W1-T3 rename guard: `learnings/f-aes-01-locked-wording-supersedes-readability-nit.md` remains at the same path and is modified, not renamed.
- Allowlist: no touched file contains frontmatter keys outside base plus the per-type extensions in `memorization/rules.md` section 2.2 / wrap-up promotion allowlist.
- Scope: `git diff --name-only 71b69ab..HEAD -- .gobbi/projects/gobbi/` touched only `mistakes/`, `rules/stub-redirect-format.md`, `design/`, and `learnings/`; no committed `features/`, `sessions/`, or `skills/` leak.

VERDICT: REVISE

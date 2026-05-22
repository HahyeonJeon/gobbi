---
loop: ideation
iter: 4
artifact_type: framed-problem
created_at: 2026-05-21
status: final
related:
  - ideation/artifacts/scope-contract.md
  - ideation/rawdata/draft-iter4.md
---

# Framed Problem — Repo Reset

## Root cause

Cumulative drift across approximately 26 v0.5.0 development sessions left the repo with overlapping competing surfaces: tracked `packages/` runtime alongside channel-managed `gobbi-dev`, dual `.claude/`-vs-`.gobbi/projects/gobbi/` mirrors (where `.claude/skills/+agents/` are SYMLINKS into `.gobbi/projects/gobbi/{skills,agents}/`), an `adversarial-review/` artifact tree the rules do not sanction, 54 session dirs (53 historical + 1 current), `.claude-plugin/marketplace.json` already mid-delete, a v0.4-era `.claude/project/gobbi/` tree, and root manifests that no longer match the channel-split distribution model. Evidence: `git status` snapshot at session bootstrap (5 modified + 2 deleted + many untracked); `git ls-files | grep .gobbi/projects/gobbi/` showing tracked content collocated with newly untracked promotion artifacts; `.gobbi/projects/gobbi/sessions/` containing 54 dirs of which 3 are non-UUID test/CLI artifacts. Per project memory entry `project_v050_redesign_env_prep.md` (PR #250 / `7aad94a`), the channel-split moved gobbi-stable to npm-global and gobbi-dev to a manual symlink; root `package.json`+`bun.lock` retain no operational role and are residue.

## Impact

- **Who is affected**: only the solo user (`feedback_solo_user_context`). Affected agent surfaces: any future Claude/Codex session bootstrapping from the repo, the `gobbi` CLI's session resolution (driven by `.gobbi/projects/gobbi/sessions/`), and Plan/Execute loops that read project memory.
- **Severity**: blocker for the rebuild — a bottom-up redesign can't anchor on incoherent prior state. Not a runtime regression (`.claude/skills/+agents/` survive intact because their symlink targets `.gobbi/projects/gobbi/{skills,agents}/` are preserved under Q-A).
- **Cost of inaction**: rebuild drags accumulated debt forward; any leader/executor reading project memory loads 80+ files of half-superseded v0.5.0 history that no longer reflects the redesign target.

## Success criteria

See Scope Contract → Success Criteria.

## Prior attempts

- `feedback_redesign_version_naming` locks the redesign as v0.5.0 (no v0.6.0 framing).
- `project_v050_redesign_env_prep` (2026-05-02 PR #250) executed env prep but did NOT touch project memory or `packages/` — explicitly out of scope at the time.
- The recent 9-commit `refactor/257-skills-agents-rules` branch (now squash-merged via PRs #260/#261/#262) consolidated the 5-role agent taxonomy and 16-skill v0.5 surface, locking the survivor content at `.gobbi/projects/gobbi/{skills,agents}/`.

## Counterfactual / steel-man

Strongest argument against destructive single-PR reset: **"Archive the prior state via a `v0.5-archive` tag (or branch) before deletion, so future investigation can recover the lived design history."** This steel-man IS satisfied under Q-F: lightweight tag `pre-reset-2026-05-21` at `487fc35`, pushed to origin BEFORE the PR opens. Zero cost; surfaces the "reset point" for future readers; recovery is a one-command `git checkout pre-reset-2026-05-21` away.

## Re-framing conclusion

The literal ask — destructive cleanup followed by rebuild — is the right framing. The leader checked two adjacent framings:
- "Maybe the cleanup should also re-design the placeholder structure to match the rebuild's bottom-up shape, not just preserve subdir names." — Rejected: this couples cleanup to rebuild design, defeating bottom-up. The placeholder shape is "what currently exists, with content removed."
- "Maybe the cleanup should consolidate `.claude/` and `.gobbi/projects/gobbi/` into a single tree to remove the mirror complexity." — Rejected: out of scope. The user redesigned `.claude/skills/+agents/` recently and wants it preserved; the mirror is a deliberate distribution mechanism, not an accident.

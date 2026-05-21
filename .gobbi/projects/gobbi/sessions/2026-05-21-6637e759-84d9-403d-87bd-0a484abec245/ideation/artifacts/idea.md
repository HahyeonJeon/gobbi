---
loop: ideation
iter: 4
artifact_type: idea
created_at: 2026-05-21
status: final
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/framed-problem.md
  - ideation/artifacts/design-direction.md
  - ideation/artifacts/implementation-checklist.md
---

# Locked Idea: Bottom-Up Repo Reset (iter4 PASS)

The agreed Idea for this session is a **destructive single-PR sweep** that resets the gobbi repository to a clean baseline before a bottom-up rebuild. Accumulated drift across approximately 26 v0.5.0 development sessions left the repo with overlapping surfaces: tracked `packages/` runtime alongside a channel-managed `gobbi-dev`, a v0.4-era `.claude/project/gobbi/` tree, `adversarial-review/` artifacts outside the rule-sanctioned tree, 54 session directories, and root manifests with no operational role. The sweep deletes `packages/`, all root manifests, `plugins/gobbi/`, `.codex/`, `.agents/`, `.claude/project/gobbi/`, and `adversarial-review/`; surgically removes two dangling table-row links from `.claude/CLAUDE.md` (iter2 H-1); reduces all non-survivor project-memory subdirs (13 total) to one-line placeholder READMEs; deletes 53 legacy session directories while preserving only the current date-prefixed session dir; edits both `.gitignore` files so `sessions/` becomes tracked; removes four local branches and both registered worktrees; and creates a lightweight archival tag `pre-reset-2026-05-21` at `487fc35` before the sweep branch opens. The merge is hardened via `gh pr merge --squash --delete-branch --match-head-commit "$HEAD_SHA"` (iter4 Q-iter4-Override), which enforces head-match atomically at the GitHub-API merge transaction—replacing iter3's empirically-refuted post-merge body-grep. Nineteen user-confirmed locks across six AskUserQuestion rounds define the complete scope; this Idea feeds directly into the Preparation Loop as the locked Idea artifact.

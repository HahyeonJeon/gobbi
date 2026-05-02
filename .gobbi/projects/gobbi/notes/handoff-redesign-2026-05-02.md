# Handoff — next session (gobbi v0.5.0 bottom-up redesign + CLI refactor)

**Source session:** 2026-05-02 — env-prep only. The actual redesign + refactor work has NOT started; this session set up the working environment so the next session can begin Ideation cleanly.

**Tracking issue:** [#249](https://github.com/HahyeonJeon/gobbi/issues/249) — v0.5.0 bottom-up redesign + CLI refactor. Stays open across many sessions.

**Develop tip (origin in sync with local):** `d1facaf`

---

## What's shipped this session

| Commit | What |
|---|---|
| `7aad94a` (PR #250, squash-merged) | Channel split + project-state directory layout reconciliation |
| `9b48982` | (catch-up) #245 fix(config) validate project name at settings-io seam |
| `7a7aa9a` | (catch-up) #219 feat(notify) wire rich messages for 21 Phase-2 hook events |
| `d1facaf` | (catch-up) #248 feat(maintenance) SC-ORCH-21 Option A — auto-bak + replay-equivalence |

The 3 catch-up commits were created by the previous session as direct local commits without push; this session rebased them onto PR #250 and pushed.

### Layout reconciled

`.gobbi/projects/gobbi/` now matches the canonical bottom-up shape the user specified:

| Group | Directories |
|---|---|
| Design | `design/`, `decisions/`, `plans/`, `backlogs/`, `features/{feature_name}/{design,decisions,plans,backlogs,scenarios,checklists}/` |
| Materials | `learnings/`, `gotchas/`, `references/`, `reviews/`, `notes/` |
| Utils | `archive/`, `tmp/`, `agents/`, `skills/`, `rules/` |

Removed: `checklists/` (now lives only under `features/`), `playbooks/`, `scenarios/` (now under `features/`), `handoff/` (this file replaces it under `notes/`). Runtime dirs (`sessions/`, `worktrees/`, `tmp/`, `settings.json`, `project.json`) are gitignored and unaffected.

`features/` is empty — the redesign will populate it per feature.

### CLI channel split

| Binary | Version | Source | What it serves |
|---|---|---|---|
| `gobbi` | 0.4.5 | `npm install -g @gobbitools/cli@0.4.5` | Stable / "server" — published plugin's hooks, ambient skills |
| `gobbi-dev` | 0.5.0 | Manual symlink → main tree `packages/cli/bin/gobbi-dev.js` | Dev — this repo's `.claude/settings.json` hooks, dev workflow |

Plugin hooks in `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json` (29 entries each) call `gobbi-dev hook ...` on this branch. The release branch will revert both back to `gobbi` before publishing v0.5.0.

---

## Critical environment gotcha — restoration command

`gobbi-dev` is a **manual symlink**. Any future `npm install -g @gobbitools/cli@<version>` will wipe it (both packages share the name `@gobbitools/cli`; npm install replaces the package directory and removes any bin symlinks not declared in stable's package.json).

Restore with:

```
ln -s /playinganalytics/git/gobbi/packages/cli/bin/gobbi-dev.js \
      /home/jeonhh0061/.nvm/versions/node/v22.22.1/bin/gobbi-dev
```

A firmer fix exists if this becomes painful: rename `name: "@gobbitools/cli"` → `"@gobbitools/cli-dev"` on develop so `npm link` can coexist with stable's `npm install -g`. Not done; offered as a follow-up.

---

## Decisions locked this session

1. **Bottom-up redesign approach.** The user explicitly framed this as "redesign + refactor entirely," not narrow per-issue fixes. The previous session's "fix workflow" framing led to handoff descriptions misframing the actual code state of #245/#219/#248 — see deleted `handoff/next-session.md` for that retrospective; the takeaway was that handoffs accumulate faster than they can stay accurate, so the redesign should aim to produce **fewer canonical docs, not more**.

2. **Bin rename via `bin` field, not `name` field.** Recommendation given was to rename `bin: gobbi` → `gobbi-dev` only. The `name` field (`@gobbitools/cli`) was kept identical to stable, which is why `gobbi-dev` requires manual symlink rather than coexisting `npm link`. Trade-off accepted by the user.

3. **Channel split mechanism** — stable as ambient (npm-installed CLI + Claude Code marketplace plugin); dev as opt-in (manual symlink + project-scope `.claude/` override).

4. **Layout — `features/{name}/` is the unit of decomposition.** Sub-features hold their own `design/decisions/plans/backlogs/scenarios/checklists/`. Project-root `design/decisions/plans/backlogs/` are for cross-feature, project-level concerns.

---

## Out of scope (intentional, queued for the redesign)

- **CLI source self-references.** Files like `_stub.test.ts`, `init.ts` guidance text, `notify-configure` settings.json fixtures still emit literal `gobbi hook X`. Internal-naming concern; sweep as part of the refactor.
- **Plugin manifest version drift.** `.claude-plugin/marketplace.json` says `0.4.4`; npm tag is `0.4.5`. Bump and tag if you want a stable plugin release alongside the next CLI publish.
- **Bigger `name` rename to `@gobbitools/cli-dev`.** Only worth doing if the manual symlink keeps getting wiped.

---

## Where to start the next session

1. Restart Claude Code. New session reads merged `.claude/settings.json` and post-rebase develop. Hooks will work cleanly because both `gobbi` and `gobbi-dev` are on PATH.
2. The user wants Ideation on the bottom-up redesign — they explicitly said "I will guide about the works" after the env prep. So **don't presuppose direction** — open with `/gobbi`, then ask what feature/concept they want to start designing first.
3. The deleted `handoff/next-session.md` (lost in PR #250 cleanup) had useful framing about *why* this redesign is happening — the user can re-narrate, or you can read it from PR #250's files-changed view if needed (`gh pr view 250 --json files`).

---

## Pointers

- **Issue:** #249 (umbrella for the redesign + refactor)
- **PR just merged:** #250 (`7aad94a`)
- **Layout README:** `.gobbi/projects/gobbi/README.md`
- **Active rules touching the redesign:** `.gobbi/projects/gobbi/rules/__gobbi-convention.md` (naming), `.gobbi/projects/gobbi/rules/docs-cleanup-parallelism.md` (when to use single agent vs parallel)
- **Memory entry for this session:** `project_v050_redesign_env_prep.md` (created same date)

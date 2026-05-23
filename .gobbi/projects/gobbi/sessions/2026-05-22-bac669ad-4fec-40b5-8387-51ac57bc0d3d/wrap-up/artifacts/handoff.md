---
artifact_type: handoff
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
feature: env-var-audit
loop: wrap-up
iter: 1
verdict: pending
created: 2026-05-22
---

# Session Handoff — Env-Var Audit + SessionStart Hook

Session `2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d`. Feature `env-var-audit`. PR #265.

---

## Summary

This session resolved three concrete env-var contract defects in gobbi's skills. The defects were empirically confirmed at bootstrap: `$CLAUDE_SESSION_ID` returned `UNSET`; `jq '.hooks // "NO_HOOKS_BLOCK"'` on `.claude/settings.json` returned `"NO_HOOKS_BLOCK"`. All three defects are now repaired and shipped in PR #265 (squash-merged at `159eb21` on `develop`). Manager stamp commit `00a11ae` is local on develop, pending the Wrap-up final push.

---

## What Shipped

**PR #265** (`feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID)`) squash-merged at `159eb21` on `develop` (2026-05-22).

8 commits squashed (T1 + T1-hardening + T2 + T3 + T4 + T5 + T6 + T7); each had an `AI-Provenance-Record` trailer per `git/conventions.md`.

### Delivered changes

| Area | Change |
|---|---|
| `.claude/hooks/session-start.sh` | NEW — bash+jq SessionStart hook; exports 8 hook-only vars + `CLAUDE_HOOK_SOURCE` + 3 passthroughs; shell-safe via `jq -r @sh`; fail-fast on empty stdin |
| `.claude/settings.json` | Added `hooks.SessionStart` array entry (matcher: `startup\|resume\|clear\|compact`) |
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | Rewrote `§ Session env vars arrive automatically`: renamed row 1 to `CLAUDE_CODE_SESSION_ID`, preserved `CLAUDE_TRANSCRIPT_PATH` row 2, added `CLAUDE_HOOK_SOURCE` row, two-gate health warning, new "Runtime-set env vars" sub-section citing v2.1.132 |
| 11 skill files (P1) | `$CLAUDE_SESSION_ID` → `$CLAUDE_CODE_SESSION_ID` rename (13 occurrences) |
| `orchestration/SKILL.md` + `session.template.json` | Added `transcriptPath: null` to schema + top-level-fields list; Step 1 row 6 documents manager-agent stamp with tilde-form + `$HOME`-substitution |
| 6 skill files (P7) | 9 `$CLAUDE_TRANSCRIPT_PATH` references reworded to cite `session.json.transcriptPath` (tilde-expand on read) as primary; env fallback retained |
| `session.json` (this session) | `transcriptPath` stamped in tilde-form by manager (M1 commit `00a11ae`, local) |

---

## Open Threads

### Deferred backlog items

1. **F-STRUCT-01 — `jq @sh` env-passthrough quoting example** — Medium/75, ideation iter3 finding. The hook contract's canonical `jq -r @sh` pattern applies to stdin-JSON-derived fields via `.field` syntax. The 3 env-sourced passthrough re-exports need a second illustrative snippet (e.g., `printf '%q'` pattern) so an Executor is not left to improvise.
   - Pointer: `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md`

2. **F-RISK-01 — Subagent CCSI path-construction semantics** — Medium/75, ideation iter1 finding. A Task-spawned subagent receives its own `$CLAUDE_CODE_SESSION_ID`, not the parent session's UUID. Skills documenting `$CLAUDE_CODE_SESSION_ID` as the session-id source for path construction may cause subagents to write to subagent-scoped paths. Current practice (manager passes parent-session-id in delegation prompts) prevents the bug in practice, but the skill docs are inconsistent with that practice.
   - Pointer: `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md`

### Pending push

- Manager stamp commit `00a11ae` is local-only on `develop`. Wrap-up's final push will land it on `origin/develop`.

### Still deferred (unchanged from ideation § Deferred)

- CLI automation of `transcriptPath` stamping in `packages/cli/src/`
- TS+bun port of `.claude/hooks/session-start.sh`
- `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` / `CLAUDE_PLUGIN_DATA` docs-vs-empirical discrepancy resolution
- Downstream skill consumers of `CLAUDE_HOOK_SOURCE`

---

## Decisions to Respect (Post-Merge)

These decisions are locked. The next session MUST NOT re-open them.

1. **`CLAUDE_SESSION_ID` is DROPPED** — the name does not appear in any skill file post-PR. The correct runtime-set var is `CLAUDE_CODE_SESSION_ID`. Do not re-introduce `CLAUDE_SESSION_ID` in any form.

2. **SessionStart hook is live** — `.claude/hooks/session-start.sh` exists, is executable, and is registered in `.claude/settings.json`. At the next `/clear` or fresh start, it fires and populates `$CLAUDE_TRANSCRIPT_PATH` + `$CLAUDE_CODE_SESSION_ID` (mirror of runtime value) + `$CLAUDE_HOOK_SOURCE` (one of `startup`/`resume`/`clear`/`compact`) in `$CLAUDE_ENV_FILE`.

3. **`transcriptPath` in `session.json`** — the field exists in the schema (`session.template.json` has `"transcriptPath": null`). The manager stamps it during Configuration Step 1 row 6 by reading `$CLAUDE_TRANSCRIPT_PATH` from env, tilde-substituting `$HOME`, and writing tilde-form into `session.json`. Consumers tilde-expand on read. CLI automation of this stamping is deferred.

4. **Two-gate health model** — Gate 1: verify `$CLAUDE_CODE_SESSION_ID` non-empty (runtime/install check). Gate 2: verify `$CLAUDE_TRANSCRIPT_PATH` non-empty AND its file exists (hook-fired check). Both gates emit user-visible warnings.

5. **Shell-safe serialization** — the hook writes `$CLAUDE_ENV_FILE` via `jq -r @sh` for stdin-JSON-sourced fields. Any future edit to the hook MUST preserve this safety property.

6. **`gobbi/SKILL.md:56` `CLAUDE_TRANSCRIPT_PATH` row is NOT renamed** — the var name on that row was correct and was explicitly preserved (FIX 2). Future edits to that row may only update the description column, not the var name.

7. **Manager stamp commit `00a11ae`** — this is the pattern for future sessions' Configuration Step 1 row 6 procedure. The manager reads `$CLAUDE_TRANSCRIPT_PATH` from env (populated by the hook) and stamps `transcriptPath` in tilde-form into `session.json`.

---

## Pointers to Key Artifacts

| Artifact | Path |
|---|---|
| Idea (iter3 PASS) | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md` |
| Preparation (iter2 PASS) | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/preparation/artifacts/preparation.md` |
| Plan (iter3 PASS) | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/planning/artifacts/plan.md` |
| Ideation eval (iter3 final) | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter3/` |
| Execution T1 eval | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/execution/T1/evaluation/iter1/` |
| Mistake: codex session-write path | `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md` |
| Mistake: manager rm -rf tracked | `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md` |
| Backlog: F-STRUCT-01 | `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` |
| Backlog: F-RISK-01 | `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` |
| Feature README | `.gobbi/projects/gobbi/features/env-var-audit/README.md` |
| Session journal | `.gobbi/projects/gobbi/notes/2026-05-22-env-var-audit-sessionstart-hook.md` |
| Staging inventory | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/wrap-up/rawdata/staging-inventory.md` |
| Promotion manifest | `sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/wrap-up/rawdata/promotion-manifest.md` |

---

## What the Next Session Inherits

1. **Canonical docs.** All skill files use `$CLAUDE_CODE_SESSION_ID` (runtime-set, v2.1.132+). `$CLAUDE_SESSION_ID` is gone. `gobbi/SKILL.md` reflects the live hook, two-gate health model, and runtime-set sub-section.

2. **Working SessionStart hook.** The hook fires at every session start (startup, resume, clear, compact) and writes `$CLAUDE_TRANSCRIPT_PATH`, `$CLAUDE_CODE_SESSION_ID`, `$CLAUDE_HOOK_SOURCE`, and the remaining hook-payload vars to `$CLAUDE_ENV_FILE`. The next session's bootstrap Gate 2 will find `$CLAUDE_TRANSCRIPT_PATH` populated.

3. **`session.json.transcriptPath` contract live.** Manager reads `$CLAUDE_TRANSCRIPT_PATH` from env at Configuration Step 1 row 6 and stamps tilde-form into `session.json.transcriptPath`. Memorization and downstream consumers read from `session.json.transcriptPath` (tilde-expand), falling back to `$CLAUDE_TRANSCRIPT_PATH` env directly if needed.

4. **Two new process mistakes in project memory.** Both are in the `process` domain and are relevant to future sessions that involve Codex evaluators or worktree cleanup. Load them at the start of any session that will spawn `codex:codex-rescue` or do `rm -rf` near a git worktree.

5. **Two open backlog items.** F-STRUCT-01 (Medium, env-passthrough quoting illustration) and F-RISK-01 (Medium, subagent CCSI path semantics). Neither blocks normal workflow. F-RISK-01 is cross-feature and warrants a dedicated Ideation session once the post-merge settle is confirmed.

6. **`00a11ae` is local.** After Wrap-up's final push, `develop` on origin will include the M1 stamp commit. The next session's `git pull --ff-only` on develop will pick it up.

---

## Promotion Summary

| Item | Source | Destination | Status |
|---|---|---|---|
| Backlog F-STRUCT-01 | `ideation/staging/backlogs/project/` | `.gobbi/projects/gobbi/backlogs/` | PROMOTED |
| Backlog F-RISK-01 | `ideation/staging/backlogs/project/` | `.gobbi/projects/gobbi/backlogs/` | PROMOTED |
| Mistake: codex-session-write-path | Wrap-up authored | `.gobbi/projects/gobbi/mistakes/` | PROMOTED |
| Mistake: manager-rm-rf | Wrap-up authored | `.gobbi/projects/gobbi/mistakes/` | PROMOTED |
| Ideation decisions | `ideation/staging/decisions/` | `features/env-var-audit/decisions/` | PROMOTED |
| Ideation discussion | `ideation/staging/discussions/` | `features/env-var-audit/discussions/` | PROMOTED |
| Ideation references | `ideation/staging/references/` | `features/env-var-audit/references/` | PROMOTED |
| Preparation decisions | `preparation/staging/decisions/` | `features/env-var-audit/decisions/` | PROMOTED |
| Planning decisions | `planning/staging/decisions/` | `features/env-var-audit/decisions/` | PROMOTED |
| T1 execution decisions | `execution/T1/staging/decisions/` | `features/env-var-audit/decisions/` | PROMOTED |
| Per-session journal | Wrap-up Step 6 direct write | `.gobbi/projects/gobbi/notes/` | WRITTEN |

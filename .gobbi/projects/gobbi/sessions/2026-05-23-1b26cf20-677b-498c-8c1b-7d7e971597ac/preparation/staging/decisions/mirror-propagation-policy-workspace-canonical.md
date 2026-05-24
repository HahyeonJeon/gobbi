---
date: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
status: superseded
feature: null
supersedes: null
superseded_by: mirror-propagation-policy-mirror-canonical-symlinks.md
---

# Workspace `.claude/skills/` is canonical; project mirror auto-syncs

## Context

The gobbi codebase carries two parallel skill trees:

- **Workspace tree** at `.claude/skills/` — the source the Claude Code session loader reads on `/clear` / SessionStart / compaction. 17+ top-level skills (`principles`, `mistake`, `orchestration`, `git`, `delegation`, `preparation`, etc.).
- **Project mirror** at `.gobbi/projects/gobbi/skills/` — appears to be a parallel directory tree of the same shape, populated with what look like copies (not symlinks — verified `ls -la` shows real directories with `drwxrwxr-x` permissions). 17 dirs matching the workspace shape.

Bundle B's T1 edits multiple workspace skill files (`orchestration/SKILL.md`, `git/SKILL.md`, `preparation/SKILL.md`, `gobbi/SKILL.md`, 5 workflow phase docs under `orchestration/workflow/`, `delegation/SKILL.md`). If both trees are equally authoritative, every T1 task brief would have to specify a 2-tree write — doubling the edit surface and the diff. The user surfaced this ambiguity in Sub-step D round 2 AskUserQuestion.

## Decision

**Workspace `.claude/skills/` is the canonical source-of-truth. The project mirror at `.gobbi/projects/gobbi/skills/` derives from it via an auto-sync mechanism.**

Executors editing skill files target the workspace path only. The mirror is downstream — never directly edited.

## Rationale

- The Claude Code session loader reads from `.claude/skills/`. That tree is what determines behavior at runtime; any other tree is observational.
- Maintaining two equal-priority trees doubles every edit, doubles every PR diff, and creates a constant drift risk. With workspace-canonical, drift becomes a one-direction sync problem (mechanical) rather than a two-direction reconciliation problem (judgmental).
- User chose this stance explicitly via AskUserQuestion (Sub-step D round 2): "Workspace canonical only — mirror auto-syncs."

## Alternatives considered

- **Mirror canonical, workspace derives.** Rejected: the Claude Code loader reads the workspace tree at runtime — making the mirror canonical would require a sync direction that contradicts the loader's read path.
- **Both trees equally authoritative; every edit touches both.** Rejected: doubles edit surface; user explicitly rejected; the historical reason for this stance is in `notes/2026-05-22-bac669ad` and the various mirror-related PR fixups (PR #260 / #261 sync corrections in May 2026 memory).
- **Symlink the mirror to the workspace tree.** Rejected for this decision (orthogonal): symlinking is one valid implementation of the "mirror auto-syncs" decision but the choice of implementation (symlinks vs rsync vs cp script vs git hook vs `gobbi sync` CLI) is downstream of this policy lock. See the conditional backlog at `staging/backlogs/project/workspace-to-mirror-sync-mechanism.md` for the implementation work.

## Consequences

- **Every Bundle B executor task brief targeting `.claude/skills/*` is single-tree.** Brief text cites the workspace path only; the mirror is treated as derived.
- **`backlogs/project/workspace-to-mirror-sync-mechanism.md` becomes load-bearing.** No auto-sync mechanism currently exists (verified empirically — no `.claude/scripts/` dir, no `sync`/`mirror` script, no sync-triggering hook in `.claude/settings.json`). Until the mechanism ships, executors must either (a) manually mirror-edit when touching files in both trees, OR (b) flag mirror drift as a known risk in Execution. The conditional backlog captures the gap.
- **Planning verification gates apply to the workspace path only.** Smoke tests, grep verifications, etc., that check "T1 surfaces edited" target `.claude/skills/...`, not `.gobbi/projects/gobbi/skills/...`.
- **Memory Access Matrix in skills documentation needs an eventual clarification** — multiple skills' Memory Access Matrix sections currently treat both trees as project memory. A future cleanup pass should distinguish "workspace skills (canonical)" from "project mirror (derived)". Not in Bundle B scope; capture as informal follow-up.

## Related

- AskUserQuestion exchange: Preparation iter1 Sub-step D round 2 (mirror propagation policy card). User picked "Workspace canonical only — mirror auto-syncs."
- Conditional backlog (sync mechanism implementation): `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/staging/backlogs/project/workspace-to-mirror-sync-mechanism.md`
- Sub-step A → D findings § Notes for Planning intake "Mirror awareness": `rawdata/sub-steps-a-d-iter1.md`
- Prior mirror-related context in user-memory: `project_pr257_adversarial_review_complete.md` (PR #260 + #261 v0.5 plugin/runtime mirror sync), `project_v050_pr_fin_2a_ii_shipped.md` (corrections about `gobbi.db` mirror).

---

## Supersession reason

**Superseded 2026-05-24 by `mirror-propagation-policy-mirror-canonical-symlinks.md` (iter2 corrected lock).**

The empirical evidence cited above was **incomplete**. The original iter1 scan claimed `.gobbi/projects/gobbi/skills/` was "17 real directories, NOT symlinks." That observation was true at the directory level — but missed the **file-level symlink layer**.

Iter2 re-verification (Claude evaluator independent finding + leader empirical confirmation via `find .claude/skills/ -type l -name "*.md" | wc -l`):

- **53 file-level `.md` symlinks** exist under `.claude/skills/`, each pointing INTO `.gobbi/projects/gobbi/skills/`.
- Example: `.claude/skills/orchestration/SKILL.md` is a symlink whose target is `../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (resolves to the same physical file).
- The **mirror IS the canonical store** (real files live at `.gobbi/projects/gobbi/skills/`).
- The **workspace `.claude/skills/` is the symlink runtime layer** — Claude Code's loader expects skills at this path, and the symlinks let it find them while the real files live in the project mirror.
- **No sync problem exists.** Editing either path edits the same physical file. The "drift" the iter1 lock was solving for is impossible by construction.

The user re-locked the policy on this corrected evidence via round-2 AskUserQuestion: **"mirror canonical, workspace = symlink runtime layer; no sync needed."** See the superseding decision file for the corrected lock content.

The original decision body is preserved verbatim above for audit (per `mistake/SKILL.md` supersede-never-delete discipline).

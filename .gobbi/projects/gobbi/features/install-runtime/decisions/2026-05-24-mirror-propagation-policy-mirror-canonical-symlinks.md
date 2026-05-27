---
name: mirror-propagation-policy-mirror-canonical-symlinks
description: Mirror at .gobbi/projects/gobbi/skills/ is canonical; workspace .claude/skills/ is the symlink runtime layer — 53 file-level symlinks confirmed; no sync mechanism needed.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-05-24
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-policy, symlinks, skills]
supersedes: 2026-05-24-mirror-propagation-policy-workspace-canonical.md
superseded_by: null
---

# Mirror at `.gobbi/projects/gobbi/skills/` is canonical; workspace `.claude/skills/` is the symlink runtime layer

## Context

In the first Preparation iteration, the user locked a mirror-propagation policy on the premise that two parallel skill trees existed — `.claude/skills/` (workspace) and `.gobbi/projects/gobbi/skills/` (project mirror) — and that "no auto-sync mechanism" was in place between them. That first-iteration lock chose workspace as canonical, mirror as derived, and staged a conditional backlog for a future sync mechanism.

Both first-iteration evaluators (Claude + Codex) flagged the empirical premise as incomplete. Independent re-verification confirmed the first-iteration scan stopped at directory-level inspection and missed the **file-level symlink layer**.

**Empirical evidence (leader independently verified):**

```
$ find .claude/skills/ -type l -name "*.md" | wc -l
53

$ ls -la .claude/skills/orchestration/SKILL.md
lrwxrwxrwx 1 jeonhh0061 jeonhh0061 60 May 20 16:25 \
  .claude/skills/orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```

53 file-level `.md` symlinks under `.claude/skills/` point INTO `.gobbi/projects/gobbi/skills/`. The mirror is the storage; the workspace tree is a symlink layer Claude Code's loader can read from. Editing either path edits the **same physical file**.

The user re-locked the policy via round-2 AskUserQuestion on this corrected evidence.

## Decision

**The project mirror at `.gobbi/projects/gobbi/skills/` is the canonical source-of-truth (the real files live there). The workspace tree at `.claude/skills/` is the symlink runtime layer — Claude Code's loader expects skills at this path, and the symlinks resolve to the canonical files in the mirror.**

Planning briefs may cite **either** path because both paths resolve to the same physical file via the symlinks. The recommended convention is to **cite the workspace `.claude/skills/...` path** in briefs because it matches the runtime-loadability discoverability path (the loader's read path) and most existing documentation references that form. The symlink transparently resolves to the canonical file.

**No sync mechanism is needed.** The symlink layer IS the sync mechanism.

## Rationale

- The empirical reality is that 53 file-level symlinks already wire the two trees to the same physical files. Any policy that talks about "drift" between them is moot — drift is impossible by construction.
- The user's reasoning (round-2 AskUserQuestion lock): mirror canonical aligns with the actual on-disk shape (real files in the project mirror); workspace symlinks give the Claude Code loader the discovery path it expects without duplicating storage.
- A "sync mechanism" backlog would create work to solve a problem that does not exist. Closing it as moot keeps the project memory honest.
- Planning briefs that cite either path are correct; preferring `.claude/skills/...` matches the most-discoverable convention and aligns with the loader's read path.

## Alternatives considered

- **Workspace canonical, mirror derives via auto-sync (first-iteration lock).** Rejected on corrected evidence: the first-iteration scan missed the file-level symlinks. There is no two-tree storage to sync; the symlinks already make the two paths the same file. See `2026-05-24-mirror-propagation-policy-workspace-canonical.md` (now `status: superseded`).
- **Mass migration — replace symlinks with real-file workspace mirror.** Rejected by the user out-of-scope for this Bundle. Symlinks work; changing storage shape for no functional gain violates Principle 10 (witness-bound work).
- **Both trees equally authoritative, every edit touches both.** Rejected: not even applicable — both paths ARE the same file; "touching both" is a no-op.

## Consequences

- **Planning task briefs editing skill files can cite either `.claude/skills/...` or `.gobbi/projects/gobbi/skills/...`** — both paths resolve to the same physical file. Recommended convention: cite the workspace path for runtime-loadability discoverability.
- **No mirror-edit requirement.** A single `Edit` against either path updates the canonical file; no second write is needed. The first-iteration lock's "manual mirror-edit recommended for Bundle B" interim discipline is **rescinded** as unnecessary.
- **The `workspace-to-mirror-sync-mechanism.md` backlog is closed as moot** (no separate sync mechanism is needed; the symlink layer is the sync mechanism). See that file's supersession reason.
- **Verification gates that grep for skill-file content edited in Bundle B can target either path with identical results.** Tests should pick one (recommended: workspace path) for consistency, but matching against the other tree gives the same hits because the underlying file is the same.
- **Memory Access Matrix in skills documentation needs an eventual clarification** — multiple skills' Memory Access Matrix sections treat both `.claude/skills/` and `.gobbi/projects/gobbi/skills/` as project memory. Under the corrected understanding, the workspace tree is "loader-discovery symlinks pointing into the canonical project-mirror storage." A future cleanup pass should make this explicit. Not in Bundle B scope; carry as informal follow-up (see "Out of scope gaps" in the Preparation rawdata draft).
- **Design file references** to "executors must manually mirror-edit OR flag mirror drift" are stale under this corrected lock; they remain in place as historical record but are functionally moot. The relevant design file has been updated to reference this corrected lock.

## Symlink-preservation edit contract

The "editing either path edits the same physical file" claim above is true **only for edit methods that follow the symlink and write through it**. Some common write tools instead **replace the symlink with a regular file by renaming**, which silently breaks the canonical mirror link: the workspace path becomes a divergent regular file holding the new content, while the canonical mirror target keeps the old content. This contract names the safe edit methods, the unsafe ones, and the post-edit verification gate Bundle B's T1 + T3 task briefs MUST cite.

**Empirical witness (this leader, 2026-05-24):**

- `git ls-files -s .claude/skills/orchestration/SKILL.md .gobbi/projects/gobbi/skills/orchestration/SKILL.md` → `120000 ... .claude/skills/orchestration/SKILL.md` (tracked as symlink) vs `100644 ... .gobbi/projects/gobbi/skills/orchestration/SKILL.md` (tracked as regular file).
- Temporary reproduction (`/tmp/gobbi-edit-test/sub/link.md -> ../canonical/file.md`, content `alpha`): after `sed -i 's/alpha/beta/' link.md`, `link.md` becomes a regular file (`-rw-rw-r--`) containing `beta`, while `../canonical/file.md` is unchanged (still `alpha`). The symlink was destroyed and the canonical target was bypassed.

**Edit-method safety table:**

| Edit method | Inode-preserving? | Safe via workspace symlink path (`.claude/skills/...`)? |
|---|---|---|
| Claude Code `Edit` tool | YES (follows symlink, in-place write) | YES |
| Claude Code `Write` tool (overwrite existing file) | YES (follows symlink, in-place write) | YES |
| `vim` / `nvim` default mode | YES (in-place) | YES |
| `nano` | YES (in-place) | YES |
| `git apply` against an unchanged-path patch | typically YES (writes through the path) | typically YES |
| `sed -i` (GNU) | NO (rewrite-by-rename) | NO — replaces the symlink with a regular file; canonical mirror untouched |
| `perl -i` | NO (rewrite-by-rename) | NO — same failure mode as `sed -i` |
| `awk` + redirect-rewrite patterns | NO (rewrite-by-rename) | NO |
| Most code formatters in "backup + rename" mode | NO | NO |
| Shell `> file` redirect on the symlink path | depends — typically rewrites in place (preserves symlink) but tool-dependent | verify per case |

The asymmetry: tools that open the path, write, and close (inode-preserving) traverse the symlink to the canonical mirror. Tools that write to a temp file and rename it over the original (rewrite-by-rename) replace the symlink itself.

**Discipline for T1 + T3 executors (and any future task editing skill files):**

1. **Prefer the Claude Code `Edit` tool** for all skill / `settings.json` / hook-script edits made via this agent. `Edit` preserves the inode and traverses the symlink to update the canonical mirror file.
2. **If a bulk rewrite is genuinely needed** (e.g., a regex sweep across many skill files), edit via the **canonical mirror path** (`.gobbi/projects/gobbi/skills/...`) directly. Never run `sed -i` or `perl -i` against workspace `.claude/skills/...` paths.
3. **Post-edit verification gate.** After any non-Edit-tool modification touching a workspace path, run `test -L .claude/skills/<path>` and confirm exit code 0 (path is still a symlink). If the symlink was replaced by a regular file, restore it: `rm .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`, then re-apply the intended edit through the Edit tool or against the canonical mirror path. The exact `../../../` prefix depends on the file's depth — verify against an adjacent untouched symlink with `ls -la`.
4. **CI / pre-commit hook (deferred backlog).** A repository-level guard that fails if any tracked workspace symlink (`120000` in `git ls-files -s`) has been converted to a regular file (`100644`) is the right durable defense. See [`../../../backlogs/ci-symlink-integrity-check.md`](../../../backlogs/ci-symlink-integrity-check.md) for the deferred follow-up.

**Empirical re-verifiable witness for Planning briefs:**

```
$ find /playinganalytics/git/gobbi/.claude/skills/ -type l -name "*.md" | wc -l
53

$ git ls-files -s .claude/skills/orchestration/SKILL.md
120000 da56cb9e787329d8180eb8b200e5c578eb05e092 0 .claude/skills/orchestration/SKILL.md

$ git ls-files -s .gobbi/projects/gobbi/skills/orchestration/SKILL.md
100644 6582e9eae3dff27e2373f3f87e9c26b8d326926f 0 .gobbi/projects/gobbi/skills/orchestration/SKILL.md
```

53 tracked workspace symlinks point into the canonical mirror; any one of them silently flipping from `120000` to `100644` is a defect.

## Empirical reference

- Symlink count: `find /playinganalytics/git/gobbi/.claude/skills/ -type l -name "*.md" | wc -l` → **53** (run 2026-05-24, this leader).
- Sample symlink target: `ls -la /playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md` → `lrwxrwxrwx ... orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (relative path; resolves to the canonical file in the project mirror).
- Workflow dir contents: `ls /playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/` → `evaluation.md  execution.md  ideation.md  memorization.md  planning.md  preparation.md  wrap-up.md` (7 files, confirming the workflow-phase doc set is 7, not 5).
- An independent Claude evaluator finding cited the same symlink topology in the first-iteration evaluation.

## Related

- AskUserQuestion exchange: Preparation loop second-iteration mirror policy re-lock. User picked: **"mirror canonical, workspace = symlink runtime layer; no sync needed."**
- Superseded decision: `decisions/2026-05-24-mirror-propagation-policy-workspace-canonical.md` (status: superseded).
- Closed-as-moot backlog: workspace-to-mirror sync mechanism (status: superseded — moot; the symlink layer IS the sync mechanism).
- Preparation loop evaluation findings (first iteration Claude + Codex both flagged the symlink topology that the first-iteration lock missed).
- Mistake invoked: `leader-iter2-verification-claim-without-evidence.md` (the first-iteration leader's empirical claim "no sync mechanism exists" was directionally true at the file-storage level but missed the symlink layer; this corrected decision uses `find -type l` empirically to anchor the lock).

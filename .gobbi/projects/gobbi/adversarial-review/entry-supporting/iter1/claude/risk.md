# Risk Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Locked Frame (Stage 1)

Risk-lens for these three skills: **What happens when they are wrong, missing, or misread?** Blast radius for the entry/floor/git skills is large — they're loaded at every session start. Mistakes propagate to every subsequent action.

Seed scenarios (from ideation/evaluation.md Risk):

1. **Rollback path identified** — adapted: if a Batch-4 edit is wrong, the rollback is git revert (skills are pure docs).
2. **Blast radius bounded** — adapted: which downstream consumers see drift if these skills are wrong?
3. **Security surface** — git/SKILL.md and conventions.md are the primary surface for command-injection risk in agent-prescribed shell ops.
4. **Irreversible steps** — Forbidden Operations enumerate. Are there missing destructive ops?
5. **Two-week smell test** — would a contributor in 2 weeks be glad of these skills, or paying debt?
6. **(adversarial)** — Scope drift: do these three skills mention/govern files outside their stated scope?
7. **Concurrency** — Worktree isolation invariant — is the safety story complete?
8. **Privacy / data retention** — N/A for doc-only artifacts.
9. **License / IP** — N/A.
10. **Cost / budget** — Token cost discussed in Performance; no runaway scenarios.

Adversarial scenario: present (scenario 6).

Coverage matrix — Risk owns Privacy + Licensing + Cost (with Consistency / Performance overlap). All N/A or covered elsewhere.

## Per-scenario per-check results

**Scenario 1 — Rollback:** Doc-only artifacts; rollback is `git revert` or PR revert. **PASS.**

**Scenario 2 — Blast radius:** These three skills are loaded at every session start. A wrong rule in `principles` (e.g., a misworded Iron Law) propagates to every subagent. A wrong regex in `conventions.md` blocks every commit. Blast radius is **session-wide**.
- This is acknowledged implicitly via the Always-Ask Decision Classification for skill edits (gobbi/SKILL.md line 160+).
- **PASS** but with explicit risk-tier acknowledgement noted in R-R-01 below.

**Scenario 3 — Security surface (command injection):** 
- git/SKILL.md prescribes shell ops: `gh --version`, `git remote get-url origin`, `git worktree add -b ...`, `find ... -delete`, `gh pr merge ... --squash --delete-branch`.
- conventions.md does not prescribe shell ops.
- One risky pattern: `find .gobbi/projects/<name>/worktrees/ -type d -empty -delete` (P5 step 5, line 199). If `<name>` contains shell metacharacters (spaces, semicolons, backticks), this could execute injected commands. Project names are user-supplied at setup.
- See R-R-02 below.

**Scenario 4 — Irreversible steps / missing Forbidden Ops:** Spot-checked against the standard destructive git commands:
- `git push --force` ✓ listed
- `git reset --hard` ✓ listed
- `git checkout .` / `git restore .` ✓ listed
- `git commit --amend` after push ✓ listed
- `git rebase -i` on pushed history ✓ listed
- `git branch -D` on unmerged branches ✓ listed
- `git stash` inside worktree ✓ listed (caveat in U-U-02)
- `gh pr close` without merge ✓ listed
- `gh issue delete` ✓ listed
- Subagent push/PR/issue ops ✓ listed
- **Missing**: `git filter-branch`, `git filter-repo`, `git push --mirror`, `git update-ref` (direct ref manipulation), `git reflog expire --expire=now --all` — see R-R-03 below.

**Scenario 5 — Two-week smell test:** Yes — these skills are clean enough that a returning contributor would not feel debt. Modulo the deferred "Red Flags table" in principles (A-A-01) which is a self-acknowledged future improvement.

**Scenario 6 (adversarial) — Scope drift:** Examined:
- gobbi/SKILL.md mentions `.claude/CLAUDE.md`, agents/, plugin mirrors, specs JSON — but as cross-references and context, not as files this skill governs. **PASS.**
- principles/SKILL.md does not reference out-of-scope files. **PASS.**
- git/SKILL.md governs `.gobbi/projects/<name>/worktrees/` paths but not the broader project memory tree. Boundary clean. **PASS.**

**Scenario 7 — Concurrency:** git/SKILL.md § Worktree Path Formula + § Branch exclusivity (conventions.md line 290+) handle the standard concurrency case (two sessions, one repo). **PASS** modulo issue #258 (drift detector deferred).

## Typed findings

### R-R-01 — Skills loaded at session start have session-wide blast radius but lack a "this is high-leverage" risk tag

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md, principles/SKILL.md, and git/SKILL.md are all loaded at session start (per gobbi/SKILL.md line 22+). A wrong rule here propagates to every subagent and every loop. Edits are gated by Always-Ask (good). But no frontmatter tag or banner indicates "this skill has session-wide blast radius" — for a future contributor scanning, that signal would prevent casual edits.
- **Remediation**: Add a one-line note in frontmatter or first paragraph of each of the three skills: "Edits to this skill affect every session — Always-Ask category per discussion/SKILL.md § Decision Classification." gobbi/SKILL.md line 162 already states this principle; surfacing it in each of the three skills' own header (not just gobbi/SKILL.md's discussion of skill edits) would be a small win.

### R-R-02 — Project name interpolation into shell commands is not sanitized

- **Type**: assumption_risk
- **Domain**: security
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: git/SKILL.md procedure P5 step 5: `find .gobbi/projects/<name>/worktrees/ -type d -empty -delete`. P1 step 5: `git check-ignore -q .gobbi/projects/<name>/worktrees/`. Throughout the skill, `<name>` is substituted into shell paths. If a project name contains spaces, quotes, semicolons, `$()`, backticks, or shell metacharacters, command injection or path-expansion bugs result.

  Cross-reference: per `.gobbi/projects/gobbi/gotchas/...` referenced in git status, gobbi has a "validate project name at settings-io seam" commit (PR #245, 9b48982). So validation happens at the seam — but the git/SKILL.md skill does not cite this validation as a precondition. A reader implementing a different runtime might miss that the validation is upstream.
- **Remediation**: Add a one-line note in git/SKILL.md § Output paths or § Path conventions: "Project name `<name>` is validated at the settings-IO seam to disallow shell metacharacters — commands here assume the validated form."

### R-R-03 — Forbidden Operations table omits several destructive git ops

- **Type**: scenario_gap
- **Domain**: security
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: The Forbidden Operations table (git/SKILL.md line 110+) covers common destructive patterns. Missing entries:
  - `git filter-branch` / `git filter-repo` — rewrites entire history; can destroy commits across the project.
  - `git push --mirror` — overwrites remote refs en masse.
  - `git update-ref` with arbitrary ref — direct ref manipulation, can leave the repo in an inconsistent state.
  - `git reflog expire --expire=now --all` — removes the safety net for recovery.
  - `gh repo delete` — deletes the entire GitHub repository.
  - `rm -rf .git/` — local repo destruction.

  These are low-probability in agent workflows (agents rarely reach for them), but the table aspires to be exhaustive. Their absence is a coverage gap. Severity is Low because the surface area is small (agents don't typically use these), but if an agent ever did reach for one, the table would not catch it.
- **Remediation**: Either (a) add the missing rows for completeness, or (b) add a catch-all row: "Any command that rewrites history globally (`filter-branch`, `filter-repo`, `update-ref` on arbitrary refs, `reflog expire --all`) or destroys repository state (`gh repo delete`, `rm -rf .git/`) requires explicit user request."

### R-R-04 — Branch exclusivity recovery via P6 assumes the orphan is in a recoverable state

- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: conventions.md line 290+ "Branch exclusivity": "If branch creation fails during worktree setup, the branch may already be active in another worktree from a concurrent or crashed session — recover via Procedure P6." P6 (git/SKILL.md line 203+) assumes the orphaned worktree is at a known path with inspectable commits. If the orphan's worktree path was force-removed without `git worktree prune`, the branch ref still exists in `.git/worktrees/` metadata but the working directory is gone. P6 doesn't address this state.
- **Remediation**: Add a P6 sub-step: "If `git worktree list` shows the worktree but the directory is missing on disk, run `git worktree prune` to clean the stale metadata before re-creating."

## Low-confidence appendix

- **L-R-01 (confidence 25)**: gobbi/SKILL.md "If `$CLAUDE_SESSION_ID` is absent" (line 48) — workflow halts and asks the user. But there is no fallback: a session that *cannot* get a session ID is stuck. For a user without the SessionStart hook (e.g., custom Claude Code config), the workflow is completely blocked. Could be a real risk but probably handled by setup docs (out of scope). Possibly false-positive (pre-existing).

## Verdict

**PASS** — All findings Medium or Low; none Critical, none High. Risk surface is mostly covered; R-R-02 (project name sanitization) is the most worth surfacing. Issue #258 (drift detector) noted as deferred per the existing line in git/SKILL.md.

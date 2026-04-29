Gotchas tied to orchestrator ↔ subagent delegation — briefing accuracy, parallel-executor mechanics, and verification completeness. Read when authoring a delegation brief or when reviewing a multi-executor wave.

---

## Briefing references non-existent production code path — grep before accepting literal syntax

**Priority:** High

**What happened:** PR #103 V.1 briefing directed the executor to read `process.env.CLAUDE_CODE_VERSION` "when constructing the `delegation.spawn` data in `capture-subagent.ts`". The executor's study phase revealed that `capture-subagent.ts` constructs only `delegation.complete` / `delegation.fail` events — no production code in `packages/cli/src/` constructs `delegation.spawn`. The schema factory is used solely by test fixtures and the reducer handles spawns when they arrive from an emitter that does not yet exist. The executor had to interpret the briefing as schema-only + future-proofing tests, and the gap became PR-blocker-level discovery only at evaluation time (resulting in follow-up #102).

**User feedback:** Self-caught by V.1 executor 2026-04-20; orchestrator re-verified and confirmed no emitter exists (guard hook does not emit spawn; `SubagentStop` → `capture-subagent` emits complete/fail only).

**Correct approach:** Before writing a briefing that names a specific line or function as the edit site, run `rg -n '<symbol>' packages/ -g '!**/__tests__/**' -g '!*.test.ts'` to verify the symbol exists in production code at the claimed location. Non-test call sites are what will execute at runtime; briefings should cite them, not test-fixture occurrences. If a symbol exists only in test code, the briefing must either expand scope to add the emitter, scope down to schema-only with explicit acknowledgment, or file the missing piece as a prerequisite issue before execution.

---

## Parallel executor lint/tooling re-applies on file save — verify staged vs unstaged split, do NOT use stash

**Priority:** Medium

**What happened:** PR #103 wave had 3 parallel executors in a shared worktree. V.2 (editing `specs/errors.ts`) and V.3 (retyping `specs/errors.ts` as part of the `EventStore` → `ReadStore` cascade) hit transient apparent-reverts of each other's edits. The underlying cause: a peer executor's active tooling re-applied type narrowing as an unstaged diff on top of a freshly staged file; `git status` briefly showed one executor's edit as "staged by a peer." Resolution was to stage own changes by explicit file-path-list and let the peer commit land first, not to `git stash` a "conflict" or run a broad `git checkout HEAD -- <file>`.

**User feedback:** Self-caught by V.3 executor 2026-04-20; scope separation held because the type-narrowing rename was entirely in V.3's unstaged diff while V.2's diagnostic rewrite stayed within its function body. No data loss.

**Correct approach:** In a shared worktree with parallel executors, verify staged/unstaged separation with two greps rather than assuming: `git diff --staged <file> | head` and `git diff <file> | head`. If the unstaged portion is entirely peer-scope, commit your staged portion verbatim — the peer will pick up their own unstaged work. Never `git stash` to "clean up" a perceived conflict; stash is shared across the repo and pops back into peer worktrees (see sibling gotcha on stash-across-worktrees). Never `git checkout HEAD -- <file>` to reset a working-tree state that a peer is actively editing.

---

## Peer executor's commit between `git add` and `git commit` can drop a staged hunk silently

**Priority:** High

**What happened:** W1.4 gobbi-memory Pass-2 executor staged two files (`.gitignore` + `test/gitignore.test.sh`) with `git add <file1> <file2>`, ran `git diff --staged --stat` (showed both), then ran `git commit`. Between the stage and the commit a peer executor (W1.1, separate process) landed its own commit `f2e2ee6` in the same worktree. The executor's own commit landed successfully but only included `test/gitignore.test.sh`; the staged `.gitignore` hunk was silently dropped — `git show --stat HEAD` showed "1 file changed" instead of the expected 2. `git diff HEAD -- .gitignore` still showed the full intended diff as unstaged, so no data was lost. Re-staging and committing `.gitignore` alone on a follow-up commit resolved it.

**User feedback:** Self-caught by the W1.4 executor 2026-04-24 when verifying the commit `git show --stat HEAD` output.

**Correct approach:** Shared-worktree parallel executors: after `git add`, always confirm the commit actually included what you staged with `git show --stat HEAD` (or `git log -1 --stat`) before reporting done. If the commit dropped a file, `git diff HEAD -- <file>` tells you whether the intended change is still on disk; if it is, re-stage and commit it as a follow-up. Do NOT amend — amend is only safe when you're certain no peer commit has landed in between, and that certainty is rare in a shared worktree. Two-commit fix is cheaper than figuring out what the peer did. The root cause is git's index being updated concurrently: `git commit` invoked after a peer commit walks the updated index, and a staged hunk that was written against the older tree can be dropped if the peer touched files in the same commit or if the index was refreshed. Treat every `git commit` in a shared worktree as "may commit a subset of what I staged" — verify the post-commit stat, never the pre-commit `--staged` output alone.

---

## Partial-rewrite pattern — grep for concrete identifiers, not just the renamed phrase

**Priority:** Medium

**What happened:** PR #104's D.2 sub-task rewrote `_research/SKILL.md` at the description-and-intro level for 5-step framing but left the body untouched. The "What Research Produces" table still pointed at `research/innovative.md`, `research/best.md`, `research/research.md`, `research/results/`, `research/subtasks/` while the sibling `_delegation/SKILL.md` was updated to direct orchestrators to `ideation/`. The orchestrator's own verification command (`rg "(?i)7[- ]?step|seven[- ]?step" .claude/skills/`) returned zero hits — success by that check — but missed the residual path divergence because paths use identifier names, not step-count phrases. All three post-execution evaluators independently caught the mismatch as a Critical / High finding.

**User feedback:** Flagged as convergent Critical/High by Skills, Project, and Overall evaluators 2026-04-20. Orchestrator accepted REVISE and spawned a second remediation executor (`e1b22bb`, `c40607e`) to align `_research` body + `_gobbi-rule` path.

**Correct approach:** When renaming a shared concept across multiple docs (path convention, step name, component name), the verification grep must target **specific identifier names** the concept maps to — not the conceptual phrase being renamed. For path-convention renames, grep for the old path segment (`research/`) against every file in scope, not just the phrase describing the structure. For API renames, grep for the old symbol. The briefing should include the specific greps as part of its verification checklist so executors can run them before reporting done. When a rewrite touches a skill's description but leaves the body referencing old identifiers, the skill is in a worse state than pre-rewrite: its stated contract contradicts its operational content, and downstream agents get conflicting instructions.

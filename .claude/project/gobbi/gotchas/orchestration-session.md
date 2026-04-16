# Orchestration Session Gotchas

Learnings from running multi-wave parallel-subagent workflows where the orchestrator coordinates many specialists.

---

## `gobbi note collect` fails with "CLAUDE_SESSION_ID is not set" in orchestrator shell

**Priority:** Medium

**What happened:** During PR A execution (v0.5.0 Phase 2, session `0f8427c1-...`), `gobbi note collect <agent-id> ...` failed with `Error: CLAUDE_SESSION_ID is not set.` even though the note directory was created by the same session. Investigation: the env vars `CLAUDE_SESSION_ID`, `CLAUDE_PROJECT_DIR`, and `CLAUDE_TRANSCRIPT_PATH` are set by the SessionStart hook for Claude Code processes but are NOT inherited into the orchestrator's ad-hoc Bash shells invoked via the Bash tool. Sequential `Bash` invocations also do not share shell state.

**User feedback:** Flagged during execution; worked around by inline `export` before every `gobbi note collect` call. User approved proceeding without debugging the hook since it wasn't blocking PR A.

**Correct approach:**
1. Derive the current session ID from the most recent JSONL under `/home/$USER/.claude/projects/<project-slug>/`: `ls -t .../<project-slug>/*.jsonl | head -1 | xargs basename | sed 's/.jsonl//'`.
2. Export all three vars inline on every `gobbi note collect` call: `CLAUDE_SESSION_ID=<id> CLAUDE_PROJECT_DIR=<dir> CLAUDE_TRANSCRIPT_PATH=<path> gobbi note collect ...`.
3. The SessionStart hook populates these for Claude Code's main process; it does not propagate to child shells. This is a Claude Code limitation, not a gobbi bug. Until the hook is adjusted to export into a sourced shell file, inline export is the workaround.
4. Do NOT set these in `~/.zshrc` / `~/.bashrc` — they are session-scoped; stale values will poison new sessions.

---

## Parallel evaluators can complete silently when the response channel is rate-limited

**Priority:** Medium

**What happened:** During PR A consolidated evaluation, 4 `_project-evaluator` agents were spawned in parallel (Project, Architecture, Overall, Security perspectives). The Architecture and Security evaluators returned complete structured reports. The Project and Overall evaluators returned `You've hit your limit · resets 2pm (UTC)` with zero tokens accounted. Initial assumption: those two evaluators never ran. Actual state: both wrote their full findings files to `execution/evaluation/{project,overall}.md` on disk (238 + 262 lines each, complete with verdicts) BEFORE the rate limit triggered — the rate limit interrupted only the agent-to-orchestrator return-message, not the agent's file writes. Discovery: verified by `ls execution/evaluation/ && wc -l *.md` which showed all 4 files populated.

**User feedback:** Would have unnecessarily waited ~2 hours for the rate reset to retry evaluators whose work was already complete.

**Correct approach:**
1. When a subagent reports a rate-limit error (`You've hit your limit · resets ...`), ALWAYS check the expected output files on disk before treating the work as lost. Subagents may write deliverables to filesystem paths specified in their brief before returning — the rate limit interrupts only the final assistant-response token stream.
2. The subtask JSON (via `gobbi note collect`) may still be extractable from the parent transcript even if the agent's response was truncated. Try `gobbi note collect <agent-id>` before concluding the subagent produced nothing.
3. When briefing subagents that produce a file-based deliverable, require them to write the file BEFORE the final response summary. The file is the durable artifact; the return message is a courtesy.
4. For orchestration discipline: after every parallel wave, list expected artifact paths and `ls` them before treating the wave as "needs retry."

---

## Filter-branch is the safe redaction tool for unpushed feature branches with leaked secrets

**Priority:** Low (situational)

**What happened:** During PR A post-evaluation remediation, the Security evaluator found that `reference/plugin-hook-registration-v050.md` contained `/home/<user>/...` absolute paths and a live debug-session UUID `2a705f8d-...`. The file was authored by subagent A.2 (empirical spike) and committed ~10 commits deep in an unpushed 13-commit feature-branch stack. Force-push rewriting was the wrong tool (nothing was upstream yet); amending the A.2 commit would require interactive rebase (blocked by tooling); a fresh cleanup commit would leave the leak permanently visible in git log.

**User feedback:** Approved the history-rewrite approach; branch was unpushed so the risk was local-only.

**Correct approach:**
1. When a secret leak is discovered in an UNPUSHED feature branch: `git filter-branch --tree-filter '<sed commands>' <parent-of-bad-commit>..HEAD` rewrites the range cleanly. Add `FILTER_BRANCH_SQUELCH_WARNING=1` to suppress the deprecation nag. Create a backup branch (`git branch backup-pre-redact <branch>`) before running. Clean up `.git/refs/original/` afterward.
2. When a secret leak is discovered in a PUSHED branch: ask the user first — rewriting published history needs explicit authorization. If approved, use `git filter-repo` (modern replacement for filter-branch) and coordinate force-push + notification to any collaborator who may have the old refs.
3. Always verify the redaction worked: `grep -E "<sensitive-pattern>" <file>` must return empty. Also re-run typecheck + tests because filter-branch changes every SHA in the range (Bun's test file cache may need a clean rebuild).
4. For reference docs that empirically reference the author's local system (binary paths, log paths, debug UUIDs): make it a subagent checklist item to replace local-specific paths with `$HOME`/`~`/`<session-uuid>` placeholders BEFORE committing. Preventing the leak is cheaper than scrubbing it.

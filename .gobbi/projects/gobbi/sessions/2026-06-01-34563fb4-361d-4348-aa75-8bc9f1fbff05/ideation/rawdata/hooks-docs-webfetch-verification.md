# Hooks docs WebFetch re-verification — findings

**Phase:** research (iteration 1)
**Date:** 2026-06-01
**Source page:** https://code.claude.com/docs/en/hooks
**Method:** two independent WebFetch passes + one corroborating WebSearch (allowed domains: code.claude.com / docs.claude.com / docs.anthropic.com)
**Closes (evidence for):** `posttooluse-failure-webfetch-verification-gap` + `hook-event-count-31-vs-29-docs-sync`

---

## Headline finding — the count is now 30, NOT 29 (and not 31)

The live lifecycle table on `https://code.claude.com/docs/en/hooks` enumerates **30 distinct hook events** as of 2026-06-01.

- The reference file claims **31** (`claude-code-posttooluse-hook-schema.md` lines 40, 56, 88).
- The two backlog/checklist items assume the correction target is **29**.
- **Both are now stale.** The authoritative live count is **30**. The page has changed since the 2026-05-23 capture: it gained one new event, **`MessageDisplay`** (lifecycle row 12: "While assistant message text is displayed"). All 29 previously-captured names are still present in the same relative order; `MessageDisplay` is the single net addition.

**Action for the manager:** the docs-sync target must be **30**, not 29. The backlog/checklist that say "correct 31 → 29" are themselves out of date and should be corrected to "31 → 30" before the Execution slice edits the reference. This is a material change to the tracked task's premise and should be surfaced to the user before editing.

### Count-verification discipline note
The first WebFetch summarizer returned a self-contradicting count ("31 distinct" / then "Actual count: 30 unique" with a confused MessageDisplay duplicate-listing). This is exactly the partial-view / summarizer-confusion failure mode recorded in `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`. The second WebFetch forced a row-by-row, no-dedup transcription of the single lifecycle table and returned a clean **TOTAL ROWS: 30**. The 30 figure is the transcribed-row count of the one authoritative lifecycle table, not a summarizer's arithmetic.

---

## Full event enumeration (live lifecycle table, verbatim, in order)

| # | Event | When it fires (verbatim) |
|---|-------|--------------------------|
| 1 | SessionStart | When a session begins or resumes |
| 2 | Setup | When you start Claude Code with `--init-only`, or with `--init` or `--maintenance` in `-p` mode. For one-time preparation in CI or scripts |
| 3 | UserPromptSubmit | When you submit a prompt, before Claude processes it |
| 4 | UserPromptExpansion | When a user-typed command expands into a prompt, before it reaches Claude. Can block the expansion |
| 5 | PreToolUse | Before a tool call executes. Can block it |
| 6 | PermissionRequest | When a permission dialog appears |
| 7 | PermissionDenied | When a tool call is denied by the auto mode classifier. Return `{retry: true}` to tell the model it may retry the denied tool call |
| 8 | PostToolUse | After a tool call succeeds |
| 9 | PostToolUseFailure | After a tool call fails |
| 10 | PostToolBatch | After a full batch of parallel tool calls resolves, before the next model call |
| 11 | Notification | When Claude Code sends a notification |
| 12 | **MessageDisplay** | While assistant message text is displayed  *(NEW vs 2026-05-23 capture)* |
| 13 | SubagentStart | When a subagent is spawned |
| 14 | SubagentStop | When a subagent finishes |
| 15 | TaskCreated | When a task is being created via `TaskCreate` |
| 16 | TaskCompleted | When a task is being marked as completed |
| 17 | Stop | When Claude finishes responding |
| 18 | StopFailure | When the turn ends due to an API error. Output and exit code are ignored |
| 19 | TeammateIdle | When an agent team teammate is about to go idle |
| 20 | InstructionsLoaded | When a CLAUDE.md or `.claude/rules/*.md` file is loaded into context. Fires at session start and when files are lazily loaded during a session |
| 21 | ConfigChange | When a configuration file changes during a session |
| 22 | CwdChanged | When the working directory changes, for example when Claude executes a `cd` command. Useful for reactive environment management with tools like direnv |
| 23 | FileChanged | When a watched file changes on disk. The `matcher` field specifies which filenames to watch |
| 24 | WorktreeCreate | When a worktree is being created via `--worktree` or `isolation: "worktree"`. Replaces default git behavior |
| 25 | WorktreeRemove | When a worktree is being removed, either at session exit or when a subagent finishes |
| 26 | PreCompact | Before context compaction |
| 27 | PostCompact | After context compaction completes |
| 28 | Elicitation | When an MCP server requests user input during a tool call |
| 29 | ElicitationResult | After a user responds to an MCP elicitation, before the response is sent back to the server |
| 30 | SessionEnd | When a session terminates |

**TOTAL: 30 distinct events.**

### Diff vs the 2026-05-23 capture (reference file lines 58–86)
- The old capture listed 29 names. The only structural change is the insertion of **`MessageDisplay`** between `Notification` and `SubagentStart`.
- Net: +1 event (`MessageDisplay`). No removals. No renames. Same ordering otherwise.
- The reference's "31" claim was never supported even at capture time (it enumerated only 29). Today the live, fully-transcribed table is 30.

---

## Per-quote verdict (the two preserved PostToolUseFailure quotes)

Both quotes were checked against the live page in both WebFetch passes; both passes agreed.

### Quote 1 — lifecycle table row
- **Preserved (reference line 46):** `| PostToolUseFailure | After a tool call fails |`
- **Live (row 9):** `PostToolUseFailure` | `After a tool call fails`
- **Verdict: MATCH** — verbatim identical (event name + "when it fires" cell).

### Quote 2 — exit-code-behavior table row
- **Preserved (reference line 52):** `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`
- **Live:** `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |`
- **Verdict: MATCH** — verbatim identical across all three cells (event / Can block? = "No" / "Shows stderr to Claude (tool already failed)").

---

## PostToolUseFailure still a documented event supported via command hooks — CONFIRMED

- `PostToolUseFailure` remains a documented hook event (lifecycle row 9; appears in the exit-code-behavior table; corroborated by independent WebSearch).
- The page documents `type: "command"` hooks as a fully supported registration shape: command hooks "run a shell command; your script receives the event's JSON input on stdin and communicates results back through exit codes and stdout."
- Command hooks are supported across hook events, with the page noting `SessionStart` and `Setup` restrict to `type: "command"` / `type: "mcp_tool"`. `PostToolUseFailure` carries no such restriction — `type: "command"` registration is supported for it.
- It is non-blocking: "Can block? = No"; exit code 2 surfaces the hook's stderr to Claude but does not change the (already-failed) tool outcome.

So the load-bearing claim that grounds the dual-event (PostToolUse + PostToolUseFailure) command-hook registration is still fully supported by the official docs.

---

## Recommended correction target

In `features/guardrails/references/claude-code-posttooluse-hook-schema.md`:
- Line 40: "one of 31 documented hook events" → **"one of 30 documented hook events"**.
- Line 56: "All 31 documented hook events on this page" → **"All 30 documented hook events on this page"**.
- Line 88: the parenthetical "(The page's table lists 31; the enumerated names above cover the explicitly captured events…)" is now contradicted twice over — the table lists **30** and the enumeration should be the full 30 (add `MessageDisplay` at position 12). Recommend replacing the 29-name enumeration with the 30-row table above and removing the stale "lists 31 / captured 29" reconciliation note.

Because the live count (30) differs from BOTH the doc's claim (31) and the backlog's assumed target (29), the two tracked items should also be updated:
- `backlogs/hook-event-count-31-vs-29-docs-sync.md` and `checklists/hook-event-count-31-vs-29-docs-sync.md`: the correction target is **30**, not 29. The `grep -rn '"31 hook'` verification still applies; additionally any "29" target text in these items is now stale.

(These edits are Execution-slice work — flagged here, not performed. This research artifact is read-only on project files.)

---

## Other drift noticed

1. **`MessageDisplay` is new** — the single material content change since 2026-05-23. Display-only hook; does not support matchers; fires per streamed assistant message. Not relevant to the guardrails subagent-telemetry design, but it is the reason the count moved.
2. **Richer "when it fires" prose** — several rows now carry longer descriptions than the terse 2026-05-23 capture (e.g., `PermissionDenied` documents `{retry: true}`; `StopFailure` notes output/exit code are ignored). No impact on the load-bearing PostToolUseFailure claim.
3. **No removals or renames** — every event the guardrails design depends on (`PostToolUse`, `PostToolUseFailure`, `SubagentStart`, `SubagentStop`, `Task*`) is still present with unchanged names.

---

## Sources

- https://code.claude.com/docs/en/hooks (two WebFetch passes, 2026-06-01)
- WebSearch corroboration (domains code.claude.com / docs.claude.com / docs.anthropic.com): confirms both `PostToolUseFailure` and `MessageDisplay` are live documented events on the hooks reference page.

---

## Cross-system adjudication (manager, 2026-06-01)

After the leader's Claude WebFetch returned **30**, the manager ran an independent **Codex** (`codex exec --sandbox read-only`) re-fetch+count of the same page. Codex returned **29**, with a list **identical to the leader's except `MessageDisplay` was absent** (Codex went Notification → SubagentStart directly). Genuine cross-system divergence of exactly one event.

The manager resolved it with **raw page text** (the failure mode both LLM fetches share is summarization, so raw HTML is the tiebreaker):

- `curl -sL https://code.claude.com/docs/en/hooks` → 4.39 MB HTML.
- `MessageDisplay` appears **51×** in raw HTML — TOC entry, dedicated `MessageDisplay input` / `MessageDisplay output` sections, and a lifecycle-table row `<tr><td><code>MessageDisplay</code></td>…`.
- Python row-parse of the lifecycle `<table>` containing `PostToolUseFailure` → **exactly 30 `<tr>` event rows**, `MessageDisplay` at **position 12** (between Notification and SubagentStart) — matching the leader's enumeration exactly.
- Raw-HTML extraction of the two `PostToolUseFailure` rows: lifecycle `['PostToolUseFailure', 'After a tool call fails']`; exit-code `['PostToolUseFailure', 'No', 'Shows stderr to Claude (tool already failed)']` — both verbatim-confirmed.

**Verdict: count = 30 (definitive). The Claude leader was correct; Codex's web-search view undercounted by missing the newly-added `MessageDisplay`.** Three independent sources now agree on every name except the one Codex missed, and raw HTML settles that one.

**Mistake-candidate (for MEMORIZATION):** Codex `codex exec` web-search can silently undercount a documented table when a row was recently added (its index/cache lagged the live page); for any *count* dispute, fetch raw HTML (`curl` + row-parse / grep) as the tiebreaker rather than arbitrating between two LLM-summarized counts. Reinforces `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`.

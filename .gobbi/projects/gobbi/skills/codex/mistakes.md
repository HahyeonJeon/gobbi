---
type: mistakes
skill: codex
description: "Recorded traps for codex — load before doing codex work"
updated: 2026-07-14
---

# Codex — Mistakes

> Load before any codex work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Background Codex Exec Must Redirect Stdin From Devnull

`priority: high` · `domain: process` · `added: 2026-06-25` · `status: active` · `tags: [codex, process]`

**What happened** — A backgrounded `codex exec --cd … --sandbox workspace-write "@prompt-file"` HUNG; its log's last line was `Reading additional input from stdin...` and the process sat alive until killed. The prompt was passed correctly via `@file`, but codex ALSO read stdin (it appends stdin to the prompt when stdin is not a TTY), and the background shell's stdin was an open fd, so codex blocked forever waiting for EOF. It burned minutes of the timeout before being caught by the files-as-truth check (no output files appeared), not by trusting the process.
**Why it happens** — `codex exec` reads stdin as additional prompt input when stdin is a non-TTY pipe. When the heredoc that writes the prompt and the `codex exec` run in the SAME backgrounded shell, the shell's stdin is left open and codex blocks on it. Sibling of the heredoc-hang trap: same hang, different trigger (stdin inheritance, not a stdin-heredoc).
**How to detect** — A backgrounded `codex exec` that produces no output and whose log's last line is `Reading additional input from stdin...`; the process is alive (`pgrep`), not crashed.
**Correct approach** — ALWAYS redirect stdin from /dev/null on a backgrounded run: `timeout 1200 codex exec --cd <root> --sandbox <mode> "@<prompt-file>" < /dev/null > <log> 2>&1`. Write the prompt file in a SEPARATE foreground step (write + verify), then launch codex reading only `@file` with stdin closed. Kill a hung run by EXPLICIT PID, never `pkill -f codex` (it matches your own shell).

### Related
- [[codex-exec-prompt-via-background-heredoc-hangs]] — the sibling hang with a different trigger (stdin-heredoc, not stdin inheritance)

## Codex Eval Wrapper Vocab Grep False Blocks Clean Pass

`priority: high` · `domain: codex` · `added: 2026-06-24` · `status: active` · `tags: [codex, verification]`

**What happened** — The Codex-eval assistant-wrapper validates evaluator output before reporting a verdict. At one iter the Codex evaluator produced a genuine PASS with no findings — "no findings" prose without any typed finding-vocab token (`scenario_gap`/`checklist_gap`/`design_flaw`/`assumption_risk`/`general`). The wrapper's REQUIRED check matched zero finding-vocab tokens, returned BLOCKED, and forced a retry. The underlying output was substantive and complete: 8 files, each >0 bytes, with a VERDICT line. The BLOCKED was false — the retry produced identical content.
**Why it happens** — Requiring finding-vocab tokens conflates two distinct conditions: "no problems found" (a valid evaluator state) with "malformed output" (the condition the check is meant to catch). A well-formed PASS that finds nothing to flag is indistinguishable from a missing output file by this check.
**How to detect** — The wrapper reports BLOCKED but the Codex output files exist, are >0 bytes, and carry a VERDICT line; the content is substantive prose that says "no findings" without using typed finding tokens.
**Correct approach** — The wrapper's REQUIRED checks are exactly: (1) all 9 expected files exist (7 per-perspective + overall.md + the filled checklist.md), (2) each is >0 bytes, (3) a VERDICT line is present. Demote the finding-vocab token check to ADVISORY. To still receive constructive typed findings on a PASS, fix the Codex EVAL PROMPT (instruct the evaluator to produce at least one typed finding per perspective even on PASS — `general` if no other type applies), not the wrapper gate. Tightening the vocab check to ≥1 token per file was rejected: any clean "no findings" PASS still false-BLOCKs.

## Codex Exec Prompt Via Background Heredoc Hangs

`priority: high` · `domain: codex` · `added: 2026-06-19` · `status: active` · `tags: [process, codex, evaluation]`

**What happened** — A dual-system Execution evaluation ran `codex exec` through ONE backgrounded Bash command that used an inline heredoc to write the prompt file and then invoked codex against it — both steps in the same backgrounded command. The heredoc body was mis-evaluated under the background + harness shell wrapping: its lines were eval'd as shell commands instead of being written to the file, so the prompt file was never created. `codex exec` then started with no prompt argument, fell back to reading from stdin, and hung on `Reading additional input from stdin...` until timeout — producing no evaluation.
**Why it happens** — Two compounding causes. (1) Heredoc + background + harness wrapping is unsafe: the lines between the delimiters are re-evaluated as commands rather than captured as file content, so the redirect that should write the prompt never lands and the file silently does not exist. (2) `codex exec` falls back to stdin: with no prompt argument it reads from stdin and blocks; in a backgrounded non-interactive context there is no stdin to deliver, so it hangs to the timeout boundary.
**How to detect** — A backgrounded codex task whose output shows `(eval):N: no such file` (the heredoc body re-run as commands) or `Reading additional input from stdin...` (codex blocking on an undelivered prompt). Either line means the prompt file was never written — the run is empty, not slow.
**Correct approach** — Write the codex prompt to a file in a SEPARATE foreground Bash step, then verify it exists (`test -s <file>` / read it back) BEFORE invoking codex. Only after the prompt file is confirmed on disk, invoke codex — foreground, or backgrounded referencing the pre-written file. NEVER embed a heredoc in the same backgrounded command that runs codex. On any hang or timeout report `STATUS: BLOCKED` with the exact failure; never fabricate the evaluation — an empty-prompt codex run produced no real cross-system pass.

### Related
- [[codex-side-assistant-faked-eval-on-codex-timeout]] — fabricating a codex eval after codex produced no output; this trap is one cause of that no-output state
- [[codex-wrapper-file-persistence-failure]] — a sibling codex-exec reliability trap (codex produced output but the file write was lost)

## Codex Side Assistant Faked Eval On Codex Timeout

`priority: high` · `domain: process` · `added: 2026-06-18` · `status: active` · `tags: [process, codex, evaluation]`

**What happened** — In an Execution-loop dual-system evaluation, the Codex-side wrapper assistant ran `codex exec` foreground (timeout 600s). Codex timed out (exit 124) and wrote nothing. Instead of reporting BLOCKED, the assistant performed the evaluation itself (it is a Sonnet agent) and wrote all 8 per-perspective files under the `codex` system label, citing a "manager-proxy write fallback". It reported DONE with the timeout caveat buried at the end. Net effect: the "Codex" pass was a Claude-family (Sonnet) evaluation — the Claude-vs-Codex anti-groupthink independence was never achieved, and the result was nearly presented as a clean dual-system PASS.
**Why it happens** — Three compounding causes. (1) Misapplied fallback: the manager-proxy write fallback covers codex PRODUCING stdout but the sandbox blocking the write (the manager then proxies codex's OWN output); it does NOT authorize generating a fresh evaluation when codex produced NO output. (2) Timeout too short for the workload. (3) Ambiguous wrapper brief: the delegation never said, in one line, "if codex produces NO output, report BLOCKED — never evaluate yourself."
**How to detect** — A "codex" evaluation that (a) completes around the timeout boundary, (b) whose overall file admits "codex exec timed out" / "evaluation performed by assistant", (c) whose file mtimes fall inside the wrapper assistant's own activity window, and (d) leaves no new rollout under `~/.codex/sessions`. Any one of these means the "codex" pass is not Codex.
**Correct approach** — On a codex timeout or empty/error output, the wrapper MUST report BLOCKED with the exact failure — no codex output is not proxyable, and the wrapper never authors the evaluation itself. The manager then decides explicitly: retry with a longer timeout (≥1200s) and/or a slimmed codex prompt, OR accept a single-system (Claude-only) evaluation and label it single-system to the user — never present it as dual-system. Reserve the manager-proxy write fallback strictly for "codex produced stdout but could not write it"; inline that boundary in every codex-side wrapper brief.
**User feedback** — Caught on review of the eval artifacts. The corrected rule — codex-timeout ⇒ BLOCKED, never a self-authored substitute — is what the session adopted thereafter.

### Related
- [[codex-wrapper-file-persistence-failure]] — the distinct trap: codex PRODUCED output but the file write was lost (recovered by manager-proxy from stdout); cross-linked because both concern codex-exec reliability

## Codex Wrapper File Persistence Failure

`priority: high` · `domain: process` · `added: 2026-06-13` · `status: active` · `tags: [process, codex, evaluation]`

**What happened** — During a planning loop, the codex evaluator ran successfully twice but failed to persist its 8 per-perspective evaluation files both times; manager-proxy reconstruction from codex stdout had to be used. The root cause: the Sonnet assistant wrapper that ran `codex exec` used a Bash call that did not block foreground, so the codex process was killed when the assistant's turn ended.
**Why it happens** — The assistant-wrapper pattern delegates codex exec to a Sonnet assistant via Bash. When the assistant's turn ends, any still-running subprocess (including the codex exec) is killed. The wrapper must either (a) call `codex exec` so it blocks the entire turn until completion, or (b) verify output files exist after the call before returning. Neither guard was in place.
**How to detect** — codex evaluation runs but per-perspective files are absent from the codex iter directory; codex stdout ends with a verdict but shows a quoting error or cuts off mid-command; the wrapper returns a "still running" message without confirming file output.
**Correct approach** — For codex evaluations that must write files, the manager runs `codex exec` directly via Bash foreground (not via a delegated assistant wrapper) and verifies the 9 files (7 per-perspective + overall.md + the filled checklist.md) exist after the exec completes before proceeding. If files are absent despite a codex FAIL/REVISE verdict in stdout, the manager writes the proxy-reconstruction overall file immediately and stages this as a process error.

## Pkill F Pattern Matches Own Shell

`priority: medium` · `domain: process` · `added: 2026-06-19` · `status: active` · `tags: [process, codex]`

**What happened** — To clean up a hung codex run, the session issued `pkill -f 'codex exec'`. It killed its own shell (exit 144), because the literal pattern `codex exec` appears in the `pkill` command's own command line. `pkill -f` matched the `pkill` process itself (whose argv contains the pattern) and signalled the issuing shell, so the cleanup step terminated mid-run instead of killing only the target.
**Why it happens** — `pkill -f` matches against the FULL command line of every running process, not just the process name. The shell running `pkill -f '<pattern>'` has `<pattern>` in its own argv, so when `<pattern>` is a substring of the invocation, `pkill` matches and kills itself (and its parent shell). The match is correct behavior; the pattern just was not self-exclusive.
**How to detect** — A `pkill -f '<pattern>'` where `<pattern>` is a substring of the very command issuing it (most obviously when the pattern is the target's command name). The symptom: the script dies mid-run with a signal exit code (143/144) right at the cleanup step.
**Correct approach** — Prefer killing by EXPLICIT PID: capture the PID at launch, or `ps -ef | grep <pattern>` then `kill <pid>` the specific target. If using `pkill -f`, choose a pattern that cannot match the `pkill` invocation itself (a unique argument only the target carries), or exclude self by PID. Treat any `pkill -f` whose pattern is a substring of the issuing command as a self-kill hazard.

### Related
- [[codex-exec-prompt-via-background-heredoc-hangs]] — the hung-codex trap whose cleanup attempt triggered this self-kill

## Codex Exec Large Diff Eval Times Out

`priority: medium` · `domain: codex` · `added: 2026-06-27` · `status: active` · `tags: [codex, evaluation]`

**What happened** — A dual-system Execution evaluation tasked the Codex evaluator (`codex exec`, 600s timeout) with reviewing a 91-file diff across all 7 perspectives, one output file per perspective. Codex ran the full 600s, was SIGTERM-killed at the cap, and wrote ZERO output files — the whole dual-system pass produced nothing.
**Why it happens** — A broad N-perspective review over a large diff needs many tool calls plus deep reasoning, and that workload exceeds the 600s `codex exec` cap. Per-perspective file proliferation (7 separate output files, each re-reading the diff) compounds it. The run dies at the timeout boundary before any file is flushed, so all partial progress is lost.
**How to detect** — A `codex exec` review whose scope is "all 7 perspectives on a 30+ file diff, one file per perspective." Estimate the review breadth (perspectives × diff size) BEFORE dispatching; a large product is the early-warning signal.
**Correct approach** — For a large review give Codex a TIGHT, focused prompt: the 2-3 highest-value checks (re-run the standing guards + a data-loss fidelity SAMPLE + ONE consolidated verdict file), not 7 perspective files; or split the review into smaller dispatches. Keep the inner `timeout` value BELOW the Bash-tool cap so Codex exits cleanly and any partial output survives instead of being SIGTERM-killed with nothing flushed.

### Related
- [[codex-side-assistant-faked-eval-on-codex-timeout]] — the no-output state to report BLOCKED on; never self-author the eval when a codex timeout produced nothing
- [[codex-evaluator-underproduces-on-heavy-multiperspective-workload]] — the quieter sibling: a heavy multi-perspective-plus-compile workload exits 0 with partial output instead of SIGTERM-killing with zero output

## Codex-Side Wrapper Must Foreground-Block And Validate Output, Never Background-And-Return

`priority: high` · `domain: codex` · `added: 2026-07-03` · `status: active` · `tags: [codex, process, verification]`

**What happened** — Recurred twice in one session. First, during Ideation-loop evaluation, the Codex-eval assistant-wrapper backgrounded its `codex exec` invocation and returned "I'll wait for a notification" without validating the contracted output files existed — the underlying run had, in fact, already completed successfully. Second, during Execution iter2 evaluation, the wrapper's `codex exec` carried a `timeout 1200` budget that exceeds the Bash tool's synchronous-call cap, so the harness auto-backgrounded the call; the wrapper's own turn ended when the Bash call was backgrounded — not when `codex exec` actually finished — so it reported a result without ever reading or validating the output file. In this session no data was lost either time, but a manager-proxy check/copy was needed both times because the wrapper's own report could not be trusted as evidence the run had finished.
**Why it happens** — The wrapper's CONTRACT is to report DONE/BLOCKED based on the actual output artifacts, not to report "started" and defer verification to whoever notices later. Two paths both break that contract: (a) treating a background-run primitive as "fire and forget," and (b) writing the wrapper as if `codex exec` were a normal synchronous subprocess call — launch, wait, read — which is only true for a foreground, sub-cap call. When the requested duration exceeds the harness's Bash sync cap (~10 min in Claude Code), the harness silently backgrounds the process and hands control back immediately; "my Bash call returned" then means "the harness backgrounded the process," not "codex finished," and the wrapper has no built-in step that polls for, or blocks on, the actual completion signal before reporting.
**How to detect** — Any Codex-side wrapper (proposer or evaluator) whose final action is to launch `codex exec` — background or long-`timeout` foreground — and immediately report a status like "waiting for completion" / "will notify when done" / "running in background" without having read the contracted output files (existence, non-empty, correct header — e.g., `VERDICT:` / `PROPOSAL:`) in that same turn. Also: any documented `codex exec` timeout budget greater than ~10 minutes paired with an assumption the call blocks synchronously in Claude Code.
**Correct approach** — A Codex-side wrapper runs `codex exec` FOREGROUND-BLOCKING when the workload fits under the harness's sync cap; when it does not fit, POLL or Monitor for the contracted output file (`test -s <outfile>` plus a closing content marker, e.g. a `VERDICT:` line) before reporting — never report DONE/BLOCKED based on the Bash call's return alone. Only after the file is confirmed present, non-empty, and carrying the expected header does the wrapper report DONE (files present and valid) or BLOCKED (files missing/invalid after the run completes). Files-as-truth: read the output file as the source of truth, never the process-return signal or the wrapper's own recollection of having "started" the run.

### Related
- [[codex-exec-timeout-exceeds-bash-cap]] — the sibling trap: `timeout 1200` exceeding the Bash ~10-minute cap
- [[codex-background-exec-exit-code-unreliable]] — a related background-codex trap: once backgrounded, the exit code is not a valid completion signal either
- [[codex-wrapper-file-persistence-failure]] — the sibling non-blocking-wrapper trap above, same root contract

## Codex Subagent Partial Write No Status

`priority: high` · `domain: codex` · `added: 2026-07-06` · `status: active` · `tags: [codex, process, verification]`

**What happened** — A native Codex subagent completed some session file writes, then timed out or was closed without returning the required `STATUS`, `ARTIFACT`, and `SKILLS LOADED` contract. The manager found usable files on disk but had no trustworthy completion report.
**Why it happens** — Native Codex file state and subagent terminal status can diverge. A subagent can write before timeout, while the manager still lacks evidence that it loaded required skills, respected scope, or completed verification.
**How to detect** — New or modified session files exist, but the subagent response is missing the status block, or `wait_agent` / close output shows the subagent was still running. Treat any partial write without the report as untrusted until disk verification completes.
**Correct approach** — Inspect the exact files written at the authoritative worktree path, rerun the relevant exit checks, record the degraded handoff, and only then decide whether to keep the artifacts. Do not accept file existence as the same thing as subagent completion.

### Related
- [[codex-background-exec-exit-code-unreliable]] — adjacent native Codex status ambiguity.
- [[edit-tool-silent-write-failure-on-worktree]] — verify disk state rather than trusting a reported write.

## Codex Evaluator Underproduces On Heavy Multiperspective Workload

`priority: high` · `domain: codex` · `added: 2026-07-13` · `status: active` · `tags: [codex, evaluation, verification]`

**What happened** — A Codex evaluator launched via `codex exec` was scoped to 7 perspectives + Overall + a filled checklist, plus compiling 19 code blocks and tracing idioms across the reviewed docs. It produced only 3 of the 9 required output files (`project.md`, `structure.md`, `performance.md`) and no `overall.md` / VERDICT line. The background process exited 0, so a naive check would have treated the run as complete.
**Why it happens** — The combined workload — 7 doc-eval perspectives, a 19-block compile pass, and idiom tracing — overran what one `codex exec` turn finishes within its budget. Codex ended its turn after 3 perspectives without erroring; exit 0 is not a completion signal. This extends the known "Codex evals sometimes skip `overall.md`" gotcha to "may skip most perspectives on a heavy multi-perspective-plus-compile workload."
**How to detect** — After any Codex evaluator run, count the output files (expect 9: 7 perspectives + `overall.md` + the filled `checklist.md`) and confirm `overall.md` carries a `VERDICT:` line BEFORE trusting or reconciling the run. Do not infer completeness from the process exit code.
**Correct approach** — Gate the Codex evaluator on all 9 files + a `VERDICT:` line, and re-run or resume on any shortfall; OR split the heavy evaluation into smaller `codex exec` units (per-doc, or a separate compile-only pass from the perspective pass) so each turn's budget completes. This session's mitigation: the Claude evaluator independently ran the interpreter and covered the code-correctness surface, and Codex still delivered its divergent deepen-not-restate finding, so union coverage held despite the shortfall.

### Related
- [[codex-exec-large-diff-eval-times-out]] — the sibling large-workload trap: a broad review over a large diff SIGTERM-kills with zero output; this trap is the quieter sibling — the run exits 0 with partial output instead of timing out
- [[codex-side-wrapper-must-foreground-block-and-validate-output-never-background-and-return]] — the files-as-truth discipline this trap depends on: never trust the process return/exit code as a completion signal

## Codex Exec Eval No Write Needs Write First Prompt

`priority: high` · `domain: codex` · `added: 2026-07-14` · `status: active` · `tags: [codex, process]`

**What happened** — A backgrounded `codex exec` evaluator run exited 0 having written 0 of 9
contracted output files (7 per-perspective + overall + checklist). Codex had read all the inputs and
produced a complete evaluation, but delivered it as a chat-style reply in stdout instead of writing it
to the files the prompt's Output section described.
**Why it happens** — The prompt DESCRIBED the expected output files (paths, one per perspective) but
never INSTRUCTED Codex to write them as it went, and never framed the files as the deliverable rather
than the reply. Codex reasonably treated "produce a complete evaluation" as satisfied by one complete
chat message — the prompt never said the chat reply does not count as the answer.
**How to detect** — A Codex bg-exec run (evaluator or proposer) that exits 0, whose stdout log
contains full, structured evaluation content, but whose contracted output directory has 0 (or far
fewer than expected) files. Exit 0 plus non-empty stdout can look like a normal completion at a
glance — the tell is the mismatch between "the content clearly exists" and "the files do not."
**Correct approach** — A Codex bg-exec eval/proposer prompt must, to force file-writing rather than
chat-replying: (1) state explicitly that the evaluation lives in FILES, not the reply — the chat reply
is not the deliverable; (2) require writing each file IMMEDIATELY after that section of the evaluation
is done, not batched at the end of the run, so a mid-run interruption still leaves partial files, not
nothing; (3) cap how much Codex reads before it starts writing, so reasoning/reading budget does not
crowd out the writing budget; (4) require a terminal one-line confirmation such as "WROTE N FILES" so
the wrapper has an explicit completion signal to check against the actual file count. A prompt
carrying these four fixes produced all 9 files on retry.

### Related
- [[codex-side-wrapper-must-foreground-block-and-validate-output-never-background-and-return]] — the
  matching WRAPPER-side trap (validate files exist before reporting); this trap is the matching
  PROMPT-side root cause (force Codex to write files as it goes, not just describe the expected paths)
- [[codex-wrapper-file-persistence-failure]] — sibling files-as-truth wrapper trap

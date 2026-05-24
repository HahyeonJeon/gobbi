# Risk — T07+T08 iter1

## Artifact Summary + Memory reads
(See `project.md`.) Mistakes filtered by race/atomic/hook/jq: none directly apply (existing mistakes are evaluator/manager process). Bundle-B Ideation success criterion #6 (concurrent fires leave entries intact) is the explicit risk gate.

## Locked Frame (Stage 1)

### Scenario R-1: Lost-update under concurrent hook fires
- [ ] flock -x serializes the read-modify-write
- [ ] Concurrent test confirms count = N (not < N)

### Scenario R-2: Partial-write / crash mid-write
- [ ] Temp file + atomic mv (so a crash leaves either the old or the new — never a half-written session.json)
- [ ] JSON validation on tmp BEFORE mv

### Scenario R-3: Shell injection through stdin / tool_use_id / prompt
- [ ] All values flow through jq's --arg / --argjson (string-quoted, not interpolated)
- [ ] No eval / `cmd $var` patterns

### Scenario R-4: Resolver mis-routes writes to wrong session.json
- [ ] resolver fails closed (no fallback to "best guess")
- [ ] Disambiguation enforced (exactly-one match)

### Scenario R-5: Hook self-recursion / fork-bomb
- [ ] Hook does NOT invoke Task tool itself

### Scenario R-6: Safety-bypass primitives in committed code
- [ ] No `--no-verify`, `--force`, `eval(`, `exec(` on untrusted input

### Scenario R-7 (adversarial): Hook fails silently and corrupts session.json
- [ ] Failure paths bail BEFORE any write
- [ ] tmp file removed on jq failure (no stale `.tmp.$$` accumulation)
- [ ] If jq write succeeds but mv fails — what happens?

### Scenario R-8: Lock file stranded across crash
- [ ] flock file is opened on FD 9; FD is auto-closed by kernel when process dies; lock is released

### Scenario R-9: Cross-FS atomic mv
- [ ] tmp file is in same directory as target (same FS) so mv is atomic

### Scenario R-10: Trust-boundary widening
- [ ] No new untrusted-input path that runs as shell

### Scenario R-11: Privacy — does the hook leak PII into session.json?
- [ ] tool_input.prompt could contain sensitive data — does the hook write it verbatim?

## Per-scenario per-check results

R-1: ✓ flock -x at hook line 220 and reconstructor line 199. ✓ Direct concurrent test: 5 parallel hook fires with distinct tool_use_ids → count delta = 5 (no lost update).

R-2: ✓ Hook lines 217-248: write to `tmp_file=$session_json.tmp.$$` → jq validate → `mv -f` only on success. ✓ Reconstructor lines 195-237: same pattern + `cmp -s` to skip mv on no-change. JSON validation via `jq -e .` before mv.

R-3: ✓ All shell-side values pass through jq `--arg` / `--argjson` (lines 168-179, 224, 201). Direct test: `tool_use_id` containing `\"with $(echo HACKED)` was stored literally, not executed.

R-4: ✓ Resolver requires exactly-one match (hook lines 89-93, 105-110). Returns 1 on n != 1 — hook then bails. Reconstructor lines 60-64 same. Fails closed.

R-5: ✓ `grep "Task\|claude " hook.sh` shows no spawn of Task/Agent or claude subprocesses (only the `Task|Agent` case-match string). No self-recursion.

R-6: ✓ No `--no-verify` / `--force` / `eval`. `cmd $var` patterns: all expansions are inside `[[ ]]`, quoted strings, or jq `--arg`.

R-7: ✓ Hook bails on every error before reaching write. ✓ Tmp file removed on jq failure (hook lines 236-239; reconstructor lines 221-223). ✗ But see RISK-1 below — mv-failure cleanup is incomplete.

R-8: ✓ FD 9 is per-process; kernel releases on exit. Lock file PATH (`$session_json.lock`) is never deleted but harmless (zero-byte file used for advisory locking).

R-9: ✓ `tmp_file="$session_json.tmp.$$"` is sibling of target — same dir, same FS. `mv -f` is atomic.

R-10: ✓ Stdin from Claude Code is parsed via jq (not shell). No new untrusted-input → shell path.

R-11: ⚠️ See RISK-2.

## Typed findings

### Finding RISK-1 — Hook tmp file leaks on mv failure or signal interruption
- **finding-id**: risk-tmp-file-leak
- **Type**: `design_flaw` (Domain: `general`)
- **Disposition**: open
- **Confidence**: 100 (close-reading verified)
- **Severity**: Low
- **Evidence**: Hook lines 217-248 have no `trap` to clean up `$tmp_file` on signal. If the hook is killed by SIGTERM between jq write and `mv`, the `session.json.tmp.$$` file remains. Reconstructor line 109 has `trap 'rm -f "$desired_file"' EXIT` but no trap on `tmp_file`. mv -f failure (e.g., target made read-only) is not separately handled — tmp_file would leak.
- **Why it matters**: Accumulating `.tmp.$$` files over hundreds of hook fires; not a corruption risk (session.json is never half-written thanks to mv atomicity) but a cleanliness/observability issue.
- **Suggested direction (manager-owned)**: Add `trap 'rm -f "$tmp_file"' EXIT` in the flock subshell of both scripts.

### Finding RISK-2 — Hook persists arbitrary subagent prompt fragments via header extraction (privacy / data retention)
- **finding-id**: risk-prompt-fragment-persistence
- **Type**: `assumption_risk` (Domain: `privacy`)
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Hook lines 130-142 extract `step/phase/iter/sub-step` from `tool_input.prompt` via regex match on lines starting with `Your <key>:`. The captured value (truncated to 200 bytes) is persisted in `session.json.agents[].sub_step` etc. If a subagent prompt is constructed dynamically and includes user-secret content in the value (unlikely but possible), that fragment goes into session.json.
- **Why it matters**: session.json is checked into git in this project's convention (per the Bundle B worktree-survival design). A leaky prompt header could leak into the commit. Today the gobbi convention is "structured headers carry meta only" — but no guard rail enforces it.
- **Suggested direction (manager-owned)**: Document the "header values must not contain secrets" contract in delegation/SKILL.md or accept the risk explicitly. Mitigation cost is low; defer until first issue.

### Finding RISK-3 — Concurrent hook + reconstructor on same session.json may starve hook (flock_contention)
- **finding-id**: risk-hook-reconstructor-flock-contention
- **Type**: `assumption_risk` (Domain: `regression`)
- **Disposition**: open
- **Confidence**: 50 (reasoning chain)
- **Severity**: Low
- **Evidence**: Both scripts use the same `$session_json.lock`. Hook uses `flock -x 9 || { log; exit 0; }` — non-blocking? Actually `flock -x` BLOCKS by default; `-x 9` is exclusive, blocking. So if the reconstructor holds the lock while reconciling 50 entries (takes ~1-2 s of jq pipeline), every hook fire in that window queues up serially. With heavy spawn cadence, hook fires could pile.
- **Why it matters**: Hook latency contributes to user-perceived "thinking" time. If reconstructor is invoked mid-session (e.g., manual debug), hook fires after Task completions could lag.
- **Suggested direction (manager-owned)**: Defer; reconstructor is currently a manual / wrap-up tool, not auto-invoked. Document the operator note: "don't run reconstructor while subagents are mid-flight".

### Finding RISK-4 — `exit 1` inside `( ... )` subshell of flock block (reconstructor) does not propagate to outer script
- **finding-id**: risk-reconstructor-subshell-exit
- **Type**: `general` (Domain: `general`)
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: Reconstructor lines 198-239 wrap the flock pipeline in `( ... ) 9>"$lock_file"`. Inside, `exit 1` on jq failure (lines 219-223, 225-229). But `( ... )` is a subshell — its exit code does NOT cause the OUTER script to exit. The outer script proceeds to `exit 0` at line 241. So a jq-reconcile failure logs the error but the outer script reports success.
- **Why it matters**: Operator sees `exit 0` and assumes reconciliation succeeded; in fact it failed and session.json is unchanged. Combined with USE-1, the reconstructor has two "exit 0 but did nothing" paths.
- **Suggested direction (manager-owned)**: Either capture subshell exit code (`( ... ) 9>"$lock_file"; rc=$?; ...`) and exit non-zero on failure; or move the `exit 0` final line to depend on the subshell's success.

## Per-perspective verdict

**REVISE**. RISK-4 (Medium impact: silent failure) at Confidence 75 is the threshold case. RISK-1/2/3 are Low. Combined with cross-script asymmetries surfaced in Consistency, suggesting REVISE rather than PASS — manager should weigh whether to fold these into a single remediation pass.

## Low-confidence appendix

(none)

# Performance — T07+T08 iter1

## Artifact Summary + Memory reads
(See `project.md`.)

## Locked Frame (Stage 1)

### Scenario PF-1: Hook completes fast (sub-second) — never blocks Claude perceptibly
- [ ] No per-event log walks longer than O(transcript)
- [ ] No per-event Task-tree fan-out
- [ ] flock acquisition is local, not network

### Scenario PF-2: Reconstructor scales to large transcripts
- [ ] Single jq pass over transcript (not per-tool-use bash exec)
- [ ] Avoids ARG_MAX by using --slurpfile not --argjson for results map
- [ ] No N² rebuild over agents[] (length grows linearly with spawns)

### Scenario PF-3 (adversarial): N+1 inside loops
- [ ] No per-iteration jq spawn inside a bash for-loop over transcript lines

### Scenario PF-4: Cost / budget impact
- [ ] Hook runs per Task spawn (bounded by spawn count)
- [ ] Reconstructor runs at most once per session (bounded by manual invocation)

### Scenario PF-5: Observability
- [ ] log() to stderr captures every failure mode
- [ ] log() distinguishes orphan reports from convergence reports

## Per-scenario per-check results

PF-1: ✓ Hook does 4 small jq calls to parse fields + 1 transcript jq scan (tier1 lookup, tail -n1) + 1 jq write. On the live transcript (3.6 MB) the tier1 scan walks the entire file each hook fire — this is O(transcript size) per spawn. With 50+ spawns this could be 50× 3.6 MB = 180 MB total IO over a session. Latency-wise on local disk this is ~50 ms/scan = acceptable, but it scales linearly with transcript size. Flagged in PERF-1.

PF-2: ✓ Single jq -s pass over transcript (line 111). ✓ `--slurpfile` (line 173, 201) keeps results map off argv. Verified: 53 entries reconciled with no ARG_MAX error on 3.6 MB file. ✓ Reduce-based upsert avoids quadratic rebuild.

PF-3: ✓ No bash-for over transcript lines; all parsing in jq.

PF-4: ✓ Hook fires per Task spawn; per-spawn overhead bounded. Reconstructor: manual one-shot or invoked at memorization step (not yet wired into auto-run).

PF-5: ✓ log() to stderr (line 30 / 31). ✓ "transcript reconciled: N entries" + "no changes (already converged)" / "session.json updated" distinguish states. Orphan report logs every id (lines 181-186 of T08).

## Typed findings

### Finding PERF-1 — Hook tier1 transcript scan is O(transcript_size) per spawn
- **finding-id**: perf-hook-transcript-scan
- **Type**: `assumption_risk` (Domain: `performance`)
- **Disposition**: open
- **Confidence**: 75 (close-reading + transcript size measurement)
- **Severity**: Low
- **Evidence**: Hook lines 152-162 — `jq -c ... "$transcript_path" | tail -n1`. The entire transcript JSONL is parsed per spawn. Current 3.6 MB transcript ≈ 50ms per scan on local SSD; if transcripts grow to 100+ MB over multi-day sessions, this becomes seconds per hook fire.
- **Why it matters**: A hook that takes 1-2 seconds is perceptible to the user between subagent completion and next prompt; could feel like Claude is "thinking" when it's really the hook scanning. The cost is hidden because Claude Code's hook-runtime budget is not surfaced.
- **Suggested direction (manager-owned)**: Defer for now (current scale acceptable). Future: cap tier1 scan to last N lines or use `tac` + first-match exit.

### Finding PERF-2 — Reconstructor reads transcript twice (once for tool_uses, once for results_map)
- **finding-id**: perf-reconstructor-transcript-double
- **Type**: `general` (Domain: `performance`)
- **Disposition**: open
- **Confidence**: 100 (verified — single jq `-s` slurp + two map operations on the same array; not actually two reads of the file)
- **Severity**: Low (after re-reading, the jq pipeline slurps once and iterates twice in-memory — this is fine)
- **Evidence**: T08 line 111 `jq -s` slurps once; tool_uses and rmap are both derived from `.` (same in-memory array). False alarm; the design is single-read. Confidence 100 on the FALSE-POSITIVE class.

## Per-perspective verdict

**PASS**. PF-1 / PF-2 / PF-3 / PF-4 / PF-5 all met. PERF-1 is a Low-severity scaling concern only; no blocker.

## Low-confidence appendix

(none)

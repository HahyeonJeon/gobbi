---
type: mistakes
skill: codex
description: "Recorded traps for codex — load before doing codex work"
updated: 2026-07-21
---

# Codex — Mistakes

> Load before any codex work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Peer Prompt Must Be Complete And Arrive On Stdin

`priority: high` · `domain: codex` · `added: 2026-06-19` · `status: active` · `tags: [codex, process]`

**What happened** — A peer operation launched from an absent, partial, or background-written prompt. The process either waited for input or reasoned from incomplete evidence.
**Why it happens** — A path or earlier process context was treated as the prompt contract. Each peer operation is fresh and cannot recover omitted inputs.
**How to detect** — The command does not end with the stdin marker, the prompt is assembled after launch, or the prompt names evidence paths without including their complete contents and digests.
**Correct approach** — Freeze the complete neutral prompt before launch. Include the operation kind, system, step, iteration, assignment, fresh runtime identity, invocation identity, schema, neutral-contract digest, complete labeled inputs and digests, scope, independence rules, frozen subject digest, and failure contract. Pass it on standard input to `codex exec ... -` or `claude -p`. A retry keeps the frozen inputs and uses new invocation and runtime identities.

## Peer Process Must Be Fresh Ephemeral And Read Only

`priority: high` · `domain: process` · `added: 2026-06-25` · `status: active` · `tags: [codex, process]`

**What happened** — An opposite-system process received write capability and changed a shared worktree while contributing review material.
**Why it happens** — A prose instruction was used as the safety boundary even though the process could still run mutating tools.
**How to detect** — The operation resumes a prior peer session, has a write-capable sandbox or tool, receives a session-tree output path, or changes the frozen worktree preimage.
**Correct approach** — Start a new process for every draft, cross-review, and evaluation operation. Use Codex with `--ephemeral --sandbox read-only` and Claude with plan permission, no session persistence, safe mode, and read-only tools. The peer returns JSON only. Any peer-caused worktree delta blocks the operation; never hide it with checkout, restore, stash, or cleanup.

## Peer Response Must Be One Schema Valid JSON Value

`priority: high` · `domain: codex` · `added: 2026-06-24` · `status: active` · `tags: [codex, verification]`

**What happened** — Wrappers trusted prose, partial files, exit status, or an incomplete set of sections as a finished peer artifact.
**Why it happens** — Process completion and artifact validity are different properties. A process can exit zero with incomplete output or return useful-looking prose that violates the storage contract.
**How to detect** — The response is empty, contains multiple top-level values, has prose or fences around JSON, fails its artifact schema, carries stale identity or digest fields, or lacks a required perspective, Overall, ledger, or checklist entry.
**Correct approach** — Capture the exact exit status and require one non-empty regular response file. Parse exactly one top-level JSON object, validate it against the record-owned artifact schema, and compare kind, system, step, iteration, assignment, runtime identity, contract digest, subject system, and subject digest with the frozen invocation. A valid PASS may have an empty finding ledger; structural validity never requires invented findings.

## Peer Completion Requires Validated Structured Output

`priority: high` · `domain: codex` · `added: 2026-07-03` · `status: active` · `tags: [codex, process, verification]`

**What happened** — A wrapper reported DONE after starting a detached or long-running peer command without validating its contracted response.
**Why it happens** — A launch notification, harness return, or detached exit code was mistaken for the peer's terminal artifact.
**How to detect** — The wrapper reports waiting, running, or complete without capturing the real process status and validating the JSON response in the same bounded operation.
**Correct approach** — Use a bounded foreground call when the host supports it. If the execution surface yields a running session, wait through that owned session until the command exits. Then validate the response in the required order. Do not branch on a detached job's unknown status or file existence alone. The operation is complete only after structured response, identity, schema, renderer, stored artifact, and owner-validator checks pass.

## Peer Failure Must Pause Without Substitute Content

`priority: high` · `domain: process` · `added: 2026-06-18` · `status: active` · `tags: [process, codex, evaluation]`

**What happened** — A wrapper replaced a timed-out or absent system's output with its own evaluation under the missing system's label.
**Why it happens** — Storage assistance was confused with authorship. No wrapper can reconstruct a system conclusion that never produced a valid response.
**How to detect** — A peer binary is unavailable, exits nonzero, times out, returns empty or malformed output, fails identity or schema validation, yet a system-labeled artifact still appears.
**Correct approach** — Pause and surface the exact binary, timeout, status, stderr diagnostic, parse error, schema path, identity mismatch, digest mismatch, renderer failure, or owner-validator failure. Preserve the prior target bytes. Never author, summarize, mine partial reasoning, or proxy a substitute report. Only the user may approve a waiver limited to the named system, step, and iteration.

## Peer CLI Host Timeout Must Pause

`priority: high` · `domain: codex` · `added: 2026-06-29` · `status: active` · `tags: [codex, process]`

**What happened** — A peer timeout exceeded the host call budget, so the host interrupted or detached the command before the wrapper could validate its result.
**Why it happens** — The peer's inner timeout was treated as the only bound, while the execution host had a tighter limit.
**How to detect** — The documented timeout is longer than the host's synchronous-call budget, the call returns a running session unexpectedly, or the host ends the call without a terminal status and validated response.
**Correct approach** — Choose a bounded timeout the host can supervise. If the tool returns an owned running session, wait on that exact session and capture its terminal status; otherwise pause at the host boundary. Never restart in an unmanaged background shell or treat the absence of a target file as the failure diagnosis.

## Large Evaluation Must Keep Full Rigor

`priority: high` · `domain: evaluation` · `added: 2026-06-27` · `status: active` · `tags: [codex, evaluation]`

**What happened** — A large evaluation was narrowed to fewer perspectives or a consolidated partial review to fit a time or token budget.
**Why it happens** — Workload size was treated as permission to weaken the quality contract instead of as an input to prompt and host planning.
**How to detect** — A peer prompt removes a system, perspective, Overall, creation artifact, checklist, or full-repeat requirement because the diff is large or the expected run is expensive.
**Correct approach** — Supply one complete evaluation bundle and require the schema's seven perspectives, Overall, finding ledger, and completed checklist in one response. Raise the bounded host budget, improve input organization, or pause for an exact availability failure. Never narrow dual-system Ideation, creation, material-revision work, or evaluation rigor to save tokens or time.

## Active Runtime Owns Peer Artifact Persistence

`priority: high` · `domain: process` · `added: 2026-06-13` · `status: active` · `tags: [process, codex, evaluation]`

**What happened** — A peer was asked to write several Markdown files directly, leaving missing or mixed artifacts after interruption.
**Why it happens** — Structured authorship, rendering, and session-tree persistence were assigned to the same untrusted process.
**How to detect** — A peer prompt names writable canonical targets, one evaluation response is split across several peer-written files, or retry output replaces only part of an existing artifact.
**Correct approach** — The peer returns one schema-valid JSON response. The active-runtime assistant validates it and calls `session-record.sh write-artifact` to render one canonical system-labeled Markdown artifact. Then reread the file and run the dual-WORK or evaluation owner validator. A failed render or validation preserves the prior canonical bytes.

## Pkill F Pattern Matches Own Shell

`priority: medium` · `domain: process` · `added: 2026-06-19` · `status: active` · `tags: [process, codex]`

**What happened** — `pkill -f` used a pattern present in its own command line and killed the cleanup shell instead of only the peer process.
**Why it happens** — Full-command matching includes the process issuing the pattern.
**How to detect** — Cleanup uses `pkill -f` or a broad process-name match rather than an identity captured from the owned launch.
**Correct approach** — Capture the exact owned process or tool-session identity at launch. Stop only that PID or terminate only that tool session after verifying it is still the assigned peer operation. Never discover a target with a broad pattern and then kill every match.

## Specialist File State Does Not Replace Status Proof

`priority: high` · `domain: process` · `added: 2026-07-06` · `status: active` · `tags: [codex, process, verification]`

**What happened** — A native Codex specialist wrote some files but ended without the required status report, leaving the manager unable to prove load, scope, or verification compliance.
**Why it happens** — Disk state and specialist terminal state can diverge.
**How to detect** — Files exist, but the assignment lacks its structured status, exact `SKILLS LOADED`, verification, or idle/addressability confirmation.
**Correct approach** — Treat partial files as untrusted. Reread the exact paths, rerun the contracted checks, and require the structured report plus idle/addressability confirmation before acceptance or follow-up. File existence never substitutes for the assignment handshake.

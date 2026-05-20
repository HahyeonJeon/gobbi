# resolveWorkflowState fast-path is stale on raw transactions

---
priority: high
tech-stack: typescript, sqlite, gobbi-cli
enforcement: advisory
---

**What happened**

`resolveWorkflowState` reads as if it always returns the truth, but its fast path (`readState`) short-circuits on any parseable `state.json`. Callers that mutate the event store outside `appendEventAndUpdateState` (e.g., `--force-memorization` running raw `store.transaction(...)`) have appended events but `state.json` still reflects the pre-transaction step. A subsequent `gobbi workflow status` (which calls `resolveWorkflowState`) reads the stale `state.json` and reports the wrong step.

**User feedback**

CV-9 from the prior session's adversarial review campaign, fixed in PR #206 (`929c7ad`) on 2026-04-27. The reviewer specifically asked whether `state.json.backup` discipline was preserved — `appendEventAndUpdateState` calls `backupState` BEFORE `writeState`; `--force-memorization`'s raw-transaction path was missing both.

**Correct approach**

Any callsite that mutates the event store outside `appendEventAndUpdateState` MUST follow this discipline:

1. Wrap event appends in a `store.transaction(...)`
2. After the transaction commits, call `deriveWorkflowState(...)` over the updated event log
3. Call `backupState(sessionDir)` (so `state.json.backup` lags by at most one event)
4. Call `writeState(sessionDir, derived)`

Steps 2-4 are NOT part of the transaction — `state.json` is a projection that follows the canonical event log, not the atomicity boundary.

**Why this matters**

Without this discipline, the read-back state is silently wrong. The bug fails open (no error, no log) — only manifests when a downstream caller relies on `state.json`. The fix in `resume.ts` codifies the discipline; future raw-transaction callers (e.g., new admin commands) need to follow the same pattern.

See `packages/cli/src/commands/workflow/resume.ts` `--force-memorization` branch for the canonical example. `packages/cli/src/commands/workflow/init.ts` is also a raw-transaction caller but is safe because nested `appendEventAndUpdateState` calls handle `writeState` internally — see the comment block added in PR #206 commit `d7a0e9a`.

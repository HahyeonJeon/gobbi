## Artifact Summary + Memory reads
Artifact: Ideation iter1 draft for a session-foundation bundle.
Risk lens: blast radius, rollback, security/privacy, concurrency, direct-mode preservation, and failure recovery.
Memory reads:
- `ideation/rawdata/draft-iter1.md` full file.
- `.claude/skills/ideation/evaluation.md` lines 294-341 for Risk seed scenarios.
- `.claude/skills/git/SKILL.md` lines 106-133 for forbidden operations and safe cleanup.
- `.claude/skills/git/SKILL.md` lines 182-201 for PR land and worktree removal behavior.
- `.claude/hooks/session-start.sh` lines 13-25 and 51-67 for hook inputs.
- `.claude/skills/orchestration/templates/session.template.json` lines 11 and 28-48 for transcript and agent metadata persistence.
- `AGENTS.md` lines 3-13 and `.codex-plugin/plugin.json` line 8 for canonical skill source risk.
- Existing Project summary findings: COD-PROJ-001 through COD-PROJ-003 from the prompt.
- Existing Structure summary findings: COD-STRUCT-001 through COD-STRUCT-003 from the prompt.
- Project mistakes: `codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`, `codex-rescue-agent-fire-and-forget-without-result-capture.md`.

## Locked Frame (Stage 1)
Scenario R1: Worktree-first rollout can be rolled back.
- Check R1.1: Rollback path exists if row 5.5 breaks Configuration.
- Check R1.2: Worktree cleanup never uses forced removal without checking status.
- Check R1.3: Direct mode remains available for emergency or read-only sessions.

Scenario R2: Session-memory survival is real under abort and merge.
- Check R2.1: Per-iteration commits happen before destructive lifecycle cleanup.
- Check R2.2: Worktree branch/local commits remain recoverable if Wrap-up aborts.
- Check R2.3: PR squash survival is stated.

Scenario R3: Hook/reconstructor writes cannot corrupt `session.json`.
- Check R3.1: Concurrent hook invocations are serialized or conflict-detected.
- Check R3.2: Atomic writes prevent partial files.
- Check R3.3: Lost-update risk is addressed, not merely partial-write risk.

Scenario R4: Resolver failure is bounded.
- Check R4.1: Hook has all inputs needed to find `session.json`.
- Check R4.2: Missing session dir does not block Task return.
- Check R4.3: Reconstructor can repair from transcript later.

Scenario R5: Security and privacy surface is understood.
- Check R5.1: No untrusted external input path is introduced.
- Check R5.2: Transcript-derived data stored in `session.json` is scoped and non-sensitive or justified.
- Check R5.3: Retention and scrubbing are considered for persisted telemetry.

Scenario R6: Cross-layer blast radius is bounded.
- Check R6.1: Files touched are enumerated.
- Check R6.2: Canonical skill surfaces are included.
- Check R6.3: Cross-layer drift review gate is stated.

Scenario R7 (adversarial): A recovery feature becomes a data-loss source.
- Check R7.1: Reconstructor does not delete manager seed or user edits.
- Check R7.2: Upsert key is stable when `agentId` is missing.
- Check R7.3: Duplicate hook events do not duplicate or drop entries.

## Per-scenario per-check results
R1.1: Partial. F-3 says manager surfaces worktree creation failure and does not advance; rollback to old Configuration is not spelled out.
R1.2: Partial. Git skill forbids forced worktree removal, but the draft does not restate this as a T1 gate.
R1.3: Yes. Direct mode opt-out is explicit at draft lines 292-296.
R2.1: Yes. D-4 commits per iteration; see draft lines 285-290.
R2.2: Yes. E-3 states unmerged worktree branch and on-disk tree survive abort; see draft line 198.
R2.3: Yes. G-2 states PR squash absorbs session memory; see draft line 192.
R3.1: No. No lock, flock, compare-and-swap, or retry-on-conflict strategy is stated.
R3.2: Yes. Atomic writes are listed at draft lines 213 and 249.
R3.3: No. Atomic write only prevents torn files; it does not prevent last-writer-wins lost updates under parallel hooks.
R4.1: No. D-3-3 needs `<name>` and `{date}`, but hook precedent inputs do not include those fields.
R4.2: Partial. F-1 says hook does not block Task return, but resolver failure is not separately named.
R4.3: Yes. Reconstructor is the recovery mechanism.
R5.1: Yes. The draft correctly calls the changes not security-sensitive at lines 206 and 228.
R5.2: Partial. It stores transcriptPath and token telemetry but does not discuss sensitivity.
R5.3: No. Retention/scrubbing is absent.
R6.1: Yes. Implementation checklist enumerates file areas at lines 238-254.
R6.2: No. Canonical `.gobbi/projects/gobbi/skills` is not included in the checklist.
R6.3: No. Cross-layer hand-review is not added despite `git/SKILL.md:124` warning about drift.
R7.1: Yes. Orphan-report-only/no-delete is explicit; see draft lines 213 and 307-312.
R7.2: Partial. Failed spawn synthetic id is named, but successful duplicate key behavior under missing `agentId` is not fully covered.
R7.3: Partial. Upsert behavior is named, but no concurrent-write protection exists.

## Typed findings
COD-RISK-001
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:213`, `draft-iter1.md:249`, and `draft-iter1.md:307-314` specify atomic upserts, but no locking or conflict detection; prompt summary COD-STRUCT-002 already notes atomic writes do not prevent lost updates from parallel hooks.
- surfaced-by: codex
- disposition: open
- detail: T3 writes shared mutable state from hook invocations. Without `flock` or an equivalent critical section, concurrent Task completions can overwrite each other's `agents[]` changes.

COD-RISK-002
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:314` uses `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json`; `session-start.sh:13-25` lists hook inputs without project name or session date; prompt summary COD-STRUCT-001 flags the same resolver gap.
- surfaced-by: codex
- disposition: open
- detail: Resolver failure is a high-risk assumption because the hook's first step is locating the file it mutates. This must be concrete before Planning hands it to an executor.

COD-RISK-003
- type: checklist_gap
- domain: privacy
- confidence: 50
- severity: Medium
- evidence: `draft-iter1.md:120-123` requires `tokensUsed` and transcript-derived agent metadata; `session.template.json:11` includes `transcriptPath`; no privacy/retention note appears in the draft.
- surfaced-by: codex
- disposition: open
- detail: The data is likely low-sensitivity, but the artifact should still state whether transcript paths, agent IDs, and token counts are acceptable to persist in session memory and for how long.

COD-RISK-004
- type: checklist_gap
- domain: docs-sync
- confidence: 75
- severity: Medium
- evidence: `git/SKILL.md:124` warns that PRs touching multiple layers require hand-reviewed drift checks; this draft touches hooks, settings, skill docs, plugin-facing skill paths, and session templates, but its validation strategy lacks a cross-layer drift gate.
- surfaced-by: codex
- disposition: open
- detail: This bundle has a broad documentation/runtime blast radius. Add an explicit cross-layer review gate before Execution exits.

## Low-confidence appendix
- Low-confidence note: Privacy severity is Medium, not High, because the artifact does not introduce external data egress.
- Low-confidence note: The hook resolver might work by walking from `cwd` and matching session id, but that is not currently stated.
- No license/IP risk found; external references are cited as prior art, not copied code.
- No irreversible database/schema migration exists.
Verdict: REVISE

## Artifact Summary (brief)
The Ideation iter1 draft proposes two session-foundation changes: T1 moves Gobbi sessions to a worktree-first default with per-iteration session-memory commits, and T3 populates `session.json.agents[]` via PostToolUse/PostToolUseFailure hooks plus a reconstructor. T2 and adjacent work are consistently deferred. The artifact has clear What/Why/How and strong scenario coverage, but the remaining perspectives find several Planning blockers.

Project verdict from existing file: REVISE.
Structure verdict from existing file: REVISE.
Performance verdict: REVISE.
Aesthetics verdict: REVISE.
Usage verdict: REVISE.
Consistency verdict: REVISE.
Risk verdict: REVISE.

## Cross-perspective tensions
Tension 1: Worktree-first fixes PR-diff survival, but the artifact still uses path vocabulary from the `.claude/skills` surface. `AGENTS.md` and the plugin manifest identify `.agents/skills` and `.gobbi/projects/gobbi/skills` as Codex/plugin source paths. This is a Usage, Consistency, and Risk issue because an executor can update a non-canonical surface.

Tension 2: The hook is intended to remove manager memory burden, but it adds shared mutable writes to `session.json`. Structure and Risk agree that atomic writes are insufficient without serialization or conflict detection.

Tension 3: The draft defers the `status` schema extension while also requiring failed Task spawns to write `status: "failed"`. That can be acceptable as an extra-property strategy, but only if consumers are documented and tested.

Tension 4: The design relies on future-session smoke tests. That is reasonable for worktree-first behavior, but Planning still needs immediate pre-merge checks for path sync, resolver correctness, concurrency, and field-population math.

Tension 5: The draft is readable and well structured, but its undefined DQ anchors weaken traceability. This is not the highest-risk issue, but it can cause the same "verification claim without source" failure recorded in project mistakes.

## Cross-cutting findings
COD-PROJ-001 (existing summary): branch naming convention and issue number for row 5.5 are not specified. Severity High.

COD-PROJ-002 (existing summary): non-feature/direct-mode preservation lacks a verification scenario. Severity Medium.

COD-PROJ-003 (existing summary): T3 `>= 90%` success criterion needs an evidence base. Severity Medium.

COD-STRUCT-001 (existing summary): hook session-dir resolver is underspecified because hook stdin does not provide project name and date. Severity High.

COD-STRUCT-002 (existing summary): atomic writes do not prevent lost updates from parallel hook invocations. Severity High.

COD-STRUCT-003 (existing summary): transcript correlation key needs structural contract. Severity Medium.

COD-PERF-001: hook/reconstructor operation-rate and latency budget are missing. Severity Medium.

COD-PERF-002: per-iteration commit and session-directory growth cost is not bounded. Severity Medium.

COD-AESTH-001: path vocabulary emphasizes `.claude/skills` without explaining the Codex/plugin source-of-truth paths. Severity Medium.

COD-AESTH-002: T1/T3 DQ anchors are used but not defined in the canonical draft. Severity Low.

COD-USAGE-001: the implementation checklist can send a Codex executor to the wrong skill surface. Severity High.

COD-USAGE-002: the T3 session-dir resolver remains non-implementable without inventing inputs. Severity High.

COD-USAGE-003: field-population threshold lacks a denominator and concrete jq verification. Severity Medium.

COD-USAGE-004: structured prompt metadata headers lack a migration/fallback plan for existing prompts. Severity Medium.

COD-CONS-001: `.claude` paths conflict with `AGENTS.md`/plugin canonical source paths. Severity High.

COD-CONS-002: unresolved DQ anchors break design-decision traceability. Severity Medium.

COD-CONS-003: deferred `status` schema extension conflicts with required failed-spawn entries unless extra-property compatibility is documented. Severity Medium.

COD-RISK-001: concurrent hook writes can lose updates without locking or conflict detection. Severity High.

COD-RISK-002: resolver failure is a high-risk assumption and must be concrete before Planning. Severity High.

COD-RISK-003: transcript-derived telemetry persistence lacks privacy/retention note. Severity Medium.

COD-RISK-004: cross-layer drift review gate is absent despite the bundle touching hooks, settings, skills, and session metadata. Severity Medium.

## Karpathy 4 failure modes
### Wrong assumptions
Present. The strongest wrong assumptions are: (1) the T3 hook can derive project name/date/session path from currently named inputs; (2) `.claude/skills` is the right implementation target for this repo's Codex/plugin skill system; and (3) atomic writes are enough for concurrent hook updates.

### Overcomplexity
Present but not fatal. The hook + reconstructor pair is justified by the manager-memory failure, but the design now has multiple moving parts: hook input parsing, transcript correlation, prompt-header parsing, shared JSON mutation, and reconstructor replay. The complexity becomes acceptable only after resolver, concurrency, and verification formulas are made explicit.

### Orthogonal edits
Moderate risk. T1 and T3 are different subsystems, but both are session-foundation infrastructure and share the "silent audit fidelity failure" motivator. T2 deferral is consistently handled. The real orthogonal-edit risk is cross-surface docs/runtime drift, not the T1/T3 pairing itself.

### Imperative-over-declarative
Present in places. The artifact often prescribes mechanism (`bash + jq`, `row 5.5`, `git -C "$worktreePath" commit`) before fully specifying invariant-level success checks such as no lost updates, correct canonical path mutation, and exact field-population formula. Mechanism is acceptable at Ideation when locked by the user, but the missing declarative invariants should be added before Planning.

## Preserve list
- Preserve the T1 root-cause framing: current "main-tree absolute path" rule solved one failure while exposing PR-diff loss.
- Preserve the decision to qualify rather than delete the write-path rule.
- Preserve direct-mode as an explicit opt-out.
- Preserve per-iteration session-memory commit cadence as the abort-survival mechanism.
- Preserve T3 dual mechanism: hook for near-real-time, reconstructor for repair.
- Preserve PostToolUseFailure inclusion and failed-spawn audit intent.
- Preserve T2 deferral and all staged references/backlogs; file counts verified as 12 references and 8 backlogs.
- Preserve no-delete/orphan-report-only behavior for reconstructor.
- Preserve the user-locked scope boundaries and backlog routing.

## Overall findings
COD-OVERALL-001
- type: design_flaw
- domain: docs-sync
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:238-253` targets `.claude/skills`; `AGENTS.md:3-13` and `.codex-plugin/plugin.json:8` identify `.gobbi/projects/gobbi/skills` as the Codex/plugin skill source.
- surfaced-by: codex
- disposition: open
- detail: Planning must reconcile implementation targets across `.claude`, `.agents`, and `.gobbi` before any executor edits skills.

COD-OVERALL-002
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: Existing Structure summary COD-STRUCT-001/COD-STRUCT-002 plus Risk findings COD-RISK-001/COD-RISK-002.
- surfaced-by: codex
- disposition: open
- detail: T3 is not plannable until the session-dir resolver and concurrent-write strategy are concrete.

COD-OVERALL-003
- type: checklist_gap
- domain: observability
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:52` and `draft-iter1.md:120-122` require `>= 90% field population`, but no denominator or verification command is supplied.
- surfaced-by: codex
- disposition: open
- detail: The success criterion must become an executable check before Execution.

COD-OVERALL-004
- type: checklist_gap
- domain: process
- confidence: 75
- severity: Medium
- evidence: DQ anchors appear throughout the draft without local definitions; `rg -n "T[13]-DQ-[0-9]" draft-iter1.md` found uses but no matching defining glossary.
- surfaced-by: codex
- disposition: open
- detail: Add a compact DQ index or replace anchors with concrete decision names to preserve traceability.

Verdict: REVISE

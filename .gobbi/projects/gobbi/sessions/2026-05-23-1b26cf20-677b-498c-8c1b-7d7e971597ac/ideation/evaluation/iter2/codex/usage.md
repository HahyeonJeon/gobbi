## Artifact Summary + Memory reads
Shared Stage 0 summary: see `project.md`. This Usage pass evaluates whether the next Planner, Executor, operator, and future maintainer can use the iter2 draft without inventing missing details.

Memory reads:
- full `draft-iter2.md`
- iter1 Usage files from Codex and Claude
- `.agents/skills/ideation/evaluation.md`
- empirical transcript line 164-165 checks
- official hooks doc check
- project mistakes

## Locked Frame (Stage 1)
Scenario U1: Planner can produce tasks without asking how to implement T3 resolver/correlation.
- Check U1.1: Resolver inputs and fallback behavior are explicit.
- Check U1.2: Transcript correlation paths are explicit.
- Check U1.3: Input-side metadata extraction and result-side telemetry extraction are separated.

Scenario U2: Executor can satisfy the branch/worktree success criterion.
- Check U2.1: The branch name is valid under the repo convention.
- Check U2.2: The validation command is concrete.

Scenario U3: Operator can validate `agents[]` population and failure entries.
- Check U3.1: 90% field-population denominator is defined.
- Check U3.2: Failed-spawn status behavior is visible despite schema deferral.
- Check U3.3: Hook/reconstructor failure paths emit diagnosable messages or recovery commands.

Scenario U4: Accessibility/I18n awareness.
- not-applicable: this is an internal workflow docs + shell-script design with no UI. Operator-facing strings are covered under observability.

Scenario U5: Observability / diagnosable at 3am.
- Check U5.1: Hook or resolver failure can be recognized.
- Check U5.2: Reconstructor can repair or report orphan entries.

## Per-scenario per-check results
U1.1: PASS. D-3-3-resolver defines project lookup, session-dir scan, and non-zero stderr on ambiguity.

U1.2: PASS. D-3-6 gives exact `jq` paths, and empirical checks confirmed both lines match the prior transcript.

U1.3: PASS. D-3-4 clearly states `tool_input.prompt`/`tool_input.model` are input-side, while `toolUseResult` is output telemetry.

U2.1: FAIL. `session/{date}-{ssid-short}` fails the branch validator. This is the user-facing blocker for an Executor trying to implement T1.

U2.2: PASS. The validation command is concrete: test branch name against the regex before `git worktree add -b`.

U3.1: PASS. `draft-iter2.md:52` defines the denominator as the 12 schema fields times N entries.

U3.2: PASS. Scope and checklist keep `status: "failed"` visible and defer formal template bump to a feature backlog item.

U3.3: PARTIAL. Resolver ambiguity exits non-zero with explicit stderr strings; reconstructor is the recovery path. The draft still lacks a full "hook silently wrote nothing" diagnostic procedure, but this is lower severity after D-3-3-resolver/D-3-6.

U5.1: PARTIAL. Resolver messages are named; hook stderr destination in Claude Code remains not fully specified.

U5.2: PASS. Reconstructor reports orphans and does not delete.

## Typed findings
### COD-USAGE-001 — Path surface usability resolved
- type: design_flaw
- domain: docs-sync
- disposition: addressed
- confidence: 75
- severity: High
- inherited-from: iter1/codex/usage-COD-USAGE-001
- evidence: CL-1 at `draft-iter2.md:285` explains the path-surface split and why this draft targets `.claude/skills`.

### COD-USAGE-002 — Session-dir resolver usability resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/codex/usage-COD-USAGE-002
- evidence: D-3-3-resolver at `draft-iter2.md:359-373` gives implementable lookup and error behavior. Current repo empirical check confirms absent `.gobbi/project.json` plus sole project directory fallback.

### COD-USAGE-003 — Field-population denominator resolved
- type: checklist_gap
- domain: observability
- disposition: addressed
- confidence: 75
- severity: Medium
- inherited-from: iter1/codex/usage-COD-USAGE-003 and iter1/codex/overall-COD-OVERALL-003
- evidence: Success criteria at `draft-iter2.md:52` define the denominator as the 12 schema fields times N entries and define the threshold as fewer than 10% null cells.

### COD-USAGE-004 — Structured-header migration behavior resolved
- type: checklist_gap
- domain: process
- disposition: addressed
- confidence: 75
- severity: Medium
- inherited-from: iter1/codex/usage-COD-USAGE-004
- evidence: T3-I-T3.e at `draft-iter2.md:280` adds a migration paragraph: existing prompts lacking headers produce `null` for step/phase/iter until prompt-template refresh.

### COD-USAGE-005 — Executor-facing branch instruction remains invalid
- type: design_flaw
- domain: regression
- disposition: open
- confidence: 100
- severity: High
- surfaced-by: codex
- evidence: D-1 instructs `session/{date}-{ssid-short}`. The repo branch validator rejects `session/` as a prefix. See Project finding COD-PROJ-001.
- impact: An Executor can follow the draft exactly and fail before the first worktree is created.

### CLAUDE-U1 — `status` extra-property remains deferred with pointer
- type: design_flaw
- domain: observability
- disposition: deferred
- confidence: 75
- severity: Medium
- inherited-from: iter1/claude/usage-U1 and iter1/codex/consistency-COD-CONS-003
- evidence: `draft-iter2.md:32` and `draft-iter2.md:58` defer `session.template.json.agents[]` `status` field extension to `staging/backlogs/feature/schema-extension-agents-status-field.md`.

### CLAUDE-U2 — Hook-silence diagnostic remains partially open
- type: design_flaw
- domain: observability
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/claude/usage-U2
- evidence: D-3-3-resolver names stderr errors and reconstructor recovery, but no dedicated "diagnose hook silently wrote nothing" procedure or hook-stderr destination is documented.
- impact: Not a blocker for Ideation because reconstructor is explicit, but Planning should keep a diagnostic checklist item.

## Low-confidence appendix
Low-confidence note: Accessibility/I18n are correctly not applicable to UI, but shell stderr strings should remain plain and stable because operators may grep them.

Verdict: REVISE

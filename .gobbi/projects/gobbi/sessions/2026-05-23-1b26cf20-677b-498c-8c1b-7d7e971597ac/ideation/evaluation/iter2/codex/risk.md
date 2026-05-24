## Artifact Summary + Memory reads
Shared Stage 0 summary: see `project.md`. This Risk pass evaluates blast radius, rollback, shared-state safety, branch-convention failure impact, privacy/retention, and recovery paths.

Memory reads:
- full `draft-iter2.md`
- all iter1 Risk files
- `.claude/skills/git/SKILL.md`
- `.claude/skills/git/conventions.md`
- project mistakes, especially write-path, rm-rf, rescue fire-and-forget, and verification-claim mistakes
- official hooks doc and empirical transcript checks

## Locked Frame (Stage 1)
Scenario R1: Shared mutable `session.json` writes do not lose data.
- Check R1.1: Hook and reconstructor serialize read-modify-write.
- Check R1.2: Recovery remains available if hook crashes.
- Check R1.3: Duplicate events upsert rather than duplicate.

Scenario R2: Worktree creation failure is bounded and recognized before mutation.
- Check R2.1: Branch name validates before `git worktree add`.
- Check R2.2: Invalid branch name does not reach destructive cleanup paths.
- Check R2.3: Direct mode remains an opt-out.

Scenario R3: Partial promotion and commit failure recovery are explicit.
- Check R3.1: Commit failure after file copy has rollback semantics.
- Check R3.2: Worktree cleanup respects no-force rules.

Scenario R4: Privacy/data retention and license/IP are addressed or explicitly bounded.
- Check R4.1: Persisted agent telemetry is classified as non-PII or gets a retention note.
- Check R4.2: No external copied code or new dependency license is introduced.

Scenario R5: Cross-layer drift has a review gate.
- Check R5.1: The draft recognizes `.claude`, `.agents`, and `.gobbi` surfaces.
- Check R5.2: A whole-file or cross-layer review gate is kept for Execution.

## Per-scenario per-check results
R1.1: PASS. D-3-5 uses exclusive locks before read for hook and reconstructor.

R1.2: PASS. Reconstructor remains the repair path.

R1.3: PASS. Upsert-by-id remains in G-1/G-2 and D-3-2.

R2.1: FAIL. The chosen branch prefix `session/` does not validate.

R2.2: PASS. This failure occurs at precondition validation time, before any destructive cleanup.

R2.3: PASS. Direct mode remains available.

R3.1: PASS. D-3 adds rollback: if `git commit` fails post-copy, manager runs `git -C "$worktreePath" rm` on the copied file and asks the user before retry.

R3.2: PASS. Existing git skill forbids forced cleanup without user approval; no iter2 design contradicts it.

R4.1: PARTIAL. F9 states no PII or sensitive data surface is introduced and defers a formal privacy note. There is no backlog pointer.

R4.2: PASS. No external code is copied and no new package dependency is introduced.

R5.1: PASS. CL-1 recognizes the path surfaces.

R5.2: PARTIAL. `draft-iter2.md:426` requires whole-file scans for touched skill files, but there is no broader explicit "cross-layer drift gate" statement matching `git/SKILL.md`'s warning.

## Typed findings
### COD-RISK-001 — Concurrent hook lost-update risk resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/codex/risk-COD-RISK-001 and iter1/claude/risk-R1
- evidence: D-3-5 at `draft-iter2.md:388-393` specifies `flock -x` on `session.json` for every read-modify-write cycle in hook and reconstructor.

### COD-RISK-002 — Resolver failure risk resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/codex/risk-COD-RISK-002
- evidence: D-3-3-resolver at `draft-iter2.md:359-373` supplies project/date/session lookup and deterministic error behavior. Empirical current-repo fallback was verified.

### COD-RISK-003 — Privacy/retention note remains open
- type: checklist_gap
- domain: privacy
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/codex/risk-COD-RISK-003
- evidence: F9 at `draft-iter2.md:502` says privacy/retention is deferred and asserts persisted data is non-PII, but no formal privacy note or backlog item is staged.
- impact: Medium residual risk. The data appears low-sensitivity, but a session-memory design should state retention expectations.

### COD-RISK-004 — Cross-layer drift gate partially addressed
- type: checklist_gap
- domain: docs-sync
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/codex/risk-COD-RISK-004
- evidence: CL-1 and the whole-file scan reminder reduce the risk, but the validation table does not add an explicit cross-layer drift review gate for hooks/settings/skills/session metadata.
- impact: Planning should carry a review task so a future PR does not update only one path surface.

### COD-RISK-005 — Invalid branch prefix creates a preflight failure
- type: design_flaw
- domain: regression
- disposition: open
- confidence: 100
- severity: High
- surfaced-by: codex
- evidence: D-1 branch prefix fails the documented branch regex. This is not destructive by itself, but it blocks the default worktree-first session before row 5.5 can satisfy T1 success criteria.

### CLAUDE-R2 — Partial promotion rollback resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 75
- severity: Medium
- inherited-from: iter1/claude/risk-R2
- evidence: `draft-iter2.md:310` and T1-I-T1.j at `draft-iter2.md:272` specify rollback if `git commit` fails post-copy.

### CLAUDE-R3-R4 — Shared helper and interrupted commit residuals remain non-blocking
- type: scenario_gap
- domain: process
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/claude/risk-R3 and iter1/claude/risk-R4
- evidence: Iter2 does not factor shared jq into a helper and does not add an explicit interrupted per-iteration commit recovery scenario. These remain Planning/Execution checklist items but do not drive the current verdict over the branch-name blocker.

## Low-confidence appendix
Low-confidence note: If the branch prefix is corrected to an allowed type, the Risk verdict would likely drop to PASS/REVISE only on the remaining Medium privacy/cross-layer residuals.

Verdict: REVISE

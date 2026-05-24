# Risk — iter2 Claude

## Stage 0 — Artifact Summary
See `project.md`. iter2's primary risk-relevant changes: D-3-5 (flock serialization), T1-I-T1.j (partial-promotion rollback), F-4 (branch naming).

## Stage 1 — Locked Frame

### Scenarios (Risk)

**S-R-1 (carry)** — Rollback path identified — iter1 PASS.
**S-R-2 (carry)** — Blast radius bounded — iter1 PASS.
**S-R-3 (carry)** — Security surface — iter1 PASS.
**S-R-4 (carry)** — Irreversible steps gated — iter1 PASS.
**S-R-5 (carry)** — Two-week smell test — iter1 PARTIAL.
**S-R-6 (carry, adversarial)** — Scope drift — iter1 PASS.
**S-R-7 (carry)** — Concurrency surface — iter1 R1 FAIL (lost-update race); iter2 D-3-5 addresses. Verify.
**S-R-8 (carry)** — Privacy — iter1 PASS / not-applicable; codex deferred via F-9.
**S-R-9 (carry)** — License/IP — iter1 PASS.
**S-R-10 (carry)** — Cost — iter1 PASS.
**S-R-11 (carry)** — Hook script writes shared file — iter1 PARTIAL/FAIL; iter2 D-3-5.
**S-R-12 (carry)** — Sole-writer extension — iter1 PARTIAL (no rollback); iter2 T1-I-T1.j adds rollback. Verify.
**S-R-13 (NEW iter2, adversarial)** — F-4 branch-naming convention assumption — does the proposed name actually pass the git skill's branch validator?
**S-R-14 (NEW iter2, adversarial)** — flock-on-locked-file inode-replacement race (cross-ref structure.md S1).

## Stage 2 — Findings

### S-R-7 (concurrency surface) + S-R-11 (hook shared-write)

D-3-5 (line 388) explicitly addresses both. Pattern: `exec {fd}>>"$session_json"; flock -x "$fd"` BEFORE read-modify-write in both hook and reconstructor. Lock-release on process death (POSIX). Disposition: iter1 R1 — addressed. Refinement noted at S-R-14 below.

### S-R-12 (sole-writer extension rollback)

T1-I-T1.j (line 272): "if `git commit` fails after the file copy, the manager MUST `git -C \"$worktreePath\" rm` the copied file before surfacing to user via AskUserQuestion." D-3 narrative (line 310) restates: "if `git commit` fails post-copy, manager `git -C \"$worktreePath\" rm` the copied file and AskUserQuestion before re-attempt." F-4 scenario (line 224) explicit. Disposition: iter1 R2 — addressed.

### S-R-13 (NEW — F-4 branch-naming assumption)

**FAIL.** See project.md P1 + consistency.md C1. F-4's branch name shape will FAIL the `git/conventions.md:22` regex on the first invocation of git P2 at row 5.5. This converts Configuration Step 1's row 5.5 from a "mechanical step" into a "user-blocking error" — defeating T1's success criterion ("worktreePath non-null immediately after Configuration"). Recovery: branch validator surfaces error to user; row 6 stamps null; manager re-derives. The recovery is documented in F-3 scenario (line 223) generically ("Worktree creation fails at row 5.5 (branch collision, install error). Manager surfaces error via AskUserQuestion") — but the failure mode is now CERTAIN, not edge-case. **Adversarial risk lens: a fix-decision (F-4) chose a value that the verifier (git/conventions.md regex) will reject.**

### S-R-14 (NEW — flock-on-locked-file edge case)

PARTIAL — see structure.md S1. The atomic temp+mv replacement of `session.json` releases the lock on the OLD inode; the next hook opens the NEW inode and acquires its own lock. The race window is narrow (between the OLD lock release and the NEXT hook's flock-acquire on the new inode) and the next hook would read the post-mv state correctly. The lost-update primary race is closed. However, the recommended pattern is to lock a SIDECAR file that is never replaced. Refinement, not blocker.

### S-R-5 (two-week smell test refinement)

R3 from iter1 (Goodhart-flag on "factor to a sourced helper only if iter2 evaluation demands") — iter2 does NOT factor; the inline jq is now in TWO scripts (hook + reconstructor). After iter2 evaluation passes without flagging this, the deferral becomes structurally indefinite. iter2 added validation pattern (`flock-coordinated double-run`) but did NOT factor. R3 disposition: deferred (the Goodhart pattern persists).

### Typed findings

```yaml
finding-id: R1-iter2
type: design_flaw
domain: process
disposition: addressed
confidence: 100
severity: High
surfaced-by: claude
inherited-from: iter1/claude/risk R1 + iter1/codex/structure COD-STRUCT-002
```
**R1 (carry-forward, addressed)** — D-3-5 POSIX `flock -x` serializes hook AND reconstructor. Primary lost-update race closed. Refinement at R4 below (sidecar lock recommendation).

```yaml
finding-id: R2-iter2
type: design_flaw
domain: process
disposition: addressed
confidence: 100
severity: Medium
surfaced-by: claude
inherited-from: iter1/claude/risk R2
```
**R2 (carry-forward, addressed)** — Partial-promotion rollback specified in T1-I-T1.j + D-3 narrative + F-4 scenario. Manager `git -C rm` the copied file before AskUserQuestion.

```yaml
finding-id: R3-iter2
type: assumption_risk
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
inherited-from: iter1/claude/risk R3
```
**R3 (carry-forward, NOT addressed)** — Goodhart pattern persists: iter2 has TWO scripts with shared jq extraction logic (hook + reconstructor); the "factor to sourced helper only if eval demands" deferral is structurally indefinite once iter2 passes. Suggested direction (still): either factor now into `.claude/scripts/lib/extract-agent-fields.sh`, or open a tracked backlog item for "DRY review of agents[] extraction logic after next jq change."

```yaml
finding-id: R4-iter2
type: design_flaw
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
inherited-from: none (NEW iter2 — flock+mv refinement)
```
**R4 (NEW iter2 — Refinement)** — D-3-5 locks `session.json` itself, then atomically replaces it via temp+mv. The lock is on the open-file-description tied to the OLD inode; the new inode (post-mv) has no lock. The narrow race window (between old-lock-release and next-hook's flock-acquire on new inode) means the lost-update PRIMARY race is closed (the next hook reads the post-mv state), but the textbook-correct pattern uses a sidecar lock file (`session.json.lock`) that is NEVER replaced. Suggested direction: change D-3-5 to lock on `session.json.lock` sidecar.

```yaml
finding-id: R5-iter2
type: design_flaw
domain: process
disposition: open
confidence: 100
severity: High
surfaced-by: claude
inherited-from: none (NEW iter2 — F-4 regression)
```
**R5 (NEW iter2 — Risk lens on F-4)** — F-4's branch-name shape CERTAINLY fails the `git/conventions.md:22` regex (see project.md P1, consistency.md C1). From the Risk perspective: this converts row 5.5's "mechanical worktree creation" into a guaranteed-error path. The success criterion ("`git.worktreePath` non-null immediately after Configuration") cannot be satisfied. The first session to consume this design FAILS at row 5.5. Evidence: draft D-1 (line 296), F-4 (line 492), validation regex (line 301); `git/conventions.md:22`. Suggested direction: pick a registry-compliant prefix.

```yaml
finding-id: R6-iter2
type: scenario_gap
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
inherited-from: iter1/claude/risk R4
```
**R6 (carry-forward, NOT addressed)** — No scenario covers "abort during per-iteration session-memory commit." E-3 covers abort-before-merge; iter2 did not add E-3.5 for mid-commit interruption. Recommendation persists.

### Low-confidence appendix
- (none above 25)

## Verdict
**FAIL** — R5 is High / Confidence 100 (Risk perspective confirms project.md P1: F-4's branch name CERTAINLY fails on first invocation, defeating T1 success criterion). R1/R2 addressed; R3/R4/R6 remain Medium open. Per per-perspective threshold: any High at confidence ≥ 50 → REVISE; here Confidence is 100 + the design-flaw makes the next session fail → effectively FAIL.

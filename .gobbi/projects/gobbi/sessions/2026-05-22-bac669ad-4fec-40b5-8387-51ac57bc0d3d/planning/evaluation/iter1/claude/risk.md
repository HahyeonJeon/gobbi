# Risk Perspective — Planning Evaluation iter1

## Artifact Summary + Memory reads

Same as project.md. Evaluating: rollback granularity, ordering robustness to interruption, blast radius, irreversible operations, hidden fragility at execution time.

**Memory reads:** same as project.md.

---

## Locked Frame (Stage 1)

### Scenario 1: If a mid-plan task fails, rollback boundary is clear
Checklist:
- [ ] Each task is a single focused commit (bisect-safe claim in plan summary)
- [ ] Failing between tasks leaves project in coherent state

### Scenario 2: The git executable bit for session-start.sh is reliably preserved across git
Checklist:
- [ ] `chmod +x` result is preserved by git (tracked in index)
- [ ] Plan verifies executable bit is committed, not just set locally

### Scenario 3: jq @sh fixture determinism
Checklist:
- [ ] `jq -r @sh` output for a given input is deterministic across jq versions?
- [ ] Fixture uses a path with spaces AND single quote — is the test exhaustive enough?

### Scenario 4: Plan ordering robust to interruption at any task boundary
Checklist:
- [ ] Stopping after T3 (gobbi/SKILL.md renamed but P1 rename incomplete): coherent?
- [ ] Stopping after T5 (orchestration docs updated but P7 not reworded): coherent?

### Scenario 5 (adversarial): M1 manager stamp timing — what if M1 runs before T5?
Checklist:
- [ ] M1 depends on T5 (procedure text) AND T7 (PR open). Is this enforced?
- [ ] M1 writes main-tree session.json; T1-T7 write worktree. No path confusion?

### Scenario 6: `.claude/settings.json` mutation is irreversible if backup is absent
Checklist:
- [ ] T2 says "preserve `enabledPlugins` and `permissions` keys verbatim" — is there a backup step?
- [ ] If T2 corrupts settings.json, what is the recovery path?

### Scenario 7: High-blast-radius operations gated (adversarial)
Checklist:
- [ ] T7 `gh pr create` is the blast-radius gate — is there a go/no-go check before it?
- [ ] All verification commands in T7 must pass before PR open (enforced in How step 2)?

### Scenario 8: Hook script executable bit across git (adversarial)
Checklist:
- [ ] Does T1's verification check that git tracks the executable bit?
- [ ] Does T7's verification check the executable bit is still set post-commit?

---

## Per-scenario per-check results

### Scenario 1: Rollback boundary
Plan summary: "Commits land per task (bisect-safe)." T1-T6 each produce one focused commit. PASS — if T4 fails, the state has T1-T3 committed, which is a coherent state (partial rename, but gobbi/SKILL.md is the anchor; the partial state is documented in the commit history).

**Minor concern:** a partial P1 rename (T3 done, T4 partially done) would leave 5-10 files with the old name while gobbi/SKILL.md has the new name. This is a coherent intermediate state (skills still load; the runtime CCSI var works regardless of doc names) but not a pretty one. Acceptable for a bisect-safe worktree branch.

### Scenario 2: Git executable bit preservation
**Finding F-RISK-01:**
- Type: `assumption_risk`
- Domain: `process`
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: T1 How step 3: `chmod +x .claude/hooks/session-start.sh`. T1 success criteria: "mode `0755`". T1 verification: `test -x .claude/hooks/session-start.sh`. T7 verification criterion 3: `test -x .claude/hooks/session-start.sh`.
- Why it matters: `chmod +x` sets the executable bit in the filesystem, but the bit is only preserved in git if `git add` stages it as mode `100755`. If the executor writes the file then stages it with a tool that does not preserve the mode (e.g., `Write` tool followed by `git add`), the bit may be lost in the commit. T7's criterion 3 runs `test -x` in the worktree CWD — this checks the filesystem bit, NOT the committed bit. A consumer of the squash-merged commit on a fresh checkout would have the bit if git stored `100755`, but the plan does not include `git ls-files --format='%(objectmode) %(path)'` to verify the committed mode.
- Suggested direction: Add `git ls-files -s .claude/hooks/session-start.sh | grep '100755'` to T1's verification block (or T7's criterion 3) to confirm git is tracking the file with the executable mode, not just that the local filesystem bit is set.

### Scenario 3: jq @sh determinism
`jq -r @sh` is deterministic: single-quotes the value, escapes embedded single quotes as `'\''`. Output is identical across jq ≥ 1.5. The fixture covers a space and a single quote — this is sufficient for the common failure modes. PASS.

### Scenario 4: Interruption coherence
**Stop after T3:** gobbi/SKILL.md has CLAUDE_CODE_SESSION_ID (new) but the other 11 files still have CLAUDE_SESSION_ID (old). The two vars can coexist in the skill set temporarily — no runtime breakage (the runtime itself sets CLAUDE_CODE_SESSION_ID regardless). Skills documentation is transiently inconsistent but not broken. COHERENT. PASS.

**Stop after T5:** orchestration docs have `transcriptPath` documented; P7 files still cite `$CLAUDE_TRANSCRIPT_PATH` as the only source. Transiently inconsistent documentation (new field exists but not all consumers updated), but no operational breakage. COHERENT. PASS.

### Scenario 5: M1 timing
M1 dependency field: "T5 (procedure must be documented before manager follows it); also functionally requires T7 PR open." Both T5 and T7 are listed as explicit dependencies. M1 is manager-direct (not an executor task) — the manager controls ordering. M1 writes to main-tree `session.json`; T1-T7 write to worktree paths. Path confusion cannot occur because the plan explicitly states "MAIN tree absolute path" for M1 (line 300). PASS.

### Scenario 6: settings.json mutation recovery
T2 How step 1: "Read `.claude/settings.json`; preserve `enabledPlugins` and `permissions` keys verbatim." T2 verification checks `enabledPlugins` + `permissions` keys are byte-identical post-edit. There is no explicit backup step.

**Finding F-RISK-02:**
- Type: `assumption_risk`
- Domain: `process`
- Disposition: open
- Confidence: 50
- Severity: Low
- Evidence: T2 has no backup step before mutating `.claude/settings.json`. T2's verification checks post-edit state; it does not create a recovery artifact.
- Why it matters: If T2 corrupts `settings.json` (e.g., jq round-trip changes formatting or the executor's Edit call introduces a JSON syntax error), the recovery path is either `git checkout` (if staged) or manual reconstruction. Given that the file is git-tracked, `git checkout -- .claude/settings.json` is always available as recovery, which makes this Low severity. The risk is real but mitigated by git.
- Suggested direction: Add `git diff .claude/settings.json` as an explicit T2 How step before committing, to confirm the change is minimal and correct. Low priority.

### Scenario 7: T7 go/no-go gate
T7 How step 2: "If any command fails, halt and report BLOCKED with the failure to manager — do NOT open the PR." The verification commands in T7 must all pass before `gh pr create` is invoked. PASS.

### Scenario 8: Hook script executable bit in git (same evidence as F-RISK-01 above)
T7 criterion 3 verifies the filesystem bit (`test -x`) but not the git-committed mode. This is the same gap as F-RISK-01 — already recorded.

---

## Typed findings

| ID | Type | Domain | Disposition | Confidence | Severity |
|----|------|--------|-------------|------------|----------|
| F-RISK-01 | `assumption_risk` | `process` | open | 75 | Medium |
| F-RISK-02 | `assumption_risk` | `process` | open | 50 | Low |

**Privacy/data-retention:** not-applicable (no PII in scope).
**Cost/budget:** not-applicable (no paid API calls in verification beyond standard `gh` CLI).
**Supply-chain:** not-applicable (no new dependencies introduced).
**Observability:** not-applicable (all tasks are human-observable doc edits).

## Low-confidence appendix

(none — F-RISK-02 at 50 is above suppression threshold; included in main findings)

**Risk perspective verdict: PASS** (two findings: one Medium, one Low; neither Critical or High)

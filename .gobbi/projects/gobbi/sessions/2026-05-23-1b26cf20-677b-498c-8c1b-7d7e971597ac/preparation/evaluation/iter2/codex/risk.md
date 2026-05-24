## Artifact Summary + Memory reads

What: Risk evaluates what breaks if iter2's corrected Preparation output is still wrong or incomplete. Why: false mirror/edit guidance can affect T1's session-architecture edits and future skill-file edits. How: iter2 fixes the false mirror premise and audit trail, but must also leave Planning with a safe operational contract. Scope: T1/T3 Preparation readiness; not Memory Access Matrix cleanup. Consumers: Planning, executors, Wrap-up, and later sessions that read promoted decisions.

Memory reads: `draft-iter2.md`; five target staging files; iter1 Codex/Claude evaluations; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; project rule; all eight listed mistakes; evaluation docs. Verification: required symlink and workflow commands, status greps, staging list, `git ls-files -s` path-mode check, and temporary symlink rewrite check.

## Locked Frame (Stage 1)

Scenario R1: The user-locked false premise is no longer live.
- Check R1.1: The old user lock is superseded.
- Check R1.2: The new user lock is recorded with corrected evidence.
- Check R1.3: The obsolete sync backlog cannot be picked up as a live task.

Scenario R2: No Preparation write violates the session-staging boundary.
- Check R2.1: New accepted decision is session-staged.
- Check R2.2: Superseded files remain session-staged.
- Check R2.3: No direct project-memory write is introduced.

Scenario R3: 5-vs-7 ambiguity no longer risks accidental over-edit.
- Check R3.1: The five target docs are explicit.
- Check R3.2: The excluded docs are explicit.
- Check R3.3: The Planning gate can catch over-edit.

Scenario R4 (adversarial): The corrected guidance can still break the symlink layer.
- Check R4.1: The artifact warns that workspace paths are symlinks.
- Check R4.2: It guards against symlink replacement by unsafe edit tools.
- Check R4.3: It requires verification that symlinks remain intact after workspace-path edits.

Privacy/data retention: not applicable; internal markdown contains no PII. License/IP: not applicable; no external code copied. Cost/budget: only downstream rework risk.

## Per-scenario per-check results

R1.1: Yes. The old policy is `status: superseded`.
R1.2: Yes. The new policy records 53 symlinks and the round-2 AskUserQuestion lock.
R1.3: Yes. The sync backlog is superseded as moot.
R2.1: Yes. The new decision is under session `preparation/staging/decisions/`.
R2.2: Yes. Superseded old files remain in session staging.
R2.3: Yes. No direct project-memory write is present in the staging list.
R3.1: Yes. D-4 names the five loop docs.
R3.2: Yes. D-4 names the two excluded sub-phase docs.
R3.3: Yes. D-4 includes a positive/negative grep gate.
R4.1: Yes. The artifact repeatedly says workspace paths are a symlink runtime layer.
R4.2: No. It does not warn that tools such as `sed -i` can replace the symlink and split workspace from mirror.
R4.3: No. No symlink-preservation verification gate is included.

## Iter1 finding dispositions

ID: COD-RISK-PREP1-001
disposition: superseded
evidence: The "workspace is standalone" belief is corrected, but the symlink replacement risk remains in narrower form as COD-RISK-PREP2-001.

ID: COD-RISK-PREP1-002
disposition: addressed
evidence: The old auto-sync policy is superseded and the sync backlog is closed as moot.

ID: COD-RISK-PREP1-003
disposition: superseded
evidence: R4.1-R4.3 are now inherited in the risk frame and identify the narrower remaining edit-method guard.

ID: COD-RISK-PREP1-004
disposition: addressed
evidence: Iter2 preserves the conclusion that no T1/T3 RE-IDEATE trigger exists; the issue remains Preparation-local.

## Typed findings

ID: COD-RISK-PREP2-001
Type: assumption_risk
Domain: write-safety
Disposition: open
Confidence: 100
Severity: High
Evidence: The artifact recommends workspace-path citations for skill edits but lacks a guard against replacing tracked workspace symlinks. Repository evidence shows `.claude/skills/...` files are tracked symlinks (`120000`), and a temporary `sed -i` check demonstrates a common rewrite path can replace a symlink with a regular file while the canonical target remains unchanged. If T1 task briefs copy the current guidance, an executor can accidentally create a divergent workspace file and break the runtime-link contract.
surfaced-by: codex

## Low-confidence appendix

None.

VERDICT: REVISE

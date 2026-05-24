# Preparation iter1 — RISK perspective (Claude)

Perspective: risk (downstream blast radius of each Preparation decision)
Verdict: **REVISE**

## Findings

### F-R1 (Critical, Confidence 100, design_flaw / process)

**Risk: User locked a policy on a false empirical premise.**

The user's "workspace canonical, mirror auto-syncs" decision was made on the leader's report that "directories are real, not symlinks." But file-level symlinks exist throughout (`.claude/skills/*/SKILL.md` and related files). The user did not have the corrected topology when they locked the policy.

Downstream blast:
- Every future Preparation/Planning session that reads the mirror policy decision file inherits the false framing.
- Future implementer of the `workspace-to-mirror-sync-mechanism` backlog will build a SECOND sync mechanism redundant with the existing symlinks.
- Documentation drift: the canonical decision file says "verified via `ls -la` shows real directories with `drwxrwxr-x` permissions" (line 17) — that's now baked into project memory as a verified claim when it's actually an incomplete check.
- Worst case: T1's executor briefs include "edit workspace path only" but in practice `vim .claude/skills/orchestration/SKILL.md` follows the symlink — confusing the executor and any reviewer who runs `git diff` (which will show the diff on the mirror file, not the workspace file).

Mitigation: re-empirically verify, re-present to user, allow user to re-direct or re-confirm with corrected information. **This is a user-input step the manager must facilitate.**

### F-R2 (High, Confidence 100, design_flaw / process)

**Risk: Planning will trip on the 5-vs-7 phase doc ambiguity.**

If the Planning brief tells executor "edit all 5 workflow phase docs" and the executor runs `ls`, they see 7. They will either ask for clarification (cheap — costs one round-trip) or guess (bad — either silently misses 2 or silently adds 2). With Bundle B's high-stakes session-architecture surface, the cost of a silent miss is real downstream drift.

Mitigation: D-4 staging file explicitly enumerates 5 by name AND explicitly justifies the exclusion of evaluation.md + memorization.md.

### F-R3 (High, Confidence 100, design_flaw / process)

**Risk: Conflicting mirror-edit guidance will fork Planning briefs.**

The mirror policy decision says "edit workspace only" but the conditional backlog says "manually mirror-edit" and the draft says "Recommended for Bundle B because T1's edits are load-bearing." Three rules, three different directions. Planning brief author has to pick one — and which one they pick will silently shape the executor's behavior.

Mitigation: re-resolve the contradiction post-mirror-topology-recheck (F-R1). After F-R1 is settled, one of the three rules survives; the other two are retired.

### F-R4 (Medium, Confidence 100, assumption_risk / process)

**Risk: D-3 binding is enforceable but only if Planning evaluator actually runs the grep.** The decision says "the Planning evaluator can mechanically check brief compliance: grep each T1 task brief for the three file basenames." But this only happens if the evaluator's brief explicitly demands it. The Preparation output does not bind the Planning evaluator's brief — it binds Planning's. Recommend that the Planning brief itself includes "Planning evaluator MUST grep each T1 brief for the 3 file basenames" so the discipline survives the handoff.

Confidence 100 on the existence of the gap; suggestion is for downstream manager construction.

### F-R5 (Medium, Confidence 75, assumption_risk / process)

**Risk: WORK-introduced artifact (sync-mechanism backlog) bypasses DISCUSSION discipline.**

Per `preparation/SKILL.md` § 274, WORK should not introduce new design decisions. The leader executed an empirical scan in WORK that produced a finding ("no mechanism") that triggered a new artifact (the conditional backlog). The backlog is sensible, but the discipline boundary was crossed without re-entering DISCUSSION. Risk: this normalizes WORK-time scope creep for future loops.

Mitigation: project rule clarification — empirical confirmation scans in WORK are fine, but if the scan produces a result NOT covered by the locked gap-resolution plan, return to DISCUSSION before staging a new artifact.

## Must-preserve list

- The pattern of empirical confirmation in WORK (run commands, paste output) — preserve, but apply rigorously (don't stop at directory layer when files matter).
- The explicit "user lock" pointer in each decision file — preserve, makes provenance auditable.

## Verdict

**REVISE** — F-R1 (Critical) raises a user-input round-trip; F-R2 and F-R3 (High) raise Planning-stage rework risk. All three are addressable with focused remediation.


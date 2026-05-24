# Preparation iter2 — RISK perspective (Claude)

Perspective: risk (downstream failure modes, lurking assumptions, brittle commitments)
Verdict: **PASS**

## Frame (Stage 1)

Scenario R1: Planning will not trip on the mirror topology (corrected lock + on-disk evidence agree).
Scenario R2: Planning will not trip on the 5-vs-7 phase doc ambiguity (D-4 explicit + grep gate).
Scenario R3: Planning brief authors get one unambiguous edit topology (no contradiction across artifacts).
Scenario R4: The corrected mirror lock does not introduce a new failure mode (e.g., symlink-fragility assumptions, cross-OS).
Scenario R5 (adversarial): Future loops won't repeat the iter1 "directory-only scan" failure mode.

## Per-scenario results

R1: PASS. iter2 corrected lock is empirically grounded (53 symlinks + sample target shown in 3 artifacts). Planning task brief authors can cite either path and verify outcomes via either path.

R2: PASS. D-4 explicit 5-file enumeration + Excluded files rationale + dual grep gate close the silent-miss failure mode.

R3: PASS. iter1 F-R3 (three contradictory rules) → one rule. "Manual mirror-edit recommended" interim discipline explicitly rescinded in draft line 187, mirror-canonical-symlinks.md line 57, and Notes for Planning intake line 235.

R4: PASS. The corrected lock relies on the existing 53-symlink layer (no new infrastructure). Symlink fragility cross-OS is an issue only if someone migrates the project to Windows / non-symlink-supporting filesystem — not a Bundle B scope concern. The mirror-canonical-symlinks decision file's "Alternatives considered" section line 52 explicitly notes symlinking is "out-of-scope for this Bundle" per user (no mass-migration risk introduced).

R5: PASS. The new decision file's "Empirical reference" section (lines 65-68) shows the `find -type l` command + sample target + workflow dir listing — future re-verification has a documented gold-standard procedure. The pre-loaded mistake `leader-iter2-verification-claim-without-evidence.md` is also explicitly cited in `Related` (line 78) as the lesson that drove the iter2 correction.

## Findings

### F-R1-iter2 (Low, Confidence 100, general / process)

**Cross-iter disposition: iter1 F-R1 (Critical/100 false-premise lock) → addressed.**

Evidence: user re-lock via round-2 AskUserQuestion on corrected 53-symlink evidence (cited in mirror-canonical-symlinks.md line 31, Related line 72). The user input round-trip iter1 demanded has been completed.

### F-R2-iter2 (Low, Confidence 100, general / process)

**Cross-iter disposition: iter1 F-R2 (High/100 5-vs-7 risk) → addressed.**

D-4 explicit enumeration + scenario F-1 (off-by-one) at line 51 + dual grep gate at lines 102-109 close the silent-miss failure path.

### F-R3-iter2 (Low, Confidence 100, general / process)

**Cross-iter disposition: iter1 F-R3 (High/100 conflicting mirror-edit guidance) → addressed.**

Three rules → one rule, with the rescission of the "manual mirror-edit" interim discipline stated explicitly in 3 places. No fork remains for Planning brief authors.

### F-R4-iter2 (Low, Confidence 100, general / process)

**Cross-iter disposition: iter1 F-R4 (Medium/100 D-3 grep enforcement gap) → preserved as a Planning-time concern.**

iter2 did not change D-3. The Planning brief itself needs to demand the evaluator run the grep — this is downstream of Preparation and not addressable by iter2 surgical scope. Notes for Planning intake line 237 reminds Planning of the grep gate. Acceptable disposition.

### F-R5-iter2 (Low, Confidence 75, general / process)

**Cross-iter disposition: iter1 F-R5 (Medium/75 WORK-discipline boundary) → indirectly addressed.**

The artifact that triggered F-R5 (WORK-introduced sync-mechanism backlog) is now closed as moot. iter2 itself did not repeat the WORK-time scope creep. The discipline-boundary lesson is not codified into a project rule (out of iter2 scope) but the offending artifact is neutralized.

### F-R6-iter2 NEW (Low, Confidence 50, assumption_risk / docs-sync)

**Symlink topology assumed stable for the lifetime of Bundle B.**

If a future operation (e.g., `npm install`, a fresh `gobbi install`, or a Codex worktree clone) silently breaks the symlinks, downstream Planning briefs that "trust either path" would silently misroute edits. The mirror-canonical-symlinks decision file does NOT include a verification gate Planning briefs should run before execution to confirm symlink integrity.

Suggested direction (downstream / future): add a one-line `find .claude/skills/ -type l | wc -l` check to T1 task brief preconditions, expected ≥1 (or = the count at brief authoring time). Low priority; not iter2 scope.

## Must-preserve list

- The empirical reference section in the new decision file (gold-standard re-verification procedure).
- The explicit "mistake invoked" citation (line 78) — connects the iter2 fix to the project-level mistake registry.
- The 3-fold rescission of the "manual mirror-edit" interim discipline (no stale instruction hides downstream).

## Verdict

**PASS.** All iter1 Critical/High risk findings are addressed; F-R6 is a Low/50 future-loop suggestion, not a blocker.

# Ideation iter2 — Structure perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Structure-specific reads: iter2 Implementation Checklist Stages 0/A–G (lines 225-316) and Design D1–D10 (lines 329-430), critical ordering invariants block (lines 318-326).

## Locked Frame (Stage 1) — iter2 inheritance + new gaps

**Inherited from iter1/claude/structure.md:**

- F-S-01 (High/75, open at iter1) — Stage D ↔ E "same commit" coupling structurally ambiguous; bare-UUID delete sequencing unclear.
- F-S-02 (Low/100, open at iter1) — `worktrees/refactor/` parent dir cleanup; missing `-mindepth 1` on `find -empty -delete`.
- F-S-03 (Low/50, open at iter1) — commit-vs-FS labeling per stage.

**Inherited scenario gaps:** S-STR-NEW-1 (5 ordering invariants verified per-stage), S-STR-NEW-2 (`worktrees/refactor/` intermediate cleanup).

**New gaps surfaced at iter2:**

- **S-STR-NEW-3** (adversarial): "The Stage E split (E.1 / E.2) preserves the original invariant that the bare-UUID delete happens after THIS-session's writes are committed — not weaker, not stronger." Need to confirm the gate semantics match the intent.
- **S-STR-NEW-4** (adversarial): "Stage E.2 has a clear owner — the executor still executes it even though it's a 'terminal post-commit' operation. If the workflow ends after Stage G's `gh pr merge --squash`, who runs E.2?"

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Components cohere | Stage 0 → A → B → C → D → E.1 → E.2 → F → G | YES | iter2 D1 (line 335) lays out the order; checklist follows |
| Every check item → structural element | YES | Each Stage bullet cites a git/fs command |
| Boring-by-default | Alternatives documented | YES | D5 unchanged from iter1 |
| 2-week smell test | Self-evident | YES | Decisions Log unchanged + 2 iter2-round entries added |
| Testability | Verification hooks named | YES | D2 expanded from 15 to 18 commands (added #16 H-1 grep, #17 worktrees-dir-exists, #18 develop-2-commits) |
| **F-S-01 remediation: Stage E split** | E.1 in-commit / E.2 post-commit terminal with concrete SHA gate | YES — lines 275-297 | E.1 explicitly bullets the 52 dirs as FS-only `rm -rf`; E.2 has a two-condition concrete gate: SHA exists in git AND SHA written into session.json |
| **F-S-02 remediation: -mindepth 1** | `find ... -mindepth 1 -type d -empty -delete` | YES — line 303 | Confirmed verbatim; Success #3 (line 96) + D2 #17 (line 359) gate |
| **F-S-03 remediation: commit-vs-FS labeling** | Per-stage explicit | PARTIAL — see F-S-04 |
| **S-STR-NEW-3** invariant preservation | Bare-UUID delete still post-session-writes-committed | YES — gate is now MORE specific (concrete SHA), not weaker |
| **S-STR-NEW-4** E.2 ownership | Clear who runs E.2 | PARTIAL — see F-S-05 |

## Typed findings

### F-S-01 — Re-judged as `addressed`

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: High
- **Evidence**: iter2 lines 275-297 split Stage E into E.1 (in-commit) and E.2 (terminal post-commit). E.2's gate (lines 292-294) is two concrete, testable conditions:
  1. `git log --format=%H -1 <sweep-branch>` returns a SHA (commit exists).
  2. `grep -F '<sha>' .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../session.json` returns ≥1 match (SHA recorded into session.json).
  
  Critical Invariant #4 (line 323) restates: "Stage E.2 bare-UUID delete is TERMINAL POST-COMMIT, gated by the sweep commit SHA being recorded in session.json. E.2 is FS-only; it is NEVER part of any commit." E.1 commit-vs-FS distinction made explicit at line 281 ("This is FS-only — the dirs were ignored so no `git rm` is needed; `rm -rf` is sufficient and the changes do NOT enter the commit's diff").
- **Resolution**: iter1's "after the workflow's writes are committed" vagueness is replaced with a concrete two-condition gate. Per `executor-rationalized-failing-verification-gate.md`, the gate is now non-rationalizable: either both conditions hold or NEEDS_CONTEXT (line 295). The lesson from that very mistake is encoded in the gate (line 295: "If either condition fails, NEEDS_CONTEXT — do NOT rationalize the gate"). Strong remediation.

### F-S-02 — Re-judged as `addressed`

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: iter2 line 303 (Stage F): `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete`. Success #3 (line 96) + D2 #17 (line 359) gate the result. Critical Invariant section reflects this via S14 (line 221).
- **Resolution**: surgical command change; `worktrees/` itself preserved.

### F-S-03 — Re-judged as `addressed` (partially)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: addressed
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Stage B preserves both `git rm` (tracked) and `rm -rf` (untracked) commands. Iter2 line 247 explicitly labels `rm -rf node_modules/` as "(Q5; untracked — FS-only hygiene, does NOT enter the commit)" — addresses iter1's "no explicit note that untracked deletes don't enter commits." Stage C's bullet 2 (lines 259-260) reiterates "plus `rm -rf <subdir>/*` to catch untracked stragglers." Stage E.1 has even more explicit labeling. Critical Invariant #5 (line 324) "explicitly distinguished in each stage above; the per-stage commit-vs-FS labeling is noted inline" — confirmed.

### F-S-04 — `git rm test/gitignore.test.sh` step has conditional ("if tracked") still unresolved

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open (carried from iter1, not in iter2 brief)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: iter2 line 248 same wording as iter1 line 221: "Handle `test/gitignore.test.sh` (Q6) — `git rm test/gitignore.test.sh` if tracked, `rm` if not". The executor still must run `git ls-files test/gitignore.test.sh` to decide. Not in iter2 brief; not a verdict driver.
- **Why it matters**: minor — the executor will check; the conditional is documented.
- **Suggested direction**: explicit pre-check command bullet "Run `git ls-files test/gitignore.test.sh` to determine if tracked" then branch.

### F-S-05 — Stage E.2 ownership ambiguity if Wrap-up runs between Stage G squash-merge and Stage E.2

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: iter2 D1 (line 335) sequences "(E.2) bare-UUID FS-only delete gated by SHA-in-session.json → (F) worktree removal + branch deletion → (G) PR open + squash-merge + local sweep-branch delete." But Critical Invariant #4 (line 323) calls E.2 "TERMINAL POST-COMMIT", and D9 (line 423) says "After E.2, any further Wrap-up writes for THIS session go into the date-prefixed dir". Reading D1, E.2 sits BETWEEN E.1 and F. Reading Critical Invariant #4 + D9, E.2 reads as the LAST operation (after Wrap-up). The two are consistent only if "TERMINAL" means "terminal within the destructive sweep" not "terminal across the entire workflow." iter2 D9 line 423 partially clarifies ("after E.2, any further Wrap-up writes go into the date-prefixed dir") — implying E.2 happens BEFORE Wrap-up. So:
  - Stage E.2 runs after the commit containing the gitignore + session-add (Stage D commit) lands on the sweep branch — pre-PR-open.
  - But the gate condition #2 ("SHA written into session.json") requires the executor to first commit (Stage D), then update session.json with that SHA, then E.2 runs.
  - Updating session.json with the sweep SHA is itself an event — does that update land in a new commit (which then changes the head SHA) or is session.json updated only on the FS without being staged? The draft is silent on this.
- **Why it matters**: A reasonable executor could either (a) update session.json on the FS-only (since it's already in the index from Stage E.1's `git add .../sessions/2026-05-21-6637e759-.../`), making the staged session.json now divergent from the FS state, or (b) try to commit the session.json update as a follow-on, but then the gate's "SHA exists" condition is satisfied by a different SHA than the one in session.json. Minor in solo-user context; non-rationalizable per F-S-01's gate text only if the executor reads "the sweep commit's SHA has been written into session.json" as "the SHA written into session.json *equals* the current branch tip SHA."
- **Suggested direction**: clarify in iter2 D9 + Critical Invariant #4: "session.json's update with the SHA is a FS-only mutation; the divergence from the indexed copy is reconciled by a subsequent commit OR is accepted as a known transient. State which."

## Low-confidence appendix

- (25) — "sweep-branch commit N" labels (lines 227, 241, 256, 267, 299) may still confuse, but iter2's preamble at line 227 explicitly states the squash-merge contract: "per M-1, the PR squash-merges them into ONE commit on `develop`." Acceptable.

## Must-preserve list

- The 6 critical-ordering invariants (lines 318-326) — the 5 from iter1 plus the new M-2 post-merge `git branch -d` invariant.
- Stage 0 (tag-before-anything) placement is preserved (line 229).
- E.1 / E.2 split is the load-bearing structural change of iter2; preserve.
- E.2 NEEDS_CONTEXT discipline at line 295 — encodes the `executor-rationalized-failing-verification-gate` lesson directly.

## Verdict

PASS — F-S-01 (the iter1 High/75 driver) is addressed. F-S-02 addressed. F-S-05 is new but Medium/50 (below High≥50 threshold). No High≥50 open findings → PASS.

# Ideation iter2 — Risk perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Risk-specific reads: `.gobbi/projects/gobbi/mistakes/{executor-rationalized-failing-verification-gate,session-dir-naming-convention-uses-date-prefix,manager-mispec-grep-c-for-occurrence-count}.md` (frontmatter `session_id: c676684d-...` confirmed); `.claude/skills/git/SKILL.md` Forbidden Operations (Q-G `-D` pre-auth still holds).

## Locked Frame (Stage 1) — iter2 inheritance + new gaps

**Inherited from iter1/claude/risk.md:**

- F-R-01 (Low/75, open at iter1) — `.codex/` blast-radius enumeration omits symlink-target dependency.
- F-R-02 (High/100, open at iter1) — Three project mistakes deleted by Stage C; witnesses for Iron Law 10 destroyed.
- F-R-03 (Medium/75, open at iter1) — D2 gates at risk of repeating `manager-mispec-grep-c` mistake; cross-cut with F-S-01/F-U-01.
- F-R-04 (Low/50, open at iter1) — `git push origin tag` irreversibility; solo-user n/a.

**Inherited scenario gaps:** S-RSK-NEW-1 (mistakes survival), S-RSK-NEW-2 (verification gate honesty).

**New gaps surfaced at iter2:**

- **S-RSK-NEW-3**: "Per H-2 user-accepted trade-off, the 3 mistake files are deleted. The lessons must be encoded INSIDE iter2's draft so that deletion is non-destructive of the audit trail (Iron Law 10 witnesses survive in spirit even if files don't)."
- **S-RSK-NEW-4**: "Stage E.2's SHA gate, as a verification gate, must not become rationalizable mid-execution. The gate itself must satisfy `executor-rationalized-failing-verification-gate.md`."

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Rollback path identified | Pre-reset tag Q-F | YES | unchanged |
| Blast radius bounded | Files/consumers enumerated | YES — TIGHTENED | iter2 line 250 explicitly notes `.codex/` symlinks vs targets (F-R-01 addressed) |
| Security surface delta | None or described | YES | unchanged |
| Irreversible steps gated | Each flagged | YES | unchanged |
| 2-week smell test | YES | unchanged |
| Scope-drift check | Design touches only Scope Contract files | YES | H-1 carveout explicit (line 62) |
| Concurrency surface | Bare-UUID + CLI race | YES — TIGHTENED | E.2 SHA gate |
| **F-R-02 remediation: H-2 trade-off acceptance** | User decision recorded; lessons encoded | YES — see F-R-02 disposition below |
| **F-R-03 remediation: D2 spec gaps closed** | F-S-01/F-U-01 closure removes rationalization invitation | YES — H-3 split |
| **S-RSK-NEW-3** lessons survive deletion | Mistake content encoded in iter2 draft | YES — three lessons all applied (M-3, H-3 gate, D2 #15 audit) |
| **S-RSK-NEW-4** SHA gate non-rationalizable | E.2 NEEDS_CONTEXT discipline | YES — line 295 |

## Typed findings

### F-R-01 — Re-judged as `addressed`

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: iter2 Stage B (line 250) now reads: "`git rm -r .codex/` (Item 5, tracked). NOTE: `.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r` removes the symlinks, not the targets." Inline annotation closes the iter1 blast-radius-enumeration gap.

### F-R-02 — Re-judged as `addressed`

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 100
- **Severity**: High
- **Evidence**: Per the brief, the user explicitly accepted the H-2 trade-off (mistake files deleted) in the iter2 round. iter2 Decisions Log iter2 round line 472 records the user's acceptance verbatim: "The user explicitly accepts this trade-off." The H-2 rationale (lines 471-472) cites that:
  - the iter2 evaluator findings already absorbed the three lessons,
  - the iter2 draft applies each lesson concretely:
    - `session-dir-naming-convention-uses-date-prefix` → M-3 explicit `c676684d-` naming (Stage E.1 line 282)
    - `executor-rationalized-failing-verification-gate` → H-3 SHA gate (lines 290-297) + line 295 NEEDS_CONTEXT discipline
    - `manager-mispec-grep-c-for-occurrence-count` → D2 #15 inline audit (line 357)
  
  iter2 line 496 "Mistakes consulted" re-confirms all three were load-bearing for iter2 design even though the files themselves are deleted. Per `mistake` skill P1 + Iron Law 10 (witness-bound), the witness is preserved in spirit: the lessons are encoded in iter2's draft, the iter2 draft lives in the preserved session dir, and the Wrap-up handoff references it.
- **Resolution**: trade-off explicit; user-accepted; lessons encoded in three concrete iter2 deltas. The "audit trail" (the iter2 draft itself) survives the sweep because the current session dir survives. Risk-accepted per discussion.
- **Caveat**: this resolution depends critically on the iter2 draft being preserved in the surviving session dir. iter2 Stage E.1 (line 277 + 279) confirms the kept session dir is the date-prefixed one, and `git add` brings it into the index. Mechanism is intact.

### F-R-03 — Re-judged as `addressed`

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: addressed
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: iter1's F-R-03 was about D2 spec ambiguity inviting rationalization. iter2's H-3 split (Stage E.1/E.2 + concrete SHA gate) + the explicit NEEDS_CONTEXT directive at line 295 closes the spec ambiguity. D2 #15's `$`-anchored `grep -c` is audit-stamped (line 357). No ambiguous D2 gates remain after the H-3 split.

### F-R-04 — Re-judged as `open` (carried; not-applicable solo)

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open (n/a solo-user)
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Unchanged from iter1; tag push to origin is irreversible without coordination, but solo-user makes this n/a.

### F-R-05 — H-2 trade-off depends on iter2 draft surviving — explicitly verified (NEW informational)

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open (informational; mitigation confirmed)
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: iter2's H-2 mitigation rests on three lessons being encoded in this draft. The draft must survive the sweep. Verified:
  - Draft path: `.gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../ideation/rawdata/draft-iter2.md` — under the preserved session dir (Scope Contract line 42 KEEP CONTENT).
  - Stage E.1 line 279 explicitly `git add`s the entire session dir; the draft becomes tracked content.
  - Post-sweep, the draft is committable and remote-pushable as part of the sweep PR.
- **Why it matters**: re-confirms the trade-off is recoverable via the in-tree draft, not just oral/transient memory.

### F-R-06 — Three project mistakes are CURRENTLY untracked; only Stage E.1 sweeps them — verify ordering (NEW)

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: `git status --short` lines for `?? .gobbi/projects/gobbi/mistakes/{executor-rationalized...,manager-mispec-grep-c...,session-dir-naming...}.md`. Stage C bullet 2 (line 260) handles untracked stragglers via `rm -rf <subdir>/*`. Stage C also runs `git rm -r <subdir>/*` first; since the files are untracked, the `git rm` is a no-op for them. The `rm -rf` then catches them. Mechanism is correct, but the ordering is implicit: if an executor naively runs just `git rm -r mistakes/*`, the 3 mistake files survive. iter2 line 260 says "plus `rm -rf <subdir>/*`" — the "plus" is critical, but reads as optional. iter1's structure has the same wording so this isn't a regression.
- **Why it matters**: minor — careful executor reads "plus" as mandatory; the H-2 rationale presumes deletion happens.
- **Suggested direction**: optionally rephrase as "first `git rm -r <subdir>/*` (tracked content); THEN `rm -rf <subdir>/*` (untracked stragglers). Both steps required."

## Low-confidence appendix

- (25) — Stage 0's `git push origin pre-reset-2026-05-21` runs from the main worktree per `gobbi-workflow-cli-from-main-tree.md`. The artifact's I2 + Stage 0 don't explicitly mention this; iter1 evaluator didn't flag it either. Solo-user, low risk.

## Must-preserve list

- iter2 line 295's NEEDS_CONTEXT directive inside the gate — directly encodes the `executor-rationalized` mistake's lesson into the executor's expected behavior; preserve.
- iter2 line 250's `.codex/` symlink note — closes a Risk blast-radius gap with minimal text.
- The three-lesson encoding map (M-3 / H-3 / D2 #15 → three deleted mistake files) is the load-bearing witness preservation; preserve.
- iter1's Q-F pre-reset tag remains in place (Stage 0) — the rollback path is intact.

## Verdict

PASS — F-R-02 (the iter1 High/100 driver) is addressed via user-accepted trade-off + lessons-encoded mitigation. F-R-01 + F-R-03 addressed. New findings F-R-05/F-R-06 informational/Low. F-R-04 carried n/a. No High≥50 open findings → PASS.

(Note: this is a meaningful upgrade from iter1's REVISE driven by F-R-02; the verdict shift is justified by an explicit user trade-off acceptance + concrete in-draft mitigation, not by hand-waving.)

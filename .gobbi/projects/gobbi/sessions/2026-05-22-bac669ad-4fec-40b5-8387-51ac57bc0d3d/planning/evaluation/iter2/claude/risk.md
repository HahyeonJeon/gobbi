# Risk Perspective — Planning Evaluation iter2

## Artifact Summary + Memory reads

(Same artifact. Iter1 F-RISK-01 was Medium/75 — executable bit lost from committed artifact; iter1 F-RISK-02 was Low/50 — T7 pushed to remote before all checks confirmed green.)

---

## Locked Frame (Stage 1)

### Scenario 1: If a mid-plan task fails, rollback boundary is clear
Attached checklist:
- [ ] Each task is one focused commit — atomic rollback is `git revert <sha>`
- [ ] T7 BLOCKED path halts before M2 — no pushed commits to remote until all verified

### Scenario 2: Executable bit preservation through commit/checkout cycle (iter1 F-RISK-01 regression)
Attached checklist:
- [ ] T1 explicitly `chmod +x .claude/hooks/session-start.sh` before committing
- [ ] T7 re-checks `test -x` — but this checks filesystem bit, not git-tracked mode

### Scenario 3: Subagent never pushes / merges (iter1 Codex REVISE driver regression check)
Attached checklist:
- [ ] T7 has explicit "NO push, NO PR" constraints
- [ ] All push/PR/merge operations in M2 only
- [ ] Agent Roster confirms T1-T7 = executor, M0/M1/M2 = manager-direct

### Scenario 4: M1 direct-commit-to-develop risk (adversarial)
Attached checklist:
- [ ] Branch protection on `develop` could block direct commit — M1 acknowledges this with fallback PR path
- [ ] session.json is git-tracked — M1 commit adds to develop history

### Scenario 5: M2 `<main-tree root>` placeholder — execution-time ambiguity
Attached checklist:
- [ ] `<main-tree root>` in M2 How step 6, line 471, and in M1 step 1, 512 is a placeholder the manager must resolve at runtime
- [ ] If the manager runs these commands literally with `<main-tree root>` unresolved, `git -C <main-tree root>` fails

---

## Per-scenario per-check results

**Scenario 1:**
- Each task = one commit: YES (plan.md line 43, and per-task Commit message blocks).
- T7 BLOCKED path stops before M2: YES (plan.md line 373 "halt and report BLOCKED... do NOT advance to commit").
- F-RISK-02 (T7 pushed before all checks green): ADDRESSED — push is fully in M2 now, post all T7 verification.

**Scenario 2:**
- T1 `chmod +x`: YES (plan.md line 88 step 4).
- F-RISK-01 (executable bit via `test -x` may not catch git-tracked mode): Still present in principle. T7 line 401 still uses `test -x .claude/hooks/session-start.sh` which tests the filesystem mode. However, after M0's worktree creation, the executor runs `chmod +x` in the worktree (T1 step 4), commits, and git preserves the executable bit in the tree object if the commit is done properly. The `test -x` in T7 will verify the filesystem bit is set. Partially addressed — git's `update-index --chmod=+x` would be more rigorous but `git commit` after `chmod +x` on a new file should preserve the mode. Residual risk is low.

**Scenario 3 — CONFIRMED ADDRESSED:**
- T7 `What` (plan.md line 368): "This task does NOT push, does NOT open a PR, does NOT touch remote." YES.
- T7 Agent Roster (plan.md line 590): "NO git push, NO gh pr *, NO gh issue *." YES.
- M2 owns all push/PR/merge operations. grep result confirmed: all `git push` / `gh pr create/merge` occurrences are in M0 (line 24 description), M2 body, or T7's negation references. None in T1-T7 action bodies.

**Scenario 4:**
- M1 fallback path (plan.md line 517): "if branch protection blocks direct develop commit, the manager opens a one-commit follow-up PR." YES — risk acknowledged and fallback documented.
- session.json is git-tracked per known project model (plan.md line 509 uses main-tree absolute path). Correctly flagged as main-tree commit in M1.

**Scenario 5 — NEW FINDING:**
`<main-tree root>` appears 5 times as an unresolved placeholder:
- M2 How step 6 (line 471): `cd <main-tree root> && git checkout develop && git pull --ff-only`
- M2 Success criteria (line 483): `git -C <main-tree root> log --oneline -1 develop`
- M2 Verification commands (line 497): `cd <main-tree root>`
- M1 How step 1 (line 512): `git -C <main-tree root> log --oneline -1`
- M1 Verification commands (line 535): `git -C <main-tree root> log --oneline -1`

The actual main-tree root is `/playinganalytics/git/gobbi` (known from the session's absolute paths). The manager is expected to know this, but the plan's own claim (line 637) says "no placeholders" — this is not accurate. At execution time, if the manager runs the verification commands verbatim, `git -C <main-tree root>` will fail with a path error.

---

## Typed findings

### F-RISK-03 — `<main-tree root>` placeholder unresolved in M2 and M1 commands
- **Type:** `design_flaw`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** plan.md lines 471, 483, 497, 512, 535 — five occurrences of `<main-tree root>` in M2 and M1 procedural commands and verification blocks. The plan's Self-Review Checklist line 637 claims "no placeholders" but this is incorrect.
- **Why it matters:** The manager-direct actions M2 and M1 are high-stakes operations (push, merge, session.json stamp). If the manager runs verification commands from plan.md verbatim, `cd <main-tree root>` and `git -C <main-tree root>` will fail. While the manager likely knows the repo root (`/playinganalytics/git/gobbi`), the plan's completeness guarantee is broken by this ambiguity, and the Self-Review Checklist's "no placeholders" claim is false.
- **Suggested direction:** Replace `<main-tree root>` with the concrete absolute path `/playinganalytics/git/gobbi` everywhere it appears.

---

## Low-confidence appendix

None.

**Per-perspective verdict: REVISE** — F-RISK-03 is Medium/100. Per threshold: High/≥50 → REVISE. Medium/100 does not meet the REVISE threshold (only High or Critical trigger it). **Corrected verdict: PASS** with F-RISK-03 recorded as a Medium finding for remediation before M2/M1 execution.

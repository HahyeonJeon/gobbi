# Perspective: Risk — Planning iter1 Evaluation (claude system)

## Artifact Summary + Memory reads
(Same artifact as Project perspective — see project.md § Artifact Summary.)

---

## Locked Frame (Stage 1)

### Scenario 1: If a mid-plan task fails, rollback boundary is clear
**Attached checklist:**
- [ ] Each task is committable independently (plan says yes for all except W0-T10 and W5-T3)
- [ ] A failure in W3-T3 cluster (d) leaves the project in a coherent state
- [ ] git mv operations are reversible via git revert

### Scenario 2: High-blast-radius tasks are gated
**Attached checklist:**
- [ ] W0-T10 gates all migration (W1-W5 can't run before W0 is verified)
- [ ] W3-T3 (101 files) has per-cluster commits as checkpoints
- [ ] No task silently overwrites a file outside its declared scope

### Scenario 3: Irreversible operations have safeguards
**Attached checklist:**
- [ ] W1-T1 (stripping frontmatter from 17 mistakes) — can it be reversed if stripping breaks content?
- [ ] W4-T1 (rm untracked tmp/) — untracked files once deleted cannot be recovered from git

### Scenario 4: Memory corruption risk
**Attached checklist:**
- [ ] No task silently deletes a project-memory file (all moves are git mv)
- [ ] No task accidentally edits the wrong tree (main vs. worktree)
- [ ] No task overwrites a symlink's target with a new file (would break mirror)

### Scenario 5 (adversarial): Double-execution of already-committed tasks
**Attached checklist:**
- [ ] W0-T1 re-run would insert duplicate Principle 13 section in principles/SKILL.md
- [ ] W0-T2 re-run would attempt to re-create existing rules.md (overwrite risk)
- [ ] W0-T9 re-run would duplicate the memorization/rules.md line in delegation templates

### Scenario 6: W4-T1 untracked file deletion
**Attached checklist:**
- [ ] W4-T1 says "for untracked → rm -rf" — untracked means not in git history
- [ ] Untracked tmp/ files cannot be recovered from git if deleted
- [ ] The plan does NOT require pre-deletion snapshot or review of tmp/ contents

---

## Per-scenario per-check results (Stage 2)

### Scenario 1: Rollback boundaries
Every non-verify task is marked `committable: yes`. W3-T3's 6 sub-commit clusters each produce a recoverable checkpoint. git mv operations preserve history in the destination file. PASS.

### Scenario 2: High-blast-radius gating
W0-T10 is the hard gate: ALL of W1-W5 require W0-T10 (directly or transitively). If any W0 task fails verification, W1-W5 cannot proceed. PASS.

### Scenario 3: Irreversible operations
W1-T1 (stripping frontmatter): The stripped fields (mistake-candidate, finding-id, promoted-from, promoted-at) are metadata. The underlying content (mistake body, priority, domain, etc.) is preserved. Stripping is safe because the stripped fields are explicitly staging-only per L6. PASS.

W4-T1 (rm untracked tmp/): High risk. The plan says "for untracked → rm -rf." Untracked files are not in git history — once deleted, they are gone permanently. The plan does not require: (a) confirming tmp/ contents are genuinely scratch/expendable, (b) a preview step before deletion. For a solo-dev project this is lower risk (the dev knows what's in tmp/). But the Executor, operating headlessly, could delete meaningful scratch content. **See RK-01.**

### Scenario 4: Memory corruption
All plan moves use git mv (Operational Fact 3). No task edits the `.claude/skills/X` symlink target directly (Operational Fact 2 — one canonical edit, symlink reflects). No task creates a new `.gobbi/.../skills/X` file using a symlink path (Operational Fact 1 + edit-tool-refuses-symlink-paths mistake referenced). 

BUT: W0-T1/T2/T9 already executed (PJ-03). Double-executing these tasks creates memory corruption risk: **See RK-02.**

### Scenario 5: Double-execution of already-committed tasks (adversarial)
If an executor runs W0-T1 against the already-updated principles/SKILL.md:
- "Insert '## Principle 13' after Principle 12" → the Principle 13 section already exists; the executor would insert a DUPLICATE section.
- The verify `grep -c "Principle 13" skills/principles/SKILL.md ≥ 1` would pass even with the duplicate.
- The duplicate would propagate undetected until a human review.

If an executor runs W0-T2 against the already-created rules.md:
- `Write skills/memorization/rules.md with base frontmatter` → overwrites the committed content (content loss if executor writes from scratch).
- The symlink re-creation might silently succeed or error depending on link existence.

**FAIL — High confidence, high severity: see RK-02.**

### Scenario 6: W4-T1 untracked deletion
Confirmed: W4-T1 says "rm untracked tmp/, git rm tracked tmp/". The plan only requires verifying `grep -q "tmp" wrap-up cleanup doc` (from W0-T6) — not verifying the tmp/ contents are expendable. MEDIUM risk in solo-dev context. RK-01 captures this.

---

## Typed findings

### RK-01
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W4-T1 `how`: "for untracked → rm -rf". W4-T1 `verifies` does not include a step to inspect/confirm tmp/ contents before deletion. Untracked files once deleted are unrecoverable from git.
- **Why it matters:** If a developer placed meaningful work in a session's tmp/ dir (draft notes, work-in-progress snippets) and forgot to commit, W4-T1 silently deletes it with no warning.
- **Suggested direction:** Add a pre-deletion inspection step to W4-T1: `find sessions -type d -name tmp -exec ls -la {} \;` before any deletion, so the executor can pause if unexpected contents are found. Or narrow scope to tracked tmp/ only (git rm).

### RK-02
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** W0-T1 (`what`: "Add Principle 13 to principles/SKILL.md…"), W0-T2 (`what`: "Author NEW canonical sibling skills/memorization/rules.md…"), W0-T9 (`what`: "Wire memorization/rules.md into delegation…") are all listed as tasks to execute. Commit 90c46fd (verified: `git log --stat HEAD` in worktree) already shipped all three deliverables. Running W0-T1's `how` ("Read principles/SKILL.md; insert '## Principle 13' after Principle 12 using §6 markdown block verbatim") against the current file would produce a duplicate Principle 13 section. Running W0-T2's `how` ("Write skills/memorization/rules.md with base frontmatter") against an existing file would either error or overwrite with new content (content loss).
- **Why it matters:** Duplicate principle section corrupts principles/SKILL.md. Overwriting rules.md loses the committed content. These are silent failures — the verify gates would still pass (they check for existence/grep matches, not uniqueness/content identity).
- **Suggested direction:** Mark W0-T1, W0-T2, W0-T9 as "DONE — shipped in 90c46fd; skip" in the plan. Remove stale Operational Fact 5 (symlink already exists).

---

## Low-confidence appendix
None.

---

**Per-perspective verdict: REVISE**
Rationale: One High/100 (RK-02: double-execution corruption risk from already-committed tasks). One Medium/75 (RK-01: untracked file deletion without pre-inspection).

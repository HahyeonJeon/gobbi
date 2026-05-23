# Consistency Perspective — Planning Evaluation iter2

## Artifact Summary + Memory reads

(Same artifact. Iter1 F-CONS-01 was a Low/100 finding about `<worktree-path>` placeholder in T7. Claimed addressed by FIX V.)

---

## Locked Frame (Stage 1)

### Scenario 1: Inter-task name match across producing/consuming tasks
Attached checklist:
- [ ] T3 produces edits to `gobbi/SKILL.md`; T4 explicitly states Files out-of-scope includes `gobbi/SKILL.md` (done in T3)
- [ ] T5 introduces `session.json.transcriptPath`; T6 cites that exact field name

### Scenario 2: Action ordering claim consistency (adversarial)
Attached checklist:
- [ ] FIX III claim "M0 → T1 → ... → T7 → M2 → M1" is reflected in Dependency Graph
- [ ] Dependency Graph matches the final action ordering at line 31

### Scenario 3: Commit-block count consistency
Attached checklist:
- [ ] Self-Review Checklist claim "8 commit-message blocks" matches actual count
- [ ] FIX IV claim says "T1-T7 (and M1 / M2 commit actions)" — check M2 has or lacks a commit block

### Scenario 4: T7 redundant regex check (adversarial — new finding)
Attached checklist:
- [ ] T7 criterion P7 reword regex `'session\.json\.transcriptPath|session\.json\.transcriptPath'` — both alternation arms are identical

### Scenario 5: M2 PR body section list matches conventions.md
Attached checklist:
- [ ] M2 How step 2 specifies sections per conventions.md (Summary / Changes / Test plan / Linked issues)

---

## Per-scenario per-check results

**Scenario 1:**
- T4 Files out-of-scope explicitly includes `gobbi/SKILL.md` (plan.md line 239): YES.
- T6 cites `session.json.transcriptPath` as the canonical field (plan.md line 321, 325): YES.
- F-CONS-01 (worktree-path placeholder): ADDRESSED — T7 now uses `${WORKTREE_PATH}` and concrete paths.

**Scenario 2:**
- Dependency Graph matches FIX III ordering: M0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → M2 → M1. Confirmed at plan.md lines 552-562 and line 31. YES.

**Scenario 3 — PARTIAL:**
- Self-Review claim "8 commit-message blocks": verified at plan.md line 643. Blocks exist at: T1 (line 116), T2 (line 157), T3 (line 204), T4 (line 259), T5 (line 305), T6 (line 353), T7 (line 440), M1 (line 537). Count = 8. MATCHES.
- FIX IV changelog text says "T1-T7 (and M1 / M2 commit actions)" implying M2 should have a commit block. But M2 produces no workspace-edit commit — the squash-merge makes the PR title+body the commit. This is internally consistent (plan.md line 643 explains it), but the FIX IV wording is misleading. Low-severity consistency gap.

**Scenario 4 — FAIL:**
T7's P7 reword count command uses a regex with two identical alternation arms:
```
rg -nE 'session\.json\.transcriptPath|session\.json\.transcriptPath'
```
Both arms are `session\.json\.transcriptPath`. The alternation is a no-op — the regex degenerates to a simple literal match, which is functionally correct but not the stated intent (if the intent was to catch variants). Evidence: plan.md line 427-434.

However, since the intent IS to match `session.json.transcriptPath` literally, the degenerate regex IS functionally correct — just redundant. Not a blocking issue.

**Scenario 5 — PARTIAL:**
M2 PR body sections (plan.md lines 463-467): Summary, Why, Changes, Test plan, AI-Provenance-Record reference. `conventions.md` § Pull Request Format requires: Summary, Changes, Test plan, **Linked issues**. The M2 spec replaces `Linked issues` with `Why` (a non-required section) and `AI-Provenance-Record reference` (also non-required). The required `Linked issues` section is addressed conditionally at plan.md line 459 ("If a tracking issue has been filed...") but not named as a required section in the PR body template. Consistency gap with conventions.md.

---

## Typed findings

### F-CONS-02 — M2 PR body missing the required `Linked issues` section per conventions.md
- **Type:** `checklist_gap`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** `git/conventions.md` § Pull Request Format — body template requires four sections in order: Summary / Changes / Test plan / Linked issues. M2 How step 2 (plan.md lines 463-467) specifies: Summary / Why / Changes / Test plan / AI-Provenance-Record. The required `Linked issues` section is absent from the enumerated sections. The conditional handling (line 459) is not the same as specifying it as a required body section.
- **Why it matters:** The PR body at execution time may not include a `Linked issues` section, producing a non-compliant PR body and a conventions.md audit failure. Low severity because the plan at least addresses the issue-link question conditionally; the gap is presentational.
- **Suggested direction:** Add `Linked issues` as the 4th body section in M2 How step 2, with the text "Refs #N" or "N/A (no tracking issue filed for this session)."

### F-CONS-03 — T7 P7 reword regex has trivially redundant alternation
- **Type:** `checklist_gap`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** plan.md line 427: `rg -nE 'session\.json\.transcriptPath|session\.json\.transcriptPath'` — both alternation arms are byte-identical.
- **Why it matters:** Functionally correct (degenerates to a literal match), but signals the author may have intended to catch two different forms (e.g., with and without `.json`). If the original intent differed, the verification is incomplete. If the intent is just a literal match, the `|alternate` is misleading clutter that may confuse the executor.
- **Suggested direction:** Simplify to `rg -nF 'session.json.transcriptPath'` (literal match, `-F` flag, no escape needed).

---

## Low-confidence appendix

None.

**Per-perspective verdict: PASS** (F-CONS-02 and F-CONS-03 are both Low/≥50 — below REVISE threshold)

# Aesthetics Perspective — Planning Evaluation iter2

## Artifact Summary + Memory reads

(Same artifact. Iter1 F-AES-01 was a Low/100 finding about `<worktree-path>` placeholder in T7. Claimed addressed by FIX V.)

---

## Locked Frame (Stage 1)

### Scenario 1: Task titles are concrete, imperative, unambiguous
Attached checklist:
- [ ] All task titles follow imperative form
- [ ] No duplicate task IDs

### Scenario 2: No unresolved placeholders (adversarial — iter1 F-AES-01 regression check)
Attached checklist:
- [ ] No `<worktree-path>` placeholder in T7 (iter1 F-AES-01)
- [ ] No TBD/TODO/??? anywhere in task fields
- [ ] T7 commit message subject `<one-line description of consolidating fix>` — acceptable placeholder (conditional message)

### Scenario 3: Commit message subjects comply with ≤72-char limit
Attached checklist:
- [ ] Every commit subject line ≤ 72 chars per `git/conventions.md`
- [ ] PR title ≤ 72 chars per `git/conventions.md` (PR title uses same constraints as commit subject)

### Scenario 4: Plan follows project standard
Attached checklist:
- [ ] Sections are consistent across tasks (What/Why/How/Files in-scope/Files out-of-scope/Agent assignment/Dependencies/Success criteria/Verification commands/Commit message)
- [ ] Field names consistent throughout

---

## Per-scenario per-check results

**Scenario 1:**
- Titles are imperative form. IDs (T1-T7, M0/M1/M2) are unique. YES.

**Scenario 2:**
- `<worktree-path>` placeholder in T7: RESOLVED. T7 now uses `${WORKTREE_PATH}` (env var set at M0) and `.gobbi/projects/gobbi/skills/...` absolute paths throughout. F-AES-01 ADDRESSED.
- TBD/TODO: Not found. YES.
- T7 commit message `<one-line description of consolidating fix>`: This is intentional — it's a conditional commit message for a fixup that may or may not be needed. Acceptable placeholder for a future-conditional element.

**Scenario 3 — FAIL:**
Three commit subject lines and the PR title exceed the 72-char limit per `git/conventions.md`:

| Subject | Chars | Status |
|---|---|---|
| `refactor(skills): rename CLAUDE_SESSION_ID -> CLAUDE_CODE_SESSION_ID in 11 skills (P1)` | 86 | FAIL |
| `feat(orchestration): add transcriptPath to session schema + manager-stamp docs` | 78 | FAIL |
| `docs(skills): reword 9 $CLAUDE_TRANSCRIPT_PATH references to cite session.json.transcriptPath (P7)` | 98 | FAIL |
| `feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID, add CLAUDE_CODE_SESSION_ID + hook)` (PR title) | 99 | FAIL |

Evidence: `git/conventions.md` § Commit Messages: "Total subject length ≤ 72 chars." PR title section: "Same regex + grammar as the commit subject (Conventional Commits). For squash-merged PRs, the title becomes the squashed commit's subject, so the same constraints apply."

**Scenario 4:**
- All tasks have consistent field sets. YES.

---

## Typed findings

### F-AES-02 — Three commit subject lines and PR title exceed 72-char limit
- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:**
  - T4 subject (86 chars): plan.md line 261 `refactor(skills): rename CLAUDE_SESSION_ID -> CLAUDE_CODE_SESSION_ID in 11 skills (P1)`
  - T5 subject (78 chars): plan.md line 308 `feat(orchestration): add transcriptPath to session schema + manager-stamp docs`
  - T6 subject (98 chars): plan.md line 355 `docs(skills): reword 9 $CLAUDE_TRANSCRIPT_PATH references to cite session.json.transcriptPath (P7)`
  - PR title (99 chars): plan.md line 462 `feat: env-var audit + SessionStart hook (drop CLAUDE_SESSION_ID, add CLAUDE_CODE_SESSION_ID + hook)`
  - Convention: `git/conventions.md` § Commit Messages "Total subject length ≤ 72 chars"
  - Convention: `git/conventions.md` § Pull Request Format "Same regex + grammar as the commit subject"
- **Why it matters:** Squash-merge makes the PR title the final squashed commit subject. All 4 items will fail the conventions.md subject regex at the point the executor or manager tries to commit/push. The conventions.md constraint is a hard rule, not a style preference. The Self-Review Checklist at plan.md line 639 claims "subject ≤ 72 chars" but none of the 3 failing subjects were validated.
- **Suggested direction:** Shorten the 3 commit subjects and the PR title to ≤ 72 chars each. Abbreviation strategies: drop parenthetical annotation suffixes like `(P1)`, `(P7)`, abbreviate variable names in the subject.

---

## Low-confidence appendix

None.

**Per-perspective verdict: REVISE** (High-impact design_flaw at Confidence 100 — the commit and PR title grammar violations will cause real friction at commit time)

Note: Severity is Medium (not High) per severity table — "Real issue that should be addressed but doesn't block." Verdict per threshold: no High/≥50 → PASS. Reconsidering: the finding is Medium/100, which is below the REVISE threshold (High/≥50). **Per-perspective verdict: PASS** with F-AES-02 recorded as a Medium finding requiring attention before T4/T5/T6/M2 execution.

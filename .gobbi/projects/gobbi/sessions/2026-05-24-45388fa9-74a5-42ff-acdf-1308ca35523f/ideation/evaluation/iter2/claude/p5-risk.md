# Perspective 5 — Risk
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

(Same artifact summary as p1-project.md; see that file. Memory reads identical.)

---

## Locked Frame (Stage 1)

**Scenario A — DL-1 shallow-lessons trade-off: acknowledged + bounded**
- [YES] S-8 names the adversarial challenge explicitly: "A future reader challenges the design doc's 'lessons' section for being thin."
- [YES] R-3 records the risk as "User-accepted. Adversarial reviewers (per S-8) will challenge. Pre-recorded justification per DL-1 lock."
- [YES] DL-1 lock specifically says "Evaluators must not re-litigate." This perspective does not re-litigate DL-1 (per scope constraint from the task brief).
- [PARTIAL] The risk R-3 does not identify a mitigation. "User-accepted" is a disposition, not a mitigation. If the lessons section is shallow and future readers challenge it, R-3 says the pre-recorded justification handles it — but the pre-recording is described as a "commit message tag" (draft-iter2.md § Scenarios S-8: "the design doc's commit message should include a 'lessons-section-depth: shallow-by-design-per-DL-1' tag"). A commit message tag is not searchable in the design doc itself. A reader consulting the design doc will find a shallow lessons section without any inline explanation of why.

**Scenario B — DL-4 absorption stretch: acknowledged + quantified**
- [YES] Risk Delta section gives explicit estimates: ~700–900 LOC, ~16 files, 7–15 executor tasks vs iter1's ~300 LOC + 4 files + 5–6 tasks.
- [YES] R-6 maps this to the existing `manager-context-overflow-with-large-bundle.md` mistake with 4 concrete mitigations.
- [YES] The constraint from that mistake file is cited in D-6 revised (≤ 7 tasks recommended if CL-5 = 1 task).

**Scenario C — CL-3/CL-5 coordination risk: acknowledged (adversarial)**
- [YES] R-2 explicitly covers `mistake/SKILL.md` two-edit overlap with the D-7 resolution.
- [YES] Per-Deliverable table CL-5 `files-must-not-touch` cross-references CL-3 ownership.

**Scenario D — CL-5 M2 substitution drift (adversarial)**
- [YES] R-4 covers the "executor under pressure reaches for M1 wording" risk.
- [YES] S-6 (failure scenario) covers M2 mis-application.
- [YES] SC-5 grep verification serves as the mitigation for R-4.

**Scenario E — Irreversible steps: identified**
- [YES] CL-1 (close backlog inline) — the backlog can be re-opened if needed; low irreversibility.
- [YES] CL-2 (promote skill) — skill can be deleted if wrong; low irreversibility.
- [YES] CL-5 (12-skill docs sweep) — reverts are clean git commits; no structural irreversibility.
- [YES] CL-4 (new design doc) — a new file; no irreversibility concern (deletion is trivial).
- [YES] The Risk Delta section confirms "No production blocker" for all 5 items.

**Scenario F — Rollback path identified**
- [YES] All deliverables are git-tracked markdown edits or new files. Full rollback = revert the PR. No database migrations, schema changes, or external writes.
- [YES] R-7 (Wrap-up emergency-stop risk for CL-4's lessons section) is identified and bounded.

**Scenario G — Security surface**
- [YES] No auth/authz changes. No new untrusted input paths. Security surface delta = none (all deliverables are documentation updates or a new documentation skill). Not applicable in depth.

**Scenario H — Privacy / data retention** (Coverage Matrix: Risk + Consistency)
- [YES] No PII or sensitive data surfaces are introduced. Not applicable.

**Scenario I — License / IP risk** (Coverage Matrix: Risk + Consistency)
- [YES] All deliverables are internal documentation derived from the project's own code. No external source code copied. No new dependencies. Not applicable.

**Scenario J — Cost / budget impact** (Coverage Matrix: Performance + Risk)
- [YES] Bundle C is documentation-only. No new LLM API calls, no paid infra changes, no storage beyond new markdown files. No cost-runaway scenario.

**Scenario K — Wrap-up still needed for DL-1 coherence**
- [YES] R-7 explicitly covers this: "If Wrap-up encounters an emergency-stop (as Bundle B did per I-4), CL-4's lessons section may need amendment in a follow-up session."
- [PARTIAL] R-7's mitigation is "Recorded for Wrap-up's awareness" — which is not a concrete mitigation, just a notification. If the emergency-stop happens, who amends the design doc? When? Under what conditions does the amendment become a follow-up obligation vs. accepted shallow?

**Scenario L — R-5 (12-skill sweep consistency) — mitigation is advisory, not structural (adversarial)**
- [YES] R-5 ("12 paragraph edits across 12 files invite small-wording-drift") correctly identifies the risk.
- [PARTIAL] The recommended mitigation is "write the canonical substitution string ONCE in Preparation (single skill-edit template), then apply 12 times in Execution. Flag for Preparation." This is advisory — it recommends an action for Preparation but does not make it a requirement or add a verification check that the same string was applied across all 12 files. SC-5's grep only checks that the delegation-prompt wording appears; it doesn't check that the wording is character-for-character identical across all 12.

---

## Per-scenario per-check results

The primary risk gaps:
1. DL-1 shallow-lessons rationale lives only in the commit message (S-8), not in the design doc body — a future reader of the doc won't see it.
2. R-7's mitigation is a notification, not a concrete action.
3. R-5 mitigation is advisory; SC-5 doesn't verify identical wording across 12 files.

---

## Typed findings

### R5-001 — CL-4 design doc will contain no inline explanation of why lessons section is shallow

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: § Scenarios S-8: "the design doc's commit message should include a 'lessons-section-depth: shallow-by-design-per-DL-1' tag so this trade-off is searchable." The shallow-lessons acknowledgment lives in the commit message, not in the design doc body. A reader reading `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` post-merge will find a thin lessons section with no inline explanation of why it is thin. The backlog's "Suggested approach" structure (problem / approach / surfaces / validation / lessons) does not include a "rationale for shallowness" slot in the lessons section.
- **Why it matters**: Per Principle 8 (documentation is a deliverable, not a side effect), the design doc itself should be self-explanatory. A commit message is ephemeral context — it requires `git log` to surface. A reader of the design doc in 6 months will not know whether the lessons section is thin because (a) the sessions taught nothing, (b) the doc was written before Wrap-up ran, or (c) this was a deliberate DL-1 trade-off. None of those interpretations are distinguishable from the doc alone.
- **Suggested direction**: Add a one-sentence inline note in the lessons section: "Lessons section is intentionally sparse as of {date} — authored before Wrap-up ran per Bundle C DL-1 (β-1). Deepen after subsequent worktree-pr sessions per R-7." This is the "pre-recorded justification per DL-1 lock" S-8 references — it should live in the doc, not only in git commit history.

### R5-002 — R-5 mitigation for 12-skill wording consistency is advisory with no verification enforcement

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: § Risk Delta R-5: "Recommended: write the canonical substitution string ONCE in Preparation (single skill-edit template), then apply 12 times in Execution. Flag for Preparation." SC-5 verification: `grep -nE 'session-id.*delegation prompt' {each-skill}` checks presence but not character-for-character identity across all 12. A regex match succeeds even if three skills say "from the delegation prompt's session-id: field" and nine say "from the `session-id:` field in the delegation prompt" — same meaning, different word order, both pass SC-5's grep.
- **Why it matters**: Wording variation across 12 skills would not be caught by SC-5 as written. It's a documentation quality issue rather than a correctness issue, but it undermines the "single canonical text" goal of M2.
- **Suggested direction**: Add a stricter verification criterion to SC-5: "At least one file serves as the reference; all 12 grep results match the reference wording character-for-character (diff comparison)." OR accept that word-order variation is acceptable as long as the intent matches and document that explicitly.

---

## Per-perspective verdict

**PASS** — Two findings: R5-001 (Medium/75) and R5-002 (Low/50). Per verdict thresholds: Medium findings at any confidence → PASS; no High or Critical findings. The DL-1 shallow-lessons risk is real but user-accepted. The R-5 wording consistency risk is low severity. Neither triggers REVISE.

---

## Low-confidence appendix

- R5-002 (Confidence 50, Low): R-5 advisory mitigation gap — the wording-drift risk is real but SC-5's grep is a reasonable approximation for an Ideation artifact. Full character-match verification is Planning/Execution scope.

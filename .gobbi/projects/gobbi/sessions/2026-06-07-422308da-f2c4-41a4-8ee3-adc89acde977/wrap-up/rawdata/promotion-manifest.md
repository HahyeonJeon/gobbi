# Promotion Manifest — Session 422308da-f2c4-41a4-8ee3-adc89acde977
# Built at Wrap-up WORK Steps 2.5 + 4
# Append-only routing-decision log; 1 entry per staging file

---

## Step 2.5 — Prior-loop MEMORIZATION compliance scan

| Loop | Finding | Category | Action |
|---|---|---|---|
| ideation | All staging files present, type: values valid | clean | none |
| preparation | All staging files present, type: values valid | clean | none |
| planning | All staging files present, type: values valid | clean | none |
| execution | All staging files present, type: values valid; items 8–10 carry `item_status: pending` + deferred-by notes | clean | route to backlogs per delegation prompt |

No auto-backfill required. No NEEDS_CONTEXT escalation. All 10 files structurally sound.

---

## Staging file routing decisions (10 files)

### File #1 — ideation/staging/decisions/2026-06-07-routine-triage-vs-safety-gate-classification.md

- **Action:** PROMOTE
- **Destination:** `features/workflow/decisions/2026-06-07-routine-triage-vs-safety-gate-classification.md`
- **Rationale:** Standard decisions staging → feature decisions. No `mistake-candidate`. Locked design decision (D8 from ideation iter3). Accepted by user.
- **Frontmatter stripped:** none (no staging-only fields present)
- **Status:** DONE

### File #2 — ideation/staging/checklists/chat-mode-stuck-regression-anchor.md

- **Action:** DROP-AS-ADDRESSED
- **Destination:** none (session staging only)
- **Rationale:** This was a planning-precision note (C1 split-anchor from ideation iter3) flagging that the Chat anchor for Stuck/Regression mode-splits should cite `evaluation.md`, not `chat-mode.md`. Planning picked it up (see `planning/staging/checklists/cross-ref-and-classification-execution-gates.md` item #3) and Execution T1 implemented the correct anchor. The finding was fully resolved in execution. No separate project-memory file needed — the shipped behavior (`evaluation.md` mode-splits cite the correct source) is the record.
- **Status:** DONE (addressed, not promoted)

### File #3 — preparation/staging/decisions/asserted-git-drift-direction-without-running-git.md

- **Action:** PROMOTE (Layer-1 mistake)
- **Destination:** `mistakes/asserted-git-drift-direction-without-running-git.md`
- **Rationale:** `mistake-candidate: true` frontmatter routes to `mistakes/`. Project-scope (process discipline, not feature-specific). Dup-check: related to `leader-iter2-verification-claim-without-evidence.md` and `planning-leader-asserted-file-type-without-verifying.md` but distinct — covers git-position/drift-direction claims specifically. Linked via `## Related` section, not superseding either.
- **Frontmatter stripped:** `mistake-candidate: true` (staging-routing flag per §2.3). The staged `decision_status` is not carried because the promoted file is a **mistakes-type** file — `decision_status` is a decisions-type extension outside the mistakes allowlist, so it is absent by type, not stripped as a "staging-routing field."
- **Status:** DONE

### File #4 — preparation/staging/decisions/2026-06-07-rebase-worktree-to-current-develop.md

- **Action:** PROMOTE
- **Destination:** `features/workflow/decisions/2026-06-07-rebase-worktree-to-current-develop.md`
- **Rationale:** Standard decisions staging → feature decisions. No `mistake-candidate`. Session decision record (manager rebased worktree mid-session). Accepted.
- **Frontmatter stripped:** none. `decision_status: accepted` is **RETAINED** — it is a legitimate decisions-type extension on the §2.2 KEEP-list (§4.4: must never be stripped). This file carries no `mistake-candidate` flag.
- **Status:** DONE

### File #5 — preparation/staging/checklists/skill-md-pointer-line-correction.md

- **Action:** DROP-AS-ADDRESSED
- **Destination:** none (session staging only)
- **Rationale:** This was a planning precision note: the `orchestration/SKILL.md:247` anchor should be `line 266` post-#295. Planning used line 266 (Planning's REVISE iterations were both triggered by the stale anchor, not this note). Execution T4 verified the SKILL.md pointer (item (d), PASS). The correction is live in all downstream artifacts. No separate project-memory checklist file needed.
- **Status:** DONE (addressed, not promoted)

### File #6 — planning/staging/decisions/carried-stale-anchor-despite-upstream-correction.md

- **Action:** PROMOTE (Layer-1 mistake)
- **Destination:** `mistakes/carried-stale-anchor-despite-upstream-correction.md`
- **Rationale:** `mistake-candidate: true` frontmatter routes to `mistakes/`. Project-scope. Dup-check: related to `leader-iter2-verification-claim-without-evidence.md` and `planning-leader-asserted-file-type-without-verifying.md` — same citation-fidelity family, distinct surface (anchor carried from Idea vs readiness report). Linked via `## Related`, not superseding.
- **Frontmatter stripped:** `mistake-candidate: true` (staging-routing flag per §2.3). The staged `decision_status` is not carried because the promoted file is a **mistakes-type** file — `decision_status` is a decisions-type extension outside the mistakes allowlist, so it is absent by type, not stripped as a "staging-routing field."
- **Status:** DONE

### File #7 — planning/staging/checklists/cross-ref-and-classification-execution-gates.md

- **Action:** DROP-AS-ADDRESSED
- **Destination:** none (session staging only)
- **Rationale:** This was an execution gate checklist for T4. T4 ran in Execution and all 4 items passed (see `execution/artifacts/result.md` T4 section: bidirectional cross-refs PASS, classification exhaustive PASS, no-survivor claim verified PASS). All items are now addressed. The checklist was an in-session planning aid, not a durable feature checklist. No separate project-memory file needed.
- **Status:** DONE (addressed, not promoted)

### File #8 — execution/staging/checklists/safety-gate-count-asymmetry.md

- **Action:** PROMOTE (deferred prose-polish backlog)
- **Destination:** `features/workflow/backlogs/safety-gate-count-asymmetry.md`
- **Rationale:** Both evaluators deferred (Claude Low/50, Codex PASS). Not in scope for current session. Open prose-polish item for a future session.
- **Frontmatter stripped:** staging-only fields (`item_status`, `anchor`, `implemented_in`, `scenario`)
- **Status:** DONE

### File #9 — execution/staging/checklists/auto-mode-intro-agent-psychology-wording.md

- **Action:** PROMOTE (deferred prose-polish backlog)
- **Destination:** `features/workflow/backlogs/auto-mode-intro-agent-psychology-wording.md`
- **Rationale:** Both evaluators deferred (Codex Low/75). Links `[[principle-text-lead-with-imperative-not-agent-psychology]]`. Open prose-polish item for a future session.
- **Frontmatter stripped:** staging-only fields (`item_status`, `anchor`, `implemented_in`, `scenario`)
- **Status:** DONE

### File #10 — execution/staging/checklists/evaluation-md-section-name-paraphrase.md

- **Action:** PROMOTE (deferred prose-polish backlog)
- **Destination:** `features/workflow/backlogs/evaluation-md-section-name-paraphrase.md`
- **Rationale:** Both evaluators deferred (Claude Low/50). Open prose-polish item for a future session.
- **Frontmatter stripped:** staging-only fields (`item_status`, `anchor`, `implemented_in`, `scenario`)
- **Status:** DONE

---

## Layer-2 mistake promotion

### Candidate A: asserted-git-drift-direction-without-running-git

- **Generalizability assessment:** YES — applies across all projects. Any planner/leader that infers a worktree's git position from a proxy (system-reminder, main-tree description, grep result) instead of running `git rev-list` will propagate an inverted or incorrect claim downstream.
- **Existing layer2 coverage check:** `layer2-planning-leader-asserted-file-type-without-verifying.md` covers file-type assertions. `layer2-cotouch-enumeration-must-cover-semantic-equivalents.md` covers grep-scope. Neither covers git-position/anchor-fidelity claims specifically.
- **Decision:** CREATE new layer2 file (combined with Candidate B, per delegation prompt guidance)

### Candidate B: carried-stale-anchor-despite-upstream-correction

- **Generalizability assessment:** YES — applies across all projects. Any downstream agent that reads an Idea artifact's approximate anchor instead of the readiness report's verified value will carry a stale reference.
- **Existing layer2 coverage check:** same as above — not covered by existing layer2 files.
- **Decision:** MERGED with Candidate A into a single generalizable layer2 file

### Layer-2 promoted file:

- **Source (both):** `mistakes/asserted-git-drift-direction-without-running-git.md` + `mistakes/carried-stale-anchor-despite-upstream-correction.md`
- **Destination:** `skills/mistake/layer2-verify-state-from-authoritative-source-not-proxy.md`
- **Rationale:** Both mistakes share the same root: asserting a codebase fact from a proxy instead of an authoritative source. A single layer2 file captures the generalized discipline; the two project-level mistakes remain as concrete examples.
- **Status:** DONE

---

## Summary

| # | File | Action | Destination |
|---|---|---|---|
| 1 | ideation/decisions/routine-triage-vs-safety-gate-classification | PROMOTE | features/workflow/decisions/ |
| 2 | ideation/checklists/chat-mode-stuck-regression-anchor | DROP-AS-ADDRESSED | — |
| 3 | preparation/decisions/asserted-git-drift-direction-without-running-git | PROMOTE (mistake L1) | mistakes/ |
| 4 | preparation/decisions/rebase-worktree-to-current-develop | PROMOTE | features/workflow/decisions/ |
| 5 | preparation/checklists/skill-md-pointer-line-correction | DROP-AS-ADDRESSED | — |
| 6 | planning/decisions/carried-stale-anchor-despite-upstream-correction | PROMOTE (mistake L1) | mistakes/ |
| 7 | planning/checklists/cross-ref-and-classification-execution-gates | DROP-AS-ADDRESSED | — |
| 8 | execution/checklists/safety-gate-count-asymmetry | PROMOTE (backlog) | features/workflow/backlogs/ |
| 9 | execution/checklists/auto-mode-intro-agent-psychology-wording | PROMOTE (backlog) | features/workflow/backlogs/ |
| 10 | execution/checklists/evaluation-md-section-name-paraphrase | PROMOTE (backlog) | features/workflow/backlogs/ |
| L2 | two mistake candidates combined | PROMOTE (layer2) | skills/mistake/layer2-verify-state-from-authoritative-source-not-proxy.md |

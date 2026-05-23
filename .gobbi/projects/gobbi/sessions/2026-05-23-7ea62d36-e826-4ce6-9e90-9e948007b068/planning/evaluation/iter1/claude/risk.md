---
loop: planning
iter: 1
system: claude
perspective: risk
---

# Risk Perspective — Planning Iter 1

## Locked Frame (Stage 1)

### Scenarios with attached checklists

**S1 — Mid-plan task failure has clear rollback boundary**
- C1.1 Each task is one PR — atomic git revert possible
- C1.2 A failure between PRs leaves repo coherent
- C1.3 Sequential ordering means earlier-PR-only failure is bounded

**S2 — Tasks touching shared infrastructure are sequenced first**
- C2.1 None of the 7 tasks touches CI/build/package config
- C2.2 → `not-applicable: docs-only bundle`

**S3 — Tasks touching public interfaces are isolated**
- C3.1 Bundle A touches skill SKILL.md files — these are agent-facing interface but no code API changes
- C3.2 Concurrent-session reader risk: another running session reading these skills mid-flight could load partial state. See F-RISK-01

**S4 — Plan's ordering robust to interruption**
- C4.1 Pause-after-task-N leaves repo coherent (single-PR atomicity)
- C4.2 Pause after Task 01: gobbi/SKILL.md changed in isolation — coherent
- C4.3 Pause after Task 02: memorization Core Principle + mistake P2 link added — coherent
- C4.4 Pause after Task 03: delegation hard gate active but Task 04 wrap-up Step 2.5 absent — coherent (Step 2.5 is detection-side, not preventive)
- C4.5 Pause after Task 04: Step 2.5 active, delegation gate may or may not be in place — coherent
- C4.6 Pause after Task 06: codex skill complete but Task 07 sweep not run — coherent; manual sweep possible

**S5 — High-blast-radius tasks gated**
- C5.1 Task 06 (codex content fill, 300-500 lines, 17 verify gates) is the highest-risk task and is sequenced last in the main work (before sweep)
- C5.2 Each task has explicit verifies acting as go/no-go

**S6 — Plan total file-touch count matches Ideation Scope Contract**
- C6.1 Plan touches 13 files (per File map at line 114); Ideation scope is 7 in-scope items mapping to ~8 source files + 4 templates + 1 cross-link target
- C6.2 No scope explosion

**S7 (adversarial) — Task silently widens scope of prior task**
- C7.1 Task 06 explicitly notes "rebases onto Task 01's merged state" for gobbi/SKILL.md Skill Map row
- C7.2 Task 05 explicitly notes "rebase onto Task 02's merged state" for memorization/SKILL.md edit
- C7.3 No silent widening

**S8 (Coverage Matrix: Performance + Risk — Cost / budget impact)**
- C8.1 No paid-API calls; no LLM evaluation cost embedded in tasks
- C8.2 7 PRs × evaluator dispatch cost is the cumulative cost (per F-PERF-01)

**S9 (Coverage Matrix: Risk + Consistency — Privacy)**
- C9.1 → `not-applicable: no PII/regulated data touched`

**S10 (Coverage Matrix: Risk + Structure — Supply chain)**
- C10.1 → `not-applicable: no new deps introduced; docs-only`

## Per-scenario per-check results

| Check | Verdict | Evidence |
|---|---|---|
| C1.1 | yes | Per-task PR strategy at lines 481-491 |
| C1.2 | yes | Each PR base=develop, atomic merge |
| C1.3 | yes | Sequential ordering bounded failure |
| C2.1 | yes | No CI/build/package config touched |
| C2.2 | yes | n/a |
| C3.1 | partial | Skill files are agent-facing interface; concurrent-session impact undocumented. See F-RISK-01 |
| C3.2 | partial | See F-RISK-01 |
| C4.1-C4.6 | yes | Each pause-state coherent |
| C5.1 | yes | Task 06 sequenced before Task 07 (sweep) — largest task last before final verification |
| C5.2 | yes | Verifies per task act as gates |
| C6.1 | yes | 13 files in scope |
| C6.2 | yes | No explosion |
| C7.1-C7.3 | yes | No silent widening |
| C8.1 | yes | No paid-API |
| C8.2 | partial | Cumulative PR-cycle cost not explicitly weighed in Plan (see F-PERF-01) |
| C9.1 | yes | n/a |
| C10.1 | yes | n/a |

## Typed findings

### F-RISK-01 — Concurrent-session read-during-write risk for skill files

- **Type:** `assumption_risk`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Bundle A modifies 8 source files in `.agents/skills/` (gobbi, memorization, mistake, delegation, wrap-up, evaluation, codex) + 3 delegation templates. Per session memory notes, there is historical precedent for concurrent sessions running simultaneously (e.g., "Concurrent session 9755a2cb is bouncing develop with PR-FIN-2 design work — local develop is volatile, trust origin/develop only" from a prior session). The Plan does not mention concurrent-session risk explicitly. If another session is running while this Bundle A is shipping PRs, that session may load partial skill state.
- **Why it matters:** Solo-user context (per memory note "Only one user exists") makes this low-risk in practice — single user means concurrent sessions are deliberate, not accidental. But if a parallel session exists, it should NOT load skills modified by this Bundle A in flight.
- **Suggested direction:** add to Memory reads audit (line 590) a note about concurrent-session checking — "Manager should verify no parallel gobbi session is currently active before dispatching Tasks 02-06 that modify skills loaded by all sessions". Defensible to omit if user confirms no parallel work.

### F-RISK-02 — Task 04 cross-links wrap-up Step 2.5 to three evaluation/SKILL.md sections; broken anchor risk

- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** Task 04 wires 3 cross-links into wrap-up/SKILL.md Step 2.5: (#4) `evaluation/SKILL.md § Finding Metadata (lines 344-352)`, (#5) `evaluation/SKILL.md § Slug + collision policy (lines 385-393)`, (#6) `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type) (line 356)`. Cross-Link Manifest entries 4-6 (`idea.md:319-321`). If `evaluation/SKILL.md` line numbers shift (e.g., a future session reorders sections), all 3 cross-links break silently. Markdown anchors (`#finding-metadata-...`) would be more durable. Verify command at line 246 only checks `grep -c 'evaluation/SKILL.md' wrap-up/SKILL.md >= 2`, not anchor resolution.
- **Why it matters:** Line-number citations are brittle. A reasonable refactor in a future session (e.g., promoting a body block to an H3 — which this very session does for memorization Path conventions) would break these line refs.
- **Suggested direction:** use markdown anchor-style cross-links (`evaluation/SKILL.md § Finding Metadata` without line numbers, OR `[Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity)`). Line numbers can stay as a secondary citation aid but should not be the primary anchor.

### F-RISK-03 — Task 06 omits the verify command for "Cross-Link 10 already wired by Task 06 Skill Map row addition"

- **Type:** `checklist_gap`
- **Domain:** `test`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Task 06 verifies (line 325) includes Skill Map row check: `grep -E 'codex' .agents/skills/gobbi/SKILL.md | grep -i 'skill map\|cross-cutting' || awk '/## Skill Map/,/^## /' .agents/skills/gobbi/SKILL.md | grep -q codex`. The compound `||` form is fragile: if the first grep returns matches but they're outside Skill Map section, the first clause "passes" without actually verifying placement. The fallback `awk` is the right check — the first clause is redundant and weakens the gate.
- **Why it matters:** Verify gate quality. The Skill Map row could land in the wrong section and the `||` short-circuits before the awk check runs.
- **Suggested direction:** drop the first grep clause; rely solely on `awk '/## Skill Map/,/^## /' .agents/skills/gobbi/SKILL.md | grep -q codex` as the canonical check. Even stronger: scope to Cross-cutting subsection specifically: `awk '/^### Cross-cutting skills/,/^### /' .agents/skills/gobbi/SKILL.md | grep -q codex`.

## Verdict

**PASS** — 3 findings (1 Medium, 2 Low). The Medium (F-RISK-02) flags durability of line-number cross-links but is workaround-able by Execution authoring anchors over line refs. Does not cross High threshold.

# Project Perspective — T02 (commit 536d22f)

**Perspective:** project (contract fidelity vs. plan + idea)
**Target:** Task 02 — memorization moment-of-capture principle + reciprocal link
**Verdict:** PASS

## Gate outputs

| Gate | Result | Evidence |
|---|---|---|
| A — Principle present in `memorization/SKILL.md` | PASS | Line 82: `> **Moment-of-capture, not end-of-loop.**` |
| B — memorization → mistake link | PASS | `[mistake/SKILL.md § P2](../mistake/SKILL.md#p2----detect-a-correction-during-work)` |
| C — mistake → memorization link | PASS | `[memorization/SKILL.md § Core Principles § Moment-of-capture](../memorization/SKILL.md#core-principles)` |
| D — Placement (between Store-what-survives and Templates-over-freeform) | PASS | memorization/SKILL.md lines 78, 82, 86 — sandwich order matches plan + idea Design B |
| E — Diff scope (T02 commit) | PASS | `git diff --name-only 536d22f^ 536d22f` = exactly the 2 expected paths |
| F — Witness cited | PASS | "session `2026-05-22-bac669ad` — T1 (8 eval files), T2 (13 eval files), T5 (9 eval files)" |
| H — "immediately" in mistake P2 | PASS | Line 80: `**immediately**` (bold-emphasized) |
| J — grep counts (Moment-of-capture\|moment-of-capture) | PASS | memorization=2 mentions, mistake=1 mention |

## Plan traceability (plan.md:149-185)

- `traces-to: idea.md checklist 4` → memorization Core Principle added: **traced**.
- `traces-to: idea.md checklist 5` → mistake P2 strengthened + reciprocal link: **traced**.
- `traces-to: idea.md Cross-Link Manifest 1 + 2` → both forward + reciprocal links present: **traced**.
- `verifies` items 1-3 (grep for moment-of-capture, mistake/SKILL.md link, memorization/SKILL.md link): **all pass** by inspection.
- `verifies` item 4 (Moment-of-capture inside Core Principles section): **passes** structurally (line 82 sits between line 54 `## Core Principles` and line 92 `## Artifact frontmatter schema`).
- `verifies` item 5 (`git diff --name-only develop... | sort` matches 2 files): see Finding F-PROJ-01 below.
- Brief discipline ("place after 'Store what survives'" verified by reading current file): **satisfied** — placement matches.

## Findings

### F-PROJ-01 — Diff-scope verify command vs. branch reality

- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** plan.md:172 specifies `git diff --name-only develop... | sort | diff - <(... 2 paths ...)`. Actual `git diff --name-only develop...HEAD | sort` on this worktree returns **3** paths (`gobbi/SKILL.md` + `memorization/SKILL.md` + `mistake/SKILL.md`) because T01 lives on the same branch.
- **Why it matters:** The verify command as written would fail (3 ≠ 2) even though the T02 commit itself is exactly 2 files. The author correctly scoped to `536d22f^ 536d22f` instead, which is the right thing to do; this is a plan defect, not an execution defect.
- **Suggested direction:** Treat as plan-side note for the Manager — future "diff-only-these-N-files" verifies on a branch with prior tasks must scope to `HEAD^ HEAD` (commit-scope) or to a known fork point, not `develop...HEAD`.

## Must-preserve list

- The 4-sentence body of the new principle keeps the witness inline (session id + per-task eval-file counts) — preserve this empirical anchor on any future rewrite.
- The reciprocal link wording (`see ... for the rationale and empirical witness`) is calibrated to the moment-of-capture mandate — preserve.
- `**immediately**` bolding in mistake P2 step 3 is the strongest signal short of caps — preserve.

## Verdict

**PASS.** Contract is met: principle present in correct slot, reciprocal links wired both ways, witness cited verbatim, immediacy mandate strengthened in mistake P2. One Low finding is a plan-side verify mis-spec, not an execution defect.

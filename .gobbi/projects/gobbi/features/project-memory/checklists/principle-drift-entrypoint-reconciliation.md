---
name: principle-drift-entrypoint-reconciliation
description: Checklist for reconciling 12-vs-13 principle count drift across entrypoints before authoring the standard.
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [entrypoint, principles, consistency, agents-md]
finding-iter: 1
---

# Principle drift entrypoint reconciliation — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Verify drift is real: grep AGENTS.md + .codex/AGENTS.md + .claude/CLAUDE.md for "principles below" + "Principle 13" | codex-f4 | pending | `grep -n "principles below\|Principle 13\|NO DOCUMENT WORK" .claude/CLAUDE.md AGENTS.md .codex/AGENTS.md` returns 13 in CLAUDE.md + P13 row, 12 in both AGENTS.md files |
| 2 | Update AGENTS.md:63 from "12 principles" to "13 principles" | codex-f4 | pending | grep returns "13 principles below" |
| 3 | Add P13 row to AGENTS.md Iron Law table | codex-f4 | pending | `grep "NO DOCUMENT WORK" AGENTS.md` returns the P13 row |
| 4 | Update .codex/AGENTS.md:63 from "12 principles" to "13 principles" | codex-f4 | pending | grep returns "13 principles below" |
| 5 | Add P13 row to .codex/AGENTS.md Iron Law table | codex-f4 | pending | `grep "NO DOCUMENT WORK" .codex/AGENTS.md` returns the P13 row |
| 6 | Confirm this is a NARROW count-consistency fix — NOT Principle-13 surgery (no new enforcement, no new P13 behavioral content) | Q8-scope-guard | pending | P13 text in AGENTS.md matches .claude/CLAUDE.md exactly; no new content invented |
| 7 | Confirm/defer with user at Planning (PR-1 open finding) | PR-1 | pending | User explicitly approves or defers the AGENTS.md edits before Execution touches entrypoint files |

## Item details

### 7. Confirm/defer with user at Planning

The AGENTS.md and .codex/AGENTS.md edits are evaluator-recommended (Codex F4 iter1) but not
directly user-ratified via AskUserQuestion. They are defensible against Q8 ("avoid unnecessary
change") because they are a narrow count-row consistency fix, not Principle-13 surgery. However,
since they touch two entrypoint files, Planning must surface a confirm/defer decision.

**Anchor reasoning:** PR-1 (iter2 open finding, Low/50-60) — the risk is low but the scope
warrant should be explicit before Execution.

**Verification approach:** manager records the user's decision in the discussion log before the
task is delegated to an executor.

---
name: cold-load-result-react-claude-code
description: P7 cold-load proof of the react skill through the Claude Code mirror entrypoint, by a fresh agent with no session context.
type: notes
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [process, docs-sync]
keywords: [cold-load, p7, react-skill, compiler-off, floor-sufficiency]
author: claude
features_touched: []
steps_completed: [execution]
shipped: []
---

# Cold-load proof — `react` skill, Claude Code runtime

```yaml
runtime: claude-code
canonical_path: .gobbi/projects/gobbi/skills/react/SKILL.md
entry_path_used: .claude/skills/react/SKILL.md   # mirror, not canonical — proves the runtime entry
selected_skill_type: operation
selected_type_child: operation-skill.md
loaded_type_children:
  - operation-skill.md
fixture: >
  Build and self-review a <RecentOrders> panel: fetch 50 recent orders for a customerId,
  filter by typed query, select an order to show detail beside the list. Operator switches
  customers frequently; console stays open all day. Vite + React + TypeScript, client-rendered,
  NO React Compiler, no server framework.
output: A complete typed implementation plus self-review. Fresh agent, no session context.
checks:
  - id: floor-sufficient-ordinary-case
    status: PASS
    evidence: >
      Carried the task first-read to self-review on SKILL.md alone. The floor actively prevented
      the three most common wrong versions: an Effect syncing filtered results into state, a
      useState for the selected order, and an Effect clearing selection on customerId change.
      All three forbidden by number (Principle 3, H5).
  - id: mirror-entry-resolves
    status: PASS
    evidence: Loaded via .claude/skills/react/SKILL.md; routed correctly to coding, principles, typescript.
  - id: exactly-one-type-child
    status: PASS
    evidence: checklists.md only. scenarios.md and evaluation.md deliberately not read.
no_extra_type_child_proof:
  loaded_child_count: 1
  unexpected_children: []
  evidence: Reported file list is 5 entries; no second type child appears.
```

## Verdict

**The floor is sufficient for the ordinary case.** The gate's stated pass condition — carry an
ordinary component from first read to review without opening a child, producing no code that
violates a rule the floor states — was met. The plan's decision gate is therefore NOT triggered as
a floor rewrite.

But six defects were named, four of them in shipped files.

## Confirmed: the predicted compiler-off weakness, and it is worse than predicted

T01's author flagged this from the start and never stopped flagging it. It is real, and it has a
second half nobody predicted.

1. **H8 is written for the compiler-enabled world; the compiler-off case is exception (c)** at the
   end of a nine-line rule. Principle 5 and all of H8's normative text describe a situation the
   reader is not in. It reads inverted for what is probably the common case.
2. **`REACT-CHECK-13` applies only when the compiler IS enabled.** Its `n/a` text restates the
   obligation and then waives the only item that could test it. H8 has exactly one item in the
   coverage map. **A compiler-off codebase gets ZERO checklist coverage on memoization.**
3. **The most frequent compiler-off decision has no rule at all.** H8(c)'s criterion is about
   render cost ("re-renders often with the same props and its render work is expensive"), but the
   everyday decision is **referential identity** — should this child be `memo`'d, and should the
   callback therefore be `useCallback`. That criterion does not describe a callback. Exception (a)
   covers identity for an *Effect dependency*, not identity for a *memoized child's prop*.

Resolved from prior React knowledge, not from the skill: `useState` setters are referentially
stable; `memo` cannot help when props change on every re-render anyway.

## Other named defects

- **4.1 — H15 forbids two rungs and prescribes one the skill never says how to reach.** With no
  server-cache library in the contract, the agent held server data in `useState` inside a hook.
  H15's literal text does not cover local state, so `REACT-CHECK-16` resolves `n/a` — **the
  checklist closes clean while the exact hazard H15 exists to prevent is present in the code.**
  "Do I add a server-cache library" is an ordinary decision the skill neither answers nor escalates.
- **4.2 — no refetch/staleness policy.** `REACT-CHECK-26` demands a named refresh trigger and
  offers no menu and no basis for choosing. On an all-day console the only available trigger
  (remount on customer change) is plainly insufficient; the list silently goes stale.
- **4.3 — P1 demands seven contract switches and supplies no default for any.** Four were
  unanswerable. `typescript` P1 has exactly the missing fallback sentence; `react` P1 has no
  equivalent. P1 was, by its own completion criterion, never completed, and the skill has no
  vocabulary for "completed under recorded assumptions".
- **4.4 — P2 has NO design destination.** All three router rows are review artifacts. Every design
  question had nowhere to go. This is the single structural hole behind 4.1, 4.2 and 4.6.
- **5(c) — `checklists.md`'s evidence floor makes pre-runtime self-review structurally
  unresolvable.** Terminals require inspected evidence with no waiver, but the named evidence for
  the core gates is runtime observation (render twice and compare, resolve two responses inverted,
  operate each control by keyboard, observe an unmount). `PASS` / `FAIL` / `n/a` — none is legal for
  "read and believed correct, not yet run", which is P8's primary author-mode use.
- **5(g) — H10 fuses two independent obligations**: query priority (owned by Testing Library) and
  `act` from `react` (owned by react.dev). They fail independently; References lists them separately.

## Gaps the reader filled from prior knowledge (invisible otherwise)

`useId` for label/input pairing — the skill never mentions duplicate DOM ids, and hard-coding one
would have shipped a real bug in a two-panel layout. `AbortController` alongside the `ignore` flag —
**the skill's only named staleness mechanism is `ignore`, so ten rapid customer switches leave ten
requests running to completion.** The skill's leak model is object retention; it has no concept of
leaked in-flight work. StrictMode double-invocation as the dev-time surface that makes a missing
cleanup visible — unmentioned. That keying remounts, discarding in-flight work and hook state.

## Where the floor was genuinely strong

Principle 3's derived-value rule removed two `useState`s. H5 named `key` as the reset mechanism for
the exact customer-switch case and ruled out an Effect. H6 named the `ignore` race pattern — the bug
fast customer-switching actually causes. H17 answered "Server Components?" before time was wasted.
Principle 4 named the clickable `div` by example; `REACT-CHECK-17` ruled out role+tabindex without
keyboard activation. `REACT-CHECK-09`'s harm text named the long-lived-surface scenario exactly.

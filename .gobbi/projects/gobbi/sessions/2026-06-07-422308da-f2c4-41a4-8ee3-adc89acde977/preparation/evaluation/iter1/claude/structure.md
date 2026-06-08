# Structure — Preparation readiness report eval (iter1, claude)

## Frame + findings

### Scenario S1 — Is the report organized so Planning can consume it?
The report has a clear structure: scope reference → readiness summary → per-item findings → anchors table → decisions log. The anchors table at the end is the load-bearing handoff artifact for Planning. Organization is sound and scannable. PASS.

### Scenario S2 — Are gaps separated from confirmed-ready items?
G1 (CLAUDE.md drift) and G2 (anchor off-by-one) are called out as distinct flagged items, separated from the PASS items. The "Out of scope gaps" section isolates G1. Decomposition is clear. PASS.

### Scenario S3 — Is the anchors table internally consistent with the prose?
The anchors table (lines 94-110) restates the prose findings. I cross-checked: every table row matches its prose counterpart (line 78, 208, 251, 271, 292; evaluation.md line 5 / 119 / 188-199 / 239 / 242-249 / 253-258; CLAUDE.md line 27; SKILL.md:247; chat-mode.md 154/237 + absent). Internally consistent. PASS.

### Finding S-1 — Header-line vs content-line imprecision in anchors table (Low)
- **Type:** general
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** Report anchors table cites "§ Regression marking line 239", "§ Stuck detection lines 242-249", "§ Iteration Caps 253-258". Live file: § Regression marking *header* is line 234 (line 239 is the AskUserQuestion sentence inside it); § Stuck detection *header* is line 241 (242-249 is its body); § Iteration Caps *header* is line 253. The report cites the content/sentence lines, not the section headers.
- **Why it matters:** A Planner doing a surgical Edit needs the header anchor to locate the section; citing the inner sentence line is still resolvable but slightly less precise. Not a blocker — all cited lines exist and resolve to the named section.
- **Suggested direction:** Planning may want header lines (234/241/253) plus the inner sentence lines for the exact edit point. Manager/user decide.

No structural blocker. The report is well-decomposed and consistent with itself.

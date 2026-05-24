## Artifact Summary + Memory reads
Artifact: Ideation iter1 draft for `session-foundations-bundle-b`.
What: A two-part session-foundation idea covering worktree-first sessions and automatic subagent metadata capture.
Why: Prior work produced incomplete PR artifacts and incomplete session telemetry.
How: The draft locks T1 and T3 decisions, backlogs T2 and adjacent items, and lists implementation checklist items for later Planning/Execution.
Scope source: `ideation/rawdata/draft-iter1.md` lines 19-65.
Memory reads:
- `ideation/rawdata/draft-iter1.md` full file.
- `.claude/skills/ideation/evaluation.md` lines 167-205 for Aesthetics seed scenarios.
- `AGENTS.md` lines 3-13 and 17-23 for Codex-facing path vocabulary.
- `.codex-plugin/plugin.json` lines 8-9 for plugin skill root.
- `ls -l .agents/skills` and `ls -l .claude/skills` to check whether the displayed skill paths are symlinked.
- `rg -n "\b(TBD|TODO)\b|\?\?\?" draft-iter1.md` returned no output.
- `rg -n "T[13]-DQ-[0-9]" draft-iter1.md` returned DQ anchor uses at lines 213, 217-219, 250, 253-254, 267, 281, 303, 309-310, 316-317, and 323-324.
- Project mistakes: whole-file grep mistake loaded because this is a docs artifact with naming/cross-reference risk.

## Locked Frame (Stage 1)
Scenario A1: A new reader understands the proposal from the first page.
- Check A1.1: The title and opening paragraph identify phase, feature, and deliverable.
- Check A1.2: Scope is stated before implementation details.
- Check A1.3: T1 and T3 are visually separated and easy to scan.

Scenario A2: Naming and path labels are accurate.
- Check A2.1: Proposed path names match the repo's active entry points.
- Check A2.2: Anchor labels cited in rationale are defined somewhere in the artifact.
- Check A2.3: A Planner can lift names directly without resolving hidden aliases.

Scenario A3: Document structure follows the Ideation draft convention.
- Check A3.1: Frontmatter is present.
- Check A3.2: Scope Contract, Framed Problem, Research Insights, Scenarios, Implementation Checklist, Design, and Decisions Log are present.
- Check A3.3: Deferred items and backlog paths are grouped.

Scenario A4: No placeholder or filler remains.
- Check A4.1: No `TBD`, `TODO`, or `???`.
- Check A4.2: "..." is not used as a placeholder in actionable fields.
- Check A4.3: Each section carries unique information.

Scenario A5 (adversarial): A reader skims the draft and targets the wrong implementation surface.
- Check A5.1: The paths emphasized in headings/checklists are the canonical paths for the target runtime.
- Check A5.2: Any legacy or alternate path surface is explicitly called out.
- Check A5.3: The first actionable checklist does not send a future executor to stale docs.

## Per-scenario per-check results
A1.1: Yes. Lines 9-13 identify loop, session, feature, and source records.
A1.2: Yes. Scope appears before framed problem and design.
A1.3: Yes. T1 and T3 are separated in Scope, Framed Problem, Research, Scenarios, Checklist, and Design.
A2.1: No. The draft repeatedly names `.claude/skills/...` implementation targets, while `AGENTS.md:3-13` says Codex-facing skills and plugin skills are under `.agents/skills` and `.gobbi/projects/gobbi/skills`.
A2.2: No. `T1-DQ-*` and `T3-DQ-*` anchors are cited but not defined as a visible subsection or glossary. The only visible `DQ-1` entry is for deferred T2 at line 376.
A2.3: Partial. Most file names are concrete; the DQ anchors and path-surface split are not.
A3.1: Yes. Frontmatter exists at lines 1-7.
A3.2: Yes. Required major sections are present.
A3.3: Yes. Deferred and backlog paths are grouped at lines 56-65 and 391-396.
A4.1: Yes. Placeholder grep for `TBD`, `TODO`, and `???` returned no output.
A4.2: Partial. Ellipses appear only in abbreviated paths like `~/.claude/projects/...`, not placeholder content.
A4.3: Yes. Sections carry distinct content.
A5.1: No. The implementation checklist emphasizes `.claude/skills` paths at lines 238-253.
A5.2: No. The draft does not explain the relationship between `.claude/skills`, `.agents/skills`, and `.gobbi/projects/gobbi/skills`.
A5.3: No. A future Codex executor could follow line 238 and edit `.claude/skills/orchestration/SKILL.md` only.

## Typed findings
COD-AESTH-001
- type: checklist_gap
- domain: docs-sync
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:238-253` targets `.claude/skills/...`; `AGENTS.md:3-13` names `.agents/skills` and `.gobbi/projects/gobbi/skills` as Codex/plugin source paths; `.codex-plugin/plugin.json:8` points plugin skills at `./.gobbi/projects/gobbi/skills/`.
- surfaced-by: codex
- disposition: open
- detail: The document's path vocabulary is visually precise but misleading for Codex/plugin consumers. The draft should either switch implementation targets to the canonical paths or explicitly state that `.claude/skills` is a separate Claude-facing surface that must be synchronized.

COD-AESTH-002
- type: checklist_gap
- domain: process
- confidence: 75
- severity: Low
- evidence: `rg -n "T[13]-DQ-[0-9]" draft-iter1.md` shows multiple T1/T3 DQ anchor uses, while no visible DQ glossary or defining subsection exists for those labels.
- surfaced-by: codex
- disposition: open
- detail: Undefined DQ labels weaken skim-readability. The draft should add a compact "Design question anchors" list or replace the labels with the corresponding decision names.

## Low-confidence appendix
- Low-confidence note: The `.claude/skills` surface may be intentionally maintained for Claude Code runtime compatibility, but the artifact does not say that.
- Low-confidence note: The DQ anchors may be defined in raw sub-step source files; the canonical draft should still be self-contained enough for Planning.
- No placeholder blocker found.
- No readability issue rises to Critical or High by the Aesthetics lens alone.
Verdict: REVISE

# Ideation: Fix Doc Review Findings

## Initial User Prompt

User requested fixing all remaining issues from the doc-review workflow (20260328-a935d6db-doc-review). The review had identified blocking stubs, stale references, recipe violations, and frontmatter name mismatches across gobbi's `.claude/` documentation.

## Discussion Points

### 1. Recipe violation tension

**Problem:** gobbi-claude standard says "must avoid step-by-step recipes" but orchestration, plan, execution, and collection skills describe workflows that ARE sequential. We had just added MORE numbered steps to gobbi-orchestration in this session (ask-to-evaluate, discuss-evaluation substeps).

**Options discussed:**
- **Exempt workflow skills** — accept that these are inherently procedural
- **Reframe as principles (chosen)** — replace numbered steps with principle-based guidance that conveys sequence without rigid numbering
- **Hybrid** — keep brief sequence overview + principle details

**User decision:** Reframe as principles. Agents understand flow without a numbered checklist.

### 2. Frontmatter name mismatches

4 skills have frontmatter `name` not matching directory: gobbi-execution (named `task`), gobbi-delegation (named `delegate`), gobbi-claude (named `claude`), gobbi-plan (named `plan`).

**User decision:** Fix all. Small change, prevents confusion.

### 3. gobbi-notification exception

335 lines, 10 code blocks. Flagged as exception candidate.

**User decision:** Accept as exception. Utility skill with inherently technical content.

### 4. gobbi-planner.md (empty agent stub)

Currently the orchestrator handles planning via EnterPlanMode. Question was whether a separate planner agent is needed.

**User decision:** Write the planner agent. Orchestrator delegates to planner for complex decomposition.

### 5. gobbi-hack/SKILL.md (empty skill stub)

Design doc (hacks.md) describes the patch system. Skill file is empty.

**User decision:** Write the skill following gobbi-claude standards.

## Final Refined Idea

Fix all remaining doc review findings in one workflow:

| Category | Files | Action |
|----------|-------|--------|
| Blocking stubs | gobbi-hack/SKILL.md, gobbi-planner.md | Write new content |
| Stale references | distribution.md, hacks.md | Fix renamed skill refs, update directory listings |
| Recipe violations | gobbi-orchestration, gobbi-plan, gobbi-execution, gobbi-collection | Reframe as principles |
| Name mismatches | gobbi-execution, gobbi-delegation, gobbi-claude, gobbi-plan | Fix frontmatter name fields |
| Exception | gobbi-notification | Accept as-is |

**Constraints:** All changes follow gobbi-claude standards. Recipe reframing preserves workflow knowledge. Notification accepted as exception.

## Evaluation

Skipped — scope well-defined from review findings. User opted to proceed directly to planning.

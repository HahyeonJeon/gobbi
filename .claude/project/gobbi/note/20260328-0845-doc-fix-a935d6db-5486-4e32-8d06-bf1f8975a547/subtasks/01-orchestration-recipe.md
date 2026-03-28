# Subtask 01: Reframe step-by-step recipes in gobbi-orchestration/SKILL.md

## What was changed

**Step 1. Ideation Loop** -- Replaced 5 numbered substeps (1. Discuss, 2. Ask to evaluate, 3. Evaluate, 4. Discuss evaluation, 5. Improve or loop) with 4 blockquote principle statements:
- "Discussion precedes evaluation" -- covers the discuss step
- "Evaluation is the user's choice" -- covers ask-to-evaluate and the conditional nature of evaluation
- "Evaluation findings are input to a conversation, not marching orders" -- covers discuss-evaluation
- "Improvement follows agreement" -- covers improve-or-loop and the write-ideation.md exit condition

**Step 2. Plan Loop** -- Replaced 6 numbered substeps (1. Plan, 2. Discuss, 3. Ask to evaluate, 4. Evaluate, 5. Discuss evaluation, 6. Improve or loop) with 5 blockquote principle statements:
- "Planning happens in plan mode" -- covers EnterPlanMode/ExitPlanMode usage
- "Discussion precedes evaluation" -- covers the discuss step
- "Evaluation is the user's choice" -- covers ask-to-evaluate
- "Evaluation findings are discussed before acting" -- covers discuss-evaluation
- "Revision follows agreement" -- covers improve-or-loop and the write-plan.md exit condition

**Step 3 and Step 4** -- No changes needed. Both sections already used bullet points (not numbered lists), which is acceptable per the gobbi-claude documentation standard.

## What was preserved exactly

- Frontmatter (lines 1-5): unchanged
- Workflow task table (Step 1-4 subjects): unchanged
- "Load these skills at each step" table: unchanged
- Section headers ("### Step 1. Ideation Loop" etc.): unchanged
- "Three Phases of Work" section: unchanged
- "Constraints" section: unchanged
- All workflow knowledge (discuss, ask-to-evaluate, evaluate-if-requested, discuss-evaluation, improve): present in principle statements

## Line count

- Before: 144 lines
- After: 149 lines (under 200 target)

The small increase comes from blockquote formatting requiring blank lines between principles for readability.

## Judgment calls

1. **Merged "evaluate" substep into the "evaluation is the user's choice" principle** rather than giving it a separate principle. The conditional spawning of 3 evaluator agents is already fully specified in the Constraints section, so repeating the "3 agents" detail in Step 1/2 would be redundant. The principle statement makes clear that evaluation only happens when the user opts in.

2. **Used consistent principle naming across Step 1 and Step 2** ("Discussion precedes evaluation", "Evaluation is the user's choice") to reinforce that both loops follow the same pattern. Step 2 adds one extra principle ("Planning happens in plan mode") for the EnterPlanMode requirement that has no Step 1 equivalent.

3. **Changed the introductory line** from "Loop until the idea is solid:" (with colon, implying a list follows) to "Loop until the idea is solid." (with period, since principles follow rather than steps).

# Ideation: Gobbi Improvements

## Initial User Prompt

User requested two things:
1. Fix remaining TodoWrite references in vision.md and gsd-analysis.md (replace with TaskCreate/TaskList)
2. Design and implement improvements for 5 problems identified in the GSD comparison doc review

User explicitly stated: "We don't need to follow GSD. Let's design our own patterns via discussion." The GSD comparison was research input, not a blueprint.

## Discussion Points

### Problem framing

User asked for explanation of why each improvement is needed. Explained the concrete problems each addresses — state loss after compaction, evaluators that only reason but never verify, prose-only plans, no cross-task consistency checks, no workflow toggles.

### Design decisions (all from discussion, not GSD copies)

**1. State amnesia — Resume protocol**
- Notes (ideation.md, plan.md, execution.md) already ARE workflow state on disk
- Missing piece: orchestrator doesn't check notes on resume/compaction
- Solution: add resume protocol to orchestration — check latest note directory, infer workflow position from which files exist
- User approved: "Good direction"

**2. Shallow evaluation — Evaluators run verification**
- Evaluator agents already have Bash access
- Evaluation skills never instruct them to run anything
- Solution: update evaluation skills with principle "verify by running, not just reasoning"
- User chose: evaluators run commands directly (vs. separate verification step)

**3. Plan ambiguity — Required plan dimensions**
- Plans are prose, hard to check mechanically
- Solution: add principle to gobbi-plan that plans must make explicit: files modified per task, verification commands, dependencies
- Not a rigid template (violates gobbi-claude), but required dimensions

**4. Cross-task regression — Lightweight wave check**
- After parallel wave completes, no verification of combined consistency
- User chose: lightweight orchestrator check (not a separate evaluator spawn)
- Solution: orchestrator reviews combined changes after each wave before proceeding

**5. Workflow customization — Session flags + hack patches**
- User chose: both session flags (temporary) and hack patches (persistent)
- Solution: extend session-start AskUserQuestion with workflow toggles, hack system for permanent customization

### TodoWrite fix

Trivial: replace TodoWrite with TaskCreate/TaskList in vision.md and gsd-analysis.md.

## Final Refined Idea

Design and implement all 5 gobbi-native improvements plus the TodoWrite fix. Each improvement gets a design rationale in the relevant skill/doc and implementation as principle-based guidance. Deliverable: updated skills + design docs.

## Evaluation

Skipped — directions clear from discussion.

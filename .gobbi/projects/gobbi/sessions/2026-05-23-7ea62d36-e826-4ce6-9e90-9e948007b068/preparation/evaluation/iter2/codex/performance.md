# Performance Perspective

## Artifact Summary + Memory reads

What: evaluate performance and budget implications of the iter2 Preparation outputs. Why: Design A explicitly treats cost and sandbox budget awareness as a first-class H2, and removing it can create downstream token/cost drift. How: inspect the locked cost section, the iter2 stub's replacement placement, and prior iter Performance findings.

Memory reads:
- Target stub and draft iter2.
- Design A locked H2 list.
- Iter1 `performance.md`.
- Existing project skill baseline grep results.
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: Preparation does not create unnecessary downstream rework.
- Check: the generated stub is stable enough for Planning.
- Check: known budget guidance remains easy to find.

Scenario 2: Cost and sandbox budget awareness is preserved at the required prominence.
- Check: `Cost + sandbox budget awareness` exists as locked H2 #7.
- Check: effort/model/default-cost guidance is not buried in an unrelated section.

Scenario 3 (adversarial): Execution follows H2 headings as its task boundaries.
- Check: a cost/budget task can be decomposed directly from the H2 skeleton.
- Check: no new `Constraints` task displaces the cost/budget task.

Coverage notes: runtime throughput and scalability are not applicable to this small markdown artifact. Cost/budget impact is applicable.

## Per-scenario per-check results

Scenario 1:
- FAIL: Planning would have to repair the H2 contract before decomposing Item A content tasks.
- PASS: there is no broad performance audit or unrelated project-wide work added.

Scenario 2:
- FAIL: the locked cost/budget H2 is absent.
- MIXED: cost guidance exists as a comment under `## Use cases` at stub lines 104-107, but Design A requires it as its own H2 at locked position #7.

Scenario 3:
- FAIL: a planner slicing work by H2 will create a `Constraints` task that Design A did not authorize, while missing the distinct `Cost + sandbox budget awareness` task.

## Typed findings

### COD-PREP2-PERF-001

- Type: `design_flaw`
- Domain: `cost`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Design A line 22 locks `Cost + sandbox budget awareness` as H2 #7. The iter2 stub has no such H2; the only cost material is folded into `## Use cases` comments at lines 104-107.
- FP-check: not a preference for longer docs. The locked design elevated budget awareness to a section because Codex effort/model choices affect token cost and sandbox budget.

### Inherited finding dispositions

- Iter1 Performance had no findings. New finding introduced in iter2 because the repair removed the dedicated cost/budget H2 that iter1 still had at `skill-stub-iter1.md:70`.

## Verdict

REVISE. Performance had passed in iter1 partly because the cost/budget H2 existed. Iter2 regresses that budget control from a locked section to a sub-bullet.

## Low-confidence appendix

No low-confidence findings.

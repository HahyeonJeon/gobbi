# Coding skill family backlog

## Coding example and wording fixes from the principles review

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Fix five small defects in the Coding Principles and OOP docs. The SRP example uses a frozen
`dataclass` with a `list` field, so `hash()` raises, and its `(item, cents)` tuple needs a comment to explain
it. The `RateLimiter` good example reads `time.monotonic()` itself, while its anti-pattern takes `now` as an
argument. The State Pattern prose justifies classes because each mode holds its own data, but the selection row
never names that reason. The Simplicity sentence "Most overengineered code should not exist" is circular. The
Adapter example's `int(amount * 100)` drops fractions of a cent without saying so.

**Why backlogged:** The 2026-09-25 coding review listed these as lower-priority notes. The accepted topic
contract did not include them.

**Context:** Locations: `solid.md` SRP example, `oop-principles.md` Abstraction
`RateLimiter`, `design-pattern.md` State Pattern and Adapter Pattern, and [Coding
Principles](../../skills/coding/principles.md) Simplicity. Every example must stay typed Python 3.12 and pass
`mypy --strict --python-version 3.12`. See the [Coding skill family design](../design/feature/coding-skill-family.md).

## Coding Planning repeats leaf text and invariant checks

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Decide whether Coding Planning should stop copying each leaf's title, work, boundary, and output
from the task hierarchy into the plan's task group, and whether Step 3.4 should stop repeating the six
invariant checks that Step 3.3 already ran.

**Why backlogged:** The 2026-09-25 coding review raised both as an extra note. The user did not decide them,
so the topic contract excluded them.

**Context:** [Coding Planning](../../skills/coding/coding-planning/SKILL.md) Step 3.2 says "Copy or
restate every combined leaf's title, work, boundary, and output into the group" so each group reads without
its task paths. Step 3.4 repeats the six checks "against the final bytes" before the freeze. Removing either
changes what a task-group reader must open and what the freeze proves.

## Coding Review report records the review depth

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Add a header field for the bound `review-depth` token to the Coding Review report template, so a
reader can check which in-contract bar the review applied.

**Why backlogged:** The 2026-09-25 review asked for this field together with the `review-depth` definitions.
The accepted work defined the tokens in Coding Review Step 1.1 and left `report.md` unchanged.

**Context:** The [report template](../../skills/coding/coding-review/report.md) header names target,
reviewer, independence, and criteria only. Cowork and Workflow send a `review-depth` token with every Coding
Review call; see [Review](../design/process/evaluation.md#review-depth).

## OOP child repeats public API and no-pattern policy

**Backlogged at:** 2026-09-25T15:10:31Z

**What:** Give the public API rule and the no-pattern rule one owner each in the OOP child. Delete the
Principle "Design the public API from the caller's side", because Intuitive Public API in Coding Principles owns
it. Cut the learning-depth Rule to its MUST sentence and the link. Merge "Default to no pattern" into "Name the
force before the abstraction". Align the child's `description` and Intro, which still name public API design.

**Why backlogged:** The accepted fix for this finding changed only the Coding root Intro. The duplicate cuts in
the child were outside the topic contract.

**Context:** "Learning depth 2 or less" appears in Coding Principles, an OOP Rule, an OOP Preference, and a
selection-table row. "No pattern without a present force" appears in two OOP Principles and one Rule. The
[Coding skill family design](../design/feature/coding-skill-family.md) records Intuitive Public API as the owner
of public API design. See
[`coding-object-oriented-programming`](../../skills/coding/coding-object-oriented-programming/SKILL.md).

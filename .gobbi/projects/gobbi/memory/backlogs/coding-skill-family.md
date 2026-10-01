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

## Coding Ideation home for cross-cutting design policy

**Backlogged at:** 2026-09-25T18:00:36Z

**What:** Decide where Coding Ideation designs cross-cutting policy: failure and recovery, security,
performance, concurrency, compatibility, and observability. Then give that policy a home in the three-level
design and its template, or remove the checklist items that expect it. Reword the `ideation-design` bar,
which still names "work strategy", to match.

**Why backlogged:** It needs a design decision. The v1.3.2 release review raised it (review-01 P4, with I3 for
the bar wording), and the user deferred it.

**Context:** The [Coding Ideation checklist](../../skills/coding/coding-ideation/checklist.md) still flags
missing failure and recovery design (`:42`) and missing security, performance, concurrency, compatibility, or
observability treatment (`:45`). The v1.3.1 `Strategy and Policy` level held this policy. The current levels
and the template's caller contract (inputs, outputs, and errors) do not. A result that follows the procedure
can fail its own baseline, or the choice moves into Coding Execution, which stops on an open design choice.
The bar text is in [Coding Review](../../skills/coding/coding-review/SKILL.md) Step 1.1 and
[Cowork](../../skills/cowork/SKILL.md). See the [Coding skill family design](../design/feature/coding-skill-family.md).

## Coding Principles placement in the domain-skill standard

**Backlogged at:** 2026-09-25T18:00:36Z

**What:** Make the Gobbi Skill domain-skill standard agree with the accepted placement of
[Coding Principles](../../skills/coding/principles.md) at the Coding root.

**Why backlogged:** The v1.3.2 release review raised it (review-01 P6). The user accepted the placement
earlier, and deferred the standard change.

**Context:** The [domain-skill standard](../../skills/gobbi-skill/domain-skill/SKILL.md) and its
[checklist](../../skills/gobbi-skill/domain-skill/checklist.md) reject a policy doc at a domain root. The
exception is recorded only in the [Coding skill family
design](../design/feature/coding-skill-family.md#shared-coding-principles).

## Coding consistency notes from the v1.3.2 release review

**Backlogged at:** 2026-09-25T18:00:36Z

**What:** Fix seven small consistency gaps:

- Split the four [Coding Ideation checklist](../../skills/coding/coding-ideation/checklist.md) items that each
  join two signs (`:47,59,68,70`).
- Mark the Python-specific "Check first" forms in the
  [`coding-object-oriented-programming`](../../skills/coding/coding-object-oriented-programming/SKILL.md)
  pattern table as Python examples.
- Add a `> **Confirmed:**` line to the Coding Ideation `templates/ideation-index.md`, so the checklist item
  "The result records a design the user did not confirm" can be answered from the result.
- Align the OOP child's inline-test question, which omits "repeat a rule", with the Simplicity inline test in
  [Coding Principles](../../skills/coding/principles.md#simplicity).
- Say where [Coding Execution](../../skills/coding/coding-execution/SKILL.md) Step 3.1 records an added
  interface or base class when an Ideation design exists.
- Add a flat-placement item to the [Coding Planning checklist](../../skills/coding/coding-planning/checklist.md)
  to match the Step 3.4 check.
- Split the three baseline cases in the first bullet of [Coding Review](../../skills/coding/coding-review/SKILL.md)
  Step 3.1.

**Why backlogged:** The v1.3.2 release reviews raised these as non-blocking notes (review-01 P10, I1, I2, I4,
I6, and I7; review-02 I3). The user limited the release fixes to blocking changelog findings and a few small
consistency fixes.

**Context:** The release review history is in [Gobbi v1.3.2](../reports/note/2026-09-25-gobbi-v1-3-2-release.md).

## Fixed Workflow draft path for Coding Ideation

**Backlogged at:** 2026-09-25T18:00:36Z

**What:** Decide whether Workflow should name one fixed Coding Ideation draft path, such as
`{session-root}/tmp/ideation/`, instead of any caller-named location under `{session-root}/tmp/`.

**Why backlogged:** The v1.3.2 fix gave Workflow's Coding Ideation call a draft location, so Ideation no longer
stops on a first run. Review-02 raised the fixed path as an out-of-contract improvement (I2), and the user
deferred it.

**Context:** [Workflow](../../skills/workflow/SKILL.md) Step 1.5 passes a "caller-named draft location
under `{session-root}/tmp/`". [Coding Ideation](../../skills/coding/coding-ideation/SKILL.md) stops when no
draft location is named. See the [Coding skill family design](../design/feature/coding-skill-family.md).

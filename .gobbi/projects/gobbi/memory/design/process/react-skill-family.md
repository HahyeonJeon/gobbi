# React skill family

## Intent

The [React root](../../../skills/react/SKILL.md) is navigation-only. It routes React work for browser
applications and Electron renderers to exactly seven direct children. React Native uses project-specific
guidance. Its orientation does not claim broad review ownership; the Conventions child retains the narrower
component, Hook, and JSX review route.

The family separates complete work lifecycles from focused lookup and preference guidance. It uses literal,
mainstream React vocabulary and keeps broader browser, desktop, Electron, release, and observability outcomes
with their owning skills. The reserved `design` capability is type-neutral: it means creating or judging
domain-specific structure, behavior, boundaries, and interfaces, whether a child implements that capability
as an operation or a preference.

## Ownership

| Child | Type | Current responsibility |
|---|---|---|
| [`react-compiler`](../../../skills/react/react-compiler/SKILL.md) | Tool | Installed compiler configuration, diagnostics, function-level coverage, adoption, memoization boundaries, and measured compiler claims |
| [`react-conventions`](../../../skills/react/react-conventions/SKILL.md) | Preference | Component, Hook, JSX, file, export, colocation, and naming conventions after project conventions are inspected |
| [`react-design`](../../../skills/react/react-design/SKILL.md) | Operation | A complete Study → Design → Validate → Handoff lifecycle for an accepted React component design |
| [`react-development`](../../../skills/react/react-development/SKILL.md) | Operation | A complete Study → Design → Build → Verify → Handoff lifecycle for one bounded React-local change |
| [`react-server`](../../../skills/react/react-server/SKILL.md) | Tool | Installed-framework server rendering, hydration, Server Component, Server Function, directive, transfer, and trust-boundary guidance |
| [`react-testing`](../../../skills/react/react-testing/SKILL.md) | Operation | A complete Study → Design → Build → Run → Handoff lifecycle for component and Hook tests and test-local support |
| [`react-typescript`](../../../skills/react/react-typescript/SKILL.md) | Tool | Installed-definition guidance for TSX, props, children, events, Hooks, refs, and JSX-facing values |

## Lifecycle boundaries

- React Design binds the accepted product outcome, current behavior, affected people, included questions,
  exclusions, authority, and record location before study. Evidence must support credible alternatives before
  component design begins; every behavior needs a result or named application owner before validation; and the
  complete design must self-validate with user decisions resolved before handoff.
- React Development requires an accepted task and React design before study. Project evidence must support
  behavior modeling, structural contradictions and slice-exposed design defects return to implementation
  design, the complete skeleton precedes detail, and the exact final tree must pass its applicable evidence.
- React Testing requires accepted React behavior and explicit test-authoring authority before stack
  inspection. It changes component or Hook tests and test-local setup only, designs the complete test skeleton
  before detailed assertions, assigns each claim to the lowest directly observable layer, and runs
  narrow-to-wide evidence before handoff.
- Design and Development route complete browser, installed-desktop, Electron, deployment, release, and
  observability claims to their exact owners. Testing routes real-browser and full-application evidence to
  `web-testing`, Electron runtime evidence to `electron-testing`, release evidence to `electron-release`,
  product-source repair to `react-development`, and independent judgment to Evaluation.

## Checklist design

The seven children own ten unchecked checklist sources: one base source per child plus one supplemental
`lifecycle-checklists.md` source for each of Design, Development, and Testing. The supplements preserve the
operation lifecycle without overloading a saturated base source.

Scenario and row IDs use one stable prefix per child. A checkbox row defines one binary condition. A reused
condition is defined once and referenced with `Also applies`. Each scenario has one through six rows, and each
source has at most 55 rows. Existing IDs and references are preserved when guidance is narrowed or split.
The current corpus has 142 scenarios, 450 unchecked rows, 592 unique scenario/row IDs, and 16 valid
cross-scenario `Also applies` references. The
[final evaluation correction review](../../reports/review/2026-08-04-react-skill-family-final-evaluation-corrections.md)
records the corrected audit result; the [earlier review](../../reports/review/2026-08-03-react-skill-family-review.md)
remains a point-in-time report.

## Current technical decisions

- React Design, Development, and Testing each carry six coherent Rule invariants. Ordered actions, technical
  detail, routing, recovery, and evidence mechanics remain binding in their Procedures and both checklist
  sources instead of being packed into compound Rules.
- Error Boundary claims depend on the exact installed React and renderer releases and their official
  documentation. Descendant render failures remain supported; stable React 19 supports Error Boundary
  handling for errors thrown inside a function passed to the `startTransition` function returned by
  `useTransition`, while stable React 18.3 documents that behavior as canary-only. Ordinary event-handler,
  server-rendering, self-boundary, and unrelated asynchronous failures stay with their responsible handlers.
- Render-time `ref.current` access remains prohibited except for React's predictable guarded lazy
  initialization: the initialized result is stable, and the guarded branch runs only during initialization.
  Read and write obligations remain separate.
- React Testing records evidence by classification. Test defects record a test-local repair and reruns;
  product defects record product failure evidence and route to `react-development`; environment gaps,
  unsupported claims, and unresolved flakes record only their exact gap or stop and matching terminal status.
- The cross-cutting [plugin package contract](../../../skills/claude-plugin/SKILL.md) governs generated
  `plugins/gobbi/skills/` and `plugins/gobbi/agents/` projections. React work edits canonical sources first,
  then regenerates and byte-checks the package.

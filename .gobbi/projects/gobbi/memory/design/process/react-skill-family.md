# React skill family

## Intent

The [React root](../../../skills/react/SKILL.md) is navigation-only. It routes React work for browser
applications and Electron renderers to exactly seven direct children. React Native uses project-specific
guidance.

The family separates complete work lifecycles from focused lookup and preference guidance. It uses literal,
mainstream React vocabulary and keeps broader browser, desktop, Electron, release, and observability outcomes
with their owning skills.

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

- React Design starts from an accepted product outcome and current behavior. It defines the component
  hierarchy and static skeleton before state, Effects, identity, failure, host, accessibility, and performance
  behavior. It validates representative scenarios before handing the design to React Development.
- React Development starts from an accepted React design. It records the exact affected set, establishes the
  complete implementation skeleton, grows the smallest verified behavior slices, and verifies the exact final
  tree before handing off broader claims.
- React Testing changes component or Hook tests and test-local setup only. It chooses the lowest layer that
  can directly observe each claim, builds the complete test skeleton before detailed assertions, and runs
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
The [completed review](../../reports/review/2026-08-03-react-skill-family-review.md) records the current corpus
counts and adversarial audit result.

## Current technical decisions

- Render-time `ref.current` access remains prohibited except for React's predictable guarded lazy
  initialization: the initialized result is stable, and the guarded branch runs only during initialization.
  Read and write obligations remain separate.
- React Testing records evidence by classification. Test defects record a test-local repair and reruns;
  product defects record product failure evidence and route to `react-development`; environment gaps,
  unsupported claims, and unresolved flakes record only their exact gap or stop and matching terminal status.
- The cross-cutting [plugin package contract](../../../skills/claude-plugin/SKILL.md) governs generated
  `plugins/gobbi/skills/` and `plugins/gobbi/agents/` projections. React work edits canonical sources first,
  then regenerates and byte-checks the package.

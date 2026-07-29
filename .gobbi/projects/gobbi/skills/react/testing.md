# React — Testing

**Ownership** — how a React change is proved: what React itself publishes about testing and what it does
not, why `act` exists and where it is imported from, which testing APIs React has removed or deprecated
and what replaces each, and how the layers of a React test stack divide.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened to settle one
question — which API, which query, what replaced the removed thing — and closed again. P4's other three
categories do not describe it: no artifact set, no per-unit orchestration, not a sub-procedure another
consumer loads.

This doc **deepens, and does not restate,** `SKILL.md` Principle 7 and Rule `H10`, and the `testing.md`
row of the P2 router. `H10` states the obligation; this file is the mechanism, the currency facts, and the
evidence boundary.

**Read this first, because it decides how to read everything below.** react.dev publishes **no testing
guide**. Its Learn section has no testing page at all, and the only testing material in the reference is
the `act` API and the migration notes that removed or deprecated the older testing APIs. So React's
positions on testing are narrow and specific — `act`, its import, and what was removed — and everything
else in a React test stack is a choice React does not make for you. This file marks which is which in
every section.

---

## 1. What `act` is, and why `H10` treats it as a precondition

*"When writing UI tests, tasks like rendering, user events, or data fetching can be considered as 'units'
of interaction with a user interface. React provides a helper called `act()` that makes sure all updates
related to these 'units' have been processed and applied to the DOM before you make any assertions."*

That sentence is why `H10` folds `act` into one property rather than listing it as a second rule: an
assertion about the user-visible surface is only true if the surface has been updated. Querying by role
and asserting before React has flushed its work is not a different mistake — it is the same assertion,
made too early.

Three mechanics worth having:

- **It is imported from `react`.** The React 19 migration is explicit and gives the diff:
  *"Import `act` from `react` instead of `react-dom/test-utils`"* — `- import { act } from
  'react-dom/test-utils'` becomes `+ import { act } from 'react'`.
- **Prefer the async form.** *"We recommend using `act` with `await` and an async function. Although the
  sync version works in many cases, it doesn't work in all cases and due to the way React schedules
  updates internally, it's difficult to predict when you can use the sync version. We will deprecate and
  remove the sync version in the future."*
- **It requires an environment flag.** *"Using `act` requires setting `global.IS_REACT_ACT_ENVIRONMENT=true`
  in your test environment. This is to ensure that `act` is only used in the correct environment."* If it
  is unset the error is explicit — *"The current testing environment is not configured to support
  act(…)"*.

In practice most tests never call `act` directly, and react.dev says why: *"In testing frameworks like
React Testing Library, `IS_REACT_ACT_ENVIRONMENT` is already set for you"*, and *"to avoid some of the
boilerplate, you could use a library like React Testing Library, whose helpers are wrapped with `act()`."*
That is the whole of React's endorsement — a named library whose helpers already do the wrapping — and it
is the reason `H10` can name that library as the owner of the query-priority order without this skill
recommending a stack.

## 2. Removed and deprecated, and what replaces each

These are currency facts, and the distinction between *removed* and *deprecated* matters because it
decides how loudly a mistake fails.

| API | Status in React 19 | Replacement |
|---|---|---|
| `react-dom/test-utils` | **Removed** — *"We've moved `act` from `react-dom/test-utils` to the `react` package"*, and *"All other test-utils functions have been removed."* | `act` from `react`; nothing else survives |
| `react-test-renderer` | **Deprecated** — *"In React 19, `react-test-renderer` logs a deprecation warning, and has switched to concurrent rendering."* | A test that renders in the real environment |
| `react-test-renderer/shallow` | **Removed** — the package must be installed directly to keep using it | Prefer not to: *"Shallow rendering depends on React internals and can block you from future upgrades."* |

React's stated reason for deprecating the test renderer is the same argument `H10` makes, in its own
words: *"We are deprecating `react-test-renderer` because it implements its own renderer environment that
doesn't match the environment users use, promotes testing implementation details, and relies on
introspection of React's internals."* A renderer that is not the one users get, asserting on internals, is
the exact failure `H10`'s user-visible-surface property exists to prevent.

**The detectability difference.** A removed import fails on the first run — there is nothing to import.
A deprecated renderer keeps working and logs a warning, so it can survive a whole change unnoticed. That
is why the second row is the one to look for in an existing codebase rather than the first.

## 3. Querying the way a user reaches it

`H10` requires finding elements by role and accessible name, and names Testing Library as the owner of the
priority order rather than as a recommendation of this skill. That library's own framing is the same
property `SKILL.md` Principle 7 states: *"your test should resemble how users interact with your code
(component, page, etc.) as much as possible. With this in mind, we recommend this order of priority"*.

Its top preference, in its own words: *"`getByRole`: This can be used to query every element that is
exposed in the accessibility tree. With the name option you can filter the returned elements by their
accessible name. This should be your top preference for just about everything. There's not much you can't
get with this (if you can't, it's possible your UI is inaccessible)."*

The parenthesis is the part worth carrying: a component that cannot be queried by role and accessible name
is usually telling you about `H9` rather than about the test. A query that reaches for a test id first is
often a markup defect wearing a testing costume.

## 4. The layers, and who decides each

A React test stack has four layers, and React has a position on exactly one of them.

| Layer | What decides it | This skill's position |
|---|---|---|
| **The React API used to flush updates** | React | `act`, from `react` — §1 |
| **The component query layer** | Testing Library owns the priority order `H10` cites | Named as the owner of that fact; the choice of library is not this skill's |
| **The test runner** | The project | *Ecosystem convention* — React publishes no position, and no runner is named here |
| **The end-to-end and visual layers** | The project | *Ecosystem convention* — see below |

**The runner is a genuinely open choice** and this skill names none. That is not an omission: react.dev
has no testing guide to defer to, so a named runner here would be this skill inventing a React-team
position that does not exist.

**End-to-end testing** is likewise the project's choice. Two host-specific facts that are not choices, and
that belong with the host rather than here: a desktop renderer needs an end-to-end tool that can launch
the application rather than a browser page, and its own vendor describes that support as experimental —
[`runtime.md`](runtime.md) §3 owns the host matrix and the packaged-build gate that `SKILL.md` Procedure
P7 requires. **A previously common Electron test framework has been deprecated by its own maintainers and
must not be recommended** — that is a negative recommendation this skill does make, and it is the only one
in this file.

## 5. What to test, and what that means for the gates

`SKILL.md` Procedure P7 runs component tests, then the full suite, then end-to-end where a host boundary
is in play. This file adds only what is React-shaped about choosing what goes in them:

- **A component test proves a behavior a user can reach** — a control operated, a result displayed, a
  failure surfaced. If a test asserts that a hook returned a particular object, it is asserting
  implementation, and `H10`'s exception is narrow: only a unit whose entire contract is a pure computation
  may be tested directly as a function.
- **A test that needs `act` directly is usually reaching past its query layer.** The layers in §4 wrap it;
  reaching for it by hand is a signal to check whether the test is driving React rather than driving the
  interface.
- **The gates assume a test layer exists**, which is why `SKILL.md` Procedure P1 now asks for the test
  renderer and query layer as a recorded contract switch. "None" is a legitimate answer — it makes the gap
  explicit at design time instead of leaving Procedure P7's component-test gate to discover it.

## 6. Sources and evidence classes

Read on 2026-07-26; every quoted sentence located on that date. `SKILL.md`'s References register owns the
rule-level citations.

| Source | What it supports here |
|---|---|
| [`act`](https://react.dev/reference/react/act) | §1 — what `act` guarantees, the async recommendation, the environment flag and its error, and both React Testing Library mentions |
| [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) | §1 the import change with its diff · §2 every row: `react-dom/test-utils` removed, `react-test-renderer` deprecated with React's stated reason, and the shallow renderer removed with its warning |
| [Testing Library — queries](https://testing-library.com/docs/queries/about/) | §3 — the guiding principle behind the priority order and the `getByRole` preference, cited as the owner of the fact `H10` names |

**Evidence boundary, stated once.** react.dev has no testing guide: its Learn section contains no testing
page, and the only first-party material is the `act` reference and the migration notes. So the React-team
positions available to this skill are exactly: `act` and its import, the removals and deprecations in §2,
and the endorsement of a query library as a way to avoid `act` boilerplate. **Everything else in §4 —
runner, end-to-end tool, visual layer — is ecosystem convention**, and this file names no product for any
of them. The one negative recommendation in §4 is sourced to the deprecated framework's own maintainers.

**Deliberately absent.** No runner, no assertion library, no mocking library, no end-to-end tool, and no
version is named. Which product occupies a layer is a question whose answer changes without React
changing.

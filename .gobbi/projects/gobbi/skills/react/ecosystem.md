# React — Ecosystem

**Ownership** — which products occupy each slot the rest of this skill leaves open, and whether each one
is alive. Every other file in this skill states facts that stay true until React changes; this file
states facts that go stale on their own, and it is the only one permitted to name a product or a version.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened to answer one
question — what occupies this slot, and is it maintained — and closed again. P4's other three categories
do not describe it: no artifact set, no per-unit orchestration, not a sub-procedure another consumer
loads. Its separation is also a containment decision: the volatile claims live in one file so that a
stale answer is found and replaced in one place.

**This file states no React rule, and it cannot.** A sentence whose truth can change without React
changing belongs here; a sentence that would still be true after every product below is replaced belongs
to whichever file owns that topic. Nothing here overrides `SKILL.md`.

---

## Read this before using anything below

**Every concrete npm entry was resolved at 2026-07-27T13:14:43Z against the npm registry** —
`registry.npmjs.org`, which is the same source a package manager reads. **Every one of these claims has
a shelf life**, some of them measured in days: several packages below published a new release during the
week this was written.

**How to re-resolve any row.** Query the exact latest version and the time map together:
`npm view <package> version time --json`. Read `version` first, then use that exact value as the key in
`time`; `time[version]` is the selected release's publication timestamp. Record `time.modified`
separately when it matters: it is a package-metadata modification timestamp, and it is not evidence of
when the selected version was published. The registry's JSON at `https://registry.npmjs.org/<package>`
carries the same selectors. This is a thirty-second check, and it is the intended way to use this file:
**treat every row as a starting point to verify, not as a fact to repeat.**

**How the status column is derived**, so the verdict is reproducible rather than an opinion. Measured
from the resolution date against `time[version]` for the exact latest version:

| Status | Rule |
|---|---|
| **active** | published within the last three months |
| **quiet** | last published three to twelve months ago — maintained but not moving, which for a mature library is normal |
| **dormant** | no publish in over a year |

A dormant verdict is a fact about publishing, not a judgment about quality — but for a library in a fast
moving position it is the signal worth acting on.

**Version lines, not exact versions.** Rows give the current major line, because that is what a decision
turns on; the patch moves too fast to be worth writing down. Where an exact number matters it is stated
with its date.

---

## 1. The slots the rest of this skill defers here

Five files leave a product question open and point at this one. Those are this file's obligations; the
rest is depth.

| Deferred from | The open question |
|---|---|
| `SKILL.md` `H8`, and [`rendering.md`](rendering.md) §5–§6 | What provides the compiler and its lint layer |
| `SKILL.md` `H15`, and [`state.md`](state.md) §2 rung 5 | What provides a server cache |
| [`state.md`](state.md) §2 rung 4 | What provides an external client store |
| [`design.md`](design.md) §2 | What packages the compound-component pattern |
| [`testing.md`](testing.md) §4 | What provides the runner, the end-to-end layer, and the visual layer |

## 2. Compiler and lint — the one slot React itself occupies

| Package | Line | Latest-version publish | Status |
|---|---|---|---|
| `babel-plugin-react-compiler` | 1.0 | 2025-10-07 | quiet |
| `eslint-plugin-react-hooks` | 7.x | 2026-04-17 | quiet |

Both are React-team packages, which is why `H8` can name the lint preset without this skill choosing a
vendor. The compiler's selected latest release is **`1.0.0`**, published **2025-10-07**, which is the
same compiler-stable fact `SKILL.md` pins — the registry and the announcement agree. Its separate
`time.modified` is 2026-05-08; that later metadata event does not make the release active.

## 3. Server cache — `H15`'s rung 5

| Package | Line | Latest-version publish | Status |
|---|---|---|---|
| `@tanstack/react-query` | 5.x | 2026-07-21 | active |
| `swr` | 2.x | 2026-06-22 | active |

Both do what `H15` requires of the rung: they own fetching, invalidation, and staleness rather than
leaving the copy to diverge. `H15`'s obligation is satisfied by either, and by neither if the trigger is
missing — a cache library installed and never invalidated is the same defect `state.md` §5 describes.

A framework's own data layer occupies this slot too, on a host that has one; which capabilities are the
framework's rather than React's is the open item in [`server-client.md`](server-client.md) §7.

## 4. Client store — `state.md`'s rung 4

| Package | Line | Latest-version publish | Status |
|---|---|---|---|
| `zustand` | 5.x | 2026-05-28 | active |
| `jotai` | 2.x | 2026-07-14 | active |
| `@reduxjs/toolkit` | 2.x | 2026-05-15 | active |
| `mobx` | 6.x | 2026-06-08 | active |
| `recoil` | **0.7.7** | **2023-03-01** | **dormant** — over three years without a publish |

The last row is the one this table exists for. Recoil still installs, still appears in tutorials, and has
not shipped anything in more than three years. A model trained before 2023 will suggest it as a current
option, which is exactly the staleness this file is here to catch.

Recoil was resolved at `2026-07-27T13:14:43Z`: latest exact version `0.7.7`;
`time["0.7.7"]` `2023-03-01T21:37:53.979Z`; and the separate `time.modified`
`2024-02-12T18:48:39.318Z`. The modified timestamp is not the publication time of `0.7.7` and must not
replace the version-keyed value.

## 5. Compound components and headless primitives — `design.md`'s slot

`design.md` §2 describes the pattern and names nothing. These package it:

| Package | Line | Latest-version publish | Status |
|---|---|---|---|
| `react-aria-components` | 1.x | 2026-06-18 | active |
| `@ariakit/react` | 0.4 | 2026-07-23 | active |
| `@headlessui/react` | 2.x | 2026-04-07 | quiet |

The `@radix-ui/react-*` name is a family, not an npm package, so it has no aggregate version, date, or
status. Resolve the concrete primitive before use. At the resolution time above,
`@radix-ui/react-dialog` and `@radix-ui/react-popover` each resolved to `1.1.23`, published on
2026-07-24, and were active. Those observations describe only those two selected primitives; they do not
claim that every package in the family shares their metadata.

All four product families supply keyboard behavior and focus management that `H9` requires and that a
hand-rolled component usually gets wrong. Adopting one does not discharge `H9`: the markup it produces
is still your output contract, and `REACT-CHECK-17` and `-18` still apply to what ships.

## 6. Testing — `testing.md`'s three open layers

| Slot | Package | Line | Latest-version publish | Status |
|---|---|---|---|---|
| Component queries | `@testing-library/react` | 16.x | 2026-01-19 | quiet |
| Runner | `vitest` | 4.x | 2026-07-06 | active |
| Runner | `jest` | 30.x | 2026-05-09 | active |
| End-to-end | `@playwright/test` | 1.x | 2026-07-24 | active |
| End-to-end | `cypress` | 15.x | 2026-07-21 | active |
| End-to-end | `webdriverio` | 9.x | 2026-07-21 | active |
| Visual | `storybook` | 10.x | 2026-07-27 | active |
| Network mocking | `msw` | 2.x | 2026-07-08 | active |

Two entries that a stale answer gets wrong:

- **`enzyme` — 3.11, last published 2019-12-20, dormant for over six years.** It is still suggested by
  models trained on older material. It has no React 19 adapter and asserts on internals, which is what
  `H10` exists to prevent.
- **`react-test-renderer` — published in lockstep with React (19.2.8, 2026-07-21), active by the
  publication threshold, yet deprecated by the React team.** This is the case where publishing activity
  is a *misleading* signal, and it is why the status rule above is stated as a fact about publishing
  rather than a recommendation: [`testing.md`](testing.md) §2 carries React's own reason for deprecating
  it.

The Electron end-to-end framework that [`testing.md`](testing.md) §4 says must not be recommended is
**Spectron**, and the deprecation is the Electron team's own: *"Beginning in February 2022, Spectron will
be officially deprecated by the Electron team"* (electronjs.org, Spectron Deprecation Notice, read
2026-07-26). Its documented replacements are the end-to-end entries above — of which Playwright describes
its own Electron support as *"experimental support for Electron automation"*, so a desktop end-to-end
suite is built on a surface its vendor labels experimental.

## 7. Styling, and the one incompatibility that is not a preference

| Package | Line | Latest-version publish | Status |
|---|---|---|---|
| `tailwindcss` | 4.x | 2026-07-16 | active |
| `styled-components` | 6.x | 2026-07-18 | active |
| `@vanilla-extract/css` | 1.x | 2026-07-27 | active |
| `@pandacss/dev` | 1.x | 2026-07-22 | active |
| `@stylexjs/stylex` | 0.19 | 2026-06-16 | active |

**The constraint worth knowing before choosing**: a styling library that generates styles at runtime
needs client-side JavaScript, so it cannot run in a Server Component. On a host with an RSC target
(see [`runtime.md`](runtime.md)), a runtime CSS-in-JS library forces the components that use it to be
client components. The zero-runtime libraries in the last three rows extract styles at build time and do
not, which is why that category exists. This is *ecosystem convention* as stated here — the constraint
follows from what a Server Component cannot do, which [`server-client.md`](server-client.md) §7 sources,
but no React-team document prescribes a styling choice.

## 8. Routing, forms, and validation

| Slot | Package | Line | Latest-version publish | Status |
|---|---|---|---|---|
| Routing | `react-router` | **8.x** | 2026-07-22 | active |
| Routing | `@tanstack/react-router` | 1.x | 2026-07-13 | active |
| Forms | `react-hook-form` | 7.x | 2026-07-25 | active |
| Validation | `zod` | 4.x | 2026-05-04 | active |
| Validation | `valibot` | 1.x | 2026-06-28 | active |
| Bridge | `@hookform/resolvers` | 5.x | 2026-07-26 | active |

`react-router`'s major line is bolded because it is a documented instance of this file's whole purpose:
this session's own research recorded it as v7 and it resolved to **8.x** on 2026-07-27. A version written
from memory was wrong within weeks.

On a desktop host, the routing choice is constrained rather than free — [`runtime.md`](runtime.md) §3
owns that constraint, and it is a host fact rather than a library fact.

## 9. Build tooling

| Package | Line | Latest-version publish | Status |
|---|---|---|---|
| `vite` | 8.x | 2026-07-16 | active |
| `webpack` | 5.x | 2026-07-23 | active |
| `electron-vite` | 5.0 | 2025-12-07 | quiet |

Whether a bundler implements RSC is the question that matters for `H17`, and it is answered by the
bundler's own documentation rather than by its release cadence.

## 10. What this file does not claim

- **No recommendation between two active entries.** Where several packages occupy one slot and all are
  active, this file lists them and stops. Choosing is a project decision that depends on constraints this
  skill cannot see.
- **No claim about quality, security, or fitness.** The status column measures publishing, nothing else.
- **No transitive or peer-dependency claims**, and no compatibility matrix against React versions beyond
  what a package's own documentation states.
- **No pins.** Nothing here is a version to write into a manifest; the rest of this skill pins only React
  and the compiler-stable date, and this file does not change that.

## 11. Source and method

**Source:** the npm registry at `https://registry.npmjs.org/<package>`, read at
**2026-07-27T13:14:43Z**. Resolve the current exact release from `dist-tags.latest` or the equivalent
`npm view <package> version`, then select that exact key from the registry's `time` map. Record
`time.modified` separately; do not use it as the release-publication selector.

**Method:** every concrete npm entry in the tables and prose was resolved in one pass at that time; none
was carried forward from earlier notes. The Radix wildcard was excluded from the concrete metric and two
named primitives were resolved separately. This matters because the prior research for this skill
recorded two entries that were already wrong when written — `react-router`'s major line, and Recoil's
status — and re-resolution is what caught both.

**Two non-registry sources**, both read on 2026-07-26: the Electron team's Spectron Deprecation Notice
at `https://www.electronjs.org/blog/spectron-deprecation-notice`, and Playwright's Electron API page at
`https://playwright.dev/docs/api/class-electron`, which is where the experimental label comes from.

**Evidence class:** every version and date above is a registry observation, reproducible by the command
in the header and the ordered `version` then `time[version]` selectors. `time.modified` is a separate
registry observation and never version-publication evidence. Every *grouping* — which package belongs in
which slot — is *ecosystem convention*, and no React-team document assigns any of them. The one exception
is §2, where both packages are published by the React team and `H8` already names the lint preset.

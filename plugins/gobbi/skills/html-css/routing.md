# HTML/CSS Routing Contract

## Contents

- [Purpose](#purpose)
- [Exact Child Triggers](#exact-child-triggers)
- [Claim Boundaries](#claim-boundaries)
- [Route Cases](#route-cases)
- [Invalid Routing](#invalid-routing)

## Purpose

This document is routing evidence for the policy-free [`html-css`](SKILL.md) root. It records which child owns
each claim, which children compose, and where the family hands work to another owner. It defines no HTML or CSS policy.

Load every matching child. A supported HTML/CSS task must select at least one child, but no child loads for
every task. One material claim has one [semantic owner](vocabulary.md#semantic-owner); several independent
claims may have several owners.

## Exact Child Triggers

The rows use stable direct-child name order. Each trigger is byte-for-byte equal to the corresponding child
frontmatter description and the root routing row.

| Child | Type | Exact trigger |
|---|---|---|
| `html-css-conventions` | preference | MUST load when choosing or reviewing binding presentation rules or overridable defaults for HTML/CSS source organization, cascade, selectors, public hooks, tokens, responsive adaptation, compatibility, or maintainability. |
| `html-css-design` | preference | MUST load when choosing or reviewing an HTML/CSS system's structural regions and relationships, layout architecture, responsive or adaptive strategy, state-to-presentation mapping, material variants, or public markup and styling interface shape. |
| `html-css-development` | operation | MUST load when creating, changing, repairing, maintaining, migrating, or performing a protected read-only review of HTML, CSS, generated markup or styling output, or their public interfaces and consumers. |
| `html-css-motion` | preference | MUST load when choosing or reviewing declarative CSS motion mechanics or motion-system defaults for transitions, animations, timing, interruption, cancellation, reduced motion, or performance-sensitive motion choices. |
| `html-css-platform` | tool | MUST load when interpreting or verifying HTML/CSS conformance, parsing, parser-produced DOM, native HTML behavior, CSSOM, matching, cascade, computed values, layout, overflow, paint, compositing, rendering, direct target support, or browser and Electron-renderer diagnosis. |
| `html-css-semantics` | preference | MUST load when choosing or reviewing HTML elements, relationships, names, roles, states, language, direction, or accessibility meaning. |
| `html-css-testing` | operation | MUST load when designing, writing, running, diagnosing, or reviewing focused tests for an HTML/CSS contract, generated or conditional output, or direct browser or Electron-renderer behavior claimed by that contract. |

## Claim Boundaries

| Child | Owns | Does not own |
|---|---|---|
| `html-css-conventions` | Binding presentation rules and overridable defaults for source, cascade, selectors, hooks, tokens, adaptation, compatibility, and maintenance | Product aesthetics, standards facts, ordered mutation, testing mechanics, or motion policy |
| `html-css-design` | Coordinated structural, layout, adaptation, state-presentation, variant, and interface-shape alternatives | Product direction, exact specialist choices, mutation, testing, or platform facts |
| `html-css-development` | Authorized change and maintenance, protected review, generated projection work, and public-interface migration | Standards meaning, application-suite ownership, deployment, publication, or release |
| `html-css-motion` | Declarative transition and animation mechanics after product or interaction approval, including reduction, interruption, cancellation, and performance-sensitive defaults | Whether motion is warranted, JavaScript interaction behavior, source mutation, target facts, or compositor guarantees |
| `html-css-platform` | HTML/CSS standards meaning and direct browser or Electron-renderer realization and diagnosis | Browser lifecycle, navigation, scheduling, network, storage, origin, permission, security state, or product acceptance |
| `html-css-semantics` | Authored elements, relationships, names, roles, states, language, direction, and accessibility meaning | System architecture, style defaults, mutation, test mechanics, keyboard behavior, or observed target output |
| `html-css-testing` | Focused assertions about HTML/CSS contracts, variants, direct target behavior, and authored semantic or accessibility output | Application-suite risk, cross-layer end-to-end workflows, keyboard-model choice, behavior implementation, product acceptance, or release reconciliation |

For performance-sensitive work, `html-css-motion` and `html-css-conventions` own source choices and defaults.
`html-css-platform` owns direct target observations and diagnosis. `html-css-testing` owns focused comparison
design, assertions, and result claims. Web or desktop application owners retain application-level performance
acceptance.

## Route Cases

| Case | Request | Expected children | Adjacent owners | Claim ownership and prohibited match | Expected result |
|---|---|---|---|---|---|
| Single | Compare grid and flex layout architectures for approved content. | `html-css-design` | None | Design owns system alternatives; Platform does not own the choice. | One match: Design. |
| Single | Apply an already approved selector repair in canonical source. | `html-css-development` | None | Development owns the change; Conventions loads only if a default must be chosen. | One match: Development. |
| Single | Assert that a public class remains in emitted CSS. | `html-css-testing` | None | Testing owns the focused contract assertion; Development does not own test evidence. | One match: Testing. |
| Single | Explain why a declared property loses in the cascade on a pinned browser. | `html-css-platform` | None | Platform owns cascade realization; Conventions does not invent a target fact. | One match: Platform. |
| Single | Choose the element, accessible name, and authored state for a form control. | `html-css-semantics` | None | Semantics owns authored meaning; Testing owns only observed evidence. | One match: Semantics. |
| Single | Choose a specificity and token default. | `html-css-conventions` | None | Conventions owns overridable source defaults; Design does not choose exact mechanics. | One match: Conventions. |
| Single | Choose reduced, interrupted, and cancelled transition mechanics after motion is approved. | `html-css-motion` | None | Motion owns declarative mechanics; `web-design` or `desktop-interface` decides whether motion is warranted. | One match: Motion. |
| Multi | Design a responsive form system. | `html-css-design`, `html-css-semantics`, `html-css-conventions` | `web-design` or `desktop-interface` supplies approved intent. | Design coordinates; Semantics chooses meaning; Conventions chooses binding presentation defaults. | Load all three with one owner per claim. |
| Multi | Migrate a public class and custom property, then add focused evidence. | `html-css-development`, `html-css-testing`, `html-css-conventions` | Release owner if publication is requested. | Development migrates; Testing proves the contract; Conventions owns the names/defaults. | Load all applicable children and hand publication to the release owner. |
| Multi | Verify parser-produced DOM and computed style in a pinned target. | `html-css-testing`, `html-css-platform` | None | Testing owns assertions and results; Platform owns what parser DOM and computed style mean. | Two matches with labeled claims. |
| Adjacent | Verify an HTML/CSS contract inside an application end-to-end workflow. | `html-css-testing` | `web-testing` | Family Testing owns the focused contract; Web Testing owns suite risk and the workflow. | Load both owners and keep conclusions separate. |
| Adjacent | Diagnose CSS resource selection plus network and cache behavior. | `html-css-platform` | `web-platform` | Family Platform owns CSS selection semantics; Web Platform owns network and cache facts. | Load both owners and label each fact. |
| Adjacent | Choose a custom widget role and its keyboard behavior. | `html-css-semantics` | `web-interaction` | Semantics owns authored role/name/state; Web Interaction chooses the promised behavior model. | Load both; do not give either the other's claim. |
| Non-match | Choose the product visual identity or decide whether motion is warranted. | None | `web-design` or `desktop-interface` | HTML/CSS children do not own product direction. | Route to the named design or interface owner only. |
| Non-match | Set security policy, deploy, package, or release an application. | None | Applicable security, deployment, desktop, Electron, or release owner | The family preserves handoff boundaries only. | Route to the named owner only. |

## Invalid Routing

Fail closed when a direct child has no root row, a row has no direct child, trigger bytes differ, a supported
root request selects no child, or two children claim the same material fact or decision. Repair the earliest
incorrect path, trigger, or owner boundary; never add a default child or an executable old-family alias.

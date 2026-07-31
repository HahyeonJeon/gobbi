# Web Topology Evaluation Checklist

This reusable unchecked source evaluates one web project's directory topology against the decision-order,
named-root, reserved-path, visible-boundary, path-class, and bounded-claim obligations this skill owns. It is
governed by the [`web`](../SKILL.md) domain and [`web-topology`](SKILL.md) preferences, with
[`web-architecture`](../web-architecture/SKILL.md) owning structural strategy,
[`web-configuration`](../web-configuration/SKILL.md) owning configuration content,
[`web-deployment`](../web-deployment/SKILL.md) owning what is published and deployed, and the language,
framework, and convention owners holding naming, imports, formatting, and internal idioms. The source commit
that contains this file identifies the checklist version. Its stable owner prefix is `WEBTOPO`.

This source evaluates where material lives and who owns it. No row below judges a written form: a name, an
import, a format, or an idiom belongs to its own owner.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBTOPO-SC-PROJECT-01 — Normal case: every root and every owner is named

A tree holds a workspace, applications, packages, configuration, generated content, caches, builds, and
deployables, and each of them belongs to someone. The expected outcome names the roots and the owners; a tree
whose material has no stated owner is the failure.

#### Checklist

- [ ] WEBTOPO-CK-PROJECT-01-01 — The project or workspace root and every application or package root are named.
- [ ] WEBTOPO-CK-PROJECT-01-02 — The owner of each application, package, configuration class, generated output, cache, build output, and deployable output is named.

### WEBTOPO-SC-PROJECT-02 — Rule violation: the work decides something outside topology

A placement decision brushes against a file name, an import path, or a formatting habit, and the work settles
those too. The expected outcome keeps the claim on structure, roots, and placement; a topology decision that
also sets a written form is the failure.

#### Checklist

- [ ] WEBTOPO-CK-PROJECT-02-01 — No naming, import, formatting, or internal-idiom decision is made by this work.
- [ ] WEBTOPO-CK-PROJECT-02-02 — No claim this work makes reaches outside repository structure, roots, and placement.

## Structure

### WEBTOPO-SC-STRUCTURE-01 — Normal case: the decision order is followed

A material placement choice is open and several sources could settle it. The expected outcome works the order
through required structure, the existing tree, and the smallest ownership-based structure before reaching
outward; an exemplar consulted first is the failure.

#### Checklist

- [ ] WEBTOPO-CK-STRUCTURE-01-01 — The choice is settled in order: required framework and tool structure, then sound existing topology, then the smallest ownership-based project structure.
- [ ] WEBTOPO-CK-STRUCTURE-01-02 — An external exemplar is used only where the first three sources do not settle a material choice.
- [ ] WEBTOPO-CK-STRUCTURE-01-03 — The established tree is preserved where ownership, runtime boundaries, discovery, compatibility, and operations remain clear.

### WEBTOPO-SC-STRUCTURE-02 — Rule violation: a reserved path is repurposed

A directory the framework, runtime, workspace, build, or deployment owns is moved, renamed, or filled with
something else. The expected outcome preserves those paths and verifies them against the selected stack's own
guidance; a reserved path assumed rather than checked is the failure.

#### Checklist

- [ ] WEBTOPO-CK-STRUCTURE-02-01 — Framework-, runtime-, workspace-, build-, and deployment-reserved paths are preserved.
- [ ] WEBTOPO-CK-STRUCTURE-02-02 — The required paths and configurable roots of the selected stack are verified against its official guidance rather than assumed.

### WEBTOPO-SC-STRUCTURE-03 — Normal case: material is grouped by ownership and reason to change

Code, assets, and tests for one feature can sit together or be split across type-based directories. The
expected outcome colocates what changes together and centralizes only what has earned it; material moved to a
shared location because it might be reused is the failure.

#### Checklist

- [ ] WEBTOPO-CK-STRUCTURE-03-01 — Feature-specific code, assets, and tests are colocated where required paths permit it.
- [ ] WEBTOPO-CK-STRUCTURE-03-02 — Material is centralized only where it has multiple real consumers, one owner, an explicit public surface, and compatible runtime authority.

## Performance

### WEBTOPO-SC-PERFORMANCE-01 — Normal case: each maintained path class states the process behind it

Generated content, caches, builds, and deployable outputs are produced and discarded by processes, and a path
whose maintaining process is unstated is never invalidated or cleaned. The expected outcome states that
process per class; a cache or build output nobody cleans is the failure.

#### Checklist

- [ ] WEBTOPO-CK-PERFORMANCE-01-01 — Which process creates, consumes, invalidates, cleans, publishes, or deploys each path class is stated.
- [ ] WEBTOPO-CK-PERFORMANCE-01-02 — Generated content, caches, build outputs, and deployable outputs are placed where the process that maintains them can invalidate and clean them.

## Aesthetics

### WEBTOPO-SC-AESTHETICS-01 — Poor quality: the tree is valid but nobody can navigate it

Every required path is respected and every root is named, yet a newcomer cannot find the application entry,
the route owner, or where migrations live. The expected outcome keeps entries and authority discoverable under
one strategy; a correct tree that has to be explained is the failure.

#### Checklist

- [ ] WEBTOPO-CK-AESTHETICS-01-01 — Application entries, route owners, configuration inheritance, tests, migrations, generated outputs, and deployable artifacts are easy to find.
- [ ] WEBTOPO-CK-AESTHETICS-01-02 — Every departure from a discoverable placement names the required tool path or measured project need behind it.
- [ ] WEBTOPO-CK-AESTHETICS-01-03 — One consistent placement strategy is used where the selected framework permits alternatives.

## Usage

### WEBTOPO-SC-USAGE-01 — Normal case: runtime and authority boundaries are visible in the tree

Someone reading a path has to be able to tell whether the code runs in the browser, on the server, or with
privilege. The expected outcome keeps those boundaries visible in the structure itself; a shared directory
that quietly holds server-only or privileged material is the failure.

#### Checklist

- [ ] WEBTOPO-CK-USAGE-01-01 — Browser, server, shared, data or migration, test, and operational boundaries are visible where applicable.
- [ ] WEBTOPO-CK-USAGE-01-02 — No shared directory hides browser-only, server-only, secret, or privileged authority.

### WEBTOPO-SC-USAGE-02 — Edge case: a documented exception departs from the one project strategy

One area of the tree needs a different placement than the rest because its ownership, compatibility, or
lifecycle genuinely differs. The expected outcome documents the exception with the evidence that earns it and
leaves the rest on one strategy; an undocumented second strategy is the failure.

#### Checklist

- [ ] WEBTOPO-CK-USAGE-02-01 — The exception is documented and names the ownership, compatibility, or lifecycle evidence that earns the difference.
- [ ] WEBTOPO-CK-USAGE-02-02 — The rest of the project keeps the single placement strategy.

## Consistency

### WEBTOPO-SC-CONSISTENCY-01 — Normal case: path classes stay distinguished

Source, generated content, caches, secrets, published assets, and deployable outputs share one tree but have
nothing else in common. The expected outcome keeps each class distinguishable; generated or secret material
carried as though it were source is the failure.

#### Checklist

- [ ] WEBTOPO-CK-CONSISTENCY-01-01 — Source-controlled, generated, cached, secret, published, and deployable content are distinguished from one another.
- [ ] WEBTOPO-CK-CONSISTENCY-01-02 — No generated, cached, or secret content is treated as source-controlled content.

### WEBTOPO-SC-CONSISTENCY-02 — Expected failure: a required structure conflicts with a project preference

The preferred placement and the stack's required structure cannot both hold. The expected outcome lets the
required structure win and records which preference yielded; a preference applied over a required path is the
failure.

#### Checklist

- [ ] WEBTOPO-CK-CONSISTENCY-02-01 — Required framework and tool structure takes precedence over the project preference it conflicts with.
- Also applies: WEBTOPO-CK-STRUCTURE-02-01 (reserved paths preserved).

## Risk

### WEBTOPO-SC-RISK-01 — Rule violation: a departure ships without its blast radius

A directory move, a root change, or a new placement strategy is adopted and the diff is the only record. The
expected outcome records what the departure costs and how it is undone, and changes the smallest affected
boundary; a structural change with no migration or rollback story is the failure.

#### Checklist

- [ ] WEBTOPO-CK-RISK-01-01 — Every topology departure records its evidence, blast radius, migration, compatibility, rollback, and reopen condition.
- [ ] WEBTOPO-CK-RISK-01-02 — The departure changes the smallest affected boundary.
- [ ] WEBTOPO-CK-RISK-01-03 — Every departure from sound existing topology names the concrete contrary evidence behind it.

### WEBTOPO-SC-RISK-02 — Adversarial: a reorganization is justified by an exemplar

A well-known repository layout is cited to move a working tree that nobody had a problem with. The expected
outcome refuses the exemplar where the earlier sources already settle the choice and requires a named problem
before reorganizing; novelty dressed as a standard is the failure.

#### Checklist

- [ ] WEBTOPO-CK-RISK-02-01 — No external exemplar is used where required structure, sound existing topology, or the smallest ownership-based structure already settles the choice.
- [ ] WEBTOPO-CK-RISK-02-02 — No sound existing tree is reorganized for novelty.
- [ ] WEBTOPO-CK-RISK-02-03 — Every claim that the existing tree is unclear names the ownership, runtime-boundary, discovery, compatibility, or operations problem it causes.

## Overall

### WEBTOPO-SC-OVERALL-01 — Normal case: the topology holds together as one tree

A complete topology answers where the roots are, who owns each class of material, which paths are reserved,
which boundaries stay visible, and where each lifecycle class lives. The scenario fails when those answers
disagree with one another, or when a raised choice is left neither settled nor recorded.

#### Checklist

- [ ] WEBTOPO-CK-OVERALL-01-01 — The named roots, ownership grouping, reserved paths, visible runtime boundaries, distinguished path classes, and discoverable entry points agree as one tree.
- [ ] WEBTOPO-CK-OVERALL-01-02 — Every material topology choice the work raised is settled, deferred with an owner, or recorded as an exception.
- Also applies: WEBTOPO-CK-PROJECT-02-01 (no naming, import, formatting, or idiom decision made here).

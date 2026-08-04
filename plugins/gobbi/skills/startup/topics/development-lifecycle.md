# Development Lifecycle Topics

Development Lifecycle owns the complete-stack mechanisms and evidence that realize accepted Product promises.
Tools, frameworks, languages, desktop mechanisms, and network mechanisms remain participating entries or
platform concerns inside one Implementation.

## Overlay Banks

| Bank | Select when accepted evidence shows |
|---|---|
| [Tool](development-lifecycle/tool.md) | Accepted evidence identifies a material tool or toolchain entry used to check, transform, generate, build, package, analyze, or run artifacts. |
| [Framework](development-lifecycle/framework.md) | Accepted evidence identifies a material framework entry that constrains source shape, initialization, runtime, host, build, or transition behavior. |
| [Language](development-lifecycle/language.md) | Accepted evidence identifies a material language entry with a compiler, interpreter, runtime, type-check, or module-loader contract. |
| [Desktop](development-lifecycle/desktop.md) | Accepted evidence identifies packaging, signing, trust, updating, or installed-artifact mechanisms. |
| [Network](development-lifecycle/network.md) | Accepted evidence identifies protocol, peer, or network runtime mechanisms that require interoperation or live diagnostics. |

Every applicable bank composes with the common complete-stack questions. No bank creates a technology subject,
route row, acceptance state, or independent Implementation.

## Project

- [development-repository-topology] Which repositories and long-lived branches are authoritative for each Product, Implementation, release line, and generated source?

- [development-change-governance] Which change classes require which owner, review, checks, merge rule, and time-bounded emergency exception?

- [security-response-governance] Where are vulnerabilities reported privately, who triages, remediates, and discloses them, and what response targets apply?

- [release-governance] Who may create, sign, promote, withdraw, or revoke a release, and what separation of authority is required?

- [development-maintenance-continuity] Which interval or event reviews dependencies, toolchains, supported environments, access, documentation, and successor readiness?

## Product

- [release-line-policy] Which release lines and channels are supported, what receives fixes or backports, and what evidence ends support?

- [change-compatibility-classification] Which Product contract decides whether a change is compatible, conditionally compatible, or breaking, and what version or migration obligation follows?

## Implementation

- [development-change-inception] What event or evidence starts this Development change, and what current behavior establishes its baseline?

- [development-ready-gate] What evidence makes this Development change ready to enter implementation?

- [development-bootstrap] From a clean supported environment, what must exist before the first trusted check passes?

- [development-environment-variance] Which local, test, build, CI, release, or target differences can change the Development result?

- [development-increment] Which smallest observable Development slice must pass before dependent work continues?

- [build-generation-path] Which canonical inputs, pinned entries, and command produce each built or generated artifact?

- [generated-state-oracle] What detects stale, missing, unexpected, or hand-edited generated output?

- [scenario-development-guidance] Which implementation-neutral mechanism or obligation must this Development scenario preserve?
  - **Example:** For example, preserve safe rollback while changing a dependency.

- [development-evidence-ladder] Which test, build, review, observation, or rehearsal can disprove each material claim, what result separates pass from fail, and what record proves it?

- [development-integration] What must remain true when callers, dependents, generated state, configuration, schema, and supported environments are combined?

- [release-candidate] Which exact artifact, version, compatibility class, provenance, and approval make this release candidate acceptable?

- [deployment-method] How is the exact released Implementation installed or deployed into its target environment?

- [rollout-gate] Which observed results permit rollout to advance, and which require it to stop?

- [development-observation] Which post-release signal requires correction, reversal, investigation, or new Development work?

- [maintenance-lifecycle-scenario] Which realistic future Development change must an unfamiliar maintainer complete to prove the stack remains understandable and safe to modify?

- [dependency-incompatibility-response] When a critical dependency changes incompatibly without plan, how must the Implementation respond?

- [dependency-exit] How can the Implementation continue after permanent loss of a critical dependency?

- [dependency-security-response] When an entry is vulnerable, compromised, abandoned, or provenance-invalid, what response and residual risk are accepted?

- [upgrade-lifecycle-scenario] When the complete stack or a material entry changes version, which Product contracts, consumer, build, test, package, runtime, and recovery paths remain valid?

- [state-migration] How do affected code, configuration, data, generated, consumer, and runtime states migrate while preserving compatibility, lineage, coexistence, and recovery?

- [development-rollback] Which failure activates reversal, what exact prior artifact and compatible state return, and what evidence proves restoration?

- [entry-replacement-path] Which alternative or replacement assumes this material entry’s responsibilities, how may old and new coexist or migrate, and what evidence permits exit?

- [deprecation-lifecycle-scenario] Before a stack entry or supported version is removed, how are transition duties, consumers, support, and replacement paths handled?

- [entry-retirement] What proves that a stack entry, supported version, or obsolete build path may be removed?

- [development-handoff] What identity, decisions, evidence, limits, recovery, and authority must a recipient receive at Development handoff?

- [convention-enforcement] Which automated checks or reviews prove each accepted repository, code, contract, test, artifact, environment, and observability convention is followed?

- [dependency-policy] Which sources, identities, version constraints or locks, integrity or provenance checks, update cadence, and exception path govern direct and transitive dependencies?

- [build-reproducibility] Which artifacts must be independently reproducible, under which controlled variations, and what comparison establishes equivalence?

- [build-trust-boundary] Which people, services, secrets, network inputs, caches, and persistent state may influence a build, and how is that influence constrained and recorded?

- [verification-topology] Which checks run locally, on each change, after integration, on a schedule, and before release, and which results block progression?

- [mixed-stack-compatibility-matrix] Which combined language, framework, tool, runtime, operating-system or architecture, protocol, and data-format combinations must be verified together?
  - **Example:** A desktop network client may need its framework, runtime, signer, installer, protocol peer, and upgrade path verified as one supported combination.

- [release-artifact-identity] Which immutable release identity must appear consistently across source revision, version, built artifacts, inventory, provenance, signatures, checksums, and distribution records?

- [incident-change-path] During an operational or security incident, what preserves diagnostics, constrains emergency changes, proves recovery, and triggers follow-up prevention?

- [contributor-readiness] From a least-privilege clean account and supported environment, what setup, documentation, check, small change, review, and escalation prove a contributor can work safely?

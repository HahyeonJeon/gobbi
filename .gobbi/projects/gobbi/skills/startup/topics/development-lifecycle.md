# Development Lifecycle Topics

Development Lifecycle owns the complete-stack mechanisms and evidence that realize accepted Product promises.
Tools, frameworks, languages, desktop mechanisms, and network mechanisms remain participating entries or
platform concerns inside one Implementation.

## Scenario Model

Record the Development dimension, linked Product scenarios and decisions, applicable Project policy,
implementation-neutral mechanism or obligation, participating entries, claim-specific evidence, observable
Development oracle, rollback and recovery, selected overlay banks, and coverage status.

## Overlay Banks

| Bank | Activation evidence |
|---|---|
| [Tool](development-lifecycle/tool.md) | Accepted evidence identifies a material tool or toolchain entry used to check, transform, generate, build, package, analyze, or run artifacts. |
| [Framework](development-lifecycle/framework.md) | Accepted evidence identifies a material framework entry that constrains source shape, initialization, runtime, host, build, or transition behavior. |
| [Language](development-lifecycle/language.md) | Accepted evidence identifies a material language entry with a compiler, interpreter, runtime, type-check, or module-loader contract. |
| [Desktop](development-lifecycle/desktop.md) | Accepted evidence identifies packaging, signing, trust, updating, or installed-artifact mechanisms. |
| [Network](development-lifecycle/network.md) | Accepted evidence identifies protocol, peer, or network runtime mechanisms that require interoperation or live diagnostics. |

Every applicable bank composes with the common complete-stack questions. No bank creates a technology subject,
route row, acceptance state, or independent Implementation.

## Project

## Product

## Implementation

- [development-change-inception] What event or evidence starts this Development change, and what current behavior establishes its baseline?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Bind a Development change to its trigger and current baseline
  - **Oracle:** Accepted evidence names the trigger and reproduces or characterizes the current baseline
  - **Activation evidence:** Every new Development scenario; derive from accepted evidence first
  - **Source aliases:** stack-change-evidence,NEW

- [development-ready-gate] What evidence makes this Development change ready to enter implementation?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define the readiness transition without creating a task plan
  - **Oracle:** Outcome, scope, affected set, risks, compatibility, and evidence are accepted
  - **Activation evidence:** A material change whose readiness is not already proved
  - **Source aliases:** NEW

- [development-bootstrap] From a clean supported environment, what must exist before the first trusted check passes?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define clean bootstrap to first trusted check
  - **Oracle:** A pinned supported environment passes without hidden state
  - **Activation evidence:** Every scenario is coverage-recorded; ask only when bootstrap evidence is absent
  - **Source aliases:** NEW

- [development-environment-variance] Which local, test, build, CI, release, or target differences can change the Development result?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Identify material environment variance
  - **Oracle:** Each material environment exercises the applicable claim
  - **Activation evidence:** Accepted evidence establishes multiple configurations, hosts, or targets
  - **Source aliases:** NEW

- [development-increment] Which smallest observable Development slice must pass before dependent work continues?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Preserve bottom-up verified construction
  - **Oracle:** The smallest observable slice passes before dependent work proceeds
  - **Activation evidence:** Accepted evidence establishes dependent layers or construction stages
  - **Source aliases:** NEW

- [build-generation-path] Which canonical inputs, pinned entries, and command produce each built or generated artifact?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define build and generation provenance
  - **Oracle:** Clean output traces to owner, input, command, and version, and consumers pass
  - **Activation evidence:** Accepted evidence establishes build, transform, emit, bundle, generation, or mirror behavior
  - **Source aliases:** NEW

- [generated-state-oracle] What detects stale, missing, unexpected, or hand-edited generated output?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define generated-state drift detection
  - **Oracle:** The drift check fails on stale or changed generated output, then consumers recheck after regeneration
  - **Activation evidence:** Accepted evidence establishes generated state
  - **Source aliases:** NEW

- [scenario-development-guidance] Which implementation-neutral mechanism or obligation must this Development scenario preserve?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Record proactive implementation-neutral guidance
  - **Oracle:** The record states a specific constraint without task, algorithm, or signature
  - **Activation evidence:** Only when derive-first evidence leaves a guidance blocker
  - **Source aliases:** scenario-development-guidance
  - **Example:** For example, preserve safe rollback while changing a dependency.

- [development-evidence-ladder] Which test, build, review, observation, or rehearsal can disprove each material claim, what result separates pass from fail, and what record proves it?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Bind Development claims to disproof evidence
  - **Oracle:** Evaluation method, pass/fail result, retained proof, and limits are explicit
  - **Activation evidence:** Every Development scenario; ask only when evidence cannot be derived
  - **Source aliases:** scenario-evaluation-method,scenario-pass-fail-oracle,scenario-required-evidence,NEW

- [development-integration] What must remain true when callers, dependents, generated state, configuration, schema, and supported environments are combined?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Prove combined Development integration
  - **Oracle:** Consumer and downstream gates pass across every affected surface
  - **Activation evidence:** Accepted evidence establishes multiple affected surfaces
  - **Source aliases:** NEW

- [release-candidate] Which exact artifact, version, compatibility class, provenance, and approval make this release candidate acceptable?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Identify the exact releasable candidate
  - **Oracle:** The identified digest passes clean build or pack, inventory, consumer, license, provenance, security, and authority checks
  - **Activation evidence:** Accepted evidence establishes a releasable artifact
  - **Source aliases:** NEW

- [deployment-method] How is the exact released Implementation installed or deployed into its target environment?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define the deployment mechanism and order
  - **Oracle:** The target runs or serves the exact candidate and target checks pass
  - **Activation evidence:** Accepted evidence establishes a deployable or installable target
  - **Source aliases:** deployment-method

- [rollout-gate] Which observed results permit rollout to advance, and which require it to stop?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define staged advance, hold, and stop decisions
  - **Oracle:** Accepted thresholds decide each rollout stage
  - **Activation evidence:** Accepted evidence establishes staged rollout
  - **Source aliases:** rollout-signal,rollback-trigger,NEW

- [development-observation] Which post-release signal requires correction, reversal, investigation, or new Development work?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Convert post-release evidence into an owned Development decision
  - **Oracle:** Each signal has threshold, consumer, owner, and action
  - **Activation evidence:** Accepted evidence establishes released, running, support, or incident observation
  - **Source aliases:** NEW

- [maintenance-lifecycle-scenario] Which realistic future Development change must an unfamiliar maintainer complete to prove the stack remains understandable and safe to modify?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Prove future maintenance by an unfamiliar maintainer
  - **Oracle:** The maintainer locates owner and contract, completes the change, runs checks, and explains it without hidden context
  - **Activation evidence:** Every scenario is coverage-recorded
  - **Source aliases:** maintenance-scenario,maintenance-lifecycle-scenario

- [dependency-incompatibility-response] When a critical dependency changes incompatibly without plan, how must the Implementation respond?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define response to unplanned dependency incompatibility
  - **Oracle:** An accepted adapter, coordinated change, pin, or degradation preserves the Product promise
  - **Activation evidence:** Accepted evidence establishes an unplanned incompatible dependency change
  - **Source aliases:** dependency-change

- [dependency-exit] How can the Implementation continue after permanent loss of a critical dependency?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Preserve continuity after permanent dependency loss
  - **Oracle:** An alternative, replacement, or reduced mode realizes required duties and its exit is tested
  - **Activation evidence:** Accepted evidence establishes permanent dependency unavailability
  - **Source aliases:** dependency-exit

- [dependency-security-response] When an entry is vulnerable, compromised, abandoned, or provenance-invalid, what response and residual risk are accepted?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define dependency security exposure, containment, remediation, and residual risk
  - **Oracle:** Reachability is established, response passes proportionate evidence, and residual risk, owner, and reopen condition are recorded
  - **Activation evidence:** Accepted evidence establishes an advisory, compromise, abandonment, or provenance failure
  - **Source aliases:** NEW

- [upgrade-lifecycle-scenario] When the complete stack or a material entry changes version, which Product contracts, consumer, build, test, package, runtime, and recovery paths remain valid?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define planned complete-stack or entry version transition
  - **Oracle:** The supported matrix passes and a reverse or recovery path exists
  - **Activation evidence:** Accepted evidence establishes planned upgrade, downgrade, or support-floor change
  - **Source aliases:** upgrade-lifecycle-scenario

- [state-migration] How do affected code, configuration, data, generated, consumer, and runtime states migrate while preserving compatibility, lineage, coexistence, and recovery?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define technical state migration and cutover
  - **Oracle:** Migration invariants, cutover, post-migration proof, and recovery pass
  - **Activation evidence:** Accepted evidence establishes representation, owner, format, or entry transition
  - **Source aliases:** migration-lifecycle-scenario

- [development-rollback] Which failure activates reversal, what exact prior artifact and compatible state return, and what evidence proves restoration?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define actual technical reversal
  - **Oracle:** Prior identity and compatible state are restored and the real target is reverified
  - **Activation evidence:** Accepted evidence establishes a reversible change with failure or stop conditions
  - **Source aliases:** rollback-state,rollback-lifecycle-scenario

- [entry-replacement-path] Which alternative or replacement assumes this material entry’s responsibilities, how may old and new coexist or migrate, and what evidence permits exit?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Preserve alternative, replacement, coexistence, migration, and exit dimensions
  - **Oracle:** The replacement realizes duties, coexistence or migration passes, and the old entry is safely unselected
  - **Activation evidence:** Accepted evidence establishes fit failure, abandonment, replacement, dependency exit, or support end
  - **Source aliases:** technology-exit-trigger,NEW

- [deprecation-lifecycle-scenario] Before a stack entry or supported version is removed, how are transition duties, consumers, support, and replacement paths handled?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define Development deprecation transition
  - **Oracle:** Window, replacement, migration duties, and owners are explicit and exercised
  - **Activation evidence:** Accepted evidence establishes deprecation
  - **Source aliases:** deprecation-lifecycle-scenario

- [entry-retirement] What proves that a stack entry, supported version, or obsolete build path may be removed?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define final entry removal and support gate
  - **Oracle:** No required duty remains, the obsolete path is unselected, and removal, consumer, build, and security checks pass
  - **Activation evidence:** Accepted evidence establishes completed deprecation or exit, or a retirement deadline
  - **Source aliases:** NEW

- [development-handoff] What identity, decisions, evidence, limits, recovery, and authority must a recipient receive at Development handoff?
  - **Owner:** Complete-stack Implementation Development Lifecycle owner
  - **Purpose:** Define independently usable Development handoff
  - **Oracle:** The recipient completes the first required action without hidden context
  - **Activation evidence:** Accepted evidence establishes completion or authority boundary
  - **Source aliases:** NEW

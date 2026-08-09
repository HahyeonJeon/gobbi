# CLI Release Checklist

This reusable unchecked source evaluates one CLI Release preference subject governed by
[`cli-release`](SKILL.md), frozen for this source at SHA-256
`90524a9a253b9355cd2e2ad1d8d56e8e39325209a1198911d08df571fc4136f9`. The subject has two distinct results:
an early `Release policy accepted` record and a later `Release readiness judgment recorded` entry for each
exact runtime, target, delivery identity, and consumer entry. Its stable owner prefix is `CLIRLSE`.

The source covers promised tuples, delivery identities, required evidence, runtime, artifact, installation,
persisted-data and update compatibility, recovery, rollout constraints, support windows, residual-risk
criteria, readiness, deprecation, and retirement. Command semantics remain with CLI Architecture; current
facts with CLI Platform; assurance with CLI Security; coordination with CLI Development; and mechanisms and
consumer proof with the applicable TypeScript owners.

Building, testing, packing, signing, publishing, installing, promotion, rollout execution, rollback
execution, forward-fix execution, credential use, registry or target mutation, and external action remain
outside this source. Every condition is unchecked, atomic, independently answerable, and free of observation,
answer, score, remediation, or evaluation verdict.

## Lifecycle Categories

### Design lifecycle

- **Promise framing:** turn current user and automation needs into the narrowest runtime, target, delivery,
  consumer, support-window, and compatibility promise.
- **Policy identity:** bind the early policy to exact product contracts, tuples, delivery forms, required
  evidence, recovery, rollout constraints, residual-risk criteria, and authority owners.
- **Delivery separation:** model package-backed, standalone, and optional direct entries as separate artifact,
  consumer, update, and recovery identities, including hybrid products.
- **Compatibility and recovery:** define runtime, artifact, installation, data, configuration, update,
  rollback, forward-fix, withdrawal, and cessation boundaries before readiness work begins.
- **Owner boundary:** keep release judgment separate from facts, assurance, mechanisms, evidence execution,
  coordination, external authority, and action.

### Development lifecycle

- **Policy handoff:** supply one current accepted policy to each implementation, fact, assurance, artifact,
  evidence, and coordination owner.
- **Evidence reconciliation:** bind returned facts and evidence to the exact policy, tuple, artifact or
  revision, install state, delivery form, and consumer entry.
- **Readiness judgment:** record one `Supported`, `Unsupported`, or `blocked` judgment for each exact promised
  tuple and identity without merging another subject.
- **Invalidation and reopen:** make affected readiness stale when policy, contract, tuple, fact, assurance,
  artifact, consumer evidence, compatibility, recovery, or support inputs change.
- **Authority handoff:** preserve readiness, point-of-action authority, external result, and post-release
  observation as different states.

### Product lifecycle

- **Acquisition and invocation:** preserve the promised installation or distribution method, resolved
  consumer command, runtime, target, and support boundary for each delivery form.
- **Update and recovery:** keep current, prior, interrupted, incompatible, partial, rolled-back,
  forward-fixed, withdrawn, and unsupported consumer states distinguishable.
- **Ongoing support:** maintain evidence freshness, support ownership, stop conditions, recovery limits, and
  response obligations throughout the support window.
- **Deprecation and retirement:** close acquisition, update, data, configuration, credential, diagnostic,
  uninstall or cessation, recovery, and final-support obligations per delivery identity.

## Scenario Hierarchy

### Design lifecycle

- Promise framing
  - Early policy for one needed tuple
    - `CLIRLSE-SC-DESIGN-POLICY-01` — Policy names the narrowest justified runtime, target, delivery, and consumer promise.
  - Bun-primary product with an optional Node lane
    - `CLIRLSE-SC-DESIGN-POLICY-02` — A Node promise is independently named and evidenced.
- Policy identity
  - Complete early policy
    - `CLIRLSE-SC-DESIGN-POLICY-03` — Early policy contains every decision needed before coordination.
  - Residual-risk boundary
    - `CLIRLSE-SC-DESIGN-RISK-01` — Policy defines acceptance criteria and authority without accepting risk implicitly.
- Delivery separation
  - Package-backed and standalone first-class forms
    - `CLIRLSE-SC-DESIGN-IDENTITY-01` — Each form has its own artifact and consumer identity.
  - Optional direct form
    - `CLIRLSE-SC-DESIGN-IDENTITY-02` — A script or workspace or revision command remains a separate selected route.
  - Hybrid product
    - `CLIRLSE-SC-DESIGN-IDENTITY-03` — Shared command meaning does not merge evidence or recovery.
- Compatibility and recovery
  - Supported state transition
    - `CLIRLSE-SC-DESIGN-COMPAT-01` — Runtime, install, data, configuration, update, and recovery states are explicit.
  - Faulty artifact may already be held
    - `CLIRLSE-SC-DESIGN-RECOVERY-01` — Policy distinguishes rollback, forward fix, withdrawal, and cessation by reach.
  - Rollout channel cannot stage exposure
    - `CLIRLSE-SC-DESIGN-ROLLOUT-01` — A channel limitation has explicit support and recovery consequences.
- Owner boundary
  - Mechanism or action appears in policy work
    - `CLIRLSE-SC-DESIGN-OWNER-01` — Release keeps judgment and routes the mechanism or action to its owner.

### Development lifecycle

- Policy handoff
  - Current policy reaches all owners
    - `CLIRLSE-SC-DEVELOP-HANDOFF-01` — Every owner receives the same exact policy identity and applicable obligations.
- Evidence reconciliation
  - Exact package consumer evidence
    - `CLIRLSE-SC-DEVELOP-EVIDENCE-01` — Package evidence names the installed archive and resolved package command.
  - Exact standalone consumer evidence
    - `CLIRLSE-SC-DEVELOP-EVIDENCE-02` — Direct evidence names the unit, target, installation or distribution, and resolved command.
  - Proxy capability or metadata
    - `CLIRLSE-SC-DEVELOP-EVIDENCE-03` — Build capability and metadata cannot impersonate consumer proof.
  - One form's evidence is borrowed
    - `CLIRLSE-SC-DEVELOP-EVIDENCE-04` — Cross-form evidence substitution is rejected.
- Readiness judgment
  - Every required input satisfies policy
    - `CLIRLSE-SC-DEVELOP-READY-01` — `Supported` is bounded to one complete exact evidence subject.
  - Exact evidence disproves or policy excludes support
    - `CLIRLSE-SC-DEVELOP-READY-02` — `Unsupported` states the exact unmet support condition.
  - Answer-changing evidence is absent or contradictory
    - `CLIRLSE-SC-DEVELOP-READY-03` — `blocked` preserves the gap, safe state, owner, and resume condition.
- Invalidation and reopen
  - Readiness input changes
    - `CLIRLSE-SC-DEVELOP-STALE-01` — A changed answer-bearing input invalidates only the affected entries.
  - Architecture compatibility changes
    - `CLIRLSE-SC-DEVELOP-STALE-02` — Semantic and release compatibility reopen at their separate owners.
- Authority handoff
  - Readiness precedes an outward action
    - `CLIRLSE-SC-DEVELOP-AUTHORITY-01` — Readiness supplies no action authority or action result.
  - Authority is absent
    - `CLIRLSE-SC-DEVELOP-HANDOFF-02` — The cold handoff identifies the exact blocked action and retained state.

### Product lifecycle

- Acquisition and invocation
  - Consumer installs a package-backed command
    - `CLIRLSE-SC-PRODUCT-CONSUME-01` — The supported claim follows the exact installed archive and package entry.
  - Consumer receives a standalone or direct command
    - `CLIRLSE-SC-PRODUCT-CONSUME-02` — The supported claim follows the exact direct unit and consumer entry.
  - Consumer runs an unpromised tuple
    - `CLIRLSE-SC-PRODUCT-CONSUME-03` — The support boundary is explicit without borrowing a nearby tuple.
- Update and recovery
  - Update crosses a persisted-data boundary
    - `CLIRLSE-SC-PRODUCT-UPDATE-01` — Incompatible data is refused or recovered without hidden loss.
  - Rollback cannot reach or safely run
    - `CLIRLSE-SC-PRODUCT-RECOVERY-01` — An available old artifact is not enough to make rollback supported.
  - Distribution is withdrawn after acquisition
    - `CLIRLSE-SC-PRODUCT-RECOVERY-02` — Withdrawal is not presented as recovery for existing consumers.
  - A later compatible correction is selected
    - `CLIRLSE-SC-PRODUCT-RECOVERY-03` — Forward-fix judgment names its affected consumers and compatibility.
- Ongoing support
  - Fact or evidence becomes stale during support
    - `CLIRLSE-SC-PRODUCT-SUPPORT-01` — The affected readiness entry refreshes or becomes blocked.
  - One delivery form fails while another remains valid
    - `CLIRLSE-SC-PRODUCT-SUPPORT-02` — Each form keeps its independent support judgment.
- Deprecation and retirement
  - Delivery form enters deprecation
    - `CLIRLSE-SC-PRODUCT-DEPRECATE-01` — Consumers can identify the replacement, window, and recovery route.
  - Delivery form retires
    - `CLIRLSE-SC-PRODUCT-RETIRE-01` — Acquisition, retained state, cessation, recovery, and final support close explicitly.

## Checklist Conditions

### Design lifecycle > Promise framing > Early policy for one needed tuple > CLIRLSE-SC-DESIGN-POLICY-01

- [ ] CLIRLSE-CK-DESIGN-POLICY-01-01 — Every promised tuple names the current user or automation need that requires it.
- [ ] CLIRLSE-CK-DESIGN-POLICY-01-02 — Every promised tuple records exact runtime, OS release, architecture, shell or direct entry, delivery form, install state, and consumer command.
- [ ] CLIRLSE-CK-DESIGN-POLICY-01-03 — Every applicable promised tuple records its C library and CPU baseline.
- [ ] CLIRLSE-CK-DESIGN-POLICY-01-04 — Every applicable promised tuple records its terminal or destination, encoding, and locale boundary.
- [ ] CLIRLSE-CK-DESIGN-POLICY-01-05 — No broader tuple is promised only because its continuing support cost is convenient to ignore.

### Design lifecycle > Promise framing > Bun-primary product with an optional Node lane > CLIRLSE-SC-DESIGN-POLICY-02

- [ ] CLIRLSE-CK-DESIGN-POLICY-02-01 — Bun-primary policy names the exact Bun lane it prioritizes.
- [ ] CLIRLSE-CK-DESIGN-POLICY-02-02 — Every promised Node lane names its exact Node version and consumer entry.
- [ ] CLIRLSE-CK-DESIGN-POLICY-02-03 — Every promised Node lane requires direct process-boundary evidence for that lane.
- [ ] CLIRLSE-CK-DESIGN-POLICY-02-04 — Bun capability, a Node shebang, or compatibility metadata alone does not create Node support.

### Design lifecycle > Policy identity > Complete early policy > CLIRLSE-SC-DESIGN-POLICY-03

- [ ] CLIRLSE-CK-DESIGN-POLICY-03-01 — The early policy has one versioned product and policy identity.
- [ ] CLIRLSE-CK-DESIGN-POLICY-03-02 — The early policy identifies the accepted Architecture and Interface contracts.
- [ ] CLIRLSE-CK-DESIGN-POLICY-03-03 — The early policy identifies the required Security assurance subject.
- [ ] CLIRLSE-CK-DESIGN-POLICY-03-04 — The early policy lists every required Platform fact and its freshness trigger.
- [ ] CLIRLSE-CK-DESIGN-POLICY-03-05 — The early policy lists every required artifact, consumer, compatibility, and recovery evidence class.
- [ ] CLIRLSE-CK-DESIGN-POLICY-03-06 — The early policy states rollout constraints, monitoring inputs, and stop conditions.
- [ ] CLIRLSE-CK-DESIGN-POLICY-03-07 — The early policy states each support window, response owner, deprecation path, and retirement condition.

### Design lifecycle > Policy identity > Residual-risk boundary > CLIRLSE-SC-DESIGN-RISK-01

- [ ] CLIRLSE-CK-DESIGN-RISK-01-01 — Policy states each residual-risk acceptance criterion before readiness work begins.
- [ ] CLIRLSE-CK-DESIGN-RISK-01-02 — Each residual-risk criterion names its acceptance authority.
- [ ] CLIRLSE-CK-DESIGN-RISK-01-03 — The Release author does not accept Security-owned residual risk implicitly.
- [ ] CLIRLSE-CK-DESIGN-RISK-01-04 — Residual-risk acceptance grants no publication, installation, rollout, rollback, or forward-fix authority.

### Design lifecycle > Delivery separation > Package-backed and standalone first-class forms > CLIRLSE-SC-DESIGN-IDENTITY-01

- [ ] CLIRLSE-CK-DESIGN-IDENTITY-01-01 — Each package-backed entry names its package archive identity and digest.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-01-02 — Each package-backed entry names its package metadata entry and installed consumer command.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-01-03 — Each standalone entry names its direct unit identity and digest.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-01-04 — Each standalone entry names its target-specific distribution or installation method and consumer command.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-01-05 — Each form has separate compatibility, update, recovery, and evidence requirements.

### Design lifecycle > Delivery separation > Optional direct form > CLIRLSE-SC-DESIGN-IDENTITY-02

- [ ] CLIRLSE-CK-DESIGN-IDENTITY-02-01 — A selected direct script names its exact file and digest.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-02-02 — A selected workspace or revision command names its exact revision and command.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-02-03 — Each optional direct form names its own consumer entry and recovery route.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-02-04 — An unselected optional direct form is not implied by first-class package or standalone support.

### Design lifecycle > Delivery separation > Hybrid product > CLIRLSE-SC-DESIGN-IDENTITY-03

- [ ] CLIRLSE-CK-DESIGN-IDENTITY-03-01 — A hybrid retains one package-archive identity and one direct-unit identity.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-03-02 — A hybrid retains separate resolved consumer entries for each form.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-03-03 — A hybrid retains separate update and recovery obligations for each form.
- [ ] CLIRLSE-CK-DESIGN-IDENTITY-03-04 — Shared command semantics do not merge artifact or consumer evidence.

### Design lifecycle > Compatibility and recovery > Supported state transition > CLIRLSE-SC-DESIGN-COMPAT-01

- [ ] CLIRLSE-CK-DESIGN-COMPAT-01-01 — Policy states supported runtime transitions.
- [ ] CLIRLSE-CK-DESIGN-COMPAT-01-02 — Policy states supported artifact and installation transitions.
- [ ] CLIRLSE-CK-DESIGN-COMPAT-01-03 — Policy states supported persisted-data and configuration transitions.
- [ ] CLIRLSE-CK-DESIGN-COMPAT-01-04 — Policy states supported update and recovery transitions.
- [ ] CLIRLSE-CK-DESIGN-COMPAT-01-05 — An incompatible state has an explicit refusal that preserves recoverable consumer state.

### Design lifecycle > Compatibility and recovery > Faulty artifact may already be held > CLIRLSE-SC-DESIGN-RECOVERY-01

- [ ] CLIRLSE-CK-DESIGN-RECOVERY-01-01 — Policy states the exact consumers that rollback can reach.
- [ ] CLIRLSE-CK-DESIGN-RECOVERY-01-02 — Policy states the runtime, installation, data, configuration, and update compatibility required for rollback.
- [ ] CLIRLSE-CK-DESIGN-RECOVERY-01-03 — Policy states the compatibility and delivery route required for a forward fix.
- [ ] CLIRLSE-CK-DESIGN-RECOVERY-01-04 — Policy states that withdrawal affects later acquisition rather than artifacts already held.
- [ ] CLIRLSE-CK-DESIGN-RECOVERY-01-05 — Policy states the retained state and support path when neither rollback nor forward fix is available.

### Design lifecycle > Compatibility and recovery > Rollout channel cannot stage exposure > CLIRLSE-SC-DESIGN-ROLLOUT-01

- [ ] CLIRLSE-CK-DESIGN-ROLLOUT-01-01 — Every unstaged policy names the channel constraint that prevents bounded audience growth.
- [ ] CLIRLSE-CK-DESIGN-ROLLOUT-01-02 — Every unstaged policy states its monitoring limitation.
- [ ] CLIRLSE-CK-DESIGN-ROLLOUT-01-03 — Every unstaged policy states its recovery and incident-response consequences.
- [ ] CLIRLSE-CK-DESIGN-ROLLOUT-01-04 — A rollout constraint is not presented as an executed rollout.

### Design lifecycle > Owner boundary > Mechanism or action appears in policy work > CLIRLSE-SC-DESIGN-OWNER-01

- [ ] CLIRLSE-CK-DESIGN-OWNER-01-01 — Current terminal and execution facts route to `cli-platform`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-02 — CLI assurance and residual-risk evidence route to `cli-security`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-03 — Semantic compatibility routes to `cli-architecture`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-04 — Bun, compiler, module, executable-build, and map mechanisms route to `typescript-toolchain`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-05 — Process and exact consumer behavior proof route to `typescript-testing`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-06 — Package archives, installed package consumers, publication, and registry recovery route to `typescript-packaging`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-07 — Direct-unit production, installation, rollout, rollback rehearsal, and recovery route to `typescript-cli-delivery`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-08 — Multi-owner state and cold handoff route to `cli-development`.
- [ ] CLIRLSE-CK-DESIGN-OWNER-01-09 — Every external action routes to its exact separately authorized operator.

### Development lifecycle > Policy handoff > Current policy reaches all owners > CLIRLSE-SC-DEVELOP-HANDOFF-01

- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-01-01 — Every owner result names the exact current policy version it serves.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-01-02 — Every owner result names the exact tuple and delivery identity it serves.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-01-03 — Each owner receives only the obligations inside its boundary.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-01-04 — A policy change makes every affected owner request and result stale.

### Development lifecycle > Evidence reconciliation > Exact package consumer evidence > CLIRLSE-SC-DEVELOP-EVIDENCE-01

- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-01-01 — Package evidence names the exact archive and digest.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-01-02 — Package evidence names the package manager and installation policy.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-01-03 — Package evidence proves the resolved command came from that installed archive.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-01-04 — Package evidence names the exact runtime and target tuple.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-01-05 — Package evidence states its date, result, failure signal, and limitations.

### Development lifecycle > Evidence reconciliation > Exact standalone consumer evidence > CLIRLSE-SC-DEVELOP-EVIDENCE-02

- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-02-01 — Direct evidence names the exact unit or revision and digest when applicable.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-02-02 — Direct evidence names the target distribution or installation method.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-02-03 — Direct evidence proves the resolved command selected that exact unit.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-02-04 — Direct evidence names the exact runtime and target tuple.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-02-05 — Direct evidence states its date, result, failure signal, and limitations.

### Development lifecycle > Evidence reconciliation > Proxy capability or metadata > CLIRLSE-SC-DEVELOP-EVIDENCE-03

- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-03-01 — A successful source run is not treated as installed package or direct-unit evidence.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-03-02 — A successful compile or cross-compile is not treated as target consumer evidence.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-03-03 — Package `bin`, `engines`, `os`, and `cpu` fields are not treated as consumer proof.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-03-04 — A Bun target name or compatibility register is not treated as support proof.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-03-05 — A green summary without exact evidence identities is not treated as readiness.

### Development lifecycle > Evidence reconciliation > One form's evidence is borrowed > CLIRLSE-SC-DEVELOP-EVIDENCE-04

- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-04-01 — Package evidence is not used to establish a standalone entry.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-04-02 — Standalone evidence is not used to establish a package-backed entry.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-04-03 — One OS, architecture, runtime, install state, or consumer entry does not establish another.
- [ ] CLIRLSE-CK-DEVELOP-EVIDENCE-04-04 — One form's failure does not silently determine another form's judgment.

### Development lifecycle > Readiness judgment > Every required input satisfies policy > CLIRLSE-SC-DEVELOP-READY-01

- [ ] CLIRLSE-CK-DEVELOP-READY-01-01 — A `Supported` entry names one exact current policy version.
- [ ] CLIRLSE-CK-DEVELOP-READY-01-02 — A `Supported` entry names one complete runtime, target, delivery, install-state, and consumer tuple.
- [ ] CLIRLSE-CK-DEVELOP-READY-01-03 — A `Supported` entry names the exact artifact or revision and its identity evidence.
- [ ] CLIRLSE-CK-DEVELOP-READY-01-04 — Every policy-required Platform fact is current and retained with its disposition and limits.
- [ ] CLIRLSE-CK-DEVELOP-READY-01-05 — The required Security assurance and residual-risk position match the exact subject.
- [ ] CLIRLSE-CK-DEVELOP-READY-01-06 — Required consumer, compatibility, recovery, support, and risk-acceptance inputs each satisfy policy.
- [ ] CLIRLSE-CK-DEVELOP-READY-01-07 — The entry records its decision owner, time, limitations, and stale triggers.

### Development lifecycle > Readiness judgment > Exact evidence disproves or policy excludes support > CLIRLSE-SC-DEVELOP-READY-02

- [ ] CLIRLSE-CK-DEVELOP-READY-02-01 — An `Unsupported` entry names the exact excluded or unmet tuple and delivery identity.
- [ ] CLIRLSE-CK-DEVELOP-READY-02-02 — An `Unsupported` entry cites the exact policy boundary or current evidence that establishes the unmet condition.
- [ ] CLIRLSE-CK-DEVELOP-READY-02-03 — An `Unsupported` entry states its consumer-visible support and recovery limit.
- [ ] CLIRLSE-CK-DEVELOP-READY-02-04 — A missing or contradictory answer-changing input is not labeled `Unsupported`.

### Development lifecycle > Readiness judgment > Answer-changing evidence is absent or contradictory > CLIRLSE-SC-DEVELOP-READY-03

- [ ] CLIRLSE-CK-DEVELOP-READY-03-01 — A `blocked` entry names every answer-changing missing, stale, mismatched, inaccessible, or contradictory input.
- [ ] CLIRLSE-CK-DEVELOP-READY-03-02 — A `blocked` entry preserves the exact tuple, delivery identity, artifact or revision, and evidence received so far.
- [ ] CLIRLSE-CK-DEVELOP-READY-03-03 — A `blocked` entry states the current safe state and retained consumer effects.
- [ ] CLIRLSE-CK-DEVELOP-READY-03-04 — A `blocked` entry names the missing input owner and first non-mutating next action.
- [ ] CLIRLSE-CK-DEVELOP-READY-03-05 — A `blocked` entry states the exact resume condition.
- [ ] CLIRLSE-CK-DEVELOP-READY-03-06 — A `blocked` entry is not reported as `Supported` or `Unsupported`.

### Development lifecycle > Invalidation and reopen > Readiness input changes > CLIRLSE-SC-DEVELOP-STALE-01

- [ ] CLIRLSE-CK-DEVELOP-STALE-01-01 — A policy, tuple, delivery identity, artifact, revision, or consumer-entry change invalidates affected readiness.
- [ ] CLIRLSE-CK-DEVELOP-STALE-01-02 — A Platform fact, Security assurance, compatibility, recovery, or support change invalidates affected readiness.
- [ ] CLIRLSE-CK-DEVELOP-STALE-01-03 — An evidence date or owner result change reopens only entries that consumed it.
- [ ] CLIRLSE-CK-DEVELOP-STALE-01-04 — Prior readiness remains historical with its original subject and time.

### Development lifecycle > Invalidation and reopen > Architecture compatibility changes > CLIRLSE-SC-DEVELOP-STALE-02

- [ ] CLIRLSE-CK-DEVELOP-STALE-02-01 — Command grammar, semantic result, stream, schema, code, or exit compatibility returns to `cli-architecture`.
- [ ] CLIRLSE-CK-DEVELOP-STALE-02-02 — Runtime, target, artifact, installation, data, update, support, deprecation, or retirement compatibility remains with `cli-release`.
- [ ] CLIRLSE-CK-DEVELOP-STALE-02-03 — A change spanning both compatibility axes reopens both owners separately.

### Development lifecycle > Authority handoff > Readiness precedes an outward action > CLIRLSE-SC-DEVELOP-AUTHORITY-01

- [ ] CLIRLSE-CK-DEVELOP-AUTHORITY-01-01 — Readiness is distinct from credential authority.
- [ ] CLIRLSE-CK-DEVELOP-AUTHORITY-01-02 — Readiness is distinct from publication, installation, promotion, or rollout authority.
- [ ] CLIRLSE-CK-DEVELOP-AUTHORITY-01-03 — Readiness is distinct from rollback or forward-fix authority.
- [ ] CLIRLSE-CK-DEVELOP-AUTHORITY-01-04 — Readiness is not reported as proof that an external action occurred.
- [ ] CLIRLSE-CK-DEVELOP-AUTHORITY-01-05 — Post-release observation is not inferred from readiness or action authority.

### Development lifecycle > Authority handoff > Authority is absent > CLIRLSE-SC-DEVELOP-HANDOFF-02

- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-02-01 — The cold handoff names the exact proposed action, subject, destination, and owner.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-02-02 — The cold handoff names the separate authority required for that action.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-02-03 — The cold handoff preserves the current artifact, consumer, target, and readiness state.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-02-04 — The cold handoff names the first unproved action and exact resume condition.
- [ ] CLIRLSE-CK-DEVELOP-HANDOFF-02-05 — No credential, publication, installation, rollout, rollback, forward-fix, or network action is performed by the handoff.

### Product lifecycle > Acquisition and invocation > Consumer installs a package-backed command > CLIRLSE-SC-PRODUCT-CONSUME-01

- [ ] CLIRLSE-CK-PRODUCT-CONSUME-01-01 — Package support names the exact installed archive, package manager, target, runtime, and resolved command.
- [ ] CLIRLSE-CK-PRODUCT-CONSUME-01-02 — Package support states the registry or installation update route and its recovery limit.
- [ ] CLIRLSE-CK-PRODUCT-CONSUME-01-03 — Package support states the applicable support window and response owner.

### Product lifecycle > Acquisition and invocation > Consumer receives a standalone or direct command > CLIRLSE-SC-PRODUCT-CONSUME-02

- [ ] CLIRLSE-CK-PRODUCT-CONSUME-02-01 — Direct support names the exact unit or revision, target, runtime, distribution or installation method, and resolved command.
- [ ] CLIRLSE-CK-PRODUCT-CONSUME-02-02 — Direct support states the update, prior-unit, and recovery route.
- [ ] CLIRLSE-CK-PRODUCT-CONSUME-02-03 — Direct support states the applicable support window and response owner.

### Product lifecycle > Acquisition and invocation > Consumer runs an unpromised tuple > CLIRLSE-SC-PRODUCT-CONSUME-03

- [ ] CLIRLSE-CK-PRODUCT-CONSUME-03-01 — An unpromised runtime, OS, architecture, shell, locale, delivery form, or consumer entry is outside the support claim.
- [ ] CLIRLSE-CK-PRODUCT-CONSUME-03-02 — Nearby supported-tuple evidence is not transferred to the unpromised tuple.
- [ ] CLIRLSE-CK-PRODUCT-CONSUME-03-03 — The unsupported boundary identifies the available replacement or support route when one exists.

### Product lifecycle > Update and recovery > Update crosses a persisted-data boundary > CLIRLSE-SC-PRODUCT-UPDATE-01

- [ ] CLIRLSE-CK-PRODUCT-UPDATE-01-01 — Every supported update states the prior and intended data and configuration versions.
- [ ] CLIRLSE-CK-PRODUCT-UPDATE-01-02 — Every supported update states its interruption and partial-state behavior.
- [ ] CLIRLSE-CK-PRODUCT-UPDATE-01-03 — An incompatible consumer refuses without silently rewriting or discarding recoverable state.
- [ ] CLIRLSE-CK-PRODUCT-UPDATE-01-04 — Every accepted recovery preserves data and configuration needed by the resulting supported state.

### Product lifecycle > Update and recovery > Rollback cannot reach or safely run > CLIRLSE-SC-PRODUCT-RECOVERY-01

- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-01-01 — Rollback is unsupported when the delivery route cannot reach the exact affected consumers.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-01-02 — Rollback is unsupported when runtime, installation, data, configuration, or update compatibility is unproved.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-01-03 — Availability of an old artifact alone is not treated as rollback safety.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-01-04 — An unavailable rollback preserves the exact current state and next safe route.

### Product lifecycle > Update and recovery > Distribution is withdrawn after acquisition > CLIRLSE-SC-PRODUCT-RECOVERY-02

- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-02-01 — Withdrawal states which later acquisitions it can prevent.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-02-02 — Withdrawal does not claim to change artifacts already installed, cached, mirrored, or retained.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-02-03 — Existing consumers retain an explicit support and recovery disposition after withdrawal.

### Product lifecycle > Update and recovery > A later compatible correction is selected > CLIRLSE-SC-PRODUCT-RECOVERY-03

- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-03-01 — Forward-fix judgment names the faulty artifact and exact affected consumers.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-03-02 — Forward-fix judgment names the later artifact's required runtime, installation, data, configuration, and update compatibility.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-03-03 — Forward-fix judgment states its delivery reach and consumers it cannot reach.
- [ ] CLIRLSE-CK-PRODUCT-RECOVERY-03-04 — Forward-fix judgment does not perform or authorize the corrective release.

### Product lifecycle > Ongoing support > Fact or evidence becomes stale during support > CLIRLSE-SC-PRODUCT-SUPPORT-01

- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-01-01 — Every readiness input has an answer-changing refresh trigger.
- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-01-02 — A changed current fact is refreshed before the affected support claim is renewed.
- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-01-03 — A required fact or evidence result that cannot be refreshed changes the affected readiness entry to `blocked`.
- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-01-04 — Historical evidence retains its original subject, date, and limits.

### Product lifecycle > Ongoing support > One delivery form fails while another remains valid > CLIRLSE-SC-PRODUCT-SUPPORT-02

- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-02-01 — A package failure changes only the affected package entries unless shared evidence is independently invalidated.
- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-02-02 — A direct-unit failure changes only the affected direct entries unless shared evidence is independently invalidated.
- [ ] CLIRLSE-CK-PRODUCT-SUPPORT-02-03 — Each surviving form retains its own current artifact, consumer, compatibility, recovery, and support evidence.

### Product lifecycle > Deprecation and retirement > Delivery form enters deprecation > CLIRLSE-SC-PRODUCT-DEPRECATE-01

- [ ] CLIRLSE-CK-PRODUCT-DEPRECATE-01-01 — Deprecation names the exact runtime, target, delivery identity, and consumer entry affected.
- [ ] CLIRLSE-CK-PRODUCT-DEPRECATE-01-02 — Deprecation names the replacement and compatibility window.
- [ ] CLIRLSE-CK-PRODUCT-DEPRECATE-01-03 — Deprecation states acquisition, update, data, configuration, recovery, and support behavior during the window.
- [ ] CLIRLSE-CK-PRODUCT-DEPRECATE-01-04 — Deprecation of one form does not silently deprecate another form.

### Product lifecycle > Deprecation and retirement > Delivery form retires > CLIRLSE-SC-PRODUCT-RETIRE-01

- [ ] CLIRLSE-CK-PRODUCT-RETIRE-01-01 — Retirement states whether each artifact remains obtainable, installed, or runnable.
- [ ] CLIRLSE-CK-PRODUCT-RETIRE-01-02 — Retirement states the fate of retained data, configuration, credentials, and diagnostics.
- [ ] CLIRLSE-CK-PRODUCT-RETIRE-01-03 — Retirement states the uninstall or cessation path.
- [ ] CLIRLSE-CK-PRODUCT-RETIRE-01-04 — Retirement states the remaining recovery route and its limits.
- [ ] CLIRLSE-CK-PRODUCT-RETIRE-01-05 — Retirement states the final support owner and end condition.
- [ ] CLIRLSE-CK-PRODUCT-RETIRE-01-06 — Retirement of one delivery form does not silently retire another form.

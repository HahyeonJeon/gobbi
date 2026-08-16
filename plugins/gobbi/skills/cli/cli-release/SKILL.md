---
name: cli-release
description: "CLI Release is a preference skill for early release policy and late readiness judgments for line-oriented TypeScript CLIs. It owns support, compatibility, recovery, rollout, deprecation, and retirement judgments."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: preference
---

# CLI Release

CLI Release records release policy first, then judges one exact runtime, target, delivery identity, and consumer entry as Supported, Unsupported, or blocked.

Use it when support matrices, consumer evidence, compatibility, recovery, rollout, support, deprecation, or retirement need judgment; build, test, packaging, credential, publication, installation, and rollout actions remain elsewhere.

## Principles

### Promise only what the product can continue to support

A support promise includes installation, use, update, recovery, maintenance, and eventual retirement. Its
target and time boundary should be no broader than current consumer need and sustainable evidence.

### Bind readiness to exact consumer evidence

Source behavior, metadata, compiler capability, or a nearby target cannot establish consumer readiness. Each
runtime, target, delivery identity, install state, and consumer entry keeps its own evidence.

### Keep policy, readiness, authority, and action distinct

Early policy states what evidence and outcomes will be required. Late readiness judges that evidence, while
point-of-action authority and any external result remain separate states owned elsewhere.

### Recovery is part of the supported outcome

A target is not ready when failure can leave consumers without an accepted safe state. Rollback, forward fix,
withdrawal, and cessation have different reach and compatibility and must be judged separately.

## Rules

- **MUST record release policy before implementation and evidence coordination depend on it.** Bind promised
  runtime, target, delivery, and consumer tuples; evidence; compatibility; recovery; rollout constraints;
  support windows; deprecation and retirement; and residual-risk acceptance criteria.
- **MUST bind every readiness judgment to one exact policy version, runtime and target tuple, delivery
  identity, consumer entry, artifact or revision, evidence set, and decision time.** Evidence for one tuple,
  artifact, entry, install state, or delivery form never proves another.
- **MUST use only `Supported`, `Unsupported`, or `blocked` for late readiness.** Use `blocked` when an
  answer-changing policy, fact, assurance, artifact, consumer, compatibility, recovery, or risk-acceptance
  input is missing or contradictory; do not relabel the gap as `Unsupported`.
- **MUST keep npm package-backed commands and Bun standalone executables as separate first-class identities.**
  Keep an optional direct script or workspace or revision command separate too, and never merge a hybrid's
  artifact, consumer, compatibility, update, or recovery evidence.
- **MUST keep capability, metadata, current facts, security assurance, technical evidence, readiness,
  action authority, external result, and post-release observation distinct.** Bun-primary never implies Node
  support, and build or cross-build capability never implies target support.
- **NEVER build, test, pack, sign, publish, install, promote, roll out, roll back, forward-fix, use credentials,
  mutate a registry or target, or perform network action from this skill.** Route mechanisms and actions to
  their exact owners and return a cold handoff when separate authority is absent.

## Preferences

### Prefer the narrowest promised matrix

**PREFER** only runtime, operating-system, architecture, C-library or CPU baseline, shell or direct-entry,
terminal or destination, encoding, locale, delivery, installation, and consumer combinations that a current
user or automation need requires. Expand when that need and a sustainable artifact, evidence, support, and
recovery path justify the continuing cost.

Treat Bun as the primary runtime. Add a Node lane only when the policy names its exact version, package or
direct consumer entry, behavior promise, and required process-boundary evidence; a Node shebang, manifest
field, or Bun compatibility statement is not that evidence.

### Prefer an explicit early release policy

**PREFER** one versioned `Release policy accepted` record before coordination begins. It should contain:

| Policy area | Accepted decision |
|---|---|
| Subject | CLI product and version, `cli-architecture` contract, `cli-interface` contract, and `cli-security` assurance requirement |
| Promised tuples | Exact runtime, OS/release, architecture, C library and CPU baseline when applicable, shell or direct entry, terminal or destination, encoding, locale, delivery form, install state, and consumer command |
| Delivery identities | Package-backed command, Bun standalone executable, and each selected optional direct form as separate entries |
| Required evidence | Toolchain identity, artifact or revision identity, exact consumer-entry proof, command behavior, current `cli-platform` facts, `cli-security` assurance, and evidence freshness |
| Compatibility | Runtime, artifact, installation, persisted data and configuration, update, and supported predecessor or successor boundaries |
| Recovery | Prior safe state, rollback reach and compatibility, forward-fix expectations, withdrawal limits, operator route, and verification requirement |
| Rollout and support | Channel constraints, audience-growth controls, monitoring inputs, stop conditions, support window, response owner, and end-of-support policy |
| Risk and authority | Residual-risk acceptance criteria and authority owner, plus every later action that needs separate point-of-action authority |

Depart from a single record only when independent products or authorities require separate policies. Keep the
same fields and explicit cross-policy boundary so no tuple inherits another policy accidentally.

### Prefer exact delivery and consumer identities

**PREFER** a package-backed entry to name the exact package archive, digest, package metadata entry, package
manager and policy, isolated installed consumer, resolved command, and registry-specific update and recovery
route required by [`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md). The manifest's
`bin`, `engines`, `os`, or `cpu` claims should shape evidence requests but not satisfy them.

**PREFER** a standalone or other direct entry to name the exact file, archive, script digest, or workspace or
repository revision; target tuple; distribution or install method; resolved consumer command; prior
recoverable unit; and direct recovery route required by
[`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md). A successful Bun compile or
target name should not substitute for execution from that consumer entry.

For a hybrid, preserve both entries even when their logical command contract is identical. A package-backed
workspace command delivered directly loads both mechanism owners and retains both sets of obligations.

### Prefer compatibility that begins from consumer state

**PREFER** release compatibility decisions that name the prior and intended artifact, runtime, installation,
configuration, persisted-data, update, and recovery states. Require explicit refusal and preserved recoverable
state when an older or newer consumer cannot safely read, migrate, update, or recover the current state.

Keep command grammar, semantic results, configuration meaning, stream roles, machine schemas, error codes,
and exit behavior with [`cli-architecture`](../cli-architecture/SKILL.md). This skill owns runtime targets,
delivery forms, artifacts, install paths, persisted data, update routes, support windows, and their
deprecation or retirement. Load both when a change crosses those axes.

### Prefer a narrow evidence-based readiness judgment

**PREFER** one `Release readiness judgment recorded` entry per exact promised tuple and delivery identity.
Use the following meanings:

| Judgment | Meaning |
|---|---|
| `Supported` | Current policy includes the exact tuple and identity, and every required current fact, assurance, artifact, consumer, compatibility, recovery, support, and risk-acceptance input satisfies that policy. |
| `Unsupported` | Accepted policy excludes the exact tuple or identity, or current exact evidence establishes that a required support condition cannot be met. |
| `blocked` | An answer-changing input is absent, stale, mismatched, inaccessible, or contradictory, so support cannot yet be decided. |

The readiness record should preserve the policy identity, complete tuple, delivery and consumer identities,
artifact or revision and digest, each evidence identity and date, `cli-platform` fact dispositions, `cli-security`
assurance and residual risk, compatibility and recovery state, judgment, limitations, decision owner and
time, stale triggers, current safe state, and cold handoff. A green summary or owner label without those
links is not readiness.

### Prefer staged exposure when the selected channel permits it

**PREFER** an early policy with bounded audience growth, observable stop conditions, a current support owner,
and a compatible recovery or forward-fix route. Depart for offline, manual, private, immediate, or
owner-constrained distribution only when the policy records that limit and its monitoring, support, recovery,
and incident-response consequences.

This preference judges rollout constraints and evidence. It does not authorize or execute rollout. Current
authority, action, resulting destination state, and post-release observation remain separate records.

### Prefer forward fix for artifacts consumers may already hold

**PREFER** a later compatible forward fix when a faulty artifact may already be installed, cached, mirrored,
or retained by consumers. Choose rollback only when the delivery owner proves that it can reach the exact
affected consumers and that runtime, installation, configuration, data, and update compatibility make the
older unit safe.

Treat withdrawal as a limit on later acquisition, not recovery for consumers who already hold the unit.
Depart from forward fix when an exact rollback or cessation path has better proved reach and safety; record
the evidence, unsupported population, retained state, and next safe action.

### Prefer explicit support, deprecation, and retirement closure

**PREFER** every supported entry to state its start, review trigger, support window, update and recovery
route, response owner, and end-of-support condition. Deprecation should name the affected tuple or delivery
identity, replacement, compatibility window, acquisition and update behavior, data and configuration fate,
and support channel.

Retirement should state which artifacts remain obtainable, installed, or runnable; which data,
configuration, credentials, and diagnostics remain; how uninstall or cessation works; what recovery remains
possible; and when final support ends. Depart only when a governing retention or consumer constraint requires
a narrower closure, and keep that limitation visible.

### Route mechanisms and actions without transferring judgment

Give Bun, compiler, module, executable-build, and map questions to
[`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md). Give process-boundary arguments,
streams, status, signals, failure, cleanup, and exact consumer behavior proof to
[`typescript-testing`](../../typescript/typescript-testing/SKILL.md).

Give package archives, installed package consumers, registry publication, and registry-specific recovery to
[`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md). Give standalone and other
direct-unit production, distribution, installation, activation, rollback rehearsal, recovery, and consumer
entry to [`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md). Current terminal
and execution facts route to [`cli-platform`](../cli-platform/SKILL.md), assurance to
[`cli-security`](../cli-security/SKILL.md), semantic compatibility to
[`cli-architecture`](../cli-architecture/SKILL.md), and multi-owner state and cold handoff to
[`cli-development`](../cli-development/SKILL.md).

An operator may perform a separately authorized action through its exact owner. This skill preserves the
readiness judgment unchanged and records neither the action nor its result as if it had occurred.

## References

- [CLI Release checklist](checklists.md) supplies reusable unchecked conditions for this preference.

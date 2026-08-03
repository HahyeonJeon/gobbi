# Web Deployment Evaluation Checklist

This reusable unchecked source evaluates one accepted web release deployed to an authorized environment,
against the target-freeze, reverse-path, migration and publish-order, retained-asset, staged-rollout,
production-URL verification, immediate-reversal, and authority-stop obligations this operation owns. It is
governed by the [`web`](../SKILL.md) domain and [`web-deployment`](SKILL.md) operation, with
[`web-release`](../web-release/SKILL.md) owning the immutable identified artifact and its production evidence,
[`web-development`](../web-development/SKILL.md) coordinating the handoff,
[`web-configuration`](../web-configuration/SKILL.md) owning runtime values and secrets management, and
[`web-observability`](../web-observability/SKILL.md) owning rollout signals. The source commit that contains
this file identifies the checklist version. Its stable owner prefix is `WEBDEP`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBDEP-SC-PROJECT-03 — Normal case: deployment accepts rollout/rollback/authority state and freezes/records the exact target

An accepted release handoff reaches deployment. The expected outcome preserves its bytes, accepts rollout,
rollback, and exact authority state, and freezes and records the environment identity and target before any
change; deploying a moving target or settling an adjacent owner's question here is the failure.

#### Checklist

- [ ] WEBDEP-CK-PROJECT-03-01 — Deployment work starts from an accepted release handoff that includes rollout and rollback intent and the exact deployment-authority state.
- [ ] WEBDEP-CK-PROJECT-03-02 — The environment identity and target are frozen before anything in the target environment changes.
- [ ] WEBDEP-CK-PROJECT-03-03 — The environment identity and target are recorded before anything in the target environment changes.
- [ ] WEBDEP-CK-PROJECT-03-04 — Every adjacent deployment question is routed to its owner: migration meaning to `web-backend`; rollout signals to `web-observability`; runtime configuration to `web-configuration`; every protected-data exposure question arising from target configuration, migration, rollout, or served behavior to `web-security`; live suite evidence to `web-testing`; and disputed browser verification facts to `web-platform`.

## Structure

### WEBDEP-SC-STRUCTURE-03 — Edge case: retained prior assets keep old documents and in-flight chunks valid through rollback

During rollout and rollback, old documents and in-flight lazy imports still request predecessor names. The
expected outcome keeps those exact files served through the rollback window; deleting or renaming them while
clients still hold their references is the failure.

#### Checklist

- [ ] WEBDEP-CK-STRUCTURE-03-01 — The previous build's assets remain retained and served throughout the rollback window.
- [ ] WEBDEP-CK-STRUCTURE-03-02 — A client holding the old entry document and an in-flight lazy chunk can still fetch the files by the names they already have.

## Performance

### WEBDEP-SC-PERFORMANCE-01 — Normal case: the rollout holds long enough for signals to move

The accepted release advances in stages against live traffic. The expected outcome uses the smallest stage
the target supports and holds it until error, latency, and outcome signals can move; an advance faster than
the signals it claims to use is the failure.

#### Checklist

- [ ] WEBDEP-CK-PERFORMANCE-01-01 — Each rollout stage is the smallest the target supports.
- [ ] WEBDEP-CK-PERFORMANCE-01-02 — Each stage is held long enough for error, latency, and outcome signals to move before the next advance.
- [ ] WEBDEP-CK-PERFORMANCE-01-03 — Each stage boundary, its traffic share, the signals observed during the hold, and the decision taken at the end of it are recorded.

## Aesthetics

### WEBDEP-SC-AESTHETICS-01 — Poor quality: the deployment record cannot be read afterwards

An incident is investigated from the deployment record alone. The expected outcome supplies each step's
timing, the exact entry-document cutover, and retained-predecessor state; a record that cannot place the
cutover in time is the failure.

#### Checklist

- [ ] WEBDEP-CK-AESTHETICS-01-01 — Each deploy step's completion time, the moment the entry document changed, and confirmation that the previous build's assets remain in place are recorded.

## Usage

### WEBDEP-SC-USAGE-01 — Normal case: the reverse path is designed and rehearsed before the deploy

A reverse path is designed and exercised while the previous version is whole. The expected outcome names the
artifact, restoration, retention, reversible and irreversible changes, and actor, then proves that path; a
path first designed during an incident is the failure.

#### Checklist

- [ ] WEBDEP-CK-USAGE-01-01 — The reverse path names the exact previous artifact, how it is restored, how long its assets are retained, which data changes are reversible and which are not, and who may activate it.
- [ ] WEBDEP-CK-USAGE-01-02 — The reverse path is defined before any forward step.
- [ ] WEBDEP-CK-USAGE-01-03 — The reverse path is executable by a named person without further design.
- [ ] WEBDEP-CK-USAGE-01-04 — The stop conditions that trigger the reverse path are recorded.
- [ ] WEBDEP-CK-USAGE-01-05 — The reverse path was exercised on the retained previous artifact before the first forward step, in a pre-production target that mirrors production or through the production target's documented dry run.

### WEBDEP-SC-USAGE-02 — Expected failure: verification fails or a stop condition is met

The release is serving and verification fails or a stop condition fires. The expected outcome reverses at
once and re-verifies the restored release; diagnosing first while the broken build serves, or assuming the
reverse worked, is the failure.

#### Checklist

- [ ] WEBDEP-CK-USAGE-02-01 — The release is reversed without waiting for a diagnosis.
- [ ] WEBDEP-CK-USAGE-02-02 — The diagnosis proceeds from the restored state.
- [ ] WEBDEP-CK-USAGE-02-03 — The previous entry document is restored.
- [ ] WEBDEP-CK-USAGE-02-04 — The previous entry document's assets are confirmed still served.
- [ ] WEBDEP-CK-USAGE-02-05 — The restored release is re-verified from the production URL rather than assumed to have succeeded.

### WEBDEP-SC-USAGE-03 — Edge case: a change has no reverse path

A deployment step cannot be undone once taken. The expected outcome raises it as a decision needing explicit
user authority; treating it as an ordinary step to take carefully is the failure.

#### Checklist

- [ ] WEBDEP-CK-USAGE-03-01 — A change with no reverse path is raised as a decision needing explicit user authority rather than taken carefully.

## Consistency

### WEBDEP-SC-CONSISTENCY-01 — Normal case: the served bytes match the frozen artifact

The deployment is verified after cutover. The expected outcome fetches from the production URL people use
and compares what is served with the accepted release, including live names and cache directives; a preview
alias or configured value standing in for live evidence is the failure.

#### Checklist

- [ ] WEBDEP-CK-CONSISTENCY-01-01 — Verification is performed against the production URL people actually use, not a preview alias, an origin bypass, or a staging host.
- [ ] WEBDEP-CK-CONSISTENCY-01-02 — The served build identity read from the entry document matches the accepted release identity.
- [ ] WEBDEP-CK-CONSISTENCY-01-03 — At least one hashed asset, one lazily loaded chunk, and one server-owned round trip are exercised.
- [ ] WEBDEP-CK-CONSISTENCY-01-04 — The live-served record contains the deployed asset names and cache directives for each release-defined file class and the entry document, observed from the production URL.
- [ ] WEBDEP-CK-CONSISTENCY-01-05 — Every difference between the accepted artifact and the served bytes is returned to the publish-ordering step before the deployment is reported complete.

### WEBDEP-SC-CONSISTENCY-02 — Rule violation: the deploy order lets one version reference something absent

Migrations, assets, and the entry document are published in an order that can name something absent. The
expected outcome keeps prior and new versions servable throughout overlap; incompatible migration or missing
asset forces a stop and reverse.

#### Checklist

- [ ] WEBDEP-CK-CONSISTENCY-02-01 — Backward-compatible migrations are applied before the code that needs them.
- [ ] WEBDEP-CK-CONSISTENCY-02-02 — Every asset and chunk is uploaded before the entry document that names them.
- [ ] WEBDEP-CK-CONSISTENCY-02-03 — The entry document is published last.
- [ ] WEBDEP-CK-CONSISTENCY-02-04 — The previous and the new entry document can both be served correctly at the same time throughout the rollout.
- [ ] WEBDEP-CK-CONSISTENCY-02-05 — A migration that is not backward compatible with the currently serving build stops the deploy.
- [ ] WEBDEP-CK-CONSISTENCY-02-06 — A migration that is not backward compatible with the currently serving build triggers the reverse path.

## Risk

### WEBDEP-SC-RISK-01 — Rule violation: an action is taken without authority for that exact action

Deployment reaches a credential, publication, promotion, rollout, or reverse action whose exact authority was
not granted. The expected outcome stops with artifact, evidence, and reverse path preserved and names the
blocked action and authority; proceeding on assumed or adjacent authority is the failure.

#### Checklist

- [ ] WEBDEP-CK-RISK-01-01 — No credential is used without explicit authority for that exact action.
- [ ] WEBDEP-CK-RISK-01-02 — Nothing is published, promoted, or advanced without explicit authority for that exact action.
- [ ] WEBDEP-CK-RISK-01-03 — A blocked action stops with the artifact, the verification evidence, and the reverse path preserved.
- [ ] WEBDEP-CK-RISK-01-04 — The first blocked action and the authority it requires are named.

### WEBDEP-SC-RISK-03 — Adversarial: a rollout advances on assumed authority or a stop is bypassed

A stage advances because time passed, an earlier stage succeeded, or a signal was absent rather than good,
and an upload is called a verified deployment. The expected outcome rejects every substitution; compliance
shaped to continue the rollout is the failure.

#### Checklist

- [ ] WEBDEP-CK-RISK-03-01 — No rollout stage advances while a stop condition is met.
- [ ] WEBDEP-CK-RISK-03-02 — No stage advances on elapsed time, an absent signal, or a prior stage's success in place of observed signals.
- [ ] WEBDEP-CK-RISK-03-03 — No completed upload, green build, or passing preview is counted as a verified deployment.

## Overall

### WEBDEP-SC-OVERALL-01 — Normal case: one running release with a known identity, verification, and reverse path

The environment has reached its deployed or reversed state. The expected outcome reports deployment, live
verification, and observed health separately and records every irreversible or retained risk; one combined
status or omitted retention obligation is the failure.

#### Checklist

- [ ] WEBDEP-CK-OVERALL-01-02 — Deployment, live verification, and observed health are reported as separate claims.
- [ ] WEBDEP-CK-OVERALL-01-03 — Every irreversible data change, retained artifact, retention window, and remaining risk is recorded.

### WEBDEP-SC-OVERALL-02 — Normal case: the deployment record answers order, stages, live verification, reverse path, and authority

A cold operator reads the completed deployment record. The expected outcome answers publish order, rollout,
live verification, reversal, and authority state; any unanswered environment-change question is the failure.

#### Checklist

- [ ] WEBDEP-CK-OVERALL-02-01 — The deployment record answers publish order, rollout stages, live verification, reverse path, and authority state.

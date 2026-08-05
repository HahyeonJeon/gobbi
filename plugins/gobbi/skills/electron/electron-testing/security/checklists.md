# Electron Testing Security Evaluation Checklist

This reusable unchecked source evaluates adversarial real-Electron observations at security decision points.
It is governed by the [`electron` domain](../../SKILL.md) and [`electron-testing` operation](../SKILL.md).
Testing owns execution, interpretation, environment classification, and the evidence record; the product
owners retain the security claims and decisions tested here.

The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`ELECTSEC`.

This file defines coverage only. The parent [Evaluation](../../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line follows the scenario's owned rows
and points to one previously defined row. Each reused row appears on only one `Also applies` line.

## Project

Request identity and ordinary evidence-subject classification are outside this source's adversarial
security-decision-point subject.

## Structure

General claim-layer selection is outside this source's adversarial security-decision-point subject.

## Performance

General execution ordering and cost are outside this source's adversarial security-decision-point subject.

## Aesthetics

General evidence-record presentation is outside this source's adversarial security-decision-point subject.

## Usage

Ordinary lifecycle and dynamic Packaging or Release exchanges are outside this source's adversarial
security-decision-point subject.

## Consistency

General premise invalidation and rerun state are outside this source's adversarial security-decision-point
subject.

## Risk

### ELECTSEC-SC-RISK-01 — Normal case: privilege rejection is observed at the responsible process

Preload and privileged-process controls are independent decision points. The expected result observes every
accepted bridge boundary; a broad bridge or an unobserved rejection path is the failure.

#### Checklist

- [ ] ELECTSEC-CK-RISK-01-01 — The privileged process rejects every member of this invalid-input set before any side effect: missing or detached `event.senderFrame`, wrong sender origin, and malformed payload.
- [ ] ELECTSEC-CK-RISK-01-02 — The preload exposes only accepted domain methods.
- [ ] ELECTSEC-CK-RISK-01-04 — The preload sends only data in callbacks.
- [ ] ELECTSEC-CK-RISK-01-05 — The preload serializes only accepted values.
- [ ] ELECTSEC-CK-RISK-01-06 — The preload reports an unavailable capability explicitly.
- [ ] ELECTSEC-CK-RISK-01-07 — The preload removes each subscription through its owning disposer.

### ELECTSEC-SC-RISK-02 — Adversarial: content policy and renderer preferences are attacked independently

Content policy and renderer preferences can fail independently. The expected result observes each effective
control in real Electron; inferring one control from another is the failure.

#### Checklist

- [ ] ELECTSEC-CK-RISK-02-01 — Absent and weak `Content-Security-Policy` values are separate cases on every renderer delivery path.
- [ ] ELECTSEC-CK-RISK-02-02 — Every content-policy case observes its effective response-header or document policy.
- [ ] ELECTSEC-CK-RISK-02-03 — `nodeIntegration`, `contextIsolation`, `sandbox`, `webSecurity`, `allowRunningInsecureContent`, `experimentalFeatures`, and `enableBlinkFeatures` each have an independent real-Electron observation.
- [ ] ELECTSEC-CK-RISK-02-04 — Every security-reducing value is rejected before renderer creation or has an authority record and a limited real-Electron exception case.
- [ ] ELECTSEC-CK-RISK-02-05 — Every content-policy case proves that its disallowed script or resource is blocked.

### ELECTSEC-SC-RISK-03 — Adversarial: session, navigation, window, and guest paths evade one central check

Session, navigation, child-window, and guest controls apply at separate trust surfaces. The expected result
exercises each configured decision point; treating one central check as universal is the failure.

#### Checklist

- [ ] ELECTSEC-CK-RISK-03-01 — `setPermissionCheckHandler` and `setPermissionRequestHandler` are exercised separately on the default and every secondary session or partition with varied requesting origin, embedding origin, frame facts, and permission, asserting the accepted default denial.
- [ ] ELECTSEC-CK-RISK-03-02 — Allowed and denied main-frame, subframe, and redirect navigation are exercised through `will-navigate`, `will-frame-navigate`, and `will-redirect` on initial and later-created `webContents`.
- [ ] ELECTSEC-CK-RISK-03-03 — Initial, later-created, and secondary-session child-window requests are decided by `setWindowOpenHandler` before any denied child is created.
- [ ] ELECTSEC-CK-RISK-03-04 — Disallowed guest URL, preload, preferences, and requested partition values are each denied at `will-attach-webview` before any guest is created.

### ELECTSEC-SC-RISK-04 — Adversarial: denied external input or diagnostics hide a security failure

External inputs and diagnostics can conceal different security failures. The expected result attempts each
reachable path independently and preserves the accepted control; weakening production behavior is the
failure.

#### Checklist

- [ ] ELECTSEC-CK-RISK-04-01 — Every reachable denied external-URL, custom-protocol traversal, wrong-origin IPC, and malformed-payload path is attempted independently.
- [ ] ELECTSEC-CK-RISK-04-02 — Renderer, main-process, crash, hang, and operating-system diagnostics are recorded through the accepted Observability mechanism without weakening a security control or changing production emission.

### ELECTSEC-SC-RISK-05 — Adversarial: one activated trust surface stands in for another

Each activated trust surface needs its own observation. The expected result retains a separate adversarial
case for each surface; evidence from one installed handler cannot establish another control.

#### Checklist

- [ ] ELECTSEC-CK-RISK-05-01 — Every activated trust surface has its own observable adversarial case, so one installed handler cannot substitute for another control.

## Overall

General terminal-evidence routing is outside this source's adversarial security-decision-point subject.

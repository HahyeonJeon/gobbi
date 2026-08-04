---
name: electron-observability
description: "MUST load when designing, implementing, or reviewing Electron diagnostic emission, including structured logs, metrics, traces, crash and hang capture, correlation, redaction, delivery, and retention."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Observability

Use this operation to design, implement, or review one Electron diagnostic-emission outcome. Start with named
diagnostic questions and consumers, accepted installed and technical decisions, current runtime facts, and
the exact source, artifact, target operating system and architecture, and process record.

Build the smallest signal set that answers those questions. Cover structured logs, metrics, traces,
correlation, crash and hang capture, redaction, transport, stored arrival, access, retention, volume, and
non-interference where each applies.

The operation ends with one bounded diagnostic-emission record and a dynamic handoff of arrived records for
runtime diagnosis. It does not decide the cause, establish live health, own tests, or advance package,
release, delivery, publication, or rollout state.

## Principles

### Every signal answers a named question

A signal exists for a named consumer to answer a named diagnostic question. Emission without both adds cost,
retention risk, and noise.

### Failure capture must outlive the failure

Configure capture before the process or renderer can fail. Use an observer that remains available after the
affected execution context ends.

### Configured emission and stored arrival are claims here; live health is outside the result

Source and configuration can establish intended emission, while only destination inspection establishes
arrival. Live health is not established by this operation and remains outside the result.

### Diagnostics must protect data and observed behavior

Allow only named fields into each record and keep volume bounded. Emission must not block, throw into, or
materially degrade the behavior it records.

## Rules

- **MUST start from accepted records owned by
  [`electron-contract`](../electron-contract/SKILL.md) and
  [`electron-design`](../electron-design/SKILL.md), with current mechanism and pinned-major facts from
  [`electron-runtime`](../electron-runtime/SKILL.md).** Return a contradiction, missing decision, or disputed
  mechanism to its earliest owner before dependent emission work continues.

- **MUST name each diagnostic question, consumer, signal owner, source commit or digest, installed artifact
  checksum or exact build identifier, target operating system and architecture, process, authority, access
  rule, retention limit, expected volume, and completion claim.** Choose implementation or read-only review;
  a review request authorizes no edit.

- **MUST cover every applicable Electron execution and failure class without inventing a separate preload
  process.** Treat preload as renderer-process context; distinguish main, renderer, owned utility process,
  other Electron child process, renderer hang and recovery, and external main-process observation.

- **MUST use structured records, bounded metric labels, explicit correlation fields and limits, capture
  timing, field allowlists, volume controls, authorized transports, and destination access and retention.**
  Inspect records actually stored at the destination instead of treating emitter input as arrival.

- **NEVER hide a required signal, weaken security, extend retention, or enable sensitive capture to obtain a
  passing emission result.** Emission failure, backpressure, or destination unavailability must remain visible
  without changing the user-visible or data-changing action being observed.

- **NEVER claim final diagnosis, runtime-mechanism interpretation, test design or execution or interpretation,
  a test verdict, live health, complete delivery, package or release state, publication, or rollout.** Dynamic
  handoffs transfer records and limitations; they do not transfer policy ownership.

## Procedure

### Phase 1 — Define One Diagnostic-Emission Outcome

#### 1.1 Confirm the trigger, inputs, and authority

- Enter when designing or implementing Electron diagnostic emission, or when reviewing it without edits.
  State whether the work is implementation or read-only review.
- Read the accepted diagnostics requirement and recovery promise from Electron Contract, the accepted process,
  trust, resource, and failure decisions from Electron Design, and current mechanism facts from Electron
  Runtime. Accept a construction-verified source record from Development as a dynamic input when source work
  already exists; do not treat it as policy.
- Record each diagnostic question, consumer, signal owner, affected process or `webContents`, source commit or
  digest, installed artifact checksum or exact build identifier, target operating system and architecture,
  Electron major, and complete process map.
- Record authority for edits, sensitive capture, destination use, access, and retention. Also record expected
  volume, the completion claim, prohibited paths or data, and any external service that is already authorized;
  stop rather than creating or using an unauthorized destination.

#### 1.2 Inventory current emission and gaps

- Trace every existing log, metric, trace, crash or hang signal, reporter, queue, file, transport, destination,
  access rule, retention rule, and cleanup path from its emitting process to its stored record.
- Record current schemas, severity and label use, correlation fields, sampling or filtering, volume and
  backpressure behavior, reporter startup time, and operating-system and architecture applicability.
- Inspect current destinations for existing protected-data exposure, missing or partial arrival, correlation
  gaps, unsupported failure classes, missing processes, and stale access or retention configuration.
- Continue with the exact gap set. Stop on a contract or design contradiction, and return a mechanism dispute
  to Electron Runtime before selecting a replacement mechanism.

### Phase 2 — Define the Signal, Capture, and Delivery Set

#### 2.1 Define structured logs, metrics, traces, and correlation

- Define only signals needed to answer the Phase 1 questions. Map every question to its log, metric, trace,
  crash or hang record, intended consumer, and destination.
- Give each log a timestamp, severity, event name, stable typed fields, process identifier, source commit or
  digest, artifact checksum or exact build identifier, target operating system and architecture, and
  correlation field where applicable.
- Select each metric kind and unit from the measured question. Keep label values bounded; place request,
  renderer, path, URL, or user-specific values in an allowed log or trace field rather than a metric label.
- Define trace and correlation fields across renderer and preload context, IPC, main, utility processes, and
  transports. Record sampling or volume decisions at the entry point and name every crossing that cannot
  carry the correlation field.

#### 2.2 Define process failure, crash, and hang capture

- Configure [`crashReporter.start()`](https://www.electronjs.org/docs/latest/api/crash-reporter) early enough
  for every subsequently created process it must monitor. Resolve startup options, later extra-parameter
  behavior, annotation limits, operating-system and architecture support, and pinned-major differences
  through Electron Runtime instead of copying fixed limits into this operation.
- Require an external collector or supervisor, or previously configured crash collection, for a main-process
  exit. In-process main code cannot emit after that process ends, and crash collection establishes neither
  live recovery nor final diagnosis.
- Record renderer disappearance with `render-process-gone` on the affected
  [`webContents`](https://www.electronjs.org/docs/latest/api/web-contents). Record `unresponsive` and a later
  `responsive` on that same `webContents` as separate hang and recovery signals.
- Use [`app`](https://www.electronjs.org/docs/latest/api/app) `child-process-gone` only for the non-renderer
  process classes it reports. Keep direct owned [`utilityProcess`](https://www.electronjs.org/docs/latest/api/utility-process)
  `error` and `exit` observation; the application event does not replace those owner-specific signals.

#### 2.3 Define redaction, bounded capture, transport, and retention

- Define a field allowlist for every log, metric, trace, error, crash annotation, and hang record. Exclude
  credentials, tokens, authorization data, cookies, session values, personal data, sensitive paths and URLs,
  request or response bodies, and exception text unless an accepted protected-data decision explicitly
  permits a narrower field.
- Define bounded queues, buffers, files, sampling, filtering, aggregation, retry, flush, stop, and cleanup
  behavior. Preserve a visible count or status for dropped, delayed, or undelivered required signals.
- Treat [`contentTracing`](https://www.electronjs.org/docs/latest/api/content-tracing) and
  [`netLog`](https://www.electronjs.org/docs/latest/api/net-log) as bounded diagnostics for a named question,
  not always-on defaults. Record the applicable process, target operating system and architecture, duration,
  file-size limit, access, retention, cleanup, and destination before capture starts.
- Require exact authority before `netLog` uses `includeSensitive`, which can include cookies and authentication
  data, or `everything`, which can include socket bytes. Apply the allowed-field, access, retention, duration,
  and file-size decisions to the resulting file and stored destination.
- Select only an authorized transport and destination. Define finite retry and backpressure behavior that
  cannot throw into, block, or materially delay the user-visible or data-changing action being observed.

### Phase 3 — Implement or Review the Complete Emission Path

#### 3.1 Establish the ordered path and edit boundary

- For implementation, record the exact editable schemas, emitters, process entries, reporter setup,
  transports, destination configuration, access and retention configuration, documentation, and cleanup.
  Keep every other path unchanged.
- For read-only review, record the exact subject and questions, then keep source, configuration, destination,
  and project files unchanged. Do not reclassify review as implementation without explicit edit authority.
- Establish the complete path before details: shared record or schema and stable source, artifact, target
  operating system and architecture, and process fields; main-owned coordination; renderer and preload-context
  emission; owned utility-process emission; other Electron child-process signals; external main-process crash
  collection; transport; destination; access and retention configuration; cleanup.

#### 3.2 Implement or inspect from the record to stored destination

- During implementation, add each applicable path in the Step 3.1 order. Preserve accepted process, trust,
  lifecycle, resource, and failure ownership while keeping every record within its field allowlist.
- During read-only review, inspect the same complete path in the same order. Record exact missing fields,
  process gaps, startup gaps, correlation breaks, transport gaps, destination gaps, retention conflicts, and
  cleanup gaps without applying a correction.
- Keep preload emission inside renderer-process context and route it through the accepted narrow bridge or
  renderer-owned transport. Do not describe preload as a separate process or give it independent process
  lifetime.
- Add bounded cleanup for reporters, listeners, queues, trace sessions, network-log sessions, files,
  transports, and temporary access. Record which owner performs each cleanup and when.

### Phase 4 — Verify Stored Arrival and Recover Emission Failures

#### 4.1 Check construction and stored records

- Run only applicable formatting, lint, type, build, emitted-entry, configuration, and static consistency
  checks on the exact implementation or read-only-review result. Keep check-only review commands read-only.
- Inspect the actual stored destination record for each available required signal. Record its process,
  source commit or digest, artifact checksum or exact build identifier, target operating system and
  architecture, correlation field, capture time, arrival status, allowed fields, access, retention, and
  volume status.
- Report configured emission and observed stored arrival as separate claims. State literally that live health
  is not established by this operation and remains outside the result. A missing record, uninspected
  destination, clean build, or configured reporter establishes neither stored arrival nor live health.
- Record later test needs and required environments without designing, running, interpreting, classifying, or
  accepting a test or issuing a verdict.

#### 4.2 Repair or return the earliest failure

- For missing arrival, failed transport, correlation loss, reporter startup gaps, backpressure, destination
  unavailability, or protected data, locate the earliest emission or configuration boundary owned here.
- During implementation, repair that bounded cause and repeat its construction check and destination
  inspection. During read-only review, record the failure and required owner without editing.
- Stop or reduce the affected signal and access when protected data reaches an emitted or stored record.
  Preserve the leak, retention, and access status until the destination is corrected; do not hide a required
  signal, weaken security, extend retention, or enable broader capture to report success.
- Return current or pinned-major mechanism disputes to Electron Runtime. Return installed-contract or
  technical-design contradictions to their accepted owner, and return an unauthorized destination, access,
  retention, or sensitive-capture request to the authority that can decide it.

### Phase 5 — Complete the Record and Diagnostic Handoff

#### 5.1 Complete one bounded diagnostic-emission record

- Record the question, consumer, work type, source commit or digest, installed artifact checksum or exact
  build identifier, target operating system and architecture, Electron major, process map, and signal owners.
- Record signal definitions, process and artifact fields, correlation map and limits, capture timing,
  redaction allowlists, volume controls, transports, destinations, stored arrival status, access and
  retention, cleanup, non-interference result, limitations, unresolved facts, and later test needs.
- Complete only when every required field has a value or explicit unavailable status, every owned failure has
  been repaired or returned, and every claim remains limited to configured emission or observed stored
  arrival. Claim no final diagnosis, live health, test verdict, complete delivery, package or release state,
  publication, or rollout.

#### 5.2 Hand arrived records to Electron Runtime for diagnosis

- Label the record `Dynamic handoff — arrived diagnostic records → Electron Runtime diagnosis`; it is not a
  static policy reference.
- Supply the named questions, arrived records, source and artifact fields, target operating system and
  architecture, process map, timestamps, correlation values and limits, capture configuration, arrival gaps,
  protected-data status, and access limits. Do not select or assert the cause.
- Electron Runtime returns mechanism diagnosis to the earliest affected owner. A later failure reopens that
  owner without changing this operation's emission record or another owner's policy.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.

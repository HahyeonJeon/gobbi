---
name: desktop-windows
description: "MUST load when looking up or diagnosing current Windows facts about compatibility, installation, runtime lifecycle, native integration, update, repair, uninstall, trust, or failure evidence for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# Desktop Windows

Desktop Windows is the query-first Manual for current Windows facts about one installable Electron and
TypeScript application. A **compatibility tuple** is the exact application, artifact, Windows, and environment
record that bounds one lookup.

The Manual returns one bounded fact result and its diagnosis. It does not choose product behavior, declare
product support policy, implement or test the application, use credentials, mutate a machine or external
system, or run an end-to-end development or release procedure.

## Principles

### One complete tuple defines the subject

A Windows fact is meaningful only for the exact application, artifact, operating system, and environment in
the question. A changed field creates a new subject rather than a similar case.

### Evidence classes do not substitute for one another

Official versioned material, package metadata, exact observation, and project evidence answer different
questions. Their collection order ranks the lookup without hiding conflicts.

### Unknown is a valid result

Missing, stale, or conflicting answer-changing evidence produces an explicit unknown. Likelihood, convention,
or a neighbouring tuple never fills the gap.

### Windows facts do not decide product policy

A capability, limitation, or failure signal can inform another owner. It cannot choose what the product
promises, how it behaves, or which targets it supports.

## Rules

- **MUST bind every lookup to the complete compatibility tuple and Windows-specific fields below.** Record each field
  as exact, `Unknown`, or `Not applicable: <exact reason>`.
- **MUST return `Unknown for this compatibility tuple` when an answer-changing field is unknown.** Treat any
  tuple change as a new evidence subject and make no cross-tuple inference.
- **MUST collect evidence in the stated order and keep conflicts visible.** Missing primary evidence cannot be
  replaced by secondary material, and an exact observation proves only the observed tuple.
- **MUST return exactly one bounded result with sources, diagnosis, next probe, limits, routes, freshness, and
  non-decisions.** Use only `Supported`, `Not supported`, or `Unknown for this compatibility tuple`.
- **MUST use current primary Microsoft or Electron material for version-sensitive claims.** Record the source,
  version or release bound, access date, evidence class, and condition that makes it stale.
- **NEVER claim product policy, implementation, a test verdict, credential use, mutation, publication, or real
  application, installer, runtime, or Windows execution from documentation or repository evidence.** Route
  those results to their exact owners.

## Manual

### What belongs in this Manual?

Use this Manual for a current fact or failure diagnosis about Windows behavior for the complete compatibility
tuple. The returned result remains a fact input to another owner when the question asks for a decision or
action.

| Question | This Manual returns | Route for the adjacent result |
|---|---|---|
| Does this exact tuple expose a Windows capability, prerequisite, limit, or failure signal? | Current bounded Windows fact | Keep here |
| What should the product do when the fact applies? | No product choice | [`desktop-architecture`](../desktop-architecture/SKILL.md) for window, activation, state, and restoration outcomes; [`desktop-interface`](../desktop-interface/SKILL.md) for interface intent |
| Should the product claim the target, artifact, update, recovery, rollback, or release? | No support or release judgment | [`desktop-release`](../desktop-release/SKILL.md) |
| How is a scoped desktop change coordinated? | No lifecycle coordination | [`desktop-development`](../desktop-development/SKILL.md) |
| What Electron event, application programming interface, or process behavior applies? | No Electron semantic conclusion | [`electron-runtime`](../../electron/electron-runtime/SKILL.md) |
| How is the behavior implemented? | No implementation | [`electron-development`](../../electron/electron-development/SKILL.md) |
| What evidence proves the application behavior? | No test or verification verdict | [`electron-testing`](../../electron/electron-testing/SKILL.md) |
| How is an artifact packaged, signed, installed, updated, or released? | No mechanism procedure | [`electron-release`](../../electron/electron-release/SKILL.md) |
| What trust boundary or sensitive-data policy is acceptable? | No security policy | [`web-security`](../../web/web-security/SKILL.md) |

### What identifies one compatibility tuple?

Record every common field before looking up a fact. `Not applicable` is valid only when its exact reason proves
that the field cannot change this answer.

| Common field | Required record |
|---|---|
| Question/input | Exact question and the native integration or input involved |
| Application | Application identity, exact version, and build |
| Electron | Exact Electron version and build |
| Artifact/package | Artifact or package identity, version or digest, distribution channel, and installed state |
| Windows | Windows family, exact release, and build |
| Architecture | Application architecture and Windows architecture |
| Installation | Install form, user or machine scope, resolved location, and current installed version |
| Runtime/session | Exact runtime and session environment when it can change the answer |
| Authority/trust/isolation | User or privilege, applied policy, signing or trust state, and sandbox or container context when relevant |

#### Which Windows-specific fields apply?

The common fields already carry Windows build, architecture, installation scope, and trust context. The
Windows-specific record repeats build beside edition and adds the exact choices below:

| Windows-specific field | Exact detail to record |
|---|---|
| Edition and build | Exact Windows edition and build |
| Application identity | Packaged or unpackaged; package identity and application identity when present |
| Distribution path | Microsoft Store, MSIX, named installer technology, portable archive, or named package manager |
| Installation authority | Per-user or per-machine effect, elevation state, and applicable installer or organization policy |
| Execution environment | Native or emulated process, interactive or remote session, and relevant session state |

Microsoft's current [Windows app distribution guidance](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/choose-distribution-path)
uses `distribution path` for this choice. Re-open the page during each lookup for its exact current options.

Microsoft distinguishes package identity from application identity, including the application user model ID
used for runtime association. Consult the current [package identity overview](https://learn.microsoft.com/en-us/windows/apps/desktop/modernize/package-identity-overview)
for the exact packaged case. For installer scope, use the documentation for the actual installer technology;
Windows Installer, for example, defines distinct [installation contexts](https://learn.microsoft.com/en-us/windows/win32/msi/installation-context).

#### What do missing fields do?

- An answer-changing `Unknown` field forces the exact result `Unknown for this compatibility tuple`.
- An unexplained omitted field or `Not applicable` value makes the lookup incomplete.
- A different application build, Electron build, artifact, Windows build, architecture, install state, user,
  policy, trust state, emulation state, or session is a new evidence subject.
- Evidence from one tuple may be cited as a competing claim or next lead. It may not establish another tuple.

### In what order is evidence collected?

Collect evidence in this exact order. Record the ordinal and evidence class with every source.

1. Exact-version official Microsoft Windows or Electron documentation, schema, source, or release notes.
2. Exact Microsoft Store, package-manager, package, artifact, signature, and trust metadata.
3. A reproducible probe or observation on the exact compatibility tuple.
4. Exact project artifacts or logs.
5. Qualified secondary material only to state uncertainty or identify the next probe.

The order does not resolve a conflict by itself. Keep conflicting claims, narrow the supported bounds when the
evidence permits it, or return `Unknown for this compatibility tuple`. A missing primary source stays missing;
a broader article, nearby version, successful development run, or source inspection cannot replace it.

The official lookup starting points below were checked on 2026-08-04. Re-open the applicable page during each
lookup and record its current update or access date:

| Fact group | Current primary starting point | Required bound |
|---|---|---|
| Windows release, edition, build, servicing, and known issue | [Windows release health](https://learn.microsoft.com/en-us/windows/release-health/) and the exact release page | Exact release, edition, build, update, and publication date |
| Electron release and dependency versions | [Electron Releases](https://releases.electronjs.org/) and the exact release notes | Exact Electron build plus Chromium, Node.js, and release date when relevant |
| Windows packaging, distribution, install, update, and servicing model | [Package and deploy Windows apps](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/) and [Windows app distribution guidance](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/choose-distribution-path) | Exact distribution path and package or installer technology |
| MSIX identity, isolation, trust, and deployment failure | [MSIX documentation](https://learn.microsoft.com/en-us/windows/msix/), exact manifest schema, and exact package metadata | Exact package identity, trust level, signature, deployment method, and Windows build |
| Electron application, process, path, and native integration behavior | Exact-version [Electron API documentation](https://www.electronjs.org/docs/latest/api/app), source, and release notes | Exact Electron build and application state |

### Where is each Windows fact looked up?

Use the row matching the question. These are lookup boundaries, not instructions to mutate a machine.

| Question group | Inspect | Interpretation limit |
|---|---|---|
| Target and compatibility inputs | Exact Windows release/edition/build sources; Electron release notes; application and artifact metadata | A vendor lifecycle date or Electron support line does not itself create product support policy |
| Install and first launch | Exact package or installer metadata, resolved install scope/location, registration, prerequisite, trust, policy, first-launch input, and first failure signal | Package presence does not prove a usable first launch |
| Update, repair, rollback fact, uninstall, residual state, and recovery | Exact predecessor/candidate identities, delivery metadata, installer or package documentation, data/native/protocol compatibility facts, logs, and residual registrations/files | This Manual states mechanism facts only; recovery, rollback, and release judgments route to `desktop-release` |
| Launch and activation delivery | Exact shortcut, file, protocol, notification, startup, or second-instance registration and input; Windows identity; Electron version and event documentation | Delivery facts do not choose create, reveal, focus, navigate, handle, no-op, or reject behavior |
| Process, window, background, close, and quit | Exact process/session state, application identity, Electron lifecycle documentation, and observed signal when available | A Windows or Electron event does not define the product's Normal quit or Abnormal termination outcome |
| Power and session lifetime | The exact documented Windows event, Electron event for the exact version, session kind, event log, and before/after process state | Never generalize this result into a universal suspend/resume state |
| Native integration | Exact Windows and Electron documentation for the named integration, identity and registration, permission/policy/trust prerequisite, return value, event, state, and accessible alternative fact | A non-throwing call does not prove the native effect occurred |
| Data, configuration, cache, log, temporary, document, package, and credential-store location | Resolved Electron path, Windows Known Folder or package-isolation source, exact user/session, and observed path when available | A documented default does not prove a redirected, packaged, or policy-controlled location |
| Trust, signing, sandbox, permissions, and policy | Exact signature and chain result, package trust level and identity, applied policy, privilege, container state, and rejection signal | Signed, trusted, allowed, and product-approved are separate facts |
| Failure diagnosis | Exact error code/message/event, timestamp, process or package identity, surrounding log, current state, and the same tuple's documented failure conditions | One failed attempt may show a defect or environment gap; it does not by itself prove `Not supported` |

For location facts, compare Electron's current [`app.getPath`](https://www.electronjs.org/docs/latest/api/app#appgetpathname)
contract with Windows [Known Folders](https://learn.microsoft.com/en-us/windows/win32/shell/known-folders)
and the actual package model. For packaged applications, consult the current
[MSIX container model](https://learn.microsoft.com/en-us/windows/msix/msix-containerization-overview)
before interpreting a file or registry path. Electron `safeStorage` currently documents Windows key protection
through DPAPI, but the exact version and user context still bound the fact; see
[`safeStorage`](https://www.electronjs.org/docs/latest/api/safe-storage).

For activation facts, compare the exact registered Windows activation kind with Electron's exact-version
application behavior. Useful primary starting points include Windows
[desktop app activation](https://learn.microsoft.com/en-us/windows/apps/develop/launch/activate-an-app),
Electron [deep links](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app), and
Electron [notifications](https://www.electronjs.org/docs/latest/tutorial/notifications).

For power and session facts, distinguish the exact Windows signal from the Electron abstraction. Windows
documents power messages in [`WM_POWERBROADCAST`](https://learn.microsoft.com/en-us/windows/win32/power/wm-powerbroadcast),
while Electron documents events for the exact version in
[`powerMonitor`](https://www.electronjs.org/docs/latest/api/power-monitor/). Neither page alone proves how an
installed application behaved on a machine.

For trust facts, use exact signature, chain, package, and policy evidence. Microsoft documents MSIX trust in
[Sign an MSIX package](https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview) and
signature verification in [SignTool](https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool).
Running a verification command, installing a certificate, changing policy, or using a signing credential
requires separate authority and is outside this Manual.

### What does one result contain?

Return every field below, even when the outcome is unknown.

| Result field | Required content |
|---|---|
| Compatibility tuple | All common fields, Windows-specific fields, and each field state |
| Evidence | Sources, versions or release bounds, dates, evidence classes, collection ordinals, and exact observations that actually occurred |
| Outcome | Exactly one of `Supported`, `Not supported`, or `Unknown for this compatibility tuple` |
| Behavior and bounds | The exact fact established and every application, artifact, Windows, architecture, install, user, policy, trust, emulation, and session bound |
| Diagnostic signals | Relevant success, failure, rejection, absence, error, event, log, and state signals |
| Next diagnostic probe | The smallest exact check that could resolve the remaining question, including required authority and owner |
| Limits and conflicts | Missing evidence, competing claims, stale sources, unobserved behavior, and narrower established bounds |
| Owner routes | Every adjacent judgment, coordination, fact, implementation, evidence, release-mechanism, or security-policy owner |
| Freshness | Access or observation date and the exact version, release, artifact, metadata, policy, or environment change that requires refresh |
| Non-decisions | Product behavior, product support, implementation, test verdict, credential use, mutation, publication, and any real execution not established |

Use `Supported` only when current evidence directly establishes the asked fact across the complete tuple and no
answer-changing unknown or conflict remains. Use `Not supported` only when exact authoritative evidence or an
exact system rejection establishes unavailability for that tuple; one defect, missing prerequisite, or failed
attempt is insufficient.

An unknown result also preserves each competing claim, missing item, narrower established bound, required next
proof, owner, and resume condition. It never becomes a default or a probable answer.

### How is unexpected behavior diagnosed?

Match the observed signal to the narrowest row and preserve it before choosing the next probe.

| Observed signal | Compare within the same tuple | Route when the fact is not the result sought |
|---|---|---|
| Installer, updater, repair, or uninstall rejection | Artifact/package identity, installed version, scope, elevation, policy, trust, dependency, in-use state, exact error, and deployment log | Mechanism to `electron-release`; judgment to `desktop-release`; coordination to `desktop-development` |
| Launch or activation input missing, duplicated, or sent to the wrong instance | Registration and identity, original input, packaged state, process/instance/session state, Electron version/event, and Windows failure signal | Product outcome to `desktop-architecture`; mechanism fact to `electron-runtime`; implementation and evidence to their named Electron owners |
| Window, tray, notification, shortcut, file, protocol, dialog, clipboard, or shell effect absent | Exact native integration, identity, permission/policy/trust prerequisite, documented return/event/state, session, and accessible-alternative fact | Product and interface choices to `desktop-architecture` and `desktop-interface` |
| Power, lock, unlock, remote-session, or resume observation differs | Exact Windows event, exact Electron event, session kind, timestamps, event log, process state, and unobserved transitions | Electron semantics to `electron-runtime`; product recovery and state outcome to `desktop-architecture` |
| Data, cache, log, package resource, or credential-protection location differs | Resolved Electron path, package isolation, user/session, redirection, policy, and exact observed location | Sensitive-data policy to `web-security`; implementation and evidence to their named owners |
| Crash, process, resource, native, package, trust, or session failure | Exact error/event/log, process type, artifact identity, Windows state, Electron build, and earliest divergent prerequisite | Diagnostics stay here; Electron mechanism, implementation, evidence, and release procedure route separately |

Microsoft's current [MSIX troubleshooting guide](https://learn.microsoft.com/en-us/windows/msix/msix-troubleshooting-guide)
identifies package deployment diagnostics; Electron's exact-version
[`crashReporter`](https://www.electronjs.org/docs/latest/api/crash-reporter) and application path documentation
identify Electron-owned signals and locations. These sources help classify evidence. They do not prove that a
probe ran or that the product recovered.

### When is a result stale?

A result needs refresh when any answer-changing tuple field changes, a cited source or metadata record changes,
the applicable Windows or Electron release is serviced, a package or trust record changes, a policy or user
context changes, a conflict appears, or the recorded refresh condition occurs. If current evidence is required
and refresh cannot be completed, return `Unknown for this compatibility tuple`.

A source read, repository check, package inspection, or artifact review records only that evidence class. State
`Exact-tuple probe not run` when no application, installer, updater, uninstaller, runtime transition, native
integration, or Windows behavior was actually observed.

## References

- [Evaluation checklist](checklists.md) is the reusable unchecked source for work governed by this skill.

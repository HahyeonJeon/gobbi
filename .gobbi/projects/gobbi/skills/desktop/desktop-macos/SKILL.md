---
name: desktop-macos
description: "MUST load when looking up or diagnosing current macOS facts about compatibility, installation, runtime lifecycle, native integration, update, repair, uninstall, trust, or failure evidence for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# Desktop macOS

Desktop macOS is the query-first Manual for current macOS facts about one installable Electron and TypeScript
application. A **compatibility tuple** is the exact application, artifact, macOS, and environment record that
bounds one lookup.

The Manual returns one bounded fact result and its diagnosis. It does not choose product behavior, declare
product support policy, implement or test the application, use credentials, mutate a machine or external
system, or run an end-to-end development or release procedure.

## Principles

### One complete tuple defines the subject

A macOS fact is meaningful only for the exact application, artifact, operating system, and environment in the
question. A changed field creates a new subject rather than a similar case.

### Evidence classes do not substitute for one another

Official versioned material, artifact and trust metadata, exact observation, and project evidence answer
different questions. Their collection order ranks the lookup without hiding conflicts.

### Unknown is a valid result

Missing, stale, inaccessible, or conflicting answer-changing evidence produces an explicit unknown.
Likelihood, convention, or a neighbouring tuple never fills the gap.

### macOS facts do not decide product policy

A capability, limitation, or failure signal can inform another owner. It cannot choose what the product
promises, how it behaves, or which targets it supports.

## Rules

- **MUST bind every lookup to the complete compatibility tuple and macOS-specific fields below.** Record each
  field as exact, `Unknown`, or `Not applicable: <exact reason>`.
- **MUST return `Unknown for this compatibility tuple` when an answer-changing field is unknown.** Treat any
  tuple change as a new evidence subject and make no cross-tuple inference.
- **MUST collect evidence in the stated order and keep conflicts visible.** Missing, inaccessible, or
  insufficient primary evidence cannot be replaced by secondary material, and an exact observation proves
  only the observed tuple.
- **MUST return exactly one bounded result with sources, diagnosis, next probe, limits, routes, freshness, and
  non-decisions.** Use only `Supported`, `Not supported`, or `Unknown for this compatibility tuple`.
- **MUST use current primary Apple or Electron material for version-sensitive claims.** Record the source,
  version or release bound, access date, evidence class, and condition that makes it stale.
- **NEVER claim product policy, implementation, a test verdict, credential use, mutation, publication, or real
  application, installer, runtime, or macOS execution from documentation or repository evidence.** Route
  those results to their exact owners.

## Manual

### What belongs in this Manual?

Use this Manual for a current fact or failure diagnosis about macOS behavior for the complete compatibility
tuple. The returned result remains a fact input to another owner when the question asks for a decision or
action.

| Question | This Manual returns | Route for the adjacent result |
|---|---|---|
| Does this exact tuple expose a macOS capability, prerequisite, limit, or failure signal? | Current bounded macOS fact | Keep here |
| What should the product do when the fact applies? | No product choice | [`desktop-architecture`](../desktop-architecture/SKILL.md) for window, activation, state, and restoration outcomes; [`desktop-interface`](../desktop-interface/SKILL.md) for interface intent |
| Should the product claim the target, artifact, update, recovery, rollback, or release? | No support or release judgment | [`desktop-release`](../desktop-release/SKILL.md) |
| How is a scoped desktop change coordinated? | No lifecycle coordination | [`desktop-development`](../desktop-development/SKILL.md) |
| What Electron event, application programming interface, or process behavior applies? | No Electron semantic conclusion | [`electron-runtime`](../../electron/electron-runtime/SKILL.md) |
| How is the behavior implemented? | No implementation | [`electron-development`](../../electron/electron-development/SKILL.md) |
| What evidence proves the application behavior? | No test or verification verdict | [`electron-testing`](../../electron/electron-testing/SKILL.md) |
| How is an artifact packaged, signed, notarized, installed, updated, or released? | No mechanism procedure | [`electron-release`](../../electron/electron-release/SKILL.md) |
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
| macOS | macOS family, exact release, and build |
| Architecture | Application architecture and macOS architecture |
| Installation | Install form, user or managed scope, resolved location, and current installed version |
| Runtime/session | Exact runtime and login-session environment when it can change the answer |
| Authority/trust/isolation | User or privilege, applied policy, signing or trust state, and sandbox or container context when relevant |

#### Which macOS-specific fields apply?

The common fields already carry the macOS build, architectures, install state, and trust context. The
macOS-specific record repeats the build beside the exact distribution, identity, trust, isolation, and
execution choices below:

| macOS-specific field | Exact detail to record |
|---|---|
| macOS build | Exact macOS release and build |
| Distribution path | Application bundle, installer package, disk image, archive, Mac App Store, or named updater path |
| Bundle identity and location | `CFBundleIdentifier`, short version, build version, resolved bundle location, and installed application name |
| Trust state | Code-signing identity and requirement, notarization result or ticket, quarantine or download provenance, Gatekeeper result, and applicable user or managed policy |
| Application isolation | App Sandbox state, exact entitlements, app-container or app-group identity, and resolved container location |
| Execution architecture | Application and helper architectures, native or Rosetta execution, and relevant universal-binary slices |
| Electron distribution build | Standard `darwin` or Mac App Store `mas` build and the exact reason that distinction changes the answer |

Apple distinguishes Mac App Store distribution from direct Developer ID distribution and documents ZIP
archives, disk images, and installer packages as direct-distribution containers in
[Packaging Mac software for distribution](https://developer.apple.com/documentation/xcode/packaging-mac-software-for-distribution).
Record the actual path and artifact instead of treating the container name as installed proof.

Apple defines `CFBundleIdentifier` as the system-wide application identity in
[`CFBundleIdentifier`](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier).
Electron separately documents that only its `mas` build runs under the App Sandbox required by the Mac App
Store; consult the exact-version [Mac App Store submission guide](https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide/)
and record whether `process.mas` applies. Node.js uses `darwin` as the macOS `process.platform` value, while
Electron also names its standard macOS distribution build `darwin`; record the exact object intended.

For architecture, record the binary slices as well as the current execution mode. Apple explains Intel,
universal, Apple-silicon, and Rosetta cases in
[Using Intel-based apps on a Mac with Apple silicon](https://support.apple.com/en-us/102527). Re-open that
page because Rosetta availability is version-sensitive and must never become a static support table here.

#### What do missing fields do?

- An answer-changing `Unknown` field forces the exact result `Unknown for this compatibility tuple`.
- An unexplained omitted field or `Not applicable` value makes the lookup incomplete.
- A different application build, Electron build, artifact, macOS build, architecture, distribution path,
  install state, user, policy, trust state, sandbox state, container, Rosetta mode, or session is a new
  evidence subject.
- Evidence from one tuple may be cited as a competing claim or next lead. It may not establish another tuple.

### In what order is evidence collected?

Collect evidence in this exact order. Record the ordinal and evidence class with every source.

1. Exact-version official Apple macOS or Electron documentation, schema, source, or release notes.
2. Exact Mac App Store, package, artifact, signature, notarization, and trust metadata.
3. A reproducible probe or observation on the exact compatibility tuple.
4. Exact project artifacts or logs.
5. Qualified secondary material only to state uncertainty or identify the next probe.

The order does not resolve a conflict by itself. Keep conflicting claims, narrow the supported bounds when the
evidence permits it, or return `Unknown for this compatibility tuple`. A missing, inaccessible, or insufficient
Apple primary source stays an evidence gap; a broader article, nearby release, successful development run, or
secondary source cannot replace it.

The official lookup starting points below were checked on 2026-08-04. Re-open the applicable page during each
lookup and record its current update or access date:

| Fact group | Current primary starting point | Required bound |
|---|---|---|
| macOS release, version, build, and compatibility input | Apple [Find out which macOS your Mac is using](https://support.apple.com/en-us/109033), the exact release page, and the exact security or software-update record | Exact macOS family, release, build, update, hardware or virtual-machine context, and publication date |
| Electron release and dependency versions | [Electron Releases](https://releases.electronjs.org/) and the exact release notes | Exact Electron build plus Chromium, Node.js, and release date when relevant |
| Distribution form and container | Apple [Packaging Mac software for distribution](https://developer.apple.com/documentation/xcode/packaging-mac-software-for-distribution), exact App Store record, and exact artifact metadata | Exact bundle, package, disk image, archive, Mac App Store, or updater path and artifact |
| Signing, notarization, quarantine, and Gatekeeper | Apple [Code Signing Services](https://developer.apple.com/documentation/security/code-signing-services), [notarization guidance](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution), and [Gatekeeper and runtime protection](https://support.apple.com/guide/security/sec5599b66df/web) | Exact final bytes, signature identity and requirement, notarization status or ticket, provenance or quarantine state, Gatekeeper result, policy, and macOS build |
| App Sandbox, entitlements, and containers | Apple [App Sandbox](https://developer.apple.com/documentation/security/app-sandbox), [Entitlements](https://developer.apple.com/documentation/bundleresources/entitlements), and [sandbox file access](https://developer.apple.com/documentation/security/accessing-files-from-the-macos-app-sandbox) | Exact executable, signature, entitlements, sandbox state, container identity and location, permission result, and macOS build |
| Electron application, process, path, update, and native integration behavior | Exact-version [Electron app documentation](https://www.electronjs.org/docs/latest/api/app), source, breaking changes, and release notes | Exact Electron build, `darwin` or `mas` distribution build, process, application state, and macOS tuple |

### Where is each macOS fact looked up?

Use the row matching the question. These are lookup boundaries, not instructions to mutate a Mac.

| Question group | Inspect | Interpretation limit |
|---|---|---|
| Target and compatibility inputs | Exact macOS release/build sources; hardware or virtual-machine and architecture facts; Electron release notes; application, bundle, and artifact metadata | An Apple lifecycle date, Rosetta statement, or Electron support line does not itself create product support policy |
| Install and first launch | Exact bundle, disk-image, archive, installer-package, App Store, or updater metadata; resolved installation location; signature, notarization, quarantine, Gatekeeper, policy, dependency, first-launch input, and first failure signal | Bundle presence does not prove a usable first launch |
| Update, repair, rollback fact, uninstall, residual state, and recovery | Exact predecessor/candidate identities, delivery and updater metadata, package or App Store documentation, signature and trust records, data/native/protocol compatibility facts, logs, and residual registrations, containers, files, and credentials | This Manual states mechanism facts only; recovery, rollback, and release judgments route to `desktop-release` |
| Launch and activation delivery | Exact Dock, Finder, file, protocol, notification, login-item, or second-instance registration and input; bundle identity; packaged state; Electron version and event documentation | Delivery facts do not choose create, reveal, focus, navigate, handle, no-op, or reject behavior |
| Process, window, background, close, and quit | Exact process and login-session state, window count and visibility, bundle identity, Electron lifecycle documentation, and observed signal when available | A macOS convention or Electron event does not define the product's Normal quit or Abnormal termination outcome |
| Power and session lifetime | Exact documented macOS event, Electron event for the exact version, login-session kind, timestamps, logs, and before/after process state | Never generalize this result into a universal suspend/resume state |
| Native integration | Exact Apple and Electron documentation for the named integration, bundle identity and registration, entitlement/permission/policy/trust prerequisite, return value, event, state, and accessible-alternative fact | A non-throwing call does not prove the native effect occurred |
| Application, data, configuration, cache, log, temporary, document, bundle, package, and Keychain location | Resolved Electron path, Apple directory or sandbox-container source, exact bundle or package metadata, exact user/session, and observed path when available | A documented default does not prove a redirected, sandboxed, managed, or user-selected location |
| Signing, notarization, quarantine, Gatekeeper, App Sandbox, entitlements, containers, permissions, and policy | Exact signature and requirement, notarization result/ticket, quarantine/provenance, Gatekeeper result, sandbox state, entitlements, container identity, permission response, and managed policy | Signed, notarized, Gatekeeper-accepted, sandboxed, permitted, and product-approved are separate facts |
| Failure diagnosis | Exact error code/message/event, timestamp, process and bundle identity, surrounding log, current state, and the same tuple's documented failure conditions | One failed attempt may show a defect or environment gap; it does not by itself prove `Not supported` |

For location facts, compare Electron's current
[`app.getPath`](https://www.electronjs.org/docs/latest/api/app#appgetpathname) contract with Apple's
[file-system guidance](https://developer.apple.com/documentation/foundation/using-the-file-system-effectively)
and the actual App Sandbox/container state. A sandbox changes the resolved application-support and cache
locations. Electron `safeStorage` currently uses Keychain on macOS, but the exact Electron version, user,
keychain availability, and access result still bound the fact; see
[`safeStorage`](https://www.electronjs.org/docs/latest/api/safe-storage).

For activation facts, compare the exact bundle registrations with Electron's exact-version application
behavior. Useful primary starting points include Apple's
[`CFBundleIdentifier`](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier),
Electron [`app`](https://www.electronjs.org/docs/latest/api/app),
[deep links](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app), and
[notifications](https://www.electronjs.org/docs/latest/tutorial/notifications). Electron documents that
macOS protocol registration needs a packaged application and that notification events need a signed
application; neither statement proves the exact installed behavior.

For update facts, compare the exact updater and distribution path with the applicable App Store, package, or
artifact metadata. Electron's current [`autoUpdater`](https://www.electronjs.org/docs/latest/api/auto-updater/)
uses Squirrel.Mac and requires a signed application on macOS, but its documented event alone does not prove an
update, restart, installed version, or recovery result.

For power and session facts, distinguish the exact macOS signal from the Electron abstraction. Electron
documents exact-version events in
[`powerMonitor`](https://www.electronjs.org/docs/latest/api/power-monitor/). No event name alone proves an
installed application suspended, resumed, saved state, quit, or recovered.

For trust facts, keep each state separate. Gatekeeper evaluates downloaded software using identity,
notarization, integrity, provenance, and current policy. App Sandbox limits access through entitlements and
containers. Inspecting documentation or artifact metadata is not signature verification, a Gatekeeper
assessment, a sandbox observation, or permission to change trust, policy, credentials, or entitlements.

### What does one result contain?

Return every field below, even when the outcome is unknown.

| Result field | Required content |
|---|---|
| Compatibility tuple | All common fields, macOS-specific fields, and each field state |
| Evidence | Sources, versions or release bounds, dates, evidence classes, collection ordinals, and exact observations that actually occurred |
| Outcome | Exactly one of `Supported`, `Not supported`, or `Unknown for this compatibility tuple` |
| Behavior and bounds | The exact fact established and every application, artifact, macOS, architecture, distribution, install, user, policy, trust, sandbox, container, Rosetta, and session bound |
| Diagnostic signals | Relevant success, failure, rejection, absence, error, event, log, and state signals |
| Next diagnostic probe | The smallest exact check that could resolve the remaining question, including required authority and owner |
| Limits and conflicts | Missing or inaccessible evidence, competing claims, stale sources, unobserved behavior, and narrower established bounds |
| Owner routes | Every adjacent judgment, coordination, Electron fact, implementation, evidence, release-mechanism, or security-policy owner |
| Freshness | Access or observation date and the exact version, release, build, artifact, metadata, signature, notarization, policy, or environment change that requires refresh |
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
| Installer, App Store, updater, repair, or uninstall rejection | Artifact/package identity, bundle identity, installed version, scope/location, signature, notarization, quarantine, Gatekeeper, policy, dependency, in-use state, exact error, and installer or updater log | Mechanism to `electron-release`; judgment to `desktop-release`; coordination to `desktop-development` |
| Launch or activation input missing, duplicated, or sent to the wrong instance | Bundle registration and identity, original input, packaged state, process/instance/session state, Electron version/event, and macOS failure signal | Product outcome to `desktop-architecture`; mechanism fact to `electron-runtime`; implementation and evidence to their named Electron owners |
| Window, Dock, menu, tray, notification, login item, file, protocol, dialog, clipboard, or shell effect absent | Exact native integration, bundle identity, entitlement/permission/policy/trust prerequisite, documented return/event/state, session, and accessible-alternative fact | Product and interface choices to `desktop-architecture` and `desktop-interface` |
| Power, lock, unlock, fast-user-switch, shutdown, or wake observation differs | Exact macOS event, exact Electron event, login-session kind, timestamps, logs, process state, and unobserved transitions | Electron semantics to `electron-runtime`; product recovery and state outcome to `desktop-architecture` |
| Data, cache, log, app-container, package-resource, or Keychain location differs | Resolved Electron path, sandbox/container and bundle identity, user/session, redirection, permission, policy, and exact observed location | Sensitive-data policy to `web-security`; implementation and evidence to their named owners |
| Crash, process, resource, native, package, signature, notarization, Gatekeeper, sandbox, entitlement, container, Rosetta, or session failure | Exact error/event/log, process type, bundle and artifact identity, macOS state, Electron build, and earliest divergent prerequisite | Diagnostics stay here; Electron mechanism, implementation, evidence, and release procedure route separately |

Apple's [notarization issue guide](https://developer.apple.com/documentation/security/resolving-common-notarization-issues)
and [App Sandbox violation guide](https://developer.apple.com/documentation/security/discovering-and-diagnosing-app-sandbox-violations)
classify exact failure evidence. Electron's exact-version
[`crashReporter`](https://www.electronjs.org/docs/latest/api/crash-reporter) and application path
documentation identify Electron-owned signals and locations. These sources do not prove that a probe ran or
that the product recovered.

### When is a result stale?

A result needs refresh when any answer-changing tuple field changes, a cited source or metadata record changes,
the applicable macOS or Electron release is updated, a bundle or artifact changes, a signature, notarization,
quarantine, Gatekeeper, sandbox, entitlement, container, Rosetta, policy, user, or session context changes, a
conflict appears, or the recorded refresh condition occurs. If current evidence is required and refresh cannot
be completed, return `Unknown for this compatibility tuple`.

A source read, repository check, bundle/package inspection, or artifact review records only that evidence
class. State `Exact-tuple probe not run` when no application, installer, updater, uninstaller, runtime
transition, native integration, or macOS behavior was actually observed.

## References

- [Evaluation checklist](checklists.md) is the reusable unchecked source for work governed by this skill.

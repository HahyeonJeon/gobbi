---
name: desktop-linux
description: "MUST load when looking up or diagnosing current Linux facts about compatibility, installation, runtime lifecycle, native integration, update, repair, uninstall, trust, or failure evidence for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# Desktop Linux

Desktop Linux is the query-first Manual for current Linux facts about one installable Electron and
TypeScript application. A **compatibility tuple** is the exact application, artifact, Linux distribution,
and environment record that bounds one lookup.

The Manual returns one bounded fact result and its diagnosis. It does not choose product behavior, declare
product support policy, implement or test the application, use credentials, mutate a machine or external
system, or run an end-to-end development or release procedure.

## Principles

### One complete tuple defines the subject

A Linux fact is meaningful only for the exact application, artifact, distribution, and environment in the
question. A changed field creates a new subject rather than a similar Linux case.

### Evidence classes do not substitute for one another

Official versioned material, repository and package metadata, exact observation, and project evidence answer
different questions. Their collection order ranks the lookup without hiding conflicts.

### Unknown is a valid result

Missing, inaccessible, insufficient, stale, or conflicting answer-changing evidence produces an explicit
unknown. Likelihood, convention, or a nearby Linux variant never fills the gap.

### Linux facts do not decide product policy

A capability, limitation, or failure signal can inform another owner. It cannot choose what the product
promises, how it behaves, or which targets it supports.

## Rules

- **MUST bind every lookup to the complete compatibility tuple and Linux-specific fields below.** Record each
  field as exact, `Unknown`, or `Not applicable: <exact reason>`.
- **MUST return `Unknown for this compatibility tuple` when an answer-changing field is unknown.** Treat any
  tuple change as a new evidence subject and make no cross-variant inference.
- **MUST collect evidence in the stated order and keep conflicts visible.** Missing, inaccessible, or
  insufficient primary evidence cannot be replaced by secondary material, and an exact observation proves
  only the observed tuple.
- **MUST return exactly one bounded result with sources, diagnosis, next probe, limits, routes, freshness, and
  non-decisions.** Use only `Supported`, `Not supported`, or `Unknown for this compatibility tuple`.
- **MUST use current primary Linux distribution, Linux project, or Electron material for version-sensitive
  claims.** Record the source, version or release bound, access date, evidence class, and condition that makes
  it stale.
- **NEVER claim product policy, implementation, a test verdict, credential use, mutation, publication, or real
  application, installer, runtime, or Linux execution from documentation or repository evidence.** Route
  those results to their exact owners.

## Manual

### What belongs in this Manual?

Use this Manual for a current fact or failure diagnosis about Linux behavior for the complete compatibility
tuple. The returned result remains a fact input to another owner when the question asks for a decision or
action.

| Question | This Manual returns | Route for the adjacent result |
|---|---|---|
| Does this exact tuple expose a Linux capability, prerequisite, limit, or failure signal? | Current bounded Linux fact | Keep here |
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
| Linux | Linux family, exact distribution and release, and build or image when answer-changing |
| Architecture | Application architecture and operating-system architecture |
| Installation | Install form, scope, resolved location, and current installed version |
| Runtime/session | Exact runtime and login or user session environment when it can change the answer |
| Authority/trust/isolation | User or privilege, applied policy, signing or trust state, and sandbox or container context when relevant |

#### Which Linux-specific fields apply?

Linux distributions assemble different repositories, packages, desktop components, sessions, and security
controls. Record the exact applicable values below instead of treating `Linux` as one interchangeable target.

| Linux-specific field | Exact detail to record |
|---|---|
| Distribution | Distribution name, exact release or version, build or image, and the official support source that applies to that release |
| Distribution path | Named repository plus package format and package manager, or named Flatpak, Snap, AppImage, other bundle, container, archive, or installer |
| Package or application identity | Package or application ID, version or revision, digest when available, install scope and location, repository or remote, channel or branch, installed state, and update owner |
| Desktop environment and session | Desktop environment and version, login or user session kind, and relevant session state |
| Display stack | X11 or Wayland display protocol, exact X display server or Wayland compositor and version, and the session in which it runs |
| Portal | Whether XDG Desktop Portal is used, portal version, selected backend, exact interface and interface version, permission state, and result |
| Keyring and secret storage | Keyring or Secret Service implementation, user-session availability and lock state when relevant, and Electron `safeStorage` provider, selected backend, and protection result |
| Sandbox and security profile | Sandbox, container, or confinement state and exact applied permissions, interfaces, AppArmor profile, SELinux policy or context, seccomp filter, or other named security profile |
| Architecture | Application, package, and operating-system architectures plus any emulation or translation layer |
| Kernel and C library | Exact Linux kernel release and exact C library implementation and version |
| Electron Linux behavior | Exact Electron version and build plus every answer-changing Linux option, documented behavior, or release change |

For distribution identity, start with the distribution's current release and support material and its exact
[`os-release`](https://www.freedesktop.org/software/systemd/man/latest/os-release.html) values. A derivative,
container image, immutable edition, or rolling snapshot remains its own exact distribution subject when that
distinction can change the answer.

A **distribution path** names who owns installation and update state. For a distribution repository, record
the repository, package format, package manager, package version, architecture, signature or trust metadata,
and installed database state. For another path, use the format's own nouns and metadata: a Flatpak application
ID, ref, remote, branch, commit, runtime, permissions, and install scope; a Snap name, revision, channel, base,
confinement, interfaces, and installed state; or an AppImage path, digest, embedded identity and update
information, executable state, and optional desktop-integration owner. The current primary starting points are
the [Flatpak documentation](https://docs.flatpak.org/en/latest/),
[Snap documentation](https://snapcraft.io/docs), and
[AppImage documentation](https://docs.appimage.org/); none proves another distribution path.

Record desktop environment, display protocol, display server, compositor, and session separately. Under
Wayland, the compositor is also the display server; under X11, the X server and compositor can be different
components. Confirm the exact implementation and version through the applicable desktop project, current
[Wayland documentation](https://wayland.freedesktop.org/docs/book/Architecture.html), or current
[X.Org documentation](https://www.x.org/releases/current/doc/).

XDG Desktop Portal selects backends by desktop and configuration, and each interface has its own version and
permission behavior. Use the current [portal documentation](https://flatpak.github.io/xdg-desktop-portal/docs/)
and exact backend metadata. For secret storage, distinguish the freedesktop.org
[Secret Service API](https://specifications.freedesktop.org/secret-service/latest/), an XDG Secret portal,
and Electron's exact-version `safeStorage` provider and selected backend. A keyring process, an unlocked
collection, a Secret Service session, a portal secret, and protected Electron storage are different facts.

Never infer one universal Linux sandbox or security profile. Flatpak permissions, Snap confinement and
interfaces, AppArmor profiles, SELinux policy and contexts, seccomp filters, and ordinary user or group
permissions can overlap without being interchangeable. Inspect the exact applied control through its current
owner, such as [Flatpak sandbox permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html),
[Snap confinement](https://snapcraft.io/docs/explanation/security/snap-confinement/),
[AppArmor profiles](https://apparmor.net/profiles/), or the Linux kernel
[seccomp documentation](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html).

#### Which nouns identify different Linux objects?

Use the mainstream developer noun that names the actual object. Do not collapse these terms into `platform`,
`package`, or `environment` when the distinction can change the answer.

| Noun | Meaning in this Manual |
|---|---|
| Distribution | A named Linux operating-system user-space release or image |
| Repository | A named source of package metadata and package bytes |
| Package | A versioned unit tracked by a named package manager or package system |
| Bundle | A named application distribution format that carries application files together |
| Container | An isolated user-space or application environment with its own identity and limits |
| Installer | A program or artifact that creates or changes an installed application state |
| Package manager | The named tool or service that owns package install, update, repair, or removal state |
| Desktop environment | The named desktop shell and integrated session components presented to the user |
| Display protocol | X11 or Wayland, the client-server protocol used by the application session |
| Display server | The process that implements the display protocol for clients |
| Compositor | The process that combines application windows and other rendered image buffers into the final image shown on a display. |
| Session | The exact login or user runtime instance that supplies environment and services |
| Portal | An XDG Desktop Portal interface and selected backend used to cross a containment boundary |
| Keyring | A named secret-storage implementation or collection available to a user session |
| Sandbox | A concrete isolation environment and its applied access limits |
| Confinement | The named package or runtime mode that selects isolation policy |
| Security profile | The exact applied access-control policy, profile, context, or filter |
| Kernel | The exact Linux kernel release running the observed system |
| C library | The exact userspace C library implementation and version used by the application |

#### What do missing fields do?

- An answer-changing `Unknown` field forces the exact result `Unknown for this compatibility tuple`.
- An unexplained omitted field or `Not applicable` value makes the lookup incomplete.
- A different distribution or release, repository, package, bundle, desktop environment, display protocol,
  display server, compositor, session, portal, keyring, sandbox, security profile, architecture, kernel,
  C library, Electron build, user, policy, or installed state is a new evidence subject.
- Evidence from one tuple may be cited as a competing claim or next lead. It may not establish another tuple.

### In what order is evidence collected?

Collect evidence in this exact order. Record the ordinal and evidence class with every source.

1. Exact-version official Linux distribution or project, or Electron, documentation, schema, source, or
   release notes.
2. Exact repository, package-manager, package, bundle or container, artifact, signature, and trust metadata.
3. A reproducible probe or observation on the exact compatibility tuple.
4. Exact project artifacts or logs.
5. Qualified secondary material only to state uncertainty or identify the next probe.

The order does not resolve a conflict by itself. Keep conflicting claims, narrow the supported bounds when the
evidence permits it, or return `Unknown for this compatibility tuple`. Missing, inaccessible, or insufficient
primary evidence stays an evidence gap; a broader article, nearby release, successful development run, or
secondary source cannot replace it.

The official lookup starting points below were checked on 2026-08-04. Re-open the applicable page during each
lookup and record its current version, update, or access date:

| Fact group | Current primary starting point | Required bound |
|---|---|---|
| Distribution release, support, repository, and package state | Exact distribution release, support, security, repository, and package-manager material; exact package metadata | Distribution, release or image, repository, package format, package manager, package version, architecture, support source, and metadata date |
| Flatpak, Snap, AppImage, other bundle, container, archive, or installer | Exact format documentation and exact artifact, repository, remote, store, or installed metadata | Format and tool version, application or package ID, version or revision, digest, scope, channel or branch, permissions or confinement, update owner, and installed state |
| Kernel and C library | [Linux kernel releases and documentation](https://www.kernel.org/), exact kernel release notes, [glibc](https://sourceware.org/glibc/), or [musl](https://musl.libc.org/) | Exact kernel release, C library implementation and version, architecture, and applicable interface or compatibility claim |
| Desktop, display, and session | Exact desktop-environment and display-server or compositor documentation; current Wayland or X.Org material | Desktop environment and version, X11 or Wayland, display server or compositor and version, login or user session kind, and session state |
| XDG identity, locations, portal, and secrets | [XDG Base Directory](https://specifications.freedesktop.org/basedir/latest/), [Desktop Entry](https://specifications.freedesktop.org/desktop-entry/latest/), [XDG Desktop Portal](https://flatpak.github.io/xdg-desktop-portal/docs/), and [Secret Service](https://specifications.freedesktop.org/secret-service/latest/) material | Exact specification or interface version, desktop entry or application ID, resolved path, portal and backend, permission, keyring or service, session, and result |
| Sandbox, confinement, and security profile | Exact format permissions and confinement metadata plus exact AppArmor, SELinux, seccomp, or other profile and diagnostic source | Exact applied sandbox, permissions, interfaces, policy, profile, context, filter, enforcement state, process identity, and rejection signal |
| Electron release and Linux behavior | [Electron Releases](https://releases.electronjs.org/), exact-version [Electron app documentation](https://www.electronjs.org/docs/latest/api/app), source, breaking changes, and release notes | Exact Electron build plus Chromium and Node.js versions when relevant, process, application state, Linux distribution path, and every answer-changing Linux condition |

### Where is each Linux fact looked up?

Use the row matching the question. These are lookup boundaries, not instructions to mutate a Linux system.

| Question group | Inspect | Interpretation limit |
|---|---|---|
| Target and compatibility inputs | Exact distribution release, build or image, support and repository sources; kernel and C library; desktop, display, session, architecture, Electron, application, package, and artifact metadata | A distribution lifecycle date, kernel status, Electron support line, or successful nearby variant does not itself create product support policy |
| Install and first launch | Exact distribution path, repository or format metadata, package or application ID, scope/location, dependency, signature/trust, confinement/profile, desktop entry, first-launch input, and first failure signal | Package, bundle, or file presence does not prove a usable first launch |
| Update, repair, rollback fact, uninstall, residual state, and recovery | Exact predecessor and candidate identities, update owner, repository/channel/branch metadata, package-manager or format documentation, data/native/protocol compatibility facts, logs, and residual packages, files, registrations, permissions, and credentials | This Manual states mechanism facts only; recovery, rollback, and release judgments route to `desktop-release` |
| Launch and activation input | Exact desktop entry, file, MIME type, protocol, notification, autostart, command line, or second-instance registration and input; application ID; package state; Electron version and event documentation | Input and registration facts do not choose create, reveal, focus, navigate, handle, no-op, or reject behavior |
| Process, window, background, close, and quit | Exact process, login or user session, desktop, display server or compositor, window visibility, package/application identity, Electron lifecycle documentation, and observed signal when available | A distribution convention or Electron event does not define the product's Normal quit or Abnormal termination outcome |
| Power and session lifetime | Exact kernel, login/session service, desktop or compositor signal, Electron event for the exact version, timestamps, logs, and before/after process state | Never generalize this result into a universal suspend/resume state |
| Native integration | Exact distribution, desktop, display, portal, package, and Electron documentation for the named integration; identity, registration, permission/policy/trust prerequisite, return value, event, state, and accessible-alternative fact | A non-throwing call does not prove the native effect occurred |
| Data, configuration, cache, state, runtime, log, temporary, document, package, resource, and credential-store location | Resolved Electron path, XDG source, package or sandbox mapping, exact user/session, portal or keyring context, and observed path when available | A documented default does not prove a redirected, sandboxed, containerized, package-controlled, or user-selected location |
| Repository, package, artifact, signing, portal, keyring, sandbox, confinement, permission, security-profile, identity, privilege, and policy state | Exact repository/package signature and trust metadata, package or application ID, portal backend/interface/permission, keyring/session/backend, applied sandbox permissions or interfaces, security profile/policy, user, and rejection signal | Signed, repository-trusted, installed, permitted, confined, sandboxed, protected, and product-approved are separate facts |
| Failure diagnosis | Exact error code or message, event, timestamp, process/package/application identity, distribution and session state, surrounding log, and the same tuple's documented failure conditions | One failed attempt may show a defect or environment gap; it does not by itself prove `Not supported` |

For location facts, compare Electron's current
[`app.getPath`](https://www.electronjs.org/docs/latest/api/app#appgetpathname) contract with the current
[XDG Base Directory specification](https://specifications.freedesktop.org/basedir/latest/), the exact package
or sandbox mapping, and observed paths. Flatpak, Snap, AppImage, distribution packages, containers, environment
overrides, portals, and application code can resolve different locations; none supplies a universal Linux
default for every tuple.

For activation facts, compare the exact
[Desktop Entry specification](https://specifications.freedesktop.org/desktop-entry/latest/) registration with
Electron's exact-version [deep-link guidance](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app)
and application behavior. Electron currently documents packaged-application requirements for Linux protocol
handling, but only the pinned Electron version, exact desktop entry, package state, session, and observation
bound the result.

For portal facts, record the portal service version, selected backend, exact interface version, permission
state, request result, and desktop/session context. Current portal configuration can select different backends
per desktop and interface; consult [`portals.conf`](https://flatpak.github.io/xdg-desktop-portal/docs/portals.conf.html)
instead of inferring the backend from the desktop name.

For keyring facts, compare the exact Secret Service or portal state with Electron's exact-version
[`safeStorage`](https://www.electronjs.org/docs/latest/api/safe-storage) documentation and selected provider or
backend. For its synchronous API, Electron currently documents unprotected storage when no secret store is
available and identifies `basic_text` as that backend. The exact Electron version, API, desktop, user session,
keyring availability, lock state, sandbox, and observed backend remain part of the tuple.

For update facts, first identify the owner: the distribution package manager, Flatpak remote, Snap channel,
AppImage update metadata or tool, another named installer, or application code. Electron's current
[`autoUpdater`](https://www.electronjs.org/docs/latest/api/auto-updater/) documentation states that its built-in
module does not support Linux; recheck the pinned Electron version and the exact distribution path before
reporting that fact, and route any update or release choice to its named owners.

For native integration, preserve the exact desktop and session limit. Current Electron documentation describes
Linux-specific behavior for [Tray](https://www.electronjs.org/docs/latest/api/tray/),
[notifications](https://www.electronjs.org/docs/latest/tutorial/notifications), and
[`powerMonitor`](https://www.electronjs.org/docs/latest/api/power-monitor/). Those pages identify Electron
mechanisms and possible conditions; they do not prove that a tray, notification, shutdown signal, suspend,
resume, close, quit, or recovery occurred in the exact installed tuple.

For kernel and C library facts, record both implementations and versions with the application and package
architecture. A newer kernel cannot substitute for a different distribution user space, and glibc evidence
cannot prove musl behavior or the reverse. When the exact primary documentation or binary evidence is
unavailable, keep that item missing and return an unknown if it can change the answer.

### What does one result contain?

Return every field below, even when the outcome is unknown.

| Result field | Required content |
|---|---|
| Compatibility tuple | All common fields, Linux-specific fields, and each field state |
| Evidence | Sources, versions or release bounds, dates, evidence classes, collection ordinals, and exact observations that actually occurred |
| Outcome | Exactly one of `Supported`, `Not supported`, or `Unknown for this compatibility tuple` |
| Behavior and bounds | The exact fact established and every application, artifact, distribution, repository, package, bundle, desktop, display, session, portal, keyring, sandbox, security, architecture, kernel, C library, Electron, user, policy, trust, and installed-state bound |
| Diagnostic signals | Relevant success, failure, rejection, absence, error, event, log, and state signals |
| Next diagnostic probe | The smallest exact check that could resolve the remaining question, including required authority and owner |
| Limits and conflicts | Missing, inaccessible, or insufficient evidence, competing claims, stale sources, unobserved behavior, and narrower established bounds |
| Owner routes | Every adjacent judgment, coordination, Electron fact, implementation, evidence, release-mechanism, or security-policy owner |
| Freshness | Access or observation date and the exact distribution, release, image, repository, package, bundle, desktop, display, session, portal, keyring, sandbox, security profile, architecture, kernel, C library, Electron, user, policy, or installed-state change that requires refresh |
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
| Repository, package-manager, installer, bundle, container, updater, repair, or uninstall rejection | Distribution path, package/application identity, installed version, scope/location, architecture, update owner, dependency, signature/trust, policy, confinement, in-use state, exact error, transaction, and log | Mechanism to `electron-release`; judgment to `desktop-release`; coordination to `desktop-development` |
| Launch or activation input missing, duplicated, or sent to the wrong instance | Desktop entry and registration, application ID, original input, package state, process/instance/session state, Electron version/event, and desktop or distribution failure signal | Product outcome to `desktop-architecture`; mechanism fact to `electron-runtime`; implementation and evidence to their named Electron owners |
| Window, menu, tray, notification, shortcut, file, protocol, dialog, clipboard, or shell effect absent | Desktop environment, display protocol/server/compositor, portal/backend/interface, package/application identity, permission/policy/trust prerequisite, documented return/event/state, session, and accessible-alternative fact | Product and interface choices to `desktop-architecture` and `desktop-interface` |
| Suspend, resume, shutdown, idle, lock, login-session, or display-session observation differs | Exact kernel and system/session signal, Electron event, desktop/display/session kind, timestamps, logs, process state, and unobserved transitions | Electron semantics to `electron-runtime`; product recovery and state outcome to `desktop-architecture` |
| Data, cache, state, runtime, log, package resource, portal document, keyring, or credential-protection location differs | Resolved Electron and XDG paths, package/sandbox mapping, portal and keyring state, user/session, environment override, policy, and exact observed location | Sensitive-data policy to `web-security`; implementation and evidence to their named owners |
| Crash, process, resource, native, repository, package, signature, portal, keyring, sandbox, confinement, security-profile, architecture, kernel, C-library, Electron, or session failure | Exact error/event/log, process type, artifact/package/application identity, complete Linux tuple, and earliest divergent prerequisite | Diagnostics stay here; Electron mechanism, implementation, evidence, and release procedure route separately |

Exact package-manager transaction records, Flatpak or Snap diagnostics, AppImage runtime output, desktop and
portal logs, kernel/security audit records, and Electron's exact-version
[`crashReporter`](https://www.electronjs.org/docs/latest/api/crash-reporter) documentation can classify the
signal. These sources do not prove that a probe ran, that the application recovered, or that another Linux
variant behaves the same way.

### When is a result stale?

A result needs refresh when any answer-changing tuple field changes, a cited source or metadata record
changes, the applicable distribution, repository, package, bundle, desktop, display, portal, keyring, sandbox,
security profile, kernel, C library, or Electron release changes, a user, policy, trust, permission, or
installed state changes, a conflict appears, or the recorded refresh condition occurs. If current evidence is
required and refresh cannot be completed, return `Unknown for this compatibility tuple`.

A source read, repository check, package or bundle inspection, or artifact review records only that evidence
class. State `Exact-tuple probe not run` when no application, installer, package manager, updater, uninstaller,
runtime transition, native integration, or Linux behavior was actually observed.

## References

- [Evaluation checklist](checklists.md) is the reusable unchecked source for work governed by this skill.

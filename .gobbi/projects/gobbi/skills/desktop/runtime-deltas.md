# Desktop — Runtime Deltas

Own the per-OS delta matrix and be the single home for every version-sensitive value in this family. Policy
lives in [`SKILL.md`](SKILL.md); this child owns the mechanics.

Two jobs, kept separate. The **version baseline** is the sole owner of every version literal in this family:
no sibling restates one, and every sibling stating a version-dependent property points here. The **delta
matrices** record where one operating system behaves differently from another, so a sibling can state an
obligation once and name the platform that changes it.

Read this before writing any statement whose truth can expire.

## The version baseline block

Every value here is owned here. A sibling needing one states the property and points at this section rather
than copying the literal.

**Verified against the platform's own release feed and release-timeline documentation on 2026-07-25.** The
claim-to-source register with retrieval identifiers is kept with the design record, not reproduced here.

| Value class | Current value |
|---|---|
| Platform version | Electron **43.2.0**, released 2026-07-22 |
| Bundled browser engine | Chromium **150.0.7871.129** |
| Bundled runtime | Node **24.18.0** |
| Supported major set | **41, 42, 43** — the latest three stable majors |
| Release cadence | **Eight weeks**, measured major to major, four weeks alpha and four weeks beta |
| 32-bit and older-ARM end of life | The **43.x** series is the last shipping prebuilt binaries for 32-bit Windows and older 32-bit ARM Linux. Support ends **January 2027** |
| Platform-certificate policy date | The platform **states that** Microsoft has required extended-validation signing for Windows software **since June 2023** |
| Archive-integrity minimums | macOS from **16.0.0**; Windows from **30.0.0**; **no Linux support** |

**On the certificate-policy row.** It is written as what the platform *states*, not as a vendor fact, because
the evidence on hand is the platform's report of another vendor's policy rather than that vendor's own
document. Any sibling restating it keeps that attribution. Upgrading it to a direct claim requires reading the
vendor's own source first.

## Per-OS delta matrix

A sibling states its obligation once and points here for the divergence. Each row is a place where an
obligation written for one system is wrong on another.

### Release and update

| Concern | macOS | Windows | Linux |
|---|---|---|---|
| Built-in update mechanism | Yes | Yes | **None.** Updates go through the system package manager |
| Signing required for updates | **Yes** — updates do not function unsigned | Yes | Not applicable |
| Archive-integrity validation | From 16.0.0 | From 30.0.0 | **Unsupported** |
| Signing model | Developer-program identity, then notarization — **two steps, both required** | Extended-validation certificate on hardware meeting the stated security level | No platform signing story |

The Linux column is the one that surprises teams. A run claiming three-platform automatic updating is claiming
something the platform does not provide, and the direct-evidence floor's per-target requirement will expose it.

### Interaction and lifecycle

| Concern | macOS | Windows | Linux |
|---|---|---|---|
| Closing every surface | Application keeps running | Application exits | Application exits |
| Deep-link delivery | A dedicated open-URL event | Through the single-instance lock and its second-instance event | As Windows |
| Deep links before packaging | **Do not work** — testing unpackaged gives a false negative | Work | Work |
| Global accelerators | Known failure on non-QWERTY keyboard layouts | No equivalent limitation recorded | No equivalent limitation recorded |
| Notification prerequisites | Signing required; body text truncated beyond a documented byte limit | A start-menu shortcut carrying an application identity and its activator identifier | A desktop notification service |

### Assistive technology

| System | Screen reader named in the platform's own documentation |
|---|---|
| Windows | JAWS |
| macOS | VoiceOver |
| Linux | **None named — a documented gap, not an omission here** |

The Linux row is stated rather than quietly dropped. A run claiming Linux accessibility support cannot lean on
platform documentation for it and must say what evidence it has instead. The accessibility floor is
non-waivable and does not soften because the platform's guidance is thin.

### Surface-state restoration

The platform provides **no built-in mechanism** for saving and restoring surface position and size. This is a
conformance gap rather than a convenience gap: the design guidance for at least two systems assumes a surface
reopens where the person left it. Closing it means either a third-party dependency — a user decision, never a
default — or an implementation the run owns. The run states which, because a surface that forgets its position
reads as broken regardless of what the platform supplies.

## Per-feature availability

Each row gives the version from which the behaviour holds. A rule depending on one names it in the same
sentence, so a statement that goes stale identifies itself rather than failing silently.

| Behaviour | Holds from |
|---|---|
| Renderer runtime integration off by default | 5.0.0 |
| Context isolation on by default | 12.0.0 |
| Renderer sandbox on by default | 20.0.0 |
| Module syntax support in the main process | 28.0.0 |
| Direct renderer-to-renderer messaging removed | 28.0.0 |
| Whole message-port module across the bridge yields an empty object | 29.0.0 |
| File-path property removed from dropped files | 32.0.0 |
| Clipboard access from the renderer deprecated | 40.0.0 |
| Dialog default path resolves to the downloads directory | 41.0.0 |
| Clipboard access from the renderer unavailable | 43.0.0 |
| Main process boots from an embedded startup snapshot | 43.0.0 |
| Framework bundles and preload scripts cached as compiled bytecode | 43.0.0 |

**A startup measurement is meaningless without its platform version.** The 43.0.0 rows changed the startup
baseline, so any performance number a run records names the version it was measured on.

## The re-verify trigger

**The trigger is an event: the next platform major release.** It is deliberately not a date.

The cadence measures major-to-major intervals, and the newest release recorded here is a **patch**. A patch
date plus a major-to-major interval does not yield the next major's date, so no such date is derivable from
the evidence on hand and none is stated. A predicted date would read as a fact and would be wrong in a way a
reader could not detect.

When the next major ships, re-verify in this order:

1. The platform, browser-engine and runtime versions in the baseline table.
2. The supported-major set — its oldest member changes on every release.
3. Every per-feature availability row, since a behaviour can change in the same release.
4. The end-of-life row, which fixes a date and so expires by calendar rather than by release.
5. Every sibling statement naming a version — the naming rule is what makes them findable.

**Falling outside the supported-major set is a security failure, not a maintenance preference.** Three majors
are supported at a time and browser-engine vulnerabilities reach this platform through its engine updates
continuously. A run that cannot sustain that cadence should have taken the stack-fit decision differently, and
the wrong-choice criteria in [`SKILL.md`](SKILL.md) say so.

## What this document does not own

The obligations that *use* these values live with their subjects: the privilege boundary and its message
contract, the security posture and its build-time hardening, surface lifecycle and native integration, local
data and migration, packaging, and the release chain. Each states its obligation and points here for the value.

This document states values and divergences. It states no rule.

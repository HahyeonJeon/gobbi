---
name: electron-contract
description: "MUST load when defining or reviewing observable installed Electron behavior across targets, entry modes, windows, application lifecycle, operating-system integration, local data, installation, updates, and recovery."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Electron Contract

Use this preference skill to define or review one installed Electron application contract. It covers
target-specific installation, launch and alternate entry, windows, local data, application lifecycle,
operating-system integration, update restart, failure, uninstall, recovery, and support.

The contract is an observable state machine for affected users, operators, and support staff. Each promise is
associated with an exact target operating system and architecture, application identity, installed artifact
identity, starting state, trigger, result, the state change the application or operating system accepts as
final, preservation behavior, failure, recovery, diagnostics requirement, and evidence required to establish
the observable result.

This skill owns installed behavior judgments only. Interface owns observable interface judgment,
[`electron-design`](../electron-design/SKILL.md) owns technical architecture, and Runtime supplies current
mechanism facts. Rules define the valid
choice space and override every conflicting Preference.

## Principles

### Installed claims are target and artifact specific

Source behavior or success on another target does not establish an installed promise. A contract is credible
only for the named application, artifact, operating system, architecture, and entry state.

### A transition is an observable promise

An event or API call is not a user outcome. Define the state change the application or operating system
accepts as final, what remains visible, what is preserved, and where failure leaves the application.

### Windows, local data, and application lifetime remain distinct

Closing a window need not quit the application, and quitting need not discard accepted input or owned data.
State each relationship instead of deriving one from another.

### Safe recovery preserves accepted input and usable state

When recovery is safe, preserve accepted user input and return the application to a usable state. Safety and
data compatibility limit continuity rather than silently weakening it.

## Rules

- **MUST define the affected actors, decision authority, target operating system and architecture,
  application identity, installed artifact identity, and supported or unsupported availability.** Qualify
  every difference by the exact target it affects.

- **MUST give every retained transition a complete observable record.** State the trigger, starting state,
  observable result, state change the application or operating system accepts as final, preserved input and
  data, cancellation, timeout, retry limit, how the failure is shown, diagnostics requirement, recovery, support
  path, and evidence required to establish the observable result.

- **MUST cover every applicable installed state and transition.** Include installation, cold start,
  initialization, ready and active window states, supported background operation, suspend and resume,
  ordinary quit and relaunch, operating-system shutdown, update restart, renderer hang and crash,
  utility or child failure, main-process exit, uninstall, and recovery; state unsupported transitions.

- **MUST define cold-start deep-link, running-application deep-link, cold-start file-open, and
  running-application file-open entry as four separate paths.** Each path states target availability, start
  state, validation and delivery, correct instance and window, success and failure, preservation, recovery,
  diagnostics, and evidence required to establish the observable result.

- **MUST keep this skill inside installed observable promises and judgments.** Leave API and mechanism
  selection, technical architecture, source implementation, test design or execution, evidence creation or
  interpretation, environment classification, evidence acceptance, diagnostic
  emission, artifact construction, release, and delivery coordination outside.

- **NEVER permit a safe-recovery departure unless security, incompatible data, or unsupported target behavior
  makes recovery unsafe or impossible.** A departure refuses or stops visibly, preserves data when safe,
  provides recovery or support, and never overrides a Rule or accepted product, accessibility, security, or
  user-authority limit.

## Preferences

### Prefer a complete target record

**PREFER** one explicit record for each claimed operating-system and architecture combination. Reuse a
promise across targets only when current [`electron-runtime`](../electron-runtime/SKILL.md) facts and accepted
evidence from the installed application establish the same availability and result.

Record application identity separately from installed artifact identity. Application identity names the
product and stable installed identity. Artifact identity names the installed version and build plus the
owner-supplied artifact checksum or another exact owner-supplied artifact identifier. Also name the affected
users, operators, and support staff, the decision authority, installation scope, supported entry modes,
operating-system integrations, local data categories, supported versions, and the support end date or end
condition.

Use the following fields for every retained transition:

| Record part | Required decision |
|---|---|
| Target identity | Target operating system and architecture; application and installed artifact identity |
| Entry | Affected actor; starting state; trigger; availability on this target |
| Outcome | Observable result; state change the application or operating system accepts as final; resulting application, window, and data state |
| Continuity | Accepted input and current data preserved or changed; cancellation behavior |
| Limits | Timeout and finite retry limit, including what becomes visible when either limit is reached |
| Failure | How the failure is shown; diagnostics required for support without selecting their emission mechanism |
| Recovery | Next safe state; recovery action; support path; evidence required to establish the observable result |

Use current official Electron documentation to qualify mechanism constraints without turning them into
product policy. The [`app` lifecycle](https://www.electronjs.org/docs/latest/api/app),
[deep-link guide](https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app),
[`powerMonitor`](https://www.electronjs.org/docs/latest/api/power-monitor),
[`webContents`](https://www.electronjs.org/docs/latest/api/web-contents),
[`crashReporter`](https://www.electronjs.org/docs/latest/api/crash-reporter), and
[`autoUpdater`](https://www.electronjs.org/docs/latest/api/auto-updater/) currently document distinct target
and lifecycle limits. The project's pinned Electron major and target facts remain controlling.

### Prefer an explicit installed state map

**PREFER** the smallest state map that retains every applicable transition below. Combine states only when
they have the same affected actors, accepted input and data behavior, observable result, failure, and
recovery on the named target.

| Transition | Observable contract decision |
|---|---|
| Not installed → installing → installed | Artifact and target acceptance, progress, cancellation, partial-install cleanup, operating-system integration result, and visible install failure |
| Installed → first launch or cold start → initializing → ready | First-run work, pending presentation, launch limit, local-data creation or import, ready result, and launch recovery |
| Ready → active with windows ↔ active without windows ↔ supported background or tray-only | Window creation and restoration, last-window close behavior, user discoverability, background capability, and the difference between close and quit |
| Installed or stopped → alternate entry | Each of the four concrete external-entry paths below plus any other supported path, with unsupported paths stated |
| Ready or active → second instance or other alternate entry | Accepted instance policy, input routing, correct current or created window, duplicate-effect prevention, and visible refusal |
| Active → suspended → resuming | Work that pauses, safely retained state, resources that require revalidation, reduced-mode or recovery result, and visible resume failure |
| Active → ordinary quit → stopped → relaunch | Quit intent, cancellation, pending input and data behavior, complete stop, next-launch restoration, and close-versus-quit distinction |
| Active → operating-system shutdown | Bounded safe persistence, target-supported delay or immediate stop, detectably incomplete work, and next-launch recovery |
| Active → update restart → migration and validation → ready, refusal, or recovery | User authority, accepted input preservation, local-data compatibility, migration result, restart result, validation, and visible recovery |
| Renderer running → unresponsive → responsive, renderer replacement, or application recovery | Actions that could lose or overwrite data remain paused, current-data treatment, bounded wait, chosen visible outcome, and support |
| Renderer running → renderer crash | Affected-window state, persisted data preservation, renderer replacement, safe-state restore, relaunch, or visible stop |
| Utility or child running → failure | Affected capability, contained effect, bounded restart, reduced mode, relaunch, or visible stop |
| Main running → main-process exit → external crash capture | Externally observable stop, available crash record, relaunch, state validation, recovery, and support |
| Installed → uninstalling → uninstalled | Application and integration removal, cancellation limit, retained or removed local data categories, export or recovery option, and visible completion or failure |

Closing the last window, hiding windows, entering a supported background or tray-only state, and quitting the
application are separate decisions. **PREFER** the familiar operating-system convention selected by
[`electron-interface`](../electron-interface/SKILL.md) when it stays inside this installed contract; record an
explicit target difference when the accepted behavior differs.

### Prefer four complete external-entry paths

**PREFER** an independent transition record for each path. An `alternate entry`, `deep link`, `file open`, or
`second instance` umbrella cannot substitute for a concrete path.

| Path | Start and target availability | Validation, delivery, and observable outcome |
|---|---|---|
| Cold-start deep-link entry | Installed and not running; protocol registration and cold-launch availability for the exact target | Capture before readiness, validate the URL and authority, deliver after the receiver is ready, use the accepted instance and window, then show the destination or visible refusal |
| Running-application deep-link entry | Application running; running deep-link delivery support and current application state | Validate before side effects, deliver once to the correct existing instance and current or created window, preserve current work, then show the destination or visible failure |
| Cold-start file-open entry | Installed and not running; file association and cold open-event availability for the exact target | Capture before readiness, validate the file reference, type, access, and accepted file contract, deliver after readiness, then open it or refuse visibly |
| Running-application file-open entry | Application running; running file-open support and current application state | Validate before side effects, deliver once to the correct existing instance and current or created window, preserve current work, then open it or show visible failure |

For each path, preserve accepted external input until delivery, cancellation, or safe recovery. Preserve
current data when safe; state timeouts and retry limits; make duplicate or rejected delivery visible; provide
recovery or support; and require path-specific diagnostics and installed observations.

### Prefer explicit local-data compatibility

**PREFER** preserving accepted input and compatible local data across close, quit, relaunch, suspend, process
replacement, and update restart. State which data the application accepts as its final value and which data
is temporary, user-created, imported, cached, recoverable, retained after uninstall, or intentionally removed.

For installation, update, relaunch, crash recovery, and uninstall, state the data version and compatibility
decision, migration or validation result, incomplete-write treatment, and user-visible recovery. Do not
describe incompatible data as restored merely because bytes remain present.

### Prefer safe recovery when continuity is possible

This Preference applies to a recoverable lifecycle interruption when accepted user input or a usable state
can be preserved safely. **PREFER** preserving the accepted input and restoring a usable state.

A departure is allowed only when security, incompatible data, or unsupported target behavior makes recovery
unsafe or impossible. Record the exact condition, the affected input and data, the visible refusal or stop,
the data preserved when safe, and the recovery or support path.

Convenience, implementation cost, visual novelty, personal taste, or untested preference is not departure
evidence. A Rule or accepted product, accessibility, security, or user-authority limit always wins.

| Judgment case | Resolution |
|---|---|
| Ordinary recoverable interruption | Preserve accepted input and restore a usable state |
| Security makes restoration unsafe | Refuse the unsafe state visibly, preserve safe data, and provide recovery or support |
| Incompatible data makes restoration unsafe or impossible | Keep the incompatibility visible, preserve data when safe, and provide migration, export, recovery, or support |
| Operating-system or architecture behavior cannot support safe restoration | State the unsupported behavior, stop or reduce operation visibly, preserve safe data, and provide a supported recovery or support path |
| Rule or accepted-authority conflict | Apply the stronger limit and revise or reject the conflicting recovery choice |
| Convenience-only or cosmetic departure | Reject the departure and retain the safe-recovery default |

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.

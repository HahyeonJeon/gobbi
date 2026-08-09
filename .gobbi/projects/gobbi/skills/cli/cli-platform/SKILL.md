---
name: cli-platform
description: "MUST load when looking up or diagnosing current command-line execution-platform facts about terminals, standard streams, process lifecycle, pipes, signals, shell entry, path resolution, encoding, locale, or operating-system differences for a line-oriented CLI."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# CLI Platform

CLI Platform is the lookup Manual for one current fact about the line-oriented command execution platform.
It binds the question to an exact command, runtime, operating-system, entry, stream, terminal, process, and
locale tuple, then returns `Available`, `Unavailable`, or `Unknown` with dated evidence and limits.

The Manual owns facts about terminals, standard streams, processes, pipes, signals, shell entry, path
resolution, encoding, locale, and operating-system command differences. It chooses no product behavior,
interface, security control, target policy, package mechanism, delivery method, or external action.

## Principles

### One exact tuple bounds one fact

A similar command, runtime, stream, terminal, shell, or operating-system variant is a different evidence
subject when the changed field can alter the answer.

### Evidence layers remain distinct

An official contract, runtime reference, direct observation, and project record establish different facts.
None may be described as another layer or used to hide a conflict.

### Each stream and process state stands alone

stdin, stdout, and stderr can have different destinations and terminal states. Process entry, lifetime,
signals, pipes, and exit observations also remain separate until exact evidence joins them.

### Unknown is a complete honest result

Missing, stale, inaccessible, conflicting, or unobserved answer-changing evidence produces `Unknown`. A
nearby target, convention, or likelihood never fills the gap.

## Rules

- **MUST bind every lookup to the complete applicable tuple before returning a fact.** Record each field as
  exact, `Unknown`, or `Not applicable: <exact reason>`.
- **MUST use only `Available`, `Unavailable`, or `Unknown` as the fact disposition.** Keep product target and
  release judgments outside this Manual.
- **MUST cite current primary owners for version-sensitive claims and record every source and observation
  date, evidence class, bound, limit, and refresh trigger.** A changed answer-changing field starts a new
  evidence subject.
- **MUST keep documentation, API shape, metadata, and exact-tuple observation visibly separate.** Preserve
  conflicts and return narrower bounds or `Unknown` when they remain answer-changing.
- **MUST make the smallest unresolved fact and its required authority explicit.** A diagnostic lookup never
  mutates a machine, terminal, artifact, package, account, credential, or external system without separate
  authority.
- **NEVER turn a platform fact into product behavior, interface preference, security policy, implementation,
  test evidence, package behavior, delivery evidence, or release action.** Route each adjacent result to its
  named owner.

## Manual

### What belongs in this Manual?

Use this Manual when a current terminal, stream, process, pipe, signal, shell, path, encoding, locale, or
operating-system fact can answer or narrow one CLI question. Use the adjacent owner when the desired result
is a decision, implementation, proof, artifact, or action.

| Desired result | Platform contribution | Owning route |
|---|---|---|
| Current fact or bounded failure diagnosis for the exact execution tuple | One dated fact result | Keep here |
| Command semantics, stream roles, exit contract, compatibility, deprecation, or retirement | Fact input only | [`cli-architecture`](../cli-architecture/SKILL.md) |
| Help, terminal wording, rendering, prompts, progress, visualization, accessibility, localization, or adaptation | Fact input only | [`cli-interface`](../cli-interface/SKILL.md) |
| Trust, permission, terminal-control, path, process, shell, network, or destructive-effect control | Fact input only | [`cli-security`](../cli-security/SKILL.md) |
| Multi-owner lifecycle coordination | Fact record only | [`cli-development`](../cli-development/SKILL.md) |
| Runtime, target, delivery, readiness, recovery, deprecation, or retirement judgment | Fact record only | [`cli-release`](../cli-release/SKILL.md) |
| Bun compilation, type stripping, module loading, executable compilation, or named-runtime mechanism | No mechanism conclusion | [`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md) |
| Command implementation | No implementation | [`typescript-development`](../../typescript/typescript-development/SKILL.md) |
| Process-boundary behavior evidence | No test result | [`typescript-testing`](../../typescript/typescript-testing/SKILL.md) |
| Package-backed command metadata or archive behavior | No package result | [`typescript-packaging`](../../typescript/typescript-packaging/SKILL.md) |
| Standalone executable, direct script, workspace command, or other direct non-archive delivery | No delivery result | [`typescript-cli-delivery`](../../typescript/typescript-cli-delivery/SKILL.md) |

This subject is not a general operating-system, terminal-emulator, shell, package-manager, Bun, or Node.js
Manual. Full-screen terminal interfaces and automatic paging remain outside the CLI family's line-oriented
scope.

### What identifies one fact tuple?

Record every field that can change the asked fact. `Not applicable` needs an exact reason showing why that
field cannot alter this answer.

| Tuple group | Required record |
|---|---|
| Question | Exact capability, behavior, failure signal, destination, transition, or limit being asked about |
| CLI and delivery identity | Command name; source, package, archive, executable, script, or revision identity; version or digest; consumer invocation when relevant |
| Runtime | Exact Bun version and build; exact other named runtime version and build only when that runtime is part of the question |
| Operating system | OS family, edition or distribution, exact release and build, kernel when relevant, and container or compatibility layer |
| Machine | Process and OS architectures, C library and version on applicable Unix targets, CPU baseline or translation layer when answer-changing |
| Entry | Direct process, shell, script, package command, executable, workspace, service, or other exact entry; resolved executable identity; argument vector or command-line boundary |
| Shell and paths | Shell name/version when present, search rules, PATH, current directory, path form, symlink or alias state when fact-relevant |
| Streams and terminal | stdin/stdout/stderr destination separately; TTY, console, PTY, file, pipe, socket, or capture state; terminal/console host and version; dimensions and modes when relevant |
| Process state | Parent and child relationship, process group/session, foreground/background, worker or main process, signal/control-event setup, inherited descriptors or handles, and lifecycle state |
| Pipe and I/O | Producer/consumer identities, buffering layer, backpressure state, closure/cancellation state, encoding, flush/drain observation, and relevant exact limits |
| Locale and text | Byte encoding, decoder/encoder, `LANG`, `LC_ALL`, applicable category values, active locale and locale data, console code pages, and line-ending convention when relevant |
| Execution context | Interactive, redirected, piped, CI, service, scheduled, remote, containerized, or other session; environment and runtime-control inputs that can alter the fact |
| Authority and trust | User/privilege, permissions, sandbox or policy, source trust, and exact authority for any proposed observation |
| Time | Official source version/date when stated, access date, observation date/time, and the event that requires refresh |

An omitted answer-changing field makes the tuple incomplete. Changing one such field creates a new fact
subject; previous evidence may remain a lead or competing claim but cannot establish the new tuple.

### Which evidence can establish the fact?

Use the strongest applicable current source and retain its evidence class. Collection order helps find facts;
it does not resolve a disagreement automatically.

1. Current official standard, operating-system, terminal, shell, Bun, Node.js, or other runtime documentation,
   schema, API reference, source, or release note for the exact version or bound.
2. Exact command, artifact, entry, environment, configuration, descriptor/handle, and process metadata.
3. An authorized reproducible observation on the exact tuple, including the expected failure when it is safe
   and necessary to distinguish availability from an unobserved case.
4. Exact project logs or artifacts tied to that tuple.
5. Qualified secondary material only to identify uncertainty or the next primary source or probe.

For Bun process and PTY questions, begin with the current official
[`Bun.spawn` Manual](https://bun.com/docs/runtime/child-process),
[`Bun.spawn` API reference](https://bun.com/reference/bun/spawn), and
[Node.js compatibility register](https://bun.com/docs/runtime/nodejs-compat). The compatibility register is a
moving broad statement. It does not establish a CLI result or a named Node execution path.

For a named Node process surface, use the exact-version [Process](https://nodejs.org/api/process.html) and
[TTY](https://nodejs.org/api/tty.html) references, then bind any Bun use to Bun's separate evidence. Current
Node documentation notes that process I/O behavior depends on whether a stream reaches a terminal, pipe, or
file; a destination label alone still does not establish the exact runtime observation.

For POSIX shell, command, environment, spawn, and path questions, use the applicable POSIX.1 edition, such as
the [Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html),
[`command`](https://pubs.opengroup.org/onlinepubs/9799919799.2024edition/utilities/command.html),
[internationalization variables](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap08.html),
and [`posix_spawn`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/posix_spawn.html). These sources
do not define PowerShell, `cmd.exe`, Win32 direct process creation, or shell extensions.

For Windows, start with the exact current Microsoft owner for
[`CreateProcessW`](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw),
[process creation](https://learn.microsoft.com/en-us/windows/win32/procthread/creating-processes),
[virtual-terminal sequences](https://learn.microsoft.com/en-us/windows/console/console-virtual-terminal-sequences),
and [console code pages](https://learn.microsoft.com/en-us/windows/console/console-code-pages). Win32 API
contracts do not prove which options a runtime or wrapper selected.

Every observation record names its command or method, permission, side effect, date, exact output or state,
and whether the expected failure was actually exercised. State `Exact-tuple observation not run` when the
evidence is documentary or static.

### Where is each platform fact looked up?

| Question group | Inspect for the exact tuple | Interpretation limit |
|---|---|---|
| Standard streams and TTY | Each of stdin, stdout, and stderr; descriptor/handle; destination; TTY/console/PTY state; terminal host; dimensions; mode; parent capture/redirection | One stream never proves another. TTY state does not establish color, width, VT behavior, Unicode display, assistive technology, or prompt safety. |
| Process entry and identity | Consumer invocation, resolved executable, runtime/build, argument vector or command line, shell/direct boundary, parent, current directory, environment, descriptor/handle inheritance | A same-name command, source entry, shebang, or PATH result does not prove the intended consumer entry without identity evidence. |
| Process lifecycle and exit | Event-loop/resources, parent/child state, process group/session, foreground state, normal exit, runtime exit request, forced termination, cleanup, observed exit code, and retained output/state | An exit callback, signal API, or zero status does not prove required output drained, cleanup ran, or a product result completed. |
| Pipes and backpressure | Shell/runtime pipe construction, producer and consumer, buffer and atomicity owner, readable/writable state, write result, drain/backpressure, downstream close, error/signal, flush, and cancellation | Pipe atomicity, capacity, JavaScript stream backpressure, broken-pipe behavior, and flush-on-exit are separate facts. |
| Signals and control events | Exact signal or Windows control event, OS, runtime, main/worker context, handler, process group/session, console/PTY, entry route, delivery observation, default action, cleanup, and exit state | POSIX signals, terminal-generated signals, runtime events, and Windows console controls are not interchangeable. A send API does not prove delivery or effect. |
| Shell entry and pipelines | Exact shell/version, parse mode, quoting/expansion, redirection, pipeline, command search, built-in/function/alias state, environment, current directory, and per-command status | A direct spawn with argument strings is not a shell parse. One shell's grammar or pipeline result does not establish another's. |
| Executable and data paths | Path spelling and kind, absolute/relative base, working directory, PATH and search order, executable extension rules, symlinks/links/aliases, normalization, case behavior, permissions, and resolved object | A displayed or normalized path does not prove executable identity, safe authority, or another OS's resolution. |
| Encoding and locale | Raw bytes, stream or console boundary, encoder/decoder, error policy, locale variables, active locale, locale data, console input/output code pages, line endings, and terminal rendering | UTF-8 encoding does not establish glyph availability, display width, locale formatting, or round-trip behavior through every console and pipe. |
| Operating-system difference | Exact OS release/build, architecture/C library, terminal or console stack, process API, path model, signal/control model, entry route, and documented plus observed difference | A broad Unix, Linux, macOS, or Windows label is not a fact result. Preserve the narrowest established bound. |

### How are `Available`, `Unavailable`, and `Unknown` chosen?

Return `Available` only when current direct evidence establishes the asked capability or behavior for the
complete tuple and no answer-changing conflict remains. State the exact prerequisite, state, output, side
effect, and limit that the evidence establishes.

Return `Unavailable` only when current authoritative material or an exact-tuple rejection establishes absence
for the bounded question. A failed attempt, missing prerequisite, permission denial, wrong executable,
misconfiguration, closed pipe, detached terminal, runtime defect, or unobserved target is not enough unless
the question asks about that exact failure state.

Return `Unknown` when a tuple field, primary source, version match, observation, permission, conflict
resolution, or failure distinction can change the answer. Preserve the competing claims, narrower known
bounds, smallest next fact, its required authority and owner, and the exact resume condition.

### How is unexpected behavior diagnosed?

Preserve the first exact signal before proposing the smallest non-mutating discriminator.

| Observed signal | Compare inside the same tuple | Common fact gap |
|---|---|---|
| Rich output, prompt, or dimensions differ after redirection | stdout and stderr separately; TTY/PTY state; terminal host/mode; explicit format controls; dimensions; parent capture | One stream or terminal capability was inferred from another. |
| Output is missing, delayed, interleaved, truncated, or blocks | Destination; producer/consumer; write and drain state; buffering layer; pipe limits; reader closure; runtime exit; forced termination | Backpressure, flush, atomicity, downstream closure, and process completion were collapsed into one assumption. |
| Ctrl+C, termination, resize, or another signal behaves differently | Exact event; OS; console/PTY; process group/session; foreground state; runtime/main/worker; handler/default; child state | POSIX, Windows, terminal-generated, and runtime signal facts were treated as equivalent. |
| A command is not found or the wrong executable runs | Entry route; shell function/alias/built-in; PATH; current directory; extensions; links; package/direct consumer identity; resolved executable | A command name or source entry was mistaken for the consumer object. |
| Arguments or redirection differ | Direct versus shell entry; shell/version; quoting; expansion; command line or argument vector; pipeline and redirection owner | Shell parsing was assumed for a direct process, or one shell's rules were borrowed. |
| Text is corrupt, misaligned, reordered, or localized unexpectedly | Raw bytes; encoder/decoder; console code pages; locale variables and active data; terminal host/font; grapheme/display-column mechanism | Encoding, locale, glyph availability, display width, and visual expression were treated as one fact. |

If the next observation would allocate a PTY, send a signal, spawn a process, change a terminal mode, write a
file, alter locale or environment, install a command, or touch an external system, state the exact side effect
and authority first. When that authority is absent, return `Unknown` with the blocked probe rather than
performing or simulating it.

### What does one fact result contain?

| Result field | Required content |
|---|---|
| Question | Exact bounded capability, behavior, failure signal, destination, transition, or limit |
| Tuple | Every applicable tuple field with exact, `Unknown`, or justified `Not applicable` state |
| Evidence | Official owner and URL, version/release bound, source date when stated, access date, evidence class, and every exact observation that occurred |
| Disposition | Exactly one of `Available`, `Unavailable`, or `Unknown` |
| Established fact | The exact fact and every prerequisite, bound, output, signal, state, or limit directly established |
| Diagnosis | Preserved observed signal, remaining causes, and smallest fact that distinguishes them |
| Limits and conflicts | Missing or stale evidence, unobserved targets, competing claims, and narrower established bounds |
| Next fact | Smallest exact source or probe, required authority, owner, side effect, and resume condition |
| Freshness | Source and observation dates plus every answer-changing refresh trigger |
| Routes and non-decisions | Adjacent owners and explicit statements of every product decision, mechanism, proof, artifact, or action not established |

### When is a fact stale?

Refresh the affected lookup when any answer-changing command or artifact identity, runtime version/build,
runtime compatibility register, OS release/build, architecture, C library or CPU baseline, shell, entry route,
PATH, current directory, terminal/console/PTY, stream destination, process group/session, worker/main context,
pipe/redirection, signal setup, encoding, console code page, locale data or variables, CI/session context,
permission, trust state, official source, or direct observation changes.

If a consumer needs a current fact and refresh cannot be completed, the disposition is `Unknown`. Retain the
last dated fact only as historical evidence with its original tuple and bounds.

## References

- [CLI Platform checklist](checklists.md) is the reusable unchecked source for this Manual.

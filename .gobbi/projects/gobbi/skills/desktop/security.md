# Desktop — Security Posture

Carry the security posture as two distinct kinds of work: defaults to leave alone, and controls to write.
Policy lives in [`SKILL.md`](SKILL.md); this child owns the mechanics.

The platform's own security checklist has **twenty** numbered items, and they split cleanly into two groups
that demand opposite kinds of effort. **Eight** are defaults already in place, where the correct action is
**inaction**. **Twelve** are positive controls that **do not exist until someone writes them**. Eight plus
twelve is twenty.

That split is the single most useful thing to hold in mind here, because real applications rarely fail on the
defaults. They fail by never writing the twelve.

Every version-dependent statement below names the behaviour whose availability version
[`runtime-deltas.md`](runtime-deltas.md) owns, and points there instead of restating the literal.

## Group A — defaults to leave intact

Eight items. Each is already correct in a current application. The work is an audit that confirms nothing in
this outcome has switched one off, and a recorded reason wherever one has been.

| # | Default | Named setting | What breaking it costs |
|---|---|---|---|
| 2 | No Node integration for remote content | `nodeIntegration: false` | remote content gains the privileged runtime's interfaces |
| 3 | Context isolation on | `contextIsolation: true` | the page's world and the preload's world merge, and the page can rewrite the bridge |
| 4 | Renderer sandbox on | `sandbox: true` | the renderer stops being a renderer and becomes another privileged process |
| 6 | Web security left enabled | `webSecurity` (do not disable) | the origin model that separates content sources stops applying |
| 8 | Insecure content not allowed to run | `allowRunningInsecureContent` (leave off) | a secure page silently loads insecure subresources |
| 9 | Experimental features off | `experimentalFeatures` (leave off) | unshipped engine behaviour reaches production users |
| 10 | Engine feature flags not enabled | `enableBlinkFeatures` (leave unset) | the same, at finer granularity |
| 11 | Embedded-view popups not allowed | `allowpopups` on `<webview>` (leave unset) | an embedded view opens a window outside the window-creation policy |

The three defaults in rows 2, 3, and 4 are the ones whose values changed over time;
[`runtime-deltas.md`](runtime-deltas.md) records the version each became the default, and
[`process-model.md`](process-model.md) owns what they mean for the context split.

The audit question is never "did we enable this?" — it is "did anything in this outcome disable it, and is
there a recorded reason?" A default switched off without a recorded reason is a finding.

## Group B — positive controls to write

Twelve items. Each is a control that does not exist until it is written, and an application that has written
none of them still passes every Group A check.

| # | Control | Named mechanism |
|---|---|---|
| 1 | Load secure content only | the window's own loading path — no plain-HTTP resource in a shipped build |
| 5 | A session permission-request handler | `session.setPermissionRequestHandler()`, set before any prompt can reach the person |
| 7 | A Content Security Policy | `session.webRequest.onHeadersReceived`, per the section below |
| 12 | Verify embedded-view options as they attach | the `will-attach-webview` event |
| 13 | Limit navigation | the `will-navigate` event, which fires on every attempt |
| 14 | Limit window creation | `setWindowOpenHandler`, which decides rather than reacts |
| 15 | Never hand untrusted content to `shell.openExternal` | wherever a link becomes a shell action |
| 16 | Stay on a supported platform version | the dependency manifest, checked against the supported-major set |
| 17 | Validate the inter-process sender | `event.senderFrame` in every privileged handler — [`process-model.md`](process-model.md) owns it |
| 18 | Avoid `file://` for application content | the loading path, again |
| 19 | Check the fuses | the build, per the fuse section below |
| 20 | Never expose platform interfaces to untrusted content | the `contextBridge` surface |

Item 16 is a version-dependent control: falling outside the supported-major set is a security failure rather
than a maintenance preference, and [`runtime-deltas.md`](runtime-deltas.md) owns both the current supported
set and the cadence that moves it.

**Inventory each of the twelve with a written-or-missing state.** "We follow the security checklist" is not an
inventory. Twelve rows, each naming the file and the line, is.

## Content Security Policy delivery

**The preferred delivery mechanism is an HTTP header**, set through
`session.webRequest.onHeadersReceived`. That is the platform's own stated preference, and it applies to every
application serving its own content over a protocol that carries headers.

A `<meta>` tag is the **fallback**, and it exists for `file://`, where there are no headers to set. Reaching
for the tag first is the common mistake, and it is a weaker mechanism.

Note the interaction with Group B item 18: the fallback exists for exactly the protocol the checklist asks
applications to avoid for their own content. An application that avoids `file://` can use the header, which
is the stronger path.

## Fuses and the paired ASAR fuses

Fuses are the **build-time** hardening mechanism. They are flipped when the artifact is built, and they are
validated by the operating system **after** code signing — [`signing-updates.md`](signing-updates.md) owns
what that ordering means for the release chain.

| Fuse | Default | Hardening action |
|---|---|---|
| `runAsNode` | enabled | disable if the application does not use it |
| `enableCookieEncryption` | disabled | **enable in production** |
| `enableNodeOptionsEnvironmentVariable` | enabled | disable |
| `enableNodeCliInspectArguments` | enabled | disable — **but see the build-matrix decision below** |
| `enableEmbeddedAsarIntegrityValidation` | disabled | **enable, paired with the next row** |
| `onlyLoadAppFromAsar` | disabled | **enable, paired with the previous row** |
| `loadBrowserProcessSpecificV8Snapshot` | disabled | enable — it improves isolation |
| `grantFileProtocolExtraPrivileges` | enabled | disable unless the application serves local files |

### The two archive fuses are one control

`enableEmbeddedAsarIntegrityValidation` and `onlyLoadAppFromAsar` are paired deliberately, and the platform
states why: together they make it impossible to load non-validated code. Enabling integrity validation while
still permitting loading from outside the archive leaves the path the validation was meant to close.

Enable both or understand precisely why you are enabling one. On a hash mismatch the platform **terminates
forcefully** — that is the intended behaviour, not a crash to diagnose.

Archive-integrity support is not available on every operating system, and the per-system minimum versions are
recorded in [`runtime-deltas.md`](runtime-deltas.md) under *Archive-integrity minimums*. On the system with no
support, this control is simply absent, and a run claiming load-time integrity across three systems is
claiming something the platform does not provide.

### The build-matrix decision this table forces — `DESK-G5`

Two first-party sources are in direct operational conflict, and no documented reconciliation exists.

- The platform's own fuse guidance lists **disabling** `enableNodeCliInspectArguments` as hardening.
- The documented end-to-end test framework **requires that same fuse not be disabled**.

Both horns, stated as consequences rather than as preferences:

| Horn | What it buys | What it costs |
|---|---|---|
| Harden the release build | the shipped artifact carries the full fuse set | that artifact is not automatable by that test path, so the automated suite exercises a different build |
| Keep the fuse enabled for automation | end-to-end automation runs against the artifact that ships | the shipped artifact is not fully hardened |

**This is a user decision at `DESK-G5`, and `DESK-N10` forbids resolving it on the reader's behalf.** Present
both horns with their consequences. Whichever the user picks, the consequence is carried forward as a stated
verification limit rather than absorbed into a green summary — if the automated suite exercises a build that
is not the one shipping, every claim that suite supports is a claim about a different artifact.

## What ASAR is not

The archive format is a packaging convenience. It is **not a security boundary**, and treating it as one is
what `DESK-N08` prohibits.

Its own documentation justifies it as concealing source **from cursory inspection**. That is the whole claim.
Beyond it:

- it is **read-only**;
- it returns **guessed** `fs.stat` values rather than real ones;
- **some interfaces silently extract to a temporary directory**, so a file a reader believes is sealed inside
  the archive can exist unpacked on disk.

Therefore: **never place a secret in the bundle.** Not in the archive, not minified, not encoded, not split
across files. Anything shipped to a user's machine is in that user's possession, and packaging changes how
much effort reading it takes and nothing else. The at-rest secret handling that *does* work is
[`filesystem-data.md`](filesystem-data.md)'s subject.

Integrity validation and the archive-only load path, from the fuse table above, are what the archive
contributes to security: **load-time integrity**, on the systems that support it. That is a different
property from confidentiality, and it is the only one on offer here.

## Supply chain and the scanner gap

Two facts about this stack's supply chain change how a run plans its maintenance, and both are uncomfortable.

### The engine roll is continuous; the supported window is not

Only the latest three stable majors are supported at a time — [`runtime-deltas.md`](runtime-deltas.md) owns
the current set and the cadence that moves it. Meanwhile, remote-code-execution vulnerabilities in the bundled
browser engine reach this platform continuously, through the engine roll.

Those two facts together are why "stay on this major for two years" is not available, and why upgrading is a
security activity rather than a maintenance chore. A team that cannot sustain the cadence has a stack-fit
problem, and `DESK-R03`'s third criterion is where that gets decided — before the stack is committed, not
after the first unpatchable release.

### The static scanner gap, stated rather than papered over

The standard free static scanner for misconfiguration in this stack is **unmaintained**. Its own maintainers
state they are no longer actively maintaining the project, and they point users at a commercial successor.

**NOT FOUND — a maintained free replacement.** A bounded search this session found none. Two things follow,
and the second matters as much as the first:

1. **Do not present a scanner as covering the twenty checklist items.** The audit is manual until a
   maintained tool exists. Budget for that rather than discovering it at review time.
2. **Do not imply the commercial successor is the only option.** That is a claim about the market, and no
   evidence on hand supports it. What is supported is narrower: the standard free tool is unmaintained, and a
   bounded search found no maintained free replacement.

`SKILL.md`'s gap register carries this with its closing condition — a maintained free scanner appears, or the
gap is accepted permanently.

### What the manual audit has to cover

Absent a scanner, the audit is the two groups above plus the fuse table, run against the built artifact
rather than against the source. The distinction matters: Group A defaults live in window configuration,
Group B controls live in application code, and the fuses live in the **build**. A source review that never
inspects the built artifact cannot see the third of those.

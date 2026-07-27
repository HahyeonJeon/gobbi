# Desktop — Packaging and Distribution

Own per-OS installer targets, ASAR packaging, native module rebuild, and bundled resources. Policy lives in
[`SKILL.md`](SKILL.md); this child owns the mechanics.

Packaging is where a development build becomes a thing a person installs, and it is the first point at which
several obligations become provable at all. A development build proves nothing about an installer, an
installer proves nothing about a signature, and a signature proves nothing about an update — `DESK-R23` adds
those as four separate gates for exactly that reason.

This file covers producing the artifact. [`signing-updates.md`](signing-updates.md) covers what happens to it
afterward, and the two form one chain: package, then sign, then update.

## Per-OS target matrix

**One installer target per claimed operating system, produced by the build, and installed from in a clean
environment before the outcome is called finished.** A run that claims three systems and produces two
installers has claimed one system it cannot deliver.

The matrix a run fills in at `P5` names, per claimed system: the target format, what produces it, whether it
is signed and by what, and how an installed copy receives an update.

**NOT STATED HERE — the per-system installer format names and their trade-offs.** This skill's claim register
carries no owner document enumerating them, so none is taught. *Closing condition:* read the selected build
tool's own target documentation and record the chosen format per system in the run's design record. The
selection is a real decision with real consequences — package-manager integration, update path, and
permissions all differ by format — and it is made against a document this skill has read rather than against
a list reproduced from memory.

What holds regardless of format:

- **Linux distribution goes through package formats**, and that fact reaches beyond packaging: it is why the
  system has no built-in update path, which [`signing-updates.md`](signing-updates.md) owns.
- **The clean-environment install is the proof.** Installing over a development machine that already carries
  every dependency proves nothing about the artifact. `DESK-R23`'s install gate means a machine that has not
  seen this application before.
- **Each format is per-system evidence.** `DESK-FLOOR-04` member 6 applies here as everywhere: an installer
  proved on one system supports no claim about another.

## The build-tool selection criterion

**This skill states a criterion, never a mandate.** `DESK-N10` forbids resolving the choice on the reader's
behalf, and the evidence genuinely does not pick a winner: both leading tools are maintained and both are
first-party-adjacent rather than third-party afterthoughts.

**The criterion:**

> Start from the all-in-one tool. Move to the alternative when the requirement set names **differential
> updates**, **staged rollout**, or a **non-default update provider** — because the platform's own built-in
> updater documents none of those, and the alternative's updater supplies all three.

Read the criterion against the run's own stated requirements, not against a preference. A run that has no
staged-rollout requirement gains nothing by adopting the heavier chain for one.

**Three facts that keep the choice honest:**

1. **The all-in-one tool does not claim official status in its own documentation.** The platform's tutorial
   recommends it and uses its publishing plugins, which is a recommendation and not a designation. Do not
   write "the official build tool" as a quoted fact — `DESK-R26` requires a claim to be verifiable at its
   owner, and that one is not.
2. **Its actual stated advantage is upstream proximity:** it wraps first-party tooling, so new platform
   capabilities arrive through it immediately rather than after a port. That is a maintenance argument, and
   it is the strongest one on offer.
3. **The dev-and-build layer is orthogonal to both.** The tool that compiles and bundles the three targets is
   not a competitor to the tool that packages and publishes — it composes with either. Presenting all three
   as one choice is a category error that produces a needless decision.

**This is a `DESK-G6` user decision.** Present the criterion, the run's requirement set, and which side of
the criterion it falls on. A tool chosen against the criterion is a legitimate answer; record the reason.

**Version-sensitivity, stated rather than pinned here.** The alternative tool's current major is a breaking
release with its own module-syntax and runtime-floor requirements. Pin the version the run actually uses and
read that version's own migration notes. This file states no tool version literal, because a literal here
would be stale before it is useful, and [`runtime-deltas.md`](runtime-deltas.md) owns the platform baseline
that the tools track.

## ASAR packaging mechanics

The archive bundles application source into a single file that the platform reads directly, without
unpacking, at run time. That is the mechanic.

Three properties change how code inside it behaves, and each one surprises somebody:

1. **It is read-only.** Anything the application writes goes elsewhere —
   [`filesystem-data.md`](filesystem-data.md) owns where.
2. **File-status calls return guessed values.** Code that branches on file metadata inside the archive is
   branching on an approximation.
3. **Some interfaces silently extract to a temporary directory.** A file a reader believes is sealed inside
   the archive can exist, unpacked, on disk. This matters for path resolution below and it matters for
   anything the run assumed was inaccessible.

**The archive is not a security boundary**, and its own documentation claims only that it conceals source
from cursory inspection. [`security.md`](security.md) owns that rule, the paired integrity fuses, and the
never-bundle-a-secret consequence. What belongs here is the packaging half: **the two archive fuses are set
at build time**, so whether the shipped artifact validates its own archive is decided by this step and not by
application code.

Integrity support is not available on every system, and the per-system minimum versions live in
[`runtime-deltas.md`](runtime-deltas.md).

## Native module rebuild and its per-OS traps

**A native module built for the standalone runtime does not work here, and must be rebuilt.** The platform's
application binary interface differs from the standalone runtime's — the documented example is that it uses
Chromium's **BoringSSL** where the standalone runtime uses **OpenSSL** — so the compiled artifact is
genuinely incompatible rather than merely untested.

This has consequences a run plans for rather than discovers:

- **The rebuild is per platform and per architecture.** Every claimed system needs its own build of every
  native dependency, which means a build environment per system or a cross-build setup that produces them.
- **Windows needs a delay-load hook.** A native module built for this platform requires
  `'win_delay_load_hook': 'true'` in its `binding.gyp`; without it the module fails at load with
  **"Module did not self-register"**. That message names a symptom that reads like a corrupted build, so a
  run that has not seen it before will look in the wrong place.
- **A native dependency is a `DESK-G7` decision.** It is a production dependency that multiplies the build
  matrix by every claimed system, and it can block a system entirely if no build exists for it. Surface that
  cost when the dependency is proposed, not when the third system's build fails.

**Check native dependencies before claiming a system.** A run that claims three systems and depends on a
module that builds for two has a contradiction in its own contract, and the earliest honest place to find it
is the stack-fit test at `DESK-R03`.

## Bundled resources and path resolution

**A path that worked in development is the single most common thing to break on packaging**, because the
layout changes underneath it. In development the application runs from a directory tree; packaged, part of it
runs from inside an archive, part sits beside the archive, and part may be silently extracted to a temporary
directory when something reads it.

Three rules follow:

1. **Never compose a path from the source file's own location and assume it survives packaging.** Resolve
   resource paths through whatever the packaged layout actually provides, and verify the resolution against
   the installed artifact rather than against the development tree.
2. **Decide per resource whether it belongs inside the archive or beside it.** Anything that must be read by
   a mechanism outside the platform's own file interfaces — another process, a native module, a system
   service — cannot rely on reading from inside the archive, and the silent-extraction behavior above is not
   a contract to depend on.
3. **Bundle resources locally rather than fetching them at run time.** This is one of the platform's own
   documented performance recommendations, and it has a second benefit the performance framing understates:
   a locally bundled resource cannot fail because a network is missing, which is a substantial part of what
   makes an installed application feel different from a page.

**The path proof belongs to the install gate.** `DESK-R23` requires a smoke test of the installed artifact in
a clean environment, and resource resolution is precisely the class of defect that gate exists to catch —
invisible in development, immediate on a machine that has only the shipped files.

> **UNVERIFIED — a custom startup-snapshot workflow for application code.** The platform's recent releases
> changed the startup baseline: the privileged process now boots from an embedded startup snapshot, and
> framework bundles and preload scripts are cached as compiled bytecode.
> [`runtime-deltas.md`](runtime-deltas.md) records the versions those behaviors hold from.
>
> **Whether a custom snapshot workflow for an application's own code is documented was not confirmed, so no
> such workflow is taught here.** *Closing condition:* the vendor documents one for application code. The
> documented startup action available today is upgrading the platform version itself — which means a startup
> measurement that does not name the version it was taken on measures nothing, and `DESK-R26`'s
> version-naming rule is what keeps such a measurement honest.

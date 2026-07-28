# Desktop — Signing and Updates

Own code signing, notarization, update feeds, channels, staged rollout, and the irreversibility rule. Policy
lives in [`SKILL.md`](SKILL.md); this child owns the mechanics.

This is the end of the chain [`packaging-distribution.md`](packaging-distribution.md) begins: package, then
sign, then update. It is also the part of a desktop outcome with the least in common with shipping a web
page. There is no rollback here. A version that reaches a person's machine stays there until that person
installs a different one, and some of them never will.

**The three systems diverge more here than anywhere else in this skill**, and the divergence is not a matter
of degree — one of them has no built-in update mechanism at all.
[`runtime-deltas.md`](runtime-deltas.md) owns the per-system matrix and every version literal.

## macOS — sign, then notarize

**Two mandatory steps, in order.** Signing is not sufficient on its own.

1. **Enrol in the vendor's developer program.** The identity comes from there; nothing downstream works
   without it.
2. **Sign the artifact**, then **submit it for notarization**. Dedicated first-party tooling exists for each
   of the two steps: `@electron/osx-sign` and `@electron/notarize`.

A run that signs and stops has completed half the requirement, and the failure surfaces on someone else's
machine rather than on the build machine — which is the general shape of every defect in this file.

**Signing here is also a precondition for two things that are not obviously about signing:**

- **Updates do not function on unsigned macOS builds.** It is a requirement of `Squirrel.Mac`, the framework
  behind the built-in updater on that system, so an unsigned build has no update path at all.
- **Notifications require a code-signed application.** An unsigned binary emits a failure event instead of
  presenting the notification — [`native-integration.md`](native-integration.md) owns that mechanic. It is
  named here because a run that defers signing to the end will find its notification work unprovable.

> **UNVERIFIED — hardened runtime and entitlements.** The governing code-signing document **does not cover
> them**, and no other owner document for them appears in this skill's claim register. **No entitlement is
> taught here, and none should be copied from a summary of that document either**, because the document does
> not contain them. *Closing condition:* that document, or another authoritative source, covers hardened
> runtime and entitlements. `SKILL.md`'s gap register carries this item.
>
> A run that needs entitlements takes the question to a source it has actually read and records the result in
> its own design record. What it does not do is infer them — `DESK-N09` prohibits filling an unverified
> platform requirement from a plausible reconstruction.

## Windows — the certificate requirement

**The attribution here is deliberate and load-bearing. Read it as written.**

**The platform states that** Microsoft has required software to be signed with an **extended-validation**
certificate since the date [`runtime-deltas.md`](runtime-deltas.md) records under *Platform-certificate policy
date*. **The platform further states that** organization-validation and plain code-signing certificates no
longer provide benefits, and that the operating system treats such an application as completely unsigned.

**Why this is attributed rather than asserted.** The evidence on hand is the platform's own report of another
vendor's policy — not that vendor's own document. Nobody on this skill's evidence trail has read the policy
at its owner. `DESK-R26` requires a claim to be verified at its owner before it is stated as fact, so this
one is stated as a report, and every restatement of it keeps the attribution. Upgrading it to a direct claim
requires reading the vendor's own source first. This is the single claim in the whole skill that did not
close to its proper owner, and it is recorded that way on purpose.

**What the platform states about the certificate's storage:** an extended-validation certificate must reside
on a hardware storage module compliant with **FIPS 140 Level 2**. That is a procurement fact with a lead
time, and it belongs in the release plan rather than in the release week.

**On the cheapest route:** the platform's own documentation names **Azure Artifact Signing** as the cheapest
option for Windows code signing and states that it gets rid of SmartScreen warnings. That is the platform's
characterization, repeated here as such — this skill makes no independent cost comparison and has no evidence
for one.

> **UNVERIFIED — the update signature-verification mechanism on Windows.** The governing updater
> documentation **provides no details**, so **no mechanism is taught here**. What is verified is that the
> document is silent, which is a different and more useful thing to know than a guess would be.
> *Closing condition:* the vendor documents the mechanism. `SKILL.md`'s gap register carries it.
>
> The practical consequence: a run cannot state what its update pipeline verifies on this system, so it
> states what it verified by **test** instead — rehearse an update on the real signed artifact and record the
> observed result. `DESK-R25` keeps that a separate claim from the mechanism claim nobody can make.

## Linux — no signing story

**The governing document describes no signing story for this system**, and distribution goes through package
formats instead.

This is not an omission to work around; it is a different distribution model. The package format and its
repository carry the integrity and provenance role that a signature carries elsewhere, and the person's own
system already trusts that path.

Two consequences a run states rather than discovers:

- **The archive-integrity control is unavailable here.** [`runtime-deltas.md`](runtime-deltas.md) records
  which systems support it. A run claiming load-time integrity checking across three systems is claiming
  something the platform does not provide on one of them, and [`security.md`](security.md) owns that control.
- **The update path is the system's own package manager**, which is the next section's subject.

## The update platform asymmetry

**There is no built-in auto-updater on Linux.** The platform's own recommendation is to use the
distribution's package manager to update the application. This single fact invalidates the most common
release-plan assumption in this stack:

> **Any claim of three-platform automatic updating through the built-in updater is false.** Not optimistic —
> false. Two systems have a built-in path; the third does not.

Per-system, with the mechanism named:

| System | Built-in update path | Precondition |
|---|---|---|
| macOS | yes, through `Squirrel.Mac` | **signing is mandatory** — a requirement of that framework, not a recommendation |
| Windows | yes, auto-selecting between an MSIX updater and `Squirrel.Windows` | signed artifacts, per the certificate section above |
| Linux | **none** | the distribution's package manager carries the update |

**The hosted feed's constraints, which decide whether it is available to a run at all:** the free hosted feed
`update.electronjs.org` requires a **public** repository, covers **macOS and Windows only**, and requires
macOS builds to be code-signed. A private-repository project, or one that needs the third system, needs a
different provider — and needing a non-default provider is one of the three conditions in the build-tool
criterion [`packaging-distribution.md`](packaging-distribution.md) owns.

**State the per-system update path in the release plan, explicitly.** A run that writes "auto-update" without
naming the system has written something that is true of two thirds of its claim set.

## Download and install timing

Two timing behaviors change the design, and both are easy to miss because they work fine on a fast connection
with a small application.

**The update downloads when the `update-available` event fires.** Not when the person consents, and not when
the application decides it is convenient — at that point. For a metered connection or a large delta, that is
a cost the person did not agree to.

The consequence: **gate `checkForUpdates` by policy rather than running it on an interval timer.** An
interval timer means the download happens whenever it happens. A policy-gated check means the run decides
when it is acceptable to spend someone's bandwidth, and can ask.

**Installing races live application state.** `quitAndInstall()` ends the application, and the application may
be mid-write when it does — which is exactly `DESK-FLOOR-02` member 7, an update install racing live state.
The `before-quit-for-update` event exists precisely because of this race, and it is the hook for flushing
work, releasing resources, and recording where the person was.

**Use it, and treat an unsaved change as a stop rather than a hazard to accept.** The person did not choose
this moment to quit; the updater did. Losing their work to an update is a consequence they could not foresee,
refuse, or recover from, and [`filesystem-data.md`](filesystem-data.md) owns the durable-write property that
makes the flush trustworthy.

## Channels and staged rollout

**A channel is a separate audience receiving a separate artifact.** It is what makes a release recoverable in
the only sense available here — by finding the defect on a small population before it reaches everyone.

**Staged rollout releases to a growing fraction of that audience**, with a stop condition that halts the
progression when a signal turns bad.

**These are not built-in capabilities.** Differential updates, staged rollouts, and multiple update providers
come from the alternative build chain's own updater; the platform's built-in updater documents none of the
three. That is precisely why the build-tool criterion in
[`packaging-distribution.md`](packaging-distribution.md) turns on this requirement set, and why a run that
needs staged rollout has effectively already made its `DESK-G6` decision.

**Two things a run defines before the first staged release, not during it:**

1. **The stop condition, as an observable.** "It looks bad" is not a stop condition. A crash rate, an error
   rate, or a named failure signal, each with a threshold and an owner, is one.
2. **What stopping actually does.** Halting the rollout stops *new* installations of the bad version. It does
   nothing about the copies already installed, which is the next section's subject and the reason a stop
   condition is a mitigation rather than a fix.

## The irreversibility rule and the supported-version window

**A shipped version cannot be recalled.** `DESK-R24` states the rule; this is what it means operationally.

Once an artifact is installed on a person's machine it is theirs. Withdrawing the download, halting the
rollout, and deleting the release all change what *new* people receive and change nothing at all for the
people who already have it. Some of those installations will still be running years from now, on machines
that never see a network the run controls.

**Therefore rollback means a forward fix.** There is no other mechanism. The defect is corrected in a new
version, that version is released through the same chain, and the people who install it are fixed. The people
who do not install it are not.

**Which forces a stated supported-old-version window.** A run decides, in advance and in writing, how far
back it supports:

- **How old a version still receives a forward fix?** Not "the latest" — an answer that names a bound.
- **How old a version can still talk to whatever the application talks to?** A protocol or data-format change
  that assumes everyone upgraded is a break for everyone who did not.
- **What happens to a version outside the window?** Told, blocked, or left alone are three different
  answers with three different consequences for a person who cannot upgrade.

**The window is a claim about the past that binds the future**, and it is why `DESK-R24` puts release behind
its own authority gate at `DESK-G8` rather than treating it as the last step of a build.

### What the release gate actually proves

`DESK-R23` adds four gates after the ordinary build, and the last two live in this file:

| Gate | What it proves | What it does not |
|---|---|---|
| Package per system | an installer exists for each claimed system | that it installs |
| Install and smoke-test in a clean environment | it installs and runs where nothing was prepared for it | that it is signed correctly |
| **Verify signature and notarization on the real artifact** | the shipped bytes carry a valid identity | that an update works |
| **Rehearse an update from the previously released version** | a person on the last release reaches this one | anything about a release two versions back |

**Rehearse from the previously released version, not from a fresh install.** A fresh install proves a
different claim — it proves first-time installation, which is a path most of the audience will never take
again. The update path is the one nearly everyone uses, and it is the one that can destroy data the fresh
path never touches.

**Keep the claims separate.** `DESK-R25` requires it, and this is where merging them is most tempting: a
green pipeline reads as "released successfully" when what it proved was that four distinct things each held
on the systems it ran on. A run states which system each claim covers, and treats an unrunnable gate as a
limitation that blocks its claim rather than as a weaker signal that partially supports it.

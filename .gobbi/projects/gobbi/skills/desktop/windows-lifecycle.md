# Desktop — Windows and Application Lifecycle

Own window creation, state restoration, per-OS quit semantics, single-instance behavior, deep links, and
entry modes. Policy lives in [`SKILL.md`](SKILL.md); this child owns the mechanics.

Every obligation here is a **behavior** contract rather than a visual one. Matching an operating system's
appearance while breaking one of the behaviors below reads as a broken application, and no amount of visual
polish repairs it. `DESK-R22` is the rule; this file names the mechanism for each obligation it covers.

Where one system diverges from another, [`runtime-deltas.md`](runtime-deltas.md) owns the divergence matrix
and every version literal. This file states the obligation once and points there.

## Creation and first paint

**The first-paint pair is both mechanisms, not either one.**

1. Create the window with `show: false` and show it on `ready-to-show`. Showing after that event has no
   visual flash.
2. Set `backgroundColor` **anyway**, even though the application uses `ready-to-show`. The platform's own
   guidance recommends both together.

Each alone leaves one bad case. Waiting for the event without a background color gives a blank stare while
the window is invisible and the application appears not to have launched. Showing early without waiting gives
the white flash the event exists to remove. A run that implements one of the two has implemented half of the
obligation, and the half it is missing is the half its own test environment is least likely to expose.

The window's own content-loading limits — which navigations are permitted and which window-open requests are
allowed — are security controls, and [`security.md`](security.md) owns them. Creation is this file's subject;
what the created window is allowed to load is not.

## State restoration as a conformance obligation

**There is no built-in mechanism for saving and restoring window position and size.** The platform states
this directly, and it is tracked as an open request rather than an oversight.

It is a **conformance** gap, not a convenience gap. Both the Windows and the GNOME design guidance assume a
window that reopens where the person left it, so a window that forgets its position does not read as a
missing nicety — it reads as broken.

Two routes close it, and the choice between them is the user's:

- **A third-party library.** That is a new production dependency, so it is a `DESK-G7` decision and **never a
  default**. Present it with its maintenance state and its cost, like any other candidate.
- **An implementation the run owns.** Smaller surface, no dependency, and the per-system traps below become
  the run's own problem.

**The trap either route has to handle: a monitor that disappears.** A naive restore writes back the saved
bounds and puts the window on a display that no longer exists, where it is invisible and unreachable.
Restoration therefore validates the saved bounds against the currently attached displays before applying
them, and falls back to a visible default when they do not intersect one.

This is the shape `DESK-FLOOR-02` protects: a state the person cannot foresee, refuse, or recover from,
reached by an ordinary relaunch.

## Per-OS quit and activation

Three behaviors diverge, and the divergence is the point.

**Closing the last window.** The `window-all-closed` event's default is to quit the application. Subscribing
to it takes that decision over. That subscription is the hook for the macOS convention of an application that
survives with no window open, and it is why the same code quits on one system and persists on another.
[`runtime-deltas.md`](runtime-deltas.md) records which system does which.

**Activation.** The macOS `activate` event fires on relaunch or a dock click, and is where an application
with no window opens one. `did-become-active` is a **different** event that fires every time the application
becomes active, which is not the same question. Using the second where the first is meant produces a window
on every application switch.

**Handling a file the system hands you.** On macOS the `open-file` event must be registered **very early in
startup — even before the ready event is emitted**.

> **The launch-event trap this creates.** Module-syntax imports in the privileged process load
> **asynchronously**, so only side effects from the entry point's own imports run before the ready event —
> [`process-model.md`](process-model.md) owns that fact. An entry point that registers `open-file` after an
> `await` therefore misses the launch event, and a file opened from the system file browser silently does
> nothing. The two facts are individually documented and their combination is where the failure lives.
> Register the handler synchronously, at the top of the entry point, before any awaited work.

## Single instance and argument handling

`requestSingleInstanceLock()` claims the lock; the `second-instance` event delivers what the second launch
was asked to do. That pair is the mechanism.

**Parse the argument list by matching, never by position.** The platform documents that the argument list a
second instance receives *will not be exactly the same list*: its order might change, and additional
arguments might be appended.

Positional indexing therefore acts on whatever happens to sit at that index. For a deep link or a file-open
request that means acting on a target the person did not choose — which is why this is a
**`DESK-FLOOR-02` safety member** and not merely a correctness note. Find the argument by matching what it
is, and ignore where it sits.

## Deep links per operating system

Registration is `setAsDefaultProtocolClient()`. Delivery is not the same on every system.

| System | How the link arrives |
|---|---|
| macOS | the dedicated `open-url` event |
| Windows | the single-instance lock and its `second-instance` event |
| Linux | the same route as Windows |

**Where the link sits, and why that is not an index.** On Windows and Linux the link is documented as the
**last** element of the delivered command line. That is a description of where it appears, and it is not a
contract to index against — the same documented warning about order and appended arguments from the previous
section applies to exactly this list. Match the protocol scheme. The documented position tells you where to
look first; the match is what makes the handler correct.

**Testing this unpackaged gives a false negative.** The platform states the feature works on macOS only when
the application is packaged and does not work when launched in development. A deep link that fails in a
development run has proved nothing about the shipped artifact, and a run that concludes otherwise will ship a
broken association or waste a day chasing a working one.

## Entry-mode inventory

An application is entered in more ways than its own team usually lists, and each entry mode reaches the
outcome from a different starting state. `DESK-R01` requires the entry modes to be named as part of the
bound outcome; this inventory is where a run enumerates them against real mechanisms.

| Entry mode | Mechanism | The state it starts from |
|---|---|---|
| First launch | ordinary startup | nothing running, no window, no restored state |
| Relaunch while running | the single-instance lock and its `second-instance` event | a live process that must surface an existing window rather than build a second one |
| Activation with no window | the macOS `activate` event | a live process with no window, on the system whose convention permits that state |
| A file handed over by the system | `open-file` on macOS, registered before the ready event | possibly no window yet, and possibly no ready event yet |
| A deep link | `open-url` on macOS; `second-instance` elsewhere | either a cold start or a live process, and the handler cannot assume which |
| Automatic start at login | the operating system's own login mechanism | a cold start with no person watching it happen |

**Every mode in the inventory reaches the outcome or is proved out of scope.** A mode that reaches a broken
state is a `DESK-N01` failure — the outcome is not finished — and a mode nobody enumerated is a mode nobody
tested.

Three properties are worth checking against the table rather than assumed:

1. **Cold-start and warm-start paths differ.** A deep link arriving at a cold start has to wait for the
   window that a warm start already has. A handler written for one path and reused for the other is the
   ordinary way this breaks.
2. **Some modes arrive before the ready event.** The file-handover row is the documented case, and the
   registration timing above is what makes it work.
3. **Registration of the association itself is separate work.** The protocol registration call is named
   above; file-type association registration belongs to the installer, and
   [`packaging-distribution.md`](packaging-distribution.md) owns the per-system installer targets that
   perform it. [`native-integration.md`](native-integration.md) states what this skill's evidence does and
   does not cover for that registration.

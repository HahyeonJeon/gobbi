# Desktop — Native Integration

Own menus, tray, dock, notifications, dialogs, clipboard, OS drag-and-drop, file associations, window chrome,
theming, and shortcuts. Policy lives in [`SKILL.md`](SKILL.md); this child owns the mechanics.

This is the surface where an application either reads as native or reads as a web page in a frame, and it is
also the surface where the most confidently wrong guidance circulates. Every claim below is either a
mechanism this skill verified at its owner, or a gap stated as a gap. `DESK-R21` and `DESK-N09` are the rules
that make that distinction non-negotiable here.

Where one system diverges from another, [`runtime-deltas.md`](runtime-deltas.md) owns the divergence matrix
and every version literal. This file states the mechanism and points there.

## Menus from roles

**Build the platform-standard menu from the documented `role` values.** For any item that matches a standard
role, specify the role rather than reimplementing the behavior in a click handler. That is the platform's own
explicit instruction, and it is the whole conformance mechanism this skill prescribes.

The documented roles include `appMenu`, `fileMenu`, `editMenu`, `viewMenu`, `windowMenu`, `help`, `services`,
and `window`; `recentDocuments` and `clearRecentDocuments`; `shareMenu`; the standard edit and window
operations; and the macOS extras `hide`, `hideOthers`, `unhide`, `front`, and `zoom`, plus the native-tab and
speech roles. Role strings are case-insensitive. On macOS, when a role is set, `label` and `accelerator` are
the only options that affect the item.

**Why roles rather than a prescribed structure.** A role carries the platform's own structure, its own
labels, and its own localization for free. Reimplementing the same item by hand gets the label in one
language, the behavior approximately right, and the localization not at all.

> **UNVERIFIED — the vendor's prescriptive design guidance could not be read.** Its pages are client-rendered
> and return no body content to a fetch, reproduced independently this session on the menu-bar page. **This
> skill therefore states no macOS minimum menu set, no menu ordering, and no Window-menu document-ordering
> convention as fact**, and neither should anything built from it. `SKILL.md`'s gap register carries the item
> with its closing condition: a retrieval path that executes the page's own scripts.
>
> This is a real limit, and roles are what make it survivable. Building from roles produces the standard
> structure without anyone asserting an ordering claim nobody here verified. What it does not do is tell you
> which menus a particular application ought to have — that question stays open, and filling it in from a
> search summary is the specific failure `DESK-N09` prohibits.

## Shortcuts and the three scopes

Accelerators join modifiers and key codes with `+` and are case-insensitive. Use `CommandOrControl` (or its
short form) rather than naming a platform's own modifier: the macOS command modifier **has no effect** on
Windows and Linux, so a shortcut written with it is silently dead on two of three systems.

**Three mechanisms, three different scopes.** Choosing the wrong one is the common defect, because all three
"work" in the developer's own foreground window.

| Mechanism | Scope | Use it when |
|---|---|---|
| A menu accelerator | the focused window only | the action belongs to a menu item, which is most of them |
| `globalShortcut.register()` | system-wide, including when the application is not focused | the action must work while the person is in another application |
| `before-input-event` | the focused window, **before the renderer sees the key** | the key must be intercepted rather than handled |

**A known limitation on the global mechanism:** on macOS it does not work with keyboard layouts other than
QWERTY. A run that claims a global shortcut on macOS and has tested only on a QWERTY layout has not tested
the claim.

**Do not take a system-reserved combination.** The GNOME guidance names `Alt+Tab` and `Alt+F4` as reserved
for the system, and an application that binds one takes it away from every other application the person uses.
`DESK-R22` requires one shortcut map per platform; the reserved set is part of what makes the maps differ.

**Pair every accelerator with undo.** An accelerator is a one-keystroke path to an action, and a mistyped
combination is a common event. Without undo, an accidental trigger is unrecoverable — which makes it a
`DESK-FLOOR-02` safety member rather than an interaction preference.

## Notifications per operating system

Two interfaces exist: the web `Notification` interface in the renderer, and the platform's own `Notification`
module in the privileged process. Choose one deliberately — the second reaches the system's own presentation
and the first does not always.

Each system has its own precondition, and a notification that never appears is usually a missing
precondition rather than a bug:

- **Windows** needs a Start Menu shortcut carrying an `AppUserModelID` and a matching `ToastActivatorCLSID`.
  In development it may additionally need `app.setAppUserModelId()` called at startup.
- **macOS requires code signing.** Applications must be code-signed for notification events to function
  properly; an unsigned binary emits a `failed` event instead. The notification body is also capped at **256
  bytes**, so a message composed for the other two systems can arrive truncated here.
- **Linux** goes through `libnotify`.

The macOS precondition couples this file to the release chain: notifications cannot be proved on macOS
against an unsigned development build, so the proof needs a signed artifact and
[`signing-updates.md`](signing-updates.md) owns how one is produced.

## Dialogs and clipboard

**Dialogs are native, and that has two consequences.** They are presented by the operating system, so they
look correct without effort; and they are presented by the operating system, so the renderer cannot style,
position, or intercept them. A design that depends on a custom-looking file picker is a design that has to
build one out of ordinary content, not configure the native one.

The default directory a file dialog opens in is one of the values that has changed with a platform version;
[`runtime-deltas.md`](runtime-deltas.md) records it under *Dialog default path resolves to the downloads
directory*. A run whose flow depends on where the dialog opens names that version.

**Clipboard access has moved out of the renderer.** It was deprecated at one version and became unavailable
at another, both recorded in [`runtime-deltas.md`](runtime-deltas.md) under the clipboard rows. The
consequence is structural rather than cosmetic: clipboard work belongs to the privileged process, reached
over a channel, which makes it one more entry in the channel inventory
[`process-model.md`](process-model.md) governs — payload validated, sender verified, like every other
crossing.

Treat pasted content as untrusted input. It arrived from another application.

## Drag and drop, in and out

The two directions use entirely different mechanisms, and only one of them is the standard web interface.

**Dragging in** uses the standard document drag-and-drop interface. Nothing platform-specific is required to
receive the drop.

**Dragging out** uses `webContents.startDrag({ file, icon })`, called from the privileged process and
triggered from the renderer's own drag-start handler over a channel. The renderer cannot start a system drag
by itself.

> **The path property was removed from dropped files.** Reading `file.path` on a dropped file returns nothing
> on **every supported version** — [`runtime-deltas.md`](runtime-deltas.md) records the removal version under
> *File-path property removed from dropped files*. The replacement is `webUtils.getPathForFile(file)`.
>
> This is worth checking for explicitly in any existing application, because the old form is what most
> published examples still show, and the failure is a silently empty value rather than an error.

A dropped file is untrusted input twice over: the path came from outside, and so did the contents.
[`filesystem-data.md`](filesystem-data.md) owns what happens once the run reads it.

## Custom window chrome

Custom chrome is a debt, taken deliberately. The mechanism is straightforward; what it costs is the part that
gets underestimated.

**The mechanism.** `titleBarStyle` takes four values:

| Value | Effect |
|---|---|
| `default` | the standard system title bar |
| `hidden` | removes the title bar. macOS keeps the traffic lights at the upper left; Windows and Linux remove all controls unless an overlay is configured |
| `hiddenInset` | macOS — shifts the traffic lights' vertical position |
| `customButtonsOnHover` | macOS — hides the traffic lights until hover |

`titleBarOverlay` accepts `true` or an object carrying `color` (Windows and Linux), `symbolColor` (Windows),
and `height` (all). It requires a `titleBarStyle` other than `default`. In the renderer, CSS `app-region: drag`
marks a region draggable, and the safe-area variables `env(titlebar-area-x)`, `env(titlebar-area-width)`, and
`env(titlebar-area-height)` give the space the system controls do not occupy. macOS additionally offers
`setWindowButtonVisibility` and a traffic-light position.

**The debts, from the Windows title-bar guidance.** Removing the system title bar transfers its requirements
to the application:

- height **32px**, or **48px** when the bar carries a search box or a person-picture control;
- the default background material is Mica, and the guidance recommends the title bar blend with the rest of
  the window where possible;
- **all title-bar elements are semi-transparent while the window is inactive**;
- colors adjust for high-contrast themes and for light and dark;
- the title text responds to text scaling, which may require the bar to grow in height.

**And three behaviors that are mandatory, not stylistic:**

1. all empty space and space occupied by non-interactive elements is **draggable**;
2. right-click or press-and-hold on non-interactive title-bar space **shows the system window menu**;
3. double-click **toggles maximize and restore**.

A custom title bar that omits the third is the one people notice within a minute of use. Budget for all three
before choosing `hidden`, and reconsider `default` if the visual gain does not justify them.

## Theming state machine

`nativeTheme.themeSource` takes exactly three values: `'system'`, `'dark'`, and `'light'`. The platform's own
recommendation is a state machine with **three user-facing options mapping onto those three values**.

**A two-state light/dark toggle is therefore wrong.** Follow-system is a required third state, not a
convenience — without it, a person whose system switches at sunset has to switch the application by hand, and
an application that starts in the wrong appearance is the visible result.

**Handle the `updated` event live.** Reading the theme once at startup produces an application that is
correct until the system changes, which is exactly the case the third state exists to serve.

**The related signals the theme interface exposes:** `shouldUseHighContrastColors`,
`shouldUseInvertedColorScheme`, `prefersReducedTransparency`, and `shouldDifferentiateWithoutColor`.

> **There is no reduced-motion property on this interface, and inventing one is a defect.** Reduced motion
> comes from the renderer's own `@media (prefers-reduced-motion)` query. This matters beyond tidiness:
> `DESK-FLOOR-01` carries reduced motion as a member of the accessibility floor precisely because the obvious
> place to look for it does not have it, and a run that goes looking on the theme interface, finds nothing,
> and concludes the signal is unavailable has failed a non-waivable floor by inference.

**On assistive technology.** The application enables accessibility features automatically in the presence of
assistive technology, and a programmatic setting to expose the accessibility tree exists — but the person's
own system utilities take priority over it and will override it. The platform names a screen reader for
Windows and one for macOS and **names none for Linux**;
[`runtime-deltas.md`](runtime-deltas.md) records that per-system table including the gap. A run claiming
assistive-technology behavior on the third system states what evidence it actually has rather than implying
parity across three. The floor obligation itself is `DESK-FLOOR-01`'s, not this file's.

## File associations

Two different associations are usually meant by one phrase, and they have different mechanisms and different
evidence behind them.

**A protocol association** — the application answers a custom link scheme — is registered by
`setAsDefaultProtocolClient()`, and [`windows-lifecycle.md`](windows-lifecycle.md) owns its per-system
delivery route and the packaged-only caveat that makes development testing misleading.

**A file-type association** — the application opens a document kind from the system's file browser — splits
into two halves that this skill's evidence covers unevenly:

- **The delivery half is verified.** On macOS the file arrives through the `open-file` event, which must be
  registered before the ready event; that mechanism and its launch-event trap are
  [`windows-lifecycle.md`](windows-lifecycle.md)'s.
- **The registration half belongs to the installer, and this skill states no mechanism for it.** Declaring
  which document kinds an application claims is per-system installer configuration, and
  [`packaging-distribution.md`](packaging-distribution.md) owns the installer targets. No primary source for
  the per-system registration syntax was read for this skill, so none is taught here. Take that question to
  the build tool's own documentation, and record what you find in the run's own design record rather than
  assuming a shape.

**What a run should do with that split.** Design the delivery path against the verified mechanism, and treat
registration as configuration to be proved by test rather than by reading — install the packaged artifact in
a clean environment, open a document of the claimed kind from the file browser, and observe whether the
application receives it. That test is already required: `DESK-R23` extends the verification order with an
install-and-smoke-test gate on the real artifact, and file-type association is exactly the class of behavior
that is unprovable before it.

**Claim only the kinds you tested, per system.** An association that works on one operating system is no
evidence at all about another — that is `DESK-FLOOR-04`'s per-system rule applied to this mechanic, and the
delivery routes above are different code paths on each system, so the usual reason for optimism does not
apply here either.

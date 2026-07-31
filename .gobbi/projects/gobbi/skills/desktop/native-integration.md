# Desktop Outcome Projection — Native Integration

This is a subordinate Desktop outcome projection. It owns only the product meaning and acceptance of native
interactions. It cannot replace an applicable Electron skill or define menus, tray, dock, notification,
dialog, clipboard, drag-and-drop, protocol, file-association, chrome, theme, shortcut, or accessibility
mechanisms.

Before using it, **MUST load [`electron`](../electron/SKILL.md)** and:

- [`electron-convention`](../electron/electron-convention/SKILL.md) for native defaults, security boundaries,
  ownership, errors, and platform conventions;
- [`electron-development`](../electron/electron-development/SKILL.md) for implementing or reviewing native
  behavior;
- [`electron-runtime`](../electron/electron-runtime/SKILL.md) for current APIs, capabilities, lifecycle,
  native mechanisms, and operating-system failures;
- [`electron-test`](../electron/electron-test/SKILL.md) for native, permission, cancellation, platform, and
  packaged evidence; and
- [`electron-release`](../electron/electron-release/SKILL.md) when a native promise depends on signing,
  packaging, installation, registration, or another release-artifact property.

## Desktop projection

For every proposed native interaction, record:

1. **Product purpose.** Which user outcome requires it, and why an ordinary renderer interaction is
   insufficient.
2. **Discoverability and convention.** How people on each claimed operating system find, understand, and
   invoke it, supported by direct evidence rather than presumed visual similarity.
3. **Action semantics.** The command, scope, state, repeated invocation, cancellation, denial, and completion
   the person experiences.
4. **Accessibility.** Keyboard and assistive-technology access, focus or cursor consequences, announcement
   or status, non-color cues, motion, adaptation, and platform-specific evidence.
5. **Safety.** Foreseeable consequence, refusal before commitment, recovery or undo, and treatment of
   untrusted external content or data.
6. **Lifecycle.** Whether it exists with no window, across window recreation, during shutdown, or after a
   second entry request.
7. **Platform claim.** The operating systems on which the exact promise is made and any intentionally
   different product behavior.
8. **Evidence.** The direct representative-user observation and the Electron test or release artifact that
   each claim needs.

Desktop may choose whether a menu command, background residency, notification, native dialog, clipboard
operation, drag, association, custom chrome, theme response, or shortcut belongs in the product. It must not
choose or restate the Electron API, event, setting, privilege placement, loader, registration, or platform
rule that implements it. Route those decisions to the applicable Electron children.

This projection is complete when every native interaction earns its place in the outcome, carries the four
Desktop floors and per-operating-system acceptance, and has its Electron implementation and evidence routed
without duplicated policy.

# Desktop Outcome Projection — Packaging and Distribution

This is a subordinate Desktop outcome projection. It describes the distribution promise and whole-outcome
acceptance; it cannot replace the Electron release or test skills and defines no installer target, build
tool, archive, fuse, native-module, resource-layout, signing, update, or platform policy.

Before using it, **MUST load [`electron`](../electron/SKILL.md)**,
[`electron-release`](../electron/electron-release/SKILL.md), and
[`electron-test`](../electron/electron-test/SKILL.md). Load
[`electron-convention`](../electron/electron-convention/SKILL.md),
[`electron-development`](../electron/electron-development/SKILL.md), or
[`electron-runtime`](../electron/electron-runtime/SKILL.md) as well whenever their root trigger applies.

## Desktop projection

Record the product’s distribution contract per claimed operating system:

| Field | Product commitment |
|---|---|
| Audience and channel | Who receives the application and through what authorized route? |
| Install outcome | What must a clean machine let the person install, launch, understand, and complete? |
| Included behavior | Which content, resources, native dependencies, registrations, and entry modes must survive packaging? |
| Data continuity | What existing data, settings, work in progress, and downgrade path must remain safe? |
| Accessibility and safety | Which floor claims must hold in the installed state? |
| Recovery | What happens after cancellation, interruption, failed install, failed launch, or uninstall? |
| Evidence | Which exact artifact and target environment prove each promise? |
| Authority | Which build, distribution, or publication actions are authorized, and which still require a decision? |

Desktop accepts the installed user outcome. `electron-release` exclusively chooses and verifies Electron
packaging, hardening, signing, target, resource, native-module, upgrade, and distribution mechanisms.
`electron-test` exclusively defines the Electron-specific packaged and installed evidence. Keep development,
packaged, installed, signed, and updated results as distinct claims.

A product claim for one operating system requires its own actual artifact and environment. A missing or
unrunnable artifact gate is a visible limitation that blocks that claim; it is not partial support.

This projection is complete when every claimed target has a decision-ready distribution promise, the
applicable Electron release and test work is complete, the installed product floors pass, and no external
publication occurs without explicit authority.

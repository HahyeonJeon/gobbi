---
name: desktop
description: "MUST load before coordinating an installable Electron and TypeScript application outcome, defining its observable installed-platform contract, choosing its observable design, or making desktop release judgments. Desktop is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Desktop

Desktop covers complete installable Electron and TypeScript outcomes, their observable installed-platform behavior, and their release judgments. Isolated renderer, language, browser, service, command-line, library, and bounded Electron-mechanism work remains with its direct owner.

This root owns navigation only. Load every applicable child below; when an outcome uses Electron, also load the [`electron`](../electron/SKILL.md) root and every applicable Electron child.

Four `web` children apply to an installed application and are loaded directly. [`web-interaction`](../web/web-interaction/SKILL.md) owns renderer interaction behavior — event and pointer contracts, keyboard operation, focus management, drag and gesture alternatives, and WAI-ARIA widget patterns — and [`web-observability`](../web/web-observability/SKILL.md) owns what the installed application emits, including main-process and renderer crash capture. [`web-configuration`](../web/web-configuration/SKILL.md) owns how per-environment values and secrets are supplied to the installed processes, while `desktop-release` keeps the fail-closed protected-secret storage rule and `desktop-contract` keeps the local-data contract around it. [`web-localization`](../web/web-localization/SKILL.md) owns the renderer's message catalogs, locale negotiation, `Intl` formatting, and right-to-left mirroring, while `desktop-contract` keeps the installed-platform behavior an operating-system language or region setting changes. `desktop-interface` still decides whether an interaction is warranted, `desktop-contract` still owns the observable installed-platform behavior around it, and `desktop-delivery` still coordinates the outcome rather than owning either policy.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`desktop-architecture`](desktop-architecture/SKILL.md) | preference | MUST load when choosing or reviewing an installed desktop application's in-application information architecture or renderer state architecture, covering view hierarchy, navigation without URLs, state ownership across processes and windows, and what a relaunch restores. |
| [`desktop-contract`](desktop-contract/SKILL.md) | tool | MUST load when defining or reviewing observable installed-desktop behavior across targets, entry modes, windows, lifecycle, native integration, local data, installation, updates, and recovery. |
| [`desktop-delivery`](desktop-delivery/SKILL.md) | operation | MUST load when coordinating one installable Electron and TypeScript application outcome across design, implementation, local data, packaging, updates, and release readiness. |
| [`desktop-interface`](desktop-interface/SKILL.md) | preference | MUST load when choosing or reviewing an installed desktop application's project identity, design-evidence threshold, interface concept exploration, aesthetic system, or interaction and motion intent. |
| [`desktop-release`](desktop-release/SKILL.md) | preference | MUST load when choosing desktop operating-system support, artifact evidence, local-data compatibility, update recovery, release readiness, or publication defaults. |

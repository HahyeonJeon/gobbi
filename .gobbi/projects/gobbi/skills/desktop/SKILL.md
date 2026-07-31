---
name: desktop
description: "MUST load before coordinating an installable Electron and TypeScript application outcome, defining its observable installed-platform contract, or making desktop release judgments. Desktop is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Desktop

Desktop covers complete installable Electron and TypeScript outcomes, their observable installed-platform behavior, and their release judgments. Isolated renderer, language, browser, service, command-line, library, and bounded Electron-mechanism work remains with its direct owner.

This root owns navigation only. Load every applicable child below; when an outcome uses Electron, also load the [`electron`](../electron/SKILL.md) root and every applicable Electron child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`desktop-contract`](desktop-contract/SKILL.md) | tool | Use when defining or reviewing observable installed-desktop behavior across targets, entry modes, windows, lifecycle, native integration, local data, installation, updates, and recovery. |
| [`desktop-delivery`](desktop-delivery/SKILL.md) | operation | Use when coordinating one installable Electron and TypeScript application outcome across design, implementation, local data, packaging, updates, and release readiness. |
| [`desktop-release`](desktop-release/SKILL.md) | preference | Use when choosing desktop operating-system support, artifact evidence, local-data compatibility, update recovery, release readiness, or publication defaults. |

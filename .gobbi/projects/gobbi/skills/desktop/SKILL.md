---
name: desktop
description: "MUST load when coordinating an installable Electron and TypeScript application outcome, working on Electron platform mechanics, or making desktop release judgments. Desktop is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Desktop

Desktop covers coordination of an installable Electron and TypeScript application outcome, Electron platform mechanics, and desktop release judgments. It excludes isolated renderer-only UI, UX, HTML, CSS, React, or TypeScript work, browser-only pages, services, command-line tools, and libraries.

This root owns navigation only. Load every child skill below whose trigger applies to the task.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`desktop-delivery`](desktop-delivery/SKILL.md) | operation | Use when coordinating one installable Electron and TypeScript application outcome across design, implementation, local data, packaging, updates, and release readiness. |
| [`desktop-electron`](desktop-electron/SKILL.md) | tool | Use when writing or reviewing Electron platform code, configuration, process boundaries, privileged bridges, window lifecycle, native integration, builds, or packages. |
| [`desktop-release`](desktop-release/SKILL.md) | preference | Use when choosing desktop operating-system support, artifact evidence, local-data compatibility, update recovery, release readiness, or publication defaults. |

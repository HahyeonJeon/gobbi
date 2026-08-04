---
name: desktop
description: "MUST load before working in desktop. Desktop is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Desktop

Desktop covers structure, interface, development, current operating-system facts, and release judgments for
installable Electron desktop applications written in TypeScript.

This root owns navigation only. Load every child below whose trigger applies.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`desktop-architecture`](desktop-architecture/SKILL.md) | preference | MUST load when choosing or reviewing view hierarchy, navigation, window model, activation request behavior, application-state ownership, or state restoration for an installable Electron desktop application written in TypeScript. |
| [`desktop-development`](desktop-development/SKILL.md) | operation | MUST load when coordinating a scoped change to an installable Electron desktop application written in TypeScript across requirements, design collaboration, implementation, software testing and verification, packaging, installed-artifact verification, release readiness, authorized publication or deployment, post-release operations, and maintenance. |
| [`desktop-interface`](desktop-interface/SKILL.md) | preference | MUST load when choosing or reviewing research evidence, interface requirements, product identity, interface concepts, prototypes, representative-user evidence, visual style, interaction or motion intent, accessibility, adaptation, success measures, or interface improvement decisions for an installable Electron desktop application written in TypeScript. |
| [`desktop-linux`](desktop-linux/SKILL.md) | tool | MUST load when looking up or diagnosing current Linux facts about compatibility, installation, runtime lifecycle, native integration, update, repair, uninstall, trust, or failure evidence for an installable Electron desktop application written in TypeScript. |
| [`desktop-macos`](desktop-macos/SKILL.md) | tool | MUST load when looking up or diagnosing current macOS facts about compatibility, installation, runtime lifecycle, native integration, update, repair, uninstall, trust, or failure evidence for an installable Electron desktop application written in TypeScript. |
| [`desktop-release`](desktop-release/SKILL.md) | preference | MUST load when judging target support, artifact and installed evidence, update and data compatibility, recovery, release readiness, rollout controls, or rollback and installed-version correction options for an installable Electron desktop application written in TypeScript. |
| [`desktop-windows`](desktop-windows/SKILL.md) | tool | MUST load when looking up or diagnosing current Windows facts about compatibility, installation, runtime lifecycle, native integration, update, repair, uninstall, trust, or failure evidence for an installable Electron desktop application written in TypeScript. |

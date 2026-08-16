---
name: desktop
description: "Desktop is a domain router for installable Electron desktop applications written in TypeScript. It covers product structure, design, lifecycle coordination, current operating-system facts, and release judgment."
allowed-tools: Read
skill-type: domain
---

# Desktop

Desktop covers product structure, interface design, development coordination, Windows, macOS, and Linux facts, and release judgments for installable Electron applications written in TypeScript.

Use it when work touches this domain and route the task to every applicable child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`desktop-architecture`](desktop-architecture/SKILL.md) | preference | Use it when choosing these product outcomes; operating-system and Electron facts, mechanisms, implementation, evidence, interface intent, coordination, and release judgment remain with their owners. |
| [`desktop-development`](desktop-development/SKILL.md) | operation | Use it when at least two owners are involved or the outcome claims an installed, release-ready, published, deployed, or maintained application; bounded single-owner work routes directly. |
| [`desktop-interface`](desktop-interface/SKILL.md) | preference | Use it when design evidence, identity, interaction and motion intent, accessibility, adaptation, expression, or success measures need judgment; development coordinates order, while architecture and implementation owners retain their boundaries. |
| [`desktop-linux`](desktop-linux/SKILL.md) | tool | Use it when a current Linux fact or diagnosis is needed; it does not choose product behavior or support, implement or test, use credentials, mutate systems, or coordinate a lifecycle. |
| [`desktop-macos`](desktop-macos/SKILL.md) | tool | Use it when a current macOS fact or diagnosis is needed; it does not choose product behavior or support, implement or test, use credentials, mutate systems, or coordinate a lifecycle. |
| [`desktop-release`](desktop-release/SKILL.md) | preference | Use it when deciding whether one exact desktop artifact and target are ready; Electron release mechanisms, packaged and installed evidence, credentials, publication, deployment, and other external actions remain elsewhere. |
| [`desktop-windows`](desktop-windows/SKILL.md) | tool | Use it when a current Windows fact or diagnosis is needed; it does not choose product behavior or support, implement or test, use credentials, mutate systems, or coordinate a lifecycle. |

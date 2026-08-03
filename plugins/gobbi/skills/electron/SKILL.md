---
name: electron
description: "MUST load before working in Electron. Electron is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Electron

Electron owns navigation for Electron platform work. It routes to focused child skills without repeating their policy or procedures.

Load every child whose trigger applies. A task may need several children, such as development plus design and testing.

An Electron renderer's interaction behavior — event and pointer contracts, keyboard operation, focus management, drag and gesture alternatives, and WAI-ARIA widget patterns — is owned by [`web-interaction`](../web/web-interaction/SKILL.md), which applies to any browser surface. Load it directly; Electron children own the process, bridge, window, and platform boundaries around the renderer rather than the behavior inside it. [`web-configuration`](../web/web-configuration/SKILL.md) is loaded the same way for how per-environment values and secrets are supplied to a main, preload, or renderer process, while `electron-design` keeps the privilege boundary deciding which process may hold a secret at all.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`electron-design`](electron-design/SKILL.md) | preference | MUST load when choosing or reviewing Electron security boundaries, project organization, bridges, IPC contracts, window ownership, native behavior, errors, or platform defaults. |
| [`electron-development`](electron-development/SKILL.md) | operation | MUST load when implementing or reviewing an Electron platform change across main, preload, renderer, utility, window, lifecycle, or native integration boundaries. |
| [`electron-release`](electron-release/SKILL.md) | operation | MUST load when packaging, signing, notarizing, upgrading, update-rehearsing, or preparing Electron artifacts for release. |
| [`electron-runtime`](electron-runtime/SKILL.md) | tool | MUST load when looking up Electron process capabilities, preload constraints, IPC mechanics, lifecycle behavior, native integrations, or platform-specific failures. |
| [`electron-testing`](electron-testing/SKILL.md) | operation | MUST load when designing, implementing, running, or interpreting Electron-specific tests across process, bridge, security, lifecycle, native, or packaged boundaries. |

---
name: electron
description: "Electron is a domain skill that routes application work to specialized guidance for installed behavior, delivery, technical design, development, interface design, observability, packaging, release, runtime behavior, and testing."
allowed-tools: Read
skill-type: domain
---

# Electron

Electron routes application work to the child skills that own each affected concern.

Use it when a task involves Electron so every applicable owner is identified and cross-cutting work follows all relevant child guidance.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`electron-contract`](electron-contract/SKILL.md) | preference | Use it when deciding installation, launch and alternate-entry behavior, windows and application lifetime, local data, updates, failures, uninstall, recovery, or support. |
| [`electron-delivery`](electron-delivery/SKILL.md) | operation | Use it when work needs accepted outputs from two or more owners or a coordinated path to a named terminal. |
| [`electron-design`](electron-design/SKILL.md) | preference | Use it when deciding process and trust boundaries, project structure, preload bridges, IPC contracts, state and resource ownership, window or view ownership, performance placement, or failure isolation. |
| [`electron-development`](electron-development/SKILL.md) | operation | Use it when source-scoped work involves main, preload, renderer, utility, window, lifecycle, or operating-system integration code. |
| [`electron-interface`](electron-interface/SKILL.md) | preference | Use it when deciding identity, concepts, information structure, visible states, content, feedback, interaction modalities, localization, target conventions, or success measures. |
| [`electron-observability`](electron-observability/SKILL.md) | operation | Use it when diagnostic signals need coordinated treatment from emission through stored arrival. |
| [`electron-packaging`](electron-packaging/SKILL.md) | operation | Use it when process entries, resources, ASAR placement, compiled modules, fuses, signing, notarization, installers, or final-byte verification are in scope. |
| [`electron-release`](electron-release/SKILL.md) | operation | Use it when establishing release readiness or carrying out an explicitly authorized external action for a named target, channel, and destination. |
| [`electron-runtime`](electron-runtime/SKILL.md) | tool | Use it when an Electron API, process capability, loader, lifecycle event, cross-process value, target prerequisite, or failure signal must be resolved against actual runtime facts. |
| [`electron-testing`](electron-testing/SKILL.md) | operation | Use it when process, bridge, security, lifecycle, operating-system integration, diagnostics, packaged, installed, or update claims need observable evidence. |

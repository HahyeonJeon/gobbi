---
name: css
description: "MUST load before working in CSS. CSS is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# CSS

CSS covers browser and Electron-renderer presentation work: implementation and review,
platform understanding, and valid project choices. Concerns owned by other domains remain
with those owners.

This root owns navigation only. Load every row whose trigger applies; one task may require
more than one child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`css-conventions`](css-conventions/SKILL.md) | preference | MUST load when a CSS task must decide whether a choice is valid and which project default applies, covering accessibility, target support, motion, evidence limits, cascade ownership, naming, custom-property and token interfaces, and layout adaptation. |
| [`css-development`](css-development/SKILL.md) | operation | MUST load when creating, changing, or reviewing CSS, including debugging expected to produce a CSS change and focused read-only assessment of existing CSS. |
| [`css-platform`](css-platform/SKILL.md) | tool | MUST load when understanding, inspecting, or diagnosing browser or Electron-renderer CSS behavior, including diagnosis before a CSS change, or when choosing runtime evidence for CSS. |

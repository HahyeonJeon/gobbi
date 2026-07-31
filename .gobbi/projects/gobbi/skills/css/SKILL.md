---
name: css
description: "MUST load before working in CSS. CSS is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# CSS

CSS covers browser and Electron-renderer presentation work: implementation, platform
understanding, validity constraints, project conventions, and focused review. Concerns owned
by other domains remain with those owners.

This root owns navigation only. Load every row whose trigger applies; one task may require
more than one child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`css-constraints`](css-constraints/SKILL.md) | preference | MUST load before creating, changing, or reviewing CSS, including debugging expected to produce a CSS change and choosing CSS conventions. |
| [`css-conventions`](css-conventions/SKILL.md) | preference | MUST load before creating, changing, or reviewing CSS, including debugging expected to produce a CSS change and choosing CSS conventions. |
| [`css-development`](css-development/SKILL.md) | operation | MUST load when creating or changing CSS, including debugging expected to produce a CSS change. |
| [`css-platform`](css-platform/SKILL.md) | tool | MUST load when understanding, inspecting, or diagnosing browser or Electron-renderer CSS behavior, including diagnosis before a CSS change, or when choosing runtime evidence for CSS. |
| [`css-review`](css-review/SKILL.md) | operation | MUST load when performing a focused review of existing CSS. |

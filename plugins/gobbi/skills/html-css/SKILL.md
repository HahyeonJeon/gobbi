---
name: html-css
description: "MUST load before working in HTML or CSS. HTML/CSS is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# HTML and CSS

Use this family for markup and presentation work across design, development, focused testing, platform facts,
semantics, conventions, and declarative motion. Product direction, application behavior, security, deployment,
and release remain with their established owners; [routing evidence](routing.md) names those boundaries and
[family vocabulary](vocabulary.md) defines the five project-specific terms used in this family.

This root owns navigation only. Load every child whose trigger matches the request; no child is a universal
prerequisite, and one task may load several children when it contains several independently owned claims.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`html-css-conventions`](html-css-conventions/SKILL.md) | preference | MUST load when choosing or reviewing binding presentation rules or overridable defaults for HTML/CSS source organization, cascade, selectors, public hooks, tokens, responsive adaptation, compatibility, or maintainability. |
| [`html-css-design`](html-css-design/SKILL.md) | preference | MUST load when choosing or reviewing an HTML/CSS system's structural regions and relationships, layout architecture, responsive or adaptive strategy, state-to-presentation mapping, material variants, or public markup and styling interface shape. |
| [`html-css-development`](html-css-development/SKILL.md) | operation | MUST load when creating, changing, repairing, maintaining, migrating, or performing a protected read-only review of HTML, CSS, generated markup or styling output, or their public interfaces and consumers. |
| [`html-css-motion`](html-css-motion/SKILL.md) | preference | MUST load when choosing or reviewing declarative CSS motion mechanics or motion-system defaults for transitions, animations, timing, interruption, cancellation, reduced motion, or performance-sensitive motion choices. |
| [`html-css-platform`](html-css-platform/SKILL.md) | tool | MUST load when interpreting or verifying HTML/CSS conformance, parsing, parser-produced DOM, native HTML behavior, CSSOM, matching, cascade, computed values, layout, overflow, paint, compositing, rendering, direct target support, or browser and Electron-renderer diagnosis. |
| [`html-css-semantics`](html-css-semantics/SKILL.md) | preference | MUST load when choosing or reviewing HTML elements, relationships, names, roles, states, language, direction, or accessibility meaning. |
| [`html-css-testing`](html-css-testing/SKILL.md) | operation | MUST load when designing, writing, running, diagnosing, or reviewing focused tests for an HTML/CSS contract, generated or conditional output, or direct browser or Electron-renderer behavior claimed by that contract. |

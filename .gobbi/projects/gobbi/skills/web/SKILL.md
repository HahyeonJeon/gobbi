---
name: web
description: "MUST load before working in web. Web is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Web

Web routes bounded feature delivery, browser-facing work, interaction behavior, authoritative backend work,
project topology, security assurance, testing, diagnostic emission, per-environment configuration and secret
supply, production build and deployment, Web Platform interpretation, and structural web choices.

The root owns navigation only. Load every row whose trigger applies; each child owns its complete operation,
manual, or preferences.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`web-architecture`](web-architecture/SKILL.md) | preference | MUST load when choosing or reviewing client-server boundaries, rendering and delivery, navigation, state ownership, caching, progressive enhancement, or dependency strategy for a web application. |
| [`web-backend`](web-backend/SKILL.md) | operation | MUST load when designing, building, or reviewing a web feature's server, API, domain, data, provider, authorization, or operational behavior. |
| [`web-configuration`](web-configuration/SKILL.md) | preference | MUST load when choosing or reviewing how a web or Electron surface is supplied with per-environment values, covering build-time versus runtime configuration, secret supply and the client-bundle boundary, feature-flag lifetime, and startup validation. |
| [`web-deployment`](web-deployment/SKILL.md) | operation | MUST load when configuring a web build for production or when deploying, verifying, or reversing a web release, covering bundler configuration, chunking, asset hashing, production source maps, rollout, and rollback. |
| [`web-feature`](web-feature/SKILL.md) | operation | MUST load when delivering or reviewing one bounded web application feature across its required layers through a release-ready handoff. |
| [`web-frontend`](web-frontend/SKILL.md) | operation | MUST load when designing, building, or reviewing a web feature's browser-facing interface and experience. |
| [`web-interaction`](web-interaction/SKILL.md) | preference | MUST load when choosing or reviewing a browser feature's interaction behavior, covering event and pointer contracts, keyboard operation, focus management, drag and gesture alternatives, listener hygiene and rate limiting, and WAI-ARIA widget patterns. |
| [`web-interface`](web-interface/SKILL.md) | preference | MUST load when choosing or reviewing a browser feature's project identity, design-evidence threshold, interface concept exploration, aesthetic system, or interaction and motion intent. |
| [`web-observability`](web-observability/SKILL.md) | operation | MUST load when instrumenting or reviewing what a web or Electron surface emits, covering structured logs, metrics, traces, trace-context propagation, crash and unhandled-error capture, and diagnostic redaction. |
| [`web-platform`](web-platform/SKILL.md) | tool | MUST load when interpreting or verifying browser and Web Platform behavior, security boundaries, lifecycle, compatibility, accessibility, performance evidence, or diagnostics. |
| [`web-security`](web-security/SKILL.md) | operation | MUST load when a web change crosses a trust boundary; handles identity, sessions, protected or sensitive data; accepts untrusted content; changes authorization, providers, dependencies, security configuration, or public exposure; or requires security review. |
| [`web-testing`](web-testing/SKILL.md) | operation | MUST load when designing, writing, running, diagnosing, or reviewing tests for a web application or feature. |
| [`web-topology`](web-topology/SKILL.md) | preference | MUST load when establishing or reviewing a web project's directory structure, workspace/application roots, source/runtime/test/configuration/asset/migration/shared/generated-output placement, or a topology exception. |

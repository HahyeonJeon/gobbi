---
name: web
description: "MUST load before working in web. Web is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Web

Web routes product design, coordinated development, browser and PWA runtime behavior, browser-facing work,
interaction behavior, server-side work, project structure, security assurance, testing, telemetry,
per-environment configuration and secrets management, production release and deployment, internationalization
and localization, supported live-service operations, Web Platform interpretation, and structural web choices.

The root owns navigation only. Load every row whose trigger applies; each child owns its complete operation,
tool, or preferences.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`web-app-lifecycle`](web-app-lifecycle/SKILL.md) | preference | MUST load when choosing or reviewing browser or PWA behavior for startup, readiness, restoration, foreground and background transitions, freeze or discard, offline and reconnect, service-worker updates, mixed versions, browser-managed PWA installation state, cleanup, or removal. |
| [`web-architecture`](web-architecture/SKILL.md) | preference | MUST load when choosing or reviewing client-server boundaries, rendering and delivery, navigation, state ownership, caching, progressive enhancement, or dependency strategy for a web application. |
| [`web-backend`](web-backend/SKILL.md) | operation | MUST load when designing, building, or reviewing a web change's server, API, domain rules, data lifecycle, provider integration, authorization, or server-side recovery. |
| [`web-configuration`](web-configuration/SKILL.md) | preference | MUST load when choosing or reviewing how a web app or Electron renderer receives per-environment values, including build-time versus runtime configuration, secrets management, client-bundle exposure, feature-flag lifetime, or startup validation. |
| [`web-deployment`](web-deployment/SKILL.md) | operation | MUST load when deploying an accepted web release to an authorized environment, verifying the production URL, advancing or stopping a rollout, or rolling back the environment. |
| [`web-design`](web-design/SKILL.md) | preference | MUST load when choosing or reviewing a web product's design problem, project identity, user-evidence threshold, alternative concepts, accepted design, validation judgment, post-release learning, replacement, or retirement criteria. |
| [`web-development`](web-development/SKILL.md) | operation | MUST load when coordinating or reviewing one web change across design, implementation, testing, release, deployment, live learning, iteration, and retirement handoffs. |
| [`web-frontend`](web-frontend/SKILL.md) | operation | MUST load when implementing or reviewing a web change's browser-facing interface, content, accessibility, responsive behavior, recovery, or user-visible integration. |
| [`web-interaction`](web-interaction/SKILL.md) | preference | MUST load when choosing or reviewing browser interaction behavior, including event and pointer contracts, keyboard operation, focus management, drag and gesture alternatives, listener lifetime and rate limiting, or WAI-ARIA widget patterns. |
| [`web-localization`](web-localization/SKILL.md) | preference | MUST load when choosing or reviewing how a web app or Electron renderer handles language and region, including message catalogs, plural and grammatical selection, date, number, and currency formatting, locale negotiation, or right-to-left layout. |
| [`web-observability`](web-observability/SKILL.md) | operation | MUST load when instrumenting or reviewing telemetry from a web app or Electron renderer, including structured logs, metrics, traces, trace-context propagation, crash and unhandled-error capture, or diagnostic redaction. |
| [`web-operations`](web-operations/SKILL.md) | operation | MUST load when operating or reviewing a live web service, including health and support, incident response, routine maintenance, dependency and compatibility updates, deprecation, or retirement. |
| [`web-platform`](web-platform/SKILL.md) | tool | MUST load when interpreting or verifying browser and Web Platform behavior, security boundaries, lifecycle, compatibility, accessibility, performance evidence, or diagnostics. |
| [`web-project-structure`](web-project-structure/SKILL.md) | preference | MUST load when establishing or reviewing a web project's directory structure, workspace or application roots, source, runtime, test, configuration, asset, migration, shared, generated, build, or deployable-output placement, or a documented placement exception. |
| [`web-release`](web-release/SKILL.md) | operation | MUST load when producing or reviewing a web production build or release artifact, including frozen inputs, bundler configuration, chunking, asset names and cache policy, build identity, production source maps, or the artifact handoff to deployment. |
| [`web-security`](web-security/SKILL.md) | operation | MUST load when a web change crosses a trust boundary; handles identity, sessions, protected or sensitive data; accepts untrusted content; changes authorization, providers, dependencies, security configuration, or public exposure; or requires security review. |
| [`web-testing`](web-testing/SKILL.md) | operation | MUST load when designing, writing, running, diagnosing, or reviewing tests for a web application or change. |

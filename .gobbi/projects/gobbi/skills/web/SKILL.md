---
name: web
description: "Web is a domain skill that routes work to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Web

Web is the navigation root for product, implementation, platform, release, deployment, and live-service work. Use it when a task touches the web domain so every applicable child owner can be identified.

The root routes work only; each child owns its full operation, tool guidance, or preferences.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`web-app-lifecycle`](web-app-lifecycle/SKILL.md) | preference | Use it when choosing or reviewing any of those states or transitions. |
| [`web-architecture`](web-architecture/SKILL.md) | preference | Use it when choosing or reviewing structural boundaries for a web application. |
| [`web-backend`](web-backend/SKILL.md) | operation | Use it when designing, building, or reviewing server, API, domain, data, provider, authorization, or server-side recovery work. |
| [`web-configuration`](web-configuration/SKILL.md) | preference | Use it when choosing or reviewing build-time versus runtime supply, client exposure, secret delivery, flag lifetime, or startup validation. |
| [`web-deployment`](web-deployment/SKILL.md) | operation | Use it when deploying, staging a rollout, verifying the live target, stopping, or rolling back. |
| [`web-design`](web-design/SKILL.md) | preference | Use it when choosing or reviewing the problem, identity source, evidence threshold, concepts, accepted design, reopen decision, or end-of-life criteria. |
| [`web-development`](web-development/SKILL.md) | operation | Use it when coordinating or reviewing work across design, implementation, testing, release, deployment, live learning, iteration, maintenance, and retirement. |
| [`web-frontend`](web-frontend/SKILL.md) | operation | Use it when implementing or reviewing the interface and its real browser integration. |
| [`web-interaction`](web-interaction/SKILL.md) | preference | Use it when choosing or reviewing event contracts, pointer and keyboard equivalence, focus management, gesture alternatives, listener lifetime, rate limiting, or WAI-ARIA widget patterns. |
| [`web-localization`](web-localization/SKILL.md) | preference | Use it when choosing or reviewing message catalogs, grammatical selection, formatting, locale negotiation, translated content, or right-to-left behavior. |
| [`web-observability`](web-observability/SKILL.md) | operation | Use it when instrumenting or reviewing emission, context propagation, crash capture, redaction, destination arrival, or lifecycle flush behavior. |
| [`web-operations`](web-operations/SKILL.md) | operation | Use it when operating or reviewing any part of that supported service lifetime. |
| [`web-platform`](web-platform/SKILL.md) | tool | Use it when interpreting or verifying browser behavior, compatibility, lifecycle, security boundaries, accessibility, performance evidence, or diagnostics. |
| [`web-project-structure`](web-project-structure/SKILL.md) | preference | Use it when establishing or reviewing those paths or a documented placement exception. |
| [`web-release`](web-release/SKILL.md) | operation | Use it when producing or reviewing production inputs, bundler output, chunking, asset names, cache policy, build identity, source maps, manifests, digests, or the deployment handoff. |
| [`web-security`](web-security/SKILL.md) | operation | Use it when a change crosses trust boundaries, handles identity or protected data, accepts untrusted content, changes authorization or exposure, or needs security review. |
| [`web-testing`](web-testing/SKILL.md) | operation | Use it when designing, writing, running, diagnosing, or reviewing tests for a web application or change. |

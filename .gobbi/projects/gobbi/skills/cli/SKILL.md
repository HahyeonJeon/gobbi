---
name: cli
description: "CLI is a domain router for line-oriented command-line products, with TypeScript-specific development and release coverage."
allowed-tools: Read
skill-type: domain
---

# CLI

CLI covers command contracts, terminal expression, execution-platform facts, lifecycle coordination, release judgment, and security for line-oriented command-line products.

Use it when work touches this product domain and route the task to every applicable child; development and release are TypeScript-scoped, and Bun applies only when named.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`cli-architecture`](cli-architecture/SKILL.md) | preference | Use it when choosing or reviewing command meaning before expression or implementation; terminal wording, current platform facts, assurance, realization, evidence, delivery, and support remain with their owners. |
| [`cli-development`](cli-development/SKILL.md) | operation | Use it when two or more owners must agree or the outcome claims support, delivery, release, maintenance, deprecation, or retirement; bounded single-owner work goes directly to that owner. |
| [`cli-interface`](cli-interface/SKILL.md) | preference | Use it after command meaning and stream roles are accepted; it does not alter semantics or choose renderer, platform, security, implementation, evidence, support, paging, or full-screen behavior. |
| [`cli-platform`](cli-platform/SKILL.md) | tool | Use it when a current platform fact or bounded diagnosis is needed; it does not make product, interface, security, implementation, evidence, delivery, or support decisions. |
| [`cli-release`](cli-release/SKILL.md) | preference | Use it when support matrices, consumer evidence, compatibility, recovery, rollout, support, deprecation, or retirement need judgment; build, test, packaging, credential, publication, installation, and rollout actions remain elsewhere. |
| [`cli-security`](cli-security/SKILL.md) | operation | Use it when untrusted input, trust boundaries, destructive or partial effects, credentials, updates, telemetry, or terminal control are in scope; testing, implementation, artifact, delivery, release action, and risk acceptance remain with their owners. |

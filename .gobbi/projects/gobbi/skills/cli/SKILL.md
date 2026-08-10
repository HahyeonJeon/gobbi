---
name: cli
description: "MUST load before choosing or reviewing command hierarchy, command, option, or operand semantics, configuration sources or precedence, semantic result or error models, stream roles, exit-status contracts, public modes, compatibility, deprecation, or retirement for a line-oriented CLI; coordinating a scoped change to a line-oriented TypeScript CLI across accepted product contracts, security analysis, TypeScript implementation and testing, Bun and platform facts, package or direct delivery, release judgment, authorized external action, post-release observation, or maintenance; choosing or reviewing help and discovery content, terminal wording, human, plain, or structured rendering within accepted stream roles, diagnostics, prompts, progress, visualization, accessibility, localization, or adaptive presentation for a line-oriented CLI; looking up or diagnosing current command-line execution-platform facts about terminals, standard streams, process lifecycle, pipes, signals, shell entry, path resolution, encoding, locale, or operating-system differences for a line-oriented CLI; choosing or reviewing supported runtime, target, or delivery policy, required consumer evidence, runtime, artifact, installation, or data compatibility, release readiness, rollout controls, recovery, rollback, forward-fix, support, deprecation, or retirement for a line-oriented TypeScript CLI; or handling a line-oriented CLI change that accepts untrusted input, crosses a filesystem, process, shell, network, credential, update, telemetry, or terminal-control trust boundary, can cause destructive or partial effects, or requires CLI security analysis. CLI is a domain skill that routes line-oriented command-line work to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# CLI

CLI covers product structure, terminal expression, development coordination, current execution-platform facts,
security analysis, and release judgment for line-oriented TypeScript command-line tools with Bun as the primary
runtime.

This root owns navigation only. For every task that activates it, load at least one child and every row whose
trigger applies; one task may require several children. Do not load a child whose trigger does not apply, and
route work outside this line-oriented product domain to its owning skill.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`cli-architecture`](cli-architecture/SKILL.md) | preference | MUST load when choosing or reviewing command hierarchy, command, option, or operand semantics, configuration sources or precedence, semantic result or error models, stream roles, exit-status contracts, public modes, compatibility, deprecation, or retirement for a line-oriented CLI. |
| [`cli-development`](cli-development/SKILL.md) | operation | MUST load when coordinating a scoped change to a line-oriented TypeScript CLI across accepted product contracts, security analysis, TypeScript implementation and testing, Bun and platform facts, package or direct delivery, release judgment, authorized external action, post-release observation, or maintenance. |
| [`cli-interface`](cli-interface/SKILL.md) | preference | MUST load when choosing or reviewing help and discovery content, terminal wording, human, plain, or structured rendering within accepted stream roles, diagnostics, prompts, progress, visualization, accessibility, localization, or adaptive presentation for a line-oriented CLI. |
| [`cli-platform`](cli-platform/SKILL.md) | tool | MUST load when looking up or diagnosing current command-line execution-platform facts about terminals, standard streams, process lifecycle, pipes, signals, shell entry, path resolution, encoding, locale, or operating-system differences for a line-oriented CLI. |
| [`cli-release`](cli-release/SKILL.md) | preference | MUST load when choosing or reviewing supported runtime, target, or delivery policy, required consumer evidence, runtime, artifact, installation, or data compatibility, release readiness, rollout controls, recovery, rollback, forward-fix, support, deprecation, or retirement for a line-oriented TypeScript CLI. |
| [`cli-security`](cli-security/SKILL.md) | operation | MUST load when a line-oriented CLI change accepts untrusted input, crosses a filesystem, process, shell, network, credential, update, telemetry, or terminal-control trust boundary, can cause destructive or partial effects, or requires CLI security analysis. |

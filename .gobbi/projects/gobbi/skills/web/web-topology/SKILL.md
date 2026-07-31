---
name: web-topology
description: "MUST load when establishing or reviewing a web project's directory structure, workspace/application roots, source/runtime/test/configuration/asset/migration/shared/generated-output placement, or a topology exception."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion, WebSearch, WebFetch
skill-type: preference
---

# Web Topology

This preference skill guides web project topology: roots, applications, packages, source, routes, assets,
tests, configuration, migrations, scripts, documentation, shared code, generated content, caches, builds, and
deployable outputs.

It does not own UI or API conventions, naming, imports, formatting, or language and framework code style.
Required framework and tool structure takes precedence over project preferences.

## Principles

### Required structure comes first

Framework, runtime, workspace, build, and deployment constraints define the valid choice space.

### Sound existing topology is evidence

Preserve a structure that remains clear, compatible, and operable instead of reorganizing it for novelty.

### Topology should expose ownership and authority

Group material by who owns it and why it changes, while keeping browser, server, and privileged boundaries
visible.

### Path classes have different lifecycles

Source, generated content, caches, secrets, published assets, builds, and deployable outputs are not
interchangeable.

## Rules

- **MUST settle topology choices in this order: required framework and tool structure, sound existing
  topology, the smallest ownership-based project structure, then external exemplars.** Use exemplars only
  when the first three do not settle a material choice.
- **MUST name the project or workspace root and every application or package root.** Name the owner of each
  application, package, configuration class, generated output, cache, build output, and deployable output.
- **MUST preserve framework-, runtime-, workspace-, build-, and deployment-reserved paths.** Official
  [Next.js](https://nextjs.org/docs/app/getting-started/project-structure),
  [Angular](https://angular.dev/reference/configs/file-structure), and
  [Vite](https://vite.dev/config/shared-options.html) guidance shows why required paths and configurable
  roots must be verified for the selected stack.
- **MUST keep browser, server, shared, data or migration, test, and operational boundaries visible where
  applicable.** A shared directory may not hide browser-only, server-only, secret, or privileged authority.
- **MUST distinguish source-controlled, generated, cached, secret, published, and deployable content.** State
  which process creates, consumes, invalidates, cleans, publishes, or deploys each class.
- **NEVER make a topology departure or code-style claim outside this skill's boundary.** Leave naming,
  imports, formatting, and internal idioms to their owners, and record departure evidence, blast radius,
  migration, compatibility, rollback, and reopen condition.

## Preferences

### PREFER sound existing topology

PREFER the established tree when ownership, runtime boundaries, discovery, compatibility, and operations
remain clear. Depart only for concrete contrary evidence and change the smallest affected boundary.

### PREFER grouping by ownership and reason to change

PREFER colocating feature-specific code, assets, and tests when required paths permit it. Centralize material
only when it has multiple real consumers, one owner, an explicit public surface, and compatible runtime
authority.

### PREFER discoverable entry points and authority

PREFER easy-to-find application entries, route owners, configuration inheritance, tests, migrations,
generated outputs, and deployable artifacts. Depart only when a required tool path or measured project need
makes another placement clearer.

### PREFER one project strategy

PREFER one consistent placement strategy when the selected framework permits alternatives. Use a documented
exception only when ownership, compatibility, or lifecycle evidence earns the difference.

## References

---
name: python-project-structure
description: "Python Project Structure provides overridable preferences for workspace, source, test, configuration, generated-output, cache, and non-distribution artifact placement."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Python Project Structure

Python Project Structure guides placement of workspace, application, source, tests, configuration, generated output, caches, and non-distribution artifacts.

Use it when authors or reviewers establish or assess path ownership and lifecycle under project, framework, runtime, and build constraints. Distribution-sensitive layout decisions also require Python Packaging.

## Principles

### Required paths set the valid space

Project configuration and selected framework or runtime rules constrain placement before generic Python examples.
Keep a clear established tree when it still satisfies those constraints.

### Make ownership and lifecycle visible

Roots, applications, source, tests, configuration, generated output, caches, and build output change for different
reasons. Their paths should show who owns them and which process creates, consumes, invalidates, or retains them.

### Separate organization from distribution behavior

An ordinary source or test location is a workspace decision. A placement that changes package discovery, included
files, import resolution after installation, or an installed consumer's behavior is also a packaging decision.

## Rules

- **MUST apply required project, framework, runtime, workspace, build, deployment, and project-configuration
  paths before generic placement preferences.** Preserve a coherent existing structure unless concrete contrary
  evidence requires a bounded change.
- **MUST identify the workspace, application, package, source, test, configuration, generated-output, cache, and
  build-output roots that apply, with their owner and lifecycle class.** Do not place generated, cached, secret,
  source-controlled, or deployable material as though it has the same retention or authority.
- **MUST make a placement exception explain its owner, reason to change, affected consumers, compatibility
  boundary, and recovery or reopen condition.** A new directory alone is not sufficient rationale.
- **MUST route a choice to `python-packaging` when it changes `pyproject.toml` packaging semantics, package
  discovery, distribution artifact contents, import behavior after installation, or installed-consumer evidence.**
  Load both skills when organization and distribution behavior are independently affected.
- **NEVER prescribe a universal application tree, framework layout, `src` layout, flat layout, build backend, or
  test location.** Project constraints and the affected consumer decide the valid arrangement.
- **NEVER own distribution artifacts or package-install behavior.** `python-packaging` owns their construction and
  validation; `python-release` owns only immutable-artifact readiness coordination.

## Preferences

### Preserve a sound existing tree

PREFER the established project tree when ownership, discovery, runtime boundaries, and maintenance remain clear.
Depart only for a required path, a proven consumer or compatibility need, or a documented lifecycle conflict, and
change the smallest affected boundary.

### Place by ownership and reason to change

PREFER colocating narrow feature code, tests, and local assets when required paths permit it. Move material to a
shared location only after it has multiple real consumers, one clear owner, and compatible runtime authority;
generated output, caches, and build products remain in their distinct lifecycle paths.

### Keep roots and configuration discoverable

PREFER visible entry points and explicit locations for applications, packages, configuration, scripts,
documentation, tests, and generated-output rules. A selected framework's convention or an established project
workflow may justify a less direct path when the owner and discovery rule remain documented.

### Treat distribution-sensitive layouts as a joint concern

PREFER following Rule 4 for a `src` or flat-layout choice that affects installed behavior; use this skill alone only for purely organizational placement. [PyPA layout guidance](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.

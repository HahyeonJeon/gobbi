# Python Project Structure Evaluation Checklist

This unchecked source evaluates one general Python workspace-placement decision governed by
[`python-project-structure`](SKILL.md). It covers roots and lifecycle-aware placement, not `pyproject.toml`
packaging semantics, package discovery, distribution artifacts, or installed-consumer behavior.

## Design lifecycle

### Placement contract

- [ ] The required project, framework, runtime, workspace, build, deployment, and configuration paths that apply are identified.
- [ ] The workspace, application, package, source, test, configuration, generated-output, cache, and build-output roots that apply are identified.
- [ ] Each identified root has an owner, discovery boundary, and lifecycle class.
- [ ] An existing project structure is retained when it satisfies required paths, ownership visibility, and affected-consumer needs.

### Boundary classification

- [ ] Source-controlled, generated, cached, secret, published, deployable, and temporary material that apply have distinct retention and authority boundaries.
- [ ] A placement exception identifies its owner, reason to change, affected consumer, compatibility boundary, and reopen or recovery condition.
- [ ] A layout choice that changes package discovery, distribution content, import behavior after installation, or installed-consumer evidence is identified as a `python-packaging` concern.
- [ ] A mixed organizational and installed-behavior decision identifies both `python-project-structure` and `python-packaging` boundaries.

## Development lifecycle

### Path implementation

- [ ] Application, package, source, test, configuration, script, documentation, generated-output, cache, and build-output paths follow the applicable project convention.
- [ ] Generated output and caches are not represented as source-controlled inputs without an identified producer and invalidation rule.
- [ ] A shared path has multiple real consumers, one clear owner, and compatible runtime authority.
- [ ] A feature-local path remains colocated where required paths permit it and no independent consumer needs a shared boundary.

## Product lifecycle

### Discovery and distribution boundary

- [ ] A consumer can find the applicable entry point, configuration, tests, documentation, and generated-output rule from the recorded project structure.
- [ ] A path change identifies affected developer, runtime, build, deployment, and compatibility consumers that apply.
- [ ] No universal framework tree, `src` layout, flat layout, build backend, or test location is represented as required for Python projects.
- [ ] No project-structure account claims ownership of package metadata, package discovery, distribution artifacts, installed behavior, or release readiness.

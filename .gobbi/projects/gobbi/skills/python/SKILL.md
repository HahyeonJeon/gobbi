---
name: python
description: "Python is a navigation-only domain that routes tasks to focused operation, tool, and preference skills."
allowed-tools: Read
skill-type: domain
---

# Python

Python routes design, implementation, review, debugging, testing, packaging, release, and performance work to focused children.

Use it when a Python task requires selecting every child whose trigger applies. It owns navigation only, and each activated task selects at least one child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`python-conventions`](python-conventions/SKILL.md) | preference | Use it when authors or reviewers make written-form choices after project rules, supported syntax, and public spellings are known. |
| [`python-debugging`](python-debugging/SKILL.md) | operation | Use it when evidence is needed to identify a root cause or define a bounded diagnostic plan before repair. |
| [`python-design`](python-design/SKILL.md) | preference | Use it when authors or reviewers define observable behavior, failure paths, mutation, or cleanup under project and runtime constraints. |
| [`python-development`](python-development/SKILL.md) | operation | Use it when accepted implementation requirements are studied or Python code is designed, changed, reviewed, or verified. |
| [`python-packaging`](python-packaging/SKILL.md) | operation | Use it when packaging inputs or outputs must be established or proven from project configuration through an isolated installed consumer. |
| [`python-performance`](python-performance/SKILL.md) | operation | Use it when a measured claim needs a representative workload, comparable baseline, and bounded conclusion. |
| [`python-project-structure`](python-project-structure/SKILL.md) | preference | Use it when authors or reviewers establish or assess path ownership and lifecycle under project, framework, runtime, and build constraints. |
| [`python-release`](python-release/SKILL.md) | operation | Use it after Python Packaging has supplied exact artifact and installed-consumer evidence. |
| [`python-testing`](python-testing/SKILL.md) | operation | Use it when tests or other repeatable checks must establish a bounded correctness claim. |
| [`python-toolchain`](python-toolchain/SKILL.md) | tool | Use it when establishing or diagnosing the exact executable, configuration, effects, and limits behind a platform or tool observation. |
| [`python-typing`](python-typing/SKILL.md) | preference | Use it when authors or reviewers model states and relationships after runtime and API behavior are known. |

---
name: python
description: "MUST load before working in Python. Python is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Python

Python is the domain family for agents designing, implementing, reviewing, debugging, testing, packaging,
releasing, or measuring Python software. Its children separate focused operations, interpreter and tool guidance,
and preferences so a task loads only the guidance it needs.

This root owns navigation only. Load every child whose trigger applies; a Python task may need multiple children,
and every task that activates this root must select at least one child.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`python-conventions`](python-conventions/SKILL.md) | preference | MUST load when Python names, written forms, comments, documentation style, or formatting choices are made or reviewed. |
| [`python-debugging`](python-debugging/SKILL.md) | operation | MUST load when a Python failure, unexpected result, diagnostic, or runtime symptom must be reproduced, isolated, or explained. |
| [`python-design`](python-design/SKILL.md) | preference | MUST load when Python APIs, modules, functions, classes, objects, errors, data ownership, or resource lifetimes are designed or reviewed. |
| [`python-development`](python-development/SKILL.md) | operation | MUST load when Python implementation requirements are studied or Python code is designed, changed, reviewed, or verified. |
| [`python-packaging`](python-packaging/SKILL.md) | operation | MUST load when Python package build metadata, distribution identity, artifacts, installed behavior, or installed-consumer tests are created, changed, or validated. |
| [`python-performance`](python-performance/SKILL.md) | operation | MUST load when a measured Python latency, throughput, CPU, allocation, memory, startup, or resource claim is investigated or changed. |
| [`python-project-structure`](python-project-structure/SKILL.md) | preference | MUST load when Python workspace, application, package, source, test, configuration, generated-output, or artifact placement is established or reviewed. |
| [`python-release`](python-release/SKILL.md) | operation | MUST load when immutable Python artifact evidence is used to coordinate version readiness, authorized publication verification, or recovery. |
| [`python-testing`](python-testing/SKILL.md) | operation | MUST load when Python tests or other executable correctness evidence are designed, written, reviewed, or run. |
| [`python-toolchain`](python-toolchain/SKILL.md) | tool | MUST load when Python distribution tools, interpreter behavior, project-pinned tooling, or tool diagnostics are used or assessed. |
| [`python-typing`](python-typing/SKILL.md) | preference | MUST load when Python annotations, type expressions, narrowing, generics, public type surfaces, or typing trade-offs are designed or reviewed. |

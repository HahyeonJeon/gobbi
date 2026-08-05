---
name: go
description: "MUST load before working in Go. Go is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Go

Go is the domain family for agents designing, implementing, reviewing, diagnosing, testing, packaging, or
releasing Go software. Its children separate operations, tool guidance, and preferences so tasks load only
applicable guidance.

This root owns navigation only. Load every child whose trigger matches the task, including multiple children
when several triggers apply.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`go-architecture`](go-architecture/SKILL.md) | operation | MUST load when designing or reviewing the architecture of a Go application, service, command, library, or multi-package system, including package boundaries, dependency direction, process boundaries, configuration ownership, data flow, failure containment, or validation strategy. |
| [`go-concurrency`](go-concurrency/SKILL.md) | preference | MUST load when working with goroutines, channels, context.Context, sync, atomics, timers, concurrent ownership, cancellation, shutdown, backpressure, or race safety. |
| [`go-conventions`](go-conventions/SKILL.md) | preference | MUST load when choosing or reviewing Go package names, identifiers, receiver names, source file names, import aliases, error text, or project-wide written-form conventions. |
| [`go-debugging`](go-debugging/SKILL.md) | operation | MUST load when reproducing, diagnosing, or isolating a Go failure, panic, deadlock, race symptom, leak, corruption, unexpected result, or tool diagnostic. |
| [`go-design`](go-design/SKILL.md) | preference | MUST load when designing or reviewing Go packages, public APIs or CLIs, functions, structs, methods, values and pointers, interfaces, errors, generics, mutable-data ownership, or ordinary resource lifetime. |
| [`go-development`](go-development/SKILL.md) | operation | MUST load when implementing, changing, or reviewing Go code through study, design, bottom-up construction, and verification. |
| [`go-documentation`](go-documentation/SKILL.md) | preference | MUST load when writing or reviewing Go package comments, declaration comments, doc-comment links or headings, or implementation comments. |
| [`go-modules`](go-modules/SKILL.md) | operation | MUST load when creating, changing, or validating a Go module, including its path, layout, go.mod, go.work, dependencies, tools, external-consumer validation, and compatibility analysis. |
| [`go-observability`](go-observability/SKILL.md) | operation | MUST load when designing, implementing, reviewing, or verifying logs, metrics, traces, trace-context propagation, crash capture, diagnostic redaction, correlation, or runtime health signals in Go software. |
| [`go-packaging`](go-packaging/SKILL.md) | operation | MUST load when producing or validating Go binaries or archives, including the project default build command, named GOOS/GOARCH targets, metadata, checksums, reproducibility, and artifact smoke checks. |
| [`go-performance`](go-performance/SKILL.md) | operation | MUST load when diagnosing or changing Go latency, throughput, allocation, memory retention, garbage collection, CPU use, contention, binary size, startup time, or profile-guided optimization. |
| [`go-release`](go-release/SKILL.md) | operation | MUST load when versioning, publishing, verifying, or recovering a Go module, binary, or archive release. |
| [`go-security`](go-security/SKILL.md) | operation | MUST load when Go work crosses a trust boundary; handles untrusted input, identity, authorization, cryptography, secrets, sensitive data, dependencies, vulnerability findings, network exposure, or security review. |
| [`go-source`](go-source/SKILL.md) | preference | MUST load when choosing or reviewing Go source file organization, canonical formatting, import grouping, blank or dot imports, or generated source provenance. |
| [`go-testing`](go-testing/SKILL.md) | operation | MUST load when designing, writing, reviewing, or executing Go tests, examples, fuzz targets, benchmarks, coverage checks, or race-detector evidence. |
| [`go-toolchain`](go-toolchain/SKILL.md) | tool | MUST load when using or diagnosing the Go distribution, go command, compiler, formatter, vet, generators, build constraints, GOOS/GOARCH targets, or project-pinned Go tools. |

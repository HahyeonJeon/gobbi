---
name: go
description: "Go is a navigation-only domain index for focused architecture, development, testing, toolchain, delivery, and quality guidance."
allowed-tools: Read
skill-type: domain
---

# Go

Go is the navigation-only domain for work on Go software.

Use it when identifying the focused operation, tool, and preference guidance that applies to design, implementation, review, diagnosis, testing, packaging, or release work.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`go-architecture`](go-architecture/SKILL.md) | operation | Use Go Architecture when package boundaries, dependency direction, process roles, configuration ownership, data flow, failure containment, or validation strategy require an integrated design or review. |
| [`go-concurrency`](go-concurrency/SKILL.md) | preference | Use Go Concurrency when goroutines, channels, contexts, synchronization, atomics, queues, timers, cancellation, backpressure, shutdown, or race safety are involved. |
| [`go-conventions`](go-conventions/SKILL.md) | preference | Use Go Conventions when choosing or reviewing the written form of package names, identifiers, receiver names, source filenames, import aliases, or error text. |
| [`go-debugging`](go-debugging/SKILL.md) | operation | Use Go Debugging when reproducing, diagnosing, or isolating a named failure, panic, deadlock, race symptom, leak, corruption, unexpected result, or tool diagnostic. |
| [`go-design`](go-design/SKILL.md) | preference | Use Go Design when choosing or reviewing package identities and boundaries, public APIs or CLIs, functions, structs, methods, values and pointers, interfaces, errors, generics, mutable-data ownership, or ordinary resource lifetimes. |
| [`go-development`](go-development/SKILL.md) | operation | Use Go Development when implementing or changing Go code, or reviewing it without mutation, through `Study → Design → Build → Verify`. |
| [`go-documentation`](go-documentation/SKILL.md) | preference | Use Go Documentation when writing or reviewing package comments, declaration comments, doc-comment links or headings, or implementation comments. |
| [`go-modules`](go-modules/SKILL.md) | operation | Use Go Modules when creating, changing, or validating a module path, layout, `go.mod`, `go.work`, dependency graph, tool declaration, external-consumer behavior, or module compatibility. |
| [`go-observability`](go-observability/SKILL.md) | operation | Use Go Observability when software needs logs, metrics, traces, trace-context propagation, crash capture, diagnostic redaction, correlation, runtime signals, or proof that bounded test diagnostics reached a destination. |
| [`go-packaging`](go-packaging/SKILL.md) | operation | Use Go Packaging when a caller designates one local Go binary or archive to produce or validate for a named build contract and `GOOS/GOARCH` target. |
| [`go-performance`](go-performance/SKILL.md) | operation | Use Go Performance when latency, throughput, allocation, retained memory, garbage collection, CPU use, contention, binary size, startup time, or profile-guided optimization requires one named question and representative workload. |
| [`go-release`](go-release/SKILL.md) | operation | Use Go Release when versioning, publishing, verifying, or recovering one exact module, binary, or archive release. |
| [`go-security`](go-security/SKILL.md) | operation | Use Go Security when work involves untrusted input, identity, authorization, cryptography, protected values, dependencies, vulnerability findings, network exposure, or another trust boundary. |
| [`go-source`](go-source/SKILL.md) | preference | Use Go Source when source-file cohesion, canonical formatting, import grouping, blank or dot imports, or generated-source provenance has more than one plausible expression. |
| [`go-testing`](go-testing/SKILL.md) | operation | Use Go Testing when a named behavior or risk needs tests, examples, fuzz targets, benchmarks, coverage checks, race-detector evidence, or integration checks. |
| [`go-toolchain`](go-toolchain/SKILL.md) | tool | Use Go Toolchain when inspecting, using, or diagnosing the Go distribution, the `go` command, compiler, formatter, vet, generators, build constraints, `GOOS/GOARCH` targets, or project-pinned tools. |

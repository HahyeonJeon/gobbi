---
name: go
description: "MUST load before working in Go. Go is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Go

Go is the domain family for implementing, reviewing, testing, packaging, and diagnosing Go software. Its
children separate ordered work, tool behavior, and design preferences so each task loads only the guidance it
needs.

This root owns navigation only. Load every child whose trigger matches the task; a task may need several
children, such as development, design, testing, and toolchain guidance for one code change.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`go-concurrency`](go-concurrency/SKILL.md) | preference | Working with goroutines, channels, `context.Context`, `sync`, atomics, timers, concurrent ownership, cancellation, shutdown, backpressure, or race safety. |
| [`go-conventions`](go-conventions/SKILL.md) | preference | Choosing or reviewing Go names, files, packages, imports, documentation, comments, error text, or formatting. |
| [`go-design`](go-design/SKILL.md) | preference | Designing or reviewing Go packages, exported APIs, functions, structs, methods, values and pointers, interfaces, errors, generics, mutable-data ownership, or ordinary resource lifetime. |
| [`go-development`](go-development/SKILL.md) | operation | Implementing, changing, or reviewing Go code through study, design, bottom-up construction, and verification. |
| [`go-modules`](go-modules/SKILL.md) | operation | Creating, changing, validating, or releasing a Go module, including layout, `go.mod`, `go.work`, dependencies, tools, compatibility, and versions. |
| [`go-testing`](go-testing/SKILL.md) | operation | Designing, writing, reviewing, or executing Go tests, examples, fuzz targets, benchmarks, coverage checks, or race-detector evidence. |
| [`go-toolchain`](go-toolchain/SKILL.md) | tool | Using or diagnosing the Go distribution, `go` command, compiler, formatter, vet, generators, build constraints, platform builds, or project-pinned Go tools. |

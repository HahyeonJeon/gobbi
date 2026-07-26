# Go — gRPC

**Verified:** 2026-07-26 against https://github.com/grpc/grpc-go
**Canonical import path:** `google.golang.org/grpc`, with `google.golang.org/protobuf` — a separately
versioned module — behind the generated message types
**Version / support status:** `google.golang.org/grpc` **v1.82.1** (2026-07-15) — module proxy, read
2026-07-26. Actively released; **the only two patch releases since `v1.80.0` were both security
releases**, and the consequence is below.

Read [`service-clients.md`](service-clients.md) §1–§12 before acting on the delta table below. The
three header lines above and the owner links at the bottom stand alone. This file carries only what
differs for gRPC.

## Hazard-class deltas

| Class (`service-clients.md` §N) | This tool's delta | Owner |
|---|---|---|
| §2 | The construction call is `grpc.NewClient(target, opts...)`, added in **v1.63**, and the release call is `(*ClientConn).Close()` — *"Close tears down the ClientConn and all underlying connections."* Note what construction does **not** do: *"No I/O is performed. Use of the ClientConn for RPCs will automatically cause it to connect."* A `NewClient` that returns no error tells you the target and the options parsed. It tells you nothing about whether a server is there | `clientconn.go` @ `v1.82.1`, read 2026-07-26 |
| §2 | The four `DialOption`s that *"control this initial connection attempt"* — `WithBlock`, `WithTimeout`, `WithReturnConnectionError`, `FailOnNonTempDialError` — each carry *"Deprecated: this DialOption is not supported by NewClient."* On migration they do not fail; they stop applying. The owner states why validating at dial time was the wrong idea to begin with: *"connections with a `ClientConn` are dynamic -- they may come and go over time. If your client successfully connects, the server could go down 1 second later, and your RPCs will fail"*, and *"you don't need to check that a `ClientConn` is \"ready\" before starting your RPCs."* | `dialoptions.go` and `Documentation/anti-patterns.md` @ `v1.82.1`, read 2026-07-26 |
| §6 | The accessor is `status.FromError(err)` and it is a comma-ok, not a match. It does walk the chain — the status is returned *"if err wraps a type satisfying this"* — but **`ok` is not a "this failed" test**: *"If err is nil, a Status is returned with codes.OK and no message, and ok is true."* So `ok` answers "does this carry a gRPC status", and it answers yes for no error at all. Branch on the `codes` value, not on `ok` | `status/status.go` @ `v1.82.1`, read 2026-07-26 |
| §12 | `Dial` and `DialContext` are both deprecated, and each notice names a support commitment where a removal date would go: *"Deprecated: use NewClient instead.  Will be supported throughout 1.x."* The anti-patterns doc says it again in prose — *"we will continue to support it until a v2 is released (and no plans for a v2 exist at the time this was written)"* — so this migration is not under a clock. It is also **not a rename**: *"One subtle difference between NewClient and Dial and DialContext is that the former uses \"dns\" as the default name resolver, while the latter use \"passthrough\" for backward compatibility."* A swap that compiles can still change which address you reach | `clientconn.go` and `Documentation/anti-patterns.md` @ `v1.82.1`, read 2026-07-26 |

## Tool facts the shared base cannot carry

**Being behind on gRPC-Go is a security question, not only a currency question.** The module has
published exactly two patch releases since `v1.80.0`, and both were headed `# Security`. `v1.81.1`
(2026-05-13) fixed *"a potential authorization bypass caused by incorrectly falling through URI/DNS
SANs to Subject Distinguished Name (DN) when matching the authenticated principal name."* `v1.82.1`
(2026-07-15) stopped *"reading from the connection when flooded by HTTP/2 frames"* and fixed three
further xDS RBAC defects, one of which meant a DENY rule's unsupported matcher fields *"would be
ignored and fail-open."* *(Release notes for both tags and the module proxy, read 2026-07-26.)* So the §12
staleness check is a security control here, not only a correctness one.

## Read the owner instead of this file

- https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md — the owner's own
  anti-patterns document: how to create a `ClientConn`, why the dial options above are the wrong tool,
  what to do instead if you were using them to validate configuration, and its error-handling
  guidance. It is maintained alongside the code, so read it at the tag you depend on.
- https://github.com/grpc/grpc-go/blob/master/Documentation/concurrency.md — the owner's concurrency
  guidance for clients, servers, and streams.
- https://pkg.go.dev/google.golang.org/grpc — `NewClient`, `ClientConn`, and the full `DialOption` set
  with its deprecation notices.
- https://pkg.go.dev/google.golang.org/grpc/status and
  https://pkg.go.dev/google.golang.org/grpc/codes — the status accessor above and the code set it
  returns.
- https://pkg.go.dev/google.golang.org/protobuf — the separately versioned module behind the generated
  types.

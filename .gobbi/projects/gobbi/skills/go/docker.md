# Go — Docker Engine API

**Verified:** 2026-07-26 against https://github.com/moby/moby/tree/master/client
**Canonical import path:** `github.com/moby/moby/client`; request and response types come from the
separately versioned `github.com/moby/moby/api` module
**Version / support status:** `client/v0.5.0` (2026-06-18) and `api/v1.55.0` (2026-06-18) — module
proxy, read 2026-07-26. The older `github.com/docker/docker` is deprecated: *"Starting with Docker v29
(released November 2025), the Go module `github.com/docker/docker` is deprecated and won't be
updated"* (moby `README.md`, read 2026-07-26). The owner states **no removal date** — `grep -ci remov`
over that README returns `0`.

Read [`service-clients.md`](service-clients.md) §1–§12 before acting on the delta table below. The
three header lines above and the owner links at the bottom stand alone. This file carries only what
differs for the Docker Engine API.

## Hazard-class deltas

| Class (`service-clients.md` §N) | This tool's delta | Owner |
|---|---|---|
| §2 | The release call is `func (cli *Client) Close() error` — *"Close the transport used by the client"* | `client/client.go`, read 2026-07-26 |
| §12 | Negotiation only ever **downgrades**. It starts at `MaxAPIVersion` and *"API versions below [`MinAPIVersion`] are not considered"*. The two options that still set a version — `WithAPIVersion` and `WithAPIVersionFromEnv` — **disable negotiation** when they take effect, and `WithAPIVersionFromEnv` *"takes precedence"* if both are set. It reads `DOCKER_API_VERSION`, so the environment can pin a client whose code asks for nothing. `WithAPIVersion` *"does not validate if the client supports the given version"*; the caller checks it against `MaxAPIVersion` | `client/client.go`, `client/client_options.go`, read 2026-07-26 |
| §12 | `go fix` clears three of the four deprecated client symbols, not four. `NewClientWithOpts` → `New`, `WithVersion` → `WithAPIVersion`, and `WithVersionFromEnv` → `WithAPIVersionFromEnv` each carry `//go:fix inline`. **`WithAPIVersionNegotiation` carries no `//go:fix` directive** — it is deprecated and its body returns `nil`, so deleting the call is a hand edit the fixer will not make for you | `client/client.go` line 170, `client/client_options.go` lines 341 and 376, read 2026-07-26 |

## Tool facts the shared base cannot carry

- `const MinAPIVersion = "1.40"` and `const MaxAPIVersion = "1.55"` — the window a negotiated version
  resolves inside (`client/client.go`, read 2026-07-26).
- **The two modules run on different clocks.** `client` is at `v0.5.0` while `api` is at `v1.55.0`, and
  `MaxAPIVersion`'s own comment says *"This version may be lower than the version of the api library
  module used."* So the `api` module's version is not the API version your client speaks; read the
  constant, not the dependency graph.

## Read the owner instead of this file

- https://github.com/moby/moby/tree/master/client — the client package source. The deprecation notes,
  the `//go:fix` directives, and both API-version constants are in `client.go` and `client_options.go`,
  and reading them is how the three rows above were checked.
- https://pkg.go.dev/github.com/moby/moby/client — the rendered reference for the current client
  module.
- https://docs.docker.com/reference/api/engine/ — the Engine API itself: endpoints, payloads, and the
  per-version changelog behind `MinAPIVersion` and `MaxAPIVersion`.

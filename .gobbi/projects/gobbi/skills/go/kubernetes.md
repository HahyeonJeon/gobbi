# Go — Kubernetes

**Verified:** 2026-07-26 against https://github.com/kubernetes/client-go
**Canonical import path:** `k8s.io/client-go`, with `k8s.io/apimachinery` for the shared object types
and the error classifiers, and `sigs.k8s.io/controller-runtime` for operators
**Version / support status:** `k8s.io/client-go v0.36.3` (2026-07-23) and
`sigs.k8s.io/controller-runtime v0.24.1` (2026-05-11) — module proxy, read 2026-07-26. Both are
actively released; see the compatibility note below, which is a tested pairing and not a pin.

Read [`service-clients.md`](service-clients.md) §1–§12 before acting on the delta table below. The
three header lines above and the owner links at the bottom stand alone. This file carries only what
differs for Kubernetes.

## Hazard-class deltas

| Class (`service-clients.md` §N) | This tool's delta | Owner |
|---|---|---|
| §3 | The helper is `retry.RetryOnConflict(backoff, fn)` in `k8s.io/client-go/util/retry`, and its body is exactly `OnError(backoff, errors.IsConflict, fn)` — so the error it looks for is the one `apierrors.IsConflict` classifies, and `retry.DefaultRetry` is the backoff the package names for this case | `client-go/util/retry/util.go`, read 2026-07-26 |
| §5 | There is no paginator object. You set `ListOptions.Limit` and carry `ListMeta.Continue` back yourself. The token **expires** — *"generally five to fifteen minutes"* — and the server then answers *"a 410 ResourceExpired error together with a continue token"*. Resuming from that token is allowed but no longer a consistent list: *"If the client needs a consistent list, it must restart their list without the continue field"* | `apimachinery/pkg/apis/meta/v1/types.go`, read 2026-07-26 |
| §6 | The classifiers live in `k8s.io/apimachinery/pkg/api/errors` — conventionally imported as `apierrors` — not in `client-go`. Each one already does the walk: *"It supports wrapped errors and returns false when the error is nil."* Two consequences: you do not write `errors.As` around them, and `if apierrors.IsNotFound(err)` is **not** a nil check — it is false for `nil` and false for an unrelated error alike | `apimachinery/pkg/api/errors/errors.go`, read 2026-07-26 |
| §8 | The lifetime calls on `SharedInformerFactory` are `StartWithContext(ctx)`, `WaitForCacheSyncWithContext(ctx)`, and `Shutdown()`; `Start`/`WaitForCacheSync` are the stop-channel forms the owner marks as superseded for contextual logging. Two traps: *"StartWithContext does not block. When run in a go-routine, it will race with a later WaitForCacheSync"*, and `Shutdown` *"blocks until all goroutines have terminated. For that to happen, the close channel(s) that they were started with must be closed, either before Shutdown gets called or while it is waiting"* — a `defer factory.Shutdown()` with a live context waits forever. Handler registrations are separate: the owner's own example defers `Informer().RemoveEventHandler(handle)` with the comment *"Avoids leaking goroutines."* | `client-go/informers/factory.go`, read 2026-07-26 |
| §11 | The version field is `metadata.resourceVersion` — *"An opaque value that represents the internal version of this object... May be used for optimistic concurrency"*, *"Populated by the system. Read-only"*, and *"Clients must treat these values as opaque and passed unmodified back to the server."* The rejection you get back is what `apierrors.IsConflict` classifies, which is the same predicate §3's helper retries on | `apimachinery/pkg/apis/meta/v1/types.go`, read 2026-07-26 |

## Tool facts the shared base cannot carry

**controller-runtime states a tested pairing, not a requirement.** Its README carries a three-column
table, and both the wording and the column header matter:

> "Every minor version of controller-runtime has been tested with a specific minor version of
> client-go. A controller-runtime minor version *may* be compatible with other client-go minor
> versions, but this is by chance and neither supported nor tested."
>
> *(Verbatim from the controller-runtime `README.md`, read 2026-07-26. Top row: CR **v0.24** with
> `k8s.io/*`, client-go **v0.36**, minimum Go version **1.26**.)*

Read three things off that. **"Tested with" is not "requires"** — a document that writes "CR vX requires
client-go vY" has strengthened the owner's claim past what the owner will support. **The third column's
header is literally "minimum Go version"**, so `1.26` is a floor for your toolchain, not a pin. And
controller-runtime *"stick[s] to a zero major version"* while publishing *"a minor version for each
Kubernetes minor release"* with breaking changes allowed between minors — so under this project's
versioning a CR minor bump is a breaking change, and semver alone will not warn you.

## Read the owner instead of this file

- https://pkg.go.dev/k8s.io/client-go — the client packages, including `util/retry` and `informers`.
- https://pkg.go.dev/k8s.io/apimachinery/pkg/api/errors — the full set of `apierrors` classifiers; the
  wrapped-error and nil sentence above is repeated on each one.
- https://github.com/kubernetes-sigs/controller-runtime — the compatibility table quoted above, and the
  `VERSIONING.md` it links to. Read the table rather than any copy of it.
- https://kubernetes.io/docs/reference/using-api/api-concepts/ — the API's own contract for chunked
  lists, continue tokens, `410 Gone`, and resource versions, above the Go client.

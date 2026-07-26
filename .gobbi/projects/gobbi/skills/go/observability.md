# Go — Prometheus and OpenTelemetry

**Verified:** 2026-07-26 against https://github.com/prometheus/client_golang and
https://github.com/open-telemetry/opentelemetry-go
**Canonical import path:** `github.com/prometheus/client_golang` (the `prometheus` and `promhttp`
packages) and `go.opentelemetry.io/otel`
**Version / support status:** `client_golang` **v1.24.1** — the `CHANGELOG.md` header at that tag reads
`## 1.24.1 / 2026-07-23` and the module proxy reports `2026-07-24`; that is the tag date against the
publish date, not two answers to one question. **v1.24.0 raised the minimum Go version to 1.25**:
*"Minimum required Go version is now 1.25, only the two latest Go versions (1.25 and 1.26) are
supported from now on"* (`CHANGELOG.md` @ `v1.24.1`, read 2026-07-26) — check that against your own
`go` line ([`modules-tooling.md`](modules-tooling.md) §2). OpenTelemetry-Go **v1.44.0** (2026-05-27),
released as the train `1.44.0/0.66.0/0.20.0/0.0.17` (`CHANGELOG.md` @ `v1.44.0`, read 2026-07-26).

Read [`service-clients.md`](service-clients.md) §1–§12 before acting on the delta table below. The
three header lines above and the owner links at the bottom stand alone. This file carries only what
differs for Prometheus and OpenTelemetry.

## Hazard-class deltas

| Class (`service-clients.md` §N) | This tool's delta | Owner |
|---|---|---|
| §12 | `client_golang`'s semver promise stops at a path **inside** the stable v1 module: *"the API client in `prometheus/client_golang/api/…` is still considered experimental. Breaking changes of the API client will _not_ trigger a new major release."* And the exempt set is not a fixed path list — *"The same is true for selected other new features explicitly marked as **EXPERIMENTAL** in CHANGELOG.md."* So the module version in your `go.mod` does not tell you whether the symbol you imported is under the promise. The `CHANGELOG.md` entry that introduced it does | `README.md` @ `v1.24.1`, read 2026-07-26 |
| §12 | In OpenTelemetry-Go the major version **is** the stability tier, and a version bump is not evidence that anything changed. *"Experimental modules still under active development will be versioned at `v0`"*; *"All stable modules that use the same major version number will use the same entire version number"*; and explicitly *"Stable modules may be released with an incremented minor or patch version even though that module has not been changed."* Read the `v0` in a `go.opentelemetry.io/…` requirement as the warning it is, and never read a bump as a changelog | `VERSIONING.md` @ `v1.44.0`, read 2026-07-26 |

## Tool facts the shared base cannot carry

**The OpenTelemetry-Go per-signal status is a dated snapshot, and it is the line in this file most
likely to be wrong by the time you read it.**

> | Signal  | Status |
> |---------|--------|
> | Traces  | Stable |
> | Metrics | Stable |
> | Logs    | Beta   |
>
> *(Verbatim from the opentelemetry-go `README.md` § Project Status @ `v1.44.0`, read 2026-07-26.)*

The release train corroborates the table without reading it: the log module ships at `0.20.0`, and by
the delta above a `v0` module is the experimental tier. **Re-read the table at the tag before relying
on this paragraph.** A signal moving to Stable is the routine outcome here, it changes what you may
depend on, and no tooling surface reports it — only the owner's own README does.

## Read the owner instead of this file

- https://github.com/prometheus/client_golang — `README.md` § "Important note about releases and
  stability" holds the carve-out quoted above, and `CHANGELOG.md` holds the per-release EXPERIMENTAL
  markings and the Go-version minimum. Read both **at the tag**; this repository is one of the two live
  instances behind [`modules-tooling.md`](modules-tooling.md) §8's pin-the-tag rule.
- https://pkg.go.dev/github.com/prometheus/client_golang/prometheus — the registry, the collector
  interface, and the metric types.
- https://github.com/open-telemetry/opentelemetry-go — `README.md` for the status table and
  `VERSIONING.md` for the rule that produces the version numbers.
- https://opentelemetry.io/docs/languages/go/ — the instrumentation guide: providers, exporters, OTLP
  configuration, and the semantic conventions this file does not cover.

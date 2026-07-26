# Go — AWS SDK for Go v2

**Verified:** 2026-07-26 against https://github.com/aws/aws-sdk-go-v2
**Canonical import path:** `github.com/aws/aws-sdk-go-v2/...` — the core `aws`, `config`, and
`aws/retry` packages, plus one module per service under `service/…`; the error types come from
`github.com/aws/smithy-go`
**Version / support status:** core `github.com/aws/aws-sdk-go-v2 v1.43.0` (2026-07-21) and
`github.com/aws/smithy-go v1.27.4` (2026-07-16) — module proxy, read 2026-07-26. **v1
(`github.com/aws/aws-sdk-go`) has reached end-of-support**: *"as of 7/31/2025, the SDK has entered
end-of-support"* (v1 `README.md`), and the repository is archived and read-only (GitHub API
`"archived": true`, read 2026-07-26). The end-of-support date is 2025-07-31; an earlier
maintenance-mode date is not stated in the current README, so do not cite one to it.

Read [`service-clients.md`](service-clients.md) §1–§12 before acting on the delta table below. The
three header lines above and the owner links at the bottom stand alone. This file carries only what
differs for the AWS SDK for Go v2.

## Hazard-class deltas

| Class (`service-clients.md` §N) | This tool's delta | Owner |
|---|---|---|
| §3 | A custom `Retryer` silently discards the two simple knobs beside it. `aws.Config.Retryer` is documented *"If not nil, RetryMaxAttempts, and RetryMode will be ignored by API clients"* — so setting one alongside `RetryMaxAttempts` leaves the attempt count you wrote unused. Note the field's type: `Retryer func() Retryer`, a **factory, not a value**, and the reason is stated — a shared instance would mean *"sharing the same retry token bucket across services."* One `Retryer` value handed to several clients makes one service's retries throttle another's | `aws/config.go`, read 2026-07-26 |
| §5 | The paginator constructor is per **operation**, inside the service module: `s3.NewListObjectsV2Paginator(client, params)`, then `for p.HasMorePages() { page, err := p.NextPage(ctx) }`. `HasMorePages` is `firstPage \|\| nextToken != ""`, so **it is true before the first call** — it is the loop's condition, never a "does this have data" probe. `StopOnDuplicateToken` on the paginator options exists because a service that returns the token you just sent otherwise loops forever | `service/s3/api_op_ListObjectsV2.go`, read 2026-07-26 |
| §6 | The value you match is an **interface**, `smithy.APIError`: `var apiErr smithy.APIError` then `errors.As(err, &apiErr)`. It is *"the generic API and protocol agnostic error type all SDK generated exception types will implement"* and it yields `ErrorCode()`, `ErrorMessage()`, and `ErrorFault()`, whose values are `smithy.FaultClient`, `smithy.FaultServer`, and `smithy.FaultUnknown` — read the fault before deciding whether a failure is yours or the service's. What you actually receive is `*smithy.OperationError`, which *"decorates an underlying error... with names of the operation and API"* and implements `Unwrap`. Both types live in `github.com/aws/smithy-go`, a different module from the SDK | `smithy-go/errors.go`, read 2026-07-26 |
| §7 | The switch is `aws.Config.ClientLogMode`, a `uint64` **bit-field** composed with `\|`, not a level. The whole difference between logging metadata and logging payloads is a suffix: `LogRequest` and `LogResponse` versus `LogRequestWithBody` and `LogResponseWithBody`. `LogSigning` and `LogRetries` are separate bits again. A one-word edit changes what the log holds, which is why this belongs in code you review, not in configuration | `aws/logging.go`, read 2026-07-26 |

## Tool facts the shared base cannot carry

**There is no single "AWS SDK version".** Each service is its own module on its own version line: on
2026-07-26 the core `github.com/aws/aws-sdk-go-v2` was at `v1.43.0` while
`github.com/aws/aws-sdk-go-v2/service/s3` was at `v1.106.0`, both cut from the same commit that day
(module proxy, read 2026-07-26). A `go.mod` therefore carries several AWS lines that move
independently, and "we are on v1.43" names the core module only.

## Read the owner instead of this file

- https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/aws — `Config`, its retry fields, and
  `ClientLogMode` with the full bit list.
- https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/aws/retry — the retryer implementations, their
  defaults, and the token bucket.
- https://pkg.go.dev/github.com/aws/smithy-go — `APIError`, `OperationError`, and `ErrorFault`.
- https://docs.aws.amazon.com/sdk-for-go/v2/developer-guide/ — the SDK's own developer guide:
  credential resolution, per-service clients, and the migration from v1.

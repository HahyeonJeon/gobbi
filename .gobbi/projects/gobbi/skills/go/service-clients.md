# Go — Service clients

**Verified:** 2026-07-25 against https://pkg.go.dev/github.com/docker/docker — the module page that
§12 is about, which still renders as "Latest". Every class below carries its own owner and date
wherever it makes an owner's claim.

**Ownership** — the twelve hazard classes that hold for **every** service API a Go program calls,
stated **once each** as §1–§12; the tool delta index; and the read-order gate. A per-tool child owns
only what *differs* for its tool, cites these class numbers, and never restates a class's rationale.
The numbering is the citation target, so it is fixed: no class is merged, renumbered, or reordered.

**Split criterion** — `skill-writing` P4 (b): a long lookup reference, and a churn quarantine. A reader
calling a cloud, container, orchestration, or observability API opens this file and nothing else in
the skill, and the SDK churn stays here rather than spreading into the language core.

**Deepens, does not restate** — [`SKILL.md`](SKILL.md) Rules **H4** (errors are values; handle each
one exactly once; `%w` is a commitment), **H5** (`ctx` first, named `ctx`, never stored in a struct),
**H6** (every goroutine gets a stop time or a stop signal, plus a way for the caller to wait), and
**H10** (cite the owner and a date — and a module's page is not evidence that the module is current).
It is the P2 router destination for *any call to a cloud, container, orchestration, or observability
API*, including one with no child of its own.

**Version numbers.** This file teaches none. Every **Go and Go-toolchain** figure in this skill
resolves to the Version Currency Register in [`modules-tooling.md`](modules-tooling.md) §9; every
**per-tool SDK, module, or wire-API** figure resolves instead to the owning tool child's own dated
`**Version / support status:**` header line, which is that figure's single owner (the register states
the split and why). One numeral appears in §12, marked there as evidence of a trap rather than a
currency claim.

**Read order — the gate.** Read §1–§12 **before acting on any per-tool child's `## Hazard-class
deltas` table**. A delta is meaningless without the class it is a delta from. **Exception:** a child's
header block — `**Verified:**`, `**Canonical import path:**`, `**Version / support status:**` — and
its `## Read the owner instead of this file` section are answerable without reading this file. An
author who needs only the current import path may read the header and stop.

## Contents

1. [`ctx` is the first parameter, and a per-call deadline is not client config](#1--ctx-is-the-first-parameter-and-a-per-call-deadline-is-not-client-config)
2. [Clients are expensive and concurrency-safe: construct once, reuse, release](#2--clients-are-expensive-and-concurrency-safe-construct-once-reuse-release)
3. [Retry asymmetry: some SDKs retry for you and some do not](#3--retry-asymmetry-some-sdks-retry-for-you-and-some-do-not)
4. [Client-side rate limiting has non-obvious defaults](#4--client-side-rate-limiting-has-non-obvious-defaults)
5. [Pagination is a constructed object — drain it](#5--pagination-is-a-constructed-object--drain-it)
6. [Typed API errors are matched with `errors.As`, never with a string](#6--typed-api-errors-are-matched-with-errorsas-never-with-a-string)
7. [Credentials and payloads leak through debug logging](#7--credentials-and-payloads-leak-through-debug-logging)
8. [Watches, informers, and streams own goroutines that must be stopped](#8--watches-informers-and-streams-own-goroutines-that-must-be-stopped)
9. [Official fakes exist and are officially limited](#9--official-fakes-exist-and-are-officially-limited)
10. [Fan-out must be bounded](#10--fan-out-must-be-bounded)
11. [Eventual consistency and optimistic concurrency are the contract](#11--eventual-consistency-and-optimistic-concurrency-are-the-contract)
12. [Version negotiation at the client boundary — and metadata is not a deprecation signal](#12--version-negotiation-at-the-client-boundary--and-metadata-is-not-a-deprecation-signal)

## The tool delta index

| Tool | Canonical import path | The one thing that differs | Read next |
|---|---|---|---|
| Docker Engine API | `github.com/moby/moby/client` | **§12** — negotiation is automatic now, and the option that used to turn it on does nothing | [`docker.md`](docker.md) |
| Kubernetes | `k8s.io/client-go` (with `k8s.io/apimachinery`, `sigs.k8s.io/controller-runtime`) | **§3** — write conflicts are **not** retried for you, and the opt-in helper only recognizes the error unwrapped | [`kubernetes.md`](kubernetes.md) |
| AWS | `github.com/aws/aws-sdk-go-v2` (per-service modules under `/service/…`) | **§3** — it retries **by default**, so a retry loop of your own multiplies the attempts | [`aws.md`](aws.md) |
| Prometheus and OpenTelemetry | `github.com/prometheus/client_golang`, `go.opentelemetry.io/otel` | **§12** — stability differs *inside* one module, so the import path alone does not tell you what is stable | [`observability.md`](observability.md) |
| gRPC | `google.golang.org/grpc` | **§2** — the connection is the reusable object, and dialing again is a new TCP connection, not a lookup | [`grpc.md`](grpc.md) |

Every import path here is owned, cited, and dated by that child in its own header (H10); the index
carries it for lookup only.

**Every row above is a child row, and there are five of them.** A service API with no child of its own
is not missing from this skill: §1–§12 apply to it unchanged, and the owner's own documentation is the
rest of the answer — that pairing is the whole answer, by design. A **childless row**, whose fourth
column names the owner's documentation URL and a verification date instead of a child link, is a
bounded provision rather than an open set. **None ships, and adding one is the user's decision, not an
author's**: an author may propose a row and may not create one. An added row is a dated owner-URL
claim on the same clock as everything else here, re-verified alongside the register in
[`modules-tooling.md`](modules-tooling.md) §9.

## §1 — `ctx` is the first parameter, and a per-call deadline is not client config

Every operation on a service client takes `ctx context.Context` as its first parameter (H5), and it
matters more here than anywhere else because the call leaves the process. A remote call hangs for as
long as the network allows, so the only bound that exists is the one the caller carries.

**Two settings get confused at this boundary.** The client's configuration — connection timeouts,
retry policy, rate limits — is chosen once and applies to every call that client will ever make. The
deadline for *this* call is chosen at the call site. A client timeout cannot say "this one bulk
operation gets five minutes"; a per-call deadline cannot say "every call in this process gives up
after two seconds". Decide each separately. `context.Background()` at a call site is not a neutral
default: it is a decision to wait without a bound and to be uncancellable, and it is the most-copied
line in vendor example code.

Context mechanics — derivation, propagation, the cancel function you must always call, and the rule
against storing a `Context` in a struct — are owned by [`concurrency.md`](concurrency.md) §2. This
class adds only the boundary consequence: the deadline belongs to the call, not to the client.

## §2 — Clients are expensive and concurrency-safe: construct once, reuse, release

A service client is not a value object. Constructing one resolves credentials, builds a transport,
and starts a connection pool; using one accumulates state — cached credentials, open connections, and
in some SDKs live watchers and leases. **Constructing a client per request throws all of that away
every time and leaks what it opened.** The same clients are safe to share, which is what makes reuse
the correct answer rather than merely the cheap one. etcd's client documentation states both halves
in consecutive sentences:

> "The Client has internal state (watchers and leases), so Clients should be reused instead of created
> as needed. Clients are safe for concurrent use by multiple goroutines."
>
> *(Verbatim from `pkg.go.dev/go.etcd.io/etcd/client/v3`, read 2026-07-25.)*

Read them together: reuse is not a performance tweak you may skip, and sharing one client across
goroutines needs no lock of yours. gRPC-Go states the sharing half for its own connection type — *"A
ClientConn can safely be accessed concurrently"* (`pkg.go.dev/google.golang.org/grpc`, read
2026-07-25).

**Never dial or construct per request.** Calling `grpc.Dial` again — a call that is itself deprecated
in favour of the current constructor — opens a new TCP connection each time rather than finding the
existing one. So: construct at startup, hand the client to whatever needs it, and **release it
explicitly** when the owning component shuts down ([`concurrency.md`](concurrency.md) §8 owns the
ordering). The name of the release call differs per tool and is each child's delta.

## §3 — Retry asymmetry: some SDKs retry for you and some do not

**This is the class most likely to cost you a production incident, because assuming either answer is
wrong.** Two SDKs in this set sit at opposite poles, and neither behaviour is discoverable from the
call site.

**The AWS SDK for Go v2 retries by default.** `Standard` is the default retryer implementation:

> "Standard is the default retryer implementation used by service clients... the retryer uses a
> configurable token bucket to rate limit the retry attempts across the client."
>
> *(Verbatim from the `aws-sdk-go-v2` `retry` package documentation, read 2026-07-25.)*

Its defaults are `DefaultMaxAttempts int = 3`, `DefaultMaxBackoff = 20 * time.Second`, and a token
bucket of `DefaultRetryRateTokens uint = 500`, where a timeout retry costs 10 tokens and other errors
cost 5. **These are defaults with an environment gate, not fixed constants:** the raw retry source
carries `func newRetries2026() bool { return os.Getenv("AWS_NEW_RETRIES_2026") == "true" }`, and when
that variable is `true` the per-error retry cost becomes **14** instead of 5. The rendered package
prose never mentions the variable — it is a raw-source-only finding, and a document that states the
costs as constants is wrong for anyone running with the flag set.

The consequence is arithmetic: **your own retry loop wrapped around a call that already retries gives
you nine attempts, not three.**

**client-go does not retry write conflicts for you.** The helper is opt-in, and it imposes a
discipline in two sentences:

> "you need to refetch it on every try, since if you got a conflict on the last update attempt then
> you need to get the current version before making your own changes."
>
> "You have to return err itself here (not wrapped inside another error) so that RetryOnConflict can
> identify it correctly."
>
> *(Verbatim from the client-go `util/retry` package documentation, read 2026-07-25.)*

Both halves fail silently. Re-sending the object you already read guarantees the same conflict
forever. And returning `fmt.Errorf("...: %w", err)` — the wrap H4 otherwise asks for — **disables the
retry**, because the helper identifies the error by what you returned, not by walking the chain. This
is one of the few places in Go where wrapping is the wrong move; say so at the call site, because
nothing else will.

**The rule this class produces:** before writing any retry, find out what the SDK already does — read
the client's retry configuration, not its call signature. Each child states its own tool's answer.

## §4 — Client-side rate limiting has non-obvious defaults

A client can throttle you before the service ever sees the request, and it can do so at a rate you did
not choose. client-go's `rest.Config` documents its defaults in the field comments themselves:

> `// If it's zero, the created RESTClient will use DefaultQPS: 5`
>
> `// If it's zero, the created RESTClient will use DefaultBurst: 10.`
>
> `` // Setting this to a negative value will disable client-side ratelimiting unless `Ratelimiter` is also set. ``
>
> `// Rate limiter for limiting connections to the master from this client. If present overwrites QPS/Burst`
>
> *(Verbatim from `rest/config.go` in `k8s.io/client-go`, read 2026-07-25. The constants are
> `DefaultQPS float32 = 5.0` and `DefaultBurst int = 10`.)*

Read all four together, because each one changes the others. **A zero field is not "unlimited" — it is
the default**, so a client you configured by leaving fields alone runs at 5 requests per second.
**Negative is not unconditionally "off"** — it disables client-side limiting *only if* no rate limiter
is also set. And **a set rate limiter overrides QPS and burst entirely**, so tuning the two numbers
beside it changes nothing.

The failure shape is the same every time: a component that is quietly throttled by its own client and
diagnosed as a slow server. Before blaming the service, print the client's effective limits.

## §5 — Pagination is a constructed object — drain it

A paginated API returns one page plus a token for the next. In these SDKs the loop is usually driven
by a **paginator object you construct** from the client and the request, not by a client method that
returns the whole collection — and that shape is what makes the failure silent. **A partially-drained
paginator loses data with no error:** the first page is a complete, valid, correct-looking result, so
code that reads one page and returns is indistinguishable from code that read everything, until the
collection outgrows a page in production.

Three rules follow, whatever the construction form is. Loop until the paginator says there is no more,
never until a count of your own. Pass `ctx` on every iteration (§1) — a drain is many calls, not one.
Treat any page error as ending the loop (§6): a drain resumed after a failed page skips a page's worth
of records. The constructor's name and the continuation-token field are each tool's delta.

## §6 — Typed API errors are matched with `errors.As`, never with a string

Service SDKs return typed errors carrying a code, a message, and a fault classification. Two ways of
reading them are wrong here, and each fails differently.

**Comparing `err.Error()` against text** couples you to a message under no compatibility promise, and
breaks the first time any layer prepends context.

**Type-switching on the error, or comparing it directly, fails even when your type is right** — and
that is the part specific to service clients. **A typed API error usually arrives wrapped:** the SDK
puts an operation-level wrapper around the service's own error so the message can name the operation,
so the error you receive is the wrapper and the one you are testing for is underneath it. That makes
`errors.As` the only form that works here, not the tidier of two options.

The matching mechanics — `Is` versus `As` versus `AsType`, comparability, and why a type switch fails
on a wrapped error — are owned by [`errors.md`](errors.md) §4. **The named wrapper types are each
tool's delta, not this class's content:** [`aws.md`](aws.md) names the wrapper it uses, and
[`kubernetes.md`](kubernetes.md) names the classifier helpers it ships — including that they support
wrapped errors and return false on a nil error, so `if apiErrIsX(err)` is not a nil check.

## §7 — Credentials and payloads leak through debug logging

Every SDK in this set ships a switch that logs requests and responses, documented as a debugging aid.
Two costs come with it, and both arrive only in production.

**Secrets outlive the request.** Wire logging records what was on the wire, credentials and payload
included, and the log then persists in a system with a different retention policy and a different
audience from the request it describes.

**Memory scales with the payload.** Logging a body means buffering a body, so the cost is proportional
to what you are transferring — invisible on a test object and severe on a real one.

The rule: body logging is a switch you turn on for one investigation and off again, never a deployment
default and never a flag a configuration file can set in production. Each child names its own switch.

> **Unverified:** two halves of the AWS-specific form of this class — that body logging costs memory
> equal to the payload size, and the wording about an access key ID appearing in wire logs. Every
> verification pass carried both without transcribing an owner sentence, so neither is stated as an
> owner's claim anywhere in this skill. **What would resolve it:** `aws/logging.go` in
> `github.com/aws/aws-sdk-go-v2`, read at a pinned module version, for a sentence carrying either
> cost. The flag names themselves are sourced and are [`aws.md`](aws.md)'s delta.

## §8 — Watches, informers, and streams own goroutines that must be stopped

A watch, an informer, and a server-streaming call are all the same shape: a construct that keeps
running after the function that started it returns. Each one starts goroutines you did not write and
holds a connection you did not open, and **nothing stops them when the surrounding function exits**.

That makes H6 apply to code with no `go` statement in it. Its three parts are unchanged — a named
owner, a stop signal, and a way for the caller to wait — and you usually get them by passing a
`Context` at start, waiting for the stop at shutdown, and removing any handler registration on the way
out. [`concurrency.md`](concurrency.md) §1 owns goroutine ownership and §8 owns shutdown order; the
concrete call names are each tool's delta.

The second half of the class is what a leak check will not find: **a handler is usually run by the
watch's own goroutine, so a slow handler does not fall behind alone — it delays every other event on
that stream.** Anything slow belongs on a queue the handler hands off to, not in the handler.

> **Unverified:** the handler-goroutine half above, as a client-go informer fact. Two passes carried
> it without an owner sentence. **What would resolve it:** the `SharedInformer` documentation on
> `pkg.go.dev/k8s.io/client-go/tools/cache`, read at a pinned version. The ownership half of this
> class rests on H6 and [`concurrency.md`](concurrency.md) §1 and does not depend on it.

## §9 — Official fakes exist and are officially limited

Several of these projects ship an official in-memory fake, and each one documents its own limits in
terms blunter than a third party would use. client-go's fake clientset:

> "It's backed by a very simple object tracker that processes creates, updates and deletions as-is,
> without applying any validations and/or defaults. It shouldn't be considered a replacement for a
> real clientset and is mostly useful in simple unit tests."
>
> *(Verbatim from the client-go `fake` package documentation, read 2026-07-25.)*

controller-runtime is blunter still:

> "When in doubt, it's almost always better not to use the fake client package and instead use
> `envtest.Environment`."
>
> *(Verbatim from the controller-runtime fake client package documentation, read 2026-07-25.)*

**Take both at face value.** A fake proves your code calls the API you think it calls, with the
arguments you think it sends. It proves nothing about how the service behaves — no validation, no
defaulting, and none of the behaviour §4, §5, and §11 describe. Green tests over a fake that cannot
fail the way production fails are the most expensive kind of green. So use the fake for call-shape
tests and the project's real-environment harness for behaviour. Test-double design in general — who
declares the interface, where the double lives, and why Go needs no mocking framework — is owned by
[`testing.md`](testing.md) §10.

## §10 — Fan-out must be bounded

Calling one service API concurrently for every element of a collection is where a Go program stops
being fast and starts being a load generator: the goroutine count is decided by the input size, which
is usually decided by someone else, and the far end responds by throttling.

**The compounding is the part worth stating.** Throttled calls become retried calls — and per §3 the
SDK may already be retrying them for you — so an unbounded fan-out turns one burst into a retry storm
against an endpoint that is already refusing work. The client's own limiter (§4) does not save you:
N workers behind a 5 QPS limiter are queueing, not parallel, and each still holds a goroutine and a
deadline.

Bound the work with a worker count you can defend against the account's quota, not one derived from
the input. `errgroup` is the shape that carries the bound and the first error together;
[`concurrency.md`](concurrency.md) §7 owns its semantics — **and records what remains unverified about
its per-method contracts, so read that section before writing the call** — while §1 owns the goroutine
obligations the group does not exempt you from.

## §11 — Eventual consistency and optimistic concurrency are the contract

A read-modify-write against a service API is not a transaction. You read a version, you change it, and
the service accepts the write **only if that version is still current**; otherwise it rejects the
write with a conflict. **That rejection is the API working correctly, not an error to log and give up
on.** Handling it means refetching before the next attempt (§3's discipline), never re-sending the
object you already have.

The other half is timing: a resource you just created may not be visible to the next read, and a
delete may return before the object is gone. **Absence is not proof of failure, and presence is not
proof of completion.** Code that asserts on a resource's state immediately after changing it is
testing the propagation delay, not the change.

Both halves argue for the same design: describe the state you want, observe the state that exists, and
let the difference drive the next action. The per-tool spelling — which field carries the version,
which status means conflict, which field reports observed state — is each child's delta.

## §12 — Version negotiation at the client boundary — and metadata is not a deprecation signal

**Client and service versions are negotiated, and where that happens is a fact you have to know.** The
Docker client's constructor documents both the behaviour and its timing:

> "By default, the client automatically negotiates the API version to use when making requests. API
> version negotiation is performed on the first request; subsequent requests do not re-negotiate."
>
> *(Verbatim from the `client.New` documentation in `github.com/moby/moby/client`, read 2026-07-25.)*

"On the first request" is the load-bearing half: the version is fixed by whichever call happens to go
first, against whichever server answered — so a long-lived client keeps the version it negotiated
across a server upgrade.

**The option that used to enable this is now a no-op, which is the trap.** Its own deprecation note
says so — *"API-version negotiation is now enabled by default and this options is now a no-op"* — and
the older constructor is deprecated too: *"Deprecated: use [New]. This function will be removed in the
next release."* Do not write `WithAPIVersionNegotiation` into new code, and do not keep
`NewClientWithOpts` "for safety".

**Run the fixer, then check what it left.** Some deprecated symbols carry a `//go:fix inline`
directive and `go fix` rewrites them mechanically; others do not, and those are a hand deletion. Both
kinds sit side by side here: `go fix` clears three of the four deprecated symbols in this client,
**and `WithAPIVersionNegotiation` is not one of them** — it carries no directive and its body simply
returns nil, so the fixer leaves it in place and silently correct-looking. A clean `go fix` run is
therefore not evidence that a deprecation has been dealt with. [`docker.md`](docker.md) lists which
symbol is which, and [`modules-tooling.md`](modules-tooling.md) §7 owns `go fix`.

**And here is the durable half of this class: module metadata will not tell you when the answer
changes.** Go carries no deprecation state in module metadata, so a frozen, abandoned module keeps
rendering as current forever. The live instance is `github.com/docker/docker`, deprecated in favour of
`github.com/moby/moby/client` — do not start new code on it, and do not treat its module page as
evidence that it is fine. The module proxy answers `@latest` with `v28.5.2+incompatible` *(read
2026-07-25; this numeral is evidence of the trap, not a version this skill teaches — see the note
under the header)*, and the package site renders that as **"Latest"** with a healthy-module checklist:
valid `go.mod`, redistributable license, tagged, stable v1+. Its only warnings are security
advisories. **The deprecation exists only in the project README's prose — never in module metadata.**

**This does not resolve itself by waiting.** The module genuinely has no newer version, so every
tooling surface will keep calling it "latest" indefinitely; this is not a stale index that catches up.
There is no removal date either: `grep -i "remov"` over that README returns **zero hits**, and the
absence *is* the finding — do not invent a deadline for a migration the owner has not dated.

So the check that feels rigorous — open the module page, see "Latest", conclude the dependency is
current — **cannot clear a staleness question**. Only the owner's own notice can. H10 states this as a
citation rule and [`modules-tooling.md`](modules-tooling.md) §8 states it as the currency method; this
class states it at the client boundary, where the stale answer is a working import path.

## What this file does not own

What this file leans on is owned elsewhere, and is pointed at rather than repeated.

| Topic | Owner |
|---|---|
| `context` derivation, propagation, cancellation, and the do-not-store rule (§1) | [`concurrency.md`](concurrency.md) §2 |
| Goroutine ownership (§8), `errgroup` semantics (§10), and shutdown order (§2) | [`concurrency.md`](concurrency.md) §1, §7, §8 |
| `errors.Is` / `errors.As` / `errors.AsType` mechanics and `%w` as an API commitment (§6) | [`errors.md`](errors.md) §3, §4 |
| Test-double design: who declares the interface, and where the double lives (§9) | [`testing.md`](testing.md) §10 |
| Every version number, and the currency method behind the citations here (§12) | [`modules-tooling.md`](modules-tooling.md) §8, §9 |

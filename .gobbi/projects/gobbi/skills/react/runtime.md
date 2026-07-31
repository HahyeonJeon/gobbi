# React — Presentation and Producer Deltas

This reference owns the React consequences of two independent axes:

- **presentation:** browser page or Electron renderer DOM; and
- **producer:** client-only, build-time, or request-time/remote.

It does not own Electron platform policy. It defines no process authority, bridge construction, security
setting, loader or protocol behavior, packaging mechanism, release rule, or version fact.

For an Electron presentation or any Electron platform need, **MUST load
[`electron`](../electron/SKILL.md)** and every child whose trigger applies:

| Electron work | Required child |
|---|---|
| Security boundaries, project shape, bridge and IPC contracts, process or window ownership, native behavior, errors, or platform defaults | [`electron-convention`](../electron/electron-convention/SKILL.md) |
| Implementing or reviewing an Electron platform change | [`electron-development`](../electron/electron-development/SKILL.md) |
| Looking up process, preload, IPC, lifecycle, native, or operating-system behavior | [`electron-runtime`](../electron/electron-runtime/SKILL.md) |
| Designing, running, or interpreting Electron-specific evidence | [`electron-test`](../electron/electron-test/SKILL.md) |
| Packaging, signing, notarizing, upgrading, update-rehearsing, or preparing release artifacts | [`electron-release`](../electron/electron-release/SKILL.md) |

Load several children when several triggers apply. This file cannot replace any of them.
[`server-client.md`](server-client.md) owns the React server/client boundary. `SKILL.md` H6 owns Effect
cleanup, H16 owns React consumption of host capabilities, and H17 owns presentation/producer independence.

## The six combinations

The presentation surface does not determine the producer:

| Presentation | Producer | Delivered React output | Production timing | Hydration | React capability context |
|---|---|---|---|---|---|
| Browser page | Client-only | Client assets and browser-rendered DOM | Application build, then browser execution | None for producer-rendered HTML | Browser and remote capabilities |
| Browser page | Identified build-time producer | Generated HTML or RSC payload plus client assets | Build or CI | Required when producer-rendered HTML is the initial tree | Browser, remote, and server/client capabilities |
| Browser page | Identified request-time or remote producer | Per-request HTML or RSC payload, or remote data | Request or remote call | Required when server-rendered HTML is the initial tree | Browser, remote, and server/client capabilities |
| Electron renderer | Client-only | Packaged client assets and renderer DOM | Application build and packaging, then renderer execution | None for producer-rendered HTML | Data-only renderer capability contract |
| Electron renderer | Identified build-time producer | Generated HTML or RSC payload plus packaged client assets | Build or CI before packaging | Required when generated HTML is the initial tree | Data-only renderer capability contract plus server/client capabilities |
| Electron renderer | Identified request-time or remote producer | Remotely produced HTML or RSC payload, or remote data | Request or remote call | Required when server-rendered HTML is the initial tree | Data-only renderer capability contract plus remote and server/client capabilities |

“Server” in Server Components names a separate producer environment, which may run during a build rather
than as a live server. RSC, Server Functions, streaming SSR, and hydration exist only when an identified
framework or bundler implements them. A client-only bundle has no target for them on either presentation
surface. Conversely, either presentation may consume compatible build-time or remote output.

## Browser presentation

A browser page may use any producer row above. React mounts in the browser DOM and consumes browser or remote
capabilities. Browser deployment, routing fallback, asset bases, caching, and transport belong to the
identified framework, bundler, or hosting stack rather than to this reference.

## Producer architectures

- **Client-only** means the delivered client bundle is the only React producer.
- **Build-time** means an identified framework or bundler runs its producer environment during build or CI
  and emits artifacts for the presentation surface.
- **Request-time or remote** means an identified framework or server produces output per request or behind a
  remote boundary.
- The presentation consumes producer output; it does not become that producer.
- Serialization, directives, Actions, Server Functions, and hydration follow
  [`server-client.md`](server-client.md), independent of whether the DOM is in a browser page or an Electron
  renderer.
- Server Function validation and authorization follow H18 at the endpoint, independent of presentation.

## Electron renderer presentation

### React mounts only in the renderer DOM

For React, an Electron renderer is a DOM presentation surface. Main and preload are not React presentation
surfaces. A component, hook, context, and rendered element follow the same React rules as they do in a browser
DOM.

This placement statement does not decide Electron process authority or project shape. Give those decisions to
`electron-convention` and `electron-development`, and use `electron-runtime` for capability lookup.

### Producer architecture remains independent

A packaged client bundle is one common producer choice, not an inherent property of Electron. An Electron
renderer may consume build-time or request-time/remote output when an identified producer implements and
delivers it. The renderer remains the presentation surface, and producer output does not change the host
capability contract React consumes.

A migration therefore follows the producer change, not the word “Electron.” Moving to a client-only producer
requires replacing producer-dependent work. Retaining a compatible build-time or remote producer preserves
its output, serialization, and hydration contracts.

### Consume host capabilities like other asynchronous capabilities

React receives a data-only capability contract; the Electron family owns how the platform safely creates and
implements it.

- Treat request/response capability calls like other promises. Start them from the event or external-system
  synchronization that owns the work, represent loading, failure, cancellation, and stale results, and keep
  platform objects out of component state and props.
- Treat push capability calls as subscriptions. Start them in an Effect when synchronization is required and
  return the disposer in H6’s cleanup.
- Keep capability absence explicit. Browser builds, unit tests, component workshops, and static previews may
  not have an Electron host. Inject or adapt the capability so these environments can supply an unavailable,
  fake, or test implementation rather than crashing on a host-only global.
- Keep the contract data-only at the React boundary. If work needs a new platform operation, event,
  validation rule, or trust decision, route it through `electron-convention`, `electron-development`, and
  `electron-runtime`; do not design it in a component or hook.

React tests can prove presentation, state, cleanup, and unavailable-capability behavior through the visible
surface. Give bridge, process, trust, lifecycle, and packaged claims to `electron-test`.

### Packaged-renderer consequences

A development server and a packaged renderer can resolve routes and assets differently. That difference
belongs in React because the failure is visible as a missing view, broken navigation, or missing asset.

React work therefore:

1. avoids assuming that development-only URL and asset behavior proves the shipped presentation;
2. verifies initial navigation, direct navigation, refresh or recreation, lazy chunks, public assets, and
   error routes through the rendered user-visible surface; and
3. runs those checks against the actual packaged artifact when the claim is about the shipped application.

React does not prescribe the loader, protocol, URL scheme, router mode, asset-packaging mechanism, or release
configuration. Load `electron-convention` and `electron-runtime` for platform design and lookup,
`electron-test` for packaged evidence, and `electron-release` for the artifact.

Long-lived desktop surfaces make forgotten subscriptions and stale asynchronous work especially visible, but
the React rule does not change: H6 cleanup and current-result handling apply.

## What presentation changes

| React concern | Browser page | Electron renderer |
|---|---|---|
| Mount location | Browser DOM | Renderer DOM |
| Producer choice | Client-only, build-time, or request-time/remote | The same three independent choices |
| Local host capability | Browser capability | Data-only renderer capability contract |
| Capability absence | Model remote or browser feature absence | Also model absence outside the Electron host |
| Subscription lifecycle | H6 cleanup | H6 cleanup |
| Shipped route and asset evidence | Production browser deployment | Actual packaged renderer artifact |
| Platform mechanism owner | Browser or framework stack | Electron root and applicable children |

Hooks, purity, keys, composition, state placement, markup, accessibility, and user-visible testing otherwise
transfer unchanged.

## React Native

React Native remains out of scope by decision. This skill covers DOM presentation in browser pages and
Electron renderers. Its markup and host-capability consequences do not transfer to a native renderer without
separate work, and no future coverage is implied.

## References

- [`SKILL.md`](SKILL.md) — H6 cleanup, H16 capability consumption, H17 architecture independence, H18
  endpoint trust, and the P1/P2/P7 routing.
- [`server-client.md`](server-client.md) — React server/client serialization, directives, Actions, Server
  Functions, streaming, and hydration.
- [`electron`](../electron/SKILL.md) — exclusive router for Electron platform work.
- [`electron-convention`](../electron/electron-convention/SKILL.md),
  [`electron-development`](../electron/electron-development/SKILL.md),
  [`electron-runtime`](../electron/electron-runtime/SKILL.md),
  [`electron-test`](../electron/electron-test/SKILL.md), and
  [`electron-release`](../electron/electron-release/SKILL.md) — Electron convention, construction, lookup,
  evidence, and release owners respectively.
- [Server Components](https://react.dev/reference/rsc/server-components) — producer implementation and
  build-time or request-time execution.
- [`use client`](https://react.dev/reference/rsc/use-client) — the server/client module boundary and
  compatible-bundler requirement.

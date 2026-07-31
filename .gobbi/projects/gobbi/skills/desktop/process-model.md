# Desktop Outcome Projection — Placement and Capability Contracts

This is a subordinate Desktop outcome projection. It cannot replace an applicable Electron skill and states
no Electron process, preload, bridge, IPC, module, loader, security, or build policy.

Before using it, **MUST load [`electron`](../electron/SKILL.md)** and:

- [`electron-convention`](../electron/electron-convention/SKILL.md) for process authority, security
  boundaries, project shape, bridge and IPC contracts, errors, and platform defaults;
- [`electron-development`](../electron/electron-development/SKILL.md) for any implementation or review
  crossing main, preload, renderer, utility, window, lifecycle, or native boundaries;
- [`electron-runtime`](../electron/electron-runtime/SKILL.md) for capability, preload, IPC, loader, and
  process-behavior lookup; and
- [`electron-test`](../electron/electron-test/SKILL.md) for process, contract, trust, cleanup, reload, or
  packaged evidence.

Load [`electron-release`](../electron/electron-release/SKILL.md) as well when placement affects emitted or
packaged artifacts.

## Desktop projection

Translate the accepted product design into an outcome-facing capability inventory:

| Field | Product question |
|---|---|
| User action | What does the person ask the application to do? |
| Required capability | What result cannot be produced by presentation code alone? |
| Input and output | What data does the product need to provide and receive? |
| Authority reason | Why does this capability need privilege at all? |
| Lifetime | Which window, view, task, or application state owns it? |
| Expected failure | What can fail, and what must the person perceive or recover? |
| Completion evidence | What authoritative observation proves the user-visible result? |
| Claimed targets | On which operating systems and entry modes is the promise made? |

Keep the inventory in product language. It may name a data-only capability contract, but it does not choose
the Electron process, API, channel, loader, compiler target, setting, or transport. Give those decisions to
`electron-convention`, `electron-development`, and `electron-runtime`.

For every capability:

1. Map its success, cancellation, denial, unavailable, malformed-input, stale-owner, reload, and disposal
   outcomes into the product flow.
2. Keep presentation code dependent only on the data and operations the product needs, never on Electron
   platform objects.
3. Preserve foreseeable, refusable, and recoverable consequences under the Desktop safety floor.
4. Return the Electron family’s exact placement and contract decisions to the Desktop outcome trace without
   restating their policy here.
5. Give the resulting evidence contract to `electron-test`, including the user-visible completion that
   Desktop will accept.

This projection is complete when every product capability has one outcome owner, lifecycle, failure model,
and acceptance observation, and every Electron mechanism decision is routed to the applicable child.

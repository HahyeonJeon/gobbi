# Fixture — every category, every process

Proves the harness handles `prelude` + `partial` linkage keyed by
**(process, key)**, the self-verifying `expect-error` category, the `type-level`
category (asserted via `@ts-expect-error`, no expect-type / tsd dependency), the
`tsx uncompiled` marker, and the non-code fence allowlist. The harness MUST exit
0 on this file.

## Process-keyed linkage

The two prelude/partial pairs below deliberately share the key name `ipc` while
declaring **different** `OpenExternalRequest` shapes. They are linked by
`(process, key)`, so the `main` prelude never reaches the `preload` partial. If
linkage were keyed by `key` alone, the two interfaces would merge and the `main`
partial would fail for a missing `windowId` — that is what makes this a check
and not a demonstration.

```ts main prelude key=ipc
interface OpenExternalRequest {
  readonly url: string;
}
```

```ts main partial key=ipc
const request: OpenExternalRequest = { url: "https://example.com" };
```

```ts preload prelude key=ipc
interface OpenExternalRequest {
  readonly url: string;
  readonly windowId: number;
}
```

```ts preload partial key=ipc
const request: OpenExternalRequest = { url: "https://example.com", windowId: 1 };
```

## expect-error — the ambient guard, asserted

The renderer has no Node globals. The block type-checks clean IFF the error is
genuinely present:

```ts renderer expect-error
// @ts-expect-error the renderer gets no @types/node — `process` is not a global here
const platform: string = process.platform;
```

## type-level

```ts renderer type-level
type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

const same: Equals<string, string> = true;

// @ts-expect-error string and number are not the same type
const different: Equals<string, number> = true;
```

## A `tsx` block, marked uncompiled

React examples are not compiled by this harness (no JSX runtime is installed),
so they declare it on the fence. The runner counts them separately:

```tsx uncompiled
export function OpenButton({ url }: { readonly url: string }) {
  return <button onClick={() => window.api.openExternal(url)}>Open</button>;
}
```

## A non-code fence

```text
main  ->  preload  ->  renderer
```

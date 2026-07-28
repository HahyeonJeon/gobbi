# Fixture — keyless linkage and an unsupported fence language

Two violations in one file, and the harness MUST report BOTH before exiting
non-zero: `FAIL[keyless-linkage]` for each of the two blocks below, and
`FAIL[unsupported-language]` for the `js` fence.

## Keyless prelude / partial

In the origin extractor the empty key was a shared default, so a keyless prelude
of one process was concatenated into a keyless partial of another — the harness
performing, inside its own machinery, the cross-process mixing it exists to
forbid. An explicit `key=NAME` is now required on both ends.

```ts main prelude
interface OpenExternalRequest {
  readonly url: string;
}
```

```ts main partial
const request: OpenExternalRequest = { url: "https://example.com" };
```

## An unsupported fence language

Electron's own documentation writes its samples as `js`, so this is the likeliest
way for a taught fact to vanish from a doc set unnoticed:

```js
const { app } = require('electron')
app.whenReady().then(() => console.log('ready'))
```

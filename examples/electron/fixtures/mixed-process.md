# Fixture — mixed process globals

Both blocks below are tagged correctly and reach for a global their process does
not have. The harness MUST exit non-zero, and the failure MUST be `TS2584` in
the `main` pass and `TS2591` in the `renderer` pass — the two ambient guards. A
single combined tsconfig compiles both of these clean, which is the false pass
this harness exists to prevent.

The main process has no DOM:

```ts main complete
export const pageTitle: string = document.title;
```

The renderer has no Node:

```ts renderer complete
export const platform: string = process.platform;
```

# Electron — Process Model

**Owns** — what runs where: the three-process map and the decision rule for placing code; the sandboxed
preload's module surface and its bundle-to-one-file consequence; the per-process ESM matrix;
`utilityProcess.fork()` as the sanctioned offload target; and which `electron` module surface each process
may import. **Owns no `webPreferences` table.**

# Electron — IPC

**Owns** — the process boundary's data path: the mechanism decision across `invoke`/`handle`, `send`/`on`,
`MessagePort`, and `sendSync`; **both** serialization tables side by side — Structured Clone for IPC and the
wider `contextBridge` table; the four bridge anti-patterns; the complete `senderFrame` contract with the deny
branch for each outcome; the `interface.d.ts` typed-contract shape; and the runtime-validation-on-the-main-side
principle.

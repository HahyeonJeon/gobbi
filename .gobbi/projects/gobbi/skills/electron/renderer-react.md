# Electron — Renderer and React

**Owns** — the Electron↔React seam: the router-strategy fork under the packaged origin; mounting under that
origin; the pattern for moving an IPC push into React state without leaking the internal `event`; and the
explicit statement that general React idioms are out of scope. **Owns no load-path switch.**

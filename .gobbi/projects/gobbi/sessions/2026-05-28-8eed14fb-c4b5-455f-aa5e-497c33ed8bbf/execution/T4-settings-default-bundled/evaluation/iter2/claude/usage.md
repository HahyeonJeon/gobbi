# Usage Perspective — T4 iter2

**Verdict:** PASS
**Confidence:** 75

## Consumer impact
A consumer extracting a single mode (e.g., `jq '.chat'`) now receives a self-versioned payload. Eliminates need for the caller to splice the parent `schemaVersion` back in when persisting a per-mode snapshot. Aligns with Layer-1 version-pinning expectation downstream code applies to mode payloads.

Backward compat: top-level `schemaVersion` retained, so existing readers that key off the parent continue to work.

## New findings
None — no usage regression observed.

## Verdict
PASS.

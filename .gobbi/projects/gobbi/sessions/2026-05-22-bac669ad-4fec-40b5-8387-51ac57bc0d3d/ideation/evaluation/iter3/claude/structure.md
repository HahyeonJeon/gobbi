---
perspective: structure
iter: 3
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

(See project.md — same artifact, same reader profile.)

**Memory reads**: Same as project.md. iter2/claude/structure.md reviewed.

---

## Locked Frame (Stage 1)

### Inherited prior-iter open findings (from iter2 Claude/Structure)

None open from iter2. All structure findings were PASS in iter2.

### Scenario 1: Components cohere, unidirectional dependency
**Attached checklist:**
- [x] P1 through P7 tasks are sequentially ordered with no circular dependency
- [x] Each task owns one concern

### Scenario 2: Design decisions name library/framework/API shape explicitly
**Attached checklist:**
- [x] bash + jq named explicitly
- [x] `jq -r @sh` named as the shell-safe serialization mechanism (FIX C)
- [x] `jq -r @sh` has a concrete code example showing how it works

### Scenario 3: Boring-by-default
**Attached checklist:**
- [x] No novel structural pattern; bash + jq is the ecosystem-standard approach for this type of hook

### Scenario 4: Two-week smell test
**Attached checklist:**
- [x] Decisions Log (P1-P7) with rationale; readable from artifact alone

### Scenario 5: Testability first-class
**Attached checklist:**
- [x] Success criterion 4 adds a round-trip test specification for shell-safe serialization (FIX C)
- [x] Success criterion 1 (rg returns empty) is mechanically verifiable

### Scenario 6: Circular dependency / shared-state hub (adversarial)
**Attached checklist:**
- [x] No circular dependency introduced by iter3 changes

### NEW: FIX C structural coherence check
**Attached checklist:**
- [x] `jq -r @sh` canonical pattern shown
- [~] Canonical pattern shows only stdin-JSON-derived fields (`.transcript_path`); passthrough env vars (`CLAUDE_PROJECT_DIR` etc.) need a different mechanism. "Equivalent POSIX-shell-safe quoting" clause covers this, but no example provided for env-sourced values. Medium/75 (see Typed findings).

---

## Per-scenario per-check results

Iter3 adds FIX C with concrete `jq -r @sh` example. Structure improves. One gap: the canonical example works for jq-input fields; the passthrough re-export (env-sourced, not stdin-JSON-sourced) requires a different quoting mechanism not illustrated.

---

## Typed findings

### F-STRUCT-01 (NEW, iter3)

```yaml
finding-id: struct-01-atsh-passthrough-env-gap
type: checklist_gap
domain: security
disposition: open
confidence: 75
severity: Medium
```

**Evidence**: Lines 237–252. The hook contract section specifies `jq -r @sh` for all exported fields and states "The same @sh pattern applies to every exported field above" (line 252). The canonical code example (lines 246–249) uses jq's `.transcript_path` field-access syntax to read from the stdin JSON payload. The 3 passthrough env-var re-exports (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`) at lines 238–241 are NOT sourced from stdin JSON — they are read from the current environment. The `jq -r @sh "export VAR=\(.field)"` pattern cannot be applied as-is to env-sourced values without piping the env value into jq separately. The "equivalent POSIX-shell-safe quoting" escape clause (line 252) permits an alternative, but no example or guidance is provided for the env-sourced case.

**Why it matters**: An Executor following the canonical pattern verbatim will produce correct output for the 8 stdin-JSON-derived fields but may emit unsafe `export CLAUDE_PROJECT_DIR=$CLAUDE_PROJECT_DIR` lines for the passthrough re-exports if they do not realize the pattern differs. The env-sourced values can contain spaces or special characters on systems where paths include spaces (common on macOS).

**Suggested direction** (findings only): The hook contract's shell-safe section should note explicitly that passthrough env-var re-exports require a different quoting mechanism (e.g., `printf 'export CLAUDE_PROJECT_DIR=%s\n' "$(printf '%q' "$CLAUDE_PROJECT_DIR")"` or piping through jq's `@sh` separately). Or the "equivalent POSIX-shell-safe quoting" clause should be clarified with a passthrough-specific example.

---

## Low-confidence appendix

None.

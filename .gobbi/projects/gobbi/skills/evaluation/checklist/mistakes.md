---
type: mistakes
skill: checklist
description: "Recorded traps for checklist — load before doing checklist work"
updated: 2026-07-26
---

# Checklist — Mistakes

> Load before any checklist work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Evidence Is Not A Pass Condition

`priority: high` · `domain: evaluation` · `added: 2026-07-26` · `status: active` · `tags: [evaluation, verification]`

**What happened** — A planted fixture removed a required obligation primitive from a checklist item's `Pass:` meaning. The `Evidence:` method could still have noticed the defect, so reading Evidence as part of acceptance made the item look covered.
**Why it happens** — Evidence explains how to inspect a predicate; it does not itself forbid or require any state. Treating `Pass:` and `Evidence:` as one combined predicate gives detection prose acceptance force it does not own.
**How to detect** — A required or forbidden primitive appears only in `Evidence:` and is absent from `Pass:`, or a reviewer says an item passes because its evidence method could notice the violation.
**Correct approach** — Put every required or forbidden obligation primitive in `Pass:`. Use `Evidence:` only to state how the reviewer proves that predicate. Test the distinction with a fixture that preserves Evidence while removing the primitive from Pass.

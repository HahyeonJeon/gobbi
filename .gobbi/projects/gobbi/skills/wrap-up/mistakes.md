---
type: mistakes
skill: wrap-up
description: "Recorded traps for wrap-up — load before doing wrap-up work"
updated: 2026-06-27
---

# Wrap-Up — Mistakes

> Load before any wrap-up work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Wrap Up Green Check Must Rerun Standing Guards Post Promotion

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [verification, process]`

**What happened** — A migration session drove a project content-guard to zero, then Wrap-up promoted 14 memory files plus a journal. The Stage-3 memory-validation gate (both systems PASS) re-ran the frontmatter validator and checked promotion coverage, routing, strip-integrity, and no-delete — but it never re-ran the project's standing content-guard over the post-promotion tree. Seven of the promoted files legitimately quote the retired-form tokens in their body prose. The guard's allowlist had been derived from the pre-promotion tree, so it did not cover the new carriers, and the guard flipped from exit 0 to exit 1 with 17 residuals. The regression was caught only by a manual pre-commit guard re-run, AFTER the dual-system gate had already returned PASS.
**Why it happens** — The Stage-3 evaluation brief enumerated the frontmatter validator as the runnable check and omitted the project's other standing guards. A promotion is not a no-op on content-guards: promoted mistakes, journals, plans, and decisions frequently DOCUMENT the very vocabulary or pattern a guard scans for, so each promotion can add legitimate carriers an allowlist derived before the promotion will not recognize. Validating frontmatter proves the records are well-formed; it says nothing about whether the new content trips a body-content guard. The two checks measure different things, and passing one is silently assumed to cover the other.
**How to detect** — The Wrap-up / Stage-3 brief lists the frontmatter validator as the only runnable green-check and omits the project's content-guards, link checker, or reference resolver; a standing guard the originating session drove to exit 0 reports exit 1 immediately after promotion on lines inside newly promoted files; the flagged lines are documentation of the scanned pattern (a mistake explaining it, a journal narrating it), not live use — the signal that the carrier is legitimate and the allowlist, not the file, needs the change.
**Correct approach** — The Wrap-up green-check (and the Stage-3 brief that drives it) MUST re-run EVERY standing project guard over the post-promotion tree, not only the frontmatter validator: the content/vocab guards, the link checker, and any layer/reference resolver. Enumerate the guards from the project's verification surface and run each against the tree as it stands AFTER promotion. When a promotion adds a legitimate carrier that a guard flags, extend that guard's allowlist using its own discipline (derive from a fresh run, file-plus-line keyed) in the same commit that lands the promotion. Treat "all standing guards exit 0 over the post-promotion tree" as a non-negotiable pre-commit gate, distinct from "frontmatter validates".

### Related
- [[strip-contract-dropped-required-extension-field]] — sibling Wrap-up-promotion trap caught the same session: a promotion step validated against the wrong authority

## Strip Contract Dropped Required Extension Field

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [verification, process]`

**What happened** — The Wrap-up routing contract instructed "strip `domain`" on 6 mistake promotions. `domain` is a REQUIRED mistakes extension — the validator FAILS any mistakes file missing it, and all existing promoted mistakes carry it. Had the strip been applied, all 6 promoted files would have FAILED the non-skippable stage-3 validator gate. The same defect appeared twice more in the same contract: it told the promoter to strip `scope` / `feature` from feature-scoped files (required base fields) and `project-scope` from a backlog (a required backlogs extension).
**Why it happens** — The contract author reasoned only from the staging-field STRIP table (what to remove) and never cross-checked the REQUIRED-extension list (what must remain) for the destination type. The strip table and the required-extension list are two different authorities. A field can be absent from the strip table AND required — `domain` is exactly that: it is not a staging-only field, so the strip table never lists it for removal, yet the standard requires it on every mistakes file. Deriving a strip instruction from the strip table alone silently drops a required field.
**How to detect** — A strip / promotion contract names a field to remove that appears in the destination type's required-extension set (mistakes → `priority` / `domain`; backlogs → `priority` / `project-scope`; references → `title` / `source` / `ref_type`; reviews → `review_kind`; reports → `report_type`) or in the required base set (`scope`, `feature`, etc.); a promoted file fails the validator with a "missing required base field" or "missing required extension" error immediately after a strip step; the strip instruction was written by reading only the strip table.
**Correct approach** — Any routing/strip contract that promotes a file between types MUST validate the final frontmatter against the destination type's required-extension list BEFORE delegating — not just against the strip table. The two checks are complementary: the strip table removes staging-only routing fields; the required-extension list guarantees the destination type's mandatory fields survive. When a contract instruction conflicts with a required field, the producing agent keeps the required field and flags the conflict rather than silently stripping it. The cheapest guard is to run the validator on each promoted file before declaring the promotion done — a clean exit proves no required field was dropped.

---
name: promotion-writer-leaks-content-wrapper-tag
description: A memory-write mechanism appended a stray trailing </content> tag to every file it wrote — invisible below frontmatter, undetected by every standing guard, and it RECURRED after a symptom-only strip
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-10
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [docs-sync]
keywords: [content-wrapper-tag, promotion-write, raw-file-content, stray-markup, guard-blindspot, root-cause-vs-symptom]
author: claude
priority: high
domain: docs-sync
supersedes: null
---

# A memory-write mechanism leaks a stray `</content>` wrapper tag into every file it writes

## What happened

Every one of the 29 files written during this session's Wrap-up memory promotion (commit `75cc1181`)
ended with a literal trailing line reading `</content>` — with no matching opening `<content>` tag
anywhere. It is invisible below the YAML frontmatter, so a frontmatter-only validator does not see it,
and `check-markdown-links.sh` / `check-residual-vocab.sh` / `check-skill-mistakes.sh` all passed the
files clean. The Stage-3 memory-validation EVALUATOR (Claude, High conf) caught it by reading file tails.
The remediation stripped the tag from the 29 files with `sed` — but the SAME writer, writing the new
journal note + handoff + audit manifests to fix a different finding in the very next commit (`a7ab1830`),
**re-leaked `</content>` into all five newly-written files**. The strip fixed the symptom; the writer
was never fixed, so it recurred. Final fix: the manager `sed`-stripped every affected file (not via the
leaky writer) and grep-verified zero trailing tags.

## Why it happens

The write mechanism emits a closing artifact of a `<content>...</content>`-style envelope without
stripping it from the persisted file. Because it lands as the LAST line, after all real content, nothing
a casual read or a header-only validator checks will surface it. Stripping the symptom from already-written
files does not stop it — any subsequent write by the same mechanism re-injects it (Principle 8: a
symptom strip is not a root-cause fix).

## Correct approach

A memory write must persist RAW file content only — no wrapper markup, opening or closing. Treat a
symptom-strip as insufficient: if the writer itself leaks, every future write re-leaks, so either
root-cause the writer or do NOT use it for the fix. When a writer is demonstrably leaking, the manager
performs the correction with a deterministic tool (`sed`) rather than re-dispatching the same writer.
Before treating any promotion/bulk-write batch as complete, grep the FULL written set (not just the
frontmatter) for stray markup: `grep -l '</content>\|<content>' <written-files>` must return zero.

## How to detect

After any promotion or bulk-write pass, check every newly-written file's LAST line (not just the
frontmatter) for markup fragments (`</content>`, `<content>`, or similar wrapper tokens). A stray closing
tag with no matching opening tag in the same file is the definitive signal — legitimate markdown never
produces an unbalanced tag. Re-check after the fix commit too: a writer that leaked once leaks again.

## Related

- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]] — sibling docs-sync trap where a structural guard was blind to a defect class (there: seed-source prose; here: below-frontmatter markup)
- `skills/orchestration/scripts/check-eval-childdocs.sh` and the standing memory guards all passed these files — this trap is the case for an adversarial full-file read on top of the automated guards

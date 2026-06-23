---
name: area-frontmatter-stray-key
description: The area: staging field fails the validator's no-stray-keys gate unless §2.2 is amended — Planning must decide keep-or-strip before Execution encodes it.
type: decisions
scope: feature
feature: memory
status: proposed
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, validation, frontmatter]
keywords: [area-field, stray-key, allowlist, NEW-USAGE-1, disposition-open]
author: claude
supersedes: null
superseded_by: null
---

# Decide: keep `area:` as a promoted base field or strip it on promotion

## Context

The area-namespace schema (see `memory-namespace-schema.md`) defines `area:` as an OPTIONAL staging field (ROOT 1.5) an agent may set at write time to override Step 2 of the selection rule. If absent, Wrap-up resolves the area from tags and writes the file into `{type}/{area}/`.

The problem: `area:` is not in `rules.md` §2.1 (base frontmatter) or any §2.2 type extension. The validator's no-stray-keys check (`§2.6`, `§4.4`) rejects any key outside the per-type allowlist. So a staged file carrying `area:` currently fails validation as a stray key.

There are two branches. Planning must pick one before Execution encodes the field.

## Decision

**Open — Planning must decide.**

## Rationale

### Branch A — Add `area:` to §2.2 as a new optional extension field for all by-area types

- Amend `rules.md` §2.2: add `area` (string | null, optional) to the extension rows for all by-area types.
- Update the validator's per-type allowlist to permit `area:` on by-area types.
- On promotion, Wrap-up keeps `area:` as part of the promoted file (it is a durable field encoding where the file lives).
- Consequence: `area:` persists in the promoted file and is readable by consumers as a cross-check against the directory.
- Risk: adds a new field to §2.2 (just redesigned in #306); requires co-touching the validator.

### Branch B — Strip `area:` on promotion (staging-only field, like `mistake-candidate:`)

- Treat `area:` exactly like `mistake-candidate:` — a staging-only routing flag.
- It is used by Wrap-up to resolve the destination path, then stripped.
- The promoted file does NOT carry `area:` — the directory encodes the resolved area.
- `rules.md` §2.6 gets a new line listing `area:` as a staging-only field to strip.
- Consequence: the promoted file's directory is the sole encoding of area (no redundant field); consumers derive area from the path.
- Risk: a future consumer that wants to read `area:` from frontmatter must derive it from the path instead, which is valid but slightly less convenient.

## Alternatives considered

- **Branch A** — lower consumer friction; costs a §2.2 amendment.
- **Branch B** — simpler frontmatter model (directory = the sole encoding); costs nothing in §2.2 but requires §2.6 amendment and consumers to derive area from path.

## Consequences

Whichever branch Planning selects:
- Execution encodes the field accordingly (either in §2.2 extension rows + validator allowlist, or in §2.6 strip list).
- The validator's per-type allowlist is updated to match.
- Wrap-up routing table documentation is updated to state whether `area:` persists or is stripped.

## Related

- [[memory-namespace-schema]] — the design that introduced the `area:` field and its lifecycle question

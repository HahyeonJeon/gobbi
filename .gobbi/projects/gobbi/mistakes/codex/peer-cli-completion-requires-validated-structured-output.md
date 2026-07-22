---
name: peer-cli-completion-requires-validated-structured-output
description: Peer completion requires a captured exit status plus one schema-valid, invocation-bound JSON response.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [codex, verification]
keywords: [peer-cli, exit-status, structured-output, json-schema, invocation-binding]
author: claude
priority: high
domain: codex
---

# Peer CLI completion requires validated structured output

## What happened

In a historical dual-system pass, a detached peer command exposed no trustworthy completion status.
The manager tried to infer success from an output file's presence and a content marker. That could not
prove process completion, JSON shape, schema conformance, runtime identity, or binding to the current
contract and subject.

## Why it happens

The process lifecycle and artifact contract were treated as separate weak signals. A non-empty file can
be partial, stale, malformed, mislabeled, or left by an earlier invocation. A detached launch can also
lose the exact child status that distinguishes timeout from another process failure.

## Correct approach

Use an explicit process or runtime session identity whose final status can be read exactly. Capture the
exit status before inspecting the response: status `124` is a timeout, and every other nonzero value is
a process failure. Then require one non-empty JSON object, validate it against the record-owned artifact
schema, and compare system, step, iteration, assignment, runtime identity, contract digest, and subject
digest with the frozen invocation.

Only after those checks may the active-runtime assistant persist the response through
`session-record.sh write-artifact` and run the owner validator. A missing status, marker-only file,
partial stream, or plausible prose is no report. Pause without substitute content.

## How to detect

The wrapper cannot produce the peer's exact final status, or it accepts a response because a file is
non-empty or contains an expected marker. Another signal is storing Markdown before JSON Schema,
identity, and digest checks pass.

## Related

- [[peer-cli-host-timeout-must-pause]] — the related host-timeout failure boundary
- [[opposite-system-peer-must-be-read-only]] — the related peer isolation boundary

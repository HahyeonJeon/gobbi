---
name: shell-pipeline-digest-includes-tool-trailing-newline
description: A reimplemented digest can silently drop the trailing newline a shell pipeline tool appends, causing a schema-valid artifact to fail only its digest check.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification, evaluation]
keywords: [fingerprint, jq, sha256, canonicalization, trailing-newline]
author: claude
priority: high
domain: verification
---

# A shell-pipeline digest includes the producing tool's trailing newline

## What happened

Finding fingerprint values were computed in Python with a JSON serializer configured to match a
shell canonicalization tool's output byte-for-byte, and that string was hashed. Every fingerprint
was a well-formed 64-hex value, the report passed schema validation, and every semantic invariant
passed — yet every one of those fingerprints would still have failed the authoritative fingerprint
check.

## Why it happens

The authoritative validator computes the digest through a shell pipeline: a canonicalizing tool
(for example `jq -cS`) produces the canonical JSON, and a hashing tool reads it from standard
input. The canonicalizing tool terminates its output with a newline, and the hashing tool hashes
every byte on standard input — so the authoritative digest covers the canonical JSON plus that
trailing newline byte. Reimplementing the canonicalization in another language gets the JSON
exactly right and silently drops the newline the PIPELINE contributes: the specification describes
a canonical FORM, but the guard actually computes over a PIPELINE. This is invisible to inspection
— both digests are structurally valid 64-character hex hashes, so nothing looks wrong until the
guard actually runs.

## Correct approach

Do not reimplement a guard's digest from its prose description alone. Run the guard's own command
on real candidate bytes and diff the two digests before writing them into an artifact. If
reimplementation is unavoidable, byte-compare the canonical strings themselves (not only the
resulting hashes) — an equal-length hex digest tells you nothing about where two inputs diverged,
while a byte-level diff localizes an extra trailing newline immediately.

## How to detect

- Any digest an external guard computes through a shell pipeline, reimplemented in another
  language.
- The tell: the specification describes a canonical FORM (a canonicalizing filter, a sort, a
  formatted print) while the guard actually computes the digest over a PIPELINE whose producing
  tool appends a line terminator.
- Suspect this whenever a schema-valid, semantically-correct artifact fails only its digest or
  fingerprint check.
- Most line-oriented shell tools (a canonicalizing filter, a sort, a newline-terminated print)
  append a trailing newline; a small number of raw-output modes do not — so the same
  reimplementation can be correct against one producer and silently wrong against another.

## Related

- [[verifies-must-be-self-failing]] — the same family: a check written against your own output
  agrees with you because it shares your wrong assumption. The generalizable rule this witnesses:
  verify against the guard that will actually run, not against a second implementation of your own
  reasoning about what it does.

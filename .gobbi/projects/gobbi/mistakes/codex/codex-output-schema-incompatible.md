---
name: codex-output-schema-incompatible
description: "`codex exec --output-schema` cannot be used with any record-owned JSON Schema in this repo — the schemas use structural-validation dialect features the structured-output flag's dialect subset rejects, and every dual-system evaluation hits it."
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [codex, verification]
keywords: [output-schema, structured-output-dialect, evaluation-report-schema, json-schema-subset]
author: claude
priority: high
domain: codex
related: [peer-cli-completion-requires-validated-structured-output, structured-enum-field-must-be-exact]
---

# `codex exec --output-schema` rejects every record-owned schema in this repo

## What happened

`codex exec --output-schema` was the documented, load-bearing command in the `codex` skill for
getting a schema-validated structured response out of a Codex evaluator run. Run against
`evaluation-report.schema.json` — the record-owned schema every dual-system evaluation in this
project must validate against — the flag failed with 46 separate structural violations, spanning
four independent categories: 18 properties missing an explicit `type` keyword; every use of
`pattern` (regex-constrained string properties); every use of `minItems`/`maxItems` (array-length
bounds); every use of `minLength`/`maxLength` (string-length bounds); every use of `minimum`/
`maximum` (numeric bounds); every use of `uniqueItems`; and every use of `prefixItems` combined
with `allOf`. The flag's structured-output dialect is a strict subset of JSON Schema, and this
schema — a normal, valid JSON Schema by every other measure — uses features from outside that
subset throughout, not in one isolated corner. Because every dual-system evaluation in this
project produces and validates a report against exactly this schema, every one of them hits this
incompatibility if it tries to use the documented flag.

## Why it happens

`--output-schema` accepting "a JSON Schema file" reads as accepting JSON Schema generally, and the
flag's own documentation does not foreground that it actually enforces a narrower structured-
output dialect (the same restricted subset most LLM-provider structured-output APIs use, which
drops bound/pattern/uniqueness keywords in favor of a simpler type-and-properties shape). A schema
author who validates a schema against the full JSON Schema specification — which
`evaluation-report.schema.json` does, and which is correct for its actual use as a validation
gate elsewhere in the pipeline — has no reason to expect a DIFFERENT, narrower consumer to reject
it. The flag's failure mode compounds this: it does not report which specific keyword triggered
the rejection in a way that immediately reads as "your schema uses feature X, outside my dialect"
— the 46 violations had to be manually categorized into four classes before the root cause was
clear.

## Correct approach

Do not attempt `codex exec --output-schema` against `evaluation-report.schema.json` or any other
record-owned schema that uses `pattern`, length/numeric bounds, `uniqueItems`, or
`prefixItems`+`allOf` — assume incompatibility and use the workaround directly rather than
re-discovering the failure each time. The workaround that worked and passed canonical validation:
drop `--output-schema` entirely, inline the schema's structural requirements directly into the
prompt text as instructions, let Codex produce plain JSON output, and validate that output
LOCALLY afterward against the unmodified, canonical `evaluation-report.schema.json` using the
project's own validator. This preserves the schema as the single source of truth (no schema fork
or dialect-narrowed copy) while working around the CLI flag's narrower acceptance dialect.

## How to detect

Any plan to use `codex exec --output-schema` against a schema that has not been specifically
verified to use only the structured-output dialect's supported keyword subset (types, properties,
required, and simple nesting — no `pattern`, no min/max bounds, no `uniqueItems`, no
`prefixItems`+`allOf`). Before relying on the flag for a new schema, either check the schema for
these keywords directly or run a smoke test against a minimal instance first. The `codex` skill's
own documentation of `--output-schema` as "the load-bearing command" for structured Codex output is
itself the trigger to verify dialect compatibility before depending on it for any record-owned
schema.

## Related

- [[peer-cli-completion-requires-validated-structured-output]] — the general contract this trap is
  a specific tooling exception to: a peer CLI's structured response must still be schema-validated
  before it is trusted, whichever mechanism produces it
- [[structured-enum-field-must-be-exact]] — a sibling structured-output discipline: the schema is
  the exact machine contract, and any consumer narrower than the schema (here, the CLI flag itself)
  must be worked around without weakening the schema

---
name: codex-exec-model-config-overrides
description: "codex exec supports per-run model and TOML config overrides."
type: references
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [memory, design]
keywords: [codex-exec, model-override, config-override]
author: codex
title: "Codex exec model and config overrides"
source: "https://developers.openai.com/codex/cli/reference"
accessed: 2026-07-10
ref_type: docs
---

# Codex exec model and config overrides

## Insight

`codex exec` accepts `--model, -m` and repeatable `--config, -c key=value`; config values are parsed as TOML when possible.

## Reason

Each Claude-hosted proposer/evaluator run can enforce the selected model and `model_reasoning_effort` without relying on host configuration or a standalone effort flag.

## Source

- https://developers.openai.com/codex/cli/reference
- OpenAI Codex CLI reference, accessed 2026-07-10

## Excerpt

Paraphrase: `-m` overrides the configured model, while `-c` applies inline configuration values to a non-interactive run.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-07-10 | 019f4a1e-8898-7e51-845b-ec289f1400c7 | Exact Claude-to-Codex bridge standard. |

## Related

None.

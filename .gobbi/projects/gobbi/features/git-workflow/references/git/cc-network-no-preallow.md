---
name: cc-network-no-preallow
description: Claude Code sandbox pre-allows no network domains; git push/gh need github.com allowlisted or will be blocked
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git]
keywords: [claude-code, sandbox, network, runtime]
author: claude
title: Claude Code sandbox pre-allows NO network domains; first reach to a new domain prompts; git push/gh need github.com allowlisted
source: https://code.claude.com/docs/en/sandboxing#network-isolation
accessed: 2026-06-14
ref_type: docs
---

# Claude Code sandbox pre-allows NO network domains; first reach to a new domain prompts; git push/gh need github.com allowlisted

## Insight

In the Claude Code sandbox, no network domains are pre-allowed. The first time a command needs a
new domain, Claude Code prompts for approval; domains can be pre-allowed via `allowedDomains`.
If `allowManagedDomainsOnly` is set, non-allowed domains are blocked outright instead of
prompting. So `git push` and `gh` (reaching `github.com` / `api.github.com`) hit a network
prompt or a hard block on first use unless those domains are pre-allowed.

## Related

- EXT-CC-3 — the internal insight label in draft-iter2.md
- `skills/git/SKILL.md:75` — "no-gh resilience" / PR-deferred concept (needs a third trigger)
- DD-2 — extends PR-deferred to include network-blocked trigger

## Why it applies

Gobbi's "no-gh resilience / PR deferred" concept was designed for the case where `gh` is absent or
unauthenticated. This shows a third trigger on Claude Code: network reach to github.com can be
blocked or prompt-gated by the sandbox even when `gh` is installed and authenticated. The deferral
logic must generalize to "push/PR cannot reach the network now," not only "gh missing."

## Source

- https://code.claude.com/docs/en/sandboxing (§ How sandboxing works → Network isolation)

## Excerpt

> "Domain restrictions: no domains are pre-allowed. The first time a command needs a new domain,
> Claude Code prompts for approval. Pre-allow domains with `allowedDomains` to avoid the prompt.
> Managed lockdown: if `allowManagedDomainsOnly` is set in managed settings, non-allowed domains
> are blocked automatically instead of prompting."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | DD-2 (generalized PR-deferred triggers) + C06 + C09 checklist items |

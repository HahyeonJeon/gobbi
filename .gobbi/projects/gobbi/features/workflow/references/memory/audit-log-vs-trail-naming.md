---
name: audit-log-vs-trail-naming
description: Industry distinguishes raw audit log from curated audit trail — validates session record vs memory
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [memory]
keywords: [naming, vocabulary, record]
author: claude
title: Audit log (raw capture) vs audit trail (curated record)
source: https://en.wikipedia.org/wiki/Audit_trail
accessed: 2026-06-13
ref_type: other
---

# Audit log (raw capture) vs audit trail (curated record)

## Insight
The industry distinguishes the audit *log* (raw, system-generated record of each event) from the audit *trail* (the reconstructable, curated end-to-end sequence tied to a business process). The raw layer and the curated layer carry different names on purpose.

## Related
- design decision D-e (sweep mapping); D5/D6 vocabulary

## Why it applies
This is exactly gobbi's split: the per-loop sub-phase saves raw artifacts (the *log/record* layer = "session record"), and wrap-up curates and promotes survivors to durable knowledge (the *trail/memory* layer = "memory"). The two-name convention validates D5/D6.

## Source
- https://en.wikipedia.org/wiki/Audit_trail
- Corroborated: https://carta.com/learn/private-funds/management/fund-audits/audit-trail/

## Excerpt
"The terms 'audit trail' and 'audit log' are often used interchangeably, though an audit log typically refers to the raw, system-generated record while an audit trail refers to the reconstructable end-to-end sequence of events tied to a business process or user session."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-13 | 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4 | Anchoring D5/D6 vocabulary (session record vs memory) in the Framed Problem + Design |

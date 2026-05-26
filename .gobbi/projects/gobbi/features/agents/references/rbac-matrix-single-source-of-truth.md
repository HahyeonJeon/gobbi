---
scope: feature
feature: agents
title: RBAC role-permission matrix as authoritative single source of truth
source: https://www.osohq.com/learn/rbac-role-based-access-control
type: docs
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [matrix, single-source-of-truth, sync-drift, validation]
related: []
---

# RBAC matrix as authoritative single source of truth

## Insight
Mature RBAC implementations are anchored by a role-permission matrix that becomes the **single authoritative source of truth** the entire system reads from — backend, frontend, microservices, audit logs. The drift problem RBAC literature warns against is the same shape as T2's empirical failure: "permissions are added, rarely removed, and almost never revisited — over time, roles drift away from their original purpose." The solution pattern is centralization: one location every consumer reads from (database, configuration file, JSON-from-backend), so frontend / backend / microservices cannot diverge. Modern implementations centralize on an Identity Provider (IdP) that serves as the single source of truth.

## Why it applies
T2 builds a single canonical role × phase × required-skills matrix at a discoverable path. The RBAC literature provides the directly-analogous design pattern: (a) one location, (b) every consumer reads from it, (c) the matrix is the *foundation* for both backend validation and interface behavior. The drift-prevention argument applies almost verbatim: the gobbi failure pattern (manager forgets to enumerate `memorization/SKILL.md` in MEMORIZATION dispatches; per-loop skills documented load requirements *implicitly*) is exactly what happens without a centralized matrix. The validator-side analogue (T2's Load-Directives validator) maps to RBAC's "backend validation reads from the matrix" — the same authoritative-source pattern.

## Source
- https://www.osohq.com/learn/rbac-role-based-access-control
- "How to Build a Role-Based Access Control Layer" — Oso, accessed 2026-05-23

## Excerpt
> "Whether the permissions are stored in a database, a configuration file, or sent from the backend as JSON, RBAC should have one authoritative source. This prevents the frontend, backend, and microservices from drifting into inconsistent states."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T2 external insight #1 — anchors the role × phase matrix design pattern; informs single-location-discoverable design question |

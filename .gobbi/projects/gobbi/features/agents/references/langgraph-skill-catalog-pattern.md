---
name: langgraph-skill-catalog-pattern
description: LangGraph formalizes skills-as-data with a structured catalog (name + description + tags + file names) loaded per-task — validates the role×phase matrix shape for the planned Load-Directives validator.
type: references
scope: feature
feature: agents
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [agent-framework, skill-loading, catalog, prompt-engineering]
title: LangGraph deep-agents skills catalog — domain knowledge outside the prompt
source: https://docs.langchain.com/oss/python/deepagents/skills
accessed: 2026-05-23
ref_type: docs
related: [rbac-matrix-single-source-of-truth]
---

# LangGraph deep-agents skill catalog pattern

## Insight
LangGraph's deep-agents framework formalizes "skills" as a first-class concept: domain knowledge lives outside the prompt and is loaded only when a task requires it. The system prompt includes a structured **list of available skills containing name, description, tags, and supporting file names** — small enough to include in every request — and the agent pulls in detailed instructions only when needed. This is the pattern the planned skill-loading matrix is reaching for in reverse: gobbi already has per-skill SKILL.md files at the leaves; what is missing is the structured catalog at the top that names exactly which skills each (role, phase) needs.

## Why it applies
The planned role × phase skill matrix needs a shape. The LangGraph skill-catalog pattern provides one validated answer — a structured catalog (matrix) listing each skill with name + description + tags + file names. Adapted to gobbi: a role × phase table where each cell lists the canonical skill files. The deeper architectural takeaway is that the framework treats this catalog as *part of the system prompt* — i.e., it is something every agent sees on every request. In gobbi terms, this maps to the Load Directives block — the catalog *is* the Load Directives content. The matrix and the Load Directives block are two views of the same data; the validator's job is to keep them in sync.

## Source
- https://docs.langchain.com/oss/python/deepagents/skills
- https://pessini.medium.com/stop-stuffing-your-system-prompt-build-scalable-agent-skills-in-langgraph-a9856378e8f6
- Both accessed 2026-05-23

## Excerpt
> "LangGraph supports a skills system where domain knowledge lives outside the prompt and is loaded only when a task requires it, allowing agents to see a lightweight catalog first and pull in detailed instructions only when needed."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | Skill-matrix design — published agent-framework pattern for skills-as-data-not-prose; informs the matrix shape (catalog with tags) |

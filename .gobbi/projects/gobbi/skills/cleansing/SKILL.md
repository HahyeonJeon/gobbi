---
name: cleansing
description: "Cleansing routes a user's cleansing request to the child for the subject's main result: code, visual work, or durable writing. Use it when the user asks to cleanse code, visual work, or docs."
allowed-tools: Read
disable-model-invocation: true
skill-type: domain
---

# Cleansing

Cleansing is the user's entry for reorganizing, renaming, and removing parts of a subject so it stays simple and
clearly defined. Only the user starts it. Load the one child for the subject's main result, as
[Gobbi Step 2.5](../gobbi/SKILL.md#25-spawn-each-specialist-as-its-role) gives a subject that spans domains to the
role of its main result; that child runs the whole subject.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`cleansing-code`](cleansing-code/SKILL.md) | operation | Use it when the user asks to cleanse code. |
| [`cleansing-design`](cleansing-design/SKILL.md) | operation | Use it when the user asks to cleanse visual work. |
| [`cleansing-docs`](cleansing-docs/SKILL.md) | operation | Use it when the user asks to cleanse docs, prose reports, in-repo API reference pages, skills, or a changelog. |

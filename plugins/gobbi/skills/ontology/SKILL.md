---
name: ontology
description: "Ontology is the record of an ObjectDefinition, a FunctionDefinition, and a LinkDefinition, and of the Instance of each."
allowed-tools: Read
skill-type: preference
---

# Ontology

Ontology records a domain as three definitions and their three instances: ObjectDefinition, FunctionDefinition,
and LinkDefinition, and ObjectInstance, FunctionInstance, and LinkInstance. Use this skill when you write or
review that record.

## Principles

### Three definitions and three instances

An Object is a thing, a Function is a behavior, and a Link is a relationship. Each type has a Definition of
what its members share and an Instance for one member.

### One data model

Every entity has the same name, context, definition, and metadata. A Definition adds only the fields of its
type, and an Instance adds only the link to its Definition.

### Meaning in Markdown

`context` and `definition` are Markdown so a person and an agent can read them. `metadata` is structured so a
program can read the id, the kind, and the version.

### A stated boundary

The `definition` field states what the entity represents, what it is responsible for, and what is outside its
scope. The name does not carry that boundary.

## Rules

- **MUST record a domain only as `ObjectDefinition`, `FunctionDefinition`, `LinkDefinition`, `ObjectInstance`, `FunctionInstance`, and `LinkInstance`.** These six kinds are the whole model.
- **MUST give every entity `name`, `context`, `definition`, and `metadata` with `id`, `kind`, and `version`.** `id` is unique in the file, `kind` is that entity's kind, and `version` matches `v1.0.0`.
- **MUST give an ObjectDefinition `properties`, a FunctionDefinition `inputInterface`, `action`, and `outputInterface`, and a LinkDefinition `from`, `relation`, and `to`.** `from` and `to` are entity ids in the same file.
- **MUST give every Instance `definedBy`, and give every LinkInstance `from` and `to`.** `definedBy` is the id of the matching Definition, and a LinkInstance names the two entities that one relationship connects.
- **NEVER add a fourth fundamental type, a layer, or a kind outside the six kinds.** A property, an input, and an output are fields of a Definition.
- **MUST store `context` and `definition` as Markdown and keep `metadata` structured.** `context`, `definition`, `specification`, `action`, and `relation` are literal block scalars.

## Preferences

### Shared fields

#### Write the same four fields on every entity

- Write `name`, `context`, `definition`, and `metadata`, in that order, then the fields of that kind.
- `name` is the human-readable name, and `context` is the situation the entity belongs to. `definition` states what it represents, what it is responsible for, and what is outside its scope.
- `metadata` has `id`, `kind`, and `version`, in that order. `id` is lowerCamelCase and unique in the file, `kind` is one of the six kinds, and `version` starts at `v1.0.0` and changes when the entity's meaning changes.

#### Write one list

- A file has one top-level key, `entities`, and that value is a list. Each item is one of the six kinds, and the list order is the reading order.
- The skill ships no template, no example, and no checker script. Write each entity from the kind below.

### ObjectDefinition

#### Define one kind of thing

- An ObjectDefinition defines the structure and characteristics of one kind of object.
- It adds `properties` after `metadata`. Each property has `name`, `dataType`, and `specification`, in that order. `specification` is Markdown.
- `dataType` is `string`, `number`, `integer`, or `boolean`. Write `properties: []` when the object has no attributes.

### FunctionDefinition

#### Define one behavior

- A FunctionDefinition defines the behavior, the interfaces, and the action of one operation.
- It adds `inputInterface`, `action`, and `outputInterface`, in that order. `action` is the operation, in Markdown.
- Each interface entry has `name`, `dataType`, and `specification`. `dataType` is the same set an ObjectDefinition property uses.

### LinkDefinition

#### Define one relationship

- A LinkDefinition defines the relationship between two ontology entities.
- It adds `from`, `relation`, and `to`, in that order. `from` and `to` are `metadata.id` values in the same file.
- `relation` is Markdown and states what the relationship means.

### ObjectInstance

#### Name one object

- An ObjectInstance is one concrete member of an ObjectDefinition.
- It adds `definedBy`, the `metadata.id` of that ObjectDefinition.
- It does not copy the Definition's `properties`.

### FunctionInstance

#### Name one execution

- A FunctionInstance is one execution of a FunctionDefinition.
- It adds `definedBy`, the `metadata.id` of that FunctionDefinition.
- It does not copy the Definition's interfaces or `action`.

### LinkInstance

#### Name one connection

- A LinkInstance is one relationship that follows a LinkDefinition.
- It adds `definedBy`, `from`, and `to`, in that order. `definedBy` is the `metadata.id` of that LinkDefinition.
- `from` and `to` are the two entities this one relationship connects. Those entities may be Definitions or Instances.

### Check

#### Read each entity against its kind

- Read each item in `entities` against the shared fields and the heading for its `kind`.
- Confirm each `id` is unique, and that every `from`, `to`, and `definedBy` names an id in the same file.
- Confirm each `definition` states the responsibility and the boundary.

## References

| Name | Description |
|---|---|
| [Preference Skill](../gobbi-skill/preference-skill/SKILL.md) | Shape for the rules and the six kind headings in this skill. |

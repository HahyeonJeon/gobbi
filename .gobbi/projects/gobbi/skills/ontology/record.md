# Ontology Record

This document defines the YAML format of one area file in Memory `ontology/`. Use it when you write, read, or
check an area file. The [ontology skill](SKILL.md) defines the kinds and facets; this document defines only the
keys that record them, the YAML rules, and the checks.

## Files

- Store each area at `ontology/<area>.yaml` under the project's Memory root. `<area>` is kebab-case and matches
  `^[a-z][a-z0-9-]*$`, such as `flight-operations`.
- An area is a bounded scope: a scope in which each name has one meaning. Put all units of that scope in one
  file.
- Split an area when a name needs a second meaning, or when the file passes about 40 units. The 40-unit point is
  a heuristic, not a measured limit. A unit is one entry in a group; Properties do not count. One file for the
  whole project causes merge conflicts and full-file reads, and one file per unit makes every reference cross-file.
- The session copy at `{session-root}/ontology/<area>.yaml` uses the same format. `{session-root}` is the current
  session's directory.
- Start a new area from the [templates](#templates-and-examples). The Flight sample in `examples/` shows every
  group and most keys in use, split into one file per kind. The Flight model has no deprecated unit, no
  Interface, and no link operation. So `deprecation` appears only in this document, and
  `implementsInterfaces`, a Property's `status`, the Interface keys, and `linkTypeApiName` appear only here and
  in the templates.
- The [Memory skill](../memory/SKILL.md) owns the `ontology/` directory, its `README.md` index, and the closure
  promotion from the session copy.

### Templates and Examples

Each kind has one template and one Flight example file, with the same file name.

| Kind | Template | Flight example |
|---|---|---|
| Area header | [templates/area.yaml](templates/area.yaml) | [examples/area.yaml](examples/area.yaml) |
| Object type | [templates/object-type.yaml](templates/object-type.yaml) | [examples/object-type.yaml](examples/object-type.yaml) |
| Property | [templates/property.yaml](templates/property.yaml) | [examples/property.yaml](examples/property.yaml) |
| Link type | [templates/link-type.yaml](templates/link-type.yaml) | [examples/link-type.yaml](examples/link-type.yaml) |
| Interface | [templates/interface.yaml](templates/interface.yaml) | [examples/interface.yaml](examples/interface.yaml) |
| Function | [templates/function.yaml](templates/function.yaml) | [examples/function.yaml](examples/function.yaml) |
| Action type | [templates/action-type.yaml](templates/action-type.yaml) | [examples/action-type.yaml](examples/action-type.yaml) |
| Automation | [templates/automation.yaml](templates/automation.yaml) | [examples/automation.yaml](examples/automation.yaml) |
| Process | [templates/process.yaml](templates/process.yaml) | [examples/process.yaml](examples/process.yaml) |
| Security policy | [templates/security-policy.yaml](templates/security-policy.yaml) | [examples/security-policy.yaml](examples/security-policy.yaml) |

Assemble an area file from the templates in these steps:

1. Seed the session file `{session-root}/ontology/<area>.yaml` from Memory `ontology/<area>.yaml` when it
   exists. Otherwise copy `templates/area.yaml` and fill `apiName` and `description`.
2. For the first unit of a kind, replace `<group>: {}` with the group block from that kind's template.
3. For each further unit of that kind, copy only the unit block under the existing group key.
4. Under each `properties` or `parameters` key, paste the entry from `templates/property.yaml` once per
   Property or parameter, at the entry's indent and without the template's header comments. Then delete the
   `# Paste templates/property.yaml` comment. Delete a `parameters` key that has no entry.
5. Rename each placeholder id, replace each `"{...}"`, and delete each optional key that has no value and each
   key whose condition does not hold.
6. Run the checklist and the line checks on the file.

The examples are one area split by kind. [Check the Flight sample](#check-the-flight-sample) says how to join
them.

## File Shape

Write these nine top-level keys in this order. All are required.

| Key | Value |
|---|---|
| `ontology` | Map with `apiName`, the quoted area name equal to the file name without `.yaml`, such as `"flight-operations"`, and `description`, a quoted sentence that states the scope in which each name has one meaning |
| `objectTypes` | Object type units |
| `linkTypes` | Link type units |
| `interfaceTypes` | Interface units |
| `functions` | Function units |
| `actionTypes` | Action type units |
| `automations` | Automation units |
| `processes` | Process units |
| `securityPolicies` | Security policy units |

- Each group is a map from unit id to unit. Write `{}` when the area has no unit of that kind.
- Property is the ninth kind and has no group. Each Property sits inside its Object type or Interface; see
  [Property Entry](#property-entry).

### Ids

- A unit id is the unit's key in its group map. It matches `^[a-z][a-zA-Z0-9]*$` (lowerCamelCase) and is unique
  across all eight groups of the file.
- Every other name you choose as a key follows the same pattern: Property ids and parameter names. Each is
  unique within its map.
- No id or chosen key is `y`, `n`, `yes`, `no`, `on`, `off`, `true`, `false`, or `null`. YAML 1.1 reads those
  words as booleans or null, even as keys.
- An id is not the preferred name. `delayFlight` is the id; "Delay flight" is its preferred name.
- Schema keys are Palantir field names or name patterns, such as `linkTypeApiName`, in lowerCamelCase where
  Palantir has one. Enum values are quoted lowerCamel, such as `"active"` and `"modifyObject"`.
- The schema departs from Palantir in these places. `functions` is Palantir's `queryTypes`. `linkTypes` holds
  whole Link types; Palantir's read API lists only sides. `primaryKey` is a list; Palantir's is one Property. A
  Property's `required` is Palantir's `dataConstraints.nullability`. `dataType` is a flat string; Palantir's is a
  union keyed by `type`. `submissionCriteria` is `actionLevelValidation` in Palantir's `@osdk/maker`. Every id is
  lowerCamelCase; Palantir writes Action type API names in kebab-case and Interface API names in UpperCamelCase.
- A key with no Palantir field name or name pattern takes a Palantir concept term, such as `sides`,
  `deprecation`, `effects`, `stateProperty`, and `sideEffects`, except 12 keys with no Palantir term, which are
  ours: `responsibility`, `boundary`, `neverTouches`, `changes`, `origin`, `method`, `reads`, `watches`, `runsAs`,
  `initialState`, `grants`, and `targets`.
- Keep an id once any reference points to it. To replace an `"active"` unit, deprecate it as the skill's
  [status rule](SKILL.md#give-shared-terms-a-status) says, and add the replacement under a new id.

### References

A reference is a quoted string that points to a unit or a Property.

| Form | Points to | Example |
|---|---|---|
| `"<id>"` | A unit in this file | `"flight"` |
| `"<id>.<property>"` | A Property of a unit in this file | `"flight.state"` |
| `"<area>/<id>"` | A unit in another area file | `"flight-operations/flight"` |
| `"<area>/<id>.<property>"` | A Property in another area file | `"flight-operations/flight.state"` |

- Every reference resolves: the unit exists in one of the eight groups, and the Property exists in that unit's
  `properties`.
- A reference to another area resolves in `<area>.yaml` in the same directory. A session copy resolves it in the
  session's copy of that area, or in Memory `ontology/` when the session has no copy.
- A bare Property id appears only in `primaryKey` and in an operation's `propertyApiNames`, where the unit is
  already named.

## Unit Keys

Every unit in the eight groups has these keys, in this order. The kind keys of its group, in
[Kind Keys](#kind-keys), go between `neverTouches` and `deprecation`.

| Key | Required | Value | Facet |
|---|---|---|---|
| `displayName` | Only when the preferred name differs from the id in words | Quoted preferred name. The id in words is the id split before each capital letter, in lower case, with a capital first letter. `delayFlight` needs none, because its preferred name is "Delay flight". `opsControl` needs `"Ops-control policy"`. | Definition |
| `status` | Yes | `"experimental"`, `"active"`, or `"deprecated"` | — |
| `description` | Yes | Quoted one sentence that tells a member from a non-member | Definition |
| `aliases` | No | List of quoted synonyms: non-preferred terms that map to the preferred name | Definition |
| `responsibility` | Yes | Quoted statement of what only this unit owns: one decision, or the facts about one concept | Responsibility |
| `boundary` | Yes | Quoted: what is outside the unit, and which unit owns it | Boundary |
| `neverTouches` | No | List of references to units this unit never touches. Reading a Link type to a unit, which shows that unit's `primaryKey` but no other Property, does not touch it | Boundary |
| Kind keys | Per kind | See [Kind Keys](#kind-keys) | Relationship, Properties, and kind fields |
| `deprecation` | Only when `status` is `"deprecated"` | Map with `message` (quoted reason), `replacedBy` (a reference, or `"none"`), and `deadline` (a quoted date, such as `"2027-03-31"`, or a quoted release) | — |

- A new shared unit starts as `"experimental"`. The skill's [status rule](SKILL.md#give-shared-terms-a-status)
  says who moves it to `"active"` and when it may be deprecated.
- A deprecated unit keeps its id until its `deadline`, so references to it still resolve.

`flight` in [examples/object-type.yaml](examples/object-type.yaml) is a complete Object type unit.

## Kind Keys

- Each unit adds the keys of its group, in the order listed, and no other key.
- A key with "Yes" under Required is always present. Leave out an optional key ("No") that has no value; never
  write `[]` or `{}` for it. A key marked "Only when" is present when, and only when, its condition holds.
- The States column names the facet a key states, or "kind field" for a field of the kind itself.
- "None by kind" means the kind never has that facet; write no key for it.

### `objectTypes` — Object type

| Key | Required | Value | States |
|---|---|---|---|
| `primaryKey` | Yes | List of this unit's Property ids that together identify one member | Properties (identity) |
| `properties` | Yes | Map from Property id to [Property entry](#property-entry) | Properties |
| `implementsInterfaces` | No | List of Interface references | Relationship (is-a) |

- `primaryKey` has at least one Property id, and each names a Property in `properties`.
- Each `primaryKey` Property has `required: "true"`, `changes: "stable"`, and an `origin` other than
  `"derived"`.
- The Relationship facet is `implementsInterfaces` plus each Link type with a side that starts from this unit.

### `linkTypes` — Link type

| Key | Required | Value | States |
|---|---|---|---|
| `sides` | Yes | List of exactly two sides, each a map with the three keys below | Relationship |
| `sides[].apiName` | Yes | Quoted name of the far end, seen from the near end, in id form | Relationship |
| `sides[].objectTypeApiName` | Yes | Object type reference: the far end | Relationship |
| `sides[].cardinality` | Yes | `"one"` or `"many"`: how many far-end members one near-end member links to | Relationship |

- Properties: none by kind.
- A side's near end is the other side's `objectTypeApiName`; the side starts from it. The first side starts
  from the owning end: for a many-to-one link, the many end, as `flightAircraft` starts from Flight. An is-a
  relation is `implementsInterfaces`, not a Link type.
- Each side's `objectTypeApiName` is an Object type.
- A side's `apiName` is unique among the sides that start from one Object type, differs from that Object type's
  Property ids, and is plural when `cardinality` is `"many"`.
- A Link type is not `"active"` when either end is `"experimental"`, and is `"deprecated"` when either end is.
- The Flight sample's Link types are in [examples/link-type.yaml](examples/link-type.yaml).

### `interfaceTypes` — Interface

| Key | Required | Value | States |
|---|---|---|---|
| `properties` | Yes | Map from Property id to [Property entry](#property-entry): the Properties every implementer shares | Properties |

- At least two Object types list the Interface in `implementsInterfaces`.
- Each implementer holds every Interface Property in its own `properties`, with the same id and `dataType`.
- The Flight model has no Interface, so the sample writes `interfaceTypes: {}`.

### `functions` — Function

| Key | Required | Value | States |
|---|---|---|---|
| `parameters` | No | Map from parameter name to [Property entry](#property-entry), with the keys that its `parameters` column allows | Properties |
| `output` | Yes | Map with the keys below | Properties |
| `output.description` | Yes | Quoted sentence: what the result means, and whether it is exact or an estimate, and of what | Definition |
| `output.dataType` | Yes | A Property `dataType` value, or `"object"` | Properties |
| `output.objectTypeApiName` | Only when `output.dataType` is `"object"` | Object type reference | Relationship |
| `method` | Yes | `"rule"`, `"formula"`, `"model"`, or `"languageModel"` | Kind field |
| `reads` | Yes | List of references to the units and Properties it reads | Relationship |

- The Flight sample's Function is in [examples/function.yaml](examples/function.yaml).

### `actionTypes` — Action type

| Key | Required | Value | States |
|---|---|---|---|
| `parameters` | No | Map from parameter name to [Property entry](#property-entry), with the keys that its `parameters` column allows | Properties |
| `submissionCriteria` | No | List of quoted conditions that must all hold before the change runs | Kind field |
| `operations` | Yes | List of at least one operation, each a map with the keys below | Relationship |
| `operations[].type` | Yes | `"createObject"`, `"modifyObject"`, `"deleteObject"`, `"createLink"`, or `"deleteLink"` | Relationship |
| `operations[].objectTypeApiName` | Only when `type` is an object operation | Object type reference | Relationship |
| `operations[].linkTypeApiName` | Only when `type` is a link operation | Link type reference | Relationship |
| `operations[].propertyApiNames` | Only when `type` is `"createObject"` or `"modifyObject"` | List of quoted Property ids of that Object type that the operation sets | Relationship |
| `sideEffects` | No | List of quoted effects beyond the operations, such as notifications | Kind field |

- An Action type applies all its operations or none. Its failure result is the same for every Action type: when
  a criterion fails or an operation cannot apply, nothing changes, and the person sees the failed criterion.
- Each operation has only the keys its `type` needs, as the table says. Each id in `propertyApiNames` exists in
  that Object type's `properties`.
- No operation sets a `"derived"` or `"captured"` Property.
- Each Action type is a `"run"` target of at least one grant, in this area or another. With default deny, an
  Action type without one can never run.
- No criterion restates a condition on the person that a grant already holds.
- `delayFlight` in [examples/action-type.yaml](examples/action-type.yaml) shows every Action type key except
  `linkTypeApiName`.

### `automations` — Automation

| Key | Required | Value | States |
|---|---|---|---|
| `watches` | No; left out for a time-based Automation | List of references to the units and Properties whose change starts the work | Relationship |
| `effects` | No | List of Action type or Function references it runs | Relationship |
| `runsAs` | Yes | Quoted role that Security policy grants name, such as `"connection-check service"` | Relationship |
| `notifications` | No | List of quoted alerts it sends | Kind field |
| `fallback` | Yes | Quoted fallback and retries when the work fails | Kind field |

- The `description` states what starts the work, such as a change or a schedule.
- `effects` or `notifications` is present.
- The `runsAs` role has a `"read"` grant on each unit that `watches` names, or whose Property it names, and a
  `"run"` grant on each Action type or Function in `effects`.
- Each Action type in `effects` has a criterion that makes a repeat run fail or change nothing.
- Properties: none by kind.

### `processes` — Process

| Key | Required | Value | States |
|---|---|---|---|
| `stateProperty` | Yes | Reference to the state Property of one Object type, such as `"flight.state"` | Relationship |
| `initialState` | Yes | Quoted state in which each member starts | Kind field |
| `transitions` | Yes | List of transitions, each a map with the keys below | Relationship |
| `transitions[].actionTypeApiName` | Yes | Reference to the Action type that makes the transition | Relationship |
| `transitions[].inputState`, `.outputState` | Yes | Quoted states before and after the transition | Kind field |

- `stateProperty` names a Property that has `enum`. `initialState` and each `inputState` and `outputState` are
  among its values.
- Every value of the state Property appears as `initialState` or in a transition.
- A final state is a state with no transition out, such as `"arrived"` and `"cancelled"` in `flightLifecycle`.
- Each transition's Action type has a `"modifyObject"` operation on the state Property's Object type, whose
  `propertyApiNames` include the state Property.
- Each transition's Action type has a criterion that requires the `inputState`.
- Properties: none by kind. The states belong to the state Property.
- The Flight sample's Process is in [examples/process.yaml](examples/process.yaml).

### `securityPolicies` — Security policy

| Key | Required | Value | States |
|---|---|---|---|
| `grants` | Yes | List of grants, each a map with the keys below | Relationship |
| `grants[].role` | Yes | Quoted person role, agent role, or an Automation's `runsAs` role | Relationship |
| `grants[].permission` | Yes | `"read"`, `"run"`, or `"propose"` | Relationship |
| `grants[].targets` | Yes | List of references | Relationship |
| `grants[].condition` | No | Quoted condition under which the grant applies | Relationship |

Each `permission` value allows one thing:

- `read`: see the target's members. A `"read"` grant on an Object type also covers each Link type whose first
  side starts from that Object type, for the members the grant allows. Reading a link shows the far end's
  identity, its `primaryKey`, and none of its other Properties.
- `run`: run the target Action type, or call the target Function.
- `propose`: submit a run of the target Action type that applies only after a person with `run` on it accepts
  it ([Palantir, Logic with Automate](https://www.palantir.com/docs/foundry/logic/aip-logic-integration-automate/)).
- Anything no grant allows is denied.

Checks:

- A `"propose"` grant targets only Action types.
- Properties: none by kind.
- The Flight sample's grants are in [examples/security-policy.yaml](examples/security-policy.yaml).

### Property Entry

A Property entry sits under an Object type's or Interface's `properties`. A Function's or Action type's
`parameters` use the same entry, with only the keys that the Under `parameters` column allows. Write its keys in
this order.

| Key | Under `properties` | Under `parameters` | Value |
|---|---|---|---|
| `description` | Yes | Yes | Quoted one sentence |
| `dataType` | Yes | Yes | `"string"`, `"integer"`, `"decimal"`, `"boolean"`, `"date"`, or `"timestamp"`; under `parameters` also `"object"` |
| `objectTypeApiName` | Never | Only when `dataType` is `"object"` | Object type reference |
| `enum` | Only when a `"string"` has a closed value set | Only when a `"string"` has a closed value set | List of quoted allowed values, each in id form, such as `"inService"` |
| `constraints` | No | No | List of quoted rules on the value, such as a pattern or a range, or against another Property of the unit |
| `required` | Yes | Yes | `"true"` or `"false"` |
| `changes` | Yes | Never | `"stable"` or `"changing"` |
| `origin` | Yes | Never | `"entered"`, `"captured"`, or `"derived"` |
| `status` | No | Never | A unit status value; defaults to the owner's `status` |

`origin` names the one writer of the value:

- `"entered"`: Action types in the model write it. When an outside system creates a member and Action types
  change the value later, the value is `"entered"`; the creator gives its first value. A Process's
  `initialState` works the same way.
- `"captured"`: an outside system writes it.
- `"derived"`: it is computed from other facts. When the name does not say how, the `description` says it, as
  for `bookedSeatCount`.

Checks and notes:

- Only a parameter or a Function `output` has `dataType: "object"`, and it has `objectTypeApiName`, which
  resolves to an Object type. A Property never points to another unit; use a Link type.
- Each `"entered"` Property that is `"changing"` is in the `propertyApiNames` of at least one operation, in this
  area or another.
- A Property is not more mature than its owner: an `"experimental"` unit has no `"active"` Property.
- A rule that relates two Properties of one unit, such as an arrival after a departure, is a `constraints` entry
  of the Property it limits.
- A duration is an `"integer"`, with its unit in the `description`.
- A Property states its facets in short form. Definition is `description`. Responsibility is the one fact it
  holds. Boundary is its owner. Relationship is its owner, and for a parameter its `objectTypeApiName`.
  Properties are `dataType`, `enum`, `constraints`, `required`, `changes`, and `origin`.
- `bookedSeatCount` in [examples/object-type.yaml](examples/object-type.yaml) is a derived Property.

## YAML Safety

These rules keep every value a string in any YAML parser, and let the line checks in
[Validation](#validation) read the file without a parser.

- Double-quote every scalar value, including numbers, dates, times, enum values, and references. Only keys stay
  unquoted. A YAML 1.1 parser, such as PyYAML, reads an unquoted `no` as false, `- on` as true, and `12:30` as the
  number 750, with no warning ([StrictYAML, "The Norway Problem"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)).
- Keep each string on one line. Escape `"` as `\"` and `\` as `\\`. Do not use the `|` or `>` block strings.
- Write every map and list in block style. The only flow style allowed is an empty `{}` or `[]`.
- Indent with two spaces, never with tabs. Write one space after each `:` and after each `- `.
- Do not use anchors (`&`), aliases (`*`), tags (`!`), or document markers (`---` or `...`).
- Write a comment only on its own line, never after a value.
- Do not repeat a key in one map. A parser keeps the last value and gives no warning.
- Save the file as UTF-8 with a final newline.

## Validation

Check an area file after you write it and before closure promotes it. Answer the checklist from the file alone,
then run the line checks. Run the parse check only when PyYAML is installed. The file is valid when every
applicable item holds and each check prints nothing.

A template is not a valid area file until every `"{...}"` placeholder is replaced, or its group is set to `{}`.

### Checklist

File:

1. The file name without `.yaml` equals `ontology.apiName`.
2. All nine top-level keys are present, in the [File Shape](#file-shape) order.
3. The file is listed in `ontology/README.md`. This item applies to Memory files only. A session copy and the
   skill's Flight sample are exempt.

Units:

4. Each id matches `^[a-z][a-zA-Z0-9]*$`, is not a reserved word, and is unique across the eight groups. Each
   Property id and parameter name follows the same rules within its map.
5. Each unit has every required unit key, in the [Unit Keys](#unit-keys) order. An optional unit key appears
   only with a value, and `displayName` only when it differs from the id in words.
6. `status` is `"experimental"`, `"active"`, or `"deprecated"`. A deprecated unit has `deprecation` with
   `message`, `replacedBy`, and `deadline`; no other unit has `deprecation`.
7. `description` is one sentence and does not use "and" to join two concepts.

Kinds:

8. Each unit has every required kind key of its group, in order. An optional or conditional key appears only
   with a value. The unit has no key outside its group's table.
9. Every check listed under the unit's group in [Kind Keys](#kind-keys) holds.
10. Each Property entry has `description`, `dataType`, and `required`; each `"object"` parameter or output has
    `objectTypeApiName`; and each entry under `properties` has `changes` and `origin`.

References:

11. Every reference resolves, as [References](#references) says.

YAML:

12. The quoting check prints nothing: every scalar value is double-quoted, and no key is a reserved word.
13. The leftover check prints nothing: no `"{...}"` placeholder, paste comment, document marker, or tab
    remains. No template placeholder id, such as `objectTypeId` or `propertyId`, remains; the checks do not
    find these.
14. No anchor, alias, tag, or trailing comment appears; no key repeats in one map; and every key has a value on
    its line or a nested block below it.

### Line Checks

These checks need only `grep`. Run each from the file's directory, or give the file's path for `<file>`. Each
prints the number and text of every line that breaks a rule, so zero lines means pass.

Quoting check:

```sh
grep -nE '^ *(- )?[a-zA-Z0-9_]+: ([^"{[]|[{][^}]|[[][^]])|^ *(- )?(y|n|yes|no|on|off|true|false|null):|^ *- [^"a-z]|^ *- [a-zA-Z0-9_]+([^a-zA-Z0-9_:]|:[^ ]|$)' <file>
```

It lists:

- a key whose value does not start with `"` and is not an empty `{}` or `[]`, such as `state: no`,
  `departure: 12:30`, or `boundary: |`;
- a key that is a reserved word, such as `on:`;
- a list item that is neither quoted nor a map key, such as `- 42`, `- on`, or `- in service`.

It reads only the first character of each value, not the text inside quotes. It does not check a line indented
with a tab; the leftover check finds tabs.

Leftover check:

```sh
grep -n -e '"{' -e '^ *# Paste templates/property.yaml' -e '^---' -e '^\.\.\.' -e "$(printf '\t')" <file>
```

It lists each leftover `"{...}"` placeholder, each paste comment that step 4 of the
[assembly steps](#templates-and-examples) deletes, each document marker, and each line with a tab. A paste
comment that remains marks a `properties` or `parameters` map left unfilled. On a template it lists every
placeholder line and paste comment, which is expected.

### Parse Check

The parse check is optional. It needs Python 3 and PyYAML, which a project may not have. Run it only when this
command exits with status 0:

```sh
python3 -c 'import yaml'
```

Then run:

```sh
python3 -c 'import sys, yaml; yaml.safe_load(open(sys.argv[1], encoding="utf-8"))' <file>
```

No output and exit status 0 means the file parses. An error names the line and column. The check proves syntax
only. PyYAML accepts duplicate keys and an unquoted `no`, so the checklist and the line checks still apply.

### Check the Flight Sample

The Flight sample is one area split by kind. To check it, join the files in [File Shape](#file-shape) order
into one file named after the area, then check that file as any area file:

```sh
cd <ontology skill>/examples
cat area.yaml object-type.yaml link-type.yaml interface.yaml function.yaml action-type.yaml \
  automation.yaml process.yaml security-policy.yaml > "${TMPDIR:-/tmp}/flight-operations.yaml"
```

`property.yaml` holds only comments and is not joined.

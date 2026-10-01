#!/usr/bin/env python3
"""Create, extend, list, show, and validate ontology area files.

Python 3.9 or later, standard library only. Every key shape comes from the skill's templates.
Exit status: 0 success; 1 a problem in a file, or a refused change; 2 a usage or input error.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

if sys.version_info < (3, 9):
    sys.exit("error: ontology.py needs Python 3.9 or later")

TEMPLATES = Path(__file__).resolve().parent.parent / "templates"
GROUPS = {  # group -> (kind key, template)
    "objectTypes": ("objectType", "object-type.yaml"), "linkTypes": ("linkType", "link-type.yaml"),
    "interfaceTypes": ("interfaceType", "interface.yaml"), "functions": ("function", "function.yaml"),
    "actionTypes": ("actionType", "action-type.yaml"), "automations": ("automation", "automation.yaml"),
    "processes": ("process", "process.yaml"), "securityPolicies": ("securityPolicy", "security-policy.yaml")}
KIND_GROUP = {kind: group for group, (kind, _) in GROUPS.items()}
REF_KINDS = {  # key -> the kinds its reference must name; () means any unit or Property
    "objectTypeApiName": ("objectType",), "linkTypeApiName": ("linkType",), "actionTypeApiName": ("actionType",),
    "functionApiName": ("function",), "implementsInterfaces": ("interfaceType",),
    "extendsInterfaces": ("interfaceType",), "target": (), "targets": (), "neverTouches": (), "replacedBy": ()}
LINKED_ENTITY = {"objectTypeApiName": ("objectType",), "interfaceTypeApiName": ("interfaceType",)}
OWN_PROPERTY = ("primaryKey", "titleProperty", "propertyApiNames")  # ids of Properties, not references
OWN_PARAMETER = ("parameterId", "objectToModify", "objectToDelete", "sourceObject", "targetObject")
FORMS = {"str": "a quoted string", "list": "a list of quoted strings", "maps": "a list of maps", "map": "a map",
         "entries": "a map of entries"}
PLACEHOLDER_IDS = {"unitId", "propertyId", "parameterId", "linkId"}
LOWER_CAMEL = re.compile(r"^[a-z][a-zA-Z0-9]*$")
KEBAB = re.compile(r"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")
AREA = re.compile(r"^[a-z][a-z0-9-]*$")
REF = re.compile(r"^(?:([a-z][a-z0-9-]*)/)?([a-z][a-zA-Z0-9-]*)(?:\.([a-z][a-zA-Z0-9]*))?$")
RESERVED = {"y", "n", "yes", "no", "on", "off", "true", "false", "null",  # YAML 1.1 booleans and null
            "ontology", "object", "property", "link", "relation", "rid", "primarykey", "typeid", "ontologyobject"}


class Failure(Exception):
    """A problem in the model, or a refused change: exit 1."""


class UsageError(Exception):
    """Bad arguments or unreadable input: exit 2."""


# ---- YAML subset reader: block maps and lists, double-quoted strings, and bare null ----------------------

@dataclass
class Node:
    kind: str  # "str", "null", "map" (key -> (line, Node)), or "list"
    line: int
    value: object = None


NULL = Node("null", 0)


class ParseError(Exception):
    def __init__(self, errors: list) -> None:
        super().__init__("; ".join(f"line {line}: {message}" for line, message in errors))
        self.errors = errors


def scalar(text: str, line: int) -> Node:
    if text == "null":
        return Node("null", line)
    m = re.match(r'^"((?:[^"\\]|\\["\\])*)"(.*)$', text)
    if not m:
        raise ValueError("unquoted value; double-quote it, or write null" if not text.startswith('"') else
                         "bad string; keep it on one line and escape only \\\" and \\\\")
    if m.group(2):
        raise ValueError("text after the closing quote; a comment goes on its own line")
    return Node("str", line, re.sub(r'\\(["\\])', r"\1", m.group(1)))


def tokenize(text: str) -> list:
    tokens, errors = [], [] if text.endswith("\n") else [(text.count("\n") + 1, "no final newline")]
    for n, line in enumerate(text.split("\n")[:-1], start=1):
        body = line.lstrip(" ")
        indent = len(line) - len(body)
        try:
            if "\t" in line or line != line.rstrip() or (body and indent % 2):
                raise ValueError("tab, trailing space, or an indent that is not a multiple of two spaces")
            if not body or body.startswith("#"):
                continue
            item = body.startswith("- ")
            if item:
                body = body[2:]
                if body.startswith('"') or body == "null" or ":" not in body:
                    if body == "null":
                        raise ValueError("null list item; write null for the whole key instead")
                    tokens.append((n, indent, True, None, scalar(body, n)))
                    continue
                tokens.append((n, indent, True, None, None))
                indent += 2
            key, _, rest = body.partition(":")
            if not re.match(r"^[a-z][a-zA-Z0-9-]*$", key) or (rest and not re.match(r"^ [^ ]", rest)):
                raise ValueError("expected 'key: value' or 'key:', with one space after ':'")
            tokens.append((n, indent, False, key, scalar(rest[1:], n) if rest else None))
        except ValueError as exc:
            errors.append((n, f"{exc}: {body[:40]!r}" if "unquoted" in str(exc) else str(exc)))
    if errors or not tokens:
        raise ParseError(errors or [(1, "empty file")])
    return tokens


def parse(text: str) -> Node:
    tokens, pos = tokenize(text), [0]

    def block(indent: int) -> Node:
        node = Node("list" if tokens[pos[0]][2] else "map", tokens[pos[0]][0], [] if tokens[pos[0]][2] else {})
        while pos[0] < len(tokens) and tokens[pos[0]][1] == indent:
            line, _, item, key, value = tokens[pos[0]]
            pos[0] += 1
            if item != (node.kind == "list"):
                raise ParseError([(line, "a list item and a key at the same indent")])
            if value is None:
                if not item and (pos[0] >= len(tokens) or tokens[pos[0]][1] <= indent):
                    raise ParseError([(line, f"key {key!r} has no value; write null or a nested block")])
                value = block(indent + 2)
            if item:
                node.value.append(value)
            elif key in node.value:
                raise ParseError([(line, f"key {key!r} repeats in this map")])
            else:
                node.value[key] = (line, value)
        if pos[0] < len(tokens) and tokens[pos[0]][1] > indent:
            raise ParseError([(tokens[pos[0]][0], "unexpected indent")])
        return node

    root = block(0)
    if pos[0] != len(tokens) or root.kind != "map":
        raise ParseError([(tokens[min(pos[0], len(tokens) - 1)][0], "the file must be one top-level map")])
    return root


def read(path: Path) -> str:
    try:
        return path.read_bytes().decode("utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        raise UsageError(f"cannot read {path} as UTF-8: {exc}")


def get(node: Node, key: str) -> Node:
    return node.value.get(key, (0, NULL))[1] if node.kind == "map" else NULL


# ---- Shapes from the templates ------------------------------------------------------------------------

MARKER = re.compile(r"^(?:([a-z][a-zA-Z0-9]*) )?(null or|null unless|optional|only when)"
                    r"(?: ([a-z][a-zA-Z0-9]*) is( not)? ([^:]+))?:\s*")


@dataclass
class Spec:
    form: str  # "str", "list" (of strings), "maps" (list of maps), "map", or "entries" (id -> entry map)
    template: str
    presence: dict = field(default_factory=dict)  # marker -> True, or (key, values, negated)
    values: tuple = ()
    children: dict = field(default_factory=dict)
    sample: list = field(default_factory=list)  # the entry lines that add copies


def markers(text: str, key: str, own: bool) -> tuple:
    """Read key's markers from a placeholder: unnamed ones when own, else only those that name key."""
    inner, found = text[1:-1] if text.startswith("{") and text.endswith("}") else "", {}
    while True:
        m = MARKER.match(inner)
        if not m or (m.group(1) or "") not in ((key, "") if own else (key,)):
            break
        found[m.group(2)] = (m.group(3), tuple(v.strip() for v in m.group(5).split(" or ")),
                             bool(m.group(4))) if m.group(3) else True
        inner = inner[m.end():]
    values = re.match(r"^one of: ([^;]+)", inner)
    return found, "{" + inner + "}", tuple(v.strip() for v in values.group(1).split("|")) if values else ()


def spec_of(key: str, node: Node, template: str, lines: list) -> Spec:
    first = node
    while first.kind != "str":
        first = first.value[0] if first.kind == "list" else next(iter(first.value.values()))[1]
    if node.kind == "str" or (node.kind == "list" and node.value[0] is first):  # a string, or strings
        found, rest, values = markers(first.value, key, own=True)
        entries = re.match(r"^\{entries: ([a-z-]+\.yaml)\}$", rest)
        if entries:
            children, sample = entry_spec(entries.group(1))
            return Spec("entries", template, found, children=children, sample=sample)
        return Spec("str" if node.kind == "str" else "list", template, found, values)
    found, first.value, _ = markers(first.value, key, own=False)
    if node.kind == "list":
        return Spec("maps", template, found, children=map_spec(node.value[0], template, lines))
    sample_key, (sample_line, sample) = next(iter(node.value.items()))
    if len(node.value) == 1 and sample_key in PLACEHOLDER_IDS:
        return Spec("entries", template, found, children=map_spec(sample, template, lines),
                    sample=block_lines(lines, sample_line - 1))
    return Spec("map", template, found, children=map_spec(node, template, lines))


def map_spec(node: Node, template: str, lines: list) -> dict:
    return {k: spec_of(k, v, template, lines) for k, (_, v) in node.value.items()}


def block_end(lines: list, start: int) -> int:
    indent, end = len(lines[start]) - len(lines[start].lstrip(" ")), start + 1
    while end < len(lines) and (not lines[end].strip() or len(lines[end]) - len(lines[end].lstrip(" ")) > indent):
        end += 1
    while end > start + 1 and not lines[end - 1].strip():
        end -= 1
    return end


def block_lines(lines: list, start: int) -> list:
    """The block whose key is at lines[start], without comments, moved to indent 0."""
    indent = len(lines[start]) - len(lines[start].lstrip(" "))
    return [ln[indent:] for ln in lines[start:block_end(lines, start)] if not ln.lstrip().startswith("#")]


def entry_spec(name: str, _cache: dict = {}) -> tuple:
    """The key specs and sample lines of a template that holds one entry, such as property.yaml."""
    if name not in _cache:
        text = read(TEMPLATES / name)
        (_, (line, node)), = parse(text).value.items()
        _cache[name] = (map_spec(node, name, text.split("\n")), block_lines(text.split("\n"), line - 1))
    return _cache[name]


class Schema:
    def __init__(self) -> None:
        area = parse(read(TEMPLATES / "area.yaml"))
        if list(area.value)[1:] != list(GROUPS):
            raise UsageError("templates/area.yaml and the script list different groups")
        self.header = list(get(area, "ontology").value)
        self.common, self.unit_lines = entry_spec("unit.yaml")
        self.kinds = {}
        for kind, name in GROUPS.values():
            text = read(TEMPLATES / name)
            root, lines = parse(text), text.split("\n")
            if list(root.value) != [kind]:
                raise UsageError(f"templates/{name} must hold one top-level key, {kind}")
            line, node = root.value[kind]
            self.kinds[kind] = (spec_of(kind, node, name, lines), block_lines(lines, line - 1))


# ---- Model and references -----------------------------------------------------------------------------

@dataclass
class Unit:
    area: str
    uid: str
    kind: str
    line: int
    node: Node

    def entries(self, key: str) -> dict:
        found = get(get(self.node, self.kind), key)
        return found.value if found.kind == "map" else {}


def load(path: Path) -> tuple:
    """Parse an area file and index its units by id."""
    root, units = parse(read(path)), {}
    for group, (kind, _) in GROUPS.items():
        for uid, (line, node) in (get(root, group).value or {}).items() if get(root, group).kind == "map" else ():
            if node.kind == "map":
                units.setdefault(uid, Unit(path.stem, uid, kind, line, node))
    return root, units


class Model:
    """Area files by name: the first directory that holds <area>.yaml wins."""

    def __init__(self, dirs: list) -> None:
        self.dirs, self.areas = dirs, {}

    def path(self, area: str) -> Path | None:
        return next((d / f"{area}.yaml" for d in self.dirs if (d / f"{area}.yaml").is_file()), None)

    def units(self, area: str) -> dict | None:
        if area not in self.areas:
            try:
                self.areas[area] = load(self.path(area))[1] if self.path(area) else None
            except ParseError:
                self.areas[area] = None
        return self.areas[area]

    def resolve(self, ref: str, here: str) -> tuple:
        m = REF.match(ref)
        if not m:
            return None, f"{ref!r} is not <id>, <id>.<property>, <area>/<id>, or <area>/<id>.<property>"
        area, uid, prop = m.groups()
        if area == here:
            return None, f"{ref!r} names this area; leave the area out"
        units = self.units(area or here)
        unit = (units or {}).get(uid)
        if units is None:
            return None, f"{ref!r}: no readable {area}.yaml" if area else f"{ref!r}: give it as <area>/<id>"
        if unit is None or (prop and prop not in unit.entries("properties")):
            return None, f"{ref!r} names no {'Property' if unit else 'unit'}"
        return (unit, prop), None


# ---- validate -----------------------------------------------------------------------------------------

def id_problem(name: str, kebab: bool = False) -> str | None:
    if not (KEBAB if kebab else LOWER_CAMEL).match(name):
        return f"id {name!r} is not {'kebab-case' if kebab else 'lowerCamelCase'}"
    return f"id {name!r} is a reserved word" if name.lower() in RESERVED else None


class Check:
    def __init__(self, path: Path, model: Model) -> None:
        self.path, self.model, self.problems = path, model, []

    def add(self, line: int, message: str, template: str) -> None:
        self.problems.append((line, f"{self.path}:{line}: {message} ({template})"))

    def keys(self, node: Node, specs: dict, where: str, unit: Unit | None, template: str) -> None:
        for k, (line, _) in node.value.items():
            if k not in specs:
                self.add(line, f"{where} has no key {k!r}", template)
        order = [k for k in specs if k in node.value]
        if [k for k in node.value if k in specs] != order:
            self.add(node.line, f"{where} keys are out of order; write {', '.join(order)}", template)
        for k, spec in specs.items():
            line, value = node.value.get(k, (node.line, None))
            p, holds, when = spec.presence, True, ""
            cond = p.get("only when") or p.get("null unless")
            if isinstance(cond, tuple):
                holds = (get(node, cond[0]).value in cond[1]) != cond[2]
                when = f"{cond[0]} is{' not' * cond[2]} {' or '.join(cond[1])}"
            may_null = "null or" in p or ("null unless" in p and not holds)
            may_omit = ("only when" in p and not holds) or "optional" in p
            if value is None:
                if not may_omit:
                    self.add(line, f"{where} is missing {k!r}" + " (write null when empty)" * may_null, spec.template)
            elif "only when" in p and not holds:
                self.add(line, f"{where}.{k} is allowed only when {when}", spec.template)
            elif value.kind == "null":
                if not may_null:
                    self.add(line, f"{where}.{k} cannot be null" + "; leave it out" * may_omit, spec.template)
            elif "null unless" in p and not holds:
                self.add(line, f"{where}.{k} must be null unless {when}", spec.template)
            else:
                self.value(k, value, spec, f"{where}.{k}", unit, node)

    def value(self, k: str, node: Node, spec: Spec, where: str, unit: Unit | None, parent: Node) -> None:
        kind = {"str": "str", "list": "list", "maps": "list", "map": "map", "entries": "map"}[spec.form]
        item_kind = {"list": "str", "maps": "map"}.get(spec.form)
        if node.kind != kind or (item_kind and any(i.kind != item_kind for i in node.value)):
            self.add(node.line, f"{where} must be {FORMS[spec.form]}", spec.template)
        elif spec.form in ("str", "list"):
            for item in node.value if spec.form == "list" else [node]:
                if item.value.startswith("{") and item.value.endswith("}"):
                    self.add(item.line, f"{where} still holds a template placeholder", spec.template)
                elif spec.values and item.value not in spec.values:
                    self.add(item.line, f"{where} is {item.value!r}, not one of {' | '.join(spec.values)}",
                             spec.template)
                else:
                    self.reference(k, item, where, unit, parent, spec.template)
        elif spec.form == "entries":
            for eid, (line, entry) in node.value.items():
                problem = f"replace the template id {eid!r}" if eid in PLACEHOLDER_IDS else id_problem(eid)
                if problem:
                    self.add(line, f"{where}: {problem}", spec.template)
                if k == "propertyArguments":
                    self.scoped(eid, line, "properties", where, unit, parent, spec.template)
                if entry.kind == "map":
                    self.keys(entry, spec.children, f"{where}.{eid}", unit, spec.template)
                else:
                    self.add(line, f"{where}.{eid} must be a map", spec.template)
        else:
            for n, item in enumerate(node.value if spec.form == "maps" else [node]):
                self.keys(item, spec.children, f"{where}[{n}]" if spec.form == "maps" else where, unit,
                          spec.template)

    def reference(self, k: str, item: Node, where: str, unit: Unit | None, parent: Node, template: str) -> None:
        kinds = REF_KINDS.get(k)
        if k == "apiName" and where.endswith("linkedEntityApiName.apiName"):
            kinds = LINKED_ENTITY.get(get(parent, "type").value, ())
        elif k == "apiName" and ".sides[" in where and id_problem(item.value):
            self.add(item.line, f"{where}: {id_problem(item.value)}", template)
        if k in OWN_PROPERTY or k in OWN_PARAMETER:
            self.scoped(item.value, item.line, "properties" if k in OWN_PROPERTY else "parameters", where, unit,
                        parent if k in OWN_PROPERTY else NULL, template)
        if kinds is not None:
            found, error = self.model.resolve(item.value, self.path.stem)
            if error:
                self.add(item.line, f"{where}: {error}", template)
            elif kinds and (found[1] or found[0].kind not in kinds):
                self.add(item.line, f"{where}: {item.value!r} must name a {' or '.join(kinds)}", template)

    def scoped(self, name: str, line: int, key: str, where: str, unit: Unit | None, parent: Node,
               template: str) -> None:
        """Check a bare id against the unit's own entries, or those of the Object type its map names."""
        owner = unit
        if get(parent, "objectTypeApiName").kind == "str":
            found, _ = self.model.resolve(get(parent, "objectTypeApiName").value, self.path.stem)
            owner = found[0] if found else None
        if owner is not None and name not in owner.entries(key):
            self.add(line, f"{where}: {name!r} is not in {owner.uid}'s {key}", template)


def validate(paths: list, memory: list, schema: Schema) -> int:
    bad = 0
    for path in [f for p in paths for f in (sorted(p.glob("*.yaml")) if p.is_dir() else [p])]:
        check = Check(path, Model([path.parent] + memory))
        try:
            root, units = load(path)
        except ParseError as exc:
            root, units = None, {}
            for line, message in exc.errors:
                check.add(line, message, "SKILL.md")
        if root is not None:
            check.model.areas[path.stem] = units
            if list(root.value) != ["ontology"] + list(GROUPS):
                check.add(1, f"top-level keys must be: ontology, {', '.join(GROUPS)}", "area.yaml")
            header = get(root, "ontology")
            if header.kind != "map" or get(header, "apiName").value != path.stem or not AREA.match(path.stem):
                check.add(header.line or 1, "ontology.apiName must equal the kebab-case file name", "area.yaml")
            if header.kind == "map":
                check.keys(header, {k: Spec("str", "area.yaml") for k in schema.header}, "ontology", None,
                           "area.yaml")
            seen = {}
            for group, (kind, name) in GROUPS.items():
                line, gnode = root.value.get(group, (1, NULL))
                if gnode.kind not in ("map", "null"):
                    check.add(line, f"{group} must be a map of units or null", "area.yaml")
                for uid, (uline, unode) in gnode.value.items() if gnode.kind == "map" else ():
                    problem = (f"replace the template id {uid!r}" if uid == "unitId" else None) or \
                        id_problem(uid, kebab=kind == "actionType") or \
                        (f"id {uid!r} is also used in {seen[uid]}" if uid in seen else None)
                    seen.setdefault(uid, group)
                    if problem:
                        check.add(uline, problem, name)
                    if unode.kind == "map":
                        check.keys(unode, {**schema.common, kind: schema.kinds[kind][0]}, uid, units.get(uid),
                                   "unit.yaml")
                        if [label for label, _ in edges(get(unode, "relationship"))].count("parent") > 1:
                            check.add(get(unode, "relationship").line, f"{uid} has more than one parent", "unit.yaml")
                    else:
                        check.add(uline, f"{uid} must be a map", name)
        for _, message in sorted(check.problems):
            print(message)
        print(f"{path}: {len(check.problems)} problem(s)" if check.problems else f"{path}: ok, {len(units)} units")
        bad += bool(check.problems)
    return 1 if bad else 0


# ---- list, show, new, add -----------------------------------------------------------------------------

def area_files(paths: list) -> list:
    return [f for p in paths for f in (sorted(q for q in p.glob("*.yaml") if AREA.match(q.stem))
                                       if p.is_dir() else [p])]


def list_units(paths: list, kind: str | None) -> int:
    if kind and kind not in KIND_GROUP:
        raise UsageError(f"unknown kind {kind!r}; use one of: {', '.join(KIND_GROUP)}")
    rows = []
    for path in area_files(paths):
        for u in load(path)[1].values():
            if not kind or u.kind == kind:
                words = re.sub(r"([A-Z])", r" \1", u.uid.replace("-", " ")).lower()
                name = get(get(u.node, "definition"), "displayName").value or words[:1].upper() + words[1:]
                rows.append((f"{path.stem}/{u.uid}", u.kind, get(u.node, "status").value or "-", name))
    widths = [max([len(r[i]) for r in rows] + [0]) for i in range(3)]
    for r in rows:
        print("  ".join(r[i].ljust(widths[i]) for i in range(3)) + "  " + r[3])
    return 0


def edges(node: Node, key: str = "", parent: Node = NULL):
    """Yield (label, reference) for each reference under node. A relationship edge's label is its type; any other
    edge's label is the name of the field that holds it."""
    for k, (_, v) in node.value.items() if node.kind == "map" else ():
        yield from edges(v, k, node)
    for item in node.value if node.kind == "list" else ():
        yield from edges(item, key, parent)
    if node.kind == "str" and (key in REF_KINDS or key == "apiName" and get(parent, "type").value in LINKED_ENTITY):
        yield {"target": get(parent, "type").value or key, "apiName": "linkedEntityApiName"}.get(key, key), node.value


def show(path: Path, ref: str, memory: list) -> int:
    model = Model([path if path.is_dir() else path.parent] + memory)
    found, error = model.resolve(ref, "" if path.is_dir() else path.stem)
    if error:
        raise Failure(error)
    unit, prop = found
    file = model.path(unit.area)
    lines = read(file).split("\n")
    start = (get(get(unit.node, unit.kind), "properties").value[prop][0] if prop else unit.line) - 1
    print(f"# {file}:{start + 1}-{block_end(lines, start)} {unit.kind}", *lines[start:block_end(lines, start)],
          sep="\n")
    rows = set()  # "# out:" edges go from the unit; "# in:" edges come to it, where the reverse of parent is child
    for f in area_files(model.dirs):
        for other in (model.units(f.stem) or {}).values():
            for label, target in edges(other.node):
                hit, _ = model.resolve(target, f.stem)
                if other is unit and not prop:
                    rows.add(f"# out: {label} {target}")
                elif hit and hit[0] is unit and prop in (None, hit[1]):
                    to = f" (to {hit[1]})" if hit[1] and not prop else ""
                    rows.add(f"# in: {'child' if label == 'parent' else label} {f.stem}/{other.uid}{to}")
    print("\n".join(sorted(rows, key=lambda row: (row.startswith("# in:"), row))) or "# no edges")
    return 0


def write(path: Path, lines: list) -> None:
    """Write through a temporary file, so an interrupted run leaves the old file."""
    fd, tmp = tempfile.mkstemp(prefix=".ontology-", dir=str(path.parent))
    with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as out:
        out.write("\n".join(lines))
    os.replace(tmp, path)


def new(path: Path, description: str | None) -> int:
    if path.suffix != ".yaml" or not AREA.match(path.stem):
        raise UsageError("give <dir>/<area>.yaml with a kebab-case area, such as flight-operations.yaml")
    if path.exists():
        raise Failure(f"{path} already exists")
    lines = [ln for ln in read(TEMPLATES / "area.yaml").split("\n") if not ln.startswith("#")]
    lines[1] = f'  apiName: "{path.stem}"'
    if description:
        lines[2] = '  description: "' + description.replace("\\", "\\\\").replace('"', '\\"') + '"'
    path.parent.mkdir(parents=True, exist_ok=True)
    write(path, lines)
    print(f"created {path}")
    return 0


def add(path: Path, kind: str, name: str, schema: Schema) -> int:
    try:
        root, units = load(path)
    except ParseError:
        raise Failure(f"{path} does not parse; run validate first")
    lines = read(path).split("\n")
    if kind in ("property", "parameter"):
        uid, _, eid = name.rpartition(".")
        key, unit = ("properties" if kind == "property" else "parameters"), units.get(uid)
        spec = schema.kinds[unit.kind][0].children.get(key) if unit else None
        if spec is None or spec.form != "entries" or id_problem(eid):
            raise UsageError(f"give <unitId>.<id> for a unit that has {key}, with a lowerCamelCase id")
        line, entries = get(unit.node, unit.kind).value[key]
        if entries.kind == "map" and eid in entries.value:
            raise Failure(f"{uid} already has the {kind} {eid!r}")
        indent = len(lines[line - 1]) - len(lines[line - 1].lstrip(" "))
        block = [" " * (indent + 2) + (eid + ":" if i == 0 else ln) for i, ln in enumerate(spec.sample)]
    else:
        if kind not in KIND_GROUP:
            raise UsageError(f"unknown kind {kind!r}; use one of: {', '.join(KIND_GROUP)}, property, parameter")
        if id_problem(name, kebab=kind == "actionType"):
            raise UsageError(id_problem(name, kebab=kind == "actionType"))
        if name in units:
            raise Failure(f"id {name!r} is already used by the {units[name].kind} unit")
        key, indent, line = KIND_GROUP[kind], -2, root.value[KIND_GROUP[kind]][0]
        block = [f"  {name}:"] + ["  " + ln for ln in schema.unit_lines[1:]] + \
            ["    " + ln for ln in schema.kinds[kind][1]]
    if lines[line - 1].endswith(": null") or lines[line - 1].endswith('"'):  # null or a placeholder
        lines[line - 1], at = " " * max(indent, 0) + key + ":", line
    else:
        at = block_end(lines, line - 1)
    lines[at:at] = block
    write(path, lines)
    print(f"added {kind} {name} at {path}:{at + 1}; replace each \"{{...}}\" placeholder, then run validate")
    return 0


def main(argv: list) -> int:
    parser = argparse.ArgumentParser(prog="ontology.py", description=__doc__.split("\n")[0])
    sub = parser.add_subparsers(dest="command", required=True)
    for command, arguments, text in (
            ("new", ["file", "--description"], "create an empty area file"),
            ("add", ["file", "kind", "id"], "add a unit, a Property, or a parameter from its template"),
            ("validate", ["paths+", "--memory"], "check area files"),
            ("list", ["paths+", "--kind"], "list units"),
            ("show", ["path", "ref", "--memory"], "print one unit or Property, and what references it")):
        p = sub.add_parser(command, help=text)
        for a in arguments:
            if a == "--memory":
                p.add_argument(a, action="append", type=Path, default=[], help="another directory of area files")
            elif a.startswith("--"):
                p.add_argument(a)
            else:
                p.add_argument(a.rstrip("+"), nargs="+" if a.endswith("+") else None,
                               type=Path if a in ("file", "path", "paths+") else str)
    args = parser.parse_args(argv)
    try:
        if args.command == "new":
            return new(args.file, args.description)
        if args.command == "list":
            return list_units(args.paths, args.kind)
        if args.command == "show":
            return show(args.path, args.ref, args.memory)
        schema = Schema()
        return add(args.file, args.kind, args.id, schema) if args.command == "add" else \
            validate(args.paths, args.memory, schema)
    except (UsageError, ParseError, Failure) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1 if isinstance(exc, Failure) else 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

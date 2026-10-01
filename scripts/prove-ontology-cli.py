#!/usr/bin/env python3
"""Prove the ontology skill's CLI against its own templates and Flight examples.

Usage: python3 scripts/prove-ontology-cli.py

1. The joined Flight sample validates.
2. Mutations: each broken copy of the sample exits 1 with the expected message.
3. Round trip: new and add write exactly the template shapes, a filled area validates, show labels edges, and
   each refusal has its exit status.
4. Cross-check, only when PyYAML is installed: the CLI's YAML reader and PyYAML build the same tree for every
   template and the joined sample.

Runs in a temporary directory and never writes the repository. Exit status: 0 when every proof passes, else 1.
"""
from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SKILL = REPO_ROOT / ".gobbi/projects/gobbi/skills/ontology"
CLI = SKILL / "scripts/ontology.py"
# The join order that examples/area.yaml states.
JOIN_ORDER = ("area", "object-type", "link-type", "interface", "function", "action-type", "automation", "process",
              "security-policy")

failures = 0


def expect(name: str, ok: bool, detail: str = "") -> None:
    global failures
    failures += not ok
    print(f"PASS {name}" if ok else f"FAIL {name}: {detail}")


def run(*args: object) -> tuple[int, str]:
    r = subprocess.run([sys.executable, str(CLI), *map(str, args)], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def joined_sample() -> str:
    return "".join((SKILL / "examples" / f"{name}.yaml").read_text(encoding="utf-8") for name in JOIN_ORDER)


# ---- 1. The joined sample ----------------------------------------------------------------------------------

def prove_sample(work: Path, sample: str) -> None:
    path = work / "flight-operations.yaml"
    path.write_text(sample, encoding="utf-8")
    rc, out = run("validate", path)
    expect("joined sample validates", rc == 0 and out.strip().endswith("ok, 18 units"), out.strip())


# ---- 2. Mutations: (message the output must contain, case name, text to replace, replacement) ----------------

FLIGHT_DEFINITION = ('    definition:\n      displayName: null\n      description: "One scheduled trip of one aircraft '
                     'between two airports on one date."\n      aliases:\n        - "leg"\n')
PARENT_EDGE = '      - type: "parent"\n        target: "flight.state"\n'
MUTATIONS = [
    ("unquoted value", "unquoted value", '- "departed"\n', '- departed\n'),
    ("text after the closing quote", "trailing comment", 'status: "ACTIVE"\n', 'status: "ACTIVE" # ok\n'),
    ("tab, trailing space", "tab", '    status: "ACTIVE"', '\tstatus: "ACTIVE"'),
    ("repeats in this map", "repeated key", '    status: "ACTIVE"\n', '    status: "ACTIVE"\n' * 2),
    ("'interfaceTypes: {}'", "flow style", 'interfaceTypes: null', 'interfaceTypes: {}'),
    ("is missing 'relationship' (write null when empty)", "missing fixed key", '    relationship: null\n', ''),
    ("definition cannot be null", "required key null", FLIGHT_DEFINITION, '    definition: null\n'),
    ("not one of EXPERIMENTAL | ACTIVE | DEPRECATED", "lowercase status", 'status: "ACTIVE"', 'status: "active"'),
    ("deprecation must be null unless status is DEPRECATED", "deprecation while active", '    deprecation: null\n',
     '    deprecation:\n      message: "Old."\n      deadline: "2027-03-31"\n'),
    ("deprecation cannot be null", "deprecated without deprecation", 'status: "ACTIVE"', 'status: "DEPRECATED"'),
    ("replacedBy cannot be null; leave it out", "null inside an entry",
     'status: "ACTIVE"\n    deprecation: null',
     'status: "DEPRECATED"\n    deprecation:\n      message: "Old."\n      replacedBy: null\n'
     '      deadline: "2027-03-31"'),
    ("has no key 'owner'", "unknown key", '      runsAs: "connection-check service"\n',
     '      runsAs: "connection-check service"\n      owner: "x"\n'),
    ("keys are out of order", "key order", '    status: "ACTIVE"\n    deprecation: null\n',
     '    deprecation: null\n    status: "ACTIVE"\n'),
    ("still holds a template placeholder", "placeholder", '"The flight to delay."', '"{one sentence}"'),
    ("id 'delayFlight' is not kebab-case", "Action type id case", '  delay-flight:\n', '  delayFlight:\n'),
    ("id 'flight-leg' is not lowerCamelCase", "Object type id case", '  flight:\n    status',
     '  flight-leg:\n    status'),
    ("is a reserved word", "Palantir reserved id", '        delayReason:\n', '        rid:\n'),
    ("is also used in", "duplicate id", '  checkConnectionsAfterChange:\n', '  flight:\n'),
    ("linkTypeApiName is allowed only when type is createLink or deleteLink", "operation key by type",
     '          objectToModify: "flight"\n          propertyArguments:\n            estimatedDeparture:',
     '          objectToModify: "flight"\n          linkTypeApiName: "flightAircraft"\n'
     '          propertyArguments:\n            estimatedDeparture:'),
    ("is missing 'objectToModify'", "operation missing key", '          objectToModify: "flight"\n', ''),
    ("'gate' is not in flight's properties", "propertyArguments key",
     '            delayReason:\n              type: "parameterId"',
     '            gate:\n              type: "parameterId"'),
    ("'why' is not in delay-flight's parameters", "parameterId scope", 'parameterId: "reason"', 'parameterId: "why"'),
    ("primaryKey: 'flightNumber' is not in flight's properties", "primaryKey scope", 'primaryKey: "flightId"',
     'primaryKey: "flightNumber"'),
    ("titleProperty: 'label' is not in", "titleProperty scope", 'titleProperty: "number"', 'titleProperty: "label"'),
    ("'crew' names no unit", "unresolved reference", '      - "passenger"\n', '      - "crew"\n'),
    ("'flight' must name a actionType", "reference kind", 'actionTypeApiName: "depart-flight"',
     'actionTypeApiName: "flight"'),
    ("'eta' is not in flight's properties", "condition Property", '          - "estimatedArrival"\n      effects',
     '          - "eta"\n      effects'),
    ("pattern is allowed only when type is regex", "constraint union", '                - "cancelled"\n',
     '                - "cancelled"\n              pattern: "x"\n'),
    ("is missing 'pattern'", "regex without pattern", '              pattern: "^[A-Z]{3}$"\n', ''),
    ("'object', not one of", "object Property", 'type: "date"', 'type: "object"'),
    ("is missing 'objectTypeApiName'", "object parameter",
     '            type: "object"\n            objectTypeApiName: "booking"\n', '            type: "object"\n'),
    ("'child', not one of parent | link", "stored child edge", 'type: "parent"', 'type: "child"'),
    ("'flight.gate' names no Property", "relationship target", PARENT_EDGE,
     PARENT_EDGE.replace("flight.state", "flight.gate")),
    ("flightLifecycle has more than one parent", "two parent edges", PARENT_EDGE,
     PARENT_EDGE + PARENT_EDGE.replace("flight.state", "flight")),
    ("configuredFailureMessage cannot be null; leave it out", "null failure message",
     'configuredFailureMessage: "Only a scheduled flight can change this way."', 'configuredFailureMessage: null'),
    ("id 'link' is a reserved word", "reserved side name", '- apiName: "aircraft"', '- apiName: "link"'),
    ("'one', not one of ONE | MANY", "cardinality case", 'cardinality: "ONE"', 'cardinality: "one"'),
    ("'interfaceType'", "wrong kind block", '    linkType:\n', '    interfaceType:\n'),
    ("top-level keys must be", "missing group", 'interfaceTypes: null\n', ''),
    ("names this area", "own-area prefix", PARENT_EDGE,
     PARENT_EDGE.replace("flight.state", "flight-operations/flight.state")),
    ("'READ_ALL', not one of READ | RUN | PROPOSE", "permission value", 'permission: "READ"', 'permission: "READ_ALL"'),
    ("NULLABLE | NOT_NULLABLE", "nullability value", 'nullability: "NULLABLE"', 'nullability: "false"'),
]


def prove_mutations(work: Path, sample: str) -> None:
    for want, name, old, new in MUTATIONS:
        if old not in sample:
            expect(f"mutation {name}", False, f"the sample no longer holds {old!r}")
            continue
        path = work / "flight-operations.yaml"
        path.write_text(sample.replace(old, new, 1), encoding="utf-8")
        rc, out = run("validate", path)
        expect(f"mutation {name}", rc == 1 and want in out, f"exit={rc} {out.strip()}")
    path = work / "other-area.yaml"
    path.write_text(sample, encoding="utf-8")
    rc, out = run("validate", path)
    expect("mutation file name differs from apiName", rc == 1 and "must equal the kebab-case file name" in out,
           f"exit={rc} {out.strip()}")


# ---- 3. Round trip -----------------------------------------------------------------------------------------

COMMON = '''    status: "EXPERIMENTAL"
    deprecation: null
    definition:
      displayName: null
      description: "{d}"
      aliases: null
    responsibility: "{r}"
    boundary:
      outside: "Flight schedules, which the flight-operations area owns."
      neverTouches:
        - "flight-operations/passenger"
    relationship: null
'''
GATE_PROPERTIES = '''      properties:
        code:
          description: "The code painted at the place."
          dataType:
            type: "string"
          dataConstraints:
            nullability: "NOT_NULLABLE"
          changes: "STABLE"
          origin: "CAPTURED"
      implementsInterfaces:
        - "parkingPlace"
'''


def unit(uid: str, description: str, responsibility: str, block: str) -> str:
    return f"  {uid}:\n" + COMMON.format(d=description, r=responsibility) + block.rstrip("\n")


FILLED = "\n".join([
    "ontology:", '  apiName: "ground-handling"', '  description: "Gates and stands at one airport."',
    "objectTypes:",
    unit("gate", "One numbered place at a terminal where an aircraft boards passengers.", "A gate owns its code.",
         '    objectType:\n      pluralDisplayName: "Gates"\n      primaryKey: "code"\n      titleProperty: "code"\n'
         + GATE_PROPERTIES),
    unit("stand", "One remote parking position on the apron.", "A stand owns its code.",
         '    objectType:\n      pluralDisplayName: "Stands"\n      primaryKey: "code"\n      titleProperty: "code"\n'
         + GATE_PROPERTIES),
    "linkTypes:",
    unit("flightGate", "The connection from one flight to the gate it boards at.",
         "This link owns which gate each flight boards at.", '''    linkType:
      sides:
        - apiName: "gate"
          objectTypeApiName: "gate"
          cardinality: "ONE"
        - apiName: "flights"
          objectTypeApiName: "flight-operations/flight"
          cardinality: "MANY"
'''),
    "interfaceTypes:",
    unit("parkingPlace", "A place where an aircraft parks.", "It owns the shape that every parking place shares.",
         '''    interfaceType:
      extendsInterfaces: null
      properties:
        code:
          description: "The code painted at the place."
          dataType:
            type: "string"
          requireImplementation: "true"
      links:
        servedFlights:
          linkedEntityApiName:
            type: "objectTypeApiName"
            apiName: "flight-operations/flight"
          cardinality: "MANY"
          required: "false"
'''),
    "functions: null",
    "actionTypes:",
    unit("assign-gate", "The operation that gives a flight the gate it boards at.",
         "It owns the decision to assign a gate to a flight.", '''    actionType:
      parameters:
        flight:
          description: "The flight to assign."
          dataType:
            type: "object"
            objectTypeApiName: "flight-operations/flight"
          required: "true"
        gate:
          description: "The gate to assign."
          dataType:
            type: "object"
            objectTypeApiName: "gate"
          required: "true"
      submissionCriteria: null
      operations:
        - type: "createLink"
          linkTypeApiName: "flightGate"
          sourceObject: "flight"
          targetObject: "gate"
      sideEffects: null
'''),
    "automations: null",
    "processes: null",
    "securityPolicies:",
    unit("rampControl", "The grants that decide who may assign gates.", "It owns who may run Assign gate.",
         '''    securityPolicy:
      grants:
        - role: "ramp controller"
          permission: "RUN"
          targets:
            - "assign-gate"
'''), ""])


def prove_round_trip(work: Path, sample: str) -> None:
    # new and add: validate may report only placeholders and the conditions they leave open, never a shape problem.
    area = work / "ground-handling.yaml"
    expect("new", run("new", area, "--description", "Gates at one airport.")[0] == 0)
    for kind, uid in (("objectType", "gate"), ("linkType", "flightGate"), ("interfaceType", "parkingPlace"),
                      ("function", "gateFree"), ("actionType", "assign-gate"), ("automation", "gateWatch"),
                      ("process", "gateLifecycle"), ("securityPolicy", "rampControl")):
        expect(f"add {kind}", run("add", area, kind, uid)[0] == 0)
    for kind, ref in (("property", "gate.code"), ("parameter", "assign-gate.flight"), ("parameter", "gateFree.at"),
                      ("property", "parkingPlace.code")):
        expect(f"add {kind} {ref}", run("add", area, kind, ref)[0] == 0)
    rc, out = run("validate", area)
    allowed = ("still holds a template placeholder", "replace the template id", "is allowed only when",
               "must be null unless", "names no", "is not <id>", "problem(s)")
    shape = [line for line in out.splitlines() if not any(a in line for a in allowed)]
    expect("unfilled add output has only placeholder findings", rc == 1 and not shape, "\n".join(shape[:5]))

    # A filled area with an Interface, a link constraint, and references to another area.
    (work / "flight-operations.yaml").write_text(sample, encoding="utf-8")
    area.write_text(FILLED, encoding="utf-8")
    rc, out = run("validate", area)
    expect("filled area validates", rc == 0, out.strip())
    rc, out = run("validate", work)
    expect("directory with both areas validates", rc == 0, out.strip())
    area.write_text(FILLED.replace('type: "objectTypeApiName"\n            apiName: "flight-operations/flight"',
                                   'type: "interfaceTypeApiName"\n            apiName: "flight-operations/flight"'),
                    encoding="utf-8")
    rc, out = run("validate", area)
    expect("linkedEntityApiName must match its type", rc == 1 and "must name a interfaceType" in out, out.strip())
    area.write_text(FILLED, encoding="utf-8")
    rc, out = run("add", area, "property", "parkingPlace.size")
    expect("add a Property to an inline Interface entry map", rc == 0 and "size:" in area.read_text(), out.strip())
    area.write_text(FILLED, encoding="utf-8")
    memory = work / "memory"
    memory.mkdir()
    (work / "flight-operations.yaml").rename(memory / "flight-operations.yaml")
    rc, out = run("validate", area)
    expect("reference to another area fails without --memory", rc == 1 and "no readable" in out, out.strip())
    rc, out = run("validate", area, "--memory", memory)
    expect("reference to another area resolves with --memory", rc == 0, out.strip())

    # show: outgoing and incoming edges, labelled parent, child, link, or the field name.
    rc, out = run("show", work, "ground-handling/gate", "--memory", memory)
    incoming = "# in: objectTypeApiName ground-handling/flightGate"
    expect("show labels an incoming field edge", rc == 0 and incoming in out, out)
    expect("show labels an outgoing field edge", "# out: implementsInterfaces parkingPlace" in out, out)
    rc, out = run("show", work, "flight-operations/flight", "--memory", memory)
    expect("show resolves through --memory", rc == 0 and incoming in out, out)
    child = "# in: child flight-operations/flightLifecycle (to state)"
    expect("show labels the reverse of parent as child", child in out, out)
    rc, out = run("show", memory / "flight-operations.yaml", "flightLifecycle")
    expect("show labels an outgoing parent edge", rc == 0 and "# out: parent flight.state" in out, out)
    rc, out = run("show", memory / "flight-operations.yaml", "flight.state")
    expect("show labels a criterion read as link", rc == 0 and "# in: link flight-operations/delay-flight" in out, out)
    rc, out = run("show", memory / "flight-operations.yaml", "flight.number")
    expect("show a Property with no edges", rc == 0 and out.splitlines()[-1] == "# no edges", out)

    # Refusals and their exit status.
    for args, code, name in ((("new", area), 1, "new on an existing file"),
                             (("new", work / "Bad_Name.yaml"), 2, "new with a bad name"),
                             (("add", area, "objectType", "gate"), 1, "add a used id"),
                             (("add", area, "widget", "x"), 2, "add an unknown kind"),
                             (("add", area, "actionType", "assignGate"), 2, "add an Action type with a lowerCamel id"),
                             (("add", area, "property", "flightGate.x"), 2, "add a Property to a Link type"),
                             (("add", area, "parameter", "assign-gate.flight"), 1, "add a used parameter id"),
                             (("show", area, "nothing"), 1, "show an unknown unit"),
                             (("show", work, "gate"), 1, "show an unqualified reference in a directory"),
                             (("validate", work / "missing.yaml"), 2, "validate a missing file")):
        rc, out = run(*args)
        expect(name, rc == code, f"exit={rc} {out.strip()}")


# ---- 4. Cross-check with PyYAML ------------------------------------------------------------------------------

def prove_cross_check(work: Path, sample: str) -> None:
    try:
        import yaml
    except ImportError:
        print("SKIP cross-check: PyYAML is not installed")
        return
    sys.dont_write_bytecode = True  # importing the CLI must not leave __pycache__ in the skill, which ships
    spec = importlib.util.spec_from_file_location("ontology", CLI)
    ontology = importlib.util.module_from_spec(spec)
    sys.modules["ontology"] = ontology
    spec.loader.exec_module(ontology)

    def tree(node):
        if node.kind in ("str", "null"):
            return node.value
        if node.kind == "list":
            return [tree(item) for item in node.value]
        return {key: tree(value) for key, (_, value) in node.value.items()}

    for name, text in [(p.name, p.read_text(encoding="utf-8")) for p in sorted((SKILL / "templates").glob("*.yaml"))] \
            + [("joined sample", sample)]:
        expect(f"cross-check {name}", tree(ontology.parse(text)) == yaml.safe_load(text), "trees differ")


def main() -> int:
    print(f"python {sys.version.split()[0]}; cli {CLI.relative_to(REPO_ROOT)}")
    sample = joined_sample()
    with tempfile.TemporaryDirectory(prefix="prove-ontology-") as tmp:
        for prove in (prove_sample, prove_mutations, prove_round_trip, prove_cross_check):
            work = Path(tmp) / prove.__name__
            work.mkdir()
            prove(work, sample)
    print(f"proofs failed: {failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Validate the canonical html-css family, checklists, migration, discovery, and plugin copy."""

from __future__ import annotations

import collections
import hashlib
import os
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SKILLS = ROOT / ".gobbi/projects/gobbi/skills"
FAMILY = SKILLS / "html-css"
PLUGIN = ROOT / "plugins/gobbi/skills/html-css"
PERSPECTIVES = ["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk", "Overall"]
CLASSES = {"Normal case", "Edge case", "Expected failure", "Poor quality", "Rule violation", "Adversarial"}
EXPECTED = {
    "html-css-design/checklists.md": ("HCDES", 16),
    "html-css-development/evaluation/procedure/checklists.md": ("HCDEV", 34),
    "html-css-development/evaluation/result/checklists.md": ("HCDEV", 31),
    "html-css-testing/evaluation/procedure/checklists.md": ("HCTEST", 27),
    "html-css-testing/evaluation/result/checklists.md": ("HCTEST", 31),
    "html-css-platform/checklists.md": ("HCPLAT", 54),
    "html-css-semantics/checklists.md": ("HCSEM", 46),
    "html-css-conventions/checklists.md": ("HCCONV", 35),
    "html-css-motion/checklists.md": ("HCMOT", 44),
}
CHILDREN = ["html-css-conventions", "html-css-design", "html-css-development", "html-css-motion", "html-css-platform", "html-css-semantics", "html-css-testing"]
TYPES = {"html-css-conventions": "preference", "html-css-design": "preference", "html-css-development": "operation", "html-css-motion": "preference", "html-css-platform": "tool", "html-css-semantics": "preference", "html-css-testing": "operation"}
EXPECTED_OLD_ID_DIGEST = "81c475b1bdda6ff4227e42923760d4e69c7fb8d67acde570acdba46c2d9dfe69"
EXPECTED_OLD_SOURCES = {
    ".gobbi/projects/gobbi/skills/css/css-conventions/checklists.md": 45,
    ".gobbi/projects/gobbi/skills/css/css-development/checklists.md": 47,
    ".gobbi/projects/gobbi/skills/css/css-motion/checklists.md": 40,
    ".gobbi/projects/gobbi/skills/css/css-platform/checklists.md": 27,
    ".gobbi/projects/gobbi/skills/html/html-development/checklists.md": 50,
    ".gobbi/projects/gobbi/skills/html/html-platform/checklists.md": 30,
    ".gobbi/projects/gobbi/skills/html/html-semantics/checklists.md": 39,
}
VALID_GROUPS = [
    "GDEV-COMPLETE-CEIL", "GTEST-EVID-NO-OVERCLAIM", "GSEM-NAME", "GSEM-ALT", "GSEM-LABEL",
    "GSEM-REL", "GSEM-STATE", "GSEM-NATIVE-VALID", "GSEM-NATIVE-FIT", "GSEM-ARIA-PERMIT", "GPLAT-SCOPE", "GPLAT-BOUNDARY-ROUTE",
    "GPLAT-READONLY", "GPLAT-RESTORE", "GPLAT-NOCREATED", "GPLAT-EVID", "GPLAT-REPORT",
]
REJECTED_GROUPS = [
    "GDEV-STOP-DESC", "GDEV-CANONICAL-SOURCE", "GDEV-ROOT", "GTEST-TARGET",
    "GTEST-CUSTOM-IMPLEMENT", "GTEST-GENERATED", "GTEST-PERF-GUARD", "GTEST-PERF-BEFORE-AFTER",
    "GPLAT-UNKNOWN", "GPLAT-IDENTITY", "GPLAT-UNAVAILABLE", "GPLAT-SPEC", "GPLAT-TARGET", "GSEM-LANG",
    "GSEM-DIR", "GSEM-PATTERN", "GSEM-PURPOSE", "GSEM-ARIA-ABSENT", "GSEM-CUSTOM",
    "GSEM-NATIVE-LINK", "GSEM-NATIVE-BUTTON", "GSEM-BOUNDARY", "GMOT-REDUCE",
]
STOCK_SCENARIO_PATTERNS = [
    re.compile(r"^This scenario (?:checks|challenges)\b", re.I),
    re.compile(r"\bowned outcome\b", re.I),
    re.compile(r"\blisted contracts\b", re.I),
    re.compile(r"\blisted responsibilities\b", re.I),
    re.compile(r"\bdeclared HTML/CSS subject\b", re.I),
]

failures = []


def check(condition, message):
    if not condition:
        failures.append(message)


def frontmatter(path):
    text = path.read_text()
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    check(bool(match), f"missing frontmatter: {path}")
    if not match:
        return {}, text
    data = {}
    for line in match.group(1).splitlines():
        key, value = line.split(":", 1)
        data[key] = value.strip().strip('"')
    return data, text


root_fm, root_text = frontmatter(FAMILY / "SKILL.md")
check(list(root_fm) == ["name", "description", "allowed-tools", "skill-type"], "root frontmatter keys/order")
check(root_fm == {
    "name": "html-css",
    "description": "MUST load before working in HTML or CSS. HTML/CSS is a domain skill that routes the task to its applicable operation, tool, and preference child skills.",
    "allowed-tools": "Read",
    "skill-type": "domain",
}, "root frontmatter values")
check(re.findall(r"^## .+$", root_text, re.M) == ["## Child Skills"], "root must contain only Child Skills body section")
root_rows = re.findall(r"^\| \[`(html-css-[^`]+)`\].*\| (MUST load when .+) \|$", root_text, re.M)
check([name for name, _ in root_rows] == CHILDREN, "root child row order/inventory")

routing = (FAMILY / "routing.md").read_text()
routing_rows = dict(re.findall(r"^\| `(html-css-[^`]+)` \| (?:preference|operation|tool) \| (MUST load when .+) \|$", routing, re.M))

for child in CHILDREN:
    path = FAMILY / child / "SKILL.md"
    fm, text = frontmatter(path)
    check(list(fm) == ["name", "description", "allowed-tools", "skill-type"], f"frontmatter keys/order: {child}")
    check(fm.get("name") == child, f"name/path mismatch: {child}")
    check(fm.get("skill-type") == TYPES[child], f"type mismatch: {child}")
    check(fm.get("description", "").startswith("MUST load when ") and fm.get("description", "").count(".") == 1, f"one-sentence trigger: {child}")
    root_trigger = dict(root_rows).get(child)
    check(root_trigger == fm.get("description"), f"root trigger mismatch: {child}")
    check(routing_rows.get(child) == fm.get("description"), f"routing trigger mismatch: {child}")
    sections = re.findall(r"^## (.+)$", text, re.M)
    expected_sections = ["Principles", "Rules", "Procedure", "References"] if TYPES[child] == "operation" else ["Principles", "Rules", "Manual", "References"] if TYPES[child] == "tool" else ["Principles", "Rules", "Preferences", "References"]
    check(sections == expected_sections, f"section shape: {child}: {sections}")
    principle_part = text.split("## Principles", 1)[1].split("## Rules", 1)[0]
    principles = re.findall(r"^### ", principle_part, re.M)
    check(1 <= len(principles) <= 4, f"principle count: {child}")
    rules_part = text.split("## Rules", 1)[1].split("## ", 1)[0]
    rules = re.findall(r"^- \*\*(MUST|NEVER) ", rules_part, re.M)
    check(1 <= len(rules) <= 6, f"rule count/normative form: {child}: {len(rules)}")
    if TYPES[child] == "operation":
        check(bool(re.search(r"^### Phase 1 — ", text, re.M)) and bool(re.search(r"^#### 1\.1 ", text, re.M)), f"numbered operation procedure: {child}")
    if TYPES[child] == "tool":
        check("\n## Procedure\n" not in text, f"tool contains Procedure: {child}")
    if TYPES[child] == "preference":
        check(bool(re.search(r"^### Prefer ", text, re.M)), f"preference lacks real default: {child}")

all_skill_paths = list(FAMILY.rglob("SKILL.md"))
check(len(all_skill_paths) == 8, f"expected root plus seven SKILL.md, found {len(all_skill_paths)}")
check(not list((FAMILY / "html-css-development/evaluation").rglob("SKILL.md")), "nested Development evaluation skill")
check(not list((FAMILY / "html-css-testing/evaluation").rglob("SKILL.md")), "nested Testing evaluation skill")

all_ids = []
row_texts = {}
all_scenario_contexts = []
owner_counts = collections.Counter()
for rel, (prefix, expected_count) in EXPECTED.items():
    path = FAMILY / rel
    text = path.read_text()
    headings = re.findall(r"^## (Project|Structure|Performance|Aesthetics|Usage|Consistency|Risk|Overall)$", text, re.M)
    check(headings == PERSPECTIVES, f"perspective order: {rel}")
    current_scenario = None
    scenario_rows = collections.Counter()
    seen_scenarios = set()
    for line in text.splitlines():
        scenario = re.match(rf"^### ({prefix}-SC-([A-Z]+)-(\d{{2}})) — ([^:]+): ", line)
        if scenario:
            current_scenario = scenario.group(1)
            seen_scenarios.add(current_scenario)
            check(scenario.group(4) in CLASSES, f"invalid scenario class in {rel}: {scenario.group(4)}")
            continue
        row = re.match(rf"^- \[ \] ({prefix}-CK-([A-Z]+)-(\d{{2}})-(\d{{2}})) — (.+)$", line)
        if row:
            row_id = row.group(1)
            check(current_scenario is not None, f"row outside scenario: {row_id}")
            check(current_scenario == f"{prefix}-SC-{row.group(2)}-{row.group(3)}", f"scenario/row ordinal mismatch: {row_id}")
            check(bool(row.group(5).strip()), f"empty row: {row_id}")
            scenario_rows[current_scenario] += 1
            all_ids.append(row_id)
            row_texts[row_id] = row.group(5).strip()
            owner_counts[prefix] += 1
        elif line.startswith("- [") and not line.startswith("- [ ]"):
            check(False, f"resolved or malformed checkbox in {rel}: {line}")
    check(owner_counts[prefix] >= expected_count, f"owner count accumulation unexpectedly low: {prefix}")
    local_count = sum(scenario_rows.values())
    check(local_count == expected_count, f"source count {rel}: {local_count} != {expected_count}")
    check(all(1 <= count <= 6 for count in scenario_rows.values()), f"scenario cap in {rel}: {dict(scenario_rows)}")
    check(seen_scenarios == set(scenario_rows), f"scenario without rows in {rel}")
    scenario_contexts = re.findall(rf"^### ({prefix}-SC-[A-Z]+-\d{{2}}) — ([^:]+): ([^\n]+)\n\n([^\n]+)$", text, re.M)
    check(len(scenario_contexts) == len(seen_scenarios), f"scenario context count: {rel}")
    for scenario_id, scenario_class, title, paragraph in scenario_contexts:
        check(title.strip() and not re.search(r"\bset \d+\b", title), f"ambiguous scenario title: {scenario_id}: {title}")
        check("It passes when " in paragraph and "; it fails when " in paragraph, f"scenario lacks explicit pass/fail context: {scenario_id}")
        check(not any(pattern.search(paragraph) for pattern in STOCK_SCENARIO_PATTERNS), f"stock scenario paragraph: {scenario_id}")
        check(not any(phrase in title for phrase in ["bound outcome", "internal structure and boundary cases", "resource and performance claim quality", "real use, variants, and handoffs", "binding rules and evidence identity", "adversarial authority and false assurance", "completion, limitation, and recovery", "coherence without cosmetic compliance"]), f"generic scenario title: {scenario_id}: {title}")
        all_scenario_contexts.append((scenario_id, paragraph))

check(len(all_scenario_contexts) == 92, f"scenario paragraph inventory: {len(all_scenario_contexts)}")
check(len({paragraph for _, paragraph in all_scenario_contexts}) == 92, "scenario paragraphs must be unique")
check(len(all_ids) == 318 and len(set(all_ids)) == 318, "318 globally unique family IDs")
check(owner_counts == collections.Counter({"HCDES": 16, "HCDEV": 65, "HCTEST": 58, "HCPLAT": 54, "HCSEM": 46, "HCCONV": 35, "HCMOT": 44}), f"owner counts: {owner_counts}")
predicate_ids = collections.defaultdict(list)
for row_id, predicate in row_texts.items():
    predicate_ids[predicate].append(row_id)
duplicate_predicates = {predicate: ids for predicate, ids in predicate_ids.items() if len(ids) > 1}
check(not duplicate_predicates, f"duplicate checklist predicates: {duplicate_predicates}")
deictic_rows = {row_id: predicate for row_id, predicate in row_texts.items() if re.match(r"^(?:That|This|These|Those|Such)\b", predicate)}
check(not deictic_rows, f"context-dependent checklist predicates: {deictic_rows}")

EXPECTED_CORRECTED_ROWS = {
    "HCDEV-CK-PROJECT-01-05": "The Migration-mode frame records the public interface, known consumers and discovery confidence, transition authority, compatibility plan, and coherent recovery state before mutation.",
    "HCDEV-CK-PERFORMANCE-02-01": "Every resource-bearing element and every repeated or hidden subtree is required by the outcome, content, behavior, or fallback.",
    "HCDEV-CK-OVERALL-02-02": "The authorized canonical source contains the intended change.",
    "HCDEV-CK-OVERALL-02-06": "Every required source, regeneration, variant, consumer, and focused-test check for the accepted emitted identity passes.",
    "HCTEST-CK-PERFORMANCE-02-01": "Every animated property other than `transform` or `opacity` carries an `html-css-testing`-owned representative before-and-after comparison based on direct target observations from `html-css-platform`, recorded beside the change.",
    "HCPLAT-CK-STRUCTURE-01-05": "Every conformance answer cites its owning specification: WHATWG HTML for an HTML authoring question or the applicable CSS Working Group specification for a CSS question.",
    "HCPLAT-CK-USAGE-01-01": "Every answer identifies the exact target, document state, mode, and applicable emitted artifact—markup, CSS, DOM, or CSSOM—from which it was derived.",
    "HCPLAT-CK-CONSISTENCY-01-05": "Authoritative compatibility data is used to form a support hypothesis rather than to prove behavior in the declared targets.",
    "HCSEM-CK-USAGE-02-01": "Every explicit ARIA role, state, and property is permitted on its HTML element.",
    "HCSEM-CK-OVERALL-01-01": "Every claim evaluated here concerns authored meaning rather than observed native behavior or accessibility output.",
    "HCMOT-CK-PROJECT-01-03": "Each motion claim cites the owner that established it: `html-css-platform` for standards facts or direct target observations and `html-css-testing` for focused comparisons and result claims.",
    "HCMOT-CK-STRUCTURE-01-01": "Every duration, easing, and delay uses a project motion-scale step unless a recorded distance, content, or interaction-purpose exception makes that scale unsuitable.",
    "HCMOT-CK-STRUCTURE-01-02": "Every reusable timing value absent from the scale is added at the scale owner.",
    "HCMOT-CK-STRUCTURE-01-03": "Shared scale steps use the project's stable token mechanism at the owner its consumers read.",
    "HCMOT-CK-STRUCTURE-01-04": "Every one-off timing value names the distance, content, or interaction purpose that makes the shared scale unsuitable.",
    "HCMOT-CK-STRUCTURE-01-06": "Every non-reusable timing value absent from the scale remains a recorded one-off exception.",
    "HCMOT-CK-PERFORMANCE-01-03": "Each `will-change` is activated shortly before its measured need.",
    "HCMOT-CK-PERFORMANCE-01-04": "Every `will-change`, including a persistent hint, has direct target evidence that its benefit outweighs its memory and side effects.",
    "HCMOT-CK-PERFORMANCE-01-05": "Each `will-change` is removed when its measured need ends unless direct target evidence justifies persistent use.",
    "HCMOT-CK-RISK-01-01": "Every material movement, scaling, panning, and parallax effect has a reduced substitute.",
    "HCMOT-CK-CONSISTENCY-01-01": "A two-state property change uses a transition unless the target or interruption model makes another mechanic clearer and the departure is recorded.",
    "HCMOT-CK-CONSISTENCY-01-02": "Keyframes are used for named intermediate states, repetition, direction control, or an independent timeline unless a recorded target or interruption constraint requires another mechanic.",
    "HCMOT-CK-CONSISTENCY-01-03": "Every `Element.animate()` decision is routed to `web-interaction`.",
    "HCMOT-CK-CONSISTENCY-01-04": "Every `Element.animate()` use applies its recorded timing decision, risk-aware property choice, direct-target evidence limits, and material-motion reduced path.",
    "HCMOT-CK-CONSISTENCY-01-06": "The Motion record for `Element.animate()` supplies only the approved timing, reduction, interruption, and cancellation contract.",
    "HCMOT-CK-CONSISTENCY-02-01": "Every declared target lacking a chosen declarative feature has a tested fallback that preserves the outcome through immediate state, static presentation, simpler CSS, keyframes, or `web-interaction`-owned script as applicable.",
    "HCMOT-CK-USAGE-01-02": "Every shipped material transition and animation responds to a reduced-motion request.",
    "HCMOT-CK-USAGE-01-06": "Every static styling difference used to convey a state, relationship, direction, or result persists after the motion ends.",
    "HCMOT-CK-USAGE-02-02": "Every shipped material transition and animation has an explicit path under `prefers-reduced-motion: reduce`.",
    "HCMOT-CK-USAGE-02-04": "Each reduced substitute keeps the feedback rather than removing it.",
    "HCSEM-CK-USAGE-03-05": "A native element is used wherever its meaning and behavior fit.",
}
for row_id, expected_text in EXPECTED_CORRECTED_ROWS.items():
    check(row_texts.get(row_id) == expected_text, f"accepted correction regressed: {row_id}")
semantics_checklist = (FAMILY / "html-css-semantics/checklists.md").read_text()
check("HCSEM-CK-CONSISTENCY-01-01" not in set(all_ids), "duplicate ARIA-permission row remains")
check("HCMOT-CK-USAGE-02-01" not in set(all_ids), "dangling static-difference row remains")
check("- Also applies: HCSEM-CK-USAGE-02-01 (explicit ARIA is permitted on its HTML element)." in semantics_checklist, "ARIA-permission reuse reference")

agents_text = (ROOT / "AGENTS.md").read_text()
check("generator-materialized real-file copies" in agents_text, "AGENTS plugin topology must require materialized package copies")
check("--materialize-package" in agents_text, "AGENTS plugin topology must name the package generator")
check(bool(re.search(r"any missing file is a\s+failure, not", agents_text)), "AGENTS installed-cache contract must fail on missing files")
check("distributes canonical `skills` and `agents` through symlinks" not in agents_text and "reports it as a warning" not in agents_text, "AGENTS contains obsolete symlink-package guidance")

codex_text = (SKILLS / "codex/SKILL.md").read_text()
check("generator-materialized `skills/` and `agents/` directories" in codex_text, "Codex skill must describe the materialized package")
check("A missing installed path is a package failure" in codex_text, "Codex skill must reject missing installed content")
smoke_text = (ROOT / "scripts/check-codex-plugin-smoke.sh").read_text()
check("installed_tree_matches_package" in smoke_text and "test_complete_installed_inventory_guard" in smoke_text, "installed-cache smoke must compare the complete package inventory")
check("cmp -s" in smoke_text and "omitted and byte-different leaves" in smoke_text, "installed-cache smoke must compare bytes and test negative fixtures")

routing_text = (FAMILY / "routing.md").read_text()
check("`html-css-platform` owns direct target observations and diagnosis" in routing_text and "`html-css-testing` owns focused comparison" in routing_text, "performance evidence ownership split")
web_design_text = (SKILLS / "web/web-design/checklists.md").read_text()
check("Direct HTML/CSS target observations belong to [`html-css-platform`]" in web_design_text and "application-level performance suites belong to [`web-testing`]" in web_design_text, "Web Design performance handoff")
desktop_interface_text = (SKILLS / "desktop/desktop-interface/checklists.md").read_text()
check("Direct HTML/CSS renderer observations\nbelong to [`html-css-platform`]" in desktop_interface_text and "Installed responsiveness and\nresource acceptance remains assigned by [`desktop-delivery`]" in desktop_interface_text, "Desktop Interface performance handoff")

migration_path = FAMILY / "migration.md"
migration = migration_path.read_text()
check(len(migration.splitlines()) > 100, "migration.md must exceed 100 lines")
for anchor in ["surface-migration", "valid-literal-merge-groups", "rejected-candidate-merge-groups", "old-checklist-id-dispositions", "new-family-checklist-ids", "outward-owner-references", "validation", "retirement-reservations"]:
    check(f"](#{anchor})" in migration, f"migration ToC missing {anchor}")

surface_section = migration.split("## Surface Migration", 1)[1].split("## Valid Literal Merge Groups", 1)[0]
live_callers = []
for path in SKILLS.rglob("*.md"):
    if FAMILY == path or FAMILY in path.parents:
        continue
    if "html-css" in path.read_text():
        live_callers.append(path.relative_to(SKILLS).as_posix())
check(bool(live_callers), "live html-css caller inventory must not be empty")
for caller in sorted(live_callers):
    check(f"`{caller}`" in surface_section, f"surface migration missing caller: {caller}")
for old_surface in [
    ".gobbi/projects/gobbi/skills/html/", ".gobbi/projects/gobbi/skills/css/",
    ".agents/skills/html", ".agents/skills/css", ".claude/skills/html/", ".claude/skills/css/",
    "plugins/gobbi/skills/html/", "plugins/gobbi/skills/css/",
]:
    check(f"`{old_surface}`" in surface_section, f"surface migration missing old identity: {old_surface}")

valid_section = migration.split("## Valid Literal Merge Groups", 1)[1].split("## Rejected Candidate Merge Groups", 1)[0]
valid_records = re.findall(r"^\| `([A-Z0-9-]+)` \|", valid_section, re.M)
check(valid_records == VALID_GROUPS, f"valid literal group audit: {valid_records}")
rejected_section = migration.split("## Rejected Candidate Merge Groups", 1)[1].split("## Old Checklist ID Dispositions", 1)[0]
rejected_records = re.findall(r"^\| `[A-Z]+` \| `([A-Z0-9-]+)` \|", rejected_section, re.M)
check(rejected_records == REJECTED_GROUPS, f"rejected candidate group audit: {rejected_records}")

old_section = migration.split("## Old Checklist ID Dispositions", 1)[1].split("## New Family Checklist IDs", 1)[0]
old_lines = [line for line in old_section.splitlines() if re.match(r"^\| `[A-Z0-9-]+` \|", line)]
old_records = {}
old_sources = collections.Counter()
family_target_count = 0
outward_target_count = 0
for line in old_lines:
    cols = [part.strip() for part in line.strip("|").split("|")]
    old_id = cols[0].strip("`")
    old_sources[cols[1].strip("`")] += 1
    disposition = cols[2].strip("`")
    family_targets = re.findall(r"`NEW_FAMILY_ID` → `([^`]+)`", cols[3])
    outward_targets = re.findall(r"`OUTWARD_OWNER_REF` → `([^`]+)`", cols[3])
    cardinality = len(family_targets) + len(outward_targets)
    check(disposition in {"ONE_TO_ONE", "SPLIT", "MERGED", "RETIRED"}, f"bad disposition: {old_id}")
    check((disposition in {"ONE_TO_ONE", "MERGED"} and cardinality == 1) or (disposition == "SPLIT" and cardinality >= 2) or (disposition == "RETIRED" and cardinality == 0), f"bad target cardinality: {old_id}")
    check(all(target in set(all_ids) for target in family_targets), f"missing family target: {old_id}")
    old_records[old_id] = line
    family_target_count += len(family_targets)
    outward_target_count += len(outward_targets)
old_digest = hashlib.sha256(b"\0".join(old_id.encode() for old_id in sorted(old_records))).hexdigest()
check(len(old_records) == len(old_lines) == 278 and old_digest == EXPECTED_OLD_ID_DIGEST, f"old-ID set, uniqueness, and digest: {len(old_records)} / {old_digest}")
check(old_sources == collections.Counter(EXPECTED_OLD_SOURCES), f"old source inventory: {old_sources}")
check(outward_target_count == 3, f"outward target count: {outward_target_count}")
for group in VALID_GROUPS:
    check(f"`{group}`" in old_section, f"valid group unused by old-ID dispositions: {group}")
for group in REJECTED_GROUPS:
    check(f"`{group}`" not in old_section, f"rejected group used as a merge: {group}")

new_section = migration.split("## New Family Checklist IDs", 1)[1].split("## Outward Owner References", 1)[0]
new_records = re.findall(r"^\| `((?:HCDES|HCDEV|HCTEST|HCPLAT|HCSEM|HCCONV|HCMOT)-CK-[A-Z]+-\d{2}-\d{2})` \|", new_section, re.M)
check(set(new_records) == set(all_ids) and len(new_records) == 318, "new-ID migration set and uniqueness")
new_lines = [line for line in new_section.splitlines() if re.match(r"^\| `(?:HCDES|HCDEV|HCTEST|HCPLAT|HCSEM|HCCONV|HCMOT)-CK-", line)]
origin_counts = collections.Counter("NEW" if [part.strip() for part in line.strip("|").split("|")][6] == "`NEW`" else "OLD_DERIVED" for line in new_lines)
check(origin_counts == collections.Counter({"OLD_DERIVED": 270, "NEW": 48}), f"new family origins: {origin_counts}")
check(migration.count("| `OUTWARD_OWNER_REF` |") == 3, "outward reference detail rows")
check("CSSDEV-CK-OVERALL-01-01" in old_records and "`NEW_FAMILY_ID` → `HCDEV-CK-OVERALL-02-02`" in old_records["CSSDEV-CK-OVERALL-01-01"] and "`NEW_FAMILY_ID` → `HCDEV-CK-OVERALL-02-06`" in old_records["CSSDEV-CK-OVERALL-01-01"], "compound Development source must remain split into two atomic family rows")
for old_id, owner in [("HTMLSEM-CK-USAGE-02-01", "web-interaction"), ("HTML-CK-USAGE-04-02", "web-frontend"), ("HTMLSEM-CK-USAGE-02-02", "web-testing")]:
    check(old_id in old_records and f"`OUTWARD_OWNER_REF` → `{owner}`" in old_records[old_id], f"typed outward target: {old_id}")

vocabulary = (FAMILY / "vocabulary.md").read_text()
terms = re.findall(r"^## `([^`]+)`$", vocabulary, re.M)
check(terms == ["semantic owner", "owner-tagged", "lifecycle envelope", "supersession", "evidence ceiling"], f"vocabulary register: {terms}")
check("shared lifecycle record" in vocabulary and "claim owner" in vocabulary, "cold-reader synonym challenges")

for path in FAMILY.rglob("*.md"):
    text = path.read_text()
    if path.name != "migration.md":
        check(not re.search(r"\b(?:foreign|outward|bound subject|set \d+)\b", text), f"ambiguous live vocabulary: {path.relative_to(ROOT)}")
    for raw in re.findall(r"\[[^\]]+\]\(([^)]+)\)", text):
        target = raw.split("#", 1)[0]
        if not target or "://" in target:
            continue
        check((path.parent / target).resolve().exists(), f"broken family link: {path.relative_to(ROOT)} -> {raw}")

for canonical in FAMILY.rglob("*"):
    rel = canonical.relative_to(FAMILY)
    generated = PLUGIN / rel
    check(not canonical.is_symlink(), f"canonical family symlink: {rel}")
    if canonical.is_dir():
        check(generated.is_dir() and not generated.is_symlink(), f"generated directory missing/symlink: {rel}")
    else:
        check(generated.is_file() and not generated.is_symlink(), f"generated file missing/symlink: {rel}")
        if generated.is_file():
            check(hashlib.sha256(canonical.read_bytes()).digest() == hashlib.sha256(generated.read_bytes()).digest(), f"generated byte drift: {rel}")

check(os.path.islink(ROOT / ".agents/skills/html-css"), "html-css native discovery link")
check(os.readlink(ROOT / ".agents/skills/html-css") == "../../.gobbi/projects/gobbi/skills/html-css", "native discovery target")
claude_family = ROOT / ".claude/skills/html-css"
canonical_files = {path.relative_to(FAMILY) for path in FAMILY.rglob("*") if path.is_file()}
claude_files = {path.relative_to(claude_family) for path in claude_family.rglob("*") if path.is_file()}
check(canonical_files == claude_files, "Claude discovery family file inventory")
for rel in canonical_files:
    mirror = claude_family / rel
    check(mirror.is_symlink(), f"Claude discovery leaf is not a symlink: {rel}")
    if mirror.is_symlink():
        check(mirror.resolve() == (FAMILY / rel).resolve(), f"Claude discovery target: {rel}")
for old in [ROOT / ".agents/skills/html", ROOT / ".agents/skills/css", ROOT / ".gobbi/projects/gobbi/skills/html", ROOT / ".gobbi/projects/gobbi/skills/css", ROOT / "plugins/gobbi/skills/html", ROOT / "plugins/gobbi/skills/css"]:
    check(not old.exists() and not old.is_symlink(), f"stale executable path: {old.relative_to(ROOT)}")

stale_patterns = [
    re.compile(r"(?<![a-z-])html-(?:development|platform|semantics)(?![a-z-])"),
    re.compile(r"(?<![a-z-])css-(?:development|platform|motion|conventions)(?![a-z-])"),
    re.compile(r"skills/(?:html|css)/"),
]
search_roots = [ROOT / ".gobbi/projects/gobbi/skills", ROOT / "plugins/gobbi/skills"]
generic_split_owner = re.compile(r"\b(?:HTML(?:/CSS| and CSS| or CSS)?|CSS) owners?\b", re.I)
for base in search_roots:
    for path in base.rglob("*.md"):
        if path.name == "migration.md" and path.parent.name == "html-css":
            continue
        text = path.read_text()
        check(not generic_split_owner.search(text), f"generic split owner in {path.relative_to(ROOT)}")
        check("safe-property" not in text, f"undefined Motion policy in {path.relative_to(ROOT)}")
        check("rendering cost belong to" not in text, f"source owner claims rendering cost in {path.relative_to(ROOT)}")
        check("Every shipped transition and animation" not in text, f"unscoped reduced-motion predicate in {path.relative_to(ROOT)}")
        check("Every movement, scaling, panning, and parallax effect" not in text, f"unscoped vestibular-motion predicate in {path.relative_to(ROOT)}")
        for pattern in stale_patterns:
            check(not pattern.search(text), f"stale live identity in {path.relative_to(ROOT)}: {pattern.pattern}")

if failures:
    print(f"FAIL {len(failures)} html-css validation checks")
    for failure in failures:
        print(f"- {failure}")
    sys.exit(1)

print("PASS html-css family validation")
print("- 8 loadable skills: one root and seven direct children")
print("- 9 checklist sources, 318 unique rows, all perspectives, scenario cap <= 6, source cap <= 55")
print("- 278 old IDs resolve to 270 old-derived family rows, 48 new rows, and 3 typed outward references")
print("- 17 valid literal groups and 23 rejected candidate groups retain their accepted dispositions")
print("- exact trigger equality, 92 unique concrete scenario contexts, five-term vocabulary, caller and performance-owner inventory, links, discovery, stale-path removal, and plugin byte equality pass")

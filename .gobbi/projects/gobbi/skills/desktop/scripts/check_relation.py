#!/usr/bin/env python3
"""Check the four Desktop case-to-check relation projections."""

from __future__ import annotations

import argparse
import re
import shutil
import sys
import tempfile
from pathlib import Path


SCENARIO_PATTERN = r"DESK-SCENARIO-[0-9]{2}"
CHECK_PATTERN = r"DESK-CHECK-[0-9]{2}"
PAUSE_PATTERN = r"DESK-PAUSE-[1-4]"

SCENARIO_HEADING = re.compile(
    rf"^#### `(?P<identifier>{SCENARIO_PATTERN})` — (?P<subject>\S.*)$"
)
CHECK_HEADING = re.compile(
    rf"^- \[ \] \*\*`(?P<identifier>{CHECK_PATTERN})`\*\* (?P<subject>\S.*)$"
)
FIELD_MARKER = re.compile(r"\*(?P<name>[A-Za-z][A-Za-z -]*):\*")
SCENARIO_TOKEN = re.compile(rf"`(?P<identifier>{SCENARIO_PATTERN})`")
CHECK_TOKEN = re.compile(rf"`(?P<identifier>{CHECK_PATTERN})`")
SECTION_HEADING = re.compile(r"^## .+$")
SUBJECT_BOUNDARY = re.compile(r"^#{1,3} .+$")

TRACE_PROJECTION = "trace"
SEEDS_PROJECTION = "seeds"
COVERAGE_PROJECTION = "guaranteed-coverage-map"
AUDIT_PROJECTION = "check-to-obligation-union-audit"
PROJECTION_ORDER = (
    TRACE_PROJECTION,
    SEEDS_PROJECTION,
    COVERAGE_PROJECTION,
    AUDIT_PROJECTION,
)

Edge = tuple[str, str]


class RelationError(Exception):
    """A fail-closed relation-checking error."""


class SelfTestError(RelationError):
    """A self-test setup or expectation failure."""


def read_source(path: Path, projection: str) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise RelationError(
            f"projection={projection} error=unreadable-file path={path}: {error}"
        ) from error


def add_edge(edges: set[Edge], edge: Edge, projection: str) -> None:
    if edge in edges:
        scenario, check = edge
        raise RelationError(
            f"projection={projection} error=duplicate-edge "
            f"edge={scenario}->{check}"
        )
    edges.add(edge)


def parse_identifier_list(
    value: str,
    token_pattern: re.Pattern[str],
    projection: str,
    subject: str,
) -> list[str]:
    normalized = " ".join(value.split())
    if not normalized:
        raise RelationError(
            f"projection={projection} error=empty-subject subject={subject}"
        )

    identifiers = [
        match.group("identifier") for match in token_pattern.finditer(normalized)
    ]
    expected = ", ".join(f"`{identifier}`" for identifier in identifiers)
    if not identifiers or normalized != expected:
        raise RelationError(
            f"projection={projection} error=malformed-identifiers "
            f"subject={subject} value={normalized!r}"
        )
    return identifiers


def field_value(block: list[str], field: str, projection: str, subject: str) -> str:
    joined = "\n".join(block)
    marker = f"*{field}:*"
    occurrences = joined.count(marker)
    if occurrences != 1:
        diagnosis = "missing-field" if occurrences == 0 else "repeated-field"
        raise RelationError(
            f"projection={projection} error={diagnosis} "
            f"field={field} subject={subject}"
        )

    start = joined.index(marker) + len(marker)
    following = joined[start:]
    next_marker = FIELD_MARKER.search(following)
    if next_marker:
        following = following[: next_marker.start()]
    return following.strip()


def subject_blocks(
    text: str,
    heading_pattern: re.Pattern[str],
    heading_prefix: str,
    projection: str,
) -> list[tuple[str, list[str]]]:
    lines = text.splitlines()
    starts: list[tuple[int, str]] = []
    seen: set[str] = set()

    for index, line in enumerate(lines):
        match = heading_pattern.match(line)
        if match:
            identifier = match.group("identifier")
            if identifier in seen:
                raise RelationError(
                    f"projection={projection} error=duplicate-heading "
                    f"subject={identifier}"
                )
            seen.add(identifier)
            starts.append((index, identifier))
        elif line.startswith(heading_prefix):
            raise RelationError(
                f"projection={projection} error=malformed-heading "
                f"line={index + 1}"
            )

    if not starts:
        raise RelationError(f"projection={projection} error=empty-projection")

    blocks: list[tuple[str, list[str]]] = []
    for position, (start, identifier) in enumerate(starts):
        end = starts[position + 1][0] if position + 1 < len(starts) else len(lines)
        for index in range(start + 1, end):
            if SUBJECT_BOUNDARY.match(lines[index]):
                end = index
                break
        blocks.append((identifier, lines[start + 1 : end]))
    return blocks


def parse_trace(text: str) -> set[Edge]:
    edges: set[Edge] = set()
    for scenario, block in subject_blocks(
        text, SCENARIO_HEADING, "#### `DESK-SCENARIO-", TRACE_PROJECTION
    ):
        value = field_value(block, "Trace", TRACE_PROJECTION, scenario)
        for check in parse_identifier_list(
            value, CHECK_TOKEN, TRACE_PROJECTION, scenario
        ):
            add_edge(edges, (scenario, check), TRACE_PROJECTION)
    if not edges:
        raise RelationError(f"projection={TRACE_PROJECTION} error=empty-projection")
    return edges


def parse_seeds(text: str) -> set[Edge]:
    edges: set[Edge] = set()
    for check, block in subject_blocks(
        text, CHECK_HEADING, "- [ ] **`DESK-CHECK-", SEEDS_PROJECTION
    ):
        value = field_value(block, "Seeds", SEEDS_PROJECTION, check)
        for scenario in parse_identifier_list(
            value, SCENARIO_TOKEN, SEEDS_PROJECTION, check
        ):
            add_edge(edges, (scenario, check), SEEDS_PROJECTION)
    if not edges:
        raise RelationError(f"projection={SEEDS_PROJECTION} error=empty-projection")
    return edges


def required_section(text: str, heading: str, projection: str) -> list[str]:
    lines = text.splitlines()
    locations = [index for index, line in enumerate(lines) if line == heading]
    if len(locations) != 1:
        diagnosis = "missing-section" if not locations else "repeated-section"
        raise RelationError(
            f"projection={projection} error={diagnosis} section={heading!r}"
        )
    start = locations[0] + 1
    end = len(lines)
    for index in range(start, len(lines)):
        if SECTION_HEADING.match(lines[index]):
            end = index
            break
    return lines[start:end]


def split_table_row(line: str, projection: str, row_number: int) -> list[str]:
    if not line.startswith("|") or not line.endswith("|"):
        raise RelationError(
            f"projection={projection} error=malformed-row row={row_number}"
        )
    return [cell.strip() for cell in line[1:-1].split("|")]


def table_rows(
    section: list[str],
    header: str,
    separator: str,
    projection: str,
) -> list[tuple[int, list[str]]]:
    header_locations = [index for index, line in enumerate(section) if line == header]
    if len(header_locations) != 1:
        diagnosis = "missing-table" if not header_locations else "repeated-table"
        raise RelationError(f"projection={projection} error={diagnosis}")

    header_index = header_locations[0]
    if (
        header_index + 1 >= len(section)
        or section[header_index + 1] != separator
    ):
        raise RelationError(
            f"projection={projection} error=malformed-table-separator"
        )

    rows: list[tuple[int, list[str]]] = []
    for index in range(header_index + 2, len(section)):
        line = section[index]
        if not line:
            break
        if not line.startswith("|"):
            raise RelationError(
                f"projection={projection} error=malformed-row row={index + 1}"
            )
        rows.append((index + 1, split_table_row(line, projection, index + 1)))
    if not rows:
        raise RelationError(f"projection={projection} error=empty-projection")
    return rows


def single_identifier(
    cell: str,
    pattern: str,
    projection: str,
    row_number: int,
    label: str,
) -> str:
    match = re.fullmatch(rf"`(?P<identifier>{pattern})`", cell)
    if not match:
        raise RelationError(
            f"projection={projection} error=malformed-row "
            f"row={row_number} cell={label}"
        )
    return match.group("identifier")


def parse_coverage_map(text: str) -> set[Edge]:
    section = required_section(
        text, "## Guaranteed coverage map", COVERAGE_PROJECTION
    )
    rows = table_rows(
        section,
        "| Check | Seeding cases | Pause point |",
        "|---|---|---|",
        COVERAGE_PROJECTION,
    )
    edges: set[Edge] = set()
    checks: set[str] = set()
    for row_number, cells in rows:
        if len(cells) != 3:
            raise RelationError(
                f"projection={COVERAGE_PROJECTION} error=malformed-row "
                f"row={row_number} columns={len(cells)}"
            )
        check = single_identifier(
            cells[0], CHECK_PATTERN, COVERAGE_PROJECTION, row_number, "Check"
        )
        if check in checks:
            raise RelationError(
                f"projection={COVERAGE_PROJECTION} error=duplicate-heading "
                f"subject={check}"
            )
        checks.add(check)
        single_identifier(
            cells[2], PAUSE_PATTERN, COVERAGE_PROJECTION, row_number, "Pause point"
        )
        for scenario in parse_identifier_list(
            cells[1], SCENARIO_TOKEN, COVERAGE_PROJECTION, check
        ):
            add_edge(edges, (scenario, check), COVERAGE_PROJECTION)
    if not edges:
        raise RelationError(
            f"projection={COVERAGE_PROJECTION} error=empty-projection"
        )
    return edges


def parse_union_audit(text: str) -> set[Edge]:
    section = required_section(
        text, "## Check-to-obligation union audit", AUDIT_PROJECTION
    )
    rows = table_rows(
        section,
        "| Check | Obligations it consumes | Conditions | Reviewer | Result |",
        "|---|---|---|---|---|",
        AUDIT_PROJECTION,
    )
    edges: set[Edge] = set()
    checks: set[str] = set()
    for row_number, cells in rows:
        if len(cells) != 5:
            raise RelationError(
                f"projection={AUDIT_PROJECTION} error=malformed-row "
                f"row={row_number} columns={len(cells)}"
            )
        check = single_identifier(
            cells[0], CHECK_PATTERN, AUDIT_PROJECTION, row_number, "Check"
        )
        if check in checks:
            raise RelationError(
                f"projection={AUDIT_PROJECTION} error=duplicate-heading "
                f"subject={check}"
            )
        checks.add(check)
        if not re.fullmatch(r"[1-9][0-9]*", cells[2]):
            raise RelationError(
                f"projection={AUDIT_PROJECTION} error=malformed-row "
                f"row={row_number} cell=Conditions"
            )
        for scenario in parse_identifier_list(
            cells[1], SCENARIO_TOKEN, AUDIT_PROJECTION, check
        ):
            add_edge(edges, (scenario, check), AUDIT_PROJECTION)
    if not edges:
        raise RelationError(
            f"projection={AUDIT_PROJECTION} error=empty-projection"
        )
    return edges


def parse_projections(
    scenarios_path: Path, checklists_path: Path
) -> dict[str, set[Edge]]:
    scenarios_text = read_source(scenarios_path, TRACE_PROJECTION)
    checklists_text = read_source(checklists_path, SEEDS_PROJECTION)
    return {
        TRACE_PROJECTION: parse_trace(scenarios_text),
        SEEDS_PROJECTION: parse_seeds(checklists_text),
        COVERAGE_PROJECTION: parse_coverage_map(checklists_text),
        AUDIT_PROJECTION: parse_union_audit(checklists_text),
    }


def compare_projections(projections: dict[str, set[Edge]]) -> list[str]:
    authoritative = projections[TRACE_PROJECTION]
    diagnostics: list[str] = []
    for projection in PROJECTION_ORDER[1:]:
        candidate = projections[projection]
        for scenario, check in sorted(authoritative - candidate):
            diagnostics.append(
                f"projection={projection} edge={scenario}->{check} "
                "side=authoritative-only"
            )
        for scenario, check in sorted(candidate - authoritative):
            diagnostics.append(
                f"projection={projection} edge={scenario}->{check} "
                "side=projection-only"
            )
    return diagnostics


def success_message(edge_count: int) -> str:
    projections = ",".join(PROJECTION_ORDER)
    return (
        f"relation-check: PASS projections={projections} edge_count={edge_count} "
        "relation_leg=script-proved obligation_leg=review-proved"
    )


def remove_field_token(
    text: str,
    heading_pattern: re.Pattern[str],
    subject: str,
    field: str,
    token: str,
) -> str:
    lines = text.splitlines(keepends=True)
    starts = [
        index
        for index, line in enumerate(lines)
        if (match := heading_pattern.match(line.rstrip("\n")))
        and match.group("identifier") == subject
    ]
    if len(starts) != 1:
        raise SelfTestError(f"self-test fixture-heading-count subject={subject}")

    start = starts[0] + 1
    end = len(lines)
    for index in range(start, len(lines)):
        stripped = lines[index].rstrip("\n")
        if heading_pattern.match(stripped) or SUBJECT_BOUNDARY.match(stripped):
            end = index
            break
    block = "".join(lines[start:end])
    marker = f"*{field}:*"
    if block.count(marker) != 1:
        raise SelfTestError(
            f"self-test fixture-field-count field={field} subject={subject}"
        )
    marker_start = block.index(marker) + len(marker)
    next_marker = FIELD_MARKER.search(block, marker_start)
    value_end = next_marker.start() if next_marker else len(block)
    value = block[marker_start:value_end]
    if value.count(token) != 1:
        raise SelfTestError(
            f"self-test fixture-token-count token={token} subject={subject}"
        )

    following = re.compile(re.escape(token) + r",\s*")
    preceding = re.compile(r",\s*" + re.escape(token))
    if following.search(value):
        changed_value = following.sub("", value, count=1)
    elif preceding.search(value):
        changed_value = preceding.sub("", value, count=1)
    else:
        raise SelfTestError(
            f"self-test fixture-would-empty-field field={field} subject={subject}"
        )
    changed_block = block[:marker_start] + changed_value + block[value_end:]
    return "".join(lines[:start]) + changed_block + "".join(lines[end:])


def require_real_pass(
    scenarios_path: Path, checklists_path: Path, phase: str
) -> dict[str, set[Edge]]:
    projections = parse_projections(scenarios_path, checklists_path)
    diagnostics = compare_projections(projections)
    if diagnostics:
        raise SelfTestError(
            f"self-test {phase}=FAIL diagnostics={'|'.join(diagnostics)}"
        )
    return projections


def run_self_test(scenarios_path: Path, checklists_path: Path) -> int:
    pristine = require_real_pass(scenarios_path, checklists_path, "real-pass-before")
    authoritative = pristine[TRACE_PROJECTION]
    scenario_degree = {
        scenario: sum(edge[0] == scenario for edge in authoritative)
        for scenario, _ in authoritative
    }
    check_degree = {
        check: sum(edge[1] == check for edge in authoritative)
        for _, check in authoritative
    }
    eligible = sorted(
        edge
        for edge in authoritative
        if scenario_degree[edge[0]] > 1 and check_degree[edge[1]] > 1
    )
    if not eligible:
        raise SelfTestError("self-test no-removable-real-edge")
    scenario, check = eligible[0]

    with tempfile.TemporaryDirectory(prefix="desktop-relation-self-test-") as temp:
        fixture = Path(temp)
        fixture_scenarios = fixture / "scenarios.md"
        fixture_checklists = fixture / "checklists.md"
        shutil.copyfile(scenarios_path, fixture_scenarios)
        shutil.copyfile(checklists_path, fixture_checklists)

        fixture_checklists.write_text(
            remove_field_token(
                fixture_checklists.read_text(encoding="utf-8"),
                CHECK_HEADING,
                check,
                "Seeds",
                f"`{scenario}`",
            ),
            encoding="utf-8",
        )
        f_a = compare_projections(
            parse_projections(fixture_scenarios, fixture_checklists)
        )
        expected_f_a = [
            f"projection={SEEDS_PROJECTION} edge={scenario}->{check} "
            "side=authoritative-only"
        ]
        if f_a != expected_f_a:
            raise SelfTestError(
                f"self-test F-A=FAIL diagnostics={'|'.join(f_a) or '<none>'}"
            )

        shutil.copyfile(checklists_path, fixture_checklists)
        fixture_scenarios.write_text(
            remove_field_token(
                fixture_scenarios.read_text(encoding="utf-8"),
                SCENARIO_HEADING,
                scenario,
                "Trace",
                f"`{check}`",
            ),
            encoding="utf-8",
        )
        f_b = compare_projections(
            parse_projections(fixture_scenarios, fixture_checklists)
        )
        expected_f_b = [
            f"projection={projection} edge={scenario}->{check} "
            "side=projection-only"
            for projection in PROJECTION_ORDER[1:]
        ]
        if f_b != expected_f_b:
            raise SelfTestError(
                f"self-test F-B=FAIL diagnostics={'|'.join(f_b) or '<none>'}"
            )

        shutil.copyfile(scenarios_path, fixture_scenarios)
        final = require_real_pass(
            fixture_scenarios, fixture_checklists, "real-pass-after"
        )

    edge_count = len(final[TRACE_PROJECTION])
    print(f"self-test real-pass-before=PASS edge_count={edge_count}")
    print(f"self-test F-A=PASS diagnostic={expected_f_a[0]}")
    print(f"self-test F-B=PASS diagnostics={' | '.join(expected_f_b)}")
    print(f"self-test real-pass-after=PASS edge_count={edge_count}")
    print("relation_leg=script-proved obligation_leg=review-proved")
    return 0


def argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Check the Desktop case-to-check relation projections."
    )
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--scenarios", type=Path)
    parser.add_argument("--checklists", type=Path)
    return parser


def main() -> int:
    parser = argument_parser()
    args = parser.parse_args()
    if args.self_test and (args.scenarios is not None or args.checklists is not None):
        parser.error("--self-test cannot be combined with explicit input paths")
    if (args.scenarios is None) != (args.checklists is None):
        parser.error("--scenarios and --checklists must be supplied together")

    desktop = Path(__file__).resolve().parent.parent
    scenarios_path = args.scenarios or desktop / "scenarios.md"
    checklists_path = args.checklists or desktop / "checklists.md"
    try:
        if args.self_test:
            return run_self_test(scenarios_path, checklists_path)
        projections = parse_projections(scenarios_path, checklists_path)
        diagnostics = compare_projections(projections)
        if diagnostics:
            print("\n".join(diagnostics), file=sys.stderr)
            return 1
        print(success_message(len(projections[TRACE_PROJECTION])))
        return 0
    except RelationError as error:
        print(f"relation-check: ERROR {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

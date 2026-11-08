"""Check a project's skills against Gobbi's skill-writing standard. Python 3.9 or later, standard library only.

Run it from the project: python3 <this skill's directory>/scripts/check_skills.py [--skills PATH]...
stdout carries one JSON envelope; stderr carries one line per finding and a count line.
Exit codes: 0 clean, 1 findings, 2 usage error, 3 internal error or a crashed check.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import traceback
from collections.abc import Sequence
from dataclasses import asdict
from pathlib import Path
from typing import Any, NoReturn

sys.dont_write_bytecode = True  # before the local imports: no __pycache__ beside the scripts
if sys.version_info < (3, 9):  # noqa: UP036 - say why instead of failing on a newer API
    sys.stderr.write("check_skills.py needs Python 3.9 or later\n")
    raise SystemExit(2)

from skill_checks.checks import CHECKS, Check, Options  # noqa: E402
from skill_checks.finding import Finding  # noqa: E402
from skill_checks.tree import SkillTree  # noqa: E402

_TOOL = "check_skills"
_COMMAND = "check"
_DEFAULT_SKILLS = ".gobbi/projects/*/skills"


class UsageError(Exception):
    """A rejected command line that stops the run before any check."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


class _Parser(argparse.ArgumentParser):
    """argparse reports errors by exiting; this tool reports them in its envelope instead."""

    def error(self, message: str) -> NoReturn:
        raise UsageError("usage", message)


def main(argv: Sequence[str] | None = None) -> int:
    try:
        args = _parser().parse_args(argv)
        selected, options = _select(args.only), _options(args)
        root = _root(args.root)
        return _emit(*_check(SkillTree(root, _paths(root, args.skills)), selected, options))
    except UsageError as error:
        return _emit(2, None, [f"{_TOOL}: {error}"], {"code": error.code, "message": str(error)})
    except Exception as error:  # a bug in this tool
        traceback.print_exc()
        message = f"{type(error).__name__}: {error}"
        return _emit(3, None, [f"{_TOOL}: internal error {message}"], {"code": "internal", "message": message})


def _parser() -> argparse.ArgumentParser:
    defaults = Options()
    parser = _Parser(prog="check_skills.py", description="Check skills against Gobbi's skill-writing standard.")
    parser.add_argument(
        "--skills",
        action="append",
        default=[],
        metavar="PATH",
        help=f"a skills directory or file to check (default: every {_DEFAULT_SKILLS} directory under the root)",
    )
    parser.add_argument(
        "--root",
        metavar="DIR",
        help="the project root that links resolve in (default: the git top level of the cwd, else the cwd)",
    )
    parser.add_argument(
        "--max-line",
        type=int,
        default=defaults.max_line,
        metavar="N",
        help=f"the longest prose line, in characters (default: {defaults.max_line})",
    )
    parser.add_argument(
        "--allow-caps", action="append", default=[], metavar="WORD", help="allow one more ALL-CAPS word"
    )
    parser.add_argument(
        "--only",
        action="append",
        default=[],
        metavar="ID",
        help=f"run only this check: {', '.join(check.id for check in CHECKS)}",
    )
    return parser


def _root(given: str | None) -> Path:
    if given is not None:
        root = Path(given).resolve()
        if not root.is_dir():
            raise UsageError("bad-root", f"--root {given} is not a directory")
        return root
    cwd = Path.cwd().resolve()
    try:
        completed = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"], cwd=cwd, capture_output=True, text=True, check=False
        )
    except OSError:  # git is not installed
        return cwd
    top = completed.stdout.strip()
    return Path(top).resolve() if completed.returncode == 0 and top else cwd


def _paths(root: Path, given: Sequence[str]) -> tuple[str, ...]:
    """The skills directories or files to check, relative to the root."""
    if not given:
        found = tuple(
            sorted(path.relative_to(root).as_posix() for path in root.glob(_DEFAULT_SKILLS) if path.is_dir())
        )
        if not found:
            raise UsageError("no-skills", f"no {_DEFAULT_SKILLS} directory under {root}; pass --skills PATH")
        return found
    paths = []
    for text in given:
        path = Path(text).resolve()
        if not path.exists():
            raise UsageError("bad-skills", f"--skills {text} does not exist")
        try:
            paths.append(path.relative_to(root).as_posix())
        except ValueError:
            raise UsageError("bad-skills", f"--skills {text} is outside the root {root}") from None
    return tuple(paths)


def _select(ids: Sequence[str]) -> tuple[Check, ...]:
    """The checks named by ids, in run order, or every check when none is named."""
    known = [check.id for check in CHECKS]
    unknown = [check_id for check_id in ids if check_id not in known]
    if unknown:
        raise UsageError("unknown-check", f"unknown check: {', '.join(unknown)} (known: {', '.join(known)})")
    return tuple(check for check in CHECKS if not ids or check.id in ids)


def _options(args: argparse.Namespace) -> Options:
    if args.max_line < 1:
        raise UsageError("usage", f"--max-line must be at least 1, not {args.max_line}")
    return Options(max_line=args.max_line, allowed_caps=Options().allowed_caps | frozenset(args.allow_caps))


def _check(tree: SkillTree, selected: Sequence[Check], options: Options) -> tuple[int, dict[str, Any], list[str]]:
    rows: list[dict[str, Any]] = []
    reported: list[dict[str, Any]] = []
    lines: list[str] = []
    for check in selected:
        try:
            found = list(check.run(tree, options))
            crashed = False
        except Exception as error:  # isolate the crash; the other checks still run
            traceback.print_exc()
            message = f"check-crashed {type(error).__name__}: {error}"
            found = [Finding(check.id, ".", None, message, check.advisory)]
            crashed = True
        lines.extend(_line(finding) for finding in found)
        reported.extend(asdict(finding) for finding in found)
        rows.append({"id": check.id, "advisory": check.advisory, "findings": len(found), "crashed": crashed})
    errors = sum(row["findings"] for row in rows if not row["advisory"])
    notes = sum(row["findings"] for row in rows if row["advisory"])
    crashes = sum(row["crashed"] for row in rows)
    lines.append(
        f"{_TOOL}: {errors} error(s), {notes} note(s), {crashes} crashed, {len(rows)} check(s) "
        f"over {', '.join(tree.paths)}"
    )
    code = 3 if crashes else 1 if errors else 0
    result = {"root": str(tree.root), "skills": list(tree.paths), "checks": rows, "findings": reported}
    return code, result, lines


def _line(finding: Finding) -> str:
    """`<severity> <check> <path> <message> [L<line>]`: the line number last, so a failure id can omit it."""
    severity = "NOTE" if finding.advisory else "ERROR"
    message = " ".join(finding.message.split())
    location = f" [L{finding.line}]" if finding.line is not None else ""
    return f"{severity} {finding.check} {finding.path} {message}{location}"


def _emit(
    code: int, result: dict[str, Any] | None, summary: Sequence[str], error: dict[str, Any] | None = None
) -> int:
    for line in summary:
        sys.stderr.write(line + "\n")
    envelope = {
        "tool": _TOOL,
        "command": _COMMAND,
        "ok": code == 0,
        "exit": code,
        "result": result,
        "error": None if error is None else {**error, "where": None},
    }
    sys.stdout.write(json.dumps(envelope) + "\n")
    return code


if __name__ == "__main__":
    raise SystemExit(main())

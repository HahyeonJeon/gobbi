"""The command-line surface of Gobbi's repository guard: check, sync, and list.

stdout carries one JSON envelope; stderr carries the human summary, with one line per finding.
Exit codes: 0 clean, 1 findings or unfixable problems, 2 usage error, 3 internal error or a crashed check.
"""

import argparse
import json
import sys
import traceback
from collections.abc import Sequence
from dataclasses import asdict
from pathlib import Path
from typing import Any

sys.dont_write_bytecode = True  # before the local imports: no __pycache__ beside the scripts
if sys.version_info < (3, 11):  # noqa: UP036 - say why instead of failing on tomllib
    sys.stderr.write("guard.py needs Python 3.11 or later\n")
    raise SystemExit(2)

import checks  # noqa: E402
import generated  # noqa: E402
import mirror  # noqa: E402
from finding import Finding  # noqa: E402
from repo import PACKAGE, Repo, find_root  # noqa: E402

_TOOL = "guard"
_MAX_ACTION_LINES = 10
_WRITABLE = (*(f"{PACKAGE}/{subtree}" for subtree in mirror.OWNED), *generated.TARGETS)


class UsageError(Exception):
    """A rejected command line or environment that stops the guard before any work."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


class _Parser(argparse.ArgumentParser):
    """argparse reports errors by exiting; the guard reports them in its envelope instead."""

    def error(self, message: str) -> None:  # type: ignore[override]
        raise UsageError("usage", message)


def main(argv: list[str] | None = None) -> int:
    command = None
    try:
        args = _parser().parse_args(argv)
        command = args.command
        if command == "list":
            return _emit(command, *_list())
        repo = Repo(_root(args.root))
        if command == "check":
            return _emit(command, *_check(repo, args.only))
        return _emit(command, *_sync(repo))
    except UsageError as error:
        return _emit(command, 2, None, [f"guard: {error}"], {"code": error.code, "message": str(error)})
    except Exception as error:  # a bug in the guard itself
        traceback.print_exc()
        message = f"{type(error).__name__}: {error}"
        return _emit(
            command, 3, None, [f"guard: internal error {message}"], {"code": "internal", "message": message}
        )


def _parser() -> argparse.ArgumentParser:
    parser = _Parser(prog="guard.py", description="Check Gobbi's repository and sync its derived copies.")
    commands = parser.add_subparsers(dest="command", required=True, parser_class=_Parser)
    check = commands.add_parser("check", help="report findings; read-only")
    check.add_argument("--only", action="append", default=[], metavar="ID", help="run only this check")
    check.add_argument("--root", help="a directory inside the Gobbi checkout")
    sync = commands.add_parser("sync", help="write the package projection and generated blocks")
    sync.add_argument("--root", help="a directory inside the Gobbi checkout")
    commands.add_parser("list", help="list the checks")
    return parser


def _root(start: str | None) -> Path:
    origin = Path(start).resolve() if start else Path.cwd()
    root = find_root(origin)
    if root is None:
        raise UsageError("not-gobbi-repo", f"no Gobbi checkout at or above {origin}")
    return root


def _check(repo: Repo, ids: Sequence[str]) -> tuple[int, dict[str, Any], list[str]]:
    try:
        selected = checks.select(ids)
    except ValueError as error:
        raise UsageError("unknown-check", str(error)) from error
    rows: list[dict[str, Any]] = []
    reported: list[dict[str, Any]] = []
    lines: list[str] = []
    for check in selected:
        try:
            found = list(check.run(repo))
            crashed = False
        except Exception as error:  # isolate the crash; the other checks still run
            traceback.print_exc()
            found = [Finding(check.id, ".", None, f"check-crashed {type(error).__name__}: {error}")]
            crashed = True
        for finding in found:
            lines.append(_line("NOTE" if check.advisory else "ERROR", finding))
            reported.append({**asdict(finding), "advisory": check.advisory})
        rows.append({"id": check.id, "advisory": check.advisory, "findings": len(found), "crashed": crashed})
    errors = sum(row["findings"] for row in rows if not row["advisory"])
    notes = sum(row["findings"] for row in rows if row["advisory"])
    crashes = sum(row["crashed"] for row in rows)
    lines.append(f"guard check: {errors} error(s), {notes} note(s), {crashes} crashed, {len(rows)} check(s)")
    code = 3 if crashes else 1 if errors else 0
    return code, {"checks": rows, "findings": reported}, lines


def _sync(repo: Repo) -> tuple[int, dict[str, Any], list[str]]:
    generated_actions, problems = generated.plan(repo)
    actions = mirror.plan(repo) + generated_actions
    repo.apply(actions, _WRITABLE)
    lines = [f"{action.op} {action.path}" for action in actions[:_MAX_ACTION_LINES]]
    if len(actions) > _MAX_ACTION_LINES:
        lines.append(f"... and {len(actions) - _MAX_ACTION_LINES} more action(s)")
    lines.extend(_line("ERROR", problem) for problem in problems)
    lines.append(f"guard sync: {len(actions)} action(s), {len(problems)} unfixable problem(s)")
    result = {
        "actions": [{"op": action.op, "path": action.path} for action in actions],
        "problems": [asdict(problem) for problem in problems],
    }
    return (1 if problems else 0), result, lines


def _list() -> tuple[int, dict[str, Any], list[str]]:
    rows = [{"id": check.id, "summary": check.summary, "advisory": check.advisory} for check in checks.CHECKS]
    lines = [f"{row['id']}: {row['summary']}" + (" (advisory)" if row["advisory"] else "") for row in rows]
    return 0, {"checks": rows}, lines


def _line(severity: str, finding: Finding) -> str:
    """`<severity> <check> <path> <message> [L<line>]`: the line number last, so a failure id can omit it."""
    message = " ".join(finding.message.split())
    location = f" [L{finding.line}]" if finding.line is not None else ""
    return f"{severity} {finding.check} {finding.path} {message}{location}"


def _emit(
    command: str | None,
    code: int,
    result: dict[str, Any] | None,
    summary: Sequence[str],
    error: dict[str, Any] | None = None,
) -> int:
    for line in summary:
        sys.stderr.write(line + "\n")
    envelope = {
        "tool": _TOOL,
        "command": command,
        "ok": code == 0,
        "exit": code,
        "result": result,
        "error": None if error is None else {**error, "where": None},
    }
    sys.stdout.write(json.dumps(envelope) + "\n")
    return code


if __name__ == "__main__":
    raise SystemExit(main())

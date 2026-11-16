#!/usr/bin/env python3
"""Print the Gobbi entry state for the checkout it runs in.

Usage: python3 entry.py [runtime [project-key]]

Read-only. Prints `key: value` lines and exits 0, or prints `blocked: <reason>` and exits 2.
The optional runtime (claude, codex, cursor, or grok) adds the manager role path for that runtime.
The optional project key replaces the one derived from the repository folder name.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

PROJECT_KEY = re.compile(r"[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?")
RUNTIMES = ("claude", "codex", "cursor", "grok")
INSTRUCTION_FILES = ("AGENTS.md", "CLAUDE.md", ".claude/CLAUDE.md")
FIELD = re.compile(r"^\|\s*(Mode|Normalized slug|Latest handoff)\s*\|\s*(.*?)\s*\|\s*$", re.MULTILINE)


class Blocked(Exception):
    """Entry cannot continue; the message names the first failed fact."""


def git(cwd: Path, *args: str) -> str:
    command = ["git", "--no-optional-locks", *args]
    try:
        result = subprocess.run(command, cwd=cwd, capture_output=True, text=True, check=False)
    except FileNotFoundError:
        raise Blocked("git is not installed or not on PATH") from None
    if result.returncode != 0:
        raise Blocked(f"git {' '.join(args)} failed in {cwd}: {result.stderr.strip() or 'no output'}")
    return result.stdout.strip()


def root_pair() -> tuple[Path, Path]:
    """Return the skills root and agents root this script was loaded from, after checking the sentinels."""
    skills = Path(__file__).resolve().parents[2]
    agents = skills.parent / "agents"
    for sentinel in (skills / "gobbi" / "SKILL.md", skills / "principles" / "SKILL.md"):
        if not sentinel.is_file():
            raise Blocked(f"root pair: {sentinel} is missing")
    if not any((agents / name).is_file() for name in ("manager.md", "claude/manager.md")):
        raise Blocked(f"root pair: neither {agents / 'manager.md'} nor {agents / 'claude/manager.md'} exists")
    return skills, agents


def manager_role(agents: Path, runtime: str) -> Path | None:
    """Return the manager role file for one runtime, in a runtime-flat or runtime-folder layout."""
    roots = (agents, agents / runtime, agents.parent / "runtimes" / runtime)
    names = ("manager.toml",) if runtime == "codex" else ("manager.md",)
    candidates = [root / name for root in (roots if runtime == "claude" else roots[1:]) for name in names]
    return next((path for path in candidates if path.is_file()), None)


def project_key(common_dir: Path, given: str | None) -> str:
    key = given if given is not None else common_dir.parent.name
    if not PROJECT_KEY.fullmatch(key):
        raise Blocked(f"project key {key!r} is not 1 to 64 lowercase letters, digits, and inner hyphens")
    return key


def sessions(checkout: Path, main_checkout: Path, key: str) -> list[tuple[float, str]]:
    """Return every session configuration under this checkout and the main checkout's worktrees, newest first.

    A path under the main checkout is shown relative to it.
    """
    project = Path(".gobbi") / "projects" / key
    found: dict[Path, float] = {}
    for base in {checkout, main_checkout}:
        patterns = (f"{project}/sessions/*/configuration.md", f"{project}/worktrees/*/{project}/sessions/*/configuration.md")
        for pattern in patterns:
            for path in base.glob(pattern):
                found[path.parent.resolve() / path.name] = path.lstat().st_mtime
    rows = []
    main_checkout = main_checkout.resolve()
    for path, modified in found.items():
        try:
            fields = dict(FIELD.findall(path.read_text(encoding="utf-8", errors="replace")))
        except OSError as error:
            rows.append((modified, f"unreadable | {error.strerror} | {path}"))
            continue
        mode = fields.get("Mode", "unknown")
        slug = fields.get("Normalized slug", "unknown")
        handoff = fields.get("Latest handoff")
        suffix = f" | latest handoff {handoff}" if handoff else ""
        shown = path.relative_to(main_checkout) if path.is_relative_to(main_checkout) else path
        rows.append((modified, f"{mode} | {slug} | {shown}{suffix}"))
    return sorted(rows, reverse=True)


def entry(cwd: Path, runtime: str | None, given_key: str | None) -> list[str]:
    skills, agents = root_pair()
    checkout = Path(git(cwd, "rev-parse", "--show-toplevel"))
    common_dir = Path(git(cwd, "rev-parse", "--path-format=absolute", "--git-common-dir"))
    key = project_key(common_dir, given_key)
    lines = [f"skills_root: {skills}", f"agents_root: {agents}", f"principles: {skills / 'principles' / 'SKILL.md'}"]
    if runtime:
        role = manager_role(agents, runtime)
        if role is None:
            raise Blocked(f"no manager role for {runtime} under {agents} or {agents.parent / 'runtimes'}")
        lines += [f"runtime: {runtime}", f"manager_role: {role}"]
    lines += [f"project_key: {key}", f"checkout: {checkout}", f"main_checkout: {common_dir.parent}"]
    lines.append(f"branch: {git(cwd, 'branch', '--show-current') or 'detached'}")
    lines.append(f"dirty: {'yes' if git(cwd, 'status', '--porcelain') else 'no'}")
    instructions = [checkout / name for name in INSTRUCTION_FILES if (checkout / name).is_file()]
    lines += [f"instructions: {path}" for path in instructions] or ["instructions: none"]
    rules_dir = checkout / ".gobbi" / "projects" / key / "rules"
    rules = sorted(path for path in rules_dir.rglob("*.md") if path.is_file()) if rules_dir.is_dir() else []
    lines += [f"rules: {path}" for path in rules] or ["rules: NO_PROJECT_RULES: rules/ absent-or-empty"]
    found = sessions(checkout, common_dir.parent, key)
    lines.append(f"sessions: {len(found)}")
    lines += [f"session: {row}" for _, row in found]
    return lines


def main(argv: list[str]) -> int:
    runtime = argv[1] if len(argv) > 1 else None
    given_key = argv[2] if len(argv) > 2 else None
    try:
        if runtime is not None and runtime not in RUNTIMES:
            raise Blocked(f"runtime {runtime!r} is not one of {', '.join(RUNTIMES)}")
        print("\n".join(entry(Path.cwd(), runtime, given_key)))
    except Blocked as blocked:
        print(f"blocked: {blocked}")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))

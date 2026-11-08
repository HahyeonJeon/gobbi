"""Role parity: every runtime holds the same roles, with the same body."""

import tomllib
from collections.abc import Callable, Iterator
from pathlib import PurePosixPath

from repo import CANONICAL, Repo
from skill_checks.finding import Finding

__all__ = ["drift"]

SCOPE = f"{CANONICAL}/agents"
RUNTIMES = ("claude", "codex", "cursor", "grok")  # the first runtime holding a role is the reference body


def _markdown_body(repo: Repo, path: str) -> str | None:
    document = repo.document(path)
    return "\n".join(document.lines[document.body_start :]).strip()


def _toml_body(repo: Repo, path: str) -> str | None:
    try:
        body = tomllib.loads(repo.text(path)).get("developer_instructions")
    except tomllib.TOMLDecodeError:
        return None
    return body.strip() if isinstance(body, str) else None


_BODY: dict[str, Callable[[Repo, str], str | None]] = {".md": _markdown_body, ".toml": _toml_body}


def drift(repo: Repo) -> Iterator[Finding]:
    roles = {runtime: _roles(repo, runtime) for runtime in RUNTIMES}
    names = sorted(set().union(*roles.values()))
    for name in names:
        bodies: dict[str, tuple[str, str | None]] = {}
        for runtime in RUNTIMES:
            path = roles[runtime].get(name)
            if path is None:
                yield Finding("roles", f"{SCOPE}/{runtime}", None, f"role {name} is missing")
            else:
                bodies[runtime] = (path, _BODY[PurePosixPath(path).suffix](repo, path))
        yield from _differing(name, bodies)


def _roles(repo: Repo, runtime: str) -> dict[str, str]:
    """Role name -> file path, for the role files directly in one runtime's directory."""
    directory = f"{SCOPE}/{runtime}"
    return {
        PurePosixPath(path).stem: path
        for path in repo.files(directory)
        if PurePosixPath(path).parent == PurePosixPath(directory) and PurePosixPath(path).suffix in _BODY
    }


def _differing(name: str, bodies: dict[str, tuple[str, str | None]]) -> Iterator[Finding]:
    reference: tuple[str, str] | None = None
    for path, body in bodies.values():
        if body is None:
            yield Finding("roles", path, None, f"role {name} has no readable body")
        elif reference is None:
            reference = (path, body)
        elif body != reference[1]:
            yield Finding("roles", path, None, f"role {name} body differs from {reference[0]}")

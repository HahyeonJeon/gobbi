"""Version agreement: every place that states Gobbi's release version states the same one."""

import json
import re
from collections import Counter
from collections.abc import Callable, Iterator

from finding import Finding
from repo import PACKAGE, Repo

__all__ = ["LOCATORS", "mismatches"]

Extractor = Callable[[str], object]  # the version string, or anything else when none is found


def _plugin_version(text: str) -> object:
    return json.loads(text).get("version")


def _marketplace_version(text: str) -> object:
    plugins = json.loads(text).get("plugins", [])
    return next((plugin.get("version") for plugin in plugins if plugin.get("name") == "gobbi"), None)


def _pattern(regex: str) -> Extractor:
    compiled = re.compile(regex)

    def extract(text: str) -> str | None:
        match = compiled.search(text)
        return match.group(1) if match else None

    return extract


# (path, extractor): each row locates one version string in one file.
LOCATORS: tuple[tuple[str, Extractor], ...] = (
    (f"{PACKAGE}/.claude-plugin/plugin.json", _plugin_version),
    (f"{PACKAGE}/.codex-plugin/plugin.json", _plugin_version),
    (f"{PACKAGE}/.cursor-plugin/plugin.json", _plugin_version),
    (f"{PACKAGE}/.grok-plugin/plugin.json", _plugin_version),
    (".claude-plugin/marketplace.json", _marketplace_version),
    ("README.md", _pattern(r"badge/version-(\d+\.\d+\.\d+)-")),
    ("README.md", _pattern(r'alt="Version (\d+\.\d+\.\d+)"')),
)


def mismatches(repo: Repo) -> Iterator[Finding]:
    located: list[tuple[str, str]] = []
    for path, extract in LOCATORS:
        if not repo.exists(path):
            yield Finding("versions", path, None, "version file is missing")
            continue
        try:
            version = extract(repo.text(path))
        except (ValueError, AttributeError) as error:  # bad JSON, or JSON of an unexpected shape
            yield Finding("versions", path, None, f"cannot read the version: {error}")
            continue
        if not isinstance(version, str):
            yield Finding("versions", path, None, "no version found")
            continue
        located.append((path, version))
    if not located:
        return
    majority, count = Counter(version for _, version in located).most_common(1)[0]
    for path, version in located:
        if version != majority:
            yield Finding("versions", path, None, f"version {version} differs from {majority} ({count} places)")

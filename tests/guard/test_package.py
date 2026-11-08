"""Roles and versions: the two checks that compare copies across the package's runtimes and manifests."""

import unittest

from checks import roles, versions

from .fixtures import AGENTS, HAS_GIT, ROLE_BODY, GuardCase


@unittest.skipUnless(HAS_GIT, "git is required")
class RolesTest(GuardCase):
    def test_clean(self):
        self.assertEqual(self.messages(roles.drift, self.gobbi()), [])

    def test_frontmatter_and_surrounding_whitespace_are_not_the_body(self):
        root = self.gobbi(
            {f"{AGENTS}/grok/leader.md": f"---\nname: leader\nmodel: z\neffort: x\n---\n\n\n{ROLE_BODY}\n\n"}
        )
        self.assertEqual(self.messages(roles.drift, root), [])

    def test_missing_role_and_differing_bodies(self):
        cases = {
            "missing": ({f"{AGENTS}/cursor/leader.md": None}, [f"{AGENTS}/cursor role leader is missing"]),
            "markdown body": (
                {f"{AGENTS}/grok/leader.md": "---\nname: leader\n---\n\n# Leader\n\nYou follow.\n"},
                [f"{AGENTS}/grok/leader.md role leader body differs from {AGENTS}/claude/leader.md"],
            ),
            "toml body": (
                {f"{AGENTS}/codex/leader.toml": "developer_instructions = '''\n# Other\n'''\n"},
                [f"{AGENTS}/codex/leader.toml role leader body differs from {AGENTS}/claude/leader.md"],
            ),
            "unreadable toml": (
                {f"{AGENTS}/codex/leader.toml": "name = \n"},
                [f"{AGENTS}/codex/leader.toml role leader has no readable body"],
            ),
        }
        for label, (changes, expected) in cases.items():
            with self.subTest(label):
                self.assertEqual(self.messages(roles.drift, self.gobbi(changes)), expected)

    def test_files_in_subdirectories_are_not_roles(self):
        self.assertEqual(self.messages(roles.drift, self.gobbi({f"{AGENTS}/claude/notes/x.md": "x"})), [])


@unittest.skipUnless(HAS_GIT, "git is required")
class VersionsTest(GuardCase):
    def test_clean(self):
        self.assertEqual(self.messages(versions.mismatches, self.gobbi()), [])

    def test_the_odd_one_out_is_named(self):
        root = self.gobbi({"plugins/gobbi/.grok-plugin/plugin.json": '{"version": "1.0.1"}'})
        expected = ["plugins/gobbi/.grok-plugin/plugin.json version 1.0.1 differs from 1.0.0 (6 places)"]
        self.assertEqual(self.messages(versions.mismatches, root), expected)

    def test_each_readme_locator_counts(self):
        root = self.gobbi()
        readme = root / "README.md"
        readme.write_text(readme.read_text().replace('alt="Version 1.0.0"', 'alt="Version 2.0.0"'))
        self.assertEqual(
            self.messages(versions.mismatches, root), ["README.md version 2.0.0 differs from 1.0.0 (6 places)"]
        )

    def test_unreadable_or_missing_versions(self):
        marketplace, codex = ".claude-plugin/marketplace.json", "plugins/gobbi/.codex-plugin/plugin.json"
        cases = {
            "bad json": ({marketplace: "{"}, f"{marketplace} cannot read the version"),
            "no gobbi plugin": ({marketplace: '{"plugins": []}'}, f"{marketplace} no version found"),
            "missing file": ({codex: None}, f"{codex} version file is missing"),
        }
        for label, (changes, expected) in cases.items():
            with self.subTest(label):
                messages = self.messages(versions.mismatches, self.gobbi(changes))
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(expected), messages)


if __name__ == "__main__":
    unittest.main()

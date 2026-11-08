import unittest

from checks import links

from .fixtures import HAS_GIT, SKILLS, GuardCase

NOTES = f"{SKILLS}/alpha/notes.md"


@unittest.skipUnless(HAS_GIT, "git is required")
class LinksTest(GuardCase):
    def broken(self, body: str) -> list[str]:
        root = self.gobbi({NOTES: f"# Notes\n\n## Second — Part\n\n{body}\n"})
        return [message.removeprefix(f"{NOTES} ") for message in self.messages(links.broken, root)]

    def test_clean_fixture(self):
        self.assertEqual(self.messages(links.broken, self.gobbi()), [])

    def test_resolving_links(self):
        body = (
            "[skill](SKILL.md) [anchor](SKILL.md#alpha) [self](#second--part) [dir](../beta) "
            "[root](/README.md) [web](https://example.com/x.md) [mail](mailto:a@b.c) "
            "[template](../{name}/SKILL.md) [angle](<../x y.md>) [encoded](../beta/SKILL%2Emd) "
            "[code-anchor](../../agents/codex/leader.toml#L1)"
        )
        self.assertEqual(self.broken(body), [])

    def test_broken_links(self):
        cases = {
            "missing file": ("[x](missing.md)", "link target missing.md does not exist"),
            "missing anchor": ("[x](SKILL.md#nope)", "anchor #nope is not a heading in"),
            "missing self anchor": ("[x](#nope)", f"anchor #nope is not a heading in {NOTES}"),
            "outside": (
                "[x](../../../../../../../x.md)",
                "link target ../../../../../../../x.md leaves the repository",
            ),
        }
        for label, (body, expected) in cases.items():
            with self.subTest(label):
                messages = self.broken(body)
                self.assertEqual(len(messages), 1, messages)
                self.assertTrue(messages[0].startswith(expected), messages)

    def test_ignored_files_do_not_count_as_targets(self):
        root = self.gobbi(
            {".gitignore": "local.md\n", NOTES: "# Notes\n\n[x](local.md)\n", f"{SKILLS}/alpha/local.md": "x"}
        )
        self.assertEqual(self.messages(links.broken, root), [f"{NOTES} link target local.md does not exist"])

    def test_files_outside_the_scope_are_not_read(self):
        self.assertEqual(self.messages(links.broken, self.gobbi({"docs/notes.md": "[x](missing.md)\n"})), [])


if __name__ == "__main__":
    unittest.main()

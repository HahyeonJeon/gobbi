import os
import unittest

from repo import CANONICAL, Action, Repo, find_root

from .fixtures import HAS_GIT, GuardCase


@unittest.skipUnless(HAS_GIT, "git is required")
class ListingTest(GuardCase):
    def test_tracked_and_untracked_listed_ignored_and_deleted_not(self):
        root = self.tree(
            {".gitignore": "ignored/\n", "tracked.md": "t", "gone.md": "g", "ignored/x.md": "i"}, commit=True
        )
        (root / "untracked.md").write_text("u")
        (root / "gone.md").unlink()
        repo = Repo(root)
        self.assertEqual(repo.files(), (".gitignore", "tracked.md", "untracked.md"))

    def test_prefixes_match_whole_path_segments(self):
        repo = Repo(self.tree({"skills/a.md": "a", "skillset/b.md": "b", "other.md": "o"}))
        self.assertEqual(repo.files("skills"), ("skills/a.md",))
        self.assertEqual(repo.files("skills/", "other.md"), ("other.md", "skills/a.md"))

    def test_exists_covers_files_and_their_directories(self):
        repo = Repo(self.tree({"a/b/c.md": "c"}))
        self.assertTrue(repo.exists("a/b/c.md"))
        self.assertTrue(repo.exists("a/b"))
        self.assertFalse(repo.exists("a/c"))

    def test_link_resolves_relative_to_the_root(self):
        root = self.tree({"real.md": "r"})
        os.symlink("real.md", root / "alias.md")
        repo = Repo(root)
        self.assertEqual(repo.link("alias.md"), "real.md")
        self.assertIsNone(repo.link("real.md"))


@unittest.skipUnless(HAS_GIT, "git is required")
class ApplyTest(GuardCase):
    WRITABLE = ("plugins/gobbi/skills", "AGENTS.md")

    def test_writes_modes_deletes_and_prunes_empty_directories(self):
        root = self.tree({"plugins/gobbi/skills/old/deep/x.md": "x", "plugins/gobbi/skills/keep.md": "k"})
        repo = Repo(root)
        repo.files()  # fill the cache, which apply must clear
        repo.apply(
            [
                Action("delete", "plugins/gobbi/skills/old/deep/x.md"),
                Action("write", "plugins/gobbi/skills/new/run.sh", b"#!/bin/sh\n", executable=True),
                Action("write", "AGENTS.md", b"agents\n"),
            ],
            self.WRITABLE,
        )
        self.assertFalse((root / "plugins/gobbi/skills/old").exists())
        self.assertTrue((root / "plugins/gobbi/skills").is_dir())
        self.assertTrue(repo.executable("plugins/gobbi/skills/new/run.sh"))
        self.assertFalse(repo.executable("AGENTS.md"))
        self.assertIn("plugins/gobbi/skills/new/run.sh", repo.files())
        self.assertEqual(sorted(p.name for p in (root / "plugins/gobbi/skills/new").iterdir()), ["run.sh"])

    def test_a_symlink_is_replaced_not_followed(self):
        root = self.tree({"outside.md": "keep", "plugins/gobbi/skills/x.md": "x"})
        (root / "plugins/gobbi/skills/x.md").unlink()
        os.symlink("../../../outside.md", root / "plugins/gobbi/skills/x.md")
        Repo(root).apply([Action("write", "plugins/gobbi/skills/x.md", b"new")], self.WRITABLE)
        self.assertFalse((root / "plugins/gobbi/skills/x.md").is_symlink())
        self.assertEqual((root / "outside.md").read_text(), "keep")

    def test_refuses_any_path_outside_the_owned_paths_before_writing(self):
        root = self.tree({"plugins/gobbi/.claude-plugin/plugin.json": "{}"})
        cases = ["README.md", "plugins/gobbi/.claude-plugin/plugin.json", "plugins/gobbi/skills/../x", "/etc/x"]
        for path in cases:
            with self.subTest(path):
                good = Action("write", "plugins/gobbi/skills/ok.md", b"ok")
                with self.assertRaises(ValueError):
                    Repo(root).apply([good, Action("write", path, b"x")], self.WRITABLE)
                self.assertFalse((root / "plugins/gobbi/skills/ok.md").exists())
        writable = ("plugins/gobbi",)
        with self.assertRaises(ValueError):
            Repo(root).apply([Action("write", "plugins/gobbi/.claude-plugin/plugin.json", b"x")], writable)
        self.assertEqual((root / "plugins/gobbi/.claude-plugin/plugin.json").read_text(), "{}")


class FindRootTest(GuardCase):
    def test_nearest_directory_holding_the_canonical_tree(self):
        root = self.tree({f"{CANONICAL}/skills/a/SKILL.md": "a"}, git=False)
        self.assertEqual(find_root(root / CANONICAL / "skills" / "a"), root)
        self.assertIsNone(find_root(self.tree({"x": "x"}, git=False)))


if __name__ == "__main__":
    unittest.main()

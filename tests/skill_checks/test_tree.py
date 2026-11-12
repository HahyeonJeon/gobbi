import unittest

from skill_checks.tree import SkillTree

from .fixtures import SkillCase


class FilesTest(SkillCase):
    def test_files_under_directories_and_files_sorted_and_relative_to_the_root(self):
        root = self.tree({"skills/b/x.md": "x", "skills/a/SKILL.md": "a", "README.md": "r", "other/y.md": "y"})
        tree = SkillTree(root, ("skills", "README.md", "missing"))
        self.assertEqual(tree.files(), ("README.md", "skills/a/SKILL.md", "skills/b/x.md"))

    def test_pycache_is_skipped(self):
        root = self.tree({"skills/a/SKILL.md": "a", "skills/a/__pycache__/x.md": "x", "skills/__pycache__/y": "y"})
        self.assertEqual(SkillTree(root, ("skills",)).files(), ("skills/a/SKILL.md",))

    def test_overlapping_paths_list_a_file_once_and_the_root_itself_has_no_dot_prefix(self):
        root = self.tree({"skills/a/SKILL.md": "a"})
        self.assertEqual(SkillTree(root, ("skills", "skills/a/SKILL.md")).files(), ("skills/a/SKILL.md",))
        self.assertEqual(SkillTree(root, (".",)).files(), ("skills/a/SKILL.md",))

    def test_exists_covers_files_and_directories_outside_the_paths(self):
        tree = SkillTree(self.tree({"skills/a/SKILL.md": "a", "docs/guide.md": "g"}), ("skills",))
        self.assertTrue(tree.exists("docs/guide.md"))
        self.assertTrue(tree.exists("docs"))
        self.assertFalse(tree.exists("docs/missing.md"))

    def test_a_document_is_parsed_once(self):
        tree = SkillTree(self.tree({"skills/a/SKILL.md": "# A\n"}), ("skills",))
        self.assertIs(tree.document("skills/a/SKILL.md"), tree.document("skills/a/SKILL.md"))
        self.assertEqual(tree.document("skills/a/SKILL.md").headings[0].title, "A")


if __name__ == "__main__":
    unittest.main()

"""Tests of the skill checks that ship in the gobbi-skill skill, on Python 3.9 or later.

Run from the repository root: python3 -m unittest discover -s tests/skill_checks -t .
"""

import sys
from pathlib import Path

sys.dont_write_bytecode = True  # keep __pycache__ out of the shipped skill directory
SCRIPTS = Path(__file__).resolve().parents[2] / ".gobbi/projects/gobbi/skills/gobbi-skill/scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

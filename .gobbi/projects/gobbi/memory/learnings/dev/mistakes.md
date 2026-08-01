# Dev Mistakes

## Reusing a fixture across throwaway verification cases

**Context:** Running a sequence of quick verification experiments, such as against a throwaway git
repository, to check different cases of the same behavior.

**Mistake:** An early ignore-rule experiment reported a false failure caused by leftover git index state from
the experiment run just before it. The result looked like a genuine failure until it was reproduced.

**Correction:** Give every verification case its own fresh fixture. Re-running the failed case in a clean
repository reversed the result.

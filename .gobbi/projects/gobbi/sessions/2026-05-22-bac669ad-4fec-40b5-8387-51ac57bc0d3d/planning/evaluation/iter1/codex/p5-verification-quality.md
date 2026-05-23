VERDICT: REVISE

- [High] T7 claims final verification proving all Idea criteria (plan.md:247-258), but its block leaves criterion 4 as a comment "same fixture block as T1" (plan.md:278-279), omits P7 reword checks, and uses placeholders at plan.md:287-288. Fresh verification is not fully runnable.
- [Low] Prep beta is correctly literal in T7:
  `jq -e 'has("transcriptPath")' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
  `jq '.transcriptPath' .gobbi/projects/gobbi/skills/orchestration/templates/session.template.json   # must print: null`
  (plan.md:282-284; preparation.md:150-152).

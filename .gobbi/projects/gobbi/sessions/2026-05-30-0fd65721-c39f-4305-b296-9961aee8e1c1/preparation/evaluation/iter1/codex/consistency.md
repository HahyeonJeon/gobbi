# Consistency Perspective

## COD-CONS-001 - User-ratified decisions are not consistently reflected across rawdata and staging

Type: general  
Severity: High  
Confidence: 100  
Evidence: Discussion log ratifications: permissions = keep project-local + verify empirically (`preparation/rawdata/discussion-log.md:6-7`); skill inventory = package all 18 (`preparation/rawdata/discussion-log.md:9-10`). Rawdata later records those as ratified in the Decisions log (`preparation/rawdata/preparation.md:165-168`), but stale open-state text remains earlier: DD-8/DD-9 "surfaced as CONTRIBUTION POINTS" (`preparation/rawdata/preparation.md:19`), permissions heading still says "CONTRIBUTION POINT" (`preparation/rawdata/preparation.md:106`), the component inventory still allows Planning to package 17 (`preparation/rawdata/preparation.md:120`), and the staged permissions file has `decision_status: proposed` (`preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md:13`) while calling it a "leader recommendation" (`preparation/staging/decisions/permissions-disposition-keep-project-local-verify-empirically.md:24`).  
Why-it-matters: The user explicitly required no stale contradiction. Planning and Wrap-up consume both rawdata and staging; if the staged file is promoted as `proposed`, durable memory will contradict the user-ratified decision.  
Suggested-direction: Normalize all ratified decisions before Planning: set permissions `decision_status: ratified`, remove contribution-point wording, and remove the stale 17-skill branch unless the user reopens it.

## COD-CONS-002 - The report claims no generated artifacts while the staging directory has five

Type: checklist_gap  
Severity: High  
Confidence: 100  
Evidence: `preparation/rawdata/preparation.md:142-144` says "Generated this loop: None." Verified staging files under `preparation/staging/`: four decisions and one design file.  
Why-it-matters: This violates the Preparation frame's "Generated this loop is consistent with the staging directory" check. It also undermines the READY verdict because the report is not a faithful index of its own loop outputs.  
Suggested-direction: Update the rawdata report to list the five staging files, or regenerate it from the current staging tree.

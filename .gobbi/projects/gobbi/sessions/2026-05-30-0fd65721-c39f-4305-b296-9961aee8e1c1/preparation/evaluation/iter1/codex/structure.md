# Structure Perspective

## COD-STRUCT-001 - Staging inventory is structurally disconnected from the rawdata report

Type: checklist_gap  
Severity: High  
Confidence: 100  
Evidence: The rawdata report's required "Generated this loop" section says no artifacts were generated (`preparation/rawdata/preparation.md:142-144`), while the actual structure under `preparation/staging/` contains four `decisions/*.md` files and one `design/*.md` file.  
Why-it-matters: The report no longer forms a complete structural index of the Preparation output. A downstream Planning or Wrap-up agent reading the report as the index can miss the staged decision/design files or treat them as out-of-band artifacts.  
Suggested-direction: Make the rawdata report the structural index of the staging tree: list each staged file, its type (`decisions` or `design`), and its consumer. Re-run the staging-directory consistency check after the edit.

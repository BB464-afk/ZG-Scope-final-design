Design an enterprise table screen for ROC Library Master.
IMPORTANT:
The layout structure MUST follow the provided wireframe where ROC steps are displayed horizontally across columns (Step 1, Step 2, Step 3, Step 4) with sub-steps stacked vertically inside cells.
This is NOT a redesign. It is a visual modernization using the existing application theme.
GOAL
Recreate the ROC listing table using:
the STRUCTURE of the wireframe layout
the VISUAL STYLE of the current application theme.

GLOBAL STYLE (Follow Existing Theme)
Light enterprise UI
Subtle grey background
Thin borders
Rounded status pills
Minimal shadows
AG Grid inspired table styling
Clean typography hierarchy
Compact enterprise density
Avoid dark headers or heavy contrast.

TABLE STRUCTURE (MANDATORY)
Columns:
[Checkbox]
ROC ID
Activity Name
UOM
Step 1
Weightage
Step 2
Weightage
Step 3
Weightage
Step 4
Weightage
Total
Created At
Status

ROW BEHAVIOR
Parent ROC row:
Slightly stronger background emphasis.
Bold activity name.
Displays overall Total = 100%.
Step rows:
Appear directly below parent.
Indented visually.
Use subtle left border indicator.
Sub-steps:
Stacked vertically inside Step column.
Smaller text scale.
Light indentation arrow or connector indicator.
Weightage aligned to corresponding step.

VISUAL HIERARCHY
Parent row → medium emphasis.
Steps → normal emphasis.
Substeps → muted secondary text.
Maintain strong horizontal scan ability.

STATUS DESIGN
Use rounded status pills:
Active (green)
Inactive (neutral grey)

INTERACTIONS
Row hover highlight subtle.
Sticky header.
Alternating row shading.
No expandable cards.
No tree UI.
This must behave like an enterprise AG Grid table.

SPACING
Compact but readable.
Optimized for viewing many ROCs simultaneously.

GOAL RESULT
A modern enterprise ROC listing that keeps the comparison-friendly horizontal step layout while matching the new system theme.


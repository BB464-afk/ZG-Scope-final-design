ZG-CMP — ROC LIBRARY MASTER
Tree-Hierarchy Listing Redesign
1️⃣ MODULE OVERVIEW
Module Name
ROC Library Master
Navigation
Global Settings → Master Management → ROC Library Master

Purpose
Manage global Rules of Credit (ROC) structures used for:
Progress calculation
Billing milestones
Execution tracking
Project performance logic
ROC structure directly drives downstream project reporting.

2️⃣ DESIGN OBJECTIVE (NEW)
Redesign ROC listing from wide spreadsheet table into:
✅ Hierarchical Tree View
✅ Visually structured execution flow
✅ Color-coded step hierarchy
✅ Clear weightage visibility
✅ Expandable construction logic
The UI should communicate:
“How work progresses step-by-step”
—not just show columns.

3️⃣ ROC LISTING — NEW LAYOUT STRUCTURE

Page Layout
-----------------------------------------------------
ROC Library Master

[ Search ] [ Filter ]   Export Template | Import | + Add ROC

-----------------------------------------------------

▸ ROC-001 — Concrete Pouring        100%  Active
    ├ Preparation                  20%
    ├ Installation                 50%
    │   ├ Formwork Setup           20%
    │   ├ Reinforcement            20%
    │   └ Concrete Mix             10%
    ├ Testing                      20%
    └ Finishing                    10%

▸ ROC-002 — Steel Erection         100%  Active
▸ ROC-003 — Wall Plastering        100%  Inactive
-----------------------------------------------------


4️⃣ TREE HIERARCHY DESIGN

Hierarchy Levels
Level
Meaning
Example
Level 0
ROC Activity
ROC-001
Level 1
Main Steps
Installation
Level 2
Sub-Steps
Reinforcement


Expand / Collapse Behavior
Default State
ROC rows collapsed
Only Level 0 visible
Interaction
Action
Result
Click caret icon
expands hierarchy
Click row name
opens Edit ROC
Click checkbox
selects ROC


Animation
Expand/collapse must:
Duration: 180–220ms
Ease: ease-in-out
Smooth height transition


5️⃣ COLOR CODING (THEME-ALIGNED)
Use platform theme — NOT random colors.

Level Styling
Level 0 — ROC (Primary Entity)
Font weight: Semi-bold
Background: transparent
Left accent bar: #FD4314
Shows:
UOM
Total Weight
Status pill

Level 1 — Steps
Background:
rgba(253,67,20,0.06)

Left border:
2px solid #FD4314 (20% opacity)


Level 2 — Sub-Steps
Background:
rgba(253,67,20,0.03)

Indentation:
+24px from parent

Font:
slightly smaller
neutral color

Status Tags
Status
Color
Active
Green pill
Inactive
Grey pill


6️⃣ COLUMN INFORMATION (RIGHT SIDE META)
Each Level-0 ROC row shows:
Field
Position
UOM
right aligned
Total Weight
right aligned
Created Date
optional hover
Status
badge
Delete Icon
far right


Step rows show:
Field
Value
Weightage
right aligned only

(No unnecessary metadata clutter)

7️⃣ SEARCH FUNCTIONALITY
Search filters hierarchy by:
ROC ID
Activity Name
UOM
Step names
Sub-step names

Matching Behavior
If sub-step matches:
Auto expand parent ROC
Highlight matching text


Empty State
No ROC records found.


8️⃣ FILTER PANEL
Opened via filter icon.
Filters:
Trade Package
UOM
Created Date Range
Supports multi-filter combination.

9️⃣ IMPORT FROM EXCEL — POPUP (NEW)
Click:
Import from Excel

opens modal.

Modal Layout
-----------------------------------------
Import ROC Library

Upload ROC records using template format.

[ Drag & Drop Upload Area ]

Supported formats:
.xls  .xlsx

Validation rules:
• ROC ID required
• Activity Name required
• UOM required
• Step weight total = 100%

[Cancel]      [Upload]
-----------------------------------------


Upload Behavior
During Upload
show progress indicator

Validation Rules
System validates:
✅ Mandatory fields
✅ Unique ROC ID
✅ At least one step
✅ Total weight = 100%
✅ Sub-step weight = parent weight

Error Handling
If errors exist:
Show downloadable error report:
Row 4 — Total weight ≠ 100%
Row 7 — Duplicate ROC ID


Success State
✓ ROC records imported successfully

New records appear instantly at top.

🔟 EXPORT TEMPLATE
Downloads predefined Excel template containing:
ROC ID
Activity Name
Trade Package
UOM
Step 1–10
Step Weightages
Sub-Steps

1️⃣1️⃣ DELETE ROC
Delete icon at ROC level only.

Confirmation Modal
Are you sure you want to delete this ROC?


Blocking Rule
If ROC mapped to active project:
Cannot delete. ROC is already in use.


1️⃣2️⃣ ADD ROC BUTTON
Opens:
ROC Master Library > Add ROC


1️⃣3️⃣ PERFORMANCE RULES
Tree must support:
1000+ ROCs
Virtualized rendering
Lazy child loading
Only expanded nodes render children.

1️⃣4️⃣ UX PRINCIPLES (VERY IMPORTANT)
This redesign must:
✅ Reduce horizontal scrolling
✅ Show execution logic visually
✅ Feel like construction workflow
✅ Not resemble spreadsheet data entry
✅ Improve scanning speed
User should understand progress logic in <3 seconds.

✅ ACCEPTANCE CRITERIA
Tree hierarchy replaces wide table
Steps visually grouped
Theme color hierarchy applied
Import modal functional
Search expands matching parents
Weightage always visible
Smooth expand animation

OBJECTIVE
Redesign the All Tasks listing screen inside the existing Zauner construction management platform using the provided screenshots as visual reference.
This is NOT a new layout.
The design must:
Preserve current application shell
Follow Zauner theme colors
Maintain enterprise density
Improve readability and inline editing usability
Support large datasets (20k+ rows)

1️⃣ OVERALL STYLE
Design Language
Enterprise SaaS UI (SAP Fiori + Procore + Primavera inspired)
Clean, dense, professional
No decorative UI
Functional-first layout
Designed for operational users working daily
Theme (STRICT)
Background: #FAFAFA
Header bg: #E4EEF8
Accent: #FD4314
Selected row: #FD431426
Borders: #C8D9EE
Typography: Inter / modern sans-serif

2️⃣ PAGE STRUCTURE (KEEP EXISTING LAYOUT)

TOP BAR
Left
Hamburger menu
Page title: All Tasks
Right (same horizontal line — IMPORTANT)
Buttons aligned in ONE ROW:
Download Template (secondary)
Export Tasks (secondary)
Import from Excel (secondary)
Create Tasks (PRIMARY — orange)
Logout (far right separated)
👉 Buttons must use clear enterprise icons:
Action
Icon
Download Template
⬇️ document
Export
📤 spreadsheet
Import
📥 upload
Create
➕
Logout
↪

Icons must improve scanability (not outline-only minimal icons).

SEARCH + FILTER ROW
Placed BELOW action buttons.
Left aligned:
Large search input
Placeholder:
Search by Task ID, Task Name, or Activity...


Filter button beside search:
Funnel icon
Label: Filters
⚠️ Filters panel remains collapsed.

3️⃣ TABLE DESIGN (CORE REDESIGN)
RULES
✅ NO horizontal scrolling
✅ Sticky header
✅ Sticky first & last column
✅ Row clickable (view mode)
✅ Dense enterprise spacing
Row height: 60px approx

TABLE COLUMNS (FINAL STRUCTURE)
Create EXACTLY 6 columns.

COLUMN 1 — TASK (Pinned Left)
Multi-line stacked layout.
Structure:
Line 1 — Task ID
Bold
Primary identifier
Line 2 — Task Name
Medium weight
Line 3 — Activity
Muted text
With hierarchy icon
Example:
TASK-1733-1
PCW Distribution – B1 – T1 – R1.1
📁 FO21 – Process/Chilled Water

Behavior
Entire cell clickable → opens Task Detail
Hover highlight row

COLUMN 2 — SCOPE
Compact grouped information.
Display:
Phase → neutral tag
Discipline → colored tag
Trade Package → text below
Example:
[Fit-Out] [Architectural]
TP-MEP-001

Tags:
Rounded
Small enterprise chips

COLUMN 3 — ASSIGNED TO
Contractor chip.
Example:
👷 ABC Contractors

Style:
Soft chip background
Small user icon
No heavy borders

COLUMN 4 — PROJECT CODE
Stacked coding hierarchy using icons.
Fields combined vertically:
📍 Zone A Basement Level 1
🏢 Building A | Tranche 1
🏷 SPA-001 | Capex
📦 DP-2024-001

Rules:
Compact spacing
Muted icon color
Highly scannable
DO NOT create separate columns.

COLUMN 5 — STATUS
Replace progress bars.
Use semantic status pills.
Examples:
🔵 75% In Progress
🟡 45% On Hold
🟢 Completed

Style:
Filled soft background
Enterprise color palette
Compact pill

COLUMN 6 — ACTIONS (Pinned Right)
Icons only:
Edit ✏️
History 🕘
REMOVE:
❌ View icon (row click handles navigation)
Primary CTA:
Update Progress

Orange button aligned right.

4️⃣ INLINE EDIT MODE (RENAMED)
Rename button:
✅ Inline Edit (NOT Edit Mode)
Button placed right side above table.

WHEN INLINE EDIT ENABLED
Global Banner Appears
Inline Edit Enabled — Click highlighted fields to edit

Soft info background.

EDITABLE FIELD VISUALS
Editable fields:
light blue tint background
1px highlight border
rounded input appearance
Non-editable:
lock icon
reduced opacity
default cursor

Editable Fields
Task Name
Phase
Discipline
Trade Package
Sub-Contractor
Delivery Package
Area
Building
Tranche
SPA
Cost Type
Progress %
Non Editable
Task ID
Activity Name

HOVER LABEL BEHAVIOR (IMPORTANT)
During Inline Edit:
When hovering an editable field:
Show floating tooltip label:
Example:
Phase
Budget Cost
Delivery Package

Tooltip style:
small rounded container
subtle shadow
fast appearance
positioned near field

INPUT TYPES
Field Type
Control
Text
input
Dropdown
select
Numeric
number input
Percentage
numeric + %
Codes
dropdown chips

No layout shift allowed.

5️⃣ ROW INTERACTION
View Mode
Clicking row → Task Detail page
Checkbox NOT required
Hover highlight subtle
Inline Edit Mode
Row click disabled
Only fields editable

6️⃣ VISUAL DENSITY
Must feel:
✅ operational
✅ data-heavy
✅ fast scanning
Avoid:
large padding
card layouts
excessive whitespace

7️⃣ PERFORMANCE AWARE DESIGN
Assume:
20,000+ rows
Virtualized grid behavior
Therefore:
minimal animations
lightweight hover states
fixed column widths

8️⃣ ACCESSIBILITY
Editable fields clearly distinguishable
Icons always paired with meaning
Status readable without color reliance

🎯 FINAL DESIGN GOAL
Create a construction-grade enterprise task listing where:
All task data is visible without scrolling sideways
Editing happens directly in context
Users instantly understand what is editable
Navigation is fast and predictable
Layout matches Zauner system visual language exactly


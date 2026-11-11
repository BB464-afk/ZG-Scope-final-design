Update the Create Tasks module inside:
Project Listing
→ Select Project
→ All Tasks
→ Create Tasks

Apply the following UI + UX fixes while keeping:
✅ Existing layout
✅ Existing structure (Single Task + Bulk Creation)
✅ Existing styling and spacing
✅ Zauner Theme design system
Do NOT redesign the page — only apply defined improvements.

🎨 THEME REFERENCE (ZAUNER)
Accent Orange: #FD4314
Mandatory indicator color: Red
Background: #FAFAFA
Border: #C8D9EE
Text: #272721

1️⃣ REMOVE LOGOUT BUTTON
Change
Remove Logout button from the top-right header only on Create Task screens.
Reason
Create flow is a focused workflow screen.
Expected Result
Header contains:
Page title
Breadcrumbs
No logout action.

2️⃣ ADD MANDATORY FIELD INDICATORS
Add red asterisk (*) beside label text for ALL mandatory fields.
Styling Rules
Asterisk color: #FD4314 (or red validation color)
Same font size as label
Slight spacing after label text

Fields to Mark Mandatory
Scope Section
Phase *
Discipline *
Trade Package *
Sub-Contractor *
Coding Structure Section
Delivery Package *
Area *
Building *
Tranche *
SPA *
Cost Type *

Example Label Format
Phase *

(Not: *Phase)

3️⃣ ADD NON-EDITABLE VALUE SUFFIXES
Add contextual unit indicators inside input fields.
These suffixes must:
✅ Be visually inside the field
✅ Be non-editable
✅ Appear right aligned
✅ Use muted grey text
✅ Not affect entered value

A. COST / BUDGET FIELDS
Add € symbol suffix.
Applies To:
Budget Cost
Any cost-related numeric fields
Example
[ 38,000            € ]


B. MAN-HOUR FIELDS
Add suffix:
hrs

Applies To:
Budget Man-Hours
Effort fields
Example:
[ 75               hrs ]


C. QUANTITY FIELDS
Display dynamic UOM suffix.
Behavior
UOM fetched from selected activity or ROC.
Non-editable label.
Example:
[ 120             SQM ]

If UOM unavailable:
[ 120             — ]


Visual Design
Suffix area:
Light separator line
Background slightly tinted
Pointer events disabled

4️⃣ ACTIVITY NAME — CHANGE TO EDITABLE DROPDOWN

Current
Activity Name = Read-only text.
Update
Convert to:
✅ Editable searchable dropdown.

Dropdown Behavior
Source:
ROC Library / Activity Master
Capabilities:
Searchable typing
Select existing activity
Auto-fill dependent fields

On Selection Auto Populate
System updates:
UOM
Default Coding Structure (if applicable)
Related configuration

Visual Style
Standard dropdown with chevron icon
Same width as Task Name field
Clear selected value styling

5️⃣ CONSISTENCY RULES
Apply across:
✅ Single Task Creation
✅ Bulk Creation Mode

Bulk Creation Specific
Each editable column must show:
Mandatory * in header label
Proper suffix display inside cells.
Example header:
Budget Cost *


6️⃣ VALIDATION STATES
If mandatory field empty:
Red border
Inline message:
This field is required.

Save/Create button remains disabled until valid.


Design the Bulk Progress Update workflow inside the Task Management module using the existing application layout and design system.
Theme colors used across the interface:
Primary Accent: #FD4314
Soft Background Accent: #E4EEFE
Primary Text Color: #272721
Navigation path:
Main → Select Project → Task Listing → Bulk Progress Update
Do not introduce any additional screens beyond what is described.

STEP 1 — ACTIVITY SELECTION POPUP
When the user clicks “Bulk Progress Update” from the Task Listing screen, display a modal popup in the center of the screen.
Modal Title:
Bulk Progress Update
Inside the popup include the following:
Field:
Select Activity
This should be a searchable dropdown containing the list of activities configured for the current project.
Placeholder text:
"Search and select activity"
Below the dropdown include two action buttons:
Primary button:
Generate Bulk Progress Form
Secondary button:
Cancel
Behavior:
User must select an activity before proceeding.
Clicking Generate Bulk Progress Form redirects the user to the Bulk Progress Update screen.

STEP 2 — BULK PROGRESS UPDATE SCREEN
After selecting the activity, redirect the user to a new page.
Breadcrumb:
Task Listing > Bulk Progress Update
Page Title:
Bulk Progress Update

PROGRESS REPORTING PERIOD
At the top of the page include a section titled:
Progress Reporting Period
Fields required:
Start Date *
End Date *
Both fields must be date pickers.
Validation rules:
Start Date ≤ End Date
Both fields are mandatory.
Helper text below the fields:
“Only progress recorded within this reporting period will be considered for progress reporting.”

BULK PROGRESS WORKSPACE TABLE
Below the reporting period create a compact grid table workspace designed for fast data entry.
The table must support horizontal scrolling if many ROC steps exist.
Columns must include:
Task ID
Task Name
Measurement Type
Total Quantity
Measurement Type values:
Percentage Based
Quantity Based
Behavior for Total Quantity column:
If Measurement Type = Quantity Based
→ Display quantity value along with UOM
Example:
1500 Meter
500 CUM
If Measurement Type = Percentage Based
→ Display value as “-”

ROC STEP COLUMNS
Each ROC step should appear as a grouped column header.
Example:
Step Name
Sub-columns under each step:
Last Approved Value
New Value
Example structure:
Installation (50%)
Last Approved | New Value
Testing (20%)
Last Approved | New Value
Behavior:
Last Approved Value = read-only
New Value = editable field
Input behavior depends on Measurement Type.

INPUT RULES
If Measurement Type = Percentage Based:
New Value input should accept percentage values
Example:
0 – 100 %
If Measurement Type = Quantity Based:
New Value input accepts numeric quantity
Validation rule:
New Value ≤ Total Quantity

DRAFT FUNCTIONALITY
Users should be able to save progress as Draft without submitting for approval.
Include action buttons above or below the grid:
Secondary Button:
Save Draft
Primary Button:
Submit for Review

DRAFT RULES
Rule 1 — Draft Uniqueness
Only ONE draft per Task per User is allowed.

Rule 2 — Creating a Draft
If no draft exists:
Create a new draft.
If a draft already exists:
Open the same draft for editing.
Multiple drafts such as Draft-1, Draft-2 are not allowed.

Rule 3 — Submitting Draft
When user submits:
Draft status changes to In Review
The draft slot becomes empty.

Rule 4 — Existing In Review
Users are allowed to submit a new progress update even if a previous version is still in review.
When this happens:
Previous version status becomes Superseded
New submission becomes In Review.

GRID UX BEHAVIOR
The bulk update table must support:
Inline editing of New Value fields
Scrollable grid for large datasets
Sticky header row
Sticky Task ID and Task Name columns
Keyboard navigation for fast entry
Example keyboard navigation:
Tab → move to next editable cell
Arrow keys → navigate grid cells

DESIGN GOAL
The Bulk Progress Update interface must allow users to:
• Update progress for many tasks quickly
• Review previously approved progress values
• Enter new progress values efficiently
• Save drafts without submitting immediately
• Submit multiple tasks for approval in a single action
The layout should prioritize speed of entry, clarity of step progress, and minimal visual clutter, while maintaining the existing enterprise UI style.


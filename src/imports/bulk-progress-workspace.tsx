Design a new screen called **Bulk Progress Workspace** for a construction project management system.

This screen allows users to update task progress for multiple tasks at once instead of opening each task individually.

IMPORTANT DESIGN RULES
• Follow the existing product layout and theme.
• Use colors:
  - Primary Accent: #FD4314
  - Light Accent: #E4EEFE
  - Dark Text: #272721
• Maintain the same sidebar navigation and top header used in the current product.
• Do NOT create any additional screens outside this workspace.
• This screen must feel like an extension of the existing task listing system.

------------------------------------------------

PAGE CONTEXT

Project: Google Data Center – Norway

Breadcrumb:
Task Listing / Bulk Progress Update

Page Title:
Bulk Progress Workspace

Description:
Update progress for multiple tasks within a reporting period.

------------------------------------------------

SECTION 1 — REPORTING PERIOD

Card container.

Title:
Progress Reporting Period

Fields:
Start Date (Date Picker)
End Date (Date Picker)

Helper text:
"Only progress within this reporting period will be considered for reporting."

Layout:
Two date inputs horizontally aligned.

------------------------------------------------

SECTION 2 — FILTER PANEL

Purpose:
Allow users to filter tasks before updating progress.

Filters include:

Search Tasks (search input)

Dropdown Filters:
Phase
Discipline
Trade Package
Subcontractor
Area
Status

Actions on right side:
Reset Filters
Apply Filters

Filters appear inside a light card container.

------------------------------------------------

SECTION 3 — BULK PROGRESS WORKSPACE (MAIN COMPONENT)

This section contains a spreadsheet-style editable grid.

The grid must behave similarly to Excel but within the system.

Columns:

Task ID
Task Name
Step #
Step Name
Weight %
Type (Percentage / Quantity)
Total
Last Approved
New Value (Editable Input)
Completion %
Evidence
Status

------------------------------------------------

GRID STRUCTURE

Tasks must be grouped.

Each task expands to show its steps.

Example structure:

TASK-1733-1  | PCW Distribution – B1 – T1 – R1.1.1

  Step 1 | Procurement | Weight 10% | Last Approved 50% | New Value [input] | Completion
  Step 2 | Delivery | Weight 20% | Last Approved 75% | New Value [input] | Completion

TASK-1733-2  | HVAC Installation – L2 – Zone B

  Step 1 | Procurement | Weight 10% | Last Approved 25% | New Value [input] | Completion
  Step 2 | Delivery | Weight 20% | Last Approved 40% | New Value [input] | Completion

Tasks should be collapsible and expandable.

Default state:
Collapsed.

Buttons above grid:
Expand All
Collapse All

------------------------------------------------

NEW VALUE INPUT BEHAVIOR

The "New Value" column is editable.

Input behavior depends on step type:

Percentage type:
Input accepts values 0-100.

Quantity type:
Input accepts numeric value up to total quantity.

Completion percentage recalculates automatically.

Example:
Last Approved = 50
New Value = 60
Completion = 60%

------------------------------------------------

EVIDENCE COLUMN

Each row includes an upload button.

Label:
Upload

Clicking upload opens file selector.

Accepted files:
Images
PDF
Documents

If file uploaded:
Show file icon + filename.

------------------------------------------------

STATUS COLUMN

Shows progress state.

Possible states:

Draft
In Progress
Completed

Draft rows highlighted with light orange indicator.

------------------------------------------------

DRAFT MANAGEMENT RULES

Rule 1 — Draft Uniqueness
Only ONE draft allowed per task per user.

Rule 2 — Creating Draft
If user edits a value:
System automatically creates or updates draft.

Rule 3 — Existing Draft
If a draft already exists:
Workspace loads existing values.

Rule 4 — Submitting Draft
Draft → In Review

Rule 5 — Existing In Review
If a previous submission is already in review:

Old version → Superseded
New submission → In Review

Show version indicator near page title:

Example:
Version 2.1

------------------------------------------------

GRID INTERACTION BEHAVIOR

Grid must support spreadsheet-like editing.

Keyboard interactions:

TAB → move to next editable cell
ENTER → move to next row
Arrow Keys → navigate cells
CTRL + V → paste values

Multi-row editing allowed.

Example actions:
Apply value to selected rows
Paste values from Excel

------------------------------------------------

ROW STATE INDICATION

If value edited:

Row displays orange left indicator
Status becomes Draft

------------------------------------------------

TOP ACTION BAR

Above the grid show actions:

Left side:
Search Tasks

Right side:

Expand All
Collapse All

Primary Actions:

Save as Draft
Submit Selected
Submit All

Primary button color:
#FD4314

------------------------------------------------

SUBMISSION LOGIC

Save as Draft:
Stores progress updates without submitting.

Submit Selected:
Submits selected tasks.

Submit All:
Submits all drafted tasks.

Submission changes state:

Draft → In Review

------------------------------------------------

VISUAL DESIGN

Grid header background:
#E4EEFE

Editable inputs:
Subtle bordered input fields.

Progress indicators:
Orange progress bars using #FD4314.

Cards and containers:
Rounded with soft shadow.

Spacing:
Comfortable row height for readability.

------------------------------------------------

EMPTY STATE

If no tasks match filters:

Display centered message:

"No tasks available for progress reporting."

------------------------------------------------

RESPONSIVE BEHAVIOR

Grid scrolls horizontally if needed.

Filters wrap on smaller widths.

------------------------------------------------

IMPORTANT

Do not add extra pages or unrelated components.

This workspace must integrate seamlessly with the existing project task system.

The goal is to enable **fast bulk progress reporting inside the application without using Excel**.
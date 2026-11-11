Design the **Audit Log tab** inside the **Task Details screen** of a construction project management platform.

Follow the existing application layout and UI style.

Theme colors:
Primary Accent: #FD4314
Light Accent: #E4EEFE
Primary Text: #272721

Do NOT add new screens or unrelated UI components.

This tab displays **task lifecycle history and system activity logs**.

------------------------------------------------

PAGE CONTEXT

Header: Task Details

Breadcrumb:
Task Listing > Task Details

Tabs:
Oerview
Attachments
Discussion
Versions
Audit Log (ACTIVE)

------------------------------------------------

SECTION 1 — FILTER LOGS PANEL

Place a filter panel at the top of the audit log page.

Title:
FILTER LOGS

Filters include:

MODULE NAME
Dropdown
Options:
All Modules
Task Management
Progress Tracking

ACTION TYPE
Dropdown
Options:
All Actions
TASK_CREATE
TASK_UPDATE
TASK_STATUS_CHANGE
VERSION_CREATE
VERSION_STATUS_CHANGE

DATE RANGE
Date range picker

PERFORMED BY
Searchable user field

RECORD ID
Input field for Task ID

Right side action:
Reset All Filters

Design:
Light card container.

------------------------------------------------

SECTION 2 — AUDIT LOG TIMELINE

Below filters display logs in **vertical timeline layout**.

Timeline line appears on left side.

Each log entry is a **card connected to the timeline**.

Each card includes:

Icon
Action Title
Metadata row
Expandable content

------------------------------------------------

LOG CARD STRUCTURE

HEADER ROW

Left:
Action Title (bold)

Examples:
Task Created – Task Management
Task Updated – Task Progress
Task Status Changed
Version Created – Task
Version Status Changed – Task

Right:
Expand/Collapse arrow
Optional:
View Raw Log link

------------------------------------------------

METADATA ROW

Display key audit fields horizontally.

Example fields:

Action Type
Module
Task ID
Project ID
Performed By
Date / Time

Example layout:

Action Type: TASK_CREATE
Module: Task Management
Task ID: TSK-000123
Project ID: PRJ-00045
Performed By: Sarah Chen
Date / Time: 25 Feb 2026 10:32 AM

------------------------------------------------

LOG TYPE 1 — TASK_CREATE

Trigger:
When a task is created.

Expanded View Content

Section Title:
Initial Values

Display snapshot of initial task data.

Fields example:

Task Name
Activity Name
Status
Phase
Discipline
Trade Package
Subcontractor
Start Date
End Date

Layout:
Two-column information layout.

------------------------------------------------

LOG TYPE 2 — TASK_UPDATE

Trigger:
When any editable field changes.

Expanded View Content

Section Title:
Field Changes

Display a table with columns:

Field
Old Value
New Value

Example rows:

Task Name
Whitewall Room 1 → Whitewall Room 2

Estimated End Date
15 Mar 2026 → 22 Mar 2026

Sub-Contractor
None → ClimateControl Corp

Use arrow indicator between old and new values.

------------------------------------------------

LOG TYPE 3 — TASK_STATUS_CHANGE

Trigger:
When task lifecycle status changes.

Statuses:
Not Started
In Progress
On Hold
Completed
Void

Expanded View Content

Section Title:
Status Transition

Display visual transition block.

Previous Status → New Status

Example:

Not Started → In Progress

Design:
Two pill status labels connected by arrow.

------------------------------------------------

LOG TYPE 4 — VERSION_CREATE

Trigger:
When a new progress version draft is created.

Expanded View Content

Fields:

Version
Based On Version
Latest Approved Version
Initial Progress %

Example:

Version: V3
Based On: V2
Latest Approved: V1
Initial Progress: 65%

------------------------------------------------

LOG TYPE 5 — VERSION_STATUS_CHANGE

Handles all version state transitions.

States include:

Draft
In Review
Approved
Rejected
Superseded

Expanded View Content

Section Title:
Version Status Transition

Display:

Version
Old Version Status
New Version Status

Example:

Version V3
In Review → Approved

Below display progress snapshot.

Progress Details:

Previous Approved %
Submitted %
Approved %

Example:

Previous Approved: 38%
Submitted: 65%
Approved: 65%

Below this display:

Comments / Reason (if applicable)

Example:
Abnormal progress reviewed and validated.

------------------------------------------------

COLLAPSED SHORT FORMAT

Collapsed logs display summary format.

Example:

Task Status Changed – Task
Task Code: TSK-000123
Old Status: In Progress
New Status: On Hold
Updated By: John Martinez
Date: 28 Feb 2026 09:10 AM

------------------------------------------------

TIMELINE VISUAL STYLE

Left vertical line connecting logs.

Icons indicate action type:

Create → plus icon
Update → edit icon
Status Change → status icon
Version Create → version icon
Version Status Change → refresh icon

Log cards appear stacked chronologically.

Newest logs at top.

------------------------------------------------

INTERACTION BEHAVIOR

Click log card → expands details.

Click arrow → collapse.

"View Raw Log" link shows raw JSON log (optional developer view).

------------------------------------------------

EMPTY STATE

If no logs match filters:

Display centered message:

"No audit logs found for the selected filters."

------------------------------------------------

SCROLL BEHAVIOR

Timeline scrolls vertically.

Filters remain sticky at top.

------------------------------------------------

OBJECTIVE

This audit log system must clearly show:

• Who performed the action
• What action occurred
• When the action happened
• What data changed
• Version lifecycle changes


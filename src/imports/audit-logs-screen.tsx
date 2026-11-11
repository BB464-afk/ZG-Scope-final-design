In Global side menu add a menu item “Audit Logs” under the SYSTEM section.Then 
Design a single application screen for an existing enterprise web app called Audit Logs.
The application already has a left sidebar navigation and top header, so this screen must fit inside the existing layout.
Use a modern enterprise dashboard style.
Color Theme:
Primary background: #272721
Data panels / cards: #E4EEFE
Primary action color: #FD4314
Text on dark: white
Clean professional UI with subtle shadows and rounded cards.

Screen Purpose
The screen allows users to generate and download audit logs for different modules of the system.
The screen should contain two main sections:
Audit Log Filters
Audit Log Results Table

Section 1 — Page Header
Top of the page should display:
Title
Audit Logs
Subtitle
"Generate and download activity history across system modules."
On the right side of header:
Buttons
Download CSV
Download Excel
Buttons should use #FD4314 as the primary action color.

Section 2 — Audit Log Filter Panel
Below the header create a large filter card.
Card background: #E4EEFE
Inside the card include the following inputs arranged in a clean grid layout.
Row 1
Start Date (Date Picker)
End Date (Date Picker)
Module (Dropdown)
Dropdown values:
Global Masters
Project Management
Task Management
User Management
System Actions

Row 2 (Dynamic Filters)
These fields should appear depending on module selection.
If Global Masters is selected show:
Master Type (Dropdown)
Options:
Discipline
ROC
TP
Currency
Location
UOM
Client
Action Type (Optional dropdown)
Options:
CREATE
UPDATE
STATUS_CHANGE
IMPORT
EXPORT
TEMPLATE_DOWNLOAD

If Project Management is selected show:
Project (Dropdown)
Action Type
Options:
PROJECT_CREATE
PROJECT_UPDATE
PROJECT_STATUS_CHANGE
ASSIGN_USER_TO_PROJECT
UNASSIGN_USER_FROM_PROJECT

If Task Management is selected show:
Project (Dropdown)
Task (Searchable dropdown)
Action Type
Options:
TASK_CREATE
TASK_UPDATE
TASK_STATUS_CHANGE
VERSION_CREATE
VERSION_STATUS_CHANGE

If User Management is selected show:
User (Dropdown)
Action Type
Options:
USER_CREATE
USER_UPDATE
USER_STATUS_CHANGE
PROJECT_ASSIGNMENT
PROJECT_UNASSIGNMENT

If System Actions is selected show:
Action Type
Options:
IMPORT
EXPORT
TEMPLATE_DOWNLOAD

Generate Button
At the bottom right of the filter card add a large button:
Generate Audit Logs
Button color: #FD4314

Section 3 — Audit Logs Table
Below the filter panel create a data table.
Table background should remain light for readability.
Columns:
Timestamp
Module
Entity Type
Record ID
Action
User
Summary
Details
Example Row:
25 Feb 2026 10:32
Discipline Master
Discipline
DSC-00123
CREATE
John Smith
Record Created – Discipline
View Details

Details Interaction
Clicking View Details should open a right-side drawer panel.
The panel should show:
Action Type
Module
Record ID
Performed By
Date Time
Then show either:
Field Changes Table
Field Name | Old Value | New Value
or
Snapshot Details (key value layout)

Table Controls
Above the table include:
Search bar
Filter by User
Rows per page selector
Pagination at bottom.

UX Goal
The screen should feel like a professional audit investigation tool where users can:
filter activity
review detailed changes
export logs for reporting or compliance.
Focus on clarity, structured data presentation, and enterprise usability.

💡 Small suggestion from experience:
If the audit table can grow huge (which it will), add default filter = Last 7 Days so users don’t accidentally try to load 3 years of logs and crash the API 😅



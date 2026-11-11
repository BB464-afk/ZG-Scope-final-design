Sub-Contractor Master (Global Settings)
Design the Sub-Contractor Master Management module inside Global Settings of the Zauner CMP platform.
Navigation path:
Global Settings
→ Master Management
→ Sub-Contractor Master

This module manages system-wide subcontractors used across projects.
The design must strictly follow the existing Zauner UI theme and interaction behaviors already defined across the application.

🎨 DESIGN SYSTEM (MANDATORY)
Use Zauner theme tokens:
Element
Value
Background
#FAFAFA
Accent
#FD4314
Header BG
#E4EEF8
Header Text
#272721
Borders
#C8D9EE
Odd Rows
#F4F8FD
Selected Row
#FD431426
Mandatory Asterisk
RED (#FF3B30)


🧱 MODULE STRUCTURE
Create two screens:
1️⃣ Sub-Contractor Listing
2️⃣ Add/Edit Sub-Contractor Form

1️⃣ SUB-CONTRACTOR LISTING SCREEN

Page Header
Breadcrumb
Global Settings > Master Management > Sub Contractor Master

Title Section
Title:
Sub-Contractor Master
Subtitle:
Manage subcontractor details and assignments

Top Action Bar (Right aligned buttons)
Order (LEFT → RIGHT):
Download Template
Export in Excel
Import from Excel
+ Add Sub-Contractors (Primary Button)
Primary button:
Background: dark grey
Hover → orange tint

Button Behaviors
Download Template
Downloads Excel template
Show right-side toast:
“Sub-Contractor Template downloaded successfully.”


Export in Excel
Export visible table data
Toast:
“Sub-Contractor list exported as .xlsx”


Import from Excel
Opens modal popup.

Import Popup (Standard Global Upload Modal)
Modal Title
Import Sub-Contractors
Fields
Upload area (drag & drop)
Supported formats text:
Supported formats: .xls, .xlsx


Buttons
Cancel
Upload

Upload Validations
Mandatory:
SC Code
Name
Status
Unique:
SC Code
Email
Error behavior:
Show inline validation summary panel.
Success:
Close modal
Show toast:
“Sub-Contractors imported successfully.”


Search + Filter Row
Left
Search input:
Search by Code, Name, Contact Person or Email

Right
Filter icon (AG-Grid style filter panel)
Filters:
Category
Status
Created Date Range

Table Design (AG Grid Styled)
Columns
Column
Notes
Checkbox
Wider column
Code
SC Code
Sub-Contractor Name
Primary text
Category
Multi-tag display
Contact Person


Email


Created At
Date
Status
Badge
Actions
Edit icon


Status Badge
Active → green pill
Inactive → red pill

Row Behavior
Checkbox selects row
Clicking row (except checkbox/action) → Edit screen
Hover highlight
Selected row uses orange transparency background

Table Rules
Pagination enabled
Default sort → newest first
Empty state:
No Sub-Contractors found.


2️⃣ ADD / EDIT SUB-CONTRACTOR SCREEN

Breadcrumb
Add:
Global Settings > Master Management > Sub Contractor Master > Add Sub Contractor

Edit:
Global Settings > Master Management > Sub Contractor Master > Edit Sub Contractor


Page Header
Title:
Sub-Contractor Master
Subtitle:
Add/Edit subcontractor details and assignments

Form Layout
Centered form container.
Two-column grid layout.

Fields
SC Code *
Text input
Mandatory
Edit mode → NON-EDITABLE

Sub-Contractor Name *
Text input.

Contact Name
Optional.

Phone Number
Country code dropdown
Number field
Validation:
10 digits
reject repeating digits (0000000000)

Email
Email validation.

Category
Multi-select dropdown.
Display style:
Mechanical, Piping


Status *
Dropdown:
Active (default)
Inactive

Mandatory Field Rule
All mandatory labels show:
Label *

Where:
* color = RED (#FF3B30)

Footer Actions
Right aligned buttons:
Button
Style
Cancel
Secondary
Save
Primary


Cancel Behavior
If form dirty → confirmation modal:
Discard unsaved changes?


Save Logic
Validate:
Mandatory fields
Duplicate SC Code
Email format
Success:
Redirect to listing
Toast:
Sub-Contractor saved successfully.


🔒 DELETE LOGIC (Listing)
Delete action available via row action menu.

Confirmation Modal
Title:
Delete Sub-Contractor
Message:
Are you sure you want to delete this subcontractor?

Buttons:
Cancel
Delete

Blocking Rule
If subcontractor linked to active project:
Show error:
Cannot delete. Sub-Contractor is currently in use.


⚙️ GLOBAL BEHAVIOR RULES (IMPORTANT)

Side Menu Behavior
Active item → orange transparent background (#FD431426)
Smooth moving orange left indicator bar
Same behavior as project menu

Filters
Use AG-Grid filter visual style.

Toast Notifications
Position:
Top-right
Auto dismiss after 4s

Access Control
Role
Access
Admin
Full
Super User
Full
Standard
Edit allowed
Contributor
View/Edit (configurable)
Viewer
Read only


Inactive Sub-Contractor Rule
Inactive records:
Visible in listing
NOT selectable in project assignments.


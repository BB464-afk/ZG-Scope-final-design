UOM MASTER (GLOBAL SETTINGS)
OBJECTIVE
Design the UOM (Units of Measurement) Master Management Module under Global Settings, allowing users to:
View all system UOMs
Search & filter units
Import / Export UOM data
Add new UOMs
Edit existing UOMs
Maintain standardized measurement units used across projects
The module follows Zauner CMP Design System and must match existing Global Master modules visually and behaviorally.

🧭 NAVIGATION CONTEXT
Navigation Path
Global Settings
 → Master Management
   → UOM Master

Breadcrumb:
Global Settings > Master Management > UOM Master

Add/Edit screen breadcrumb:
Global Settings > Master Management > UOM Master > Add/Edit UOM


🎨 DESIGN SYSTEM (MANDATORY)
Theme Colors
Element
Value
Background
#FAFAFA
Accent Orange
#FD4314
Header BG
#E4EEF8
Borders
#C8D9EE
Header Text
#272721
Odd Rows
#F4F8FD
Selected Row
#FD431426


Mandatory UI Rules
Mandatory fields → red *
Tables follow AG Grid styling
Toast messages appear top-right
Import actions use modal popup
Buttons consistent with other master modules

🧩 SCREEN 1 — UOM LISTING

Page Header
Title:
UOM (Units of Measurement)
Subtitle:
Manage UOMs

Header Actions (Right aligned)
Buttons order:
Download Template
Export in Excel
Import from Excel
+ Add New UOM (Primary CTA)

Button Behaviors
Download Template
Downloads predefined Excel template
Show toast:
UOM Template downloaded successfully (.xlsx)


Export in Excel
Exports filtered table data
Toast:
UOM list exported successfully (.xlsx)


Import from Excel
Opens modal popup:
Import Popup
Title:
Import UOMs

Components:
Drag & Drop zone
Upload button
Supported formats label:
.xls, .xlsx, .csv
Buttons:
Cancel
Import

Import Validation
Mandatory columns:
UOM Code
UOM Name
Category
Symbol
Errors:
Invalid format
Missing mandatory fields
Duplicate UOM Code
Success:
UOM records imported successfully


Search + Filter Row
Left:
Search input
Placeholder: Search by code or name
Right:
Filter icon (AG Grid filter panel)

Filters
Category (multi-select)
Status (Active / Inactive)

📊 UOM TABLE DESIGN

Columns
Column
Description
UOM Code
Unique identifier
UOM Name
Name
Category
Area / Volume / Weight etc
Symbol
Measurement symbol
Created At
Date created
Status
Active / Inactive badge


Table Rules
Checkbox selection optional
Alternating row background
Sticky header
Pagination after 20 rows
Default sort: newest first

Status Badge
Active → Green pill
Inactive → Grey pill

Empty State
No results found

Centered illustration + text.

➕ SCREEN 2 — ADD NEW UOM

Page Header
Title:
UOM (Units of Measurement)

Subtitle:
Add/Edit New UOM


FORM LAYOUT
Two-column aligned form.

Fields
Field
Type
Mandatory
UOM Code
Text
✅
UOM Name
Text
✅
Category
Dropdown
✅
Symbol
Text
✅
Status
Dropdown
✅


Category Dropdown Values
Power
Area
Volume
Weight
Count
Time

Status Default
Active


Validation Rules
Save disabled if:
Any field empty
Duplicate UOM Code

Errors
Scenario
Message
Empty field
This field is required
Duplicate code
UOM Code already exists
Invalid format
Invalid input format


Buttons (Bottom Right)
Cancel (secondary)
Save (primary)

Cancel Behavior
If form edited:
Popup:
Unsaved changes will be lost.
Are you sure you want to cancel?

Buttons:
Stay
Discard

Save Success
Toast:
UOM created successfully

Redirect → Listing screen.

✏️ SCREEN 3 — EDIT UOM

Same layout as Add screen.

Differences
Field
Behavior
UOM Code
Disabled (non-editable)
Other fields
Editable


Save Logic
Updates:
Modified values
Updated By
Updated Date

Success Message
UOM updated successfully


⚙️ BUSINESS RULES (SYSTEM LOGIC)

Global Constraints
UOM Code must be unique
Category must belong to predefined list
Inactive UOM:
Cannot be selected in new tasks
Still visible historically

Listing Behavior
Reflect updates instantly across system
Used by Tasks + Reports modules
Sorting by latest created

🧠 UX BEHAVIOR ALIGNMENT (IMPORTANT)
This module must match:
✅ Sub-Contractor Master
✅ ROC Master
✅ User Management
✅ Project Modules
For:
spacing
hover
active states
toast placement
modal style
table filters

END OF UOM Master

LOCATION MASTER (COUNTRY)

🧭 CONTEXT
Design the Location Master → Country Management module inside Global Settings of an enterprise construction management platform.
This module manages standardized geographical master data used across projects.
Navigation path:
Global Settings
→ Master Management
→ Location Master

The UI must strictly follow the Zauner Design Theme and reuse global components already established across the app.

🎨 DESIGN SYSTEM (MANDATORY)
Theme Colors
Element
Color
Page Background
#FAFAFA
Accent
#FD4314
Header Background
#E4EEF8
Header Text
#272721
Borders
#C8D9EE
Alternate Row
#F4F8FD
Selected Row
#FD431426


Typography
Clean enterprise sans-serif
Section headers bold
Labels medium weight
Table text regular

🧱 PAGE STRUCTURE

1️⃣ HEADER AREA
Top layout:
☰ Global Settings                                Logout

Below header show breadcrumb:
Global Settings > Master Management > Location Master


2️⃣ PAGE TITLE SECTION
Left aligned:
Title
Location Master
Subtitle:
Manage countries used across projects

3️⃣ ACTION BAR (RIGHT SIDE)
Buttons aligned right in this order:
Download Template
Export in Excel
Import from Excel
+ Add Country (Primary button)

Button Behavior
Download Template
Show right-side toast:
Country Template downloaded successfully


Export in Excel
Toast:
Country list exported as .xlsx


Import from Excel
Opens Zauner standard upload modal.

📂 IMPORT POPUP (STANDARD MASTER IMPORT)
Modal Title:
Import Countries
Contents
Upload zone:
Drag & drop area
OR Browse button
Accepted formats:
.xls, .xlsx, .csv

Validation messages area below.

Buttons
Cancel (secondary)
Upload (primary orange)

Validation Rules
Show inline errors:
Missing Country Name
Missing Country Code
Duplicate Country Code
Invalid format

🔎 SEARCH + FILTER BAR
Left side:
Search input placeholder:
Search country or code...

Search supports:
Country Name
Country Code

Right of search:
Filter icon (AG-Grid style)

FILTER PANEL (AG GRID STYLE)
Slide panel/modal includes:
Status (Active / Inactive)
Created Date Range
Multiple filters allowed.

📊 COUNTRY LISTING TABLE
Use AG-Grid styled table.

Table Columns
Column
Notes
Country Name
Primary text
Country Code
Unique
Dial Code
Optional
Created At
Date
Status
Badge
Actions
Edit icon


Status Badge
Active → green pill
Inactive → grey/red pill

Table Behaviors
✅ Sticky header
✅ Pagination after threshold
✅ Alternate row background (#F4F8FD)
✅ Hover highlight
✅ Row NOT selectable via full row click

Active Row Indicator
When selected:
Transparent orange background (#FD431426)
Smooth animated orange left border indicator

➕ ADD COUNTRY SCREEN
Navigation:
Location Master > Add Country


Layout
Centered form container.

Fields
Field
Type
Mandatory
Country Name
Text
✅
Country Code
Text
✅
Dial Code
Text
Optional
Status
Dropdown
✅


Mandatory Indicator
Show red “*” beside label.
Example:
Country Name *

(* colored #FD4314)

Defaults
Status = Active

Buttons
Bottom right aligned:
Cancel (outlined)
Add (primary)

Cancel Behavior
If form dirty:
Popup:
Unsaved changes will be lost.
Are you sure you want to cancel?


✏️ EDIT COUNTRY SCREEN
Same layout as Add screen.

Differences
✅ Fields prefilled
✅ Country Code becomes:
Disabled
Non-editable
Grey background

Save Logic
Validate:
Mandatory fields filled
Unique country code rule maintained

Toast after save:
Country updated successfully

Redirect back to listing.

🔁 STATUS CHANGE LOGIC
User can toggle status.
If country linked to active states/cities:
Show error modal:
Cannot deactivate.
Country is already in use.


🧩 GLOBAL INTERACTION RULES (REUSE)
Apply globally defined behaviors:

Side Menu Behavior
Same hover/active animation as other modules
Active item background = #FD431426
Smooth moving orange left indicator

Table Filters
Follow AG Grid visual style (NOT report filters).

Toast Messages
Right side slide-in animation.

Popup Style
Rounded container
Soft shadow
Orange primary action

🧠 UX PRINCIPLES
Design must feel:
✅ Enterprise
✅ Structured
✅ Data-heavy but calm
✅ Consistent with Sub-Contractor + UOM Masters
✅ Minimal cognitive load
Avoid decorative UI.

END OF LOCATION MASTER

CLIENT MASTER MODULE (GLOBAL SETTINGS)

🧭 CONTEXT
Design the Client Master module inside Global Settings → Master Management.
The module manages global client records used during project creation and reporting.
The design must follow:
🎨 Zauner Theme
Background: #FAFAFA
Accent Orange: #FD4314
Header Background: #E4EEF8
Border: #C8D9EE
Selected Row: #FD431426
Text Primary: #272721
Mandatory indicator: Red asterisk *
Use AG Grid styling for tables.

1️⃣ CLIENT LISTING SCREEN
Navigation
Global Settings
> Master Management
> Client Master


Page Header
Title: Client Master
Subtitle: Manage Client
Right aligned action buttons:
Download Template (secondary)
Export in Excel (secondary)
Import from Excel (secondary)
Add New Client (primary button)

Top Controls
Search Bar
Placeholder: “Search”
Searches:
Client Code
Client Name
Primary Contact
Email
Country
City
Filter Icon
Opens right-side filter panel.
Filters:
Client Type
Country
Status (Active / Inactive)
Created Date Range
Multiple filters allowed.

Client Table (AG Grid Style)
Columns
Column
Notes
Client Code
Unique
Client Name
Primary label
Client Type
Tag badge
Primary Contact
Text
Email
Text
Phone
Text
Country
From Location Master
City
Dependent dropdown
Created At
Date
Status
Badge


Row Behavior
Hover → subtle blue tint
Click row → open Client Details
Selected checkbox → multi-select actions enabled
Status badges:
Active → Green pill
Inactive → Grey pill

Empty State
No clients found.


Import From Excel (Popup)
Modal:
Title: Import Clients
Upload area:
Drag & drop OR browse
Accept: .xls, .xlsx, .csv
Buttons:
Cancel
Upload
Validation messages inline.

Toast Messages (Right Side)
Export:
Client_List.xlsx exported successfully

Download Template:
Client template downloaded

Save:
Client saved successfully


2️⃣ ADD / EDIT CLIENT SCREEN
Navigation
Global Settings
> Master Management
> Client Master
> Add/Edit Client Details


Tab Layout
Top segmented tabs:
[ Client Details ]   [ Projects ]

Default: Client Details

🧩 TAB 1 — CLIENT DETAILS

SECTION 1 — BASIC INFORMATION
Two-column layout.
Fields:
Field
Rules
Client Code*
Editable only in Create
Client Type*
Dropdown
Client Name*
Text
Company Legal Name
Optional

Validation:
Unique client code
Required fields show red error

SECTION 2 — PRIMARY CONTACT
Field
Mandatory
Contact Name*
Yes
Job Role
No
Email*
Yes (email validation)
Phone
Optional

Inline error:
Invalid email address


SECTION 3 — ADDRESS
Dependent dropdown hierarchy:
Country → State → City
Field
Mandatory
Address Line 1
No
Address Line 2
No
Country*
From Location Master
State / Province*
Based on Country
City*
Based on State
Postal / Zip Code*
Yes


SECTION 4 — STATUS & NOTES
Field
Type
Status*
Active / Inactive
Notes / Remarks
Textarea

Character limit configurable.

Bottom Actions
Left:
Back (secondary)
Right:
Save (primary)

Save Logic
Validate:
Mandatory fields
Email format
Unique Client Code
Success:
Show toast
Redirect to listing
Failure:
Highlight invalid fields.

Back Behavior
If unsaved changes:
Popup:
You have unsaved changes.
Do you want to discard them?

Buttons:
Cancel
Discard

3️⃣ TAB 2 — PROJECTS (READ-ONLY)

Purpose
Display projects linked to client.

Table Columns
Column
Project ID
Project Name
Project Type


Behavior
Read-only
No editing
Clicking project → navigate to Project Dashboard (if access allowed)

4️⃣ BUSINESS RULE BEHAVIOR

Client Status Change
Inactive allowed even if projects exist.
Effect:
Client unavailable for new project creation.
Existing projects unaffected.

Delete Client
(Not available in Phase I)
Reason:
Clients linked to projects cannot be deleted.

Data Sync Rule
Client Master = Global reference.
Updates reflect instantly in:
Project creation
Reporting filters
Client dropdowns
Historical reports NOT recalculated.

5️⃣ GLOBAL DESIGN RULES (APPLY)
Mandatory Fields
Red *
Red validation text

Tables
AG Grid styling
Sticky header
Alternating rows
Checkbox selection
Smooth hover

Buttons
Primary:
Orange #FD4314
Secondary:
Outline grey

Navigation Consistency
Active menu item:
Background: #FD431426
Smooth moving orange left indicator bar.

END OF CLIENT MASTER


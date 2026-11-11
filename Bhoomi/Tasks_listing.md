Use this as one modular prompt after Project Listing is already built.

1️⃣ CONTEXT SWITCH (CRITICAL — DO NOT SKIP)
When user clicks a project row in My Projects listing:
Navigation Behavior
Route user to:
Project → All Tasks

System enters PROJECT MODE.
This changes:
✅ Sidebar navigation
✅ Breadcrumb structure
✅ Context header
❌ Global Settings visibility

2️⃣ PROJECT MODE SIDEBAR (REPLACE GLOBAL MENU)
Replace entire sidebar with:

HOME
All Projects
Project Dashboard

TASKS WIZARD
All Tasks ✅ (ACTIVE)
Progress Updates
Approvals

REPORTING
All Reports

SETTINGS
Project Configurations
Project Users
Project Settings
My Profile
Close Project

Bottom Fixed Section (IMPORTANT)
At bottom of sidebar:
[ small project logo ]  
North Terminal Expansion

Rules:
subtle divider above
smaller typography
always visible
indicates active project context

3️⃣ PAGE HEADER (PROJECT CONTEXT)
Top left title:
All Tasks

Subtitle:
Manage and track all construction tasks
Top right:
Download Template
Export Tasks
Import from Excel
+ Create Tasks (Primary)

4️⃣ FILTER BAR (PROJECT-SCOPED FILTERS)
Below search.
Full-width filter container.
Filters (exact order)
Field
Type
Activity
Dropdown (ROC IDs)
Phase
Dropdown
Discipline
Dropdown
Trade Package
Dropdown
Sub-Contractor
Dropdown
Delivery Package
Dropdown
Area
Dropdown

Right side:
Apply Filter button
Reset Filter (text link)

Style Rules
Use:
header background token (#E4EEF8)
subtle container card
aligned grid spacing

5️⃣ TASK LISTING TABLE (AG GRID — PROJECT STANDARD)
Apply global table theme:
Token
Value
Header BG
#E4EEF8
Odd rows
#F4F8FD
Selected
#FD431426
Border
#C8D9EE
Accent
#FD4314


Columns (Exact)
☐
Task ID
Task Name
Activity
Phase
Discipline
Trade Package
Subcontractor
% Work Complete
Status
Actions
(Update Button Column)


6️⃣ COLUMN BEHAVIOR
Activity
Display:
FO 21 – Process/Chilled Water Distribution

(two-line allowed)

Phase
Use soft pill badge.
Example:
Fit-Out
Commissioning


% Work Complete
Render as:
progress bar + percentage text

Rules:
neutral grey track
dark fill
animated on update

Status Pills
Status
Style
Not Started
light grey
In Progress
blue tint
On Hold
amber
Completed
green
Void
muted


Actions Column
Icons:
👁 View
✏ Edit
🕒 History
Rightmost button:
Update Progress

Primary grey button.

7️⃣ TABLE INTERACTION RULES
✅ Sticky header
✅ Column sorting
✅ Row selection checkbox
✅ Pagination footer
✅ Hover highlight
✅ Column resize enabled

8️⃣ BREADCRUMB (PROJECT MODE)
All Projects > North Terminal Expansion > All Tasks


9️⃣ GOVERNANCE RULES (VERY IMPORTANT)
Data Scope
All Tasks MUST:
belong to selected project
inherit project masters:
ROC
Discipline
Trade Package
Users
No global data visible here.

Permissions
Role
Ability
Viewer
View only
Contributor
Update progress
Admin
Edit tasks
Super Admin
Full control


🔟 VISUAL DIFFERENCE FROM GLOBAL MODULES
Project mode introduces:
Global
Project
Orange = system actions
Orange = task creation
Settings heavy
Execution focused
Masters
Operational workflows


11️⃣ FIGMA MAKE SAFETY CONSTRAINTS
Add at end of prompt:
Do not redesign layout shell.
Do not modify global theme tokens.
Do not change sidebar hierarchy.
Use existing AG Grid table styling.
Maintain spacing and typography scale from Discipline Master.



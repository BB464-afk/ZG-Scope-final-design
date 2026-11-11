PROJECT USERS MODULE — MASTER DESIGN & FUNCTIONAL PROMPT
1️⃣ MODULE OVERVIEW
Purpose
The Project Users module allows authorized users (Admin / Super Admin) to:
View all users assigned to the selected project
Add one or multiple existing system users into the project
Revoke project access
Manage project-level participation (NOT system-level accounts)
⚠️ Important Governance Rule:
Project Users are references to System Users — not independently created users.

2️⃣ NAVIGATION CONTEXT
Entry Flow
Project Listing
→ Select Project
→ Project Context Activated
→ Side Menu switches to Project Navigation
→ Settings
→ Project Users


Breadcrumb
Project Settings > Project Users


Page Header
Title:
Project Users
Subtitle:
Manage Users in the Project

3️⃣ ACCESS GOVERNANCE
Role
Permissions
Super Admin
Full access
Project Admin
Add / Remove users
Contributor
View only
Viewer
View only


Restrictions
❌ Cannot create new users here
❌ Cannot edit user profile
❌ Cannot change system roles
✅ Only assign/remove project access

4️⃣ PAGE LAYOUT STRUCTURE
Top Header (Project Context)
Breadcrumb
Page Title + CTA
Search + Filters
AG Grid Table
Bulk Actions
Modals


5️⃣ PRIMARY ACTIONS (HEADER RIGHT)
Button
+ Add User to Project

Style:
Primary button
Accent color #FD4314
Icon: user-plus

6️⃣ SEARCH & FILTER BAR
Components
Component
Behavior
Search
Name / Email / Company
Filter icon
Opens advanced filters


Search Behavior
Live filtering across:
Name
Email
Company
Role

7️⃣ PROJECT USERS TABLE (AG GRID)
Theme Rules (MANDATORY)
Element
Color
Header BG
#E4EEF8
Header Text
#272721
Odd Rows
#F4F8FD
Selected Row
#FD431426
Border
#C8D9EE


Columns
Column
Description
Checkbox
Bulk selection
Code
User Code
Name
Full Name
Base Role
System Role
Email
Email
Phone
Contact
Company
Organization
Status
Active/Inactive


Table Behavior
✅ Sticky header
✅ Column resize
✅ Sorting
✅ Pagination
✅ Row selection

8️⃣ BULK ACTION — REVOKE ACCESS
Appears when ≥1 user selected.
Button
Revoke Access

Style:
Secondary danger action

9️⃣ REMOVE USER ACCESS FLOW
Trigger
Select users
Click Revoke Access

Confirmation Modal
Title
Remove User Access

Message
Are you sure you want to revoke access for the selected user from this project?

Note: This action will remove their permissions immediately.

Buttons:
Button
Action
Cancel
Close modal
Confirm
Remove access


System Behavior
✅ Removes project-user mapping
✅ DOES NOT delete system account
✅ Immediate permission removal

🔟 ADD USER TO PROJECT FLOW

Modal Opens
Large modal overlay.
Title
Add user to project


Data Source
Users fetched from:
System → User Management Module

Exclude:
Users already assigned to project

Modal Layout
Search
Selectable AG Grid
Footer Actions


Columns
Column
Description
Checkbox
Multi-select
Code
User ID
Name
User Name
Email
Email
Company
Organization
Role
Default project role
Status
Active


Role Column Behavior
Editable dropdown:
Viewer
Contributor
Admin
(Default = Viewer)

Selection Behavior
✔ Multi-select allowed
✔ Batch addition supported

Footer Actions
Button
Action
Cancel
Close modal
Add User to Project
Assign users


System Logic (IMPORTANT)
On confirmation:
Create ProjectUserMapping:
(ProjectID + UserID + ProjectRole)


After Success
Modal closes
Table refreshes
Toast:
Users successfully added to project


1️⃣1️⃣ DATA MODEL (LOGICAL)
System Users (existing)
UserID
Name
Email
Company
BaseRole
Status


Project Users Mapping
ProjectUserID
ProjectID
UserID
ProjectRole
AddedBy
AddedDate
Status


1️⃣2️⃣ EDGE CASES
Case
Behavior
User already added
Hidden from add modal
Inactive user
Disabled selection
No users available
Empty state message


1️⃣3️⃣ EMPTY STATE
If no users:
No users assigned to this project yet.
Click "Add User to Project" to begin.


1️⃣4️⃣ PERFORMANCE RULES
Server-side pagination
Lazy loading
Search debounced (300ms)

1️⃣5️⃣ UI CONSISTENCY RULES
Must match:
✅ Discipline Master
✅ ROC Module
✅ Tasks
✅ Reports
✅ Global Tables

Table Rules
Same row height
Same checkbox style
Same hover interaction
Same typography scale

1️⃣6️⃣ NAVIGATION BEHAVIOR
User remains in Project Context.
Side Menu stays:
Home
Tasks Wizard
Reporting
Settings
  → Project Users (active)


1️⃣7️⃣ SUCCESS FEEDBACK
Action
Message
Add users
Users added successfully
Remove users
Access revoked successfully


1️⃣8️⃣ SECURITY PRINCIPLES
✅ Access enforced backend-side
✅ UI visibility ≠ permission grant
✅ Role validation per API

1️⃣9️⃣ UX PRINCIPLES APPLIED
Bulk-first enterprise workflow
Minimal clicks
Non-destructive operations
Clear ownership boundaries
Separation of System vs Project identity

✅ FINAL USER JOURNEY
Open Project
→ Project Users
→ View assigned users
→ Add User to Project
→ Select multiple users
→ Assign roles
→ Confirm
→ Users appear instantly

OR

Select users
→ Revoke Access
→ Confirm
→ Removed from project



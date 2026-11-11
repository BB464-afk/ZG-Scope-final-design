PROJECT SETTINGS — PROJECT STATE MANAGEMENT
MODULE: PROJECT STATE CONTROL, TRANSITIONS & SYSTEM-WIDE ENFORCEMENT
1. Scope
This module governs:
Project lifecycle states and transitions
System-wide enforcement of read-only behavior
Automatic handling of dependent entities during state changes
Unified permission control across all modules
Data integrity and audit consistency during lifecycle transitions
This module ensures:
A single source of truth for project state, with deterministic behavior across all modules.
2. Actors
Actor
Description
Super Admin
Can change project status
Project Admin
Can change project status
System
Enforces state rules, transitions, auto-actions, audit

3. Project States
State
Description
Active
Fully operational project
On Hold
Temporarily paused
Completed
Work finished, execution stopped
Archived
Irrelevant moving forward.

4. State Transition Rules
Allowed Transitions
From
To
Active
On Hold / Completed / Archived
On Hold
Active / Archived / completed
Completed
Archived / Active / On Hold
Archived
Active / On Hold / Completed

5. Project Status Change Logic
5.1 Change → On Hold / Completed / Archived
Validation Checks
System must evaluate:
Pending Access Requests exist?
Pending Progress Submissions (In Review) exist?
Draft Progress exists?
Incomplete Tasks exist?
User Confirmation Messages
Case A — Pending Access Requests
There are pending access requests.
These will be automatically rejected if you continue.

Additionally, the project will become read-only and no further actions will be allowed.

Do you want to continue?
Case B — Incomplete Tasks
This project has incomplete tasks.
Changing the status will stop further progress.

Additionally, the project will become read-only and no further actions will be allowed.

Do you want to continue?
Case C — Both
This project has:
• Pending access requests (these will be automatically rejected)
• Incomplete tasks

Additionally, the project will become read-only and no further actions will be allowed.

Do you want to continue?
5.2 System Actions on Confirm
Upon confirmation:
A) Access Requests
All pending access requests → Auto Rejected

B) Progress Submissions 
All submissions in In Review → Auto Rejected
Mark reason:
"Rejected due to project state change"
C) Draft Progress
ALL draft progress → Auto Deleted
No recovery
No carry forward
D) Task Updates
All task updates → Blocked
E) System Lock
Entire project → Read-only mode
5.3 Change → Active
Prompt:
Do you want to activate this project?
On confirm:
Restore all permitted actions
No restoration of deleted drafts
System continues from latest approved state



6. Global Read-Only Behavior
6.1 Read-only Banner (MANDATORY)
When state ≠ Active:
This project is currently in {STATE}.
All actions are disabled. You can only view data.
Must appear on:
All major screens
Sticky top banner
6.2 UI Behavior Rules 
Behavior
Rule
View
Always allowed
Edit/Create/Delete
Disabled (NOT hidden)
Navigation
Allowed
Export/Download
Allowed

7. MODULE-WISE PERMISSION MATRIX (FINALIZED)
(All non-active states behave IDENTICALLY)
7.1 Tasks Module
Action
Active
Non-Active
View Listing
✔
✔
Create
✔
❌
Edit
✔
❌
View Detail
✔
✔
Attachments View/Download
✔
✔
Attachments Add/Delete
✔
❌
Discussion View
✔
✔
Discussion Post / reply
✔
❌
Version History View
✔
✔
Version History - Upload files
✔
❌
Lock Submissions
✔
❌
Bulk Progress Update
✔
❌
Import
✔
❌
Export
✔
✔
AG Grid Actions
✔
✔

7.2 Approvals Module
Action
Active
Non-Active
View
✔
✔
Approve/Reject/Revert
✔
❌
Reporting Cycle Actions
✔
❌

7.3 Project Access Approval
Action
Active
Non-Active
View
✔
✔
Approve/Reject
✔
❌

7.4 Reports
Action
Active
Non-Active
View Saved Reports
✔
✔
Download
✔
✔
Generate
✔
❌
Create Client View
✔
❌
Delete
❌
❌

7.5 Project Details
Action
Active
Non-Active
View
✔
✔
Edit
✔
❌
Change Status
✔
✔

7.6 Project Scope
Action
Active
Non-Active
View
✔
✔
Add/Edit/Delete
✔
❌

7.7 Coding Dimensions
Action
Active
Non-Active
View
✔
✔
Add/Edit
✔
❌
Import
✔
❌
Export
✔
✔
Status Change
✔
❌

7.8 Project ROC
Action
Active
Non-Active
View
✔
✔
Add/Edit
✔
❌
Import
✔
❌
Export
✔
✔

7.9 Project Users
Action
Active
Non-Active
View
✔
✔
Assign Users
✔
❌

8. Backend Enforcement Rules 
UI disabling is NOT sufficient.
System must enforce at API level:
Reject all write APIs when state ≠ Active
Exception:
Status change API
Export/download APIs
Error:
No actions allowed in {STATE} state.
9. Data Integrity Rules
No deletion of core data (tasks, reports, history)
Only:
Drafts deleted
Pending approvals rejected
Historical data remains intact
10. Audit Logging
Log:
Project status change
Auto rejection of:
access requests
submissions
Draft deletion
User performing action
Timestamp
Previous state → New state
11. Acceptance Criteria
State transitions validated correctly
All warnings shown properly
Pending requests auto-rejected
Pending submissions auto-rejected
Drafts deleted
System becomes read-only
Banner visible everywhere
API-level enforcement working
No data corruption
Reports accessible
12. API Contracts (Derived)
PUT /projects/{id}/status
Middleware:
check project state before write APIs
Auto-handlers:
reject pending approvals
reject submissions
delete drafts
13. Out of Scope
Custom workflows per state
Partial module-level overrides
Undo state transition
Recover deleted drafts

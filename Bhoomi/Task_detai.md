TASK DETAILS MODULE (ENTERPRISE CONSTRUCTION SYSTEM)

🎯 OBJECTIVE
Design a Task Details module for an enterprise construction project management web application.
This screen provides task-level reporting, progress tracking, evidence management, discussions, version tracking, and audit visibility.
The design must:
Follow existing application layout and visual system
Match enterprise SaaS tools (Procore, Primavera P6 Web, SAP Fiori)
Support dense operational workflows
Be optimized for clarity, auditability, and reporting accuracy
Handle read-heavy and data-heavy usage

🎨 DESIGN STYLE
Visual Language
Enterprise SaaS UI
Neutral grey workspace background
White content containers/cards
Minimal shadows
Thin separators instead of heavy borders
Compact spacing
Professional tone (NO playful UI)
Typography
Inter / similar enterprise sans-serif
Clear hierarchy:
Page Title → 20–22px
Section Headers → 16px semibold
Labels → 12–13px muted
Values → 14px regular
Density
Optimized for analysts & project engineers
High information visibility
Avoid excessive whitespace

🧱 GLOBAL PAGE STRUCTURE
TOP NAV BAR (UNCHANGED SYSTEM PATTERN)
Left:
Hamburger menu
Page title: Task Details
Right:
Logout button (only item aligned far right)

BREADCRUMB
Task Listing > Task Details

Sticky under top bar.

🧭 TAB NAVIGATION (PRIMARY CONTENT SWITCHER)
Horizontal tab system.
Tabs:
Task Report
Attachment & Evidences
Discussion Panel
Sub-Tasks
Version History
Audit Log
Behavior
Active tab = subtle grey background highlight
No underline animation
Tabs remain visible during scroll

🟦 TAB 1 — TASK REPORT (PRIMARY SCREEN)

LAYOUT STRUCTURE
Two-column layout:
LEFT (70%) → Task Information + Progress + ROC Table
RIGHT (30%) → Summary & Metrics Sidebar


🧩 TASK HEADER SECTION
Left
Task Name (Large Title)
Status pill beside title
Example:
PCW Distribution – B1 – T1 – R1.1.1   [Completed]

Below → Key metadata grid (READ-ONLY)
Fields:
Phase
Discipline
Trade Package
Delivery Package
Area
Building
SPA
Cost Type
Display style:
Label (muted)
Value (strong)
Tag/chip for categorical fields

Right Header Actions
Buttons:
Update Progress (Primary)
Edit Task (Secondary)
Rules:
If task = Completed → buttons disabled + tooltip:
"Completed tasks are view-only."

📊 PROGRESS OVERVIEW CARD
Large card containing summary metrics.
Top Row
Completion %
Status badge
Metrics Grid (2 rows × 3 columns)
Row 1:
Earned Cost
Installed Quantity
Earned Hours
Row 2:
Budgeted Cost
Total Quantity
Budgeted Man-hours
Values formatted with suffix rules:
Currency → EUR
Quantity → show UOM
Hours → h

🧱 ROC-LEVEL PROGRESS BREAKDOWN
Enterprise AG-Grid style table.
Columns:
Expand icon
Step Name
Step Weightage
Measurement Type
Total Quantity
Installed Quantity
% Work Complete (progress bar)
Behavior
Row hover highlight
Compact progress bars
Sticky header
Calculated values auto-derived
Calculation Logic (SYSTEM RULE)
Progress % =
Σ (Step % Complete × Step Weightage)

Earned Hours =
Progress % × Budgeted Hours

Earned Value =
Progress % × Budgeted Cost


🟨 RIGHT SIDEBAR — KEY REPORT SUMMARY
Stacked cards.

Card 1 — Report Summary
Fields:
Reporter
Role
Sub-Contractor
Read-only.

Card 2 — Budget Hours & Cost
Non-editable:
Estimated Budget Hours
Estimated Budget Cost
Current Budget Hours
Current Budget Cost
Earned Hours
Earned Value
Remaining Hours
Remaining Value
Editable:
Approved Changes (Cost)
Approved Hours
Editable fields show subtle input styling.

Card 3 — Planning
Read-only:
Baseline Start
Baseline Finish
Total Quantity to Install

Card 4 — Actual
Editable:
Actual Start (Date Picker)
Actual Finish (Date Picker)
Read-only:
Quantity Installed (auto-calculated)

🟪 TAB 2 — ATTACHMENT & EVIDENCES

SECTION 1 — Attachments / Drawings
Button:
Add Attachments

List item design:
File icon
File name
Download action (right aligned)
Clicking URL attachment → opens Autodesk Construction Cloud.

ADD ATTACHMENT MODAL
Options:
Option A — Enter URL
Input with link icon.
OR Divider
Option B — Upload File
Drag & drop zone.
Supported formats:
.pdf .xlsx .jpg .jpeg .png .docx .heic

Buttons:
Upload (primary)
Cancel

SECTION 2 — Progress Evidence
Read-only list.
Each item shows:
File icon
File name
Step tag (chip)
Download action
Source:
→ Uploaded via Update Progress flow.

🟩 TAB 3 — DISCUSSION PANEL

Comment Layout
Threaded discussion.
Each comment contains:
Avatar
Username
Timestamp
Comment text
Reply button
Replies appear nested ONE level only.
(No reply-to-reply allowed.)

ADD COMMENT BUTTON
Opens modal:
Fields:
Comment text (max 1000 chars)
Optional image upload
Validation:
Empty → error
Too long → warning message
Success toast:
Your comment has been added.


Pagination
After ~20 comments:
Show more discussion (X)

End state:
No more comments


🟦 TAB 4 — SUB-TASKS
(Read-only placeholder following tab pattern.)
Display:
Sub-task listing table
Compact enterprise rows.

🟫 TAB 5 — VERSION HISTORY
Timeline-style layout.
Each version card shows:
Version Status
Description
Submitted By
Reviewed By
Submitted Date
Approved Date
Progress bar snapshot
“View Version” action
Statuses:
Approved
Submitted
Superseded
Rejected
Draft Saved

REVERT VERSION MODAL
Title:
Confirm Revert

Message:
Reverting this version will restore the previous version and cannot be undone.
Buttons:
Cancel
Revert Version (Primary)

🟥 TAB 6 — AUDIT LOG
Vertical timeline.
Each entry:
Icon
Action title
User
Timestamp
Metadata
View Version link
Designed for compliance tracking.

⚙️ GLOBAL SYSTEM RULES

EDITABILITY PRIORITY
If wireframe shows non-editable:
→ MUST remain non-editable even if FRD says editable.

COMPLETED TASK MODE
When task status = Completed:
Task Report → view-only
Attachments → view-only
Evidence → view-only
Discussion → STILL ACTIVE
Buttons disabled

INTERACTION CONSISTENCY
Hover highlight rows
Minimal animations
No layout shift during edits
Enterprise keyboard usability

ICON SYSTEM
Use meaningful icons:
📊 metrics
📎 attachments
💬 discussion
🕓 history
🧾 audit
📅 dates
👤 users
Icons must improve scanability — not decoration.

PERFORMANCE CONSIDERATIONS
Design must assume:
Large datasets
Frequent updates
Engineers scanning quickly
Avoid:
Deep nesting
Floating panels
Overlays blocking workflow

EXPECTED OUTPUT
Produce a complete enterprise Task Details module that:
Matches existing All Tasks ecosystem
Supports reporting & auditing workflows
Feels production-ready
Requires minimal redesign before dev handoff

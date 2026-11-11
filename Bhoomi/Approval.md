Figma Make Prompt — Approval Workflow Redesign (Progress Updates Module)
Goal
Redesign the Approval Workflow based on provided wireframes.
The workflow consists of three connected states:
Approval Listing (AG Grid compatible)
Grouped Approval View
Review Version Screen
Maintain existing product theme, typography, and styling.
Focus on structure, workflow clarity, and AG Grid compatibility.

PART 1 — Approval Listing (Default View)
(Based on Wireframe Image 1)
Page Title
Progress Updates
Section Title:
Approval Queue
Subtitle:
X submissions pending review

Toolbar (Top Controls)
Left to Right:
Global search input
Placeholder:
"Search by task, submitter, or summary..."
Lock Button
Unlock Button
Sort By dropdown
Group By dropdown
Right aligned:
Approve All button

Lock / Unlock Behavior (SYSTEM RULE)
Lock Enabled
When Lock is active:
No new progress submissions are considered for approval queue.
System freezes approval dataset snapshot.
If any user submits progress while locked:
Show system message:
"Progress updates are currently locked for all tasks. Your update has been saved as a draft and will be considered once unlocked."
Submission status = Draft.

Unlock Enabled
New submissions enter approval queue normally.
Draft submissions become eligible for review.

Listing Table (AG Grid Compatible)
Columns:
Select Checkbox
Task
Version
Progress
Submitted By
Submitted At
Aging
Action (Review)
Requirements:
Sticky headers
Sort icons
Column filters compatible with AG Grid
Row selection enabled
Action column:
Review button/icon.

PART 2 — Grouped Structured View
(Based on Wireframe Image 2)
Triggered when:
Group By = Sub-Contractors (or other grouping).

Group Layout
Each group renders as:
Group Header:
Sub-Contractor Name
Right side:
Approve All (for that group only)
Below:
AG Grid table filtered to that group.

Behavior
Groups expandable/collapsible.
Each group maintains independent selections.
Approve All applies only to visible group rows.

Visual Rules
Group headers visually distinct but minimal.
Maintain table consistency with listing view.
No redesign of row styling.

PART 3 — Review Version Screen
(Based on Wireframe Image 3)
Opened when user clicks Review.

Header Section
Back navigation arrow.
Title:
Review Version {Number}
Status Tags:
In Review
Aging indicator (e.g., 8 days aging)
Lock Status (Locked / Unlocked)
Right side actions:
Reject
Approve

Submission Metadata Row
Display inline:
Submitted By
Submitted At
Overall Progress Change

Step-by-Step Review Table
Columns:
Step
Description
Previous Qty
New Qty
Change Qty
Previous Progress %
New Progress %
Evidence
Evidence column:
File links with download icons.
Table must remain AG Grid compatible.

Bottom Section Layout (Two Columns)
Left — Earned Value Calculation
Fields:
Earned Quantity
Earned Hours
Earned Cost
Total Progress to Claim %
Read-only values.

Right — Review Comment
Large textarea:
Add your review comments...

Footer Actions
Left:
Cancel
Right:
Reject
Approve (Primary)

WORKFLOW STATE LOGIC
States
Draft → Submitted → Locked Snapshot → Review → Approved / Rejected

Lock Interaction Model
Lock applies globally to approval cycle.
When Locked:
Approval queue frozen.
New submissions saved as Draft.
Drafts NOT visible in approval queue.
When Unlocked:
Drafts automatically enter queue.
Aging timer begins.

UX EXPECTATION
The workflow must support:
Batch approvals
Structured contractor review
Detailed step validation
Controlled approval cycles
while remaining compatible with AG Grid interaction patterns.
No additional visual redesign beyond defined structure.


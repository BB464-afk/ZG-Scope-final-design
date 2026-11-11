1. MODULE CONTEXT
Navigation Flow
Project Listing
→ Select Project
→ Project Context Opens
→ Side Navigation switches to Project Menu
→ Reporting
→ All Reports

Reports module exists inside a selected project context.
All reports are project-scoped.

2. PRIMARY OBJECTIVE (Governance Definition)
The reporting module must allow users to:
Generate performance reports based on:
Manhours
Costs
Quantities
Analyse performance across predefined hierarchy levels:
Area
Discipline
Trade Package
Subcontractor
SPA
ROC
(Configured dimensions only — NOT user defined)
Store period snapshots representing project status at a specific time.
Create:
System Reports (locked calculation snapshot)
Client View Reports (editable presentation copy)

3. REPORT TYPES (TAB STRUCTURE)
Top navigation tabs:
[ Manhours Reports ] [ Cost ] [ Quantity Report ] [ Saved Reports ]

Behaviour
Tabs switch report configuration context.
Filters persist when switching tabs (if compatible).
Each tab uses same layout pattern.

4. REPORT GENERATION PANEL
Located at top of page.
Mandatory Inputs
Field
Type
Rules
Start Date
Date Picker
Required
End Date
Date Picker
Required
Quick Filters
Buttons
Last Month / This Month
Group By
Dropdown
Predefined only
Generate Report
CTA
Disabled until valid


Reporting Date Logic (CRITICAL RULE)
Reports MUST use:
✅ Progress Period Start Date
✅ Progress Period End Date
NOT:
Entry date
Approval date
Baseline schedule date
All earned calculations derive ONLY from progress period.

5. AFTER CLICKING “GENERATE REPORT”
System performs:
Fetch approved progress records within period.
Calculate Earned Values.
Group tasks by selected dimension.
Build hierarchical dataset.
Render report.

6. REPORT PAGE STRUCTURE

SECTION A — KPI SUMMARY CARDS
Displayed immediately after generation.
Example (Manhours)
Card
Logic
Total Budget Manhours
Sum Original Budget
Earned Manhours (To Date)
Σ Earned Hours
SPI (To Date)
EV / PV
CPI (To Date)
EV / AC (future-ready)


Quantity Cards
Total Quantity
Installed To Date
To Go
Overall Progress %

Cost Cards
Same structure as Manhours but cost-based.

Card Style (Theme)
Background: #FAFAFA
Border: #C8D9EE
Accent Icons: #FD4314

7. REPORT TABLE STRUCTURE (AG GRID)
MUST USE:
AG Grid Enterprise patterns
Expandable hierarchy rows
Virtualized rendering

Row Hierarchy Logic
Default View:
Area Level (Expanded icon)

On expand:
Area
  → Child Groups / Tasks

Rules:
Only top-level visible initially.
Expand reveals child rows.
Child rows inherit grouping dimension.

8. MANHOURS REPORT STRUCTURE

A. Budget Summary Columns
Column
Formula
Area / Group
Selected grouping
Weighting %
GroupBudget / TotalBudget
Original Budget
Σ Budgeted Manhours
Approved Changes
Σ Variations
Current Budget
Original + Approved


B. Period Summary
Column
Formula
% Earned
EarnedHours_period / OriginalBudget
Earned Hours
Σ EarnedHours
Actual Hours
Placeholder
SPI
EarnedHours / PlannedHours
CPI
EV / AC (future)


Earned Value Logic
EarnedHours =
%WorkComplete × OriginalBudget

PlannedHours =
Planned% × OriginalBudget


C. To-Date Summary
Column
Formula
% Earned
Earned_ToDate / OriginalBudget
Earned Hours
Σ Earned
To-Go Hours
Budget − Earned
SPI
Earned_ToDate / Planned_ToDate


9. COST REPORT LOGIC
Same structure as Manhours.
Replace:
Hours → Cost

Key formulas:
EarnedCost = %WorkComplete × BudgetCost

SPI = EarnedCost / PlannedCost

CPI enabled when actual costs exist.

10. QUANTITY REPORT STRUCTURE

Item Details
Column
Logic
Area
Grouped
UOM
Task UOM
Total Quantity
Σ Quantity


Period Summary
Installed (Period)
= Logs within date range

% Period =
InstalledPeriod / TotalQty


To-Date Summary
InstalledToDate = Σ Installed
ToGo = TotalQty − InstalledToDate
%Complete = InstalledToDate / TotalQty


11. USER ACTIONS (POST GENERATION)
Buttons:
[ Download ]
[ Save to System ]


Download Modal
Fields:
Report Name
Format:
PDF
Excel
CSV
Read-only:
Report Type
Period

Save to System (SNAPSHOT)
Critical Governance Rule
Saving creates:
✅ Immutable Snapshot
Stored data:
Calculated values
Period
Grouping
KPI values
Table dataset
Snapshot DOES NOT UPDATE later.

12. SAVED REPORTS TAB
Table Columns:
Column
Snapshot Name
Report Type
Period Covered
Created By
Created Date
Saved As (System / Client)
Actions

Actions:
View
Delete

13. SYSTEM REPORT VIEW
Characteristics:
Read-only.
Exact historical state.
Banner:
Snapshot – Data Frozen for Period

Buttons:
Create Client View
Download


14. CLIENT VIEW REPORT (Editable Layer)
Created ONLY from System Report.
Behaviour
System duplicates snapshot → editable copy.
Editable fields:
Installed values
Percentages
Earned presentation numbers
Restrictions:
❌ No recalculation
❌ No backend data update
❌ No progress modification
Purpose:
Presentation-only adjustments.

UI Indicator
Top banner:
Inline edit mode — Client presentation version


15. SAVE CLIENT VIEW
Modal:
Report Name
Save button
Creates:
Client Report Snapshot

Linked to original system report.

16. SNAPSHOT GOVERNANCE RULES (VERY IMPORTANT)
Scenario
Result
Progress updated later
Snapshot unchanged
Report regenerated
Uses latest data
Client edits
Visual only
Delete snapshot
Confirmation required


17. DELETE CONFIRMATION MODAL
Are you sure you want to delete this saved report?

Buttons:
Cancel
Delete

18. TABLE DESIGN SYSTEM (MANDATORY)
Apply Zauner Theme:
Element
Color
Header BG
#E4EEF8
Header Text
#272721
Border
#C8D9EE
Odd Rows
#F4F8FD
Selected
#FD431426
Accent
#FD4314


AG Grid rules:
Sticky headers
Expandable groups
Column resize
Horizontal virtualization
Persisted column state

19. PERFORMANCE REQUIREMENTS
Must support:
20k–30k task aggregation
Instant grouping recalculation
Lazy rendering

20. UX PRINCIPLES
Design must feel:
✅ Analytical
✅ Audit-ready
✅ Financial-grade
✅ Snapshot-oriented
✅ Non-editable by default
Avoid:
Spreadsheet feel
Over-editability
Dynamic recalculation confusion


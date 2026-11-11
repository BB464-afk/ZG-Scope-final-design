Project Configuration Experience (Enterprise Construction Platform)

OBJECTIVE
Design a Project Configuration System for a construction general contractor managing large-scale projects (e.g., Google Data Center).
The experience must feel like:
An Enterprise Project Initialization Engine, not a form wizard.
The flow guides users through defining:
Project Identity
Data Structure (Coding Dimensions)
Execution Planning
Progress Measurement (ROC Logic)
The UI must prioritize clarity, hierarchy, and operational confidence.

DESIGN PRINCIPLES
Enterprise-grade clarity
Guided workflow, not static tabs
Progressive disclosure of complexity
Construction-domain mental model
Validation-driven configuration
Minimal cognitive overload

THEME & DESIGN TOKENS
Primary Colors
Primary Action:
#FD4314 (Orange — decisions & progression)
Structural Background:
#E4EEFE (Soft blue containers)
Primary Text:
#272721
Neutral Background:
#FFFFFF
Divider:
rgba(39,39,33,0.08)
Hover State:
Light Orange Tint

Typography
Font: Inter / system sans-serif
Hierarchy:
Page Title: 28px SemiBold
Section Title: 18px Medium
Label: 13px Medium
Body: 14px Regular
Metadata: 12px Muted

Spacing System
8px grid system.
Primary spacing units:
8 / 16 / 24 / 32 / 48

GLOBAL LAYOUT
Application Shell
Left:
Collapsible Side Navigation
Top:
System Header
Center:
Configuration Workspace

Side Navigation
Expanded:
Large logo (3× scale)
Menu labels visible
Collapsed:
Icons only
Tooltip on hover
Logout:
Fixed at bottom
Visually separated section

System Header
Left:
☰ Menu Icon
Page Context Title
Right:
User Avatar → Profile Dialog
Profile dialog includes:
User image
Name
Email
Role: Super Administrator
Logout button

PROJECT CONFIGURATION FLOW
Replace tab navigation with:
Horizontal Progress Rail
Display steps:
● Project Setup
● Coding Structure
● Execution Planning
● Progress Measurement
Each step shows state:
Complete ✔
Needs Attention ⚠
Locked 🔒

STEP 1 — PROJECT SETUP (IDENTITY LAYER)
Layout
Two-column grid + right validation panel.

Section A — Project Identity
Fields:
System Project ID (read-only badge)
Client Project Code* (editable in Draft only)
Project Name*
Client Name* (searchable dropdown)
Upload Logo (.jpg/.png/.jpeg/.heic/.svg)

Section B — Operational Settings
Group together:
Country*
City / Region
Timezone*
Currency*

Section C — Schedule
Start Date*
Planned Finish Date*
Show timeline visualization preview.

Section D — Additional
Project Status
Additional Notes
Created By / Created On (auto)

Right Panel — Configuration Readiness
Checklist:
✔ Identity Defined
✔ Timezone Selected
⚠ Missing Optional Fields
Shows readiness confidence.

STEP 2 — CODING STRUCTURE (DATA ARCHITECTURE)
Layout
LEFT: Coding Dimensions List
RIGHT: Dimension Value Manager

Dimension List
Each dimension shows:
Name
Status indicator
Value count
Example:
Area — ✔ Configured (12 values)
Work Package — ⚠ Empty

Value Manager Table
Columns:
Code | Name | Status
Features:
Add value
Import Excel
Export Template
Inline editing
Validation:
Minimum 1 dimension with 1 active value required.

STEP 3 — EXECUTION PLANNING (PHASES)
Transform into hierarchical builder.

Execution Tree
Display:
Phase
└ Discipline
└ Trade Package
└ Subcontractor
Expandable nodes.

Phase Builder Flow
User performs:
Create Phase
Select Discipline
Select Trade Packages
Assign Subcontractors

Empty State
Centered message:
Execution planning defines who performs work.
Create First Phase

Completeness Indicators
Each phase displays:
Discipline ✔
Trade Package ✔
Subcontractor ⚠ Missing

STEP 4 — PROGRESS MEASUREMENT (ROC ENGINE)
Rename conceptual layer internally as:
Progress Measurement Designer

Layout
LEFT PANEL:
Master ROC Library
RIGHT PANEL:
Project Overrides Editor

ROC Table
Columns:
ROC ID
Activity Name
UOM
Steps
Weightages
Total %

Editing Modes
Buttons:
Inline Edit
Export Selected Data
Import Updated Data

Override Indicator
When modified:
Derived from Master ROC
(Project Override Active)

Step Editor
Each step card includes:
Step Name
Weight %
Measurement Type
Sub-steps
Validation:
Total Weight = 100%.

Validation Bar (Top)
Displays:
Total Weight ✔
Measurement Valid ✔
Activities Ready ✔

GLOBAL FOOTER (ALL STEPS)
Sticky footer:
Back | Save Draft | Next Step / Save Configuration
Primary button uses #FD4314.

SYSTEM STATES
Draft:
Editable configuration.
Published:
Locks structural data.
Completed:
Read-only.

TABLE STANDARDS (GLOBAL)
All tables:
Alternate blue row theme
No vertical grid lines
Column filters under headers
Sort icon beside headers
Light orange hover
Sticky headers

INTERACTION RULES
Autosave draft silently.
Step cannot proceed if validation fails.
Inline validation messaging.
Smooth transitions between steps.

EXPERIENCE GOAL
User should feel:
“I am configuring how this project will operate.”
NOT:
“I am filling forms.”

OUTPUT EXPECTATION
Generate complete desktop experience including:
Navigation shell
Guided configuration workflow
Structured enterprise layouts
Hierarchical execution builder
ROC configuration engine
Consistent theme application
Maintain scalability for mega-project environments.


Design a complete **Create Project configuration flow** for an enterprise construction management system.

IMPORTANT:
This is a 4-step configuration wizard. DO NOT add, remove, rename, or invent extra screens or features. Follow behaviors exactly as defined.

The design must follow the existing application layout and enterprise theme.

---

GLOBAL DESIGN SYSTEM

Primary Color: #FD4314
Soft Accent Background: #E4EEFE
Primary Text / Headers: #272721

Style:

* Enterprise SaaS UI
* Clean structured layout
* Minimal shadows
* Subtle borders
* AG-Grid compatible tables
* 8px spacing system
* Compact but readable density

Keep existing:

* top navigation
* breadcrumb layout
* page header style
* footer action buttons

---

GLOBAL FLOW STRUCTURE

This is a STEP-BASED PROJECT DEFINITION FLOW.

Display a horizontal stepper at top:

1. Project Setup
2. Coding Dimensions
3. Phases
4. Activities

Rules:

* Current step highlighted using #FD4314.
* Completed steps show check indicator.
* Future steps muted.
* Navigation allowed only forward/back using buttons.

Persistent footer buttons on all steps:
LEFT → Back
CENTER → Save as Draft
RIGHT → Next / Save Configuration (Primary button)

---

STEP 1 — PROJECT SETUP (PROJECT IDENTITY)

Purpose: Define project identity and metadata.

Sections:

A. Project Identity

* System Project ID* (auto-generated, read-only)
* Client Project Code* (editable only in Draft)
* Project Name*
* Client Name* (searchable dropdown)
* Upload Logo (jpg, png, jpeg, heic, svg)

B. Location & Time

* Country* (dropdown)
* City / Region (text)
* Timezone* (single selection dropdown)

C. Schedule

* Start Date* (≤ Planned Finish)
* Planned Finish Date* (≥ Start Date)

D. Financial & Status

* Currency* (dropdown from currency master)
* Project Status (Draft, Published/Active, Completed, On Hold, Archive)

E. Additional Details

* Additional Notes (textarea)
* Created By / Created On (auto fetched, read-only)

Behavior Rules:

* System Project ID NEVER editable.
* Client Project Code locked after Draft.
* Date pickers validate ranges visually.
* Draft status pill visible top-right.

---

STEP 2 — CODING DIMENSIONS (DATA STRUCTURE)

Purpose: Define project coding structure used later for filtering tasks.

Layout:
Two-panel workspace.

LEFT PANEL:
List of Coding Dimensions:
Examples:

* Area
* Work Package
* SPA
* Cost Type

Button:

* Add New Dimension

RIGHT PANEL:
Manage Values for selected dimension.

Table columns:
Code | Name | Status (Active/Inactive)

Capabilities:

* Inline search
* Import from Excel
* Download Template
* Add New Value button

Behavior:

* Selecting dimension updates right panel instantly.
* Active dimension highlighted using #E4EEFE.
* Values editable inline.
* Import applies only to selected dimension.

Context helper text above:
“Coding Dimensions define how tasks are categorized and filtered across the project.”

---

STEP 3 — PHASES CONFIGURATION (EXECUTION STRUCTURE)

Purpose: Move from structure → execution planning.

Empty State:
“No Phases configured yet. Click ‘Add Phase’ to start.”

Phase hierarchy must be visually communicated:

Phase
└ Discipline
└ Trade Package
└ Subcontractor

Configuration Flow:

Phase Details:

* Phase Code
* Phase Name

A. Select Discipline
Table with checkbox selection:
Code | Name | Description

B. Select Trade Packages
Table:
TP Code | Trade Package Description

C. Assign Subcontractors
Mapping rows:
Trade Package → Subcontractor dropdown

Behavior:

* Selecting discipline enables trade packages.
* Selecting trade packages enables subcontractor mapping.
* Smooth guided flow (auto-scroll to next section).
* Tables use enterprise grid styling.

---

STEP 4 — ACTIVITIES (ROC CONFIGURATION)

Purpose:
Define project-specific progress calculation using ROC templates.

Section Title:
Project Progress Rules (ROC Configuration)

Workflow:

1. Display list of ROC templates from master.
   Columns:
   ROC ID | Activity Name | UOM | Step 1 | Weightage | Step 2 | Weightage | Step 3 | Weightage | Step 4 | Weightage | Total

2. User can:

* Select ROCs using checkbox
* Import new ROCs
* Export Selected Data

Export Behavior:
User exports selected ROC → edits Excel → imports updated version.

Critical Rule:
Imported values apply ONLY to this project.
Master ROCs remain unchanged.

Show helper message confirming this.

Display badge:
“X ROCs Selected”

---

INTERACTION RULES (ALL STEPS)

* Hover rows highlight subtly.
* Primary actions use #FD4314.
* Selected states use #E4EEFE background.
* Tables support search and sorting visually.
* Layout remains consistent across all steps.
* No modal interruptions.
* Navigation never loses entered data.

---

FINAL GOAL

Create a cohesive enterprise configuration journey that progresses logically:

Project Identity → Data Structure → Execution Planning → Progress Logic

The flow must feel structured, professional, and scalable for large construction projects while strictly matching the existing application theme.

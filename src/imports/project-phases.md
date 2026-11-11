Design the **Step 3 – Project Phases** screen for an enterprise construction management system inside an existing 4-step Project Configuration flow.

IMPORTANT RULES:

* Rename this step everywhere to **Project Phases**.
* DO NOT create new screens or flows.
* Follow the existing application layout and theme.
* This step is a repeatable PHASE BUILDER, not a long form.

---

GLOBAL DESIGN SYSTEM

Primary Color: #FD4314
Soft Selection Background: #E4EEFE
Primary Text: #272721

Style:

* Enterprise SaaS UI
* Minimal shadows
* Subtle borders
* Compact density
* AG-Grid compatible tables
* 8px spacing system

Keep:

* existing header
* breadcrumb
* stepper navigation
* footer buttons (Back | Save as Draft | Next)

---

PAGE TITLE

Project Phases

Subtitle:
Configure execution phases by assigning disciplines, trade packages, and subcontractors.

---

PRIMARY ACTION

Top-right button:

* Add Phase

---

PHASE BUILDER STRUCTURE

Each phase is represented as a COLLAPSIBLE PHASE CARD.

Multiple phase cards can exist vertically.

When a user clicks **Add Phase**:

* A new expanded phase card appears at the bottom.
* Previous completed phase cards collapse automatically.

---

PHASE CARD — EXPANDED STATE

SECTION 1 — Phase Details

Two input fields side-by-side:

* Phase Code* (textbox)
* Phase Name* (textbox)

---

SECTION 2 — Select Discipline

Header:
Select Discipline

Searchable dropdown input at top:
“Search Discipline…”

Below input show selectable TABLE populated from Discipline Master.

Table Columns:
☑ Checkbox | Discipline Code | Discipline Name | Description

Table Features:

* Pagination controls
* Records per page selector
* Total record count visible
* Search filters table results

Selection Behavior:

* Checking row adds tag inside dropdown input.
  Example tags:
  [MEP ✕] [ELEC ✕]
* Removing tag unselects row.
* Selected rows highlighted using #E4EEFE.

---

SECTION 3 — Select Trade Package

Header:
Select Trade Package

Same interaction pattern as Discipline.

Columns:
☑ Checkbox | TP Code | Trade Package Name

Dependency Rule:
Disabled until at least one discipline selected.

Helper text when disabled:
“Select disciplines to enable trade packages.”

Selections appear as removable tags in dropdown.

---

SECTION 4 — Assign Subcontractors to Trade Packages*

This section depends on selected Trade Packages.

Display dynamic mapping table:

Columns:
Trade Package | Subcontractors*

Each row corresponds to a previously selected Trade Package.

Subcontractors field:

* Searchable multi-selection dropdown
* Values from Subcontractor Master
* Selected values appear as tags

Behavior:

* Removing a trade package removes its mapping row automatically.
* Multi-select allowed.

---

PHASE CARD COLLAPSED STATE

After user clicks Add Phase again:

Current phase collapses into summary card displaying:

* Phase Name
* Number of Disciplines selected
* Number of Trade Packages selected
* Number of Subcontractor assignments

Example summary:
PROCUREMENT
3 Disciplines • 5 Trade Packages • 4 Subcontractors

Collapsed card shows:

* expand arrow
* edit icon

---

INTERACTION RULES

* Only one phase card expanded at a time.
* Hover states subtle.
* Section headers medium weight.
* Tables use enterprise grid styling.
* Selection persists across pagination.
* Removing discipline updates dependent selections dynamically.

---

FOOTER ACTIONS (GLOBAL)

Back (left)
Save as Draft (center)
Next (primary right button using #FD4314)

---

GOAL

Create a scalable Phase Builder that allows users to progressively construct execution phases while keeping configuration clear, structured, and manageable for large enterprise projects.

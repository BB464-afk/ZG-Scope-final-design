Design a modern enterprise **Project Dashboard content screen** (exclude sidebar and header). The layout should prioritize **execution tracking and clarity**, not heavy visual analytics. Keep the interface clean, structured, and easy to scan.

---

### 🎨 Theme & Styling

* Primary / Accent Color: **#FD4314**
* Primary Text Color: **#272721**
* Secondary Background Highlight: **#E4EEFE**
* Use neutral greys for borders and backgrounds
* Minimal shadows, soft elevation for cards
* Clean enterprise style (SAP / Oracle inspired)

---

### 🟩 Title Section (Top of Content Area)

* Title: **Project Dashboard** (bold, primary text color)
* Subtitle: *Execution snapshot for progress and performance overview*
* On the right side:

  * **Project Duration chip** (e.g., “120 Days Active”)
  * Light background (very subtle grey or sky blue tint)
  * Rounded pill style

---

### 🟦 Filters Row (Below Title)

Horizontal, evenly spaced filters:

* Date Filter (calendar icon) → “To Date”
* Trade Package → “All Trade Packages”
* Discipline → “All Disciplines”
* SPA → “All SPAs”

Design:

* Light bordered dropdowns
* Subtle hover state using **#E4EEFE**
* Compact and aligned

---

### 🟨 KPI Cards Section (Row of 2 cards, LOW visual dominance)

#### Card 1: Project Manhours

* Title: Project Manhours
* Values:

  * Budgeted
  * Earned
  * Remaining
* Include **thin horizontal progress bar**

  * Filled portion uses **#FD4314**
  * Background is light grey
* Clean typography hierarchy (no clutter)

#### Card 2: Project Cost

* Same structure as Manhours
* Currency formatting
* Same progress behavior

Design:

* Equal width cards
* Soft shadow or border
* Keep minimal — not visually overpowering

---

### 🟪 PRIMARY SECTION → Performance Summary Table (MOST IMPORTANT)

#### Title: Performance Summary

This is the **main focus of the dashboard**

Table Structure:

Columns:

* Metric
* This Period
* To Date

Rows:

* Cost
* Manhours
* Quantity Installed

Design:

* Wide layout (full width emphasis)
* Right-aligned numeric values
* “To Date” column slightly bolder
* Light row dividers
* Subtle row hover with **#E4EEFE**
* No heavy gridlines

Optional enhancement:

* Small indicator dot or icon in accent color for key metrics

---

### 🟧 SECONDARY SECTION → Trade Package Performance (Supportive Visualization)

#### Title: Trade Package Performance

* Subtitle: *Earned vs Budget by selected grouping*

Chart:

* Horizontal bar chart
* Categories on Y-axis (HVAC, Painting, MEP, etc.)
* Two bars:

  * Budget → light grey
  * Earned → **#FD4314**

Top-right toggle:

* “Manhours” | “Cost”
* Active state highlighted using accent color

Design:

* Keep chart visually lighter than table
* No excessive colors or gridlines

---

### 🟫 Recent Activity Section (Bottom)

#### Title: Recent Activity

* Subtitle: *Latest progress updates and changes*

Top right:

* Dropdown: “All Activity”

List items include:

* Icon (line style, subtle)
* Title (bold)
* Description (short, muted text)
* Timestamp (e.g., “2 hours ago”)
* Status badge (right aligned):

  * Completed → subtle green
  * Pending → neutral grey
  * New → light blue
  * Approved → soft accent tone

Spacing:

* Clean vertical rhythm
* Divider between items

---

### ⚖️ Layout Hierarchy (CRITICAL)

1. Title + Filters
2. KPI Cards (quick summary only)
3. ⭐ Performance Summary Table (PRIMARY FOCUS)
4. Trade Package Chart (SECONDARY)
5. Recent Activity (CONTEXTUAL)

---

### 🚫 Explicitly Avoid

* No pie charts
* No installation status visualization
* No pending approvals KPI
* No complex analytics (variance, forecasts)
* No overcrowding or excessive colors

---

### 🎯 Overall Experience

The screen should feel like a **project execution control panel**, not a data-heavy dashboard.
Focus on:

* Clarity over visuals
* Structured information over charts
* Quick understanding over deep analysis

The design should be calm, professional, and decision-friendly.

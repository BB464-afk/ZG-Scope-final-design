Improve Construction Project Dashboard UI (Visual + Layout Enhancements Only)**

Redesign the existing construction project dashboard UI to improve visual clarity, hierarchy, and interactivity while keeping ALL existing data, metrics, and logic unchanged. This is strictly a UI/UX enhancement task — do not modify, remove, or reinterpret any data.

---

### 🎯 Objective

Transform the dashboard from a table-heavy layout into a visually engaging, decision-focused interface with better hierarchy and readability.

---

### 🧱 Layout Structure (Follow Exactly)

#### 🔹 Row 1: KPI Summary Strip (Top Section)

Redesign existing KPI cards with improved styling and add one new element:

Include:

* Project Manhours (Budget, Earned, Remaining)
* Project Cost (Budget, Earned, Remaining)
* Project Active Days

Enhancements:

* Add **Target Completion Date** inside the "Project Active Days" card as a small sub-label
* Increase card height slightly for better readability
* Add subtle shadows, rounded corners, and spacing between cards
* Use icons (clock, calendar, money, tools)

---

#### 🔹 Row 2: Primary Visual (NEW – Main Focus)

Add a **large clustered bar chart** directly below KPI cards

Chart behavior:

* X-axis: Based on selected dropdown value (Discipline / Work Package / etc.)
* Y-axis: Values (Budget vs Earned)
* Two bars per category:

  * Budget
  * Earned

Controls:

* Add toggle buttons: **Manhours | Cost**
* Chart updates dynamically based on toggle

Design:

* Use clean colors (neutral for budget, highlight color for earned)
* Add value labels on bars
* Sort categories by lowest % complete first

---

#### 🔹 Row 3: Secondary Content (Split Layout)

LEFT:

* Keep **Overall Install Quantity table**
* Reduce its visual dominance
* Add horizontal progress bars inside rows for % complete

RIGHT:

* Replace current discipline table area with:

  * A compact **summary table or mini chart**
  * Keep it visually secondary to the bar chart

---

### 🎛️ Dropdown (KEEP POSITION – Enhance UX)

Location: Above right-side module (do NOT move)

Changes:

* Rename label to **“View By”**
* Keep options:

  * Discipline
  * Activity
  * Subcontractor
  * Scope
  * Area
  * Work Package

Behavior:

* Dropdown selection updates bar chart and related table content dynamically

Design:

* Increase width slightly
* Add filter/view icon
* Improve spacing and readability

---

### 🎨 Visual Design Guidelines

* Reduce reliance on plain tables
* Use:

  * Progress bars
  * Color-coded values
  * Visual indicators instead of raw numbers

Color logic:

* Green → good progress
* Orange → medium
* Red → low progress

Use:

* Soft shadows
* Light background sections
* Clean spacing and padding

---

### ⚠️ Important Constraints

* DO NOT change:

  * Any data values
  * Any calculations
  * Any labels or terminology
* DO NOT introduce new metrics
* DO NOT remove existing information

Only:

* Reorganize layout
* Enhance visuals
* Improve interaction feel

---

### 💡 Goal Outcome

The updated dashboard should:

* Provide instant understanding at first glance
* Highlight performance visually (not just via tables)
* Prioritize charts over raw data
* Feel modern, clean, and interactive
* Support quick decision-making


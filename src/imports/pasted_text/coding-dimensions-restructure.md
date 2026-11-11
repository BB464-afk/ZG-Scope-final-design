Coding Dimensions Page — Restructure
Instead of assuming fixed tabs like:
Area | Work Package | SPA | Cost Type

Make them dynamic dimension tabs.
Top Section
Title
Coding Dimensions
Subtitle
View project coding dimensions and cost account code configuration
Right side button:
Cost Account Configuration

2️⃣ Add New Dimension
Add a button near the tabs:
+ Add Coding Dimension
When clicked → small modal.
Fields:
Dimension Name *
Dimension Code *
Description
Status (Active / Inactive)

Example:
Name: Building Zone
Code: BZ
Description: Building zone classification

On save:
A new tab appears automatically.
Example tabs:
Area | Work Package | SPA | Cost Type | Building Zone

This solves requirement #1.

3️⃣ Inside Each Dimension Tab
Each tab shows the values table.
Example: Area
Columns:
Code | Name | Status

Add a button above the table:
+ Add Value

Popup:
Code *
Name *
Status

Example:
Code: A07
Name: Service Corridor
Status: Active

This solves requirement #2.

4️⃣ Cost Account Configuration Entry
User clicks:
Cost Account Configuration
Now system checks project setting.
Two scenarios:

5️⃣ Scenario A — Cost Code Already Enabled
Show configuration screen immediately.
Title:
Cost Account Code Generation
Section:
Select & Order Dimensions for Cost Code

Show all available dimensions.
Example:
Area
Work Package
SPA
Cost Type
Building Zone

Each row:
☰ Drag handle | Dimension Name | Order Number | Remove

User can:
drag reorder
remove dimensions
add dimensions

Preview section updates automatically.
Example:
Preview Cost Code

A01-WP01-SPA01

Save button.

6️⃣ Scenario B — Cost Code Disabled
Show enable screen first.
Card:
Cost Account Code is currently disabled for this project.

Message:
Cost code generation helps standardize cost tracking
across tasks using configured coding dimensions.
Button:
Enable Cost Code Generation

Clicking it opens the same configuration screen described above.
This solves requirement #3.

7️⃣ Cost Code Configuration Screen Layout
Section 1
Toggle
Enable Cost Code Generation

No   Yes


Section 2
Instruction banner:
The sequence in which you arrange the dimensions
determines how cost codes are generated.


Section 3
Dimension selection list
Drag reorder UI.
Example:
1  Area
2  Work Package
3  SPA
4  Cost Type


Section 4
Preview
Example:
Preview Example

A01-WP01-SPA01-CT02


8️⃣ Important System Rules
You should enforce these:
Rule 1
At least one dimension required.
Rule 2
Dimension cannot be deleted if used in tasks.
Rule 3
Changing sequence updates preview only, not existing tasks.
Rule 4
Cost code structure affects new tasks only.

9️⃣ UX Improvements (Enterprise Standard)
Add:
Dimension usage indicator
Example in tab header:
Area (6)
Work Package (12)
SPA (4)

Shows value count.

Status chips
Active  → green
Inactive → red


Bulk Import
Each dimension tab should also allow:
Import from Excel
Export

Because these lists can be 100+ values.

🔟 Resulting Structure
Final UX becomes:
Coding Dimensions

[Area] [Work Package] [SPA] [Cost Type] [+ Add Dimension]

Table of values

Code | Name | Status

+ Add Value
Import | Export

-----------------------------------

Cost Account Configuration



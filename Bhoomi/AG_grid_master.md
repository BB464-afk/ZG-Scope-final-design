MASTER PROMPT — Standard AG Grid Layout For All Listing Tables
Instruction
Apply the following standardized AG Grid table layout and behavior to the listed modules.
Apply To Listings:
Discipline Master Listing
Trade Package master Listing
Sub-Contractor Listing
UOM master listing
Currency Listing
ROC master library listing
Location listing
Client Master Listing

Core Rule
All listing tables must follow a unified AG Grid interaction model while preserving:
Existing application color theme (alternate blue rows)
Existing typography
Existing spacing system
Existing visual styling
Changes are functional and structural only, not visual redesign. You can refer "My Projects" listing.
ONLY APPLY CHANGES TO LISTED SCREENS. DO NOT ADD, EDIT, DELETE ANY OTHER SCREENS

1. Table Structure (AG Grid Standard)
1.1 Row Grouping Area
Add a section ABOVE column headers:
Text:
Drag here to set row groups
Behavior:
Users can drag column headers into this area.
Table groups rows based on selected column values.
Section remains visible at all times.

1.2 Column Headers
Each column header must include:
Column name
Sort icon beside header label
Sort states:
Default
Ascending
Descending

1.3 Column Header Naming Convention
All column headers must follow:
Capitalize Each Word Case
Examples:
Project Name
Discipline Code
Created At
Status

1.4 Column Filter Row (Mandatory)
Add a row directly BELOW column headers.
Each column contains:
Search input field
Filter icon beside search input
Behavior:
Filtering applies only to that column.
Inputs align exactly with column width.
Remove dependency on global search.

2. Remove Global Controls
Remove completely:
Global Search Bar
Global Filter Button
Filtering must occur ONLY at column level.

3. Right Side Panel (AG Grid Sidebar)
Add collapsible right-side panel.
Collapsed State:
Slim vertical bar on right edge of table.
Vertical tabs:
Columns
Filters
Expanded State:
Panel slides open.
Table resizes automatically.

Panel Contents
Columns
Toggle column visibility.
Drag to reorder columns.
Filters
Advanced filtering options.
Pivot Mode
Toggle available inside panel.

4. Toolbar & CTA Alignment
Adjust table toolbar layout:
Functional buttons aligned left.
Primary creation action aligned right.
Rule:
Any Add / Create button must always be LAST on the right.
Examples:
Add Project
Add Discipline
Create Package

5. Created At Column Standard
If not already present:
Add column:
Created At
Placement:
Immediately LEFT of Status column.
Format:
DD/MM/YYYY
Example:
25/02/2026

6. Row Styling
Maintain existing system styling:
Alternate blue row theme.
No vertical grid lines added.
Subtle row hover state.
Sticky column headers.
No color or font changes allowed.

7. Selection Behavior
Checkbox column on far left.
Multi-row selection allowed.
Compatible with bulk actions where applicable.

8. Responsiveness Rules
Table fills available workspace width.
Horizontal scroll allowed when needed.
Header and filter rows remain sticky.

9. Interaction Consistency Rule
All listings must behave identically regarding:
Sorting
Filtering
Grouping
Column visibility
Panel behavior
Users should not relearn table interaction between modules.

Expected Result
All master listings across the application will:
Share one unified AG Grid interaction model.
Maintain visual consistency.
Reduce user learning curve.
Support scalable enterprise data handling.


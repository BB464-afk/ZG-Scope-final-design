Figma Make Prompt — Discipline Master Fixes
Instruction
Update the Discipline Master module including:
Discipline Listing
Add / Edit Discipline screen
⚠️ Important Rules:
Maintain existing application theme, typography, spacing, and color system.
Follow AG Grid interaction model already implemented in My Projects Listing.
Do NOT introduce new design patterns.
Apply ONLY the changes defined below.

PART 1 — Discipline Listing
1. AG Grid Structure Alignment
Restructure the table to match AG Grid layout used in My Projects Listing.
Requirements:
Column sorting icons beside headers.
Column-level filtering row below headers.
Sticky header behavior.
Column alignment consistent with AG Grid styling.

2. Remove Global Controls
Remove completely:
Global Search
Global Filter
All filtering must occur via column filters.

3. CTA Button Alignment
Adjust toolbar buttons:
Align buttons according to AG Grid toolbar layout.
Ensure Add Discipline button is positioned LAST on the right side.
Maintain existing button styling.

4. Column Header Case
All column headers must follow:
Capitalize Each Word Case
Example:
Discipline Code
Discipline Name
Created At
Status

5. Bulk Action Support
Add bulk action capability.
Selection
Checkbox column for row selection.
Multi-select allowed.
Bulk Action
Provide action:
Change Status → Active / Inactive

Confirmation Popup
On bulk status change:
Show confirmation modal.
Message example:
"Are you sure you want to update the status for selected disciplines?"
Buttons:
Cancel
Confirm
Requirements:
Follow existing app modal styling.
No new modal design language.

6. Date Format
Update Created At column format:
DD/MM/YYYY
Example:
25/02/2026

PART 2 — Add / Edit Discipline Screen
1. Field Renaming
Rename fields:
Code → Discipline Code
Name → Discipline Name

2. Discipline Code Behavior
Discipline Code must be non-editable.
Display as read-only input.
Value is system generated.

3. Status Field
Status* must be mandatory.
Show required indicator (*).
Form validation must prevent submission without selection.

4. Dropdown Styling
Dropdown components must:
Follow application theme styling.
Match existing dropdown appearance used across system.
Icon Adjustment
Shift dropdown arrow icon slightly toward the left for proper alignment with input padding.
Maintain consistent vertical alignment.

Expected Result
Discipline Master module should:
Match AG Grid interaction standards used elsewhere.
Maintain consistent UI behavior across masters.
Support bulk administrative actions cleanly.
Preserve system-generated identifiers.


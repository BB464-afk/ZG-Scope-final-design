Create a **standard dropdown component** that will be reused across the entire application.

The dropdown must support **both single select and multi-select modes**.

Follow the exact visual and interaction behavior described below.

---

### DESIGN SYSTEM STYLES

Font Color: **#272721**
Primary Accent (border, checkbox, remove cross): **#FD4314**

Dropdown border: subtle light grey
Dropdown background: white
Hover background: very light grey

Selected item highlight (inside dropdown list): light blue background similar to existing UI theme.

---

# DEFAULT DROPDOWN STATE

Display an input-style dropdown field.

Elements inside the field:

Left side:
Search icon

Placeholder text:
"Search and select subcontractors..."

Right side:
Dropdown arrow icon

Behavior:
Clicking anywhere on the field opens the dropdown list.

The placeholder disappears when a value is selected.

---

# OPEN DROPDOWN STATE

When opened:

Display a dropdown panel below the field containing a **searchable list of options**.

Each option row contains:

Checkbox (for multi-select dropdowns)

Option name text

Row hover effect

If an item is selected:

Checkbox becomes checked
Checkbox color = **#FD4314**

Selected rows appear highlighted with a light blue background.

Multiple items can be selected in multi-select mode.

---

# MULTI SELECT DISPLAY

When multiple options are selected:

Selected values should appear **inside the dropdown field as tags**.

Each tag contains:

Selected item name
Remove icon (X)

Tag styling:

Border color = **#FD4314**
Text color = **#272721**

Remove icon behavior:

Clicking the X removes that selected item.

Tags wrap to the next line if many values are selected.

Dropdown field height expands automatically when tags wrap.

---

# SINGLE SELECT MODE

If the dropdown is configured as **single select**:

No checkboxes are displayed.

Clicking an option:

Closes the dropdown
The selected value fills the dropdown field as plain text.

Only one value can be selected.

---

# SEARCH BEHAVIOR

Typing in the dropdown search input:

Filters the list of available options in real time.

If no results are found:

Display message:

"No results found"

---

# KEY INTERACTIONS

Click dropdown → open list
Click outside → close list
Select item → update field value
Remove tag → remove selection
Typing → filter results

---

# VISUAL CONSISTENCY RULE

All dropdowns across the system must use this exact structure and behavior including:

• searchable dropdown
• multi-select tag display
• checkbox selection style
• tag remove interaction
• color scheme

This dropdown component must be reused consistently throughout the entire application UI.

Now lets work on import flow (Discipline master)
1. When user clicks import button from Discipline listing screen ....
Screen 1 — Import Modal 
Modal Title
Import Disciplines
Modal Layout

------------------------------------------------
Import Disciplines

Upload Excel file to create new disciplines.

[ Drag & Drop File Area ]

or

[ Browse File ]

Accepted format: .xlsx

------------------------------------------------
Buttons

Cancel            Upload
------------------------------------------------

Drag & Drop Area Design

Large upload zone:

[ Upload Icon ]

Drag and drop your file here

or

Browse File

UX Notes
States required:

1️⃣ Default state
2️⃣ File selected state
3️⃣ Uploading state
4️⃣ File validation error state

3. File Selected State

After user selects file:

Show file card.

Example: discipline import . xlsx
 Option to remove file

5. Screen 2 — Import Preview Modal

After validation completes, modal transforms into preview screen.
Modal Title

Import Preview

Summary Section (Top)

Show import statistics.

Total Records: 150
Valid Records: 140
Error Records: 10

Visual design suggestion:

3 colored counters:

🟦 Total Records
🟩 Valid Records
🟥 Error Records

6. Preview Table

Scrollable table inside modal.

Columns:

| Row | Discipline Code | Discipline Name | Status | Result |

Example:
Row	Code	Name	Status	Result
1	CIV	Civil	Active	✓ Valid
2	ELE	Electrical	Active	✓ Valid
3	CIV	Structural	Active	❌ Error

7. Error Highlighting

Rows with errors:

Background:

Light Red

Error message appears under Result column.

Example:

❌ Discipline Code already exists

or

❌ Duplicate Discipline Code in file

Designer should allow multi-line error text.

8. Modal Footer Actions

Footer should contain 3 buttons.

Layout:

------------------------------------------------

Cancel

Download Error Report

Import Valid Records

------------------------------------------------

Button hierarchy:

Primary button:

Import Valid Records

Secondary:

Download Error Report

Tertiary:

Cancel



9. Download Error Report

When user clicks:

Download Error Report

System downloads Excel file.

Designer does NOT need new screen, just button interaction.

10. Import Success State

After user clicks Import Valid Records

Show success confirmation modal.
Modal Title

Import Completed

Content

Records Imported: 140
Records Failed: 10

Optional icon:

✅ Success icon
Buttons

Download Error Report
Close

Close returns user to Discipline Listing Screen.
11. Error State — Invalid Template

If uploaded file does not match template.

Replace modal content with error message.

Invalid Template Structure

Please download the latest template and try again.

Buttons:

Cancel
Download Template
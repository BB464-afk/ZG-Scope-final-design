Update Progress Screen – UI Enhancements
Apply the following improvements to the Update Progress screen while maintaining the existing layout, theme, and design system.
Theme colors remain unchanged:
Primary Accent: #FD4314
Soft Background: #E4EEFE
Primary Text: #272721

1️⃣ Baseline Dates Under Reporting Period
Inside the Progress Reporting Period section, display the task baseline schedule so users know the allowed reporting window.
Place it aesthetically below the reporting date fields.
Layout:
Progress Reporting Period
Start Date | End Date
Below the fields show:
Baseline Schedule
Baseline Start: 01-01-2024
Baseline Finish: 30-06-2024
Design guidance:
Display as subtle info text
Use smaller font
Light grey label text
Align horizontally
Example:
Baseline Start: Jan 01 2024 | Baseline Finish: Jun 30 2024
Purpose:
Users understand that the reporting period should fall within the baseline schedule.

2️⃣ Quantity Step Total Column
In the Step Progress Workspace table, adjust the Total column behavior.
If step type = Quantity
Show:
Total Quantity + UOM
Example:
2000 SQM
1500 Meter
500 CUM
If step type = Percentage
Show:
–
Ensure all related rows update accordingly.
Example row:
Step
Type
Total
Last Approved
Pending
New Value
Site Preparation
Quantity
2000 SQM
1200
–
1500


3️⃣ Version History Icon
Add a Version History icon in the Step Progress Workspace header area on the right side.
Header layout:
Step Progress Workspace ⓘ Version History
Icon behavior:
Click → open Version History popup
Popup shows:
Version
Submitted By
Submitted Date
Status
Progress %
Example:
Version History
Version
Progress
Status
Submitted By
Date
V4
75%
In Review
John Martinez
02 Mar 2026
V3
65%
Approved
Sarah Chen
01 Mar 2026
V2
38%
Rejected
Sarah Chen
28 Feb 2026

Newest version at top.

4️⃣ Add “Pending” Column
Add a new column in the Step Progress Workspace table.
Position:
Last Approved → Pending → New Value
Purpose:
Display progress values that are currently under review.
Column behavior:
If version status = In Review
Show the submitted value.
If no version in review
Show:
–
Example:
Step
Total
Last Approved
Pending
New Value
Site Preparation
2000 SQM
1200
1500
1600

Pending values should be read-only.

5️⃣ Warning Banner for Pending Review
If any version is currently In Review, show a warning note at the top of the form.
Position:
Above Task Progress Overview
Design:
Light warning banner with icon.
Text:
One version of progress update for this task is currently under review.
Submitting new progress will supersede that version.
Use subtle highlight color (light orange background).

6️⃣ Evidence Upload Button Consistency
When Update Progress is opened from Task Detail screen:
The Evidence upload button must match the same design used when Update Progress is opened from Task Listing.
Do not change:
button style
icon
interaction
placement
Ensure visual and interaction consistency.
7️⃣ Display Existing Evidences
If evidences are already uploaded for a step:
Display small preview thumbnails in the Evidence column.
Layout example:
Evidence
[thumbnail] [thumbnail]

Behavior:
Show small thumbnail preview
Clicking thumbnail → opens image preview modal
Modal allows:
enlarge image
scroll if multiple
download
If file is not image:
Show document icon with filename.
Example:
📄 foun

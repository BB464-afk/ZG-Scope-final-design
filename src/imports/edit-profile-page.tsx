In the **my profile section that comes when the profile place holder is clicked add an edit icon clicking which will redirect the user to “Edit My Profile screen”.
Design “Edit My Profile screen” as below described:
Use the existing application layout and theme.
Theme colors:
Primary Accent: #FD4314
Soft Accent Background: #E4EEFE
Primary Text: #272721
Do NOT introduce new screens or components outside this page.

PAGE HEADER
Title: Edit Profile
Subtitle: Manage My Profile
Breadcrumb:
General Settings > Edit Profile
Top right corner: Logout button

MAIN PROFILE CONTAINER
Create a large card container divided into two sections.

SECTION 1 — PROFILE PHOTO
Left side panel.
Title: Profile photo
Display a large square avatar placeholder.
Below avatar show instructions:
Upload your photo
Your photo should be in PNG or JPG format
Buttons:
Choose image
Remove
Behavior:
Clicking “Choose image” opens file selector
Accepted formats: JPG, PNG
After upload the preview replaces the placeholder
Remove button deletes the image and restores placeholder

SECTION 2 — USER DETAILS
Right side panel aligned beside the photo section.
Display fields in a two-column layout.
Fields include:
System Code (read only)
Email ID (read only)
Full Name (read only)
Global Role (read only)
Phone Number (editable input)
Status (read only)
Read-only fields should appear visually disabled.
Editable field:
Phone Number → standard input field.

SECTION 3 — COMPANY INFO
Below the profile section create another card container.
Title: Company Info
Fields:
Workspace Role → Dropdown selection
Company → Text input field
Additional Notes → Large multiline text area
Layout:
Workspace Role and Company appear side-by-side.
Additional Notes spans full width below them.

FOOTER ACTIONS
At the bottom center of the page place action buttons.
Buttons:
Back
Save
Primary button styling should follow the existing theme.

VISUAL STYLE
Use subtle card containers with light borders
Maintain spacing consistent with the current product
Inputs and labels aligned cleanly in grid layout
Avatar placeholder centered vertically within the photo section
Read-only fields appear with muted background

INTERACTION BEHAVIOR
Back button navigates to previous screen
Save button saves updated profile information
File upload preview updates instantly after image selection
Remove button clears uploaded image

DESIGN GOAL
Create a clean profile editing interface that clearly separates:
• profile picture
• personal user details
• company related information
while maintaining the enterprise design system and visual consistency of the application.


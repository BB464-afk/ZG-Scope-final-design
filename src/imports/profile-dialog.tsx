Create a Profile Dialog Box that appears when the user clicks the My Profile placeholder/avatar in the system header.
⚠️ Important Rules:
Follow existing application theme, typography, spacing, and colors.
Do NOT introduce new visual styles.
Keep interaction minimal and enterprise-focused.
Data displayed will be fetched dynamically (no backend logic required in design).

1. Trigger Behavior
Trigger:
Clicking the profile avatar in header.
Behavior:
Open dialog aligned below avatar (dropdown-style dialog).
Dialog overlays content without page navigation.
Clicking outside closes dialog.

2. Dialog Layout Structure
Dialog width: compact (profile menu style).
Sections:
Header Section
User Information Section
Role Information
Logout Action

3. Header Section
Left:
Label:
Personal
Right:
Text button:
Sign out
Styling:
Subtle divider below header.
Follow existing dropdown/menu styling.

4. User Information Section
Display:
Profile Avatar
Circular image.
Uses user's Microsoft profile image.
User Name
Bold text.
Primary emphasis.
User Email ID
Secondary text style.
Slightly muted color.
All values populated dynamically.

5. Role Information
Below user details display:
Label:
System Role
Value:
Super Administrator
Styling:
Same label/value style used elsewhere in system metadata.
No badge required unless already used in theme.

6. Logout Button
Place logout action at bottom of dialog.
Button:
Logout
Requirements:
Follow existing button styling.
Full-width or aligned with dialog padding.
Visually separated with top divider spacing.

7. Visual Styling Rules
Rounded corners consistent with system cards.
Soft shadow (same as existing dropdowns).
Neutral background.
No new colors introduced.
Maintain spacing rhythm used across app menus.

8. Interaction Rules
Dialog closes on outside click.
ESC key closes dialog.
Hover states follow theme.
No animations beyond subtle fade/scale.

Expected Result
Profile dialog should:
Match enterprise header menu behavior.
Clearly present user identity.
Display system role.
Provide accessible logout action.
Feel native to existing application theme.


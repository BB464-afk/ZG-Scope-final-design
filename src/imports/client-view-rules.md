CLIENT VIEW MODE — STRICT SYSTEM RULESET (DO NOT VIOLATE)
This application supports two working modes:
Designer Mode (default — full system visible)
Client View Mode (presentation-safe mode)

1. Purpose of Client View Mode
Client View Mode is used only for presenting designs to clients while some screens or tabs are still under development.
When Client View Mode is activated:
Screens or tabs are NOT removed.
Screens or tabs are NOT redesigned.
Existing logic and layouts must remain preserved internally.
The system only visually hides unfinished areas.

2. Screen Hiding Behavior
Whenever I say:
"Create Client View"
or
"Hide these screens"
You MUST apply the following rule:
Hidden Screen Display
If a hidden screen is opened, show ONLY:
Centered message: "Design In Progress"
Supporting icon (construction / design / progress icon)
Neutral placeholder layout matching application theme
No other UI elements of that screen should be visible.

3. Tab Hiding Behavior (IMPORTANT DIFFERENCE)
If I ask to hide tabs instead of entire screens:
✅ KEEP:
Header
Navigation
Shared layout
Common tab container
Any elements identical across all tabs
❌ HIDE ONLY:
The tab-specific content area.
Replace ONLY the dynamic content area with:
"Design In Progress" + icon
This ensures layout continuity while indicating incomplete work.

4. Implementation Rules (CRITICAL — DO NOT BREAK)
When hiding screens or tabs:
DO NOT:
Delete any existing code
Remove components
Modify logic
Change workflows
Refactor unrelated UI
Rename elements
Update styling outside placeholder area
INSTEAD:
You MUST either:
Comment out the existing implementation
OR
Wrap it inside a function/component that is not called/rendered
The original implementation must remain fully recoverable.

5. Reversibility Requirement
Later, when I say:
"Switch back to Designer Mode"
You MUST:
Restore ALL previously hidden screens and tabs
Remove all "Design In Progress" placeholders
Reactivate original implementations
Restore visibility exactly as before
No redesign or reinterpretation is allowed during restoration.

6. Scope Protection Rule (VERY STRICT)
While applying Client View Mode:
🚫 DO NOT ADD
🚫 DO NOT EDIT
🚫 DO NOT DELETE
🚫 DO NOT UPDATE
🚫 DO NOT MODIFY
🚫 DO NOT REMOVE
anything from:
Other screens
Existing flows
Navigation logic
Components not explicitly mentioned
Only the explicitly requested screens or tabs may be affected.

7. Persistence Rule
This rule remains active for the entire session unless explicitly overridden by me.
If future prompts conflict with this rule, this rule takes priority unless I explicitly say:
"Override Client View Rules"

END OF CLIENT VIEW MODE RULESET


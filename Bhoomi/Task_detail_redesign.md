Redesign task details following our app zauner theme and the following prompt:
Design a modern enterprise SaaS "Task Command Center" interface for a large-scale construction project management platform.

DO NOT replicate traditional tabbed layouts or static wireframes.
Redesign the experience logically while preserving ALL functionality.

The interface represents a single Task Detail workspace where planners, engineers, and reviewers monitor execution progress, evidence, discussions, version changes, and audit history.

GOAL:
Create a highly scannable, decision-oriented UI optimized for large datasets and professional users working long hours.

STYLE:
- Modern enterprise SaaS (Linear + Notion + Procore inspiration)
- Calm, professional, low visual noise
- Strong hierarchy through spacing, not borders
- Neutral palette with selective accent color
- Dense but breathable layout
- Designed for 1440px desktop first

--------------------------------------------------
GLOBAL LAYOUT STRUCTURE
--------------------------------------------------

Replace classic tabs with a WORKSPACE NAVIGATION SYSTEM:

1. Persistent Top Bar
   - Left: hamburger + "Task Details"
   - Center: breadcrumb navigation
   - Right: user actions + logout

2. Task Context Header (Sticky)
   Contains:
   - Task Name (large)
   - Status chip
   - Completion %
   - Key identifiers (Phase, Discipline, Package)
   - Primary Actions:
       • Update Progress (primary)
       • Edit Task (secondary)

Header remains visible during scroll.

3. Workspace Navigation (Segmented Switcher)
   Replace tabs with horizontal segmented navigation:

   Overview
   Evidence
   Discussion
   Versions
   Audit

Design as pill navigation with smooth active indicator.

--------------------------------------------------
PAGE: OVERVIEW (Task Report)
--------------------------------------------------

Create a TWO-COLUMN INTELLIGENT LAYOUT:

LEFT (70%) — Operational Insight
RIGHT (30%) — Context Sidebar

LEFT CONTENT:

A. Progress Intelligence Card
- Large completion visualization
- Cost vs Budget comparison
- Installed vs Total quantity
- Earned hours vs planned
- Visual bars instead of numeric blocks

B. ROC Progress Timeline
Transform table into expandable progress rows:
- Step name
- Weight
- Installed qty
- Inline progress bar
- Expand reveals evidence summary

Focus on scanability.

RIGHT SIDEBAR (Sticky):

Grouped cards:
- Report Summary
- Budget & Cost
- Planning
- Actuals

Use subtle card separation and compact typography.

--------------------------------------------------
PAGE: EVIDENCE (Attachments & Progress Evidence)
--------------------------------------------------

Unify attachments and evidence into ONE timeline-style system.

Sections:
• Drawings / References
• Execution Evidence

Each item:
- File icon
- Filename
- Related Step tag
- Upload date
- User avatar
- Quick actions (Preview / Download)

Add drag-drop upload zone at top.

Interaction:
Hover reveals actions.
Preview opens side panel instead of modal.

--------------------------------------------------
PAGE: DISCUSSION
--------------------------------------------------

Design like modern threaded collaboration (Slack + Linear hybrid).

Features:
- Comment cards
- Inline replies (max 1 nesting)
- User avatar + role badge
- Timestamp
- Evidence attachment inline preview

Right side floating:
"Add Comment" action button.

Visual priority:
Conversation readability > decoration.

--------------------------------------------------
PAGE: VERSION HISTORY
--------------------------------------------------

Transform table into VERSION CARDS.

Each version card shows:
- Version number
- Status badge
- Progress snapshot bar
- Submitted by / Reviewed by
- Date
- Actions:
   View Version
   Revert (only approved)

Cards arranged vertically with timeline feel.

--------------------------------------------------
PAGE: VERSION DETAIL
--------------------------------------------------

Design comparison-focused layout.

Top:
Version metadata summary bar.

Main:
Change Impact Panel:
- Highlight changed steps
- Before vs After values
- Color-coded differences:
   green = increase
   red = decrease

Below:
Step comparison table.

Purpose:
User instantly understands WHAT changed.

--------------------------------------------------
PAGE: AUDIT LOG
--------------------------------------------------

Vertical activity timeline.

Each entry:
- Action icon
- Event title
- User
- Timestamp
- Metadata
- Link to version if applicable

Use subtle vertical line timeline.

--------------------------------------------------
UX PRINCIPLES TO APPLY
--------------------------------------------------

- Reduce borders, use spacing hierarchy.
- Prefer cards over grids where readability matters.
- Keep tables only where comparison is required.
- Sticky context header improves orientation.
- Avoid modal overload.
- Actions appear near data they affect.
- Every screen must answer:
   "What changed?"
   "What is risky?"
   "What needs action?"

--------------------------------------------------
VISUAL SYSTEM
--------------------------------------------------

Typography:
- Inter / SF Pro style
- 14px body
- 12px metadata
- 18–20px headings

Colors:
- Neutral gray base
- Single accent orange for actions
- Blue for progress
- Green completed
- Amber warning

Spacing:
8px system.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Create high-fidelity desktop UI frames including:
- Overview
- Evidence
- Discussion
- Version History
- Version Detail
- Audit Log

Include realistic data density.
Design for real enterprise usage, not marketing visuals.
Implement **Submission Control** for progress submissions with a **compact status indicator and lock/unlock controls**.

Submission Control determines whether users can submit progress updates or only save them as drafts.

Submission Control applies to the **entire project**.

States:

• **Open** – Users can submit progress normally
• **Locked** – Users can only save progress as draft. Submission for approval is disabled.

The design must be **compact, clearly visible, and aligned with enterprise UI patterns**.

Do not modify existing layouts, columns, or table structures.

---

# 1. TASK LISTING SCREEN

Navigation:

Main → Select Project → Task Listing

Add a **Submission Control status tag next to the page title**.

### Header Layout

Example when submissions are open:

All Tasks  🟢 Open for Progress Submissions

Example when submissions are locked:

All Tasks  🔒 Progress Submissions Locked

Design:

• Display as compact pill badge
• Small icon + text
• Color-coded status

Open state:

Green badge background
Text: Open for Progress Submissions

Locked state:

Amber badge background
Text: Progress Submissions Locked

The badge must remain visible even when the table scrolls.

---

# 2. LOCK / UNLOCK CONTROL

Add control button inside the **action toolbar** of the Task Listing screen.

When submissions are open:

Button label: Lock Submissions

When submissions are locked:

Button label: Unlock Submissions

Button should appear alongside existing toolbar actions without changing their layout.

Example:

[Inline Edit]
[Bulk Progress Update]
[Lock Submissions]
[+ Create Task]

---

# 3. LOCK SUBMISSIONS MODAL

When user clicks **Lock Submissions**, show confirmation modal.

Title:

Lock Progress Submissions

Message:

Locking submissions will prevent users from submitting new progress updates for this project.

Users will still be able to save drafts and existing submissions can still be reviewed and approved.

Buttons:

Cancel
Lock Submissions

Show success toast after confirmation:

Progress submissions locked successfully.

---

# 4. UNLOCK SUBMISSIONS MODAL

When user clicks **Unlock Submissions**, show confirmation modal.

Title:

Unlock Progress Submissions

Message:

Users will be able to submit progress updates again for this project.

Buttons:

Cancel
Unlock Submissions

Show success toast:

Progress submissions unlocked successfully.

---

# 5. APPROVALS SCREEN

Navigation:

Main → Select Project → Project Specific Approvals → Progress Approvals

Display the same **Submission Control status badge** below the page title.

Example:

Progress Approvals  🔒 Progress Submissions Locked

Add **Unlock Submissions button** near the filter controls when locked.

Do not modify the approvals table layout.

---

# 6. GLOBAL APPROVALS SCREEN

Navigation:

Main → Global Side Menu → Global Approvals → Progress Approvals

Submission Control is project-specific.

Do not show lock/unlock controls here.

Instead show a **small lock indicator beside project name** in rows where submissions are locked.

Example:

Marina Bay Complex 🔒

Tooltip:

Progress submissions are locked for this project.

---

# 7. UPDATE PROGRESS FORM BEHAVIOR

When Submission Control is **Locked**:

Show warning banner at the top of the progress form.

Message:

Progress submissions are currently locked for this project.

You may still enter progress but it will only be saved as draft and cannot be submitted for approval until submissions are unlocked.

Behavior:

Submit for Review button must be disabled
Save as Draft remains enabled

Do not block editing of fields.

---

# 8. SYSTEM RULES

When Submission Control is Locked:

New progress submission → Disabled
Save Draft → Allowed
Bulk Progress Update → Draft only
Approve progress → Allowed
Reject progress → Allowed
Revert version → Allowed

Submission Control affects only **progress submission**, not approvals.

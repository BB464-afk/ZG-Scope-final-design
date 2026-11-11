Progress Approvals – Functional Logic & UI Behavior
Default Listing Behavior
When the user opens:
Main → Approvals → Tab 1: Progress Approvals
The system must automatically filter the listing to show only Pending approvals by default.
The listing includes approvals with three possible statuses:
Pending
Approved
Rejected
However:
Default filter = Pending

Status Field Behavior
Add a Status column in the approvals listing.
This field:
Is system generated
Cannot be edited manually
Changes only based on approval workflow actions
Possible values:
Pending
Approved
Rejected

Listing Filters
Users can filter the listing by:
Status
Options:
Pending
Approved
Rejected
All
Behavior:
Status
Available Action
Pending
Review
Approved
Revert (only if latest approved/rejected version)
Rejected
Revert (only if latest approved/rejected version)


Revert Logic
The Revert action is only allowed for the latest Approved or Rejected version of a task.
Older versions cannot be reverted.
Revert is used to restore the previously approved progress.

Example Workflow
Initial Versions
Task: T1
Version
Progress
Status
Revert Allowed
V1
10%
Rejected
❌ No
V2
20%
Approved
❌ No
V3
30%
Rejected
❌ No
V4
40%
Approved
✅ Yes

Active task progress = 40%

Revert Action
User clicks Revert on V4
System performs:
V4 status changes from Approved → Pending
Active progress becomes previous approved version
New state:
Version
Progress
Status
Revert Allowed
V1
10%
Rejected
❌
V2
20%
Approved
❌
V3
30%
Rejected
❌
V4
40%
Pending
❌

Active progress = 20%

Restriction After Revert
Once a version is reverted:
No further revert actions are allowed until that version receives a new decision.
Meaning:
V4 must be either:
Approved
Rejected

If V4 Gets Rejected
Version
Progress
Status
Revert Allowed
V1
10%
Rejected
❌
V2
20%
Approved
❌
V3
30%
Rejected
❌
V4
40%
Rejected
✅

Active progress remains 20%
Now V4 becomes eligible for revert again.

Listing Action Rules
Pending Version
Action:
Review
Opens approval detail screen.

Approved Version
If it is the latest approved/rejected version:
Action:
Revert

Rejected Version
If it is the latest approved/rejected version:
Action:
Revert

Older Versions
No action available.

Detail Screen Behavior
If user opens Approval Detail Screen:
Show Revert button only when conditions allow.
Revert button visible only if:
Version is latest Approved or Rejected
There is no newer Pending version
Otherwise hide revert option.

UI Behavior Summary
Status
Button
Pending
Review
Approved (latest)
Revert
Rejected (latest)
Revert
Older versions
No action


User Experience Intent
This ensures:
Only one active progress version
Prevents multiple conflicting rollbacks
Maintains clear audit trail
Avoids accidental historical changes

Optional UX Recommendation (Very Good for Your System)
Add a version badge indicator in listing:
Example:
Task T1
V4 40%  Approved   [Revert]
V3 30%  Rejected
V2 20%  Approved
V1 10%  Rejected

Or:
Current Progress: 40%
Previous Approved: 20%

This helps reviewers understand what revert will do.


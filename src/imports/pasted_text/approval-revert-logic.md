Whenever progress that has status “In Review” is there then in front of it in the Action column “Review” Button will be there. Which on click will redirect user to Approval detail page.
Now Logic of Revert is:
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
If it’s detail page of a version “In Review” then it should have “Approve” “Reject Button”
If it’s an older version be it approved or rejected it should have this note on top “This is not the latest progress submission for this task. Please review the most recent version to take action.”
Make sure the redirection for each record is correct for every sample record.
UI Behavior Summary
Status
Button
In Review
Review
Approved (latest)
Revert
Rejected (latest)
Revert
Older versions
No action

-On Row click User should be redirected to the Global Approval detail Page which we already have but it's behavior needs to like this:
If user opens Approval Detail Screen:
Show Revert button only when conditions allow.
Revert button visible only if:
Version is latest Approved or Rejected
There is no newer Pending version
If it’s detail page of a version “In Review” then it should have “Approve” “Reject Button”
If it’s an older version be it approved or rejected it should have this note on top “This is not the latest progress submission for this task. Please review the most recent version to take action.”
If it’s detail screen is redirected from Global Approval Screen then it should have Project detail in collapsible format in it. 
Make sure the redirection for each record is correct for every sample record. Either from Global approval or from Project specific Approvals
When revert is clicked give confirmation popup.
Clicking on review from listing will also redirect to the relevant detail page but clicking on revert from listing would give confirmation popup.

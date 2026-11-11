// CLIENT VIEW MODE CONFIGURATION
// This file controls which pages and tabs are hidden in Client View Mode

export const CLIENT_VIEW_MODE = false; // Set to false to return to Designer Mode

export const hiddenPages = {
  // Global Master Pages
  createProject: CLIENT_VIEW_MODE, // Hides "Create Project" flow
  
  // Project Pages
  allReports: CLIENT_VIEW_MODE,
  projectDashboard: CLIENT_VIEW_MODE,
  projectConfiguration: CLIENT_VIEW_MODE,
  projectUsers: CLIENT_VIEW_MODE,
  projectDetails: CLIENT_VIEW_MODE,
  projectScope: CLIENT_VIEW_MODE,
  codingDimensions: CLIENT_VIEW_MODE,
  activities: CLIENT_VIEW_MODE,
  
  // Task Details Tabs
  taskAttachments: CLIENT_VIEW_MODE, // Tab 2 - Attachments (formerly taskEvidence)
  taskDiscussion: CLIENT_VIEW_MODE, // Tab 3 - Discussion
  taskVersions: CLIENT_VIEW_MODE, // Tab 4 - Versions
  taskAuditLog: CLIENT_VIEW_MODE, // Tab 5 - Audit Log
};
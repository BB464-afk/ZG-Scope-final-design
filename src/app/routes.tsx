import React from "react";
import { createBrowserRouter } from "react-router";
import SplashAndLogin from "./pages/SplashAndLogin";
import Layout from "./components/Layout";
import ProjectLayout from "./components/ProjectLayout";
import Projects from "./pages/Projects";
import ProjectConfigurationRouter from "./pages/ProjectConfigurationRouter";
import EditProjectConfig from "./pages/EditProjectConfig";
import ProjectConfigROCEdit from "./pages/ProjectConfigROCEdit";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import UserDetails from "./pages/UserDetails";
import Reports from "./pages/Reports";
import GenerateReport from "./pages/GenerateReport";
import SavedReport from "./pages/SavedReport";
import SavedReportView from "./pages/SavedReportView";
import ActivityTaskReport from "./pages/ActivityTaskReport";
import ClientReportEdit from "./pages/ClientReportEdit";
import ProjectUsers from "./pages/ProjectUsers";
import ProjectSettings from "./pages/ProjectSettings";
import ProjectDetailsSettings from "./pages/ProjectDetailsSettings";
import ProjectScopeSettings from "./pages/ProjectScopeSettings_new";
import CodingDimensionsSettings from "./pages/CodingDimensionsSettings";
import AddCodingDimension from "./pages/AddCodingDimension";
import ActivitiesSettings from "./pages/ActivitiesSettings";
import AddROCFromMaster from "./pages/AddROCFromMaster";
import ReviewProjectROCs from "./pages/ReviewProjectROCs";
import EditProjectROC from "./pages/EditProjectROC";
import EditActivityROC from "./pages/EditActivityROC";
import DisciplineList from "./pages/DisciplineList";
import AddEditDiscipline from "./pages/AddEditDiscipline";
import ROCList from "./pages/ROCList";
import AddEditROC from "./pages/AddEditROC";
import SubContractorList from "./pages/SubContractorList";
import SubContractorForm from "./pages/SubContractorForm";
import ScopeList from "./pages/ScopeList";
import AddEditScope from "./pages/AddEditScope";
import UOMList from "./pages/UOMList";
import UOMForm from "./pages/UOMForm";
import LocationList from "./pages/LocationList";
import LocationForm from "./pages/LocationForm";
import ClientList from "./pages/ClientList";
import ClientForm from "./pages/ClientForm";
import TPList from "./pages/TPList";
import TPForm from "./pages/TPForm";
import CurrencyList from "./pages/CurrencyList";
import CurrencyForm from "./pages/CurrencyForm";
import TasksListing from "./pages/TasksListing";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";
import TaskVersionDetail from "./pages/TaskVersionDetail";
import ProgressApprovalQueue from "./pages/ProgressApprovalQueue";
import ProjectAccessApprovals from "./pages/ProjectAccessApprovals";
import ProgressReviewWorkspace from "./pages/ProgressReviewWorkspace";
import UpdateProgressWorkspace from "./pages/UpdateProgressWorkspace";
import UpdateProgressWorkspaceSubsteps from "./pages/UpdateProgressWorkspaceSubsteps";
import BulkProgressWorkspace from "./pages/BulkProgressWorkspace";
import Approvals from "./pages/Approvals";
import CompanyProfile from "./pages/CompanyProfile";
import EditProfile from "./pages/EditProfile";
import AuditLogs from "./pages/AuditLogs";
import DropdownDemo from "./pages/DropdownDemo";
import NotFound from "./pages/NotFound";
import ProjectDashboard from "./pages/ProjectDashboard";
import DrawingLinks from "./pages/DrawingLinks";
// CLIENT VIEW MODE: Import configuration and placeholder
import DesignInProgress from "./components/DesignInProgress";
import { hiddenPages } from "./config/clientViewConfig";

// Helper function to conditionally render based on client view mode
const conditionalRoute = (isHidden: boolean, Component: React.ComponentType) => {
  return isHidden ? DesignInProgress : Component;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashAndLogin,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Projects },
      { path: "projects/create", Component: conditionalRoute(hiddenPages.createProject, ProjectConfigurationRouter) },
      { path: "project-config/:projectId", Component: conditionalRoute(hiddenPages.createProject, ProjectConfigurationRouter) },
      { path: "project-config-roc-edit", Component: ProjectConfigROCEdit },
      { path: "approvals", Component: conditionalRoute(hiddenPages.globalApprovals, Approvals) },
      { path: "approvals/progress/:submissionId/review", Component: ProgressReviewWorkspace },
      { path: "users", Component: conditionalRoute(hiddenPages.userManagement, UserList) },
      { path: "users/add", Component: AddUser },
      { path: "users/:id", Component: UserDetails },
      { path: "general-settings/company", Component: conditionalRoute(hiddenPages.companyProfile, CompanyProfile) },
      { path: "general-settings/profile", Component: EditProfile },
      { path: "disciplines", Component: DisciplineList },
      { path: "disciplines/add", Component: AddEditDiscipline },
      { path: "disciplines/:id", Component: AddEditDiscipline },
      { path: "scope", Component: ScopeList },
      { path: "scope/add", Component: AddEditScope },
      { path: "scope/:id", Component: AddEditScope },
      { path: "roc", Component: ROCList },
      { path: "roc/add", Component: AddEditROC },
      { path: "roc/:id", Component: AddEditROC },
      { path: "general-settings/subcontractor", Component: SubContractorList },
      { path: "general-settings/subcontractor/add", Component: SubContractorForm },
      { path: "general-settings/subcontractor/edit/:id", Component: SubContractorForm },
      { path: "general-settings/uom", Component: UOMList },
      { path: "general-settings/uom/add", Component: UOMForm },
      { path: "general-settings/uom/edit/:id", Component: UOMForm },
      { path: "general-settings/location", Component: LocationList },
      { path: "general-settings/location/add", Component: LocationForm },
      { path: "general-settings/location/edit/:id", Component: LocationForm },
      { path: "general-settings/client", Component: ClientList },
      { path: "general-settings/client/add", Component: ClientForm },
      { path: "general-settings/client/edit/:id", Component: ClientForm },
      { path: "general-settings/tp", Component: TPList },
      { path: "general-settings/tp/add", Component: TPForm },
      { path: "general-settings/tp/edit/:id", Component: TPForm },
      { path: "general-settings/currency", Component: CurrencyList },
      { path: "general-settings/currency/add", Component: CurrencyForm },
      { path: "general-settings/currency/:id", Component: CurrencyForm },
      { path: "dropdown-demo", Component: DropdownDemo },
      { path: "audit-logs", Component: AuditLogs },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/app/projects/:projectId",
    Component: ProjectLayout,
    children: [
      { path: "tasks", Component: TasksListing },
      { path: "tasks/bulk-progress", Component: BulkProgressWorkspace },
      { path: "tasks/create", Component: CreateTask },
      { path: "tasks/edit/:taskId", Component: CreateTask },
      { path: "tasks/:taskId", Component: TaskDetails },
      { path: "tasks/:taskId/update-progress", Component: UpdateProgressWorkspace },
      { path: "tasks/:taskId/update-progress-substeps", Component: UpdateProgressWorkspaceSubsteps },
      { path: "tasks/:taskId/versions/:versionId", Component: TaskVersionDetail },
      { path: "progress-approvals", Component: ProgressApprovalQueue },
      { path: "access-approvals", Component: ProjectAccessApprovals },
      { path: "progress-approvals/:submissionId/review", Component: ProgressReviewWorkspace },
      { path: "progress-approvals/:submissionId/update", Component: UpdateProgressWorkspace },
      { path: "dashboard", Component: conditionalRoute(hiddenPages.projectDashboard, ProjectDashboard) },
      { path: "approvals", Component: Projects },
      { path: "reports/generate", Component: conditionalRoute(hiddenPages.allReports, GenerateReport) },
      { path: "reports/saved", Component: SavedReport },
      { path: "reports/activity-task", Component: ActivityTaskReport },
      { path: "reports/:reportId", Component: SavedReportView },
      { path: "reports/:reportId/client-edit", Component: ClientReportEdit },
      { path: "users", Component: conditionalRoute(hiddenPages.projectUsers, ProjectUsers) },
      { path: "settings/details", Component: conditionalRoute(hiddenPages.projectDetails, ProjectDetailsSettings) },
      { path: "settings/scope", Component: conditionalRoute(hiddenPages.projectScope, ProjectScopeSettings) },
      { path: "settings/dimensions", Component: conditionalRoute(hiddenPages.codingDimensions, CodingDimensionsSettings) },
      { path: "settings/dimensions/add", Component: AddCodingDimension },
      { path: "settings/activities", Component: conditionalRoute(hiddenPages.activities, ActivitiesSettings) },
      { path: "settings/activities/add-from-master", Component: AddROCFromMaster },
      { path: "settings/activities/review-rocs", Component: ReviewProjectROCs },
      { path: "settings/activities/edit-roc", Component: EditProjectROC },
      { path: "settings/activities/edit/:activityId", Component: EditActivityROC },
      { path: "settings/drawing-links", Component: DrawingLinks },
      { path: "profile", Component: Projects },
      { path: "close", Component: Projects },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

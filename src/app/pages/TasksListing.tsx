import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Download, Upload, Plus, Edit, LayoutGrid, Table2, X, Filter as FilterIcon, ChevronDown, ChevronRight, FileText, History, FileSpreadsheet, Lock, Unlock, Link2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import ImportFilesModal from '../components/ImportFilesModal';
import StandardDropdown from '../components/StandardDropdown';
import { SubmissionStatusBadge } from '../components/SubmissionStatusBadge';
import { LockSubmissionsModal, UnlockSubmissionsModal } from '../components/SubmissionControlModals';
import ExportConfirmationModal from '../components/ExportConfirmationModal';

// Mock Data
const MOCK_TASKS_DATA = [
  { 
    id: 1, 
    taskId: 'A01_ARCH_SPA01_001', 
    taskName: 'PCW Distribution – B1 – T1 – R1.1',
    activity: 'FO21 – Process/Chilled Water Distribution',
    phase: 'SCO-002 - Fit-Out',
    discipline: 'DISC-05 - Architectural',
    tradePackage: 'TP-01 - MEP Package 01',
    subcontractor: 'SUB-01 - ABC Contractors',
    zone: 'Zone A Basement Level 1',
    building: 'BLD-A - Building A',
    tranche: 'TR-01 - Tranche 1',
    spa: 'SPA-001 - SPA Package 001',
    costType: 'CT-01 - Capex',
    deliveryPackage: 'DP-01 - Q1 2024 Delivery',
    rocId: 'ROC-002',
    tradePackageCode: 'S02',
    workComplete: 75,
    status: 'In Progress',
    createdAt: '14/02/2026'
  },
  { 
    id: 2, 
    taskId: 'B01_MEC_SPA02_001', 
    taskName: 'HVAC Installation – L2 – Zone B', 
    activity: 'ME15 – Mechanical Systems',
    phase: 'SCO-003 - MEP Works',
    discipline: 'DISC-03 - Mechanical',
    tradePackage: 'TP-02 - MEP Package 02',
    subcontractor: 'SUB-02 - BuildTech Solutions',
    zone: 'Level 2 Office Wing',
    building: 'BLD-B - Building B',
    tranche: 'TR-02 - Tranche 2',
    spa: 'SPA-002 - SPA Package 002',
    costType: 'CT-02 - Opex',
    deliveryPackage: 'DP-02 - Q2 2024 Delivery',
    rocId: 'ROC-002',
    tradePackageCode: 'S02',
    workComplete: 45,
    status: 'In Progress',
    createdAt: '10/02/2026'
  },
  { 
    id: 3, 
    taskId: 'A02_ELEC_SPA03_001', 
    taskName: 'Electrical Conduit Routing – Ground Floor', 
    activity: 'EL08 – Power Distribution',
    phase: 'SCO-004 - Core & Shell',
    discipline: 'DISC-04 - Electrical',
    tradePackage: 'TP-03 - Electrical Package 01',
    subcontractor: 'SUB-03 - PowerGrid Electric',
    zone: 'Ground Floor Main Lobby',
    building: 'BLD-A - Building A',
    tranche: 'TR-01 - Tranche 1',
    spa: 'SPA-003 - SPA Package 003',
    costType: 'CT-01 - Capex',
    deliveryPackage: 'DP-03 - Q3 2024 Delivery',
    rocId: 'ROC-003',
    tradePackageCode: 'E01',
    workComplete: 90,
    status: 'In Progress',
    createdAt: '08/02/2026'
  },
  { 
    id: 4, 
    taskId: 'C01_ARCH_SPA04_001', 
    taskName: 'Drywall Installation – Conference Rooms', 
    activity: 'AR32 – Interior Partitions',
    phase: 'SCO-002 - Fit-Out',
    discipline: 'DISC-05 - Architectural',
    tradePackage: 'TP-04 - Architectural Package 01',
    subcontractor: 'SUB-04 - InteriorPro Ltd',
    zone: 'Level 3 Meeting Zone',
    building: 'BLD-C - Building C',
    tranche: 'TR-03 - Tranche 3',
    spa: 'SPA-004 - SPA Package 004',
    costType: 'CT-01 - Capex',
    deliveryPackage: 'DP-04 - Q4 2024 Delivery',
    rocId: 'ROC-004',
    tradePackageCode: 'A01',
    workComplete: 30,
    status: 'In Progress',
    createdAt: '05/02/2026'
  },
  { 
    id: 5, 
    taskId: 'A03_FIRE_SPA05_001', 
    taskName: 'Fire Alarm System Testing', 
    activity: 'FS09 – Fire Safety Systems',
    phase: 'SCO-005 - Testing & Commissioning',
    discipline: 'DISC-06 - Fire Protection',
    tradePackage: 'TP-05 - Fire Safety Package',
    subcontractor: 'SUB-05 - SafeGuard Systems',
    zone: 'All Levels',
    building: 'BLD-A - Building A',
    tranche: 'TR-01 - Tranche 1',
    spa: 'SPA-001 - SPA Package 001',
    costType: 'CT-03 - Compliance',
    deliveryPackage: 'DP-01 - Q1 2024 Delivery',
    rocId: 'ROC-001',
    tradePackageCode: 'S01',
    workComplete: 100,
    status: 'Completed',
    createdAt: '01/02/2026'
  },
  { 
    id: 6, 
    taskId: 'B02_ARCH_SPA06_001', 
    taskName: 'Suspended Ceiling Installation', 
    activity: 'AR45 – Ceiling Systems',
    phase: 'SCO-002 - Fit-Out',
    discipline: 'DISC-05 - Architectural',
    tradePackage: 'TP-04 - Architectural Package 01',
    subcontractor: 'SUB-06 - CeilingExperts Co',
    zone: 'Ground Floor Cafeteria',
    building: 'BLD-B - Building B',
    tranche: 'TR-02 - Tranche 2',
    spa: 'SPA-002 - SPA Package 002',
    costType: 'CT-01 - Capex',
    deliveryPackage: 'DP-02 - Q2 2024 Delivery',
    rocId: 'ROC-004',
    tradePackageCode: 'A01',
    workComplete: 60,
    status: 'In Progress',
    createdAt: '12/02/2026'
  }
];

// Dropdown Options
const PHASE_OPTIONS = [
  { value: 'SCO-002 - Fit-Out', label: 'SCO-002 - Fit-Out' },
  { value: 'SCO-004 - Core & Shell', label: 'SCO-004 - Core & Shell' },
  { value: 'SCO-003 - MEP Works', label: 'SCO-003 - MEP Works' },
  { value: 'SCO-005 - Testing & Commissioning', label: 'SCO-005 - Testing & Commissioning' }
];
const DISCIPLINE_OPTIONS = [
  { value: 'DISC-05 - Architectural', label: 'DISC-05 - Architectural' },
  { value: 'DISC-03 - Mechanical', label: 'DISC-03 - Mechanical' },
  { value: 'DISC-04 - Electrical', label: 'DISC-04 - Electrical' },
  { value: 'DISC-06 - Fire Protection', label: 'DISC-06 - Fire Protection' },
  { value: 'DISC-07 - Structural', label: 'DISC-07 - Structural' }
];
const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Void', 'On Hold', 'Completed'].map(val => ({ value: val, label: val }));
const TRADE_PACKAGE_OPTIONS = [
  { value: 'TP-01 - MEP Package 01', label: 'TP-01 - MEP Package 01' },
  { value: 'TP-02 - MEP Package 02', label: 'TP-02 - MEP Package 02' },
  { value: 'TP-03 - Electrical Package 01', label: 'TP-03 - Electrical Package 01' },
  { value: 'TP-04 - Architectural Package 01', label: 'TP-04 - Architectural Package 01' },
  { value: 'TP-05 - Fire Safety Package', label: 'TP-05 - Fire Safety Package' }
];
const SUBCONTRACTOR_OPTIONS = [
  { value: 'SUB-01 - ABC Contractors', label: 'SUB-01 - ABC Contractors' },
  { value: 'SUB-02 - BuildTech Solutions', label: 'SUB-02 - BuildTech Solutions' },
  { value: 'SUB-03 - PowerGrid Electric', label: 'SUB-03 - PowerGrid Electric' },
  { value: 'SUB-04 - InteriorPro Ltd', label: 'SUB-04 - InteriorPro Ltd' },
  { value: 'SUB-05 - SafeGuard Systems', label: 'SUB-05 - SafeGuard Systems' },
  { value: 'SUB-06 - CeilingExperts Co', label: 'SUB-06 - CeilingExperts Co' }
];
const ZONE_OPTIONS = ['Zone A Basement Level 1', 'Level 2 Office Wing', 'Ground Floor Main Lobby', 'Level 3 Meeting Zone', 'All Levels', 'Ground Floor Cafeteria'].map(val => ({ value: val, label: val }));
const BUILDING_OPTIONS = [
  { value: 'BLD-A - Building A', label: 'BLD-A - Building A' },
  { value: 'BLD-B - Building B', label: 'BLD-B - Building B' },
  { value: 'BLD-C - Building C', label: 'BLD-C - Building C' }
];
const TRANCHE_OPTIONS = [
  { value: 'TR-01 - Tranche 1', label: 'TR-01 - Tranche 1' },
  { value: 'TR-02 - Tranche 2', label: 'TR-02 - Tranche 2' },
  { value: 'TR-03 - Tranche 3', label: 'TR-03 - Tranche 3' }
];
const SPA_OPTIONS = [
  { value: 'SPA-001 - SPA Package 001', label: 'SPA-001 - SPA Package 001' },
  { value: 'SPA-002 - SPA Package 002', label: 'SPA-002 - SPA Package 002' },
  { value: 'SPA-003 - SPA Package 003', label: 'SPA-003 - SPA Package 003' },
  { value: 'SPA-004 - SPA Package 004', label: 'SPA-004 - SPA Package 004' }
];
const COST_TYPE_OPTIONS = [
  { value: 'CT-01 - Capex', label: 'CT-01 - Capex' },
  { value: 'CT-02 - Opex', label: 'CT-02 - Opex' },
  { value: 'CT-03 - Compliance', label: 'CT-03 - Compliance' }
];
const DELIVERY_PACKAGE_OPTIONS = [
  { value: 'DP-01 - Q1 2024 Delivery', label: 'DP-01 - Q1 2024 Delivery' },
  { value: 'DP-02 - Q2 2024 Delivery', label: 'DP-02 - Q2 2024 Delivery' },
  { value: 'DP-03 - Q3 2024 Delivery', label: 'DP-03 - Q3 2024 Delivery' },
  { value: 'DP-04 - Q4 2024 Delivery', label: 'DP-04 - Q4 2024 Delivery' }
];

// ── Drawing Links data — mirrors DrawingLinks.tsx INITIAL_LINKS exactly ───────
const TASK_DRAWING_LINKS: {
  tradePackageCode: string; rocId: string; stepNumber: number; stepName: string; link: string;
}[] = [
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 1, stepName: 'Material PO Issued',  link: 'https://drive.google.com/folders/S01-ROC001-STEP1' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 2, stepName: 'Material Delivered',  link: 'https://drive.google.com/folders/S01-ROC001-STEP2' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 3, stepName: 'Installation',         link: 'https://drive.google.com/folders/S01-ROC001-STEP3' },
  { tradePackageCode: 'S01', rocId: 'ROC-001', stepNumber: 4, stepName: 'Testing',              link: 'https://drive.google.com/folders/S01-ROC001-STEP4' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 1, stepName: 'Material PO Issued',  link: 'https://drive.google.com/folders/S02-ROC002-STEP1' },
  { tradePackageCode: 'S02', rocId: 'ROC-002', stepNumber: 2, stepName: 'Material Delivered',  link: 'https://drive.google.com/folders/S02-ROC002-STEP2' },
];

// All steps per ROC (mirrors DrawingLinks.tsx ROCS)
const ROC_STEPS: Record<string, { number: number; name: string }[]> = {
  'ROC-001': [
    { number: 1, name: 'Material PO Issued' },
    { number: 2, name: 'Material Delivered' },
    { number: 3, name: 'Installation' },
    { number: 4, name: 'Testing' },
  ],
  'ROC-002': [
    { number: 1, name: 'Material PO Issued' },
    { number: 2, name: 'Material Delivered' },
    { number: 3, name: 'Equipment Installation' },
    { number: 4, name: 'Commissioning' },
  ],
  'ROC-003': [
    { number: 1, name: 'Shop Drawing Approved' },
    { number: 2, name: 'Material Delivered' },
    { number: 3, name: 'Containment Installed' },
    { number: 4, name: 'Inspection Complete' },
  ],
  'ROC-004': [
    { number: 1, name: 'Material Approved' },
    { number: 2, name: 'Area Released' },
    { number: 3, name: 'Finish Applied' },
    { number: 4, name: 'Snagging Complete' },
  ],
};

// Activity options for Bulk Progress Update
const ACTIVITY_OPTIONS = [
  { value: 'FO-01', label: 'FO-01 - Whitewash' },
  { value: 'FO-64', label: 'FO-64 - Door sets' },
  { value: 'FO-21', label: 'FO-21 - Process/Chilled Water Distribution (PCW-CWR)' },
  { value: 'FO-12', label: 'FO-12 - Ceilings' },
  { value: 'ME-15', label: 'ME-15 - HVAC Systems' },
  { value: 'EL-08', label: 'EL-08 - Power Distribution' },
];

export default function TasksListing() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';
  
  // ── Drawing Links popup state ──
  const [drawingLinksPopup, setDrawingLinksPopup] = useState<{
    taskId: string;
    taskName: string;
    rocId: string;
    tradePackageCode: string;
  } | null>(null);
  
  // Submission Control state - can be toggled by user
  const [isProgressLocked, setIsProgressLocked] = useState(projectId === '1');
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSubmissionTooltip, setShowSubmissionTooltip] = useState(false);
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [showBulkImportView, setShowBulkImportView] = useState(false);
  const [bulkImportErrors, setBulkImportErrors] = useState<any[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const [bulkImportPreviewData, setBulkImportPreviewData] = useState<any[]>([]);
  const [showSubmitTooltip, setShowSubmitTooltip] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTasks, setEditedTasks] = useState<any>({});
  const [viewMode, setViewMode] = useState<'structured' | 'flat'>('flat');
  const [flatEditMode, setFlatEditMode] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<'columns' | 'filters'>('columns');
  
  // Structured View State
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  
  // Search filters
  const [taskCodeSearch, setTaskCodeSearch] = useState('');
  const [taskNameSearch, setTaskNameSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [phaseSearch, setPhaseSearch] = useState('');
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [tradePackageSearch, setTradePackageSearch] = useState('');
  const [subcontractorSearch, setSubcontractorSearch] = useState('');
  const [deliveryPackageSearch, setDeliveryPackageSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [buildingSearch, setBuildingSearch] = useState('');
  const [trancheSearch, setTrancheSearch] = useState('');
  const [spaSearch, setSpaSearch] = useState('');
  const [costTypeSearch, setCostTypeSearch] = useState('');
  const [workCompleteSearch, setWorkCompleteSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  const getDisciplineColor = (discipline: string) => {
    // All disciplines use Purple color scheme
    return { bg: '#F3E8FF', color: '#6B21A8' };
  };

  const getPhaseColor = (phase: string) => {
    // All phases use Dark Blue color scheme
    return { bg: '#DBEAFE', color: '#1E40AF' };
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, {bg: string, color: string}> = {
      'Completed': { bg: '#D1FAE5', color: '#065F46' },
      'In Progress': { bg: '#FEF3C7', color: '#92400E' },
      'On Hold': { bg: '#DBEAFE', color: '#1E40AF' },
      'Void': { bg: '#F3F4F6', color: '#6B7280' },
      'Not Started': { bg: '#FEE2E2', color: '#991B1B' }
    };
    return colors[status] || { bg: '#F3F4F6', color: '#6B7280' };
  };

  const handleTaskClick = (taskId: number) => {
    if (editMode || flatEditMode) return;
    navigate(`/app/projects/${projectId}/tasks/${taskId}`);
  };

  const handleFieldChange = (taskId: number, field: string, value: any) => {
    setEditedTasks((prev: any) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  const toggleTask = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleBulkImportFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      toast.error('Please upload a valid .xlsx or .csv file');
      return;
    }

    setUploadedFileName(file.name);
    setIsLoadingImport(true);

    // Simulate file processing and validation
    setTimeout(() => {
      // Mock preview data with validation results
      const mockPreviewData = [
        {
          taskId: 'A01_ARCH_SPA01_001',
          taskName: 'PCW Distribution – B1 – T1 – R1.1',
          totalQty: 15,
          procurementPlaceOrder: 52,
          delivery: 52,
          install: 75,
          pressureTesting: 0,
          yellowTagComplete: 0,
          result: 'Valid'
        },
        {
          taskId: 'A01_ARCH_SPA01_002',
          taskName: 'PCW Distribution – B1 – T1 – R1.2',
          totalQty: 20,
          procurementPlaceOrder: 100,
          delivery: 95,
          install: 100,
          pressureTesting: 20,
          yellowTagComplete: 0,
          result: 'Valid'
        },
        {
          taskId: 'A01_ARCH_SPA01_003',
          taskName: 'PCW Distribution – B1 – T1 – R1.3',
          totalQty: 12,
          procurementPlaceOrder: 25,
          delivery: 25,
          install: 140,
          pressureTesting: 4,
          yellowTagComplete: 2,
          result: 'Error: Install % cannot exceed 100%'
        },
        {
          taskId: 'A01_ARCH_SPA01_004',
          taskName: 'PCW Distribution – B1 – T1 – R1.4',
          totalQty: 8,
          procurementPlaceOrder: 80,
          delivery: 42,
          install: -10,
          pressureTesting: 0,
          yellowTagComplete: 0,
          result: 'Error: Install % cannot be negative'
        }
      ];

      setBulkImportPreviewData(mockPreviewData);
      setIsLoadingImport(false);
    }, 2000);

    // Reset file input
    event.target.value = '';
  };

  const handleSubmitBulkProgress = () => {
    const validRecords = bulkImportPreviewData.filter(r => r.result === 'Valid');
    toast.success(`${validRecords.length} progress record(s) imported successfully`);
    setShowActivityModal(false);
    setShowBulkImportView(false);
    setBulkImportPreviewData([]);
    setUploadedFileName('');
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* PAGE TITLE */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0'
          }}>
            All Tasks
          </h1>
          <SubmissionStatusBadge isLocked={isProgressLocked} />
        </div>
        <p style={{
          fontSize: '14px',
          fontWeight: '400',
          color: '#6B7280',
          margin: '4px 0 0 0'
        }}>
          Manage and track all construction tasks
        </p>
      </div>

      {/* Progress Lock Warning Banner */}
      {isProgressLocked && (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '1px solid #FCD34D',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            !
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#92400E',
              margin: '0 0 4px 0'
            }}>
              Progress Updates are Currently Locked
            </p>
            <p style={{
              fontSize: '13px',
              color: '#92400E',
              margin: '0'
            }}>
              Any progress submitted will be automatically saved as draft and will not be submitted for approval until the lock is removed.
            </p>
          </div>
        </div>
      )}

      {/* TOOLBAR: ACTION BUTTONS + VIEW TOGGLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Left Section - Icon-only buttons */}
        {/* VIEW MODE TOGGLE */}
        <div style={{
          display: 'inline-flex',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          backgroundColor: '#F9FAFB',
          padding: '2px'
        }}>
          <button
            onClick={() => {
              setViewMode('structured');
              setEditMode(false);
              setFlatEditMode(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              height: '34px',
              padding: '0 14px',
              border: 'none',
              backgroundColor: viewMode === 'structured' ? '#FFFFFF' : 'transparent',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: viewMode === 'structured' ? '#1F2937' : '#6B7280',
              boxShadow: viewMode === 'structured' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <LayoutGrid size={14} />
            Structured View
          </button>
          <button
            onClick={() => {
              setViewMode('flat');
              setEditMode(false);
              setFlatEditMode(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              height: '34px',
              padding: '0 14px',
              border: 'none',
              backgroundColor: viewMode === 'flat' ? '#FFFFFF' : 'transparent',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: viewMode === 'flat' ? '#1F2937' : '#6B7280',
              boxShadow: viewMode === 'flat' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <Table2 size={14} />
            Flat View
          </button>
        </div>

        {/* SPACER */}
        <div style={{ flex: 1 }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Download Template */}
          <button
            onClick={() => {
              toast.success('Template downloaded successfully', {
                duration: 4000,
                position: 'top-right'
              });
            }}
            title="Download Template"
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <Download size={16} />
          </button>

          {/* Export Tasks */}
          <button
            onClick={() => setShowExportModal(true)}
            title="Export to Excel"
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <FileSpreadsheet size={16} />
          </button>

          {/* Import from Excel */}
          <button
            onClick={() => !isProjectReadOnly && setShowImportModal(true)}
            title={isProjectReadOnly ? "Import disabled - Project is On Hold" : "Import from Excel"}
            disabled={isProjectReadOnly}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #E5E7EB',
              backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
              borderRadius: '4px',
              cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isProjectReadOnly ? '#D1D5DB' : '#6B7280',
              opacity: isProjectReadOnly ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isProjectReadOnly) {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProjectReadOnly) {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            <Upload size={16} />
          </button>
        </div>

        {/* Right Section - Inline Edit, Bulk Update and Create Task */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Inline Edit - Icon Only */}
          <button
            onClick={() => {
              if (!isProjectReadOnly) {
                if (viewMode === 'structured') {
                  setEditMode(!editMode);
                } else {
                  setFlatEditMode(!flatEditMode);
                }
              }
            }}
            title={isProjectReadOnly ? "Edit disabled - Project is On Hold" : "Inline Edit"}
            disabled={isProjectReadOnly}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #D1D5DB',
              backgroundColor: isProjectReadOnly ? '#F3F4F6' : (editMode || flatEditMode) ? '#FFF5F2' : '#FFFFFF',
              borderRadius: '4px',
              cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isProjectReadOnly ? '#D1D5DB' : (editMode || flatEditMode) ? '#FD4314' : '#374151',
              opacity: isProjectReadOnly ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!editMode && !flatEditMode && !isProjectReadOnly) e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              if (!editMode && !flatEditMode && !isProjectReadOnly) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <Edit size={16} />
          </button>

          {/* Bulk Progress Update */}
          <button
            onClick={() => !isProjectReadOnly && setShowActivityModal(true)}
            disabled={isProjectReadOnly}
            title={isProjectReadOnly ? "Bulk Update disabled - Project is On Hold" : ""}
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1px solid #D1D5DB',
              backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
              borderRadius: '4px',
              cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: isProjectReadOnly ? '#D1D5DB' : '#374151',
              opacity: isProjectReadOnly ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isProjectReadOnly) e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              if (!isProjectReadOnly) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <FileSpreadsheet size={16} />
            Bulk Progress Update
          </button>

          {/* Lock/Unlock Submissions */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                if (!isProjectReadOnly) {
                  if (isProgressLocked) {
                    setShowUnlockModal(true);
                  } else {
                    setShowLockModal(true);
                  }
                }
              }}
              disabled={isProjectReadOnly}
              style={{
                height: '40px',
                padding: '0 16px',
                border: '1px solid #D1D5DB',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '4px',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: isProjectReadOnly ? '#D1D5DB' : '#374151',
                opacity: isProjectReadOnly ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  setShowSubmissionTooltip(true);
                }
              }}
              onMouseLeave={(e) => {
                if (!isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  setShowSubmissionTooltip(false);
                }
              }}
            >
              {isProgressLocked ? <Unlock size={16} /> : <Lock size={16} />}
              {isProgressLocked ? 'Unlock Submissions' : 'Lock Submissions'}
            </button>

            {/* Tooltip */}
            {showSubmissionTooltip && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1F2937',
                color: '#FFFFFF',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                lineHeight: '1.4',
                whiteSpace: 'nowrap',
                zIndex: 10000,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}>
                {isProgressLocked
                  ? 'Allow users to submit new progress updates'
                  : 'Prevent users from submitting new progress updates'}
                {/* Tooltip Arrow */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #1F2937'
                }} />
              </div>
            )}
          </div>

          {/* Create Task - PRIMARY */}
          <button
            onClick={() => !isProjectReadOnly && navigate(`/app/projects/${projectId}/tasks/create`)}
            disabled={isProjectReadOnly}
            title={isProjectReadOnly ? "Create Task disabled - Project is On Hold" : ""}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              backgroundColor: isProjectReadOnly ? '#D1D5DB' : '#FD4314',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              opacity: isProjectReadOnly ? 0.5 : 1
            }}
            onMouseEnter={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)')}
            onMouseLeave={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FD4314')}
          >
            <Plus size={16} />
            Create Task
          </button>
        </div>
      </div>

      {/* STRUCTURED VIEW - Card Based Layout */}
      {viewMode === 'structured' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {editMode && (
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '4px',
              padding: '12px 16px',
              margin: '16px 16px 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ fontSize: '13px', color: '#1E40AF', flex: 1 }}>
                <FileText size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Inline Edit Mode Enabled — Click any highlighted field to edit
              </div>
              <button
                onClick={() => {
                  setEditMode(false);
                  toast.success('Changes saved successfully');
                }}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#D93B0E',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Save All
              </button>
              <button
                onClick={() => setEditMode(false)}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <div style={{ overflow: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <tr style={{
                  backgroundColor: '#E4EEFE',
                  borderBottom: '1px solid #C8D9EE'
                }}>
                  <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '20%' }}>TASK</th>
                  <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '16%' }}>SCOPE</th>
                  <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '14%' }}>SUBCONTRACTOR</th>
                  <th style={{ padding: '0 9px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '24%' }}>CODING DIMENSIONS</th>
                  <th style={{ padding: '0 14px', height: '48px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '12%' }}>STATUS</th>
                  <th style={{ padding: '0 14px', height: '48px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '14%' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TASKS_DATA.map((task, index) => {
                  const isExpanded = expandedTasks.has(task.id);
                  const phaseColor = getPhaseColor(task.phase);
                  const disciplineColor = getDisciplineColor(task.discipline);
                  const statusColor = getStatusColor(task.status);
                  
                  return (
                    <tr
                      key={task.id}
                      onClick={() => {
                        if (!editMode) {
                          navigate(`/app/projects/${projectId}/tasks/${task.id}?tab=1`);
                        }
                      }}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        borderBottom: '1px solid #D8DEE8',
                        cursor: editMode ? 'default' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!editMode) {
                          e.currentTarget.style.backgroundColor = '#FFF4EF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!editMode) {
                          e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD';
                        }
                      }}
                    >
                      {/* TASK Column */}
                      <td style={{ 
                        padding: '14px', 
                        verticalAlign: 'top'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                            {task.taskId}
                          </div>
                          {editMode ? (
                            <input
                              type="text"
                              value={editedTasks[task.id]?.taskName || task.taskName}
                              onChange={(e) => handleFieldChange(task.id, 'taskName', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: '100%',
                                height: '28px',
                                border: '1px solid rgba(253, 67, 20, 0.4)',
                                borderRadius: '4px',
                                padding: '0 8px',
                                fontSize: '12px',
                                backgroundColor: '#FFFFFF'
                              }}
                            />
                          ) : (
                            <div style={{ fontSize: '12px', color: '#374151' }}>
                              {task.taskName}
                            </div>
                          )}
                          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                            {task.activity}
                          </div>
                        </div>
                      </td>

                      {/* SCOPE Column */}
                      <td style={{ 
                        padding: '14px', 
                        verticalAlign: 'top'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {editMode ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={editedTasks[task.id]?.phase || task.phase}
                                onChange={(e) => handleFieldChange(task.id, 'phase', e.target.value)}
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  padding: '0 24px 0 8px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  backgroundColor: '#FFFFFF',
                                  color: '#272721',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 8px center'
                                }}
                              >
                                {PHASE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              backgroundColor: phaseColor.bg,
                              color: phaseColor.color,
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              width: 'fit-content'
                            }}>
                              {task.phase}
                            </span>
                          )}
                          {editMode ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={editedTasks[task.id]?.discipline || task.discipline}
                                onChange={(e) => handleFieldChange(task.id, 'discipline', e.target.value)}
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  padding: '0 24px 0 8px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  backgroundColor: '#FFFFFF',
                                  color: '#272721',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 8px center'
                                }}
                              >
                                {DISCIPLINE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              backgroundColor: disciplineColor.bg,
                              color: disciplineColor.color,
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              width: 'fit-content'
                            }}>
                              {task.discipline}
                            </span>
                          )}
                          {editMode ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={editedTasks[task.id]?.tradePackage || task.tradePackage}
                                onChange={(e) => handleFieldChange(task.id, 'tradePackage', e.target.value)}
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  padding: '0 24px 0 8px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  backgroundColor: '#FFFFFF',
                                  color: '#272721',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 8px center'
                                }}
                              >
                                {TRADE_PACKAGE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                              {task.tradePackage}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* SUBCONTRACTOR Column */}
                      <td style={{ 
                        padding: '14px', 
                        verticalAlign: 'top'
                      }}>
                        {editMode ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <select
                              value={editedTasks[task.id]?.subcontractor || task.subcontractor}
                              onChange={(e) => handleFieldChange(task.id, 'subcontractor', e.target.value)}
                              style={{
                                width: '100%',
                                height: '32px',
                                padding: '0 28px 0 10px',
                                border: '1px solid #D8DEE8',
                                borderRadius: '4px',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF',
                                color: '#272721',
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center'
                              }}
                            >
                              {SUBCONTRACTOR_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px', color: '#374151' }}>
                            {task.subcontractor}
                          </div>
                        )}
                      </td>

                      {/* CODING DIMENSIONS Column */}
                      <td style={{ 
                        padding: '14px 9px', 
                        verticalAlign: 'top'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
                          {editMode ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={editedTasks[task.id]?.zone || task.zone}
                                onChange={(e) => handleFieldChange(task.id, 'zone', e.target.value)}
                                style={{
                                  width: '100%',
                                  height: '26px',
                                  padding: '0 24px 0 6px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  backgroundColor: '#FFFFFF',
                                  color: '#272721',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 6px center'
                                }}
                              >
                                {ZONE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div style={{ color: '#6B7280' }} title={`Area: ${task.zone}`}>
                              {task.zone}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {editMode ? (
                              <>\n                                <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={editedTasks[task.id]?.building || task.building}
                                    onChange={(e) => handleFieldChange(task.id, 'building', e.target.value)}
                                    style={{
                                      width: '100%',
                                      height: '26px',
                                      padding: '0 24px 0 6px',
                                      border: '1px solid #D8DEE8',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      backgroundColor: '#FFFFFF',
                                      color: '#272721',
                                      outline: 'none',
                                      cursor: 'pointer',
                                      appearance: 'none',
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 6px center'
                                    }}
                                  >
                                    {BUILDING_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <span style={{ color: '#6B7280' }}>|</span>
                                <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={editedTasks[task.id]?.tranche || task.tranche}
                                    onChange={(e) => handleFieldChange(task.id, 'tranche', e.target.value)}
                                    style={{
                                      width: '100%',
                                      height: '26px',
                                      padding: '0 24px 0 6px',
                                      border: '1px solid #D8DEE8',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      backgroundColor: '#FFFFFF',
                                      color: '#272721',
                                      outline: 'none',
                                      cursor: 'pointer',
                                      appearance: 'none',
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 6px center'
                                    }}
                                  >
                                    {TRANCHE_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </>
                            ) : (
                              <div style={{ color: '#6B7280' }} title={`Building: ${task.building} | Tranche: ${task.tranche}`}>
                                {task.building} | {task.tranche}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {editMode ? (
                              <>
                                <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={editedTasks[task.id]?.spa || task.spa}
                                    onChange={(e) => handleFieldChange(task.id, 'spa', e.target.value)}
                                    style={{
                                      width: '100%',
                                      height: '26px',
                                      padding: '0 24px 0 6px',
                                      border: '1px solid #D8DEE8',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      backgroundColor: '#FFFFFF',
                                      color: '#272721',
                                      outline: 'none',
                                      cursor: 'pointer',
                                      appearance: 'none',
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 6px center'
                                    }}
                                  >
                                    {SPA_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <span style={{ color: '#6B7280' }}>|</span>
                                <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                                  <select
                                    value={editedTasks[task.id]?.costType || task.costType}
                                    onChange={(e) => handleFieldChange(task.id, 'costType', e.target.value)}
                                    style={{
                                      width: '100%',
                                      height: '26px',
                                      padding: '0 24px 0 6px',
                                      border: '1px solid #D8DEE8',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      backgroundColor: '#FFFFFF',
                                      color: '#272721',
                                      outline: 'none',
                                      cursor: 'pointer',
                                      appearance: 'none',
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 6px center'
                                    }}
                                  >
                                    {COST_TYPE_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </>
                            ) : (
                              <div style={{ color: '#6B7280' }} title={`SPA: ${task.spa} | Cost Type: ${task.costType}`}>
                                {task.spa} | {task.costType}
                              </div>
                            )}
                          </div>
                          {editMode ? (
                            <div onClick={(e) => e.stopPropagation()}>
                              <select
                                value={editedTasks[task.id]?.deliveryPackage || task.deliveryPackage}
                                onChange={(e) => handleFieldChange(task.id, 'deliveryPackage', e.target.value)}
                                style={{
                                  width: '100%',
                                  height: '26px',
                                  padding: '0 24px 0 6px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  backgroundColor: '#FFFFFF',
                                  color: '#272721',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'right 6px center'
                                }}
                              >
                                {DELIVERY_PACKAGE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div style={{ color: '#6B7280' }} title={`Delivery Package: ${task.deliveryPackage}`}>
                              {task.deliveryPackage}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td style={{ 
                        padding: '14px', 
                        verticalAlign: 'top'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Progress Circle with Fill */}
                          <div style={{
                            width: '48px',
                            height: '48px',
                            position: 'relative',
                            flexShrink: 0
                          }}>
                            {/* Background Circle */}
                            <svg
                              width="48"
                              height="48"
                              style={{
                                transform: 'rotate(-90deg)',
                                position: 'absolute',
                                top: 0,
                                left: 0
                              }}
                            >
                              {/* Background ring */}
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke={statusColor.bg}
                                strokeWidth="4"
                              />
                              {/* Progress ring */}
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke="#FD4314"
                                strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - task.workComplete / 100)}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            {/* Center text */}
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#272721',
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '1px'
                            }}>
                              <span>{task.workComplete}</span>
                              <span style={{ fontSize: '9px' }}>%</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                            {editMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.status || task.status}
                                  onChange={(e) => handleFieldChange(task.id, 'status', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div style={{ fontSize: '12px', color: statusColor.color }}>
                                {task.status}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ACTIONS Column */}
                      <td style={{ padding: '14px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/projects/${projectId}/tasks/edit/${task.id}`);
                            }}
                            title="Edit"
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '1px solid #D8DEE8',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6B7280',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F9FAFB';
                              e.currentTarget.style.color = '#374151';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.color = '#6B7280';
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/projects/${projectId}/tasks/${task.id}?tab=4`);
                            }}
                            title="Version History"
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '1px solid #D8DEE8',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6B7280',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F9FAFB';
                              e.currentTarget.style.color = '#374151';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.color = '#6B7280';
                            }}
                          >
                            <History size={14} />
                          </button>
                          {/* Drawing Links button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDrawingLinksPopup({
                                taskId: task.taskId,
                                taskName: task.taskName,
                                rocId: (task as any).rocId || '',
                                tradePackageCode: (task as any).tradePackageCode || '',
                              });
                            }}
                            title="Drawing Links"
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '1px solid #D8DEE8',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#2563EB',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#EFF6FF';
                              e.currentTarget.style.borderColor = '#93C5FD';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.borderColor = '#D8DEE8';
                            }}
                          >
                            <Link2 size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Task ID 2 uses sub-steps version
                              const route = task.id === 2 
                                ? `/app/projects/${projectId}/tasks/${task.id}/update-progress-substeps?from=listing`
                                : `/app/projects/${projectId}/tasks/${task.id}/update-progress?from=listing`;
                              navigate(route);
                            }}
                            style={{
                              height: '32px',
                              padding: '0 16px',
                              border: 'none',
                              backgroundColor: '#D93B0E',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C4350C'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D93B0E'}
                          >
                            Update Progress
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with Record Count */}
          <div style={{
            height: '52px',
            backgroundColor: '#FAFBFC',
            borderTop: '1px solid #D8DEE8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontSize: '13px',
            color: '#6B7280'
          }}>
            <span>
              Showing 1–{MOCK_TASKS_DATA.length} of {MOCK_TASKS_DATA.length} records
            </span>
          </div>
        </div>
      )}

      {/* FLAT VIEW WITH AG GRID FEATURES */}
      {viewMode === 'flat' && (
        <>
          {/* Flat Edit Mode Banner */}
          {flatEditMode && (
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '4px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ fontSize: '13px', color: '#1E40AF', flex: 1 }}>
                <FileText size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Inline Edit Mode Enabled — Click any highlighted field to edit
              </div>
              <button
                onClick={() => {
                  setFlatEditMode(false);
                  toast.success('Changes saved successfully');
                }}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#D93B0E',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C4350C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D93B0E'}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setFlatEditMode(false);
                  setEditedTasks({});
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #C8D9EE',
            borderRadius: '4px',
            position: 'relative',
            display: 'flex'
          }}>
          {/* Main Table Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Row Grouping Area - Drag here section */}
            <div style={{
              height: '48px',
              backgroundColor: '#FAFBFC',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              fontSize: '13px',
              color: '#9CA3AF',
              fontStyle: 'italic'
            }}>
              Drag here to set row groups
            </div>

            {/* Table Container */}
            {/* NOTE: AG Grid will be implemented here, so the look and feel of the table might differ during development */}
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '12px',
              fontSize: '12px',
              color: '#6B7280'
            }}>
              Note: AG Grid will be implemented here, so the look and feel of the table might differ during development.
            </div>

            <div style={{ overflow: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#E4EEFE',
                    borderBottom: '1px solid #C8D9EE'
                  }}>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>Task ID</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '180px' }}>Task Name</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '180px' }}>Activity Name</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '120px' }}>Scope</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '120px' }}>Discipline</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '140px' }}>Trade Package</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '160px' }}>Subcontractor</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '150px' }}>Delivery Package</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>Area</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>Building</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>Tranche</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '80px' }}>SPA</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '100px' }}>Cost Type</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '130px' }}>% Work Complete</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '120px' }}>Status</th>
                    <th style={{ padding: '0 14px', height: '48px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '200px' }}>Actions</th>
                  </tr>
                  {/* Search Row */}
                  <tr style={{
                    backgroundColor: '#FAFBFC',
                    borderBottom: '1px solid #D8DEE8'
                  }}>
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={taskCodeSearch}
                          onChange={(e) => setTaskCodeSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={taskNameSearch}
                          onChange={(e) => setTaskNameSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={activitySearch}
                          onChange={(e) => setActivitySearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Phase Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={phaseSearch}
                          onChange={(e) => setPhaseSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Discipline Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={disciplineSearch}
                          onChange={(e) => setDisciplineSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Trade Package Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={tradePackageSearch}
                          onChange={(e) => setTradePackageSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Subcontractor Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={subcontractorSearch}
                          onChange={(e) => setSubcontractorSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Delivery Package Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={deliveryPackageSearch}
                          onChange={(e) => setDeliveryPackageSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Area Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={areaSearch}
                          onChange={(e) => setAreaSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Building Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={buildingSearch}
                          onChange={(e) => setBuildingSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Tranche Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={trancheSearch}
                          onChange={(e) => setTrancheSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* SPA Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={spaSearch}
                          onChange={(e) => setSpaSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Cost Type Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={costTypeSearch}
                          onChange={(e) => setCostTypeSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* % Work Complete Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={workCompleteSearch}
                          onChange={(e) => setWorkCompleteSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Status Filter */}
                    <th style={{ padding: '8px 12px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={statusSearch}
                          onChange={(e) => setStatusSearch(e.target.value)}
                          style={{
                            width: '100%',
                            height: '28px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '3px',
                            padding: '0 26px 0 8px',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <FilterIcon 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            right: '8px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            pointerEvents: 'none'
                          }} 
                        />
                      </div>
                    </th>
                    {/* Actions Column - No Filter */}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TASKS_DATA
                    .filter(task => task.taskId.toLowerCase().includes(taskCodeSearch.toLowerCase()))
                    .filter(task => task.taskName.toLowerCase().includes(taskNameSearch.toLowerCase()))
                    .filter(task => task.activity.toLowerCase().includes(activitySearch.toLowerCase()))
                    .filter(task => task.phase.toLowerCase().includes(phaseSearch.toLowerCase()))
                    .filter(task => task.discipline.toLowerCase().includes(disciplineSearch.toLowerCase()))
                    .filter(task => task.tradePackage.toLowerCase().includes(tradePackageSearch.toLowerCase()))
                    .filter(task => task.subcontractor.toLowerCase().includes(subcontractorSearch.toLowerCase()))
                    .filter(task => task.deliveryPackage.toLowerCase().includes(deliveryPackageSearch.toLowerCase()))
                    .filter(task => task.zone.toLowerCase().includes(areaSearch.toLowerCase()))
                    .filter(task => task.building.toLowerCase().includes(buildingSearch.toLowerCase()))
                    .filter(task => task.tranche.toLowerCase().includes(trancheSearch.toLowerCase()))
                    .filter(task => task.spa.toLowerCase().includes(spaSearch.toLowerCase()))
                    .filter(task => task.costType.toLowerCase().includes(costTypeSearch.toLowerCase()))
                    .filter(task => task.workComplete.toString().includes(workCompleteSearch))
                    .filter(task => task.status.toLowerCase().includes(statusSearch.toLowerCase()))
                    .map((task, index) => {
                      const phaseColor = getPhaseColor(task.phase);
                      const disciplineColor = getDisciplineColor(task.discipline);
                      const statusColor = getStatusColor(task.status);

                      return (
                        <tr
                          key={task.id}
                          onClick={() => {
                            if (!flatEditMode) {
                              navigate(`/app/projects/${projectId}/tasks/${task.id}?tab=1`);
                            }
                          }}
                          style={{
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                            borderBottom: '1px solid #D8DEE8',
                            cursor: flatEditMode ? 'default' : 'pointer',
                            height: '52px'
                          }}
                          onMouseEnter={(e) => {
                            if (!flatEditMode) {
                              e.currentTarget.style.backgroundColor = '#FFF4EF';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!flatEditMode) {
                              e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD';
                            }
                          }}
                        >
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>
                            {task.taskId}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '13px', 
                            color: '#1F2937', 
                            fontWeight: '500'
                          }}>
                            {flatEditMode ? (
                              <input
                                type="text"
                                value={editedTasks[task.id]?.taskName || task.taskName}
                                onChange={(e) => handleFieldChange(task.id, 'taskName', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  border: '1px solid rgba(253, 67, 20, 0.4)',
                                  borderRadius: '4px',
                                  padding: '0 8px',
                                  fontSize: '13px',
                                  backgroundColor: '#FFFFFF'
                                }}
                              />
                            ) : (
                              task.taskName
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280' }}>
                            {task.activity}
                          </td>
                          <td style={{ 
                            padding: '10px 14px'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.phase || task.phase}
                                  onChange={(e) => handleFieldChange(task.id, 'phase', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {PHASE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                backgroundColor: phaseColor.bg,
                                color: phaseColor.color,
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>
                                {task.phase}
                              </span>
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.discipline || task.discipline}
                                  onChange={(e) => handleFieldChange(task.id, 'discipline', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {DISCIPLINE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                backgroundColor: disciplineColor.bg,
                                color: disciplineColor.color,
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>
                                {task.discipline}
                              </span>
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.tradePackage || task.tradePackage}
                                  onChange={(e) => handleFieldChange(task.id, 'tradePackage', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {TRADE_PACKAGE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.tradePackage
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '13px', 
                            color: '#374151'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.subcontractor || task.subcontractor}
                                  onChange={(e) => handleFieldChange(task.id, 'subcontractor', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {SUBCONTRACTOR_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.subcontractor
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.deliveryPackage || task.deliveryPackage}
                                  onChange={(e) => handleFieldChange(task.id, 'deliveryPackage', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {DELIVERY_PACKAGE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.deliveryPackage
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.zone || task.zone}
                                  onChange={(e) => handleFieldChange(task.id, 'zone', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {ZONE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.zone
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.building || task.building}
                                  onChange={(e) => handleFieldChange(task.id, 'building', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {BUILDING_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.building
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.tranche || task.tranche}
                                  onChange={(e) => handleFieldChange(task.id, 'tranche', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {TRANCHE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.tranche
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.spa || task.spa}
                                  onChange={(e) => handleFieldChange(task.id, 'spa', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {SPA_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.spa
                            )}
                          </td>
                          <td style={{ 
                            padding: '10px 14px', 
                            fontSize: '12px', 
                            color: '#6B7280'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.costType || task.costType}
                                  onChange={(e) => handleFieldChange(task.id, 'costType', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {COST_TYPE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              task.costType
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '13px', color: '#1F2937', textAlign: 'center', fontWeight: '600' }}>
                            {task.workComplete}%
                          </td>
                          <td style={{ 
                            padding: '10px 14px',
                            textAlign: 'center'
                          }}>
                            {flatEditMode ? (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={editedTasks[task.id]?.status || task.status}
                                  onChange={(e) => handleFieldChange(task.id, 'status', e.target.value)}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    padding: '0 24px 0 8px',
                                    border: '1px solid #D8DEE8',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#272721',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 8px center'
                                  }}
                                >
                                  {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                backgroundColor: statusColor.bg,
                                color: statusColor.color,
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>
                                {task.status}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/app/projects/${projectId}/tasks/edit/${task.id}`);
                                }}
                                title="Edit"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  border: '1px solid #D8DEE8',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#6B7280'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                                  e.currentTarget.style.color = '#374151';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                  e.currentTarget.style.color = '#6B7280';
                                }}
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/app/projects/${projectId}/tasks/${task.id}?tab=4`);
                                }}
                                title="Version History"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  border: '1px solid #D8DEE8',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#6B7280'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                                  e.currentTarget.style.color = '#374151';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                  e.currentTarget.style.color = '#6B7280';
                                }}
                              >
                                <History size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDrawingLinksPopup({
                                    taskId: task.taskId || `T-00${task.id}`,
                                    taskName: task.taskName || task.name || '',
                                    rocId: (task as any).rocId || '',
                                    tradePackageCode: (task as any).tradePackageCode || '',
                                  });
                                }}
                                title="Drawing Links"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  border: '1px solid #D8DEE8',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#2563EB',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                                  e.currentTarget.style.borderColor = '#2563EB';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                  e.currentTarget.style.borderColor = '#D8DEE8';
                                }}
                              >
                                <Link2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Task ID 2 uses sub-steps version
                                  const route = task.id === 2 
                                    ? `/app/projects/${projectId}/tasks/${task.id}/update-progress-substeps?from=listing`
                                    : `/app/projects/${projectId}/tasks/${task.id}/update-progress?from=listing`;
                                  navigate(route);
                                }}
                                style={{
                                  height: '28px',
                                  padding: '0 10px',
                                  border: 'none',
                                  backgroundColor: '#D93B0E',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C4350C'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D93B0E'}
                              >
                                Update Progress
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Footer with Record Count */}
            <div style={{
              height: '52px',
              backgroundColor: '#FAFBFC',
              borderTop: '1px solid #D8DEE8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              fontSize: '13px',
              color: '#6B7280'
            }}>
              <span>
                Showing 1–{MOCK_TASKS_DATA.length} of {MOCK_TASKS_DATA.length} records
              </span>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <button style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5F6B7A',
                  cursor: 'pointer',
                  opacity: 0.45
                }} disabled>
                  ‹
                </button>
                <span style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#FD4314',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  fontSize: '13px'
                }}>
                  1
                </span>
                <button style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5F6B7A',
                  cursor: 'pointer',
                  opacity: 0.45
                }} disabled>
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Panel - AG Grid Style */}
          {!sidePanelOpen ? (
            <div style={{
              width: '48px',
              borderLeft: '1px solid #C8D9EE',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button
                onClick={() => {
                  setSidePanelOpen(true);
                  setSidePanelTab('columns');
                }}
                style={{
                  height: '80px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #E2E6ED',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 0',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F7FA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#5F6B7A',
                  whiteSpace: 'nowrap'
                }}>
                  Columns
                </div>
              </button>

              <button
                onClick={() => {
                  setSidePanelOpen(true);
                  setSidePanelTab('filters');
                }}
                style={{
                  height: '80px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #E2E6ED',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 0',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F7FA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#5F6B7A',
                  whiteSpace: 'nowrap'
                }}>
                  Filters
                </div>
              </button>
            </div>
          ) : (
            <div style={{
              width: '300px',
              borderLeft: '1px solid #C8D9EE',
              backgroundColor: '#FAFBFC',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                height: '48px',
                borderBottom: '1px solid #E2E6ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                backgroundColor: '#FFFFFF'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#272721' }}>
                  {sidePanelTab === 'columns' ? 'Columns' : 'Filters'}
                </div>
                <button
                  onClick={() => setSidePanelOpen(false)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '3px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X size={16} color="#5F6B7A" />
                </button>
              </div>

              {sidePanelTab === 'columns' ? (
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                    Select columns to display:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span style={{ fontSize: '13px', color: '#374151' }}>Task Code</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span style={{ fontSize: '13px', color: '#374151' }}>Task Name</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span style={{ fontSize: '13px', color: '#374151' }}>Activity</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span style={{ fontSize: '13px', color: '#374151' }}>Scope</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span style={{ fontSize: '13px', color: '#374151' }}>Discipline</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                    Active filters will appear here
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                    No filters applied
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </>
      )}

      <ImportFilesModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={() => {
          toast.success('Tasks exported successfully', {
            duration: 4000,
            position: 'top-right'
          });
        }}
        title="Export Tasks"
      />

      {/* Activity Selection Modal for Bulk Progress Update */}
      {showActivityModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            width: '90%',
            maxWidth: showBulkImportView && bulkImportPreviewData.length > 0 ? '1200px' : showBulkImportView ? '600px' : '500px',
            padding: '24px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {!showBulkImportView ? (
              // Activity Selection View
              <>
                <div style={{
                  marginBottom: '20px'
                }}>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#272721',
                    margin: 0
                  }}>
                    Bulk Progress Update
                  </h2>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#272721',
                    marginBottom: '8px'
                  }}>
                    Select Activity <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <StandardDropdown
                    options={ACTIVITY_OPTIONS}
                    value={selectedActivity}
                    onChange={(val) => setSelectedActivity(val as string)}
                    placeholder="Search and select activity"
                    mode="single"
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => {
                      setShowActivityModal(false);
                      setSelectedActivity('');
                    }}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: '1px solid #D8DEE8',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedActivity) {
                        toast.error('Please select an activity');
                        return;
                      }
                      navigate(`/app/projects/${projectId}/tasks/bulk-progress?activity=${selectedActivity}`);
                    }}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: 'none',
                      backgroundColor: '#FD4314',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
                  >
                    Generate Bulk Progress Form
                  </button>
                </div>
              </>
            ) : (
              // Import View
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '20px' 
                }}>
                  <div>
                    <button
                      onClick={() => {
                        setShowBulkImportView(false);
                        setBulkImportPreviewData([]);
                        setUploadedFileName('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FD4314',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                        marginBottom: '12px',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      ← Back to Activity Selection
                    </button>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#272721',
                      margin: 0
                    }}>
                      Import Bulk Progress Data
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowActivityModal(false);
                      setShowBulkImportView(false);
                      setBulkImportPreviewData([]);
                      setUploadedFileName('');
                      setSelectedActivity('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6B7280'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#272721'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                  >
                    <X size={20} />
                  </button>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: '#5F6B7A',
                  margin: '0 0 24px 0',
                  flexShrink: 0
                }}>
                  Upload your bulk progress data from .xlsx or .csv files. All records must be valid - no partial imports allowed.
                </p>

                {/* Scrollable Content Area */}
                <div style={{
                  flex: '1 1 auto',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  minHeight: 0
                }}>
                  {/* Loading State */}
                  {isLoadingImport && (
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    backgroundColor: '#F9FAFB',
                    marginBottom: '24px'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      width: '40px',
                      height: '40px',
                      border: '4px solid #E5E7EB',
                      borderTopColor: '#FD4314',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginBottom: '16px'
                    }} />
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      margin: 0
                    }}>
                      Processing {uploadedFileName}...
                    </p>
                    <style>
                      {`@keyframes spin { to { transform: rotate(360deg); } }`}
                    </style>
                  </div>
                )}

                {/* Upload Dropzone - Show when no data and not loading */}
                {!isLoadingImport && bulkImportPreviewData.length === 0 && (
                  <>
                    <input
                      type="file"
                      id="bulkImportFileInput"
                      accept=".xlsx,.csv"
                      onChange={handleBulkImportFileUpload}
                      style={{ display: 'none' }}
                    />
                    <div 
                      onClick={() => document.getElementById('bulkImportFileInput')?.click()}
                      style={{
                        border: '2px dashed #D1D5DB',
                        borderRadius: '8px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        backgroundColor: '#F9FAFB',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '24px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#FD4314';
                        e.currentTarget.style.backgroundColor = '#FEF2F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#D1D5DB';
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: '#E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Upload size={28} style={{ color: '#6B7280' }} />
                        </div>
                      </div>

                      <p style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Drag and drop files here or <span style={{ color: '#FD4314' }}>click to browse</span>
                      </p>

                      <p style={{
                        fontSize: '13px',
                        color: '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <FileSpreadsheet size={16} />
                        Supported file types: .xlsx, .csv
                      </p>
                    </div>
                  </>
                )}

                {/* Preview Table */}
                {!isLoadingImport && bulkImportPreviewData.length > 0 && (
                  <>
                    {/* KPI Cards */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6B7280',
                          marginBottom: '4px'
                        }}>
                          Total Records
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          {bulkImportPreviewData.length}
                        </div>
                      </div>
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #86EFAC',
                        borderRadius: '4px'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#15803D',
                          marginBottom: '4px'
                        }}>
                          Valid
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: '#15803D'
                        }}>
                          {bulkImportPreviewData.filter(r => r.result === 'Valid').length}
                        </div>
                      </div>
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '4px'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#DC2626',
                          marginBottom: '4px'
                        }}>
                          Invalid
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: '#DC2626'
                        }}>
                          {bulkImportPreviewData.filter(r => r.result !== 'Valid').length}
                        </div>
                      </div>
                    </div>

                    {/* Preview Table */}
                    <div style={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      overflowY: 'auto',
                      overflowX: 'auto',
                      marginBottom: '24px',
                      maxHeight: '400px',
                      flex: '0 0 auto'
                    }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '13px'
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F9FAFB' }}>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Task ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', minWidth: '200px' }}>Task Name</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Total Qty</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Procurement (%)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Delivery (%)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Install (%)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Pressure Testing (%)</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>Yellow Tag (%)</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #E5E7EB', minWidth: '200px' }}>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkImportPreviewData.map((row, index) => (
                            <tr key={index} style={{
                              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                            }}>
                              <td style={{ padding: '12px', color: '#272721', fontWeight: '500', borderBottom: '1px solid #E5E7EB' }}>{row.taskId}</td>
                              <td style={{ padding: '12px', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.taskName}</td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.totalQty}</td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.procurementPlaceOrder}%</td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.delivery}%</td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.install}%</td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.pressureTesting}%</td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{row.yellowTagComplete}%</td>
                              <td style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                                {row.result === 'Valid' ? (
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: '#DCFCE7',
                                    color: '#15803D'
                                  }}>
                                    Valid
                                  </span>
                                ) : (
                                  <span style={{
                                    fontSize: '12px',
                                    color: '#DC2626',
                                    fontWeight: '500'
                                  }}>
                                    {row.result}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons - Fixed Footer */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                paddingTop: '20px',
                borderTop: '1px solid #E5E7EB',
                marginTop: '20px'
              }}>
                  <button
                    onClick={() => {
                      setShowActivityModal(false);
                      setShowBulkImportView(false);
                      setBulkImportPreviewData([]);
                      setUploadedFileName('');
                      setSelectedActivity('');
                    }}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: '1px solid #D8DEE8',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    Cancel
                  </button>
                  {bulkImportPreviewData.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          // Download error report functionality
                          const errorRecords = bulkImportPreviewData.filter(r => r.result !== 'Valid');
                          if (errorRecords.length === 0) return;
                          
                          const csvContent = [
                            ['Task ID', 'Task Name', 'Error'].join(','),
                            ...errorRecords.map(r => [r.taskId, r.taskName, r.result].join(','))
                          ].join('\n');
                          
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'error-report.csv';
                          link.click();
                          URL.revokeObjectURL(url);
                          
                          // Close the popup and show toast message
                          setShowActivityModal(false);
                          setShowBulkImportView(false);
                          setBulkImportPreviewData([]);
                          setUploadedFileName('');
                          setSelectedActivity('');
                          toast.success('Error report downloaded successfully');
                        }}
                        disabled={bulkImportPreviewData.filter(r => r.result !== 'Valid').length === 0}
                        style={{
                          height: '40px',
                          padding: '0 20px',
                          border: '1px solid #D8DEE8',
                          backgroundColor: bulkImportPreviewData.filter(r => r.result !== 'Valid').length === 0 ? '#F3F4F6' : '#FFFFFF',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: bulkImportPreviewData.filter(r => r.result !== 'Valid').length === 0 ? '#9CA3AF' : '#374151',
                          cursor: bulkImportPreviewData.filter(r => r.result !== 'Valid').length === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          if (bulkImportPreviewData.filter(r => r.result !== 'Valid').length > 0) {
                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (bulkImportPreviewData.filter(r => r.result !== 'Valid').length > 0) {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }
                        }}
                      >
                        <Download size={16} />
                        Download Error Report
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={handleSubmitBulkProgress}
                          disabled={bulkImportPreviewData.some(r => r.result !== 'Valid')}
                          onMouseEnter={(e) => {
                            if (bulkImportPreviewData.some(r => r.result !== 'Valid')) {
                              setShowSubmitTooltip(true);
                            } else {
                              e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            setShowSubmitTooltip(false);
                            if (!bulkImportPreviewData.some(r => r.result !== 'Valid')) {
                              e.currentTarget.style.backgroundColor = '#FD4314';
                            }
                          }}
                          style={{
                            height: '40px',
                            padding: '0 20px',
                            border: 'none',
                            backgroundColor: bulkImportPreviewData.some(r => r.result !== 'Valid') ? '#D1D5DB' : '#FD4314',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#FFFFFF',
                            cursor: bulkImportPreviewData.some(r => r.result !== 'Valid') ? 'not-allowed' : 'pointer',
                            opacity: bulkImportPreviewData.some(r => r.result !== 'Valid') ? 0.6 : 1
                          }}
                        >
                          Submit Progress
                        </button>
                        {showSubmitTooltip && bulkImportPreviewData.some(r => r.result !== 'Valid') && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: 0,
                            marginBottom: '8px',
                            padding: '8px 12px',
                            backgroundColor: '#1F2937',
                            color: '#FFFFFF',
                            borderRadius: '6px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            zIndex: 1000,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}>
                            {bulkImportPreviewData.filter(r => r.result !== 'Valid').length} invalid record(s) - fix errors to import
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              right: '20px',
                              width: 0,
                              height: 0,
                              borderLeft: '6px solid transparent',
                              borderRight: '6px solid transparent',
                              borderTop: '6px solid #1F2937'
                            }} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submission Control Modals */}
      <LockSubmissionsModal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        onConfirm={() => {
          setIsProgressLocked(true);
          setShowLockModal(false);
          toast.success('Progress submissions locked successfully', {
            duration: 4000,
            position: 'top-right'
          });
        }}
      />

      <UnlockSubmissionsModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={() => {
          setIsProgressLocked(false);
          setShowUnlockModal(false);
          toast.success('Progress submissions unlocked successfully', {
            duration: 4000,
            position: 'top-right'
          });
        }}
      />

      {/* Drawing Links Popup */}
      {drawingLinksPopup && (() => {
        const { taskId, taskName, rocId, tradePackageCode } = drawingLinksPopup;
        const steps = ROC_STEPS[rocId] || [];
        const getLink = (stepNumber: number) =>
          TASK_DRAWING_LINKS.find(
            l => l.rocId === rocId && l.tradePackageCode === tradePackageCode && l.stepNumber === stepNumber
          )?.link || null;

        return (
          <div
            onClick={() => setDrawingLinksPopup(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              backgroundColor: 'rgba(17, 24, 39, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #C8D9EE',
                borderRadius: '6px',
                width: '560px',
                maxWidth: '95vw',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h2 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
                    Drawing Links
                  </h2>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                    {taskId} – {taskName}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
                    Trade Package: {tradePackageCode} &nbsp;·&nbsp; {rocId}
                  </p>
                </div>
                <button
                  onClick={() => setDrawingLinksPopup(null)}
                  style={{
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#6B7280',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Table */}
              <div style={{ padding: '0' }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 150px 1fr 72px',
                  backgroundColor: '#E4EEF8',
                  borderBottom: '1px solid #C8D9EE',
                  padding: '0 20px',
                }}>
                  {['Step No.', 'Step Name', 'Drawing Folder Link', ''].map((h) => (
                    <div key={h} style={{
                      padding: '10px 0',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#272721',
                    }}>{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {steps.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                    No steps configured for {rocId}.
                  </div>
                ) : steps.map((step, idx) => {
                  const link = getLink(step.number);
                  return (
                    <div
                      key={step.number}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 150px 1fr 72px',
                        padding: '0 20px',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        borderBottom: idx < steps.length - 1 ? '1px solid #E5E7EB' : 'none',
                        alignItems: 'center',
                        minHeight: '52px',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                        {step.number}
                      </div>
                      <div style={{ fontSize: '13px', color: '#272721', fontWeight: '500' }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: '12px', paddingRight: '8px', minWidth: 0, overflow: 'hidden' }}>
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: '#2563EB',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {link.replace('https://drive.google.com/folders/', 'drive.google.com/...')}
                            </span>
                            <ExternalLink size={11} style={{ flexShrink: 0 }} />
                          </a>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No link added</span>
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              height: '28px',
                              padding: '0 10px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #2563EB',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#2563EB',
                              textDecoration: 'none',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#EFF6FF';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FFFFFF';
                            }}
                          >
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <button
                  onClick={() => setDrawingLinksPopup(null)}
                  style={{
                    height: '36px',
                    padding: '0 20px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
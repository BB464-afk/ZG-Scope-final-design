import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Plus, ChevronDown, X, Trash2, Upload, Info } from 'lucide-react';
import { toast } from 'sonner';
import PlanningBudgetSection from './PlanningBudgetSection';
import StandardDropdown from '../components/StandardDropdown';
import ImportFilesModal from '../components/ImportFilesModal';

type CreationMode = 'single' | 'bulk';

interface FieldErrors {
  [key: string]: string;
}

interface TaskFormData {
  taskCode: string;
  activityName: string;
  taskName: string;
  phase: string;
  discipline: string;
  tradePackage: string;
  subContractor: string;
  deliveryPackage: string;
  area: string;
  building: string;
  tranche: string;
  spa: string;
  costType: string;
  budgetCost: string;
  budgetQuantity: string;
  budgetManHours: string;
  baselineStartDate: string;
  baselineFinishDate: string;
  actualStartDate: string;
  actualFinishDate: string;
  actualValue: string;
  actualManHours: string;
  actualQuantity: string;
  approvedChangeCost: string;
  approvedChangeHours: string;
  completion: string;
  status: string;
}

interface BulkTaskRow {
  id: number;
  taskCode: string;
  taskName: string;
  activityName: string;
  phase: string;
  discipline: string;
  tradePackage: string;
  subContractor: string;
  deliveryPackage: string;
  area: string;
  building: string;
  tranche: string;
  spa: string;
  costType: string;
  budgetCost: string;
  budgetQty: string;
  budgetManHours: string;
  baselineStart: string;
  baselineFinish: string;
  selected: boolean;
}

// Mock Activity Data (would come from ROC Library/Activity Master)
const activityOptions = [
  { value: 'FO21', label: 'FO21 – Process/Chilled Water Distribution', uom: 'MTR' },
  { value: 'FO32', label: 'FO32 – HVAC Installation & Testing', uom: 'SQM' },
  { value: 'FO12', label: 'FO12 – Structural Steel Works', uom: 'TON' },
  { value: 'FO45', label: 'FO45 – Electrical Distribution', uom: 'MTR' },
  { value: 'FO78', label: 'FO78 – Fire Protection & Safety', uom: 'EA' }
];

// Dropdown Options for StandardDropdown
const PHASE_OPTIONS = [
  { value: 'Mechanical Installation', label: 'SCO-001 - Mechanical Installation' },
  { value: 'Fit-Out', label: 'SCO-002 - Fit-Out' },
  { value: 'Commissioning', label: 'SCO-003 - Commissioning' },
  { value: 'Handover', label: 'SCO-004 - Handover' }
];

const DISCIPLINE_OPTIONS = [
  { value: 'HVAC', label: 'DISC-01 - HVAC' },
  { value: 'Civil', label: 'DISC-02 - Civil' },
  { value: 'Mechanical', label: 'DISC-03 - Mechanical' },
  { value: 'Electrical', label: 'DISC-04 - Electrical' },
  { value: 'Architectural', label: 'DISC-05 - Architectural' }
];

const TRADE_PACKAGE_OPTIONS = [
  { value: 'TP-2025-MEP-01', label: 'TP-01 - MEP Package 01' },
  { value: 'TP-2025-MEP-02', label: 'TP-02 - MEP Package 02' },
  { value: 'TP-2025-ARC-01', label: 'TP-03 - Architectural Package 01' },
  { value: 'TP-2025-STR-01', label: 'TP-04 - Structural Package 01' }
];

const SUBCONTRACTOR_OPTIONS = [
  { value: 'Climate Systems Ltd', label: 'SUB-01 - Climate Systems Ltd' },
  { value: 'BuildPro Contractors', label: 'SUB-02 - BuildPro Contractors' },
  { value: 'MechTech Solutions', label: 'SUB-03 - MechTech Solutions' },
  { value: 'ElectroPower Inc', label: 'SUB-04 - ElectroPower Inc' }
];

const DELIVERY_PACKAGE_OPTIONS = [
  { value: 'DP-Q1-2025', label: 'DP-01 - Q1 2025 Delivery' },
  { value: 'DP-Q2-2025', label: 'DP-02 - Q2 2025 Delivery' },
  { value: 'DP-Q3-2025', label: 'DP-03 - Q3 2025 Delivery' },
  { value: 'DP-Q4-2025', label: 'DP-04 - Q4 2025 Delivery' }
];

const AREA_OPTIONS = [
  { value: 'Main Building', label: 'AREA-01 - Main Building' },
  { value: 'Annex', label: 'AREA-02 - Annex' },
  { value: 'Parking Structure', label: 'AREA-03 - Parking Structure' },
  { value: 'Plaza', label: 'AREA-04 - Plaza' }
];

const BUILDING_OPTIONS = [
  { value: 'Building A', label: 'BLD-A - Building A' },
  { value: 'Building B', label: 'BLD-B - Building B' },
  { value: 'Building C', label: 'BLD-C - Building C' }
];

const TRANCHE_OPTIONS = [
  { value: 'Tranche 1', label: 'TR-01 - Tranche 1' },
  { value: 'Tranche 2', label: 'TR-02 - Tranche 2' },
  { value: 'Tranche 3', label: 'TR-03 - Tranche 3' }
];

const SPA_OPTIONS = [
  { value: 'SPA-001', label: 'SPA-001 - SPA Package 001' },
  { value: 'SPA-002', label: 'SPA-002 - SPA Package 002' },
  { value: 'SPA-003', label: 'SPA-003 - SPA Package 003' },
  { value: 'SPA-004', label: 'SPA-004 - SPA Package 004' }
];

const COST_TYPE_OPTIONS = [
  { value: 'Labour & Materials', label: 'CT-01 - Labour & Materials' },
  { value: 'Labour Only', label: 'CT-02 - Labour Only' },
  { value: 'Materials Only', label: 'CT-03 - Materials Only' },
  { value: 'Subcontract', label: 'CT-04 - Subcontract' }
];

export default function CreateTask() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const isEditMode = !!taskId; // Determine if we're editing based on taskId presence
  const [mode, setMode] = useState<CreationMode>('single');
  const [selectedUOM, setSelectedUOM] = useState<string>(isEditMode ? 'SQM' : '—');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showImportModal, setShowImportModal] = useState(false);
  
  const [formData, setFormData] = useState<TaskFormData>({
    taskCode: 'TASK-1733-AUTO',
    activityName: isEditMode ? 'FO21' : '',
    taskName: isEditMode ? 'Install HVAC Distribution System' : '',
    phase: isEditMode ? 'Mechanical Installation' : '',
    discipline: isEditMode ? 'HVAC' : '',
    tradePackage: isEditMode ? 'TP-2025-MEP-01' : '',
    subContractor: isEditMode ? 'Climate Systems Ltd' : '',
    deliveryPackage: isEditMode ? 'DP-Q1-2025' : '',
    area: isEditMode ? 'Main Building' : '',
    building: isEditMode ? 'Building A' : '',
    tranche: isEditMode ? 'Tranche 1' : '',
    spa: isEditMode ? 'SPA-001' : '',
    costType: isEditMode ? 'Labour & Materials' : '',
    budgetCost: isEditMode ? '5000' : '',
    budgetQuantity: isEditMode ? '15.5' : '',
    budgetManHours: isEditMode ? '20' : '',
    baselineStartDate: isEditMode ? '2026-02-15' : '',
    baselineFinishDate: isEditMode ? '2026-02-25' : '',
    actualStartDate: isEditMode ? '2026-02-16' : '',
    actualFinishDate: isEditMode ? '2026-02-24' : '',
    actualValue: isEditMode ? '2750' : '',
    actualManHours: isEditMode ? '15' : '',
    actualQuantity: isEditMode ? '9.5' : '',
    approvedChangeCost: isEditMode ? '' : '',
    approvedChangeHours: isEditMode ? '' : '',
    completion: isEditMode ? '55' : '0',
    status: isEditMode ? 'In Progress' : 'Draft'
  });

  const [bulkRows, setBulkRows] = useState<BulkTaskRow[]>([
    {
      id: 1,
      taskCode: '',
      taskName: '',
      activityName: '',
      phase: '',
      discipline: '',
      tradePackage: '',
      subContractor: '',
      deliveryPackage: '',
      area: '',
      building: '',
      tranche: '',
      spa: '',
      costType: '',
      budgetCost: '',
      budgetQty: '',
      budgetManHours: '',
      baselineStart: '',
      baselineFinish: '',
      selected: false
    }
  ]);

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Auto-populate UOM when activity is selected
    if (field === 'activityName') {
      const activity = activityOptions.find(opt => opt.value === value);
      setSelectedUOM(activity ? activity.uom : '—');
    }
  };

  const handleBulkCellChange = (rowId: number, field: keyof BulkTaskRow, value: string | boolean) => {
    setBulkRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const addBulkRow = () => {
    const newRow: BulkTaskRow = {
      id: bulkRows.length + 1,
      taskCode: '',
      taskName: '',
      activityName: '',
      phase: '',
      discipline: '',
      tradePackage: '',
      subContractor: '',
      deliveryPackage: '',
      area: '',
      building: '',
      tranche: '',
      spa: '',
      costType: '',
      budgetCost: '',
      budgetQty: '',
      budgetManHours: '',
      baselineStart: '',
      baselineFinish: '',
      selected: false
    };
    setBulkRows([...bulkRows, newRow]);
  };

  const removeBulkRow = (rowId: number) => {
    if (bulkRows.length > 1) {
      setBulkRows(prev => prev.filter(row => row.id !== rowId));
      toast.success('Row deleted successfully', { duration: 3000 });
    } else {
      toast.error('At least one row is required', { duration: 3000 });
    }
  };

  const handleCancel = () => {
    navigate(`/app/projects/${projectId}/tasks`);
  };

  const handleCreate = () => {
    // Validate mandatory fields
    const newErrors: FieldErrors = {};
    
    if (!formData.taskName) newErrors.taskName = 'This field is required.';
    if (!formData.activityName) newErrors.activityName = 'This field is required.';
    if (!formData.budgetCost) newErrors.budgetCost = 'This field is required.';
    if (!formData.budgetQuantity) newErrors.budgetQuantity = 'This field is required.';
    if (!formData.budgetManHours) newErrors.budgetManHours = 'This field is required.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Success
    toast.success(isEditMode ? 'Task updated successfully' : 'Task created successfully');
    navigate(`/app/projects/${projectId}/tasks`);
  };

  const handleModeSwitch = (newMode: CreationMode) => {
    setMode(newMode);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumb and Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ flex: 1 }}>
          {/* Breadcrumb */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#6B7280',
            marginBottom: '8px'
          }}>
            <span 
              style={{ cursor: 'pointer', textDecoration: 'none' }}
              onClick={() => navigate(`/app/projects/${projectId}/tasks`)}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1F2937'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
            >
              Task Listing
            </span>
            <span>›</span>
            <span style={{ fontWeight: '500', color: '#1F2937' }}>{isEditMode ? 'Edit Task' : 'Add Task'}</span>
          </div>

          {/* Page Title with Status and Completion */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              {isEditMode ? 'Edit Task' : 'Create Task'}
            </h1>

            {/* Status Badge - Only in Edit Mode */}
            {isEditMode && formData.status && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                backgroundColor: 
                  formData.status === 'In Progress' ? '#FEF3C7' :
                  formData.status === 'Completed' ? '#D1FAE5' :
                  formData.status === 'On Hold' ? '#DBEAFE' :
                  formData.status === 'Not Started' ? '#FEE2E2' :
                  '#F3F4F6',
                color: 
                  formData.status === 'In Progress' ? '#92400E' :
                  formData.status === 'Completed' ? '#065F46' :
                  formData.status === 'On Hold' ? '#1E40AF' :
                  formData.status === 'Not Started' ? '#991B1B' :
                  '#6B7280',
                fontSize: '13px',
                fontWeight: '500',
                borderRadius: '4px'
              }}>
                {formData.status}
              </span>
            )}

            {/* Completion Progress - Only in Edit Mode */}
            {isEditMode && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginLeft: 'auto'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}>
                  Completion:
                </span>
                <div style={{
                  width: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${formData.completion}%`,
                      backgroundColor: '#10B981',
                      transition: 'width 0.3s ease',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111827',
                    minWidth: '35px'
                  }}>
                    {formData.completion}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Import Button and Mode Toggle (only show in create mode, not edit mode) */}
        {!isEditMode && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Import Button */}
            <button
              onClick={() => setShowImportModal(true)}
              title="Import from Excel"
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
              <Upload size={16} />
            </button>

            {/* Mode Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: '#F3F4F6',
              borderRadius: '6px',
              padding: '2px'
            }}>
              <button
                onClick={() => handleModeSwitch('single')}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: mode === 'single' ? '#FFFFFF' : 'transparent',
                  color: mode === 'single' ? '#1F2937' : '#6B7280',
                  boxShadow: mode === 'single' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Single Task
              </button>
              <button
                onClick={() => handleModeSwitch('bulk')}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: mode === 'bulk' ? '#FFFFFF' : 'transparent',
                  color: mode === 'bulk' ? '#1F2937' : '#6B7280',
                  boxShadow: mode === 'bulk' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Bulk Creation
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{
        height: '1px',
        backgroundColor: '#E2E6ED',
        marginBottom: '24px'
      }} />

      {/* Single Task Form Mode - Show in edit mode or when single mode selected */}
      {(isEditMode || mode === 'single') && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* SECTION 1 — TASK OVERVIEW */}
          <div style={{
            backgroundColor: '#FAFBFC',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '24px',
            marginTop: '8px'
          }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: '650',
              color: '#111827',
              margin: '0 0 20px 0',
              letterSpacing: '-0.01em'
            }}>
              Task Overview
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {/* Activity Name - NON-EDITABLE in Edit Mode */}
              <div style={{ gridColumn: 'span 1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Activity Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={activityOptions.find(opt => opt.value === formData.activityName)?.label || formData.activityName}
                    readOnly
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 12px',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: '#F9FAFB',
                      color: '#6B7280',
                      outline: 'none',
                      cursor: 'not-allowed'
                    }}
                  />
                ) : (
                  <>
                    <StandardDropdown
                      options={activityOptions}
                      value={formData.activityName}
                      onChange={(value) => handleInputChange('activityName', value as string)}
                      placeholder="Select Activity"
                      mode="single"
                      style={{ width: '100%' }}
                      error={errors.activityName}
                    />
                    {errors.activityName && (
                      <div style={{
                        fontSize: '12px',
                        color: '#DC2626',
                        marginTop: '4px'
                      }}>
                        {errors.activityName}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Task Name */}
              <div style={{ gridColumn: 'span 1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Task Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => handleInputChange('taskName', e.target.value)}
                  placeholder="Enter task name"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: errors.taskName ? '1px solid #DC2626' : '1px solid #D8DEE8',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    outline: 'none'
                  }}
                />
                {errors.taskName && (
                  <div style={{
                    fontSize: '12px',
                    color: '#DC2626',
                    marginTop: '4px'
                  }}>
                    {errors.taskName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2 — SCOPE */}
          <div style={{
            backgroundColor: '#FAFBFC',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '24px',
            marginTop: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '650',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Scope
              </h3>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div className="info-icon-container">
                  <Info size={16} style={{ color: '#6B7280', cursor: 'help' }} />
                  <div className="info-tooltip">
                    {isEditMode ? 'Values required for Task ID generation are non-editable' : 'Value required for Task Code generation is marked as mandatory.'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {/* Scope */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Scope
                </label>
                <StandardDropdown
                  options={PHASE_OPTIONS}
                  value={formData.phase}
                  onChange={(value) => handleInputChange('phase', value as string)}
                  placeholder="Select Scope"
                  mode="single"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Discipline */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Discipline <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <StandardDropdown
                  options={DISCIPLINE_OPTIONS}
                  value={formData.discipline}
                  onChange={(value) => handleInputChange('discipline', value as string)}
                  placeholder="Select Discipline"
                  mode="single"
                  style={{ width: '100%' }}
                  disabled={isEditMode}
                />
              </div>

              {/* Trade Package */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Trade Package
                </label>
                <StandardDropdown
                  options={TRADE_PACKAGE_OPTIONS}
                  value={formData.tradePackage}
                  onChange={(value) => handleInputChange('tradePackage', value as string)}
                  placeholder="Select Trade Package"
                  mode="single"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Sub-Contractor */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Sub-Contractor
                </label>
                <StandardDropdown
                  options={SUBCONTRACTOR_OPTIONS}
                  value={formData.subContractor}
                  onChange={(value) => handleInputChange('subContractor', value as string)}
                  placeholder="Select Sub-Contractor"
                  mode="single"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 — CODING DIMENSIONS */}
          <div style={{
            backgroundColor: '#FAFBFC',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '24px',
            marginTop: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '650',
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Coding Dimensions
              </h3>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div className="info-icon-container">
                  <Info size={16} style={{ color: '#6B7280', cursor: 'help' }} />
                  <div className="info-tooltip">
                    {isEditMode ? 'Values required for Task ID/ Cost Code generation are non-editable' : 'Value required for Task Code/ Cost Code generation is marked as mandatory.'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {/* Delivery Package */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Delivery Package <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <StandardDropdown
                  options={DELIVERY_PACKAGE_OPTIONS}
                  value={formData.deliveryPackage}
                  onChange={(value) => handleInputChange('deliveryPackage', value as string)}
                  placeholder="Select Delivery Package"
                  mode="single"
                  style={{ width: '100%' }}
                  disabled={isEditMode}
                />
              </div>

              {/* Area */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Area <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <StandardDropdown
                  options={AREA_OPTIONS}
                  value={formData.area}
                  onChange={(value) => handleInputChange('area', value as string)}
                  placeholder="Select Area"
                  mode="single"
                  style={{ width: '100%' }}
                  disabled={isEditMode}
                />
              </div>

              {/* Building */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Building
                </label>
                <StandardDropdown
                  options={BUILDING_OPTIONS}
                  value={formData.building}
                  onChange={(value) => handleInputChange('building', value as string)}
                  placeholder="Select Building"
                  mode="single"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Tranche */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Tranche
                </label>
                <StandardDropdown
                  options={TRANCHE_OPTIONS}
                  value={formData.tranche}
                  onChange={(value) => handleInputChange('tranche', value as string)}
                  placeholder="Select Tranche"
                  mode="single"
                  style={{ width: '100%' }}
                />
              </div>

              {/* SPA */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  SPA <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <StandardDropdown
                  options={SPA_OPTIONS}
                  value={formData.spa}
                  onChange={(value) => handleInputChange('spa', value as string)}
                  placeholder="Select SPA"
                  mode="single"
                  style={{ width: '100%' }}
                  disabled={isEditMode}
                />
              </div>

              {/* Cost Type */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Cost Type
                </label>
                <StandardDropdown
                  options={COST_TYPE_OPTIONS}
                  value={formData.costType}
                  onChange={(value) => handleInputChange('costType', value as string)}
                  placeholder="Select Cost Type"
                  mode="single"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4 — PLANNING & BUDGET */}
          <PlanningBudgetSection
            isEditMode={isEditMode}
            formData={formData}
            selectedUOM={selectedUOM}
            handleInputChange={handleInputChange}
          />

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E2E6ED'
          }}>
            <button
              onClick={handleCancel}
              style={{
                height: '40px',
                padding: '0 24px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{
                height: '40px',
                padding: '0 24px',
                backgroundColor: '#FD4314',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              {isEditMode ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Bulk Creation Mode - Only show when not in edit mode */}
      {!isEditMode && mode === 'bulk' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Info message */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '4px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#1E40AF'
          }}>
            💡 All mandatory fields are marked with <span style={{ color: '#FD4314', fontWeight: '600' }}>*</span>
          </div>

          {/* Editable Table */}
          <div style={{
            backgroundColor: '#FAFAFA',
            border: '1px solid #C8D9EE',
            borderRadius: '4px',
            overflowX: 'auto',
            overflowY: 'visible'
          }}>
            <table style={{
              width: '100%',
              minWidth: '2000px',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#E4EEFE',
                  borderBottom: '1px solid #C8D9EE'
                }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>
                    Task Name <span style={{ color: '#FD4314' }}>*</span>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '200px' }}>
                    Activity Name <span style={{ color: '#FD4314' }}>*</span>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>
                    Scope
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>
                    Discipline
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '150px' }}>
                    Trade Package
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '160px' }}>
                    Sub-Contractor
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '150px' }}>
                    Delivery Package
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>
                    Area
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>
                    Building
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '110px' }}>
                    Tranche
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '100px' }}>
                    SPA
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>
                    Cost Type
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>
                    Budget Cost (EUR) <span style={{ color: '#FD4314' }}>*</span>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '120px' }}>
                    Budget Qty (UOM) <span style={{ color: '#FD4314' }}>*</span>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>
                    Budget Man-hrs (hrs) <span style={{ color: '#FD4314' }}>*</span>
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>
                    Baseline Start
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '140px' }}>
                    Baseline Finish
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', minWidth: '80px' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bulkRows.map((row, index) => (
                  <tr 
                    key={row.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                      borderBottom: '1px solid #C8D9EE'
                    }}
                  >
                    {/* Task Name */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <input
                        type="text"
                        value={row.taskName}
                        onChange={(e) => handleBulkCellChange(row.id, 'taskName', e.target.value)}
                        placeholder="Enter task name"
                        style={{
                          width: '100%',
                          height: '32px',
                          padding: '0 8px',
                          border: '1px solid #D8DEE8',
                          borderRadius: '3px',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </td>
                    {/* Activity Name */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <select
                        value={row.activityName}
                        onChange={(e) => handleBulkCellChange(row.id, 'activityName', e.target.value)}
                        style={{
                          width: '100%',
                          height: '32px',
                          padding: '0 8px',
                          border: '1px solid #D8DEE8',
                          borderRadius: '3px',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select activity</option>
                        {activityOptions.map(activity => (
                          <option key={activity.value} value={activity.value}>
                            {activity.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Scope */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={PHASE_OPTIONS}
                        value={row.phase}
                        onChange={(value) => handleBulkCellChange(row.id, 'phase', value as string)}
                        placeholder="Select scope"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Discipline */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={DISCIPLINE_OPTIONS}
                        value={row.discipline}
                        onChange={(value) => handleBulkCellChange(row.id, 'discipline', value as string)}
                        placeholder="Select discipline"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Trade Package */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={TRADE_PACKAGE_OPTIONS}
                        value={row.tradePackage}
                        onChange={(value) => handleBulkCellChange(row.id, 'tradePackage', value as string)}
                        placeholder="Select trade package"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Sub-Contractor */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={SUBCONTRACTOR_OPTIONS}
                        value={row.subContractor}
                        onChange={(value) => handleBulkCellChange(row.id, 'subContractor', value as string)}
                        placeholder="Select sub-contractor"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Delivery Package */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={DELIVERY_PACKAGE_OPTIONS}
                        value={row.deliveryPackage}
                        onChange={(value) => handleBulkCellChange(row.id, 'deliveryPackage', value as string)}
                        placeholder="Select delivery package"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Area */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={AREA_OPTIONS}
                        value={row.area}
                        onChange={(value) => handleBulkCellChange(row.id, 'area', value as string)}
                        placeholder="Select area"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Building */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={BUILDING_OPTIONS}
                        value={row.building}
                        onChange={(value) => handleBulkCellChange(row.id, 'building', value as string)}
                        placeholder="Select building"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Tranche */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={TRANCHE_OPTIONS}
                        value={row.tranche}
                        onChange={(value) => handleBulkCellChange(row.id, 'tranche', value as string)}
                        placeholder="Select tranche"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* SPA */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={SPA_OPTIONS}
                        value={row.spa}
                        onChange={(value) => handleBulkCellChange(row.id, 'spa', value as string)}
                        placeholder="Select SPA"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Cost Type */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <StandardDropdown
                        options={COST_TYPE_OPTIONS}
                        value={row.costType}
                        onChange={(value) => handleBulkCellChange(row.id, 'costType', value as string)}
                        placeholder="Select cost type"
                        mode="single"
                        style={{ width: '100%', minHeight: '32px', fontSize: '13px' }}
                      />
                    </td>
                    {/* Budget Cost */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '13px',
                          color: '#6B7280',
                          pointerEvents: 'none',
                          fontWeight: '500'
                        }}>€</span>
                        <input
                          type="number"
                          value={row.budgetCost}
                          onChange={(e) => handleBulkCellChange(row.id, 'budgetCost', e.target.value)}
                          placeholder="0.00"
                          style={{
                            width: '100%',
                            height: '32px',
                            padding: '0 8px 0 24px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '3px',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </td>
                    {/* Budget Qty */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={row.budgetQty}
                          onChange={(e) => handleBulkCellChange(row.id, 'budgetQty', e.target.value)}
                          placeholder="0.00"
                          style={{
                            width: '100%',
                            height: '32px',
                            padding: '0 40px 0 8px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '3px',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '13px',
                          color: '#6B7280',
                          pointerEvents: 'none',
                          fontWeight: '500'
                        }}>m²</span>
                      </div>
                    </td>
                    {/* Budget Man-Hours */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={row.budgetManHours}
                          onChange={(e) => handleBulkCellChange(row.id, 'budgetManHours', e.target.value)}
                          placeholder="0.00"
                          style={{
                            width: '100%',
                            height: '32px',
                            padding: '0 40px 0 8px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '3px',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '13px',
                          color: '#6B7280',
                          pointerEvents: 'none',
                          fontWeight: '500'
                        }}>hrs</span>
                      </div>
                    </td>
                    {/* Baseline Start */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <input
                        type="date"
                        value={row.baselineStart}
                        onChange={(e) => handleBulkCellChange(row.id, 'baselineStart', e.target.value)}
                        style={{
                          width: '100%',
                          height: '32px',
                          padding: '0 8px',
                          border: '1px solid #D8DEE8',
                          borderRadius: '3px',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    {/* Baseline Finish */}
                    <td style={{ padding: '8px', borderRight: '1px solid #C8D9EE' }}>
                      <input
                        type="date"
                        value={row.baselineFinish}
                        onChange={(e) => handleBulkCellChange(row.id, 'baselineFinish', e.target.value)}
                        style={{
                          width: '100%',
                          height: '32px',
                          padding: '0 8px',
                          border: '1px solid #D8DEE8',
                          borderRadius: '3px',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    {/* Action - Delete Button */}
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button
                        onClick={() => removeBulkRow(row.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          backgroundColor: '#FEE2E2',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#DC2626',
                          margin: '0 auto'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                        title="Delete row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Rows Button */}
          <div>
            <button
              onClick={addBulkRow}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid #D8DEE8',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <Plus size={16} />
              Add Row
            </button>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #E2E6ED'
          }}>
            <button
              onClick={handleCancel}
              style={{
                height: '40px',
                padding: '0 24px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{
                height: '40px',
                padding: '0 24px',
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
              Add
            </button>
          </div>
        </div>
      )}

      {/* Import Files Modal */}
      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        projectId={projectId}
      />
    </div>
  );
}
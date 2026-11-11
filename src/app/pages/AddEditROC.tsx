import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Plus, Trash2, Info, AlertCircle } from 'lucide-react';
import StandardDropdown from '../components/StandardDropdown';
import { toast } from 'sonner';

interface SubStep {
  name: string;
  weightage: number;
}

interface ROCStep {
  id: string;
  stepName: string;
  measurementType: string;
  stepWeightage: number;
  subSteps: SubStep[];
}

// Mock data for ROC (matching ROCList data)
const MOCK_ROC_DATA: Record<string, any> = {
  '1': {
    id: 1,
    rocId: 'FO-01',
    activityName: 'Whitewash',
    uom: 'SQM',
    status: 'Active',
    isInUse: false,
    isQuantityDescriptor: true,
    steps: [
      { id: '1', stepName: 'Prepare / Set Out', measurementType: 'Percentage-Based', stepWeightage: 10, subSteps: [] },
      { id: '2', stepName: 'Installation', measurementType: 'Percentage-Based', stepWeightage: 60, subSteps: [] },
      { id: '3', stepName: 'QA & Sign Off', measurementType: 'Percentage-Based', stepWeightage: 30, subSteps: [] },
    ]
  },
  '2': {
    id: 2,
    rocId: 'FO-64',
    activityName: 'Door sets',
    uom: 'No',
    status: 'Active',
    isInUse: true,
    isQuantityDescriptor: true,
    steps: [
      {
        id: '1',
        stepName: 'Procurement - place order',
        measurementType: 'Percentage-Based',
        stepWeightage: 10,
        subSteps: [
          { name: 'Place Order', weightage: 40 },
          { name: 'Receive Order', weightage: 35 },
          { name: 'Forward to Warehouse', weightage: 25 }
        ]
      },
      {
        id: '2',
        stepName: 'Delivery',
        measurementType: 'Percentage-Based',
        stepWeightage: 20,
        subSteps: [
          { name: 'Load Truck', weightage: 30 },
          { name: 'Transport', weightage: 50 },
          { name: 'Unload', weightage: 20 }
        ]
      },
      {
        id: '3',
        stepName: 'Installation',
        measurementType: 'Percentage-Based',
        stepWeightage: 60,
        subSteps: [
          { name: 'Frame Installation', weightage: 40 },
          { name: 'Door Hanging', weightage: 35 },
          { name: 'Hardware Fitting', weightage: 25 }
        ]
      },
      {
        id: '4',
        stepName: 'QA & Sign Off',
        measurementType: 'Percentage-Based',
        stepWeightage: 10,
        subSteps: [
          { name: 'Inspection', weightage: 60 },
          { name: 'Sign-off Documentation', weightage: 40 }
        ]
      }
    ]
  },
  '3': {
    id: 3,
    rocId: 'FO-16',
    activityName: 'Stairs',
    uom: 'No',
    status: 'Inactive',
    isInUse: false,
    isQuantityDescriptor: false,
    steps: [
      { id: '1', stepName: 'Procurement - place order', measurementType: 'Percentage-Based', stepWeightage: 10, subSteps: [] },
      { id: '2', stepName: 'Machining/Fabrication concrete', measurementType: 'Percentage-Based', stepWeightage: 15, subSteps: [] },
      { id: '3', stepName: 'Delivery', measurementType: 'Percentage-Based', stepWeightage: 10, subSteps: [] },
      { id: '4', stepName: 'Installation', measurementType: 'Percentage-Based', stepWeightage: 65, subSteps: [] },
    ]
  },
  '4': {
    id: 4,
    rocId: 'FO-12',
    activityName: 'Ceilings',
    uom: 'SQM',
    status: 'Active',
    isInUse: true,
    isQuantityDescriptor: false,
    steps: [
      {
        id: '1',
        stepName: 'Prepare / Set Out',
        measurementType: 'Percentage-Based',
        stepWeightage: 10,
        subSteps: [
          { name: 'Mark Layout', weightage: 50 },
          { name: 'Prepare Tools', weightage: 50 }
        ]
      },
      {
        id: '2',
        stepName: 'Install Sub-Grid',
        measurementType: 'Percentage-Based',
        stepWeightage: 55,
        subSteps: [
          { name: 'Install Main Runners', weightage: 50 },
          { name: 'Install Cross Tees', weightage: 50 }
        ]
      },
      {
        id: '3',
        stepName: 'Install tiles',
        measurementType: 'Percentage-Based',
        stepWeightage: 30,
        subSteps: [
          { name: 'Place Tiles', weightage: 70 },
          { name: 'Trim Edges', weightage: 30 }
        ]
      },
      {
        id: '4',
        stepName: 'QA & Sign Off',
        measurementType: 'Percentage-Based',
        stepWeightage: 5,
        subSteps: [
          { name: 'Level Check', weightage: 60 },
          { name: 'Visual Inspection', weightage: 40 }
        ]
      }
    ]
  },
  '5': {
    id: 5,
    rocId: 'FO-21',
    activityName: 'Process/Chilled Water Distribution (PCW-CWR)',
    uom: 'M',
    status: 'Active',
    isInUse: false,
    isQuantityDescriptor: false,
    steps: [
      { id: '1', stepName: 'Procurement - place order', measurementType: 'Percentage-Based', stepWeightage: 10, subSteps: [] },
      { id: '2', stepName: 'Delivery', measurementType: 'Percentage-Based', stepWeightage: 20, subSteps: [] },
      { id: '3', stepName: 'Install Pipework and Fittings', measurementType: 'Percentage-Based', stepWeightage: 45, subSteps: [] },
      { id: '4', stepName: 'Testing', measurementType: 'Percentage-Based', stepWeightage: 25, subSteps: [] },
    ]
  }
};

// Mock project status (for testing - in real app, this would come from context or API)
const MOCK_PROJECT_STATUS = 'Active'; // Can be: 'Active', 'Completed', 'Inactive'

export default function AddEditROC() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // State for ROC data
  const [rocData, setRocData] = useState<any>(null);
  const [formData, setFormData] = useState({
    rocId: '',
    activityName: '',
    uom: '',
    status: '',
    isQuantityDescriptor: false
  });

  const [rocSteps, setRocSteps] = useState<ROCStep[]>([
    {
      id: '1',
      stepName: '',
      measurementType: 'Percentage-Based',
      stepWeightage: 0,
      subSteps: []
    }
  ]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showQuantityDescriptorTooltip, setShowQuantityDescriptorTooltip] = useState(false);

  // Load ROC data when in edit mode
  useEffect(() => {
    if (isEdit && id) {
      const data = MOCK_ROC_DATA[id];
      if (data) {
        setRocData(data);
        setFormData({
          rocId: data.rocId,
          activityName: data.activityName,
          uom: data.uom,
          status: data.status,
          isQuantityDescriptor: data.isQuantityDescriptor || false
        });
        setRocSteps(data.steps);
      }
    }
  }, [id, isEdit]);

  // Determine if form is read-only
  const isReadOnly = false; // Global ROC master is always editable
  const isInUse = isEdit && rocData && rocData.isInUse;
  const isProjectInactive = false; // Not applicable for global master

  const calculateTotalWeight = () => {
    return rocSteps.reduce((total, step) => total + step.stepWeightage, 0);
  };

  const addStep = () => {
    if (isReadOnly) return;
    const newStep: ROCStep = {
      id: Date.now().toString(),
      stepName: '',
      measurementType: 'Percentage-Based',
      stepWeightage: 0,
      subSteps: []
    };
    setRocSteps([...rocSteps, newStep]);
  };

  const deleteStep = (stepId: string) => {
    if (isReadOnly) return;
    // Prevent deletion if only one step remains (Step 1 must always exist)
    if (rocSteps.length === 1) {
      return;
    }
    setRocSteps(rocSteps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, field: string, value: any) => {
    if (isReadOnly) return;
    setRocSteps(rocSteps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const addSubStep = (stepId: string) => {
    if (isReadOnly) return;
    setRocSteps(rocSteps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: [...step.subSteps, { name: '', weightage: 0 }]
        };
      }
      return step;
    }));
  };

  const updateSubStep = (stepId: string, subStepIndex: number, field: string, value: any) => {
    if (isReadOnly) return;
    setRocSteps(rocSteps.map(step => {
      if (step.id === stepId) {
        const newSubSteps = [...step.subSteps];
        newSubSteps[subStepIndex] = { ...newSubSteps[subStepIndex], [field]: value };
        return { ...step, subSteps: newSubSteps };
      }
      return step;
    }));
  };

  const deleteSubStep = (stepId: string, subStepIndex: number) => {
    if (isReadOnly) return;
    setRocSteps(rocSteps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.filter((_, idx) => idx !== subStepIndex)
        };
      }
      return step;
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    // Check Status field
    if (!formData.status) {
      errors.push('Status is required');
    }
    
    // Check if at least one step exists
    if (rocSteps.length === 0) {
      errors.push('At least one ROC step is required');
    }
    
    // Check total weight
    if (totalWeight !== 100) {
      errors.push('Total weight must equal 100%');
    }
    
    return errors;
  };

  const handleSave = () => {
    if (isReadOnly) return;
    
    const errors = validateForm();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Proceed with save
    navigate('/app/roc');
    toast.success('ROC saved successfully!');
  };

  const totalWeight = calculateTotalWeight();
  const isValidWeight = totalWeight === 100;
  const isValidStatus = !!formData.status;
  const canSubmit = !isReadOnly && isValidWeight && isValidStatus && rocSteps.length > 0;
  const weightStatus = totalWeight < 100 ? 'warning' : totalWeight > 100 ? 'error' : 'success';
  const weightColor = weightStatus === 'warning' ? '#F59E0B' : weightStatus === 'error' ? '#DC2626' : '#059669';

  // Determine status dropdown options based on isInUse
  const statusOptions = isInUse 
    ? [{ value: 'Active', label: 'Active' }] // Only Active if ROC is in use
    : [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }];

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px',
        color: '#858D9D',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px'
      }}>
        <span 
          className="cursor-pointer hover:text-[#1F2937]"
          onClick={() => navigate('/app/roc')}
        >
          ROC Master Library
        </span>
        <span>/</span>
        <span style={{ color: '#1F2937' }}>{isEdit ? 'Edit' : 'Add'} ROC</span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1F2937',
        margin: '0 0 24px 0'
      }}>
        {isEdit ? 'Edit ROC' : 'Add New ROC'}
      </h1>

      {/* Read-Only Warning Banner */}
      {isReadOnly && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px',
          backgroundColor: isInUse ? '#FEF3C7' : '#FEE2E2',
          border: `1px solid ${isInUse ? '#FDE68A' : '#FECACA'}`,
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <AlertCircle size={20} style={{ color: isInUse ? '#F59E0B' : '#DC2626', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: isInUse ? '#92400E' : '#991B1B',
              marginBottom: '4px'
            }}>
              {isInUse ? 'ROC Linked to Task - Read Only' : 'Project Inactive/Completed - Read Only'}
            </div>
            <div style={{
              fontSize: '13px',
              color: isInUse ? '#92400E' : '#991B1B'
            }}>
              {isInUse 
                ? 'This ROC is currently linked to one or more tasks and cannot be edited. To modify this ROC, please unlink it from all tasks first.'
                : 'This ROC cannot be edited because the project status is Completed or Inactive. All project activities are read-only.'
              }
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div>
        {/* Basic Information Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* ROC ID - Always non-editable in edit mode */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              ROC ID <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.rocId}
              onChange={(e) => setFormData({ ...formData, rocId: e.target.value })}
              placeholder="Enter ROC ID"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#1F2937',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                cursor: 'text'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {/* Activity Name - Read-only if isReadOnly */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Activity Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.activityName}
              onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
              placeholder="Enter activity name"
              disabled={isReadOnly}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                color: isReadOnly ? '#9CA3AF' : '#1F2937',
                outline: 'none',
                backgroundColor: isReadOnly ? '#F3F4F6' : '#FFFFFF',
                cursor: isReadOnly ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* UOM - Read-only if isReadOnly */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              UOM <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <StandardDropdown
              options={[
                { value: 'SQM', label: 'SQM' },
                { value: 'No', label: 'No' },
                { value: 'M', label: 'M' },
                { value: 'Meter', label: 'Meter' },
                { value: 'Meter Square', label: 'Meter Square' }
              ]}
              value={formData.uom}
              onChange={(value) => !isReadOnly && setFormData({ ...formData, uom: value as string })}
              placeholder="Select UOM"
              mode="single"
              disabled={isReadOnly}
            />
          </div>

          {/* Status - Only allow Inactive if NOT in use */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Status <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <StandardDropdown
              options={statusOptions}
              value={formData.status}
              onChange={(value) => !isReadOnly && setFormData({ ...formData, status: value as string })}
              placeholder="Select Status"
              mode="single"
              disabled={isReadOnly}
            />
            {isInUse && (
              <div style={{
                fontSize: '12px',
                color: '#F59E0B',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Info size={12} />
                Cannot change to Inactive while ROC is linked to tasks
              </div>
            )}
          </div>

          {/* Quantity Descriptor Checkbox */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: isReadOnly ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              padding: '10px 0'
            }}>
              <input
                type="checkbox"
                checked={formData.isQuantityDescriptor}
                onChange={(e) => !isReadOnly && setFormData({ ...formData, isQuantityDescriptor: e.target.checked })}
                disabled={isReadOnly}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isReadOnly ? 'not-allowed' : 'pointer',
                  accentColor: '#FD4314',
                  flexShrink: 0
                }}
              />
              <span style={{
                fontSize: '14px',
                color: isReadOnly ? '#9CA3AF' : '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Do you want to consider this Activity a Quantity Descriptor?
                <div 
                  style={{ position: 'relative', display: 'inline-block' }}
                  onMouseEnter={() => setShowQuantityDescriptorTooltip(true)}
                  onMouseLeave={() => setShowQuantityDescriptorTooltip(false)}
                >
                  <Info 
                    size={16} 
                    style={{ 
                      color: '#6B7280', 
                      cursor: 'help'
                    }} 
                  />
                  {showQuantityDescriptorTooltip && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      right: '0',
                      marginBottom: '8px',
                      padding: '12px',
                      backgroundColor: '#1F2937',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      width: '280px',
                      zIndex: 1000,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                      If this is marked as yes then user will be able to see this activity in the Quantity Report
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
              </span>
            </label>
          </div>
        </div>

        {/* ROC Steps Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            margin: 0
          }}>
            ROC Steps
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Total Weight Tag */}
            <div style={{
              padding: '8px 12px',
              backgroundColor: weightStatus === 'success' ? '#ECFDF5' : weightStatus === 'warning' ? '#FEF3C7' : '#FEE2E2',
              border: `1px solid ${weightStatus === 'success' ? '#A7F3D0' : weightStatus === 'warning' ? '#FDE68A' : '#FECACA'}`,
              borderRadius: '4px',
              fontSize: '13px',
              color: weightColor,
              fontWeight: '600'
            }}>
              Total Weight: {totalWeight}% {weightStatus === 'success' ? '✓' : ''}
            </div>
            {!isReadOnly && (
              <button
                onClick={addStep}
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
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <Plus size={16} />
                Add Step
              </button>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rocSteps.map((step, stepIndex) => (
            <div 
              key={step.id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '16px',
                backgroundColor: isReadOnly ? '#F9FAFB' : '#F9FAFB'
              }}
            >
              {/* Step Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1F2937',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Step {stepIndex + 1}
                  {stepIndex === 0 && (
                    <span style={{ color: '#DC2626', marginLeft: '4px' }}>*</span>
                  )}
                </div>
                {!isReadOnly && rocSteps.length > 1 && (
                  <button
                    onClick={() => deleteStep(step.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DC2626'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Step Fields Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}>
                {/* Step Name - Editable */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Step Name
                  </label>
                  <input
                    type="text"
                    value={step.stepName}
                    onChange={(e) => updateStep(step.id, 'stepName', e.target.value)}
                    placeholder="e.g., Preparation"
                    disabled={isReadOnly}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '14px',
                      color: isReadOnly ? '#9CA3AF' : '#1F2937',
                      outline: 'none',
                      backgroundColor: isReadOnly ? '#F3F4F6' : '#FFFFFF',
                      cursor: isReadOnly ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {/* Measurement Type - Read-only if isReadOnly */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Measurement Type
                  </label>
                  <StandardDropdown
                    options={[
                      { value: 'Percentage-Based', label: 'Percentage-Based' },
                      { value: 'Installed Quantity-Based', label: 'Installed Quantity-Based' }
                    ]}
                    value={step.measurementType}
                    onChange={(value) => updateStep(step.id, 'measurementType', value as string)}
                    placeholder="Select measurement type"
                    mode="single"
                    disabled={isReadOnly}
                  />
                </div>

                {/* Step Weightage - Editable */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Weightage (%)
                  </label>
                  <input
                    type="number"
                    value={step.stepWeightage}
                    onChange={(e) => updateStep(step.id, 'stepWeightage', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    max="100"
                    disabled={isReadOnly}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      fontSize: '14px',
                      color: isReadOnly ? '#9CA3AF' : '#1F2937',
                      outline: 'none',
                      backgroundColor: isReadOnly ? '#F3F4F6' : '#FFFFFF',
                      cursor: isReadOnly ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
              </div>

              {/* Sub-Steps Section */}
              {step.subSteps.length > 0 && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '12px'
                  }}>
                    Sub-Steps
                  </div>
                  
                  {/* Sub-Steps Column Headers */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr auto',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#6B7280'
                    }}>
                      Sub-Step Name
                    </label>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#6B7280'
                    }}>
                      Sub-Step Weightage (%)
                    </label>
                    <div style={{ width: '36px' }} />
                  </div>

                  {step.subSteps.map((subStep, subIndex) => (
                    <div 
                      key={subIndex}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr auto',
                        gap: '12px',
                        marginBottom: '8px'
                      }}
                    >
                      <input
                        type="text"
                        value={subStep.name}
                        onChange={(e) => updateSubStep(step.id, subIndex, 'name', e.target.value)}
                        placeholder="Enter sub-step name"
                        disabled={isReadOnly}
                        style={{
                          height: '36px',
                          padding: '0 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          color: isReadOnly ? '#9CA3AF' : '#1F2937',
                          outline: 'none',
                          backgroundColor: isReadOnly ? '#F3F4F6' : '#FFFFFF',
                          cursor: isReadOnly ? 'not-allowed' : 'text'
                        }}
                      />
                      <input
                        type="number"
                        value={subStep.weightage}
                        onChange={(e) => updateSubStep(step.id, subIndex, 'weightage', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        max="100"
                        disabled={isReadOnly}
                        style={{
                          height: '36px',
                          padding: '0 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          color: isReadOnly ? '#9CA3AF' : '#1F2937',
                          outline: 'none',
                          backgroundColor: isReadOnly ? '#F3F4F6' : '#FFFFFF',
                          cursor: isReadOnly ? 'not-allowed' : 'text'
                        }}
                      />
                      {!isReadOnly && (
                        <button
                          onClick={() => deleteSubStep(step.id, subIndex)}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#DC2626'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      {isReadOnly && <div style={{ width: '36px' }} />}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Sub-Step Button */}
              {!isReadOnly && (
                <button
                  onClick={() => addSubStep(step.id)}
                  style={{
                    marginTop: '12px',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Plus size={14} />
                  Add Sub-Step
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '24px',
        borderTop: '1px solid #E5E7EB'
      }}>
        {/* Cancel */}
        <button 
          onClick={() => navigate('/app/roc')}
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
        >
          Cancel
        </button>

        {/* Save/Add */}
        <button 
          onClick={handleSave}
          disabled={isReadOnly}
          style={{
            height: '40px',
            padding: '0 24px',
            border: 'none',
            backgroundColor: isReadOnly ? '#D1D5DB' : '#FD4314',
            color: '#FFFFFF',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isReadOnly ? 'not-allowed' : 'pointer'
          }}
        >
          {isEdit ? 'Save' : 'Add'}
        </button>
      </div>
    </div>
  );
}
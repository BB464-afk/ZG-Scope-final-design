import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Plus, Trash2, AlertCircle, X, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumbs from '../components/Breadcrumbs';

interface SubStep {
  name: string;
  weightage: number;
}

interface ROCStep {
  id: string;
  stepName: string;
  stepWeightage: number;
  subSteps: SubStep[];
}

// Mock data - in real app, fetch by ID
const MOCK_PROJECT_ROCS = [
  { 
    id: 1, 
    rocId: 'FO-01', 
    activityName: 'Whitewash', 
    uom: 'SQM',
    step1: { main: 'Prepare / Set Out', weightage: 10, subSteps: [] },
    step2: { main: 'Installation', weightage: 60, subSteps: [] },
    step3: { main: 'QA & Sign Off', weightage: 30, subSteps: [] },
    step4: { main: '', weightage: 0, subSteps: [] },
    total: 100,
    linkedToTask: true,
    usedInTaskCount: 3,
    hasSubSteps: false,
    status: 'Active',
    isQuantityDescriptor: true
  },
  { 
    id: 2, 
    rocId: 'FO-64', 
    activityName: 'Door sets', 
    uom: 'No',
    step1: { 
      main: 'Procurement - place order', 
      weightage: 10,
      subSteps: [
        { name: 'Place Order', weightage: 40 },
        { name: 'Receive Order', weightage: 35 },
        { name: 'Forward to Warehouse', weightage: 25 }
      ]
    },
    step2: { 
      main: 'Delivery', 
      weightage: 20,
      subSteps: [
        { name: 'Load Truck', weightage: 30 },
        { name: 'Transport', weightage: 50 },
        { name: 'Unload', weightage: 20 }
      ]
    },
    step3: { 
      main: 'Installation', 
      weightage: 60,
      subSteps: [
        { name: 'Frame Installation', weightage: 40 },
        { name: 'Door Hanging', weightage: 35 },
        { name: 'Hardware Fitting', weightage: 25 }
      ]
    },
    step4: { 
      main: 'QA & Sign Off', 
      weightage: 10,
      subSteps: [
        { name: 'Inspection', weightage: 60 },
        { name: 'Sign-off Documentation', weightage: 40 }
      ]
    },
    total: 100,
    linkedToTask: true,
    usedInTaskCount: 12,
    hasSubSteps: true,
    status: 'Active',
    isQuantityDescriptor: true
  },
  { 
    id: 3, 
    rocId: 'FO-21', 
    activityName: 'Process/Chilled Water Distribution (PCW-CWR)', 
    uom: 'M',
    step1: { main: 'Procurement - place order', weightage: 10, subSteps: [] },
    step2: { main: 'Delivery', weightage: 20, subSteps: [] },
    step3: { main: 'Install Pipework and Fittings', weightage: 45, subSteps: [] },
    step4: { main: 'Testing', weightage: 25, subSteps: [] },
    total: 100,
    linkedToTask: false,
    usedInTaskCount: 0,
    hasSubSteps: false,
    status: 'Active',
    isQuantityDescriptor: false
  },
  { 
    id: 4, 
    rocId: 'FO-12', 
    activityName: 'Ceilings', 
    uom: 'SQM',
    step1: { 
      main: 'Prepare / Set Out', 
      weightage: 10,
      subSteps: [
        { name: 'Mark Layout', weightage: 50 },
        { name: 'Prepare Tools', weightage: 50 }
      ]
    },
    step2: { 
      main: 'Install Sub-Grid', 
      weightage: 55,
      subSteps: [
        { name: 'Install Main Runners', weightage: 50 },
        { name: 'Install Cross Tees', weightage: 50 }
      ]
    },
    step3: { 
      main: 'Install tiles', 
      weightage: 30,
      subSteps: [
        { name: 'Place Tiles', weightage: 70 },
        { name: 'Trim Edges', weightage: 30 }
      ]
    },
    step4: { 
      main: 'QA & Sign Off', 
      weightage: 5,
      subSteps: [
        { name: 'Level Check', weightage: 60 },
        { name: 'Visual Inspection', weightage: 40 }
      ]
    },
    total: 100,
    linkedToTask: false,
    usedInTaskCount: 0,
    hasSubSteps: true,
    status: 'Inactive',
    isQuantityDescriptor: false
  }
];

// Mock project data - in real app, fetch from context or API
const MOCK_PROJECT = {
  id: 'PROJ001',
  name: 'ABC Tower Construction',
  status: 'Active' // Can be 'Active', 'Completed', 'Inactive'
};

export default function EditActivityROC() {
  const navigate = useNavigate();
  const { projectId, activityId } = useParams();
  
  const [rocToEdit, setRocToEdit] = useState<any>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['1']));
  const [projectStatus] = useState(MOCK_PROJECT.status);
  const [isQuantityDescriptor, setIsQuantityDescriptor] = useState(false);
  const [showQuantityDescriptorTooltip, setShowQuantityDescriptorTooltip] = useState(false);

  useEffect(() => {
    // Fetch ROC by activityId - mock implementation
    const roc = MOCK_PROJECT_ROCS.find(r => r.id === Number(activityId));
    if (roc) {
      setRocToEdit(roc);
      setIsQuantityDescriptor(roc.isQuantityDescriptor);
    }
  }, [activityId]);

  // Determine if form should be read-only
  const isProjectInactive = projectStatus === 'Completed' || projectStatus === 'Inactive';
  const isROCLinkedToTask = rocToEdit?.linkedToTask || false;
  const isReadOnly = isProjectInactive || isROCLinkedToTask;

  const convertToSteps = (roc: any): ROCStep[] => {
    if (!roc) return [{ id: '1', stepName: '', stepWeightage: 0, subSteps: [] }];
    
    const steps: ROCStep[] = [];
    
    if (roc.step1?.main || (roc.step1?.weightage || 0) > 0) {
      steps.push({
        id: '1',
        stepName: roc.step1.main,
        stepWeightage: roc.step1.weightage || 0,
        subSteps: roc.step1.subSteps || []
      });
    }
    
    if (roc.step2?.main || (roc.step2?.weightage || 0) > 0) {
      steps.push({
        id: '2',
        stepName: roc.step2.main,
        stepWeightage: roc.step2.weightage || 0,
        subSteps: roc.step2.subSteps || []
      });
    }
    
    if (roc.step3?.main || (roc.step3?.weightage || 0) > 0) {
      steps.push({
        id: '3',
        stepName: roc.step3.main,
        stepWeightage: roc.step3.weightage || 0,
        subSteps: roc.step3.subSteps || []
      });
    }
    
    if (roc.step4?.main || (roc.step4?.weightage || 0) > 0) {
      steps.push({
        id: '4',
        stepName: roc.step4.main,
        stepWeightage: roc.step4.weightage || 0,
        subSteps: roc.step4.subSteps || []
      });
    }
    
    return steps.length > 0 ? steps : [{
      id: '1',
      stepName: '',
      stepWeightage: 0,
      subSteps: []
    }];
  };

  const [rocSteps, setRocSteps] = useState<ROCStep[]>([{
    id: '1',
    stepName: '',
    stepWeightage: 0,
    subSteps: []
  }]);

  useEffect(() => {
    if (rocToEdit) {
      const steps = convertToSteps(rocToEdit);
      setRocSteps(steps);
    }
  }, [rocToEdit]);

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const addStep = () => {
    if (rocSteps.length >= 4) {
      toast.error('Maximum 4 steps allowed');
      return;
    }
    const newId = (Math.max(...rocSteps.map(s => parseInt(s.id))) + 1).toString();
    setRocSteps([...rocSteps, {
      id: newId,
      stepName: '',
      stepWeightage: 0,
      subSteps: []
    }]);
    setExpandedSteps(new Set([...expandedSteps, newId]));
  };

  const deleteStep = (stepId: string) => {
    if (rocSteps.length <= 1) {
      toast.error('At least one step is required');
      return;
    }
    setRocSteps(rocSteps.filter(s => s.id !== stepId));
    const newExpanded = new Set(expandedSteps);
    newExpanded.delete(stepId);
    setExpandedSteps(newExpanded);
  };

  const updateStep = (stepId: string, field: string, value: any) => {
    setRocSteps(rocSteps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const addSubStep = (stepId: string) => {
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

  const deleteSubStep = (stepId: string, subIndex: number) => {
    setRocSteps(rocSteps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.filter((_, idx) => idx !== subIndex)
        };
      }
      return step;
    }));
  };

  const updateSubStep = (stepId: string, subIndex: number, field: string, value: any) => {
    setRocSteps(rocSteps.map(step => {
      if (step.id === stepId) {
        const newSubSteps = [...step.subSteps];
        newSubSteps[subIndex] = { ...newSubSteps[subIndex], [field]: value };
        return { ...step, subSteps: newSubSteps };
      }
      return step;
    }));
  };

  const calculateTotalWeightage = () => {
    return rocSteps.reduce((sum, step) => sum + (step.stepWeightage || 0), 0);
  };

  const calculateSubStepTotal = (stepId: string) => {
    const step = rocSteps.find(s => s.id === stepId);
    if (!step) return 0;
    return step.subSteps.reduce((sum, sub) => sum + (sub.weightage || 0), 0);
  };

  const handleSave = () => {
    // Validation
    const total = calculateTotalWeightage();
    if (total !== 100) {
      toast.error(`Total weightage must be 100% (currently ${total}%)`);
      return;
    }

    // Check if all steps have names
    const emptySteps = rocSteps.filter(s => !s.stepName.trim());
    if (emptySteps.length > 0) {
      toast.error('All steps must have a name');
      return;
    }

    // Check substeps total to 100% for each step
    for (const step of rocSteps) {
      if (step.subSteps.length > 0) {
        const subTotal = calculateSubStepTotal(step.id);
        if (subTotal !== 100) {
          toast.error(`Sub-steps in "${step.stepName}" must total 100% (currently ${subTotal}%)`);
          return;
        }
      }
    }

    toast.success('Activity updated successfully');
    navigate(`/app/projects/${projectId}/settings/activities`);
  };

  const handleCancel = () => {
    navigate(`/app/projects/${projectId}/settings/activities`);
  };

  const breadcrumbItems = [
    { label: 'Activities', path: `/app/projects/${projectId}/settings/activities` },
    { label: 'Edit Activity' }
  ];

  if (!rocToEdit) {
    return (
      <div style={{
        width: '100%',
        backgroundColor: '#F7F9FC',
        padding: '32px 48px',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          Loading activity...
        </div>
      </div>
    );
  }

  const totalWeightage = calculateTotalWeightage();

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '32px 48px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div style={{
          marginBottom: '24px'
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 4px 0'
          }}>
            Edit Activity: {rocToEdit.activityName}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            ROC ID: {rocToEdit.rocId} | UOM: {rocToEdit.uom}
          </p>
        </div>

        {/* Warning Banners for Read-Only Mode */}
        {isProjectInactive && (
          <div style={{
            padding: '16px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FEE2E2',
            borderRadius: '4px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#991B1B',
                margin: '0 0 4px 0'
              }}>
                Project {projectStatus} - Read-Only Mode
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#7F1D1D',
                margin: '0'
              }}>
                This ROC cannot be edited because the project is {projectStatus}. All fields are read-only.
              </p>
            </div>
          </div>
        )}
        
        {!isProjectInactive && isROCLinkedToTask && (
          <div style={{
            padding: '16px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '4px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircle size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#92400E',
                margin: '0 0 4px 0'
              }}>
                ROC Linked to Tasks - Read-Only Mode
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#78350F',
                margin: '0'
              }}>
                This ROC is currently linked to {rocToEdit.usedInTaskCount} task{rocToEdit.usedInTaskCount > 1 ? 's' : ''}. The ROC ID cannot be modified, but you can still edit step names, weightages, and sub-steps.
              </p>
            </div>
          </div>
        )}

        {/* Guidelines Button */}
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            backgroundColor: '#E4EEFE',
            border: '1px solid #D8DEE8',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            color: '#272721',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(228, 238, 254, 0.8)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E4EEFE'}
        >
          <Info size={16} />
          {showGuidelines ? 'Hide' : 'Show'} Guidelines
        </button>

        {/* Guidelines Panel */}
        {showGuidelines && (
          <div style={{
            padding: '16px',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '4px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#92400E'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#78350F' }}>ROC Configuration Guidelines:</h3>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Total step weightages must equal 100%</li>
              <li style={{ marginBottom: '8px' }}>Each step can have optional sub-steps</li>
              <li style={{ marginBottom: '8px' }}>If sub-steps are added, their weightages must total 100%</li>
              <li style={{ marginBottom: '8px' }}>You can have up to 4 main steps per ROC</li>
              <li>All steps must have a descriptive name</li>
            </ul>
          </div>
        )}

        {/* Quantity Descriptor Checkbox Section */}
        <div style={{
          padding: '16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          marginBottom: '24px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: isReadOnly ? 'not-allowed' : 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={isQuantityDescriptor}
              onChange={(e) => !isReadOnly && setIsQuantityDescriptor(e.target.checked)}
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
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    padding: '12px',
                    backgroundColor: '#1F2937',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    width: '280px',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    whiteSpace: 'normal'
                  }}>
                    If this is marked as yes then user will be able to see this activity in the Quantity Report
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
            </span>
          </label>
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
              backgroundColor: totalWeightage === 100 ? '#ECFDF5' : (totalWeightage > 100 ? '#FEE2E2' : '#FEF3C7'),
              border: `1px solid ${totalWeightage === 100 ? '#A7F3D0' : (totalWeightage > 100 ? '#FECACA' : '#FDE68A')}`,
              borderRadius: '4px',
              fontSize: '13px',
              color: totalWeightage === 100 ? '#047857' : (totalWeightage > 100 ? '#DC2626' : '#B45309'),
              fontWeight: '600'
            }}>
              Total Weight: {totalWeightage}% {totalWeightage === 100 ? '✓' : ''}
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
                gridTemplateColumns: '2fr 1fr',
                gap: '12px',
                marginBottom: '12px'
              }}>
                {/* Step Name */}
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

                {/* Step Weightage */}
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
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Sub-Steps</span>
                    <span style={{
                      fontSize: '12px',
                      color: calculateSubStepTotal(step.id) === 100 ? '#10B981' : '#F59E0B',
                      fontWeight: '500'
                    }}>
                      Total: {calculateSubStepTotal(step.id)}%
                      {calculateSubStepTotal(step.id) !== 100 && ' (must equal 100%)'}
                    </span>
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
                      Weightage (%)
                    </label>
                    <div style={{ width: '32px' }}></div>
                  </div>

                  {/* Sub-Steps Rows */}
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
                        placeholder="Sub-step name"
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
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Sub-Step Button */}
                  {!isReadOnly && (
                    <button
                      onClick={() => addSubStep(step.id)}
                      style={{
                        marginTop: '8px',
                        height: '32px',
                        padding: '0 12px',
                        border: '1px solid #D1D5DB',
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
              )}

              {/* Add Sub-Step Button (when no sub-steps exist) */}
              {!isReadOnly && step.subSteps.length === 0 && (
                <div style={{ marginTop: '12px' }}>
                  <button
                    onClick={() => addSubStep(step.id)}
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      border: '1px solid #D1D5DB',
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
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <button
            onClick={handleCancel}
            style={{
              height: '40px',
              padding: '0 24px',
              border: '1px solid #D8DEE8',
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
            onClick={handleSave}
            disabled={totalWeightage !== 100 || isReadOnly}
            style={{
              height: '40px',
              padding: '0 24px',
              border: 'none',
              backgroundColor: (totalWeightage === 100 && !isReadOnly) ? '#FD4314' : '#D1D5DB',
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: (totalWeightage === 100 && !isReadOnly) ? 'pointer' : 'not-allowed',
              opacity: (totalWeightage === 100 && !isReadOnly) ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (totalWeightage === 100 && !isReadOnly) {
                e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (totalWeightage === 100 && !isReadOnly) {
                e.currentTarget.style.backgroundColor = '#FD4314';
              }
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
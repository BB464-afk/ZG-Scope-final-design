import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Plus, Trash2, Info, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumbs from '../components/Breadcrumbs';

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

export default function EditProjectROC() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  
  const [rocToEdit, setRocToEdit] = useState<any>(null);
  const [fromReview, setFromReview] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['1']));
  const [rocStatus, setRocStatus] = useState('Active');
  const [isQuantityDescriptor, setIsQuantityDescriptor] = useState(false);
  const [showQuantityDescriptorTooltip, setShowQuantityDescriptorTooltip] = useState(false);
  
  // Mock project status - in real app, fetch from project API
  const [projectStatus] = useState('Active'); // Could be: 'Active', 'Completed', 'Inactive'
  
  // Determine if form should be read-only
  const isProjectReadOnly = projectStatus === 'Completed' || projectStatus === 'Inactive';
  const isLinkedToTask = rocToEdit?.linkedToTask || false;
  const isReadOnly = isProjectReadOnly || isLinkedToTask;

  useEffect(() => {
    if (location.state?.roc) {
      setRocToEdit(location.state.roc);
      setFromReview(location.state.fromReview || false);
    }
  }, [location.state]);

  const convertToSteps = (roc: any): ROCStep[] => {
    if (!roc) return [{ id: '1', stepName: '', measurementType: 'Percentage-Based', stepWeightage: 0, subSteps: [] }];
    
    const steps: ROCStep[] = [];
    
    if (roc.step1?.main || (roc.step1?.weightage || 0) > 0) {
      steps.push({
        id: '1',
        stepName: roc.step1.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step1.weightage || 0,
        subSteps: roc.step1.subSteps || []
      });
    }
    
    if (roc.step2?.main || (roc.step2?.weightage || 0) > 0) {
      steps.push({
        id: '2',
        stepName: roc.step2.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step2.weightage || 0,
        subSteps: roc.step2.subSteps || []
      });
    }
    
    if (roc.step3?.main || (roc.step3?.weightage || 0) > 0) {
      steps.push({
        id: '3',
        stepName: roc.step3.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step3.weightage || 0,
        subSteps: roc.step3.subSteps || []
      });
    }
    
    if (roc.step4?.main || (roc.step4?.weightage || 0) > 0) {
      steps.push({
        id: '4',
        stepName: roc.step4.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step4.weightage || 0,
        subSteps: roc.step4.subSteps || []
      });
    }
    
    return steps.length > 0 ? steps : [{
      id: '1',
      stepName: '',
      measurementType: 'Percentage-Based',
      stepWeightage: 0,
      subSteps: []
    }];
  };

  const [rocSteps, setRocSteps] = useState<ROCStep[]>([{
    id: '1',
    stepName: '',
    measurementType: 'Percentage-Based',
    stepWeightage: 0,
    subSteps: []
  }]);

  useEffect(() => {
    if (rocToEdit) {
      const steps = convertToSteps(rocToEdit);
      setRocSteps(steps);
      setIsQuantityDescriptor(rocToEdit.isQuantityDescriptor || false);
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
      measurementType: 'Percentage-Based',
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

  const updateSubStep = (stepId: string, subStepIndex: number, field: string, value: any) => {
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
    setRocSteps(rocSteps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          subSteps: step.subSteps.filter((_, i) => i !== subStepIndex)
        };
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
        // Check if all substeps have names
        const emptySubSteps = step.subSteps.filter(ss => !ss.name.trim());
        if (emptySubSteps.length > 0) {
          toast.error(`All sub-steps in "${step.stepName}" must have a name`);
          return;
        }
      }
    }

    toast.success('ROC updated successfully');
    
    if (fromReview) {
      // Convert rocSteps back to the original format and pass back
      const updatedROC = {
        ...rocToEdit,
        step1: rocSteps[0] ? { main: rocSteps[0].stepName, weightage: rocSteps[0].stepWeightage, subSteps: rocSteps[0].subSteps } : { main: '', weightage: 0, subSteps: [] },
        step2: rocSteps[1] ? { main: rocSteps[1].stepName, weightage: rocSteps[1].stepWeightage, subSteps: rocSteps[1].subSteps } : { main: '', weightage: 0, subSteps: [] },
        step3: rocSteps[2] ? { main: rocSteps[2].stepName, weightage: rocSteps[2].stepWeightage, subSteps: rocSteps[2].subSteps } : { main: '', weightage: 0, subSteps: [] },
        step4: rocSteps[3] ? { main: rocSteps[3].stepName, weightage: rocSteps[3].stepWeightage, subSteps: rocSteps[3].subSteps } : { main: '', weightage: 0, subSteps: [] },
        hasSubSteps: rocSteps.some(s => s.subSteps.length > 0),
        isQuantityDescriptor: isQuantityDescriptor
      };
      navigate(`/app/projects/${projectId}/settings/activities/review-rocs`, {
        state: { updatedROC }
      });
    } else {
      navigate(`/app/projects/${projectId}/settings/activities`);
    }
  };

  const handleCancel = () => {
    if (fromReview) {
      navigate(`/app/projects/${projectId}/settings/activities/review-rocs`);
    } else {
      navigate(`/app/projects/${projectId}/settings/activities`);
    }
  };

  const breadcrumbItems = fromReview ? [
    { label: 'Project Activities', path: `/app/projects/${projectId}/settings/activities` },
    { label: 'Add from Master', path: `/app/projects/${projectId}/settings/activities/add-from-master` },
    { label: 'Configure ROCs for Your Project', path: `/app/projects/${projectId}/settings/activities/review-rocs` },
    { label: 'Edit ROC' }
  ] : [
    { label: 'Project Activities', path: `/app/projects/${projectId}/settings/activities` },
    { label: 'Edit ROC' }
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
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Loading...</p>
      </div>
    );
  }

  const totalWeightage = calculateTotalWeightage();

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px 80px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Read-Only Warning Banner */}
      {isReadOnly && (
        <div style={{
          backgroundColor: isLinkedToTask ? '#FFF4ED' : '#FEF2F2',
          border: `1px solid ${isLinkedToTask ? '#FED7AA' : '#FECACA'}`,
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertCircle 
            size={20} 
            style={{ 
              color: isLinkedToTask ? '#F97316' : '#EF4444',
              flexShrink: 0,
              marginTop: '2px'
            }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#272721',
              marginBottom: '4px'
            }}>
              {isLinkedToTask ? 'ROC Linked to Task - Read Only' : 'Project Completed/Inactive - Read Only'}
            </div>
            <div style={{
              fontSize: '13px',
              color: isLinkedToTask ? '#92400E' : '#991B1B'
            }}>
              {isLinkedToTask 
                ? 'This ROC is currently linked to one or more tasks and cannot be edited. To modify this ROC, please unlink it from all tasks first.'
                : 'This ROC cannot be edited because the project status is Completed or Inactive. All project activities are read-only.'
              }
            </div>
          </div>
        </div>
      )}

      {/* Header with Info Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          margin: 0
        }}>
          Edit ROC Configuration
        </h1>
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          title="View Step Configuration Guidelines"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            color: '#6B7280'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
        >
          <Info size={18} />
        </button>
        <div style={{
          fontSize: '13px',
          color: '#6B7280',
          marginLeft: '8px'
        }}>
          <span style={{ fontWeight: '600', color: '#272721' }}>ROC ID:</span> {rocToEdit.rocId}
          <span style={{ margin: '0 12px', color: '#D1D5DB' }}>|</span>
          <span style={{ fontWeight: '600', color: '#272721' }}>Activity Name:</span> {rocToEdit.activityName}
        </div>
      </div>

      {/* Step Configuration Guidelines - Shows above ROC Steps when info icon clicked */}
      {showGuidelines && (
        <div style={{
          backgroundColor: '#FFF4ED',
          border: '1px solid #FED7AA',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#272721',
            marginBottom: '12px'
          }}>
            Step configuration guidelines
          </div>
          <ul style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: 0,
            paddingLeft: '20px',
            lineHeight: '1.8'
          }}>
            <li>Total step weightage must equal 100%</li>
            <li>Sub-steps within each step must total 100%</li>
            <li>You can add up to 4 main steps</li>
            <li>Sub-steps are optional but help track detailed progress</li>
            <li>All steps and sub-steps must have names</li>
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
            Do you want this to be Quantity Descriptor?
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
                  If this is marked as yes then the user will be able to see this activity in Quantity Report
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
        backgroundColor: '#F7F9FC',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#272721',
            margin: 0
          }}>
            ROC Steps
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#6B7280'
              }}>
                Total Weight:
              </span>
              <span style={{
                padding: '4px 12px',
                backgroundColor: totalWeightage === 100 ? '#10B981' : '#EF4444',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {totalWeightage}%
              </span>
            </div>
            <button
              onClick={addStep}
              style={{
                height: '32px',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '500',
                color: rocSteps.length >= 4 ? '#9CA3AF' : '#272721',
                backgroundColor: '#FFFFFF',
                border: rocSteps.length >= 4 ? '1px solid #D1D5DB' : '1px solid #E2E8F0',
                borderRadius: '4px',
                cursor: rocSteps.length >= 4 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: rocSteps.length >= 4 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (rocSteps.length < 4) e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                if (rocSteps.length < 4) e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Plus size={14} />
              Add Step
            </button>
          </div>
        </div>

        {/* Steps List */}
        {rocSteps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const subStepTotal = calculateSubStepTotal(step.id);
          const hasSubSteps = step.subSteps.length > 0;

          return (
            <div
              key={step.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                marginBottom: index < rocSteps.length - 1 ? '12px' : 0,
                overflow: 'hidden'
              }}
            >
              {/* Step Header - Collapsed State */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none'
                }}
                onClick={() => toggleStep(step.id)}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#6B7280'
                  }}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721'
                }}>
                  Step {index + 1} <span style={{ color: '#EF4444' }}>*</span>
                </span>
                <span style={{
                  flex: 1,
                  fontSize: '13px',
                  color: '#272721'
                }}>
                  {step.stepName || 'Untitled Step'}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6B7280',
                  minWidth: '50px',
                  textAlign: 'right'
                }}>
                  {step.stepWeightage}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStep(step.id);
                  }}
                  disabled={rocSteps.length <= 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: rocSteps.length <= 1 ? 'not-allowed' : 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: rocSteps.length <= 1 ? '#D1D5DB' : '#EF4444',
                    opacity: rocSteps.length <= 1 ? 0.4 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (rocSteps.length > 1) e.currentTarget.style.color = '#DC2626';
                  }}
                  onMouseLeave={(e) => {
                    if (rocSteps.length > 1) e.currentTarget.style.color = '#EF4444';
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Step Body - Expanded State */}
              {isExpanded && (
                <div style={{ padding: '20px' }}>
                  {/* Step Fields */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px 120px',
                    gap: '16px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Step Name <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={step.stepName}
                        onChange={(e) => updateStep(step.id, 'stepName', e.target.value)}
                        placeholder="Enter step name"
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: '#FFFFFF',
                          outline: 'none'
                        }}
                        readOnly={isReadOnly}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Measurement Type
                      </label>
                      <select
                        value={step.measurementType}
                        onChange={(e) => updateStep(step.id, 'measurementType', e.target.value)}
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                        disabled={isReadOnly}
                      >
                        <option value="Percentage Based">Percentage Based</option>
                        <option value="Quantity Based">Quantity Based</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Weightage (%) <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={step.stepWeightage}
                        onChange={(e) => updateStep(step.id, 'stepWeightage', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'left',
                          backgroundColor: '#FFFFFF',
                          outline: 'none'
                        }}
                        readOnly={isReadOnly}
                      />
                    </div>
                  </div>

                  {/* Sub-Steps Section */}
                  <div style={{
                    backgroundColor: '#FAFBFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '4px',
                    padding: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Sub-Steps
                      </span>
                      {hasSubSteps && (
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: subStepTotal === 100 ? '#10B981' : '#EF4444'
                        }}>
                          Total: {subStepTotal}%
                        </span>
                      )}
                    </div>

                    {/* Sub-Steps Header */}
                    {hasSubSteps && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 150px 40px',
                        gap: '12px',
                        marginBottom: '8px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #E2E8F0'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6B7280'
                        }}>
                          Sub-Step Name
                        </span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6B7280'
                        }}>
                          Sub-Step Weightage (%)
                        </span>
                        <span></span>
                      </div>
                    )}

                    {/* Sub-Steps List */}
                    {step.subSteps.map((subStep, subIndex) => (
                      <div
                        key={subIndex}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 150px 40px',
                          gap: '12px',
                          marginBottom: '8px',
                          alignItems: 'center'
                        }}
                      >
                        <input
                          type="text"
                          value={subStep.name}
                          onChange={(e) => updateSubStep(step.id, subIndex, 'name', e.target.value)}
                          placeholder="Enter sub-step name"
                          style={{
                            height: '36px',
                            padding: '0 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '4px',
                            fontSize: '13px',
                            backgroundColor: '#FFFFFF',
                            outline: 'none'
                          }}
                          readOnly={isReadOnly}
                        />
                        <input
                          type="number"
                          value={subStep.weightage}
                          onChange={(e) => updateSubStep(step.id, subIndex, 'weightage', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          style={{
                            height: '36px',
                            padding: '0 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '4px',
                            fontSize: '13px',
                            textAlign: 'left',
                            backgroundColor: '#FFFFFF',
                            outline: 'none'
                          }}
                          readOnly={isReadOnly}
                        />
                        <button
                          onClick={() => deleteSubStep(step.id, subIndex)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#EF4444'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#EF4444'}
                          disabled={isReadOnly}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {/* Add Sub-Step Button */}
                    <button
                      onClick={() => addSubStep(step.id)}
                      style={{
                        height: '32px',
                        padding: '0 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#FD4314',
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      disabled={isReadOnly}
                    >
                      <Plus size={14} />
                      Add Sub-Step
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 240,
        right: 0,
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #D8DEE8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 48px',
        gap: '12px',
        zIndex: 100
      }}>
        <button
          onClick={handleCancel}
          style={{
            height: '40px',
            padding: '0 24px',
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
          onClick={handleSave}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FD4314';
          }}
          disabled={isReadOnly}
        >
          Save
        </button>
      </div>
    </div>
  );
}
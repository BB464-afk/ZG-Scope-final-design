import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Plus, Trash2, AlertCircle, X, Info, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

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

interface ROCData {
  id?: number;
  configuredId?: number;
  rocId: string;
  activityName: string;
  uom: string;
  isQuantityDescriptor?: boolean;
  step1: {
    main: string;
    weight?: number;
    weightage?: number;
    subSteps?: SubStep[];
  };
  step2: {
    main: string;
    weight?: number;
    weightage?: number;
    subSteps?: SubStep[];
  };
  step3: {
    main: string;
    weight?: number;
    weightage?: number;
    subSteps?: SubStep[];
  };
  step4: {
    main: string;
    weight?: number;
    weightage?: number;
    subSteps?: SubStep[];
  };
  total?: number;
  hasSubSteps?: boolean;
}

export default function ProjectConfigROCEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use state to store the ROC data and navigation flags so they persist across renders
  const [rocToEdit, setRocToEdit] = useState<ROCData | null>(null);
  const [fromStep5, setFromStep5] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  // Load ROC data when component mounts or location changes
  useEffect(() => {
    if (location.state?.roc) {
      console.log('Loading ROC data:', location.state.roc);
      setRocToEdit(location.state.roc as ROCData);
      setFromStep5(location.state.fromStep5 || false);
    }
  }, [location.state]);

  // Detect sidebar width changes
  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('nav');
      if (sidebar) {
        setSidebarWidth(sidebar.getBoundingClientRect().width);
      }
    };

    updateSidebarWidth();
    
    // Create a ResizeObserver to watch for sidebar width changes
    const sidebar = document.querySelector('nav');
    if (sidebar) {
      const observer = new ResizeObserver(updateSidebarWidth);
      observer.observe(sidebar);
      return () => observer.disconnect();
    }
  }, []);

  const [showGuidelines, setShowGuidelines] = useState(false); // Hide guidelines by default
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['1'])); // First step expanded by default
  const [isQuantityDescriptor, setIsQuantityDescriptor] = useState(false);
  const [showQuantityDescriptorTooltip, setShowQuantityDescriptorTooltip] = useState(false);

  // Update isQuantityDescriptor when rocToEdit changes
  useEffect(() => {
    if (rocToEdit) {
      setIsQuantityDescriptor(rocToEdit.isQuantityDescriptor || false);
    }
  }, [rocToEdit]);

  // Convert incoming ROC data to form structure
  const convertToSteps = (roc: ROCData): ROCStep[] => {
    if (!roc) return [{ id: '1', stepName: '', measurementType: 'Percentage-Based', stepWeightage: 0, subSteps: [] }];
    
    const steps: ROCStep[] = [];
    
    if (roc.step1?.main || (roc.step1?.weight || roc.step1?.weightage || 0) > 0) {
      steps.push({
        id: '1',
        stepName: roc.step1.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step1.weight || roc.step1.weightage || 0,
        subSteps: roc.step1.subSteps || []
      });
    }
    
    if (roc.step2?.main || (roc.step2?.weight || roc.step2?.weightage || 0) > 0) {
      steps.push({
        id: '2',
        stepName: roc.step2.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step2.weight || roc.step2.weightage || 0,
        subSteps: roc.step2.subSteps || []
      });
    }
    
    if (roc.step3?.main || (roc.step3?.weight || roc.step3?.weightage || 0) > 0) {
      steps.push({
        id: '3',
        stepName: roc.step3.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step3.weight || roc.step3.weightage || 0,
        subSteps: roc.step3.subSteps || []
      });
    }
    
    if (roc.step4?.main || (roc.step4?.weight || roc.step4?.weightage || 0) > 0) {
      steps.push({
        id: '4',
        stepName: roc.step4.main,
        measurementType: 'Percentage-Based',
        stepWeightage: roc.step4.weight || roc.step4.weightage || 0,
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

  // Update rocSteps when rocToEdit changes
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

  const calculateTotalWeight = () => {
    return rocSteps.reduce((total, step) => total + step.stepWeightage, 0);
  };

  const addStep = () => {
    const newStep: ROCStep = {
      id: Date.now().toString(),
      stepName: '',
      measurementType: 'Percentage-Based',
      stepWeightage: 0,
      subSteps: []
    };
    setRocSteps([...rocSteps, newStep]);
    // Auto-expand the new step
    setExpandedSteps(prev => new Set([...prev, newStep.id]));
  };

  const deleteStep = (stepId: string) => {
    // Prevent deletion if only one step remains (Step 1 must always exist)
    if (rocSteps.length === 1) {
      toast.error('At least one step is required');
      return;
    }
    setRocSteps(rocSteps.filter(step => step.id !== stepId));
    // Remove from expanded set if it exists
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
          subSteps: step.subSteps.filter((_, idx) => idx !== subStepIndex)
        };
      }
      return step;
    }));
  };

  const handleSave = () => {
    const totalWeight = calculateTotalWeight();
    
    if (totalWeight !== 100) {
      toast.error(`Total weight must equal 100%. Current total: ${totalWeight}%`);
      return;
    }

    // Validate sub-steps if they exist
    for (let i = 0; i < rocSteps.length; i++) {
      if (rocSteps[i].subSteps.length > 0) {
        const subTotal = rocSteps[i].subSteps.reduce((sum, sub) => sum + sub.weightage, 0);
        if (subTotal !== 100) {
          toast.error(`Sub-steps for "${rocSteps[i].stepName}" must total 100%. Current: ${subTotal}%`);
          return;
        }
      }
    }

    // Convert back to ROC format and navigate back
    const updatedRoc = {
      ...rocToEdit,
      isQuantityDescriptor,
      step1: rocSteps[0] ? { 
        main: rocSteps[0].stepName, 
        weight: rocSteps[0].stepWeightage,
        weightage: rocSteps[0].stepWeightage, 
        subSteps: rocSteps[0].subSteps 
      } : { main: '', weight: 0, weightage: 0, subSteps: [] },
      step2: rocSteps[1] ? { 
        main: rocSteps[1].stepName, 
        weight: rocSteps[1].stepWeightage,
        weightage: rocSteps[1].stepWeightage, 
        subSteps: rocSteps[1].subSteps 
      } : { main: '', weight: 0, weightage: 0, subSteps: [] },
      step3: rocSteps[2] ? { 
        main: rocSteps[2].stepName, 
        weight: rocSteps[2].stepWeightage,
        weightage: rocSteps[2].stepWeightage, 
        subSteps: rocSteps[2].subSteps 
      } : { main: '', weight: 0, weightage: 0, subSteps: [] },
      step4: rocSteps[3] ? { 
        main: rocSteps[3].stepName, 
        weight: rocSteps[3].stepWeightage,
        weightage: rocSteps[3].stepWeightage, 
        subSteps: rocSteps[3].subSteps 
      } : { main: '', weight: 0, weightage: 0, subSteps: [] },
      total: totalWeight,
      hasSubSteps: rocSteps.some(step => step.subSteps.length > 0)
    };

    // If from Step 5, use sessionStorage for communication
    if (fromStep5) {
      sessionStorage.setItem('updatedROC_step5', JSON.stringify(updatedRoc));
      toast.success('ROC configuration saved successfully');
      navigate('/app/projects/create', { state: { returnToStep: 5 } });
    } else {
      toast.success('ROC configuration saved successfully');
      navigate(-1, { state: { updatedRoc } });
    }
  };

  const handleCancel = () => {
    if (fromStep5) {
      navigate('/app/projects/create', { state: { returnToStep: 5 } });
    } else {
      navigate(-1);
    }
  };

  const totalWeight = calculateTotalWeight();
  const isValidWeight = totalWeight === 100;
  const weightStatus = totalWeight < 100 ? 'warning' : totalWeight > 100 ? 'error' : 'success';
  const weightColor = weightStatus === 'warning' ? '#F59E0B' : weightStatus === 'error' ? '#DC2626' : '#10B981';

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* System Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(39, 39, 33, 0.08)',
        padding: '20px 48px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: 0
            }}>
              Edit ROC Configuration
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingLeft: '16px',
              borderLeft: '1px solid #D8DEE8'
            }}>
              <div>
                <span style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontWeight: '600'
                }}>ROC ID: </span>
                <span style={{
                  fontSize: '13px',
                  color: '#272721',
                  fontWeight: '600'
                }}>{rocToEdit?.rocId || 'N/A'}</span>
              </div>
              <div style={{
                width: '1px',
                height: '16px',
                backgroundColor: '#D8DEE8'
              }} />
              <div>
                <span style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontWeight: '600'
                }}>Activity Name: </span>
                <span style={{
                  fontSize: '13px',
                  color: '#272721',
                  fontWeight: '600'
                }}>{rocToEdit?.activityName || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        padding: '32px 48px 96px 48px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>

          {/* Info Banner with Close */}
          {showGuidelines && (
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(228, 238, 254, 0.5)',
              border: '1px solid #C8D9EE',
              borderRadius: '4px',
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              position: 'relative'
            }}>
              <AlertCircle size={20} style={{ color: '#FD4314', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: '0 0 6px 0',
                  fontSize: '14px',
                  color: '#272721',
                  fontWeight: '600'
                }}>
                  ROC Configuration Guidelines
                </p>
                <div style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  lineHeight: '1.6'
                }}>
                  • Total weightage across all steps must equal 100%<br />
                  • Step 1 is mandatory and cannot be deleted<br />
                  • If using sub-steps, their weightages must also total 100%
                </div>
              </div>
              <button
                onClick={() => setShowGuidelines(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '24px',
                  height: '24px',
                  border: '1px solid #FD4314',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FD4314',
                  padding: 0
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Form Container */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '4px',
            marginBottom: '24px'
          }}>
            {/* Quantity Descriptor Section */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #D8DEE8'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={isQuantityDescriptor}
                  onChange={(e) => setIsQuantityDescriptor(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#FD4314',
                    flexShrink: 0
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  color: '#374151',
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

            {/* ROC Info Header Section */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#F3F6FA',
              borderBottom: '1px solid #D8DEE8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                ROC Steps
              </h3>
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280'
                  }}>
                    Total Weight:
                  </span>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: weightColor,
                    color: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {totalWeight}%
                  </div>
                </div>
                <button
                  onClick={addStep}
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111827',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Plus size={16} />
                  Add Step
                </button>
              </div>
            </div>

            {/* Steps List */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rocSteps.map((step, stepIndex) => {
                  const isExpanded = expandedSteps.has(step.id);
                  
                  return (
                    <div 
                      key={step.id}
                      style={{
                        border: '1px solid #D8DEE8',
                        borderRadius: '4px',
                        backgroundColor: '#FAFBFC',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Step Header - Collapsible */}
                      <div 
                        onClick={() => toggleStep(step.id)}
                        style={{
                          padding: '16px 20px',
                          backgroundColor: '#F3F6FA',
                          borderBottom: isExpanded ? '1px solid #D8DEE8' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          {isExpanded ? <ChevronDown size={18} color="#6B7280" /> : <ChevronRight size={18} color="#6B7280" />}
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#272721',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            Step {stepIndex + 1}
                            {stepIndex === 0 && (
                              <span style={{ color: '#DC2626' }}>*</span>
                            )}
                            {step.stepName && (
                              <>
                                <span style={{ color: '#D8DEE8' }}>•</span>
                                <span style={{ fontWeight: '500', color: '#6B7280' }}>{step.stepName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '13px',
                            color: '#6B7280',
                            fontWeight: '600'
                          }}>
                            {step.stepWeightage}%
                          </span>
                          {rocSteps.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStep(step.id);
                              }}
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
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Step Content - Expandable */}
                      {isExpanded && (
                        <div style={{ padding: '20px' }}>
                          {/* Step Fields Grid */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            {/* Step Name */}
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                marginBottom: '8px'
                              }}>
                                Step Name
                              </label>
                              <input
                                type="text"
                                value={step.stepName}
                                onChange={(e) => updateStep(step.id, 'stepName', e.target.value)}
                                placeholder="e.g., Preparation"
                                style={{
                                  width: '100%',
                                  height: '40px',
                                  padding: '0 12px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  color: '#272721',
                                  outline: 'none',
                                  backgroundColor: '#FFFFFF'
                                }}
                              />
                            </div>

                            {/* Measurement Type */}
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                marginBottom: '8px'
                              }}>
                                Measurement Type
                              </label>
                              <StandardDropdown
                                value={step.measurementType}
                                onChange={(value) => updateStep(step.id, 'measurementType', value as string)}
                                options={[
                                  { value: 'Percentage-Based', label: 'Percentage-Based' },
                                  { value: 'Installed Quantity-Based', label: 'Installed Quantity-Based' }
                                ]}
                                mode="single"
                              />
                            </div>

                            {/* Step Weightage */}
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#272721',
                                marginBottom: '8px'
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
                                style={{
                                  width: '100%',
                                  height: '40px',
                                  padding: '0 12px',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  color: '#272721',
                                  outline: 'none',
                                  backgroundColor: '#FFFFFF'
                                }}
                              />
                            </div>
                          </div>

                          {/* Sub-Steps Section */}
                          <div style={{
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid #E5E7EB'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '12px'
                            }}>
                              <div style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#6B7280'
                              }}>
                                Sub-Steps
                              </div>
                              <button
                                onClick={() => addSubStep(step.id)}
                                style={{
                                  padding: '6px 12px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: '#FD4314',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                              >
                                <Plus size={14} />
                                Add Sub-Step
                              </button>
                            </div>

                            {step.subSteps.length > 0 && (
                              <>
                                {/* Sub-Steps Column Headers */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: '2fr 1fr auto',
                                  gap: '12px',
                                  marginBottom: '8px',
                                  paddingLeft: '8px'
                                }}>
                                  <label style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#6B7280'
                                  }}>
                                    Sub-Step Name
                                  </label>
                                  <label style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#6B7280'
                                  }}>
                                    Sub-Step Weightage (%)
                                  </label>
                                  <div style={{ width: '32px' }}></div>
                                </div>

                                {/* Sub-Steps List */}
                                {step.subSteps.map((subStep, subStepIndex) => (
                                  <div
                                    key={subStepIndex}
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: '2fr 1fr auto',
                                      gap: '12px',
                                      marginBottom: '8px',
                                      padding: '8px',
                                      backgroundColor: '#FFFFFF',
                                      borderRadius: '4px',
                                      border: '1px solid #E5E7EB'
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={subStep.name}
                                      onChange={(e) => updateSubStep(step.id, subStepIndex, 'name', e.target.value)}
                                      placeholder="Sub-step name"
                                      style={{
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1px solid #D8DEE8',
                                        borderRadius: '4px',
                                        fontSize: '13px',
                                        color: '#272721',
                                        outline: 'none',
                                        backgroundColor: '#FFFFFF'
                                      }}
                                    />
                                    <input
                                      type="number"
                                      value={subStep.weightage}
                                      onChange={(e) => updateSubStep(step.id, subStepIndex, 'weightage', parseFloat(e.target.value) || 0)}
                                      placeholder="0"
                                      min="0"
                                      max="100"
                                      style={{
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1px solid #D8DEE8',
                                        borderRadius: '4px',
                                        fontSize: '13px',
                                        color: '#272721',
                                        outline: 'none',
                                        backgroundColor: '#FFFFFF'
                                      }}
                                    />
                                    <button
                                      onClick={() => deleteSubStep(step.id, subStepIndex)}
                                      style={{
                                        width: '32px',
                                        height: '36px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#9CA3AF'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                                      onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </>
                            )}

                            {step.subSteps.length === 0 && (
                              <div style={{
                                padding: '16px',
                                textAlign: 'center',
                                color: '#9CA3AF',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF',
                                border: '1px dashed #D8DEE8',
                                borderRadius: '4px'
                              }}>
                                No sub-steps added
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: sidebarWidth,
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
                fontWeight: '600',
                color: '#111827',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              {fromStep5 ? 'Back to Step 5' : 'Cancel'}
            </button>

            <button
              onClick={handleSave}
              disabled={!isValidWeight}
              style={{
                height: '40px',
                padding: '0 24px',
                border: 'none',
                backgroundColor: isValidWeight ? '#FD4314' : '#D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: isValidWeight ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (isValidWeight) {
                  e.currentTarget.style.backgroundColor = '#E03B10';
                }
              }}
              onMouseLeave={(e) => {
                if (isValidWeight) {
                  e.currentTarget.style.backgroundColor = '#FD4314';
                }
              }}
            >
              Save Changes
            </button>
      </div>
    </div>
  );
}
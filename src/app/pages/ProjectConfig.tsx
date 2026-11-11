import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ChevronLeft, Check, Upload, Plus, Download, FileSpreadsheet, Search, X, ChevronRight, Trash2, ChevronDown, Filter } from 'lucide-react';
import { toast } from 'sonner';
import LogoUploadModal from '../components/LogoUploadModal';
import ImportFilesModal from '../components/ImportFilesModal';
import { ActivitiesStep, ActivitiesStepRef } from './ProjectConfigStep4New';
import { ROCConfigurationStep } from './ProjectConfigStep5';
import StandardDropdown from '../components/StandardDropdown';

type ConfigStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function ProjectConfig() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams(); // Get projectId from URL params
  const [currentStep, setCurrentStep] = useState<ConfigStep>(() => {
    // Check if we're returning to a specific step
    if (location.state?.returnToStep) {
      return location.state.returnToStep as ConfigStep;
    }
    return 1;
  });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => {
    // If returning to step 5, mark steps 1-4 as completed
    if (location.state?.returnToStep === 5) {
      return new Set([1, 2, 3, 4]);
    }
    // If returning to step 6, mark steps 1-5 as completed
    if (location.state?.returnToStep === 6) {
      return new Set([1, 2, 3, 4, 5]);
    }
    return new Set();
  });
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [configuredRocs, setConfiguredRocs] = useState<any[]>([]);
  const activitiesStepRef = useRef<ActivitiesStepRef>(null);
  
  // Check if this is continuing a draft project (has projectId) or creating new (no projectId)
  const isContinuingDraft = !!projectId;
  
  const [projectData, setProjectData] = useState({
    systemId: 'PRJ-2026-0042',
    clientCode: '',
    projectName: '',
    clientName: '',
    logo: null as File | null,
    country: '',
    city: '',
    timezone: '',
    currency: '',
    startDate: '',
    finishDate: '',
    status: 'Draft',
    notes: '',
    createdBy: 'John Anderson',
    createdOn: '28/02/2026'
  });

  const steps = [
    { id: 1, label: 'Project Setup' },
    { id: 2, label: 'Coding Dimensions' },
    { id: 3, label: 'Project Scope' },
    { id: 4, label: 'Activities' },
    { id: 5, label: 'ROC Configuration' },
    { id: 6, label: 'Task Code Generation' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as ConfigStep);
    }
  };

  const handleDiscard = () => {
    setShowDiscardModal(false);
    navigate('/app');
  };

  const handleNext = () => {
    if (currentStep === 4 && activitiesStepRef.current) {
      // Collect selected ROCs from Step 4 before moving to Step 5
      const rocs = activitiesStepRef.current.getSelectedRocs();
      setConfiguredRocs(rocs);
    }
    
    if (currentStep < 6) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep((currentStep + 1) as ConfigStep);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const handleSaveConfiguration = () => {
    toast.success('Project configuration saved successfully');
    navigate('/app');
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or current step
    if (completedSteps.has(stepId) || stepId === currentStep) {
      setCurrentStep(stepId as ConfigStep);
    }
  };

  const isLastStep = currentStep === 6;

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(39, 39, 33, 0.08)',
        padding: '20px 48px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Breadcrumbs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#6B7280'
            }}>
              <span 
                onClick={() => navigate('/app')}
                style={{
                  cursor: 'pointer',
                  color: '#6B7280',
                  transition: 'color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FD4314'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                Projects
              </span>
              <ChevronRight size={14} />
              <span style={{ color: '#272721', fontWeight: '500' }}>
                Project Configuration
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderRadius: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FD4314'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#C2410C'
            }}>
              Draft
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0'
        }}>
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isFuture = step.id > currentStep;
            const isClickable = isCompleted || isActive;

            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  onClick={() => handleStepClick(step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    cursor: isClickable ? 'pointer' : 'default'
                  }}
                >
                  {/* Step Number/Check */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#FD4314' : isCompleted ? '#10B981' : '#E5E7EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 200ms ease',
                    flexShrink: 0
                  }}>
                    {isCompleted ? <Check size={16} /> : step.id}
                  </div>
                  {/* Step Label */}
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#272721' : isFuture ? '#9CA3AF' : '#272721',
                    whiteSpace: 'nowrap'
                  }}>
                    {step.label}
                  </span>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div style={{
                    width: '40px',
                    height: '2px',
                    backgroundColor: completedSteps.has(step.id) ? '#FD4314' : '#E5E7EB',
                    flexShrink: 0
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Where You Left Off Banner - Only show when continuing a draft project */}
      {isContinuingDraft && projectData.status === 'Draft' && (
        <div style={{
          backgroundColor: '#E4EEFE',
          borderBottom: '1px solid #3B82F6',
          padding: '16px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            i
          </div>
          <div style={{
            fontSize: '14px',
            color: '#1E40AF',
            fontWeight: '500'
          }}>
            Continue where you left off! Complete the remaining steps to finish your project configuration.
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '32px 48px 120px 48px',
        overflow: 'auto'
      }}>
        {/* Step Content */}
        {currentStep === 1 && (
          <ProjectSetupStep 
            projectData={projectData}
            onInputChange={handleInputChange}
          />
        )}
        {currentStep === 2 && (
          <CodingDimensionsStep />
        )}
        {currentStep === 3 && (
          <PhasesStep />
        )}
        {currentStep === 4 && (
          <ActivitiesStep ref={activitiesStepRef} />
        )}
        {currentStep === 5 && (
          <ROCConfigurationStep 
            configuredRocs={configuredRocs}
            onSave={(updatedRocs) => {
              setConfiguredRocs(updatedRocs);
              toast.success('ROC configuration saved successfully');
            }}
          />
        )}
        {currentStep === 6 && (
          <TaskCodeGenerationStep />
        )}
      </div>

      {/* Fixed Bottom Navigation Buttons */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        height: '80px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E6ED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          padding: '0 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => {
              if (currentStep === 1) {
                setShowDiscardModal(true);
              } else {
                handleBack();
              }
            }}
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
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSaveDraft}
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
              Save as Draft
            </button>

            <button
              onClick={isLastStep ? handleSaveConfiguration : handleNext}
              style={{
                height: '40px',
                padding: '0 32px',
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
              {isLastStep ? 'Save Configuration' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowDiscardModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              width: '480px',
              maxWidth: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721'
              }}>
                Discard Changes?
              </h3>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.5'
              }}>
                Are you sure you want to discard this project? All your changes will not be saved and cannot be recovered.
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowDiscardModal(false)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Keep Editing
              </button>
              <button
                onClick={handleDiscard}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// STEP 1: PROJECT SETUP
function ProjectSetupStep({ projectData, onInputChange }: any) {
  const [showLogoModal, setShowLogoModal] = useState(false);
  
  // Searchable dropdown states
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [timezoneSearchOpen, setTimezoneSearchOpen] = useState(false);
  const [timezoneSearchTerm, setTimezoneSearchTerm] = useState('');

  // Sample client options
  const clientOptions = [
    'Google LLC',
    'Microsoft Corporation',
    'Amazon Web Services',
    'Meta Platforms',
    'Apple Inc.',
    'Tesla Inc.',
    'Saudi Aramco',
    'ADNOC Group'
  ];

  // Limited country options (5-6 only)
  const countryOptions = [
    'United States',
    'United Arab Emirates',
    'United Kingdom',
    'Germany',
    'Saudi Arabia',
    'Singapore'
  ];

  // Timezone options
  const timezoneOptions = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
    { value: 'UTC+4', label: 'Gulf Standard Time (UTC+4)' },
    { value: 'UTC+5:30', label: 'India Standard Time (UTC+5:30)' },
    { value: 'UTC+8', label: 'Singapore Time (UTC+8)' },
    { value: 'UTC+9', label: 'Japan Standard Time (UTC+9)' }
  ];

  // Filter functions
  const filteredClients = clientOptions.filter(client =>
    client.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const filteredCountries = countryOptions.filter(country =>
    country.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const filteredTimezones = timezoneOptions.filter(tz =>
    tz.label.toLowerCase().includes(timezoneSearchTerm.toLowerCase()) ||
    tz.value.toLowerCase().includes(timezoneSearchTerm.toLowerCase())
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.searchable-dropdown')) {
        setClientSearchOpen(false);
        setCountrySearchOpen(false);
        setTimezoneSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Section A - Project Identity */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 20px 0'
        }}>
          A. Project Identity
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* System Project ID */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              System Project ID <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <div style={{
              height: '40px',
              padding: '0 12px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6B7280'
            }}>
              {projectData.systemId}
            </div>
          </div>

          {/* Client Project Code - REMOVED */}

          {/* Project Name */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Project Name <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <input
              type="text"
              value={projectData.projectName}
              onChange={(e) => onInputChange('projectName', e.target.value)}
              placeholder="Enter project name"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Client Name and Upload Logo Side by Side */}
          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Client Name - Searchable Dropdown */}
            <div style={{ position: 'relative' }} className="searchable-dropdown">
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Client Name <span style={{ color: '#FD4314' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Search 
                  size={16} 
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7280',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
                <input
                  type="text"
                  value={clientSearchOpen ? clientSearchTerm : (projectData.clientName || '')}
                  onChange={(e) => {
                    setClientSearchTerm(e.target.value);
                    setClientSearchOpen(true);
                  }}
                  onFocus={() => {
                    setClientSearchOpen(true);
                    setClientSearchTerm('');
                  }}
                  placeholder="Select or search client"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 36px 0 36px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#272721',
                    outline: 'none',
                    cursor: 'text'
                  }}
                />
                <ChevronDown 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7280',
                    pointerEvents: 'none'
                  }}
                />
                {clientSearchOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <div
                          key={client}
                          onClick={() => {
                            onInputChange('clientName', client);
                            setClientSearchOpen(false);
                            setClientSearchTerm('');
                          }}
                          style={{
                            padding: '10px 12px',
                            fontSize: '13px',
                            color: '#272721',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F3F4F6'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                          {client}
                        </div>
                      ))
                    ) : (
                      <div style={{
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#9CA3AF',
                        textAlign: 'center'
                      }}>
                        No clients found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Logo */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Upload Logo
              </label>
              <div 
                onClick={() => setShowLogoModal(true)}
                style={{
                border: '2px dashed #D8DEE8',
                borderRadius: '4px',
                padding: '8px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                backgroundColor: '#FAFBFC'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FAFBFC'}
              >
                <Upload size={16} style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Browse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload Modal */}
      <LogoUploadModal 
        isOpen={showLogoModal}
        onClose={() => setShowLogoModal(false)}
        onUpload={(file) => {
          onInputChange('logo', file);
          toast.success('Logo uploaded successfully');
        }}
      />

      {/* Section B - Location & Time */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 20px 0'
        }}>
          B. Location & Time
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Country - Searchable Dropdown */}
          <div style={{ position: 'relative' }} className="searchable-dropdown">
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Country <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6B7280',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <input
                type="text"
                value={countrySearchOpen ? countrySearchTerm : (projectData.country || '')}
                onChange={(e) => {
                  setCountrySearchTerm(e.target.value);
                  setCountrySearchOpen(true);
                }}
                onFocus={() => {
                  setCountrySearchOpen(true);
                  setCountrySearchTerm('');
                }}
                placeholder="Select or search country"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 36px 0 36px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#272721',
                  outline: 'none',
                  cursor: 'text'
                }}
              />
              <ChevronDown 
                size={16} 
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6B7280',
                  pointerEvents: 'none'
                }}
              />
              {countrySearchOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div
                        key={country}
                        onClick={() => {
                          onInputChange('country', country);
                          setCountrySearchOpen(false);
                          setCountrySearchTerm('');
                        }}
                        style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#272721',
                          cursor: 'pointer',
                          borderBottom: '1px solid #F3F4F6'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      >
                        {country}
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: '10px 12px',
                      fontSize: '13px',
                      color: '#9CA3AF',
                      textAlign: 'center'
                    }}>
                      No countries found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* City / Region */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              City / Region
            </label>
            <input
              type="text"
              value={projectData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Enter city or region"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Timezone - Searchable Dropdown */}
          <div style={{ gridColumn: '1 / -1', position: 'relative' }} className="searchable-dropdown">
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Timezone <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6B7280',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <input
                type="text"
                value={timezoneSearchOpen ? timezoneSearchTerm : (timezoneOptions.find(tz => tz.value === projectData.timezone)?.label || '')}
                onChange={(e) => {
                  setTimezoneSearchTerm(e.target.value);
                  setTimezoneSearchOpen(true);
                }}
                onFocus={() => {
                  setTimezoneSearchOpen(true);
                  setTimezoneSearchTerm('');
                }}
                placeholder="Select or search timezone"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 36px 0 36px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#272721',
                  outline: 'none',
                  cursor: 'text'
                }}
              />
              <ChevronDown 
                size={16} 
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6B7280',
                  pointerEvents: 'none'
                }}
              />
              {timezoneSearchOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  maxHeight: '250px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                  {filteredTimezones.length > 0 ? (
                    filteredTimezones.map((tz) => (
                      <div
                        key={tz.value}
                        onClick={() => {
                          onInputChange('timezone', tz.value);
                          setTimezoneSearchOpen(false);
                          setTimezoneSearchTerm('');
                        }}
                        style={{
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#272721',
                          cursor: 'pointer',
                          borderBottom: '1px solid #F3F4F6'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      >
                        {tz.label}
                      </div>
                    ))
                  ) : (
                    <div style={{
                      padding: '10px 12px',
                      fontSize: '13px',
                      color: '#9CA3AF',
                      textAlign: 'center'
                    }}>
                      No timezones found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section C - Schedule */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 20px 0'
        }}>
          C. Schedule
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Start Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Start Date <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <input
              type="date"
              value={projectData.startDate}
              onChange={(e) => onInputChange('startDate', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Planned Finish Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Finish Date
            </label>
            <input
              type="date"
              value={projectData.finishDate}
              onChange={(e) => onInputChange('finishDate', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      </div>

      {/* Section D - Currency */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 20px 0'
        }}>
          D. Currency
        </h2>
        
        {/* Currency */}
        <div style={{ position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#272721',
            marginBottom: '8px'
          }}>
            Currency <span style={{ color: '#FD4314' }}>*</span>
          </label>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <select
              value={projectData.currency}
              onChange={(e) => onInputChange('currency', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 36px 0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'none'
              }}
            >
              <option value="">Select currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="AED">AED - UAE Dirham</option>
            </select>
            <ChevronDown 
              size={16} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
          </div>
        </div>
      </div>

      {/* Section E - Additional Details */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 20px 0'
        }}>
          E. Additional Details
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Additional Notes */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Additional Notes
            </label>
            <textarea
              value={projectData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              placeholder="Enter any additional notes or comments"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// STEP 2: CODING DIMENSIONS
function CodingDimensionsStep() {
  const [selectedDimension, setSelectedDimension] = useState('area');
  const [editingDimension, setEditingDimension] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Column-specific search states
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Cost Account Code Generation Settings
  const [enableCostCodeGen, setEnableCostCodeGen] = useState(false);
  const [separator, setSeparator] = useState('.');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [dimensions, setDimensions] = useState([
    { id: 'area', name: 'Area', valueCount: 5, includeInCostCode: true, sequence: 1 },
    { id: 'work-package', name: 'Work Package', valueCount: 4, includeInCostCode: true, sequence: 2 },
    { id: 'spa', name: 'SPA', valueCount: 3, includeInCostCode: false, sequence: null },
    { id: 'cost-type', name: 'Cost Type', valueCount: 3, includeInCostCode: false, sequence: null }
  ]);

  // Store values per dimension
  const [dimensionValuesMap, setDimensionValuesMap] = useState<{ [key: string]: any[] }>({
    'area': [
      { code: 'A01', name: 'Ground Floor', status: 'Active' },
      { code: 'A02', name: 'First Floor', status: 'Active' },
      { code: 'A03', name: 'Second Floor', status: 'Active' },
      { code: 'A04', name: 'Third Floor', status: 'Active' },
      { code: 'A05', name: 'Roof', status: 'Inactive' }
    ],
    'work-package': [
      { code: 'WP01', name: 'Civil Works', status: 'Active' },
      { code: 'WP02', name: 'MEP Installation', status: 'Active' },
      { code: 'WP03', name: 'Finishing', status: 'Active' },
      { code: 'WP04', name: 'Landscaping', status: 'Active' }
    ],
    'spa': [
      { code: 'SPA01', name: 'Zone A', status: 'Active' },
      { code: 'SPA02', name: 'Zone B', status: 'Active' },
      { code: 'SPA03', name: 'Zone C', status: 'Inactive' }
    ],
    'cost-type': [
      { code: 'CT01', name: 'Labor', status: 'Active' },
      { code: 'CT02', name: 'Material', status: 'Active' },
      { code: 'CT03', name: 'Equipment', status: 'Active' }
    ]
  });

  const currentValues = dimensionValuesMap[selectedDimension] || [];
  
  // Filter values based on column-specific search
  const filteredValues = currentValues.filter(row => {
    const matchesCode = !codeSearch || row.code.toLowerCase().includes(codeSearch.toLowerCase());
    const matchesName = !nameSearch || row.name.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesStatus = !statusSearch || row.status.toLowerCase().includes(statusSearch.toLowerCase());
    return matchesCode && matchesName && matchesStatus;
  });

  const handleAddDimension = () => {
    const newId = `dim-${Date.now()}`;
    setDimensions([{ id: newId, name: 'New Dimension', valueCount: 0, includeInCostCode: false, sequence: null }, ...dimensions]);
    setDimensionValuesMap({ ...dimensionValuesMap, [newId]: [] });
    setEditingDimension(newId);
    setEditingValue('New Dimension');
    setSelectedDimension(newId);
    toast.success('Dimension created');
  };

  const handleToggleIncludeInCostCode = (dimId: string, include: boolean) => {
    setDimensions(dimensions.map(dim => {
      if (dim.id === dimId) {
        if (include) {
          // When enabling, assign next available sequence
          const maxSeq = Math.max(0, ...dimensions.filter(d => d.sequence !== null).map(d => d.sequence || 0));
          return { ...dim, includeInCostCode: true, sequence: maxSeq + 1 };
        } else {
          // When disabling, check if at least one other dimension is included
          const includedCount = dimensions.filter(d => d.includeInCostCode && d.id !== dimId).length;
          if (includedCount === 0) {
            toast.error('At least one dimension must be included in cost code');
            return dim;
          }
          return { ...dim, includeInCostCode: false, sequence: null };
        }
      }
      return dim;
    }));
  };

  const handleSequenceChange = (dimId: string, newSeq: number) => {
    setDimensions(dimensions.map(dim => 
      dim.id === dimId ? { ...dim, sequence: newSeq } : dim
    ));
  };

  const handleDeleteDimension = (id: string) => {
    if (dimensions.length > 1) {
      setDimensions(dimensions.filter(dim => dim.id !== id));
      const newMap = { ...dimensionValuesMap };
      delete newMap[id];
      setDimensionValuesMap(newMap);
      if (selectedDimension === id) {
        setSelectedDimension(dimensions[0]?.id || '');
      }
      toast.success('Dimension deleted');
    } else {
      toast.error('At least one dimension is required');
    }
  };

  const handleDimensionDoubleClick = (dimension: any) => {
    setEditingDimension(dimension.id);
    setEditingValue(dimension.name);
  };

  const handleDimensionRename = () => {
    if (editingDimension && editingValue.trim()) {
      setDimensions(dimensions.map(dim =>
        dim.id === editingDimension ? { ...dim, name: editingValue.trim() } : dim
      ));
      setEditingDimension(null);
      setEditingValue('');
      toast.success('Dimension renamed');
    }
  };

  const handleAddNewValue = () => {
    const currentValues = dimensionValuesMap[selectedDimension] || [];
    const newValue = {
      code: '',
      name: '',
      status: 'Active',
      isNew: true
    };
    const newValues = [newValue, ...currentValues];
    setDimensionValuesMap({ ...dimensionValuesMap, [selectedDimension]: newValues });
    
    // Update dimension value count
    setDimensions(dimensions.map(dim =>
      dim.id === selectedDimension ? { ...dim, valueCount: newValues.length } : dim
    ));
  };

  const handleDeleteValue = (index: number) => {
    const currentValues = dimensionValuesMap[selectedDimension] || [];
    const newValues = currentValues.filter((_, i) => i !== index);
    setDimensionValuesMap({ ...dimensionValuesMap, [selectedDimension]: newValues });
    
    // Update dimension value count
    setDimensions(dimensions.map(dim =>
      dim.id === selectedDimension ? { ...dim, valueCount: newValues.length } : dim
    ));
    toast.success('Value deleted');
  };

  const handleUpdateValue = (index: number, field: string, value: string) => {
    const currentValues = dimensionValuesMap[selectedDimension] || [];
    const newValues = [...currentValues];
    newValues[index] = { ...newValues[index], [field]: value, isNew: false };
    setDimensionValuesMap({ ...dimensionValuesMap, [selectedDimension]: newValues });
  };

  // Drag and drop handlers for sequence ordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const includedDimensions = dimensions.filter(d => d.includeInCostCode);
    const newDimensions = [...dimensions];
    const draggedDim = includedDimensions[draggedIndex];
    const targetDim = includedDimensions[index];
    
    // Update sequences
    if (draggedDim && targetDim) {
      const draggedDimIndex = dimensions.findIndex(d => d.id === draggedDim.id);
      const targetDimIndex = dimensions.findIndex(d => d.id === targetDim.id);
      
      newDimensions[draggedDimIndex] = { ...draggedDim, sequence: index + 1 };
      newDimensions[targetDimIndex] = { ...targetDim, sequence: draggedIndex + 1 };
      
      // Update other dimensions' sequences
      includedDimensions.forEach((dim, idx) => {
        if (idx !== draggedIndex && idx !== index) {
          const dimIndex = dimensions.findIndex(d => d.id === dim.id);
          let newSeq = idx + 1;
          if (idx > draggedIndex && idx <= index) newSeq = idx;
          else if (idx < draggedIndex && idx >= index) newSeq = idx + 2;
          newDimensions[dimIndex] = { ...dim, sequence: newSeq };
        }
      });
      
      setDimensions(newDimensions);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Coding Dimensions Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '0'
      }}>
        {/* Left Panel - Dimensions List */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px 0 0 4px',
          borderRight: 'none',
          padding: '20px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Dimensions
              </h3>
              <button
                onClick={handleAddDimension}
                style={{
                  width: '28px',
                  height: '28px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                <Plus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dimensions.map(dim => (
                <div
                  key={dim.id}
                  onDoubleClick={() => handleDimensionDoubleClick(dim)}
                  style={{
                    padding: '12px',
                    backgroundColor: selectedDimension === dim.id ? '#E4EEFE' : '#FFFFFF',
                    border: `1px solid ${selectedDimension === dim.id ? '#FD4314' : '#E5E7EB'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDimension !== dim.id) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDimension !== dim.id) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }
                  }}
                >
                  {editingDimension === dim.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={handleDimensionRename}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleDimensionRename();
                        }
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flex: 1,
                        border: '1px solid #FD4314',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <div 
                      onClick={() => setSelectedDimension(dim.id)}
                      style={{ flex: 1 }}
                    >
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#272721',
                        marginBottom: '4px'
                      }}>
                        {dim.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6B7280'
                      }}>
                        {dim.valueCount} values
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDimension(dim.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#EF4444',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.7,
                      transition: 'opacity 150ms ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
        </div>

        {/* Right Panel - Values Manager */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '0 4px 4px 0',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'hidden'
        }}>
          {/* Header with Dimension Name and Subtitle */}
          <div style={{
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #E5E7EB',
            flexShrink: 0
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 4px 0'
            }}>
              Values
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: 0
            }}>
              These values will appear as dropdown options during task creation
            </p>
          </div>

          {/* Action Buttons Row */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexShrink: 0
          }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => toast.success('Template downloaded')}
                  title="Download Template"
                  style={{
                    height: '36px',
                    width: '36px',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Download size={16} />
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowImportModal(true)}
                  title="Import From Excel"
                  style={{
                    height: '36px',
                    width: '36px',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Upload size={16} />
                </button>
              </div>
              <button
                onClick={handleAddNewValue}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                <Plus size={14} />
                Add New Value
              </button>
            </div>
          </div>

          {/* Import Modal */}
          <ImportFilesModal
            title="Import Dimension Values"
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onUpload={(files) => {
              toast.success('Values imported successfully');
            }}
          />

          {/* Table */}
          <div style={{
            border: '1px solid #C8D9EE',
            borderRadius: '4px',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', display: 'block' }}>
              <thead style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                <tr style={{ backgroundColor: '#E4EEFE', display: 'table-row', width: '100%' }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '20%'
                  }}>
                    Code
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '45%'
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '25%'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '10%'
                  }}>
                    Action
                  </th>
                </tr>
                {/* Column Search Row */}
                <tr style={{ backgroundColor: '#FAFBFC', display: 'table-row', width: '100%' }}>
                  <th style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid #C8D9EE',
                    width: '20%'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={codeSearch}
                        onChange={(e) => setCodeSearch(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 28px 0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter 
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
                  <th style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid #C8D9EE',
                    width: '45%'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        style={{
                          width: '100%',
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 28px 0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter 
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
                  <th style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid #C8D9EE',
                    width: '25%'
                  }}>
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
                          padding: '0 28px 0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter 
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
                  <th style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid #C8D9EE',
                    width: '10%'
                  }}>
                  </th>
                </tr>
              </thead>
            </table>
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', display: 'table', tableLayout: 'fixed' }}>
                <tbody>
                  {filteredValues.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{
                        padding: '48px 24px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#9CA3AF',
                        fontStyle: 'italic'
                      }}>
                        No values defined for this dimension. Click "Add New Value" to get started.
                      </td>
                    </tr>
                  ) : (
                  filteredValues.map((row, index) => {
                    const originalIndex = currentValues.indexOf(row);
                    return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                        borderBottom: '1px solid #E2E6ED'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)'}
                    >
                      <td style={{
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#272721',
                        width: '20%'
                      }}>
                        <input
                          type="text"
                          value={row.code}
                          onChange={(e) => handleUpdateValue(originalIndex, 'code', e.target.value)}
                          placeholder="Enter code"
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            border: row.isNew ? '1px solid #FD4314' : '1px solid #E5E7EB',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '600',
                            outline: 'none',
                            backgroundColor: row.isNew ? '#FFF4EF' : 'transparent'
                          }}
                        />
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#272721',
                        width: '45%'
                      }}>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleUpdateValue(originalIndex, 'name', e.target.value)}
                          placeholder="Enter name"
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            border: row.isNew ? '1px solid #FD4314' : '1px solid #E5E7EB',
                            borderRadius: '4px',
                            fontSize: '13px',
                            outline: 'none',
                            backgroundColor: row.isNew ? '#FFF4EF' : 'transparent'
                          }}
                        />
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#272721',
                        width: '25%'
                      }}>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={row.status}
                            onChange={(e) => handleUpdateValue(originalIndex, 'status', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 28px 6px 8px',
                              border: row.isNew ? '1px solid #FD4314' : '1px solid #E5E7EB',
                              borderRadius: '4px',
                              fontSize: '13px',
                              outline: 'none',
                              cursor: 'pointer',
                              appearance: 'none',
                              backgroundImage: 'none',
                              backgroundColor: row.status === 'Active' ? '#DEF7EC' : '#F3F4F6',
                              color: row.status === 'Active' ? '#03543F' : '#6B7280',
                              fontWeight: '500'
                            }}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <ChevronDown 
                            size={14} 
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: row.status === 'Active' ? '#03543F' : '#6B7280',
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      </td>
                      <td style={{
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#272721',
                        textAlign: 'center',
                        width: '10%'
                      }}>
                        <button
                          onClick={() => handleDeleteValue(originalIndex)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            padding: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            opacity: 0.7,
                            transition: 'opacity 150ms ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Account Code Generation Settings */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        {/* Header with Preview */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#272721',
            margin: '0'
          }}>
            Cost Account Code Generation
          </h3>

          {/* Preview as Normal Text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#6B7280'
            }}>
              Preview:
            </span>
            <span style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#272721',
              fontFamily: 'monospace'
            }}>
              {enableCostCodeGen ? (
                dimensions
                  .filter(d => d.includeInCostCode)
                  .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                  .map(d => {
                    const values = dimensionValuesMap[d.id] || [];
                    return values[0]?.code || 'XXX';
                  })
                  .join('.') || 'No dimensions selected'
              ) : (
                <span style={{ color: '#9CA3AF', fontStyle: 'italic', fontSize: '13px', fontWeight: '500' }}>
                  Not enabled
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Toggle Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E5E7EB'
        }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#272721'
              }}>
                Enable Cost Account Code Generation?
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setEnableCostCodeGen(false)}
                  style={{
                    padding: '6px 16px',
                    border: `1px solid ${!enableCostCodeGen ? '#FD4314' : '#D8DEE8'}`,
                    backgroundColor: !enableCostCodeGen ? '#FFF4EF' : '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: !enableCostCodeGen ? '#FD4314' : '#6B7280',
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => setEnableCostCodeGen(true)}
                  style={{
                    padding: '6px 16px',
                    border: `1px solid ${enableCostCodeGen ? '#FD4314' : '#D8DEE8'}`,
                    backgroundColor: enableCostCodeGen ? '#FFF4EF' : '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: enableCostCodeGen ? '#FD4314' : '#6B7280',
                    cursor: 'pointer'
                  }}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Cost Code Configuration */}
            {enableCostCodeGen && (
              <>
                {/* Info Message */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#E4EEFE',
                  border: '1px solid #E4EEFE',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#1E40AF',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '-2px'
                  }}>ℹ</div>
                  <div>
                    The sequence in which you arrange the dimensions below will determine how the cost code is structured. Drag and drop to reorder. Use the × icon to exclude dimensions.
                  </div>
                </div>

                {/* Cost Code Configuration with Drag & Drop */}
                <div style={{
                  marginBottom: '20px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#272721',
                    margin: '0 0 12px 0'
                  }}>
                    Select & Order Dimensions for Cost Code
                  </h4>

                  <div style={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '4px',
                    padding: '12px'
                  }}>
                    {/* Show all dimensions - included ones first (draggable), then excluded ones */}
                    {dimensions
                      .sort((a, b) => {
                        // Included dimensions sorted by sequence
                        if (a.includeInCostCode && b.includeInCostCode) {
                          return (a.sequence || 0) - (b.sequence || 0);
                        }
                        // Included dimensions come first
                        if (a.includeInCostCode) return -1;
                        if (b.includeInCostCode) return 1;
                        // Excluded dimensions maintain original order
                        return 0;
                      })
                      .map((dim, index) => {
                        const includedDimensions = dimensions.filter(d => d.includeInCostCode);
                        const dimensionIndex = includedDimensions.findIndex(d => d.id === dim.id);
                        const isIncluded = dim.includeInCostCode;
                        
                        return (
                          <div 
                            key={dim.id}
                            draggable={isIncluded}
                            onDragStart={(e) => isIncluded && handleDragStart(e, dimensionIndex)}
                            onDragOver={(e) => isIncluded && handleDragOver(e, dimensionIndex)}
                            onDragEnd={handleDragEnd}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 12px',
                              marginBottom: '8px',
                              backgroundColor: isIncluded ? '#FFFFFF' : '#F9FAFB',
                              border: isIncluded ? '1px solid rgba(253, 67, 20, 0.3)' : '1px solid #E5E7EB',
                              borderRadius: '4px',
                              cursor: isIncluded ? 'grab' : 'default',
                              opacity: draggedIndex === dimensionIndex && isIncluded ? 0.5 : 1,
                              transition: 'all 150ms ease'
                            }}
                          >
                            {/* Drag Handle - only for included dimensions */}
                            {isIncluded && (
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                cursor: 'grab',
                                color: '#9CA3AF'
                              }}>
                                <div style={{ width: '12px', height: '2px', backgroundColor: 'currentColor' }} />
                                <div style={{ width: '12px', height: '2px', backgroundColor: 'currentColor' }} />
                                <div style={{ width: '12px', height: '2px', backgroundColor: 'currentColor' }} />
                              </div>
                            )}
                            
                            {/* Dimension Name */}
                            <span style={{
                              fontSize: '13px',
                              fontWeight: isIncluded ? '600' : '500',
                              color: isIncluded ? '#272721' : '#9CA3AF',
                              textDecoration: isIncluded ? 'none' : 'line-through',
                              flex: 1,
                              marginLeft: isIncluded ? '0' : '28px'
                            }}>
                              {dim.name}
                            </span>
                            
                            {/* Sequence Number - only for included dimensions */}
                            {isIncluded && (
                              <div style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#FFFFFF',
                                backgroundColor: 'rgba(253, 67, 20, 0.8)',
                                minWidth: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {dimensionIndex + 1}
                              </div>
                            )}
                            
                            {/* Action Button */}
                            {isIncluded ? (
                              <button
                                onClick={() => handleToggleIncludeInCostCode(dim.id, false)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#EF4444',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  opacity: 0.7,
                                  transition: 'opacity 150ms ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                title="Exclude from cost code"
                              >
                                <X size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleIncludeInCostCode(dim.id, true)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #D8DEE8',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#FD4314',
                                  padding: '4px 12px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  transition: 'all 150ms ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFF4EF';
                                  e.currentTarget.style.borderColor = '#FD4314';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.borderColor = '#D8DEE8';
                                }}
                                title="Include in cost code"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </>
            )}


      </div>
    </div>
  );
}

// STEP 3: PROJECT SCOPE
function PhasesStep() {
  const [phases, setPhases] = useState<any[]>([
    {
      id: 'scope-1',
      scopeId: '',
      code: '',
      name: '',
      selectedDisciplines: [] as string[],
      selectedTradePackages: [] as string[],
      subcontractorMappings: {} as { [key: string]: string[] }
    }
  ]);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>('scope-1');
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [tradePackageSearch, setTradePackageSearch] = useState('');
  const [subcontractorSearch, setSubcontractorSearch] = useState('');
  
  // Dropdown open states
  const [disciplineDropdownOpen, setDisciplineDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [tradePackageDropdownOpen, setTradePackageDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [subcontractorDropdownOpen, setSubcontractorDropdownOpen] = useState<{ [key: string]: boolean }>({});

  // Mock master data
  const scopeMaster = [
    { id: 'SCO-001', code: 'SCO-001', name: 'Design & Engineering' },
    { id: 'SCO-002', code: 'SCO-002', name: 'Construction & Installation' },
    { id: 'SCO-003', code: 'SCO-003', name: 'Procurement' },
    { id: 'SCO-004', code: 'SCO-004', name: 'Testing & Commissioning' },
    { id: 'SCO-005', code: 'SCO-005', name: 'Operations & Maintenance' }
  ];

  const disciplineMaster = [
    { id: 'D001', code: 'ARCH', name: 'Architectural', description: 'Architectural finishing and design' },
    { id: 'D002', code: 'MECH', name: 'Mechanical', description: 'Mechanical systems and installations' },
    { id: 'D003', code: 'ELEC', name: 'Electrical', description: 'Electrical installations and systems' }
  ];

  const tradePackageMaster = [
    { id: 'TP001', code: 'TP-001', name: 'Cooling Plant Placement' },
    { id: 'TP002', code: 'TP-002', name: 'HVAC System Installation' },
    { id: 'TP003', code: 'TP-003', name: 'Plumbing Fixtures' }
  ];

  const subcontractorMaster = [
    { id: 'SC001', code: 'SUB01', name: 'ABC Electrical Contractors' },
    { id: 'SC002', code: 'SUB02', name: 'Global MEP Solutions' },
    { id: 'SC003', code: 'SUB03', name: 'Elite HVAC Systems' },
    { id: 'SC004', code: 'SUB04', name: 'Premier Plumbing Services' },
    { id: 'SC005', code: 'SUB05', name: 'BuildTech Civil Works' }
  ];

  const handleAddPhase = () => {
    const newPhase = {
      id: `scope-${Date.now()}`,
      scopeId: '',
      code: '',
      name: '',
      selectedDisciplines: [] as string[],
      selectedTradePackages: [] as string[],
      subcontractorMappings: {} as { [key: string]: string[] }
    };
    setPhases([...phases, newPhase]);
    setExpandedPhaseId(newPhase.id);
  };

  const handleDeletePhase = (phaseId: string) => {
    setPhases(phases.filter(p => p.id !== phaseId));
    if (expandedPhaseId === phaseId) {
      setExpandedPhaseId(null);
    }
    toast.success('Scope deleted');
  };

  const updatePhase = (phaseId: string, field: string, value: any) => {
    setPhases(phases.map(p => p.id === phaseId ? { ...p, [field]: value } : p));
  };

  const toggleDiscipline = (phaseId: string, disciplineId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    const selectedDisciplines = phase.selectedDisciplines.includes(disciplineId)
      ? phase.selectedDisciplines.filter((id: string) => id !== disciplineId)
      : [...phase.selectedDisciplines, disciplineId];

    updatePhase(phaseId, 'selectedDisciplines', selectedDisciplines);
  };

  const toggleTradePackage = (phaseId: string, tradePackageId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    const selectedTradePackages = phase.selectedTradePackages.includes(tradePackageId)
      ? phase.selectedTradePackages.filter((id: string) => id !== tradePackageId)
      : [...phase.selectedTradePackages, tradePackageId];

    // Remove subcontractor mappings if trade package is deselected
    if (!selectedTradePackages.includes(tradePackageId)) {
      const newMappings = { ...phase.subcontractorMappings };
      delete newMappings[tradePackageId];
      updatePhase(phaseId, 'subcontractorMappings', newMappings);
    }

    updatePhase(phaseId, 'selectedTradePackages', selectedTradePackages);
  };

  const removeTag = (phaseId: string, type: 'discipline' | 'tradePackage', id: string) => {
    if (type === 'discipline') {
      toggleDiscipline(phaseId, id);
    } else {
      toggleTradePackage(phaseId, id);
    }
  };

  const updateSubcontractorMapping = (phaseId: string, tradePackageId: string, subcontractorIds: string[]) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    const newMappings = {
      ...phase.subcontractorMappings,
      [tradePackageId]: subcontractorIds
    };

    updatePhase(phaseId, 'subcontractorMappings', newMappings);
  };

  const toggleSubcontractor = (phaseId: string, tradePackageId: string, subcontractorId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return;

    const currentMappings = phase.subcontractorMappings[tradePackageId] || [];
    const newMappings = currentMappings.includes(subcontractorId)
      ? currentMappings.filter((id: string) => id !== subcontractorId)
      : [...currentMappings, subcontractorId];

    updateSubcontractorMapping(phaseId, tradePackageId, newMappings);
  };

  const filteredDisciplines = disciplineMaster.filter(d =>
    d.code.toLowerCase().includes(disciplineSearch.toLowerCase()) ||
    d.name.toLowerCase().includes(disciplineSearch.toLowerCase()) ||
    d.description.toLowerCase().includes(disciplineSearch.toLowerCase())
  );

  const filteredTradePackages = tradePackageMaster.filter(tp =>
    tp.code.toLowerCase().includes(tradePackageSearch.toLowerCase()) ||
    tp.name.toLowerCase().includes(tradePackageSearch.toLowerCase())
  );

  const filteredSubcontractors = subcontractorMaster.filter(sc =>
    sc.name.toLowerCase().includes(subcontractorSearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown-container]')) {
        setDisciplineDropdownOpen({});
        setTradePackageDropdownOpen({});
        setSubcontractorDropdownOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Page Header - Always visible */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 8px 0'
          }}>
            Project Scope
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            Configure execution scopes by assigning disciplines, trade packages, and subcontractors.
          </p>
        </div>
        <button
          onClick={handleAddPhase}
          style={{
            height: '40px',
            padding: '0 24px',
            border: 'none',
            backgroundColor: '#FD4314',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
        >
          <Plus size={16} />
          Add Another Scope
        </button>
      </div>

      {/* Scopes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {phases.map((phase, phaseIndex) => {
          const isExpanded = expandedPhaseId === phase.id;

            return (
              <div
                key={phase.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  overflow: 'visible'
                }}
              >
                {/* Phase Header */}
                <div
                  onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? '#F9FAFB' : '#FFFFFF',
                    borderBottom: isExpanded ? '1px solid #D8DEE8' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    {isExpanded ? (
                      <ChevronDown size={20} style={{ color: '#6B7280', flexShrink: 0 }} />
                    ) : (
                      <ChevronRight size={20} style={{ color: '#6B7280', flexShrink: 0 }} />
                    )}
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#272721'
                    }}>
                      {phase.name || `Scope ${phaseIndex + 1}`}
                    </div>
                  </div>
                  
                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhase(phase.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#EF4444',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.7
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                      <Trash2 size={18} />
                    </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ padding: '24px' }}>
                    {/* SECTION 1: Phase Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '32px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#272721',
                          marginBottom: '8px'
                        }}>
                          Scope Name <span style={{ color: '#FD4314' }}>*</span>
                        </label>
                        <StandardDropdown
                          options={scopeMaster.map(s => ({
                            value: s.id,
                            label: s.name
                          }))}
                          value={phase.scopeId || ''}
                          onChange={(value) => {
                            const selectedScope = scopeMaster.find(s => s.id === value);
                            if (selectedScope) {
                              updatePhase(phase.id, 'scopeId', selectedScope.id);
                              updatePhase(phase.id, 'name', selectedScope.name);
                              updatePhase(phase.id, 'code', selectedScope.code);
                            }
                          }}
                          placeholder="Select scope name"
                          mode="single"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#272721',
                          marginBottom: '8px'
                        }}>
                          Scope Code <span style={{ color: '#FD4314' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={phase.code}
                          readOnly
                          placeholder="Auto-filled from scope name"
                          style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 12px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#F9FAFB',
                            color: '#6B7280',
                            cursor: 'not-allowed'
                          }}
                        />
                      </div>
                    </div>

                    {/* SECTION 2: Select Discipline */}
                    <div style={{
                      marginBottom: '32px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#272721',
                        margin: '0 0 16px 0'
                      }}>
                        Select Discipline
                      </h3>

                      {/* Discipline Multi-Select Dropdown */}
                      <StandardDropdown
                        options={disciplineMaster.map(disc => ({
                          value: disc.id,
                          label: `${disc.code} - ${disc.name}`
                        }))}
                        value={phase.selectedDisciplines}
                        onChange={(value) => updatePhase(phase.id, 'selectedDisciplines', value)}
                        placeholder="Search and select discipline..."
                        mode="multi"
                      />
                    </div>

                    {/* SECTION 3: Select Trade Package */}
                    <div style={{
                      marginBottom: '32px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#272721',
                        margin: '0 0 16px 0'
                      }}>
                        Select Trade Package
                      </h3>

                      {/* Trade Package Multi-Select Dropdown */}
                      <StandardDropdown
                        options={tradePackageMaster.map(tp => ({
                          value: tp.id,
                          label: `${tp.code} - ${tp.name}`
                        }))}
                        value={phase.selectedTradePackages}
                        onChange={(value) => updatePhase(phase.id, 'selectedTradePackages', value)}
                        placeholder="Search and select trade package..."
                        mode="multi"
                      />
                    </div>

                    {/* SECTION 4: Assign Subcontractors to Trade Packages */}
                    {phase.selectedTradePackages.length > 0 && (
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#FAFBFC',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px',
                        overflow: 'visible'
                      }}>
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#272721',
                          margin: '0 0 16px 0'
                        }}>
                          Assign Subcontractors to Trade Packages <span style={{ color: '#FD4314' }}>*</span>
                        </h3>

                        {/* Mapping Table */}
                        <div style={{
                          border: '1px solid #C8D9EE',
                          borderRadius: '4px',
                          overflow: 'visible',
                          backgroundColor: '#FFFFFF'
                        }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#E4EEFE' }}>
                                <th style={{
                                  padding: '12px',
                                  textAlign: 'left',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#272721',
                                  borderBottom: '1px solid #C8D9EE',
                                  width: '35%'
                                }}>
                                  Trade Package
                                </th>
                                <th style={{
                                  padding: '12px',
                                  textAlign: 'left',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#272721',
                                  borderBottom: '1px solid #C8D9EE'
                                }}>
                                  Subcontractors <span style={{ color: '#FD4314' }}>*</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {phase.selectedTradePackages.map((tpId: string, index: number) => {
                                const tp = tradePackageMaster.find(t => t.id === tpId);
                                if (!tp) return null;

                                const selectedSubcontractors = phase.subcontractorMappings[tpId] || [];

                                return (
                                  <tr
                                    key={tpId}
                                    style={{
                                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                                      borderBottom: '1px solid #E2E6ED'
                                    }}
                                  >
                                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                                      {tp.code} - {tp.name}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      {/* Subcontractor Multi-Select Dropdown */}
                                      <StandardDropdown
                                        options={subcontractorMaster.map(sc => ({
                                          value: sc.id,
                                          label: `${sc.code} - ${sc.name}`
                                        }))}
                                        value={selectedSubcontractors}
                                        onChange={(value) => updateSubcontractorMapping(phase.id, tpId, value as string[])}
                                        placeholder="Search and select subcontractors..."
                                        mode="multi"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
    </div>
  );
}

// STEP 4: ACTIVITIES (ROC) - Imported from separate file
// function ActivitiesStep() {
//   // This step is now defined in ProjectConfigStep4.tsx
// }

// STEP 5: ROC CONFIGURATION - Imported from separate file
// function ROCConfigurationStep() {
//   // This step is now defined in ProjectConfigStep5.tsx
// }

// STEP 6: TASK CODE GENERATION
function TaskCodeGenerationStep() {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Available dimensions for task code generation
  const [taskCodeDimensions, setTaskCodeDimensions] = useState([
    { id: 'area', name: 'Area', included: true, sequence: 1, sampleCode: 'A01' },
    { id: 'work-package', name: 'Work Package', included: false, sequence: null, sampleCode: 'WP01' },
    { id: 'spa', name: 'SPA', included: false, sequence: null, sampleCode: 'SPA01' },
    { id: 'cost-type', name: 'Cost Type', included: false, sequence: null, sampleCode: 'CT01' },
    { id: 'scope', name: 'Scope', included: false, sequence: null, sampleCode: 'SC01' },
    { id: 'discipline', name: 'Discipline', included: true, sequence: 2, sampleCode: 'ARCH' },
    { id: 'trade-package', name: 'Trade Package', included: false, sequence: null, sampleCode: 'TP001' },
    { id: 'subcontractor', name: 'Sub Contractor', included: false, sequence: null, sampleCode: 'SUB01' },
    { id: 'roc-id', name: 'ROC ID', included: false, sequence: null, sampleCode: 'ROC001' }
  ]);

  const handleToggleInclude = (dimId: string, include: boolean) => {
    setTaskCodeDimensions(taskCodeDimensions.map(dim => {
      if (dim.id === dimId) {
        if (include) {
          // When enabling, assign next available sequence
          const maxSeq = Math.max(0, ...taskCodeDimensions.filter(d => d.sequence !== null).map(d => d.sequence || 0));
          return { ...dim, included: true, sequence: maxSeq + 1 };
        } else {
          // When disabling, check if at least one other dimension is included
          const includedCount = taskCodeDimensions.filter(d => d.included && d.id !== dimId).length;
          if (includedCount === 0) {
            toast.error('At least one dimension must be included in task code');
            return dim;
          }
          return { ...dim, included: false, sequence: null };
        }
      }
      return dim;
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const includedDims = taskCodeDimensions.filter(d => d.included);
    const draggedItem = includedDims[draggedIndex];
    const newIncludedDims = [...includedDims];
    
    // Remove dragged item and insert at target position
    newIncludedDims.splice(draggedIndex, 1);
    newIncludedDims.splice(targetIndex, 0, draggedItem);
    
    // Update sequences
    const resequenced = newIncludedDims.map((dim, idx) => ({
      ...dim,
      sequence: idx + 1
    }));
    
    // Merge with excluded dimensions
    const excluded = taskCodeDimensions.filter(d => !d.included);
    const allDims = taskCodeDimensions.map(dim => {
      const updated = resequenced.find(d => d.id === dim.id);
      return updated || dim;
    });
    
    setTaskCodeDimensions(allDims);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Generate preview
  const generatePreview = () => {
    const included = taskCodeDimensions
      .filter(d => d.included)
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      .map(d => d.sampleCode);
    
    if (included.length === 0) return 'No dimensions selected';
    
    return `${included.join('-')}-00001`;
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 8px 0'
          }}>
            Task Code Generation
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            Configure the pattern for auto-generating task codes across your project.
          </p>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '24px'
      }}>
        {/* Header with Preview */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#272721',
            margin: '0'
          }}>
            Task Code Pattern
          </h3>

          {/* Preview */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#6B7280'
            }}>
              Preview:
            </span>
            <span style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#272721',
              fontFamily: 'monospace'
            }}>
              {generatePreview()}
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#E4EEFE',
          border: '1px solid #E4EEFE',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#1E40AF',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '-2px'
          }}>ℹ</div>
          <div>
            The sequence in which you arrange the dimensions below will determine how task codes are structured. Drag and drop to reorder. Use the × icon to exclude dimensions. Task code generation is mandatory and at least one dimension must be selected.
          </div>
        </div>

        {/* Dimension Configuration */}
        <div style={{
          marginBottom: '20px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 12px 0'
          }}>
            Select & Order Dimensions for Task Code
          </h4>

          <div style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
            padding: '12px'
          }}>
            {/* Show all dimensions - included ones first (draggable), then excluded ones */}
            {taskCodeDimensions
              .sort((a, b) => {
                // Included dimensions sorted by sequence
                if (a.included && b.included) {
                  return (a.sequence || 0) - (b.sequence || 0);
                }
                // Included dimensions come first
                if (a.included) return -1;
                if (b.included) return 1;
                // Excluded dimensions maintain original order
                return 0;
              })
              .map((dim, index) => {
                const includedDimensions = taskCodeDimensions.filter(d => d.included);
                const dimensionIndex = includedDimensions.findIndex(d => d.id === dim.id);
                const isIncluded = dim.included;
                
                return (
                  <div 
                    key={dim.id}
                    draggable={isIncluded}
                    onDragStart={(e) => isIncluded && handleDragStart(e, dimensionIndex)}
                    onDragOver={(e) => isIncluded && handleDragOver(e, dimensionIndex)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      marginBottom: '8px',
                      backgroundColor: isIncluded ? '#FFFFFF' : '#F9FAFB',
                      border: isIncluded ? '1px solid rgba(253, 67, 20, 0.3)' : '1px solid #E5E7EB',
                      borderRadius: '4px',
                      cursor: isIncluded ? 'grab' : 'default',
                      opacity: draggedIndex === dimensionIndex && isIncluded ? 0.5 : 1,
                      transition: 'all 150ms ease'
                    }}
                  >
                    {/* Drag Handle - only for included dimensions */}
                    {isIncluded && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        cursor: 'grab',
                        color: '#9CA3AF'
                      }}>
                        <div style={{ width: '12px', height: '2px', backgroundColor: 'currentColor' }} />
                        <div style={{ width: '12px', height: '2px', backgroundColor: 'currentColor' }} />
                        <div style={{ width: '12px', height: '2px', backgroundColor: 'currentColor' }} />
                      </div>
                    )}
                    
                    {/* Dimension Name */}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: isIncluded ? '600' : '500',
                      color: isIncluded ? '#272721' : '#9CA3AF',
                      textDecoration: isIncluded ? 'none' : 'line-through',
                      flex: 1,
                      marginLeft: isIncluded ? '0' : '28px'
                    }}>
                      {dim.name}
                    </span>
                    
                    {/* Sample Code */}
                    {isIncluded && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        color: '#6B7280',
                        fontFamily: 'monospace',
                        backgroundColor: '#F3F4F6',
                        padding: '4px 8px',
                        borderRadius: '3px'
                      }}>
                        {dim.sampleCode}
                      </span>
                    )}
                    
                    {/* Sequence Number - only for included dimensions */}
                    {isIncluded && (
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(253, 67, 20, 0.8)',
                        minWidth: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {dimensionIndex + 1}
                      </div>
                    )}
                    
                    {/* Action Button */}
                    {isIncluded ? (
                      <button
                        onClick={() => handleToggleInclude(dim.id, false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#EF4444',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          opacity: 0.7,
                          transition: 'opacity 150ms ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                        title="Exclude from task code"
                      >
                        <X size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleInclude(dim.id, true)}
                        style={{
                          background: 'none',
                          border: '1px solid #D8DEE8',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#FD4314',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFF4EF';
                          e.currentTarget.style.borderColor = '#FD4314';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#D8DEE8';
                        }}
                        title="Include in task code"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
}

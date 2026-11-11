import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Check, Upload, Plus, Download, FileSpreadsheet, Search, X, ChevronRight, Trash2, ChevronDown, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';
import LogoUploadModal from '../components/LogoUploadModal';
import ImportFilesModal from '../components/ImportFilesModal';
import { EditActivitiesStep } from './EditProjectConfigStep4';
import { EditCodingDimensionsStep } from './EditProjectConfigStep2';
import { EditPhasesStep } from './EditProjectConfigStep3';

type ConfigStep = 1 | 2 | 3 | 4;

export default function EditProjectConfig() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [currentStep, setCurrentStep] = useState<ConfigStep>(1);
  // All steps are completed in edit mode
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  
  // Pre-filled project data based on Google Data Center - Norway
  const [projectData, setProjectData] = useState({
    systemId: 'PRJ-2025-076',
    clientCode: 'CLI-GOOGLE',
    projectName: 'Google Data Center – Norway',
    clientName: 'Google',
    logo: null as File | null,
    country: 'Norway',
    city: 'Oslo',
    timezone: 'GMT+1',
    currency: 'NOK',
    startDate: '2025-06-26',
    finishDate: '2026-12-15',
    status: 'Active',
    notes: 'Large-scale data center construction project for Google in Norway. Project includes infrastructure development, electrical systems, cooling systems, and network infrastructure.',
    createdBy: 'Sarah Johnson',
    createdOn: '26/06/2025'
  });

  // Step 2: Pre-filled Coding Dimensions
  const [dimensions] = useState([
    { id: 'area', name: 'Area', valueCount: 8 },
    { id: 'work-package', name: 'Work Package', valueCount: 6 },
    { id: 'discipline', name: 'Discipline', valueCount: 5 },
    { id: 'cost-type', name: 'Cost Type', valueCount: 4 }
  ]);

  const [dimensionValuesMap] = useState<{ [key: string]: any[] }>({
    'area': [
      { code: 'A01', name: 'Server Room A', status: 'Active' },
      { code: 'A02', name: 'Server Room B', status: 'Active' },
      { code: 'A03', name: 'Cooling Plant', status: 'Active' },
      { code: 'A04', name: 'UPS Room', status: 'Active' },
      { code: 'A05', name: 'Electrical Substation', status: 'Active' },
      { code: 'A06', name: 'Network Operations Center', status: 'Active' },
      { code: 'A07', name: 'Loading Dock', status: 'Active' },
      { code: 'A08', name: 'Office Area', status: 'Active' }
    ],
    'work-package': [
      { code: 'WP01', name: 'Civil & Structural', status: 'Active' },
      { code: 'WP02', name: 'Electrical Systems', status: 'Active' },
      { code: 'WP03', name: 'Cooling Systems', status: 'Active' },
      { code: 'WP04', name: 'IT Infrastructure', status: 'Active' },
      { code: 'WP05', name: 'Fire & Security', status: 'Active' },
      { code: 'WP06', name: 'Finishing Works', status: 'Active' }
    ],
    'discipline': [
      { code: 'DISC01', name: 'Electrical', status: 'Active' },
      { code: 'DISC02', name: 'Mechanical', status: 'Active' },
      { code: 'DISC03', name: 'IT/Network', status: 'Active' },
      { code: 'DISC04', name: 'Civil', status: 'Active' },
      { code: 'DISC05', name: 'Architectural', status: 'Active' }
    ],
    'cost-type': [
      { code: 'CT01', name: 'Labor', status: 'Active' },
      { code: 'CT02', name: 'Material', status: 'Active' },
      { code: 'CT03', name: 'Equipment', status: 'Active' },
      { code: 'CT04', name: 'Subcontractor', status: 'Active' }
    ]
  });

  // Step 3: Pre-filled Phases
  const [phases] = useState([
    {
      id: 'phase-1',
      code: 'PH-01',
      name: 'Design & Engineering',
      selectedDisciplines: ['DISC01', 'DISC02', 'DISC03', 'DISC04'],
      selectedTradePackages: ['WP01', 'WP02', 'WP03', 'WP04'],
      subcontractorMappings: {}
    },
    {
      id: 'phase-2',
      code: 'PH-02',
      name: 'Site Preparation & Foundation',
      selectedDisciplines: ['DISC04'],
      selectedTradePackages: ['WP01'],
      subcontractorMappings: {}
    },
    {
      id: 'phase-3',
      code: 'PH-03',
      name: 'Core Infrastructure Installation',
      selectedDisciplines: ['DISC01', 'DISC02', 'DISC03'],
      selectedTradePackages: ['WP02', 'WP03', 'WP04'],
      subcontractorMappings: {}
    },
    {
      id: 'phase-4',
      code: 'PH-04',
      name: 'Testing & Commissioning',
      selectedDisciplines: ['DISC01', 'DISC02', 'DISC03'],
      selectedTradePackages: ['WP02', 'WP03', 'WP04', 'WP05'],
      subcontractorMappings: {}
    }
  ]);

  const steps = [
    { id: 1, label: 'Project Setup' },
    { id: 2, label: 'Coding Dimensions' },
    { id: 3, label: 'Project Phases' },
    { id: 4, label: 'Activities' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as ConfigStep);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as ConfigStep);
    }
  };

  const handleSaveChanges = () => {
    toast.success('Project configuration updated successfully');
    navigate(`/app/projects/${projectId}/tasks`);
  };

  const handleStepClick = (stepId: number) => {
    // In edit mode, all steps are accessible
    setCurrentStep(stepId as ConfigStep);
  };

  const isLastStep = currentStep === 4;

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
              <span 
                onClick={() => navigate(`/app/projects/${projectId}/tasks`)}
                style={{
                  cursor: 'pointer',
                  color: '#6B7280',
                  transition: 'color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FD4314'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
              >
                {projectData.projectName}
              </span>
              <ChevronRight size={14} />
              <span style={{ color: '#272721', fontWeight: '500' }}>
                Edit Configuration
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: '#D1FAE5',
            border: '1px solid #6EE7B7',
            borderRadius: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#065F46'
            }}>
              Active
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          marginBottom: '32px'
        }}>
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isClickable = true; // All steps clickable in edit mode

            return (
              <div key={step.id} style={{ 
                display: 'flex', 
                alignItems: 'center',
                flex: 1,
                position: 'relative'
              }}>
                <div 
                  onClick={() => isClickable && handleStepClick(step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: isClickable ? 'pointer' : 'default',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {/* Step Circle */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#FD4314' : isCompleted ? '#10B981' : '#FFFFFF',
                    border: isActive || isCompleted ? 'none' : '2px solid #D8DEE8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive || isCompleted ? '#FFFFFF' : '#9CA3AF',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 150ms ease'
                  }}>
                    {isCompleted && !isActive ? <Check size={20} /> : step.id}
                  </div>
                  
                  {/* Step Label */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Step {step.id}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#272721' : '#6B7280'
                    }}>
                      {step.label}
                    </span>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: isCompleted ? '#10B981' : '#E5E7EB',
                    marginLeft: '12px',
                    transition: 'background-color 150ms ease'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              height: '40px',
              padding: '0 20px',
              border: '1px solid #D8DEE8',
              backgroundColor: currentStep === 1 ? '#F9FAFB' : '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: currentStep === 1 ? '#9CA3AF' : '#374151',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 1) e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              if (currentStep !== 1) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {!isLastStep ? (
              <button
                onClick={handleNext}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSaveChanges}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                <Check size={16} />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        padding: '32px 48px'
      }}>
        {currentStep === 1 && <ProjectSetupStep data={projectData} onChange={handleInputChange} />}
        {currentStep === 2 && <EditCodingDimensionsStep />}
        {currentStep === 3 && <EditPhasesStep />}
        {currentStep === 4 && <EditActivitiesStep />}
      </div>
    </div>
  );
}

// STEP 1: PROJECT SETUP
function ProjectSetupStep({ data, onChange }: any) {
  const [showLogoModal, setShowLogoModal] = useState(false);

  return (
    <>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        padding: '32px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 8px 0'
        }}>
          Project Setup
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0 0 32px 0'
        }}>
          Edit basic project information and settings
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          {/* System ID (Read-only) */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              System ID
            </label>
            <input
              type="text"
              value={data.systemId}
              readOnly
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#F9FAFB',
                cursor: 'not-allowed'
              }}
            />
          </div>

          {/* Client Code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Client Code <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={data.clientCode}
              onChange={(e) => onChange('clientCode', e.target.value)}
              placeholder="Enter client code"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Project Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Project Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={data.projectName}
              onChange={(e) => onChange('projectName', e.target.value)}
              placeholder="Enter project name"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Client Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Client Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => onChange('clientName', e.target.value)}
              placeholder="Enter client name"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Country */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Country <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              value={data.country}
              onChange={(e) => onChange('country', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select country</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Qatar">Qatar</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Norway">Norway</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              City <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="Enter city"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Timezone */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Timezone <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              value={data.timezone}
              onChange={(e) => onChange('timezone', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select timezone</option>
              <option value="GMT+4">GMT+4 (UAE)</option>
              <option value="GMT+3">GMT+3 (Saudi Arabia)</option>
              <option value="GMT+1">GMT+1 (Norway)</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Currency <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              value={data.currency}
              onChange={(e) => onChange('currency', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select currency</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
              <option value="USD">USD</option>
              <option value="NOK">NOK</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Start Date <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Finish Date */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Finish Date <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="date"
              value={data.finishDate}
              onChange={(e) => onChange('finishDate', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Logo Upload */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Project Logo
            </label>
            <button
              onClick={() => setShowLogoModal(true)}
              style={{
                height: '40px',
                padding: '0 20px',
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
              <Upload size={16} />
              {data.logo ? 'Change Logo' : 'Upload Logo'}
            </button>
          </div>

          {/* Notes */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Notes
            </label>
            <textarea
              value={data.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Add project notes..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </div>

      {showLogoModal && (
        <LogoUploadModal
          onClose={() => setShowLogoModal(false)}
          onUpload={(file) => {
            onChange('logo', file);
            setShowLogoModal(false);
          }}
        />
      )}
    </>
  );
}
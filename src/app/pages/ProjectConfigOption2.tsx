import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Copy, Layout, Clock, Zap, Building2, Hospital, Home, Cpu, ChevronRight, Check, Search, ChevronDown, ChevronUp, Plus, X, Edit2, Package, Layers, Target, Settings2, Calendar, MapPin, User, Code, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// OPTION 2: Single-Page Visual Dashboard Configuration
export default function ProjectConfigOption2() {
  const navigate = useNavigate();
  const [configMode, setConfigMode] = useState<'choose' | 'template' | 'dashboard' | 'quick' | 'clone'>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Template data
  const templates = [
    {
      id: 'data-center',
      name: 'Data Center Project',
      icon: Cpu,
      description: 'Pre-configured for data center construction with server rooms, cooling, power, and IT infrastructure',
      color: '#3B82F6',
      popularity: 'Most Popular',
      dimensions: [
        { name: 'Area', values: ['Server Room', 'Cooling Zone', 'Power Distribution', 'Control Room', 'Storage'] },
        { name: 'Work Package', values: ['Structural', 'MEP', 'IT Infrastructure', 'Security', 'Finishing'] },
        { name: 'Discipline', values: ['Civil', 'Electrical', 'Mechanical', 'Network', 'Controls', 'Architecture'] },
        { name: 'Cost Type', values: ['Labor', 'Material', 'Equipment', 'Subcontractor'] }
      ],
      phases: [
        { name: 'Design & Engineering', disciplines: ['Architecture', 'Structural', 'MEP', 'IT'], duration: '3 months' },
        { name: 'Site Preparation', disciplines: ['Civil', 'Structural'], duration: '2 months' },
        { name: 'Installation', disciplines: ['Electrical', 'Mechanical', 'Network', 'Controls'], duration: '6 months' },
        { name: 'Commissioning', disciplines: ['MEP', 'IT', 'Controls'], duration: '2 months' }
      ],
      activities: [
        { code: 'ROC-001', name: 'Server Rack Installation', discipline: 'IT Infrastructure' },
        { code: 'ROC-002', name: 'Cooling System Installation', discipline: 'Mechanical' },
        { code: 'ROC-003', name: 'Power Distribution Unit', discipline: 'Electrical' },
        { code: 'ROC-004', name: 'Cable Tray System', discipline: 'Electrical' },
        { code: 'ROC-005', name: 'Fire Suppression System', discipline: 'MEP' },
        { code: 'ROC-006', name: 'Raised Floor System', discipline: 'Civil' },
        { code: 'ROC-007', name: 'UPS System', discipline: 'Electrical' },
        { code: 'ROC-008', name: 'Network Cabling', discipline: 'Network' },
        { code: 'ROC-009', name: 'Building Management System', discipline: 'Controls' },
        { code: 'ROC-010', name: 'Emergency Generator', discipline: 'Electrical' },
        { code: 'ROC-011', name: 'Access Control System', discipline: 'Security' },
        { code: 'ROC-012', name: 'CCTV Surveillance', discipline: 'Security' },
        { code: 'ROC-013', name: 'Electrical Panels', discipline: 'Electrical' },
        { code: 'ROC-014', name: 'Grounding System', discipline: 'Electrical' }
      ],
      estimatedSetupTime: '2 min'
    },
    {
      id: 'hospital',
      name: 'Healthcare Facility',
      icon: Hospital,
      description: 'Hospital and medical facility setup with specialized zones, medical equipment, and compliance requirements',
      color: '#10B981',
      popularity: null,
      dimensions: [],
      phases: [],
      activities: [],
      estimatedSetupTime: '3 min'
    },
    {
      id: 'residential',
      name: 'Residential Tower',
      icon: Building2,
      description: 'High-rise residential building with apartments, common areas, utilities, and finishing works',
      color: '#F59E0B',
      popularity: null,
      dimensions: [],
      phases: [],
      activities: [],
      estimatedSetupTime: '3 min'
    },
    {
      id: 'commercial',
      name: 'Commercial Building',
      icon: Building2,
      description: 'Office towers and commercial spaces with MEP systems, fit-out, and façade works',
      color: '#8B5CF6',
      popularity: null,
      dimensions: [],
      phases: [],
      activities: [],
      estimatedSetupTime: '2 min'
    }
  ];

  // Recent projects for cloning
  const recentProjects = [
    {
      id: 1,
      name: 'Google Data Center – Norway',
      client: 'Google',
      type: 'Data Center',
      completionRate: 78,
      lastModified: '2 days ago'
    },
    {
      id: 2,
      name: 'Burj Vista Residences',
      client: 'Emaar Properties',
      type: 'Residential',
      completionRate: 45,
      lastModified: '1 week ago'
    },
    {
      id: 3,
      name: 'King Fahad Medical City Extension',
      client: 'Ministry of Health',
      type: 'Healthcare',
      completionRate: 92,
      lastModified: '3 weeks ago'
    }
  ];

  if (configMode === 'choose') {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F7F9FC',
        padding: '48px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#272721',
              margin: '0 0 12px 0'
            }}>
              How would you like to set up your project?
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              margin: 0
            }}>
              Choose the fastest way to get started with your project configuration
            </p>
          </div>

          {/* Configuration Options - 3 cards in a row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '48px',
            maxWidth: '1200px',
            margin: '0 auto 48px auto'
          }}>
            {/* Option 1: From Template */}
            <button
              onClick={() => setConfigMode('template')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                padding: '32px 24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FD4314';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(253, 67, 20, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 10px',
                backgroundColor: '#FFF4EF',
                border: '1px solid #FD4314',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#FD4314',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Recommended
              </div>
              <Layout size={40} style={{ color: '#FD4314', marginBottom: '16px' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 8px 0'
              }}>
                Start from Template
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                Choose from industry-specific templates with pre-configured dimensions, phases, and activities
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#10B981',
                fontWeight: '500'
              }}>
                <Clock size={16} />
                <span>Setup in 2-3 minutes</span>
              </div>
            </button>

            {/* Option 2: Quick Setup */}
            <button
              onClick={() => setConfigMode('quick')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                padding: '32px 24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FD4314';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(253, 67, 20, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Zap size={40} style={{ color: '#F59E0B', marginBottom: '16px' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 8px 0'
              }}>
                Quick Setup
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                Answer 5 simple questions and let our system auto-configure everything for you
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#10B981',
                fontWeight: '500'
              }}>
                <Clock size={16} />
                <span>Setup in 30 seconds</span>
              </div>
            </button>

            {/* Option 3: Clone Existing */}
            <button
              onClick={() => setConfigMode('clone')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                padding: '32px 24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FD4314';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(253, 67, 20, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Copy size={40} style={{ color: '#3B82F6', marginBottom: '16px' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 8px 0'
              }}>
                Clone from Existing
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                Copy configuration from your previous projects and customize what's different
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#10B981',
                fontWeight: '500'
              }}>
                <Clock size={16} />
                <span>Setup in 1 minute</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE GALLERY VIEW
  if (configMode === 'template') {
    return <TemplateGallery onBack={() => setConfigMode('choose')} onSelectTemplate={(template) => {
      setSelectedTemplate(template);
      setConfigMode('dashboard');
    }} templates={templates} />;
  }

  // SINGLE-PAGE DASHBOARD VIEW
  if (configMode === 'dashboard' && selectedTemplate) {
    return <SinglePageDashboard template={selectedTemplate} onBack={() => setConfigMode('template')} />;
  }

  // QUICK SETUP VIEW
  if (configMode === 'quick') {
    return <QuickSetupWizard onBack={() => setConfigMode('choose')} />;
  }

  // CLONE VIEW
  if (configMode === 'clone') {
    return <CloneProjectView onBack={() => setConfigMode('choose')} projects={recentProjects} />;
  }

  return null;
}

// TEMPLATE GALLERY (same as before)
function TemplateGallery({ onBack, onSelectTemplate, templates }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates = templates.filter((t: any) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC',
      padding: '48px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '4px'
          }}
        >
          ← Back to Options
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#272721',
            margin: '0 0 12px 0'
          }}>
            Choose Your Project Template
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            margin: 0
          }}>
            Pre-configured templates designed for different project types
          </p>
        </div>

        {/* Search */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 40px auto',
          position: 'relative'
        }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF'
          }} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              padding: '0 16px 0 48px',
              border: '1px solid #D8DEE8',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>

        {/* Templates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredTemplates.map((template: any) => {
            const Icon = template.icon;
            const isSelected = selectedTemplateId === template.id;
            
            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isSelected ? '2px solid #FD4314' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#FD4314';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {template.popularity && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '4px 10px',
                    backgroundColor: '#FFF4EF',
                    border: '1px solid #FD4314',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#FD4314',
                    textTransform: 'uppercase'
                  }}>
                    {template.popularity}
                  </div>
                )}

                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#FD4314',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={16} style={{ color: '#FFFFFF' }} />
                  </div>
                )}

                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: `${template.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={32} style={{ color: template.color }} />
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  {template.name}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 20px 0',
                  lineHeight: '1.5',
                  minHeight: '60px'
                }}>
                  {template.description}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#272721'
                    }}>
                      {template.dimensions?.length || 8}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      marginTop: '2px'
                    }}>
                      Dimensions
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#272721'
                    }}>
                      {template.phases?.length || 4}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      marginTop: '2px'
                    }}>
                      Phases
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#272721'
                    }}>
                      {template.activities?.length || 14}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      marginTop: '2px'
                    }}>
                      Activities
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '13px',
                  color: '#10B981',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={14} />
                  {template.estimatedSetupTime} to configure
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {selectedTemplateId && (
          <div style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 100
          }}>
            <button
              onClick={() => {
                const template = templates.find((t: any) => t.id === selectedTemplateId);
                onSelectTemplate(template);
              }}
              style={{
                height: '56px',
                padding: '0 32px',
                border: 'none',
                backgroundColor: '#FD4314',
                borderRadius: '28px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(253, 67, 20, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              Continue with Template
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// SINGLE-PAGE DASHBOARD - Everything visible at once!
function SinglePageDashboard({ template, onBack }: any) {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<any>({
    dimensions: true,
    phases: true,
    activities: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  const handleCreateProject = () => {
    toast.success('Project created successfully!');
    navigate('/app');
  };

  const Icon = template.icon;

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC'
    }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '4px'
            }}
          >
            ← Back
          </button>

          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: '#E5E7EB'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: `${template.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={24} style={{ color: template.color }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 2px 0'
              }}>
                {template.name} Template
              </h2>
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                margin: 0
              }}>
                Review and customize your configuration
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateProject}
          disabled={!projectName || !projectCode}
          style={{
            height: '40px',
            padding: '0 24px',
            border: 'none',
            backgroundColor: (!projectName || !projectCode) ? '#E5E7EB' : '#FD4314',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#FFFFFF',
            cursor: (!projectName || !projectCode) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} />
          Create Project
        </button>
      </div>

      {/* Single Scrolling Page */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px'
      }}>
        {/* Project Basics - Compact Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #FD4314',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <Settings2 size={24} style={{ color: '#FD4314' }} />
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 2px 0'
              }}>
                Project Basics
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Required information to create the project
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Project Name <span style={{ color: '#FD4314' }}>*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Oslo Data Center"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Project Code <span style={{ color: '#FD4314' }}>*</span>
              </label>
              <input
                type="text"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                placeholder="e.g., DC-OSL-2024"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Client
              </label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">Select client</option>
                <option value="Google">Google</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Oslo, Norway"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Coding Dimensions - Collapsible Visual Cards */}
        <CollapsibleSection
          title="Coding Dimensions"
          subtitle={`${template.dimensions?.length || 4} dimensions pre-configured`}
          icon={Layout}
          count={template.dimensions?.length || 4}
          expanded={expandedSections.dimensions}
          onToggle={() => toggleSection('dimensions')}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {template.dimensions?.map((dim: any, idx: number) => (
              <VisualDimensionCard key={idx} dimension={dim} />
            ))}
          </div>
        </CollapsibleSection>

        {/* Project Phases - Collapsible Timeline View */}
        <CollapsibleSection
          title="Project Phases"
          subtitle={`${template.phases?.length || 4} phases configured in sequence`}
          icon={Layers}
          count={template.phases?.length || 4}
          expanded={expandedSections.phases}
          onToggle={() => toggleSection('phases')}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {template.phases?.map((phase: any, idx: number) => (
              <VisualPhaseCard key={idx} phase={phase} index={idx} />
            ))}
          </div>
        </CollapsibleSection>

        {/* Activities - Collapsible Grid */}
        <CollapsibleSection
          title="Activities (ROC)"
          subtitle={`${template.activities?.length || 14} pre-selected from library`}
          icon={Target}
          count={template.activities?.length || 14}
          expanded={expandedSections.activities}
          onToggle={() => toggleSection('activities')}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {template.activities?.map((activity: any, idx: number) => (
              <VisualActivityCard key={idx} activity={activity} />
            ))}
          </div>
        </CollapsibleSection>

        {/* Bottom Action */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          backgroundColor: 'rgba(253, 67, 20, 0.05)',
          border: '2px solid rgba(253, 67, 20, 0.2)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <CheckCircle2 size={32} style={{ color: '#FD4314', marginBottom: '12px' }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#FD4314',
            margin: '0 0 8px 0'
          }}>
            Configuration Complete!
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0 0 20px 0'
          }}>
            Your project is ready to be created with all configurations applied.
          </p>
          <button
            onClick={handleCreateProject}
            disabled={!projectName || !projectCode}
            style={{
              height: '48px',
              padding: '0 32px',
              border: 'none',
              backgroundColor: (!projectName || !projectCode) ? '#E5E7EB' : '#FD4314',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#FFFFFF',
              cursor: (!projectName || !projectCode) ? 'not-allowed' : 'pointer'
            }}
          >
            Create Project Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({ title, subtitle, icon: Icon, count, expanded, onToggle, children }: any) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      marginBottom: '16px',
      overflow: 'hidden'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px 24px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            backgroundColor: '#F3F6FA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={24} style={{ color: '#3B82F6' }} />
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '17px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 4px 0'
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: 0
            }}>
              {subtitle}
            </p>
          </div>

          <div style={{
            padding: '4px 12px',
            backgroundColor: '#F3F6FA',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#272721'
          }}>
            {count}
          </div>

          {expanded ? (
            <ChevronUp size={20} style={{ color: '#6B7280' }} />
          ) : (
            <ChevronDown size={20} style={{ color: '#6B7280' }} />
          )}
        </div>
      </button>

      {expanded && (
        <div style={{
          padding: '0 24px 24px 24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <div style={{ paddingTop: '20px' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Visual Dimension Card
function VisualDimensionCard({ dimension }: any) {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      backgroundColor: '#FAFBFC'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#272721'
        }}>
          {dimension.name}
        </span>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6B7280',
          padding: '3px 8px',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px'
        }}>
          {dimension.values.length} values
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px'
      }}>
        {dimension.values.slice(0, 3).map((value: string, idx: number) => (
          <span
            key={idx}
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              color: '#6B7280'
            }}
          >
            {value}
          </span>
        ))}
        {dimension.values.length > 3 && (
          <span style={{
            fontSize: '11px',
            padding: '4px 8px',
            color: '#3B82F6',
            fontWeight: '600'
          }}>
            +{dimension.values.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

// Visual Phase Card
function VisualPhaseCard({ phase, index }: any) {
  return (
    <div style={{
      padding: '16px 20px',
      border: '1px solid #E5E7EB',
      borderLeft: '4px solid #3B82F6',
      borderRadius: '8px',
      backgroundColor: '#FAFBFC',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#3B82F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        color: '#FFFFFF',
        flexShrink: 0
      }}>
        {index + 1}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#272721',
          marginBottom: '6px'
        }}>
          {phase.name}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#6B7280',
          display: 'flex',
          gap: '16px'
        }}>
          <span>{phase.disciplines.length} disciplines</span>
          <span>•</span>
          <span>{phase.duration}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxWidth: '400px'
      }}>
        {phase.disciplines.slice(0, 3).map((disc: string, idx: number) => (
          <span
            key={idx}
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              color: '#6B7280'
            }}
          >
            {disc}
          </span>
        ))}
        {phase.disciplines.length > 3 && (
          <span style={{
            fontSize: '11px',
            padding: '3px 8px',
            color: '#3B82F6',
            fontWeight: '600'
          }}>
            +{phase.disciplines.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

// Visual Activity Card
function VisualActivityCard({ activity }: any) {
  return (
    <div style={{
      padding: '12px',
      border: '1px solid #E5E7EB',
      borderRadius: '6px',
      backgroundColor: '#FAFBFC',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    }}>
      <div style={{
        marginTop: '2px'
      }}>
        <CheckCircle2 size={16} style={{ color: '#10B981' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#272721',
          marginBottom: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {activity.name}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#6B7280'
        }}>
          {activity.code}
        </div>
      </div>
    </div>
  );
}

// Quick Setup and Clone views remain the same...
function QuickSetupWizard({ onBack }: any) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px'
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '48px',
        textAlign: 'center'
      }}>
        <Zap size={48} style={{ color: '#F59E0B', marginBottom: '16px' }} />
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 12px 0'
        }}>
          Quick Setup Wizard
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0 0 24px 0'
        }}>
          This feature is coming soon. Answer 5 simple questions and we'll configure everything automatically.
        </p>
        <button
          onClick={onBack}
          style={{
            height: '40px',
            padding: '0 24px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer'
          }}
        >
          Back to Options
        </button>
      </div>
    </div>
  );
}

function CloneProjectView({ onBack, projects }: any) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F7F9FC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px'
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '48px',
        textAlign: 'center'
      }}>
        <Copy size={48} style={{ color: '#3B82F6', marginBottom: '16px' }} />
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 12px 0'
        }}>
          Clone from Existing
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0 0 24px 0'
        }}>
          This feature is coming soon. Copy configuration from your previous projects instantly.
        </p>
        <button
          onClick={onBack}
          style={{
            height: '40px',
            padding: '0 24px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer'
          }}
        >
          Back to Options
        </button>
      </div>
    </div>
  );
}

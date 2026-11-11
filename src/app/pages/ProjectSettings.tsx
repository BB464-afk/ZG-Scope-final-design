import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Edit2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

type SettingsTab = 'details' | 'scope' | 'dimensions' | 'activities';
type DimensionTab = 'discipline' | 'tradePackage' | 'location' | 'costCenter';

export default function ProjectSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('details');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [activeDimensionTab, setActiveDimensionTab] = useState<DimensionTab>('discipline');
  const [expandedScopeId, setExpandedScopeId] = useState<string | null>(null);
  const [showAddScopeModal, setShowAddScopeModal] = useState(false);
  const [selectedScopeFromMaster, setSelectedScopeFromMaster] = useState('');

  // Scope Master Data
  const scopeMaster = [
    { id: 'SCO-001', code: 'SCO-001', name: 'Design & Engineering' },
    { id: 'SCO-002', code: 'SCO-002', name: 'Construction & Installation' },
    { id: 'SCO-003', code: 'SCO-003', name: 'Procurement' },
    { id: 'SCO-004', code: 'SCO-004', name: 'Commissioning & Handover' }
  ];

  // Project data
  const [projectData, setProjectData] = useState({
    systemId: 'PRJ-2026-0042',
    clientCode: 'DXB-2024-001',
    projectName: 'Dubai Data Center Phase 2',
    clientName: 'Emirates Digital Infrastructure LLC',
    country: 'United Arab Emirates',
    city: 'Dubai',
    timezone: 'GMT+4 (Gulf Standard Time)',
    currency: 'AED - Dirham',
    startDate: '01/03/2026',
    finishDate: '31/12/2026',
    status: 'Active',
    createdBy: 'John Anderson',
    createdOn: '28/02/2026'
  });

  // Scopes data
  const [scopes, setScopes] = useState([
    {
      id: 'scope-1',
      code: 'SC-01',
      name: 'Design & Engineering',
      disciplines: ['DISC01 - Electrical', 'DISC02 - Mechanical', 'DISC03 - IT/Network'],
      tradePackages: [
        { code: 'WP01', name: 'Civil & Structural', subcontractors: ['BuildTech LLC', 'ConstructPro'] },
        { code: 'WP02', name: 'Electrical Systems', subcontractors: ['ElectroMax Solutions'] }
      ]
    },
    {
      id: 'scope-2',
      code: 'SC-02',
      name: 'Site Preparation',
      disciplines: ['DISC04 - Civil'],
      tradePackages: [
        { code: 'WP01', name: 'Civil & Structural', subcontractors: ['BuildTech LLC'] }
      ]
    },
    {
      id: 'scope-3',
      code: 'SC-03',
      name: 'Core Infrastructure',
      disciplines: ['DISC01 - Electrical', 'DISC02 - Mechanical', 'DISC03 - IT/Network'],
      tradePackages: [
        { code: 'WP02', name: 'Electrical Systems', subcontractors: ['ElectroMax Solutions'] },
        { code: 'WP03', name: 'Cooling Systems', subcontractors: ['CoolTech HVAC', 'Climate Control Pro'] },
        { code: 'WP04', name: 'IT Infrastructure', subcontractors: ['DataNet Systems'] }
      ]
    }
  ]);

  // Dimensions data
  const [dimensions, setDimensions] = useState({
    discipline: [
      { id: '1', code: 'DISC01', name: 'Electrical', description: 'Electrical works and systems', status: 'Active' },
      { id: '2', code: 'DISC02', name: 'Mechanical', description: 'Mechanical installations', status: 'Active' },
      { id: '3', code: 'DISC03', name: 'IT/Network', description: 'IT infrastructure and networking', status: 'Active' },
      { id: '4', code: 'DISC04', name: 'Civil', description: 'Civil and structural works', status: 'Active' },
      { id: '5', code: 'DISC05', name: 'Architectural', description: 'Architectural finishing', status: 'Inactive' }
    ],
    tradePackage: [
      { id: '1', code: 'WP01', name: 'Civil & Structural', description: 'Foundation and structure', status: 'Active' },
      { id: '2', code: 'WP02', name: 'Electrical Systems', description: 'Power distribution', status: 'Active' },
      { id: '3', code: 'WP03', name: 'Cooling Systems', description: 'HVAC and cooling', status: 'Active' },
      { id: '4', code: 'WP04', name: 'IT Infrastructure', description: 'Servers and network', status: 'Active' }
    ],
    location: [
      { id: '1', code: 'L01', name: 'Building A - Ground Floor', description: 'Main server room', status: 'Active' },
      { id: '2', code: 'L02', name: 'Building A - First Floor', description: 'Network operations center', status: 'Active' },
      { id: '3', code: 'L03', name: 'Building B - Ground Floor', description: 'Backup facility', status: 'Active' }
    ],
    costCenter: [
      { id: '1', code: 'CC01', name: 'Infrastructure', description: 'Core infrastructure costs', status: 'Active' },
      { id: '2', code: 'CC02', name: 'Operations', description: 'Operational expenses', status: 'Active' }
    ]
  });

  const tabs = [
    { id: 'details' as SettingsTab, label: 'Project Details' },
    { id: 'scope' as SettingsTab, label: 'Project Scope' },
    { id: 'dimensions' as SettingsTab, label: 'Coding Dimensions' },
    { id: 'activities' as SettingsTab, label: 'Activities (ROCs)' }
  ];

  const dimensionTabs = [
    { id: 'discipline' as DimensionTab, label: 'Discipline' },
    { id: 'tradePackage' as DimensionTab, label: 'Trade Package' },
    { id: 'location' as DimensionTab, label: 'Location' },
    { id: 'costCenter' as DimensionTab, label: 'Cost Center' }
  ];

  const handleSaveDetails = () => {
    setIsEditingDetails(false);
    toast.success('Project details updated successfully');
  };

  const toggleDimensionStatus = (dimensionType: DimensionTab, id: string) => {
    setDimensions(prev => ({
      ...prev,
      [dimensionType]: prev[dimensionType].map(item =>
        item.id === id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item
      )
    }));
    toast.success('Status updated');
  };

  const deleteDimension = (dimensionType: DimensionTab, id: string) => {
    setDimensions(prev => ({
      ...prev,
      [dimensionType]: prev[dimensionType].filter(item => item.id !== id)
    }));
    toast.success('Item deleted');
  };

  const handleAddScope = () => {
    if (selectedScopeFromMaster) {
      const newScope = scopeMaster.find(scope => scope.id === selectedScopeFromMaster);
      if (newScope) {
        setScopes(prev => [
          ...prev,
          {
            id: `scope-${prev.length + 1}`,
            code: newScope.code,
            name: newScope.name,
            disciplines: [],
            tradePackages: []
          }
        ]);
        toast.success('Scope added successfully');
      }
    }
    setShowAddScopeModal(false);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#F7F9FC'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #D8DEE8',
        padding: '24px 48px 0 48px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 24px 0'
        }}>
          Project Settings
        </h1>

        {/* Horizontal Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px'
        }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: isActive ? '2px solid #FD4314' : '2px solid transparent',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#FD4314' : '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  marginBottom: '-1px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#272721';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        padding: '32px 48px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* PROJECT DETAILS TAB */}
        {activeTab === 'details' && (
          <div>
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '24px'
            }}>
              {!isEditingDetails ? (
                <button
                  onClick={() => setIsEditingDetails(true)}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#272721',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Edit2 size={16} />
                  Edit Details
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setIsEditingDetails(false)}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: '1px solid #D8DEE8',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#272721',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDetails}
                    style={{
                      height: '40px',
                      padding: '0 20px',
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
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Details Content */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '4px',
              padding: '32px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px 48px'
              }}>
                {/* System ID */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    System ID
                  </label>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#272721',
                    padding: '10px 0'
                  }}>
                    {projectData.systemId}
                  </div>
                </div>

                {/* Client Code */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Client Code
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.clientCode}
                      onChange={(e) => setProjectData({ ...projectData, clientCode: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.clientCode}
                    </div>
                  )}
                </div>

                {/* Project Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Project Name
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.projectName}
                      onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.projectName}
                    </div>
                  )}
                </div>

                {/* Client Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Client Name
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.clientName}
                      onChange={(e) => setProjectData({ ...projectData, clientName: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.clientName}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{
                  gridColumn: '1 / -1',
                  height: '1px',
                  backgroundColor: '#E5E7EB',
                  margin: '8px 0'
                }} />

                {/* Location Section Header */}
                <div style={{
                  gridColumn: '1 / -1',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#272721',
                  marginTop: '8px'
                }}>
                  Location & Regional Settings
                </div>

                {/* Country */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Country
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.country}
                      onChange={(e) => setProjectData({ ...projectData, country: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '15px',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.country}
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    City
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.city}
                      onChange={(e) => setProjectData({ ...projectData, city: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '15px',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.city}
                    </div>
                  )}
                </div>

                {/* Timezone */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Timezone
                  </label>
                  <div style={{
                    fontSize: '15px',
                    color: '#272721',
                    padding: '10px 0'
                  }}>
                    {projectData.timezone}
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Currency
                  </label>
                  <div style={{
                    fontSize: '15px',
                    color: '#272721',
                    padding: '10px 0'
                  }}>
                    {projectData.currency}
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  gridColumn: '1 / -1',
                  height: '1px',
                  backgroundColor: '#E5E7EB',
                  margin: '8px 0'
                }} />

                {/* Timeline Section Header */}
                <div style={{
                  gridColumn: '1 / -1',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#272721',
                  marginTop: '8px'
                }}>
                  Project Timeline
                </div>

                {/* Start Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Start Date
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.startDate}
                      onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '15px',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.startDate}
                    </div>
                  )}
                </div>

                {/* Finish Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Finish Date
                  </label>
                  {isEditingDetails ? (
                    <input
                      type="text"
                      value={projectData.finishDate}
                      onChange={(e) => setProjectData({ ...projectData, finishDate: e.target.value })}
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
                  ) : (
                    <div style={{
                      fontSize: '15px',
                      color: '#272721',
                      padding: '10px 0'
                    }}>
                      {projectData.finishDate}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Status
                  </label>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    backgroundColor: '#E8F5E9',
                    border: '1px solid #4CAF50',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#2E7D32',
                    marginTop: '10px'
                  }}>
                    {projectData.status}
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Created By
                  </label>
                  <div style={{
                    fontSize: '15px',
                    color: '#272721',
                    padding: '10px 0'
                  }}>
                    {projectData.createdBy}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    marginTop: '4px'
                  }}>
                    {projectData.createdOn}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT SCOPE TAB */}
        {activeTab === 'scope' && (
          <div>
            {/* Header with Add Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                Manage project scopes with disciplines, trade packages, and subcontractors
              </p>

              <button
                onClick={() => setShowAddScopeModal(true)}
                style={{
                  height: '40px',
                  padding: '0 20px',
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
              >
                <Plus size={16} />
                Add Scope
              </button>
            </div>

            {/* Scopes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scopes.map(scope => {
                const isExpanded = expandedScopeId === scope.id;

                return (
                  <div
                    key={scope.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Scope Header */}
                    <div
                      onClick={() => setExpandedScopeId(isExpanded ? null : scope.id)}
                      style={{
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isExpanded ? '1px solid #D8DEE8' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        {isExpanded ? (
                          <ChevronDown size={20} style={{ color: '#6B7280', flexShrink: 0 }} />
                        ) : (
                          <ChevronRight size={20} style={{ color: '#6B7280', flexShrink: 0 }} />
                        )}
                        
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#272721',
                            marginBottom: '4px'
                          }}>
                            {scope.code} - {scope.name}
                          </div>
                          {!isExpanded && (
                            <div style={{
                              fontSize: '13px',
                              color: '#6B7280'
                            }}>
                              {scope.disciplines.length} Disciplines • {scope.tradePackages.length} Trade Packages
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toast.success('Edit scope functionality')}
                          style={{
                            padding: '8px',
                            border: '1px solid #D8DEE8',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#272721'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => toast.success('Delete scope')}
                          style={{
                            padding: '8px',
                            border: '1px solid #D8DEE8',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#EF4444'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div style={{ padding: '24px', backgroundColor: '#FAFBFC' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 2fr',
                          gap: '32px'
                        }}>
                          {/* Disciplines */}
                          <div>
                            <h4 style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#6B7280',
                              margin: '0 0 12px 0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Disciplines
                            </h4>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}>
                              {scope.disciplines.map((disc, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '10px 12px',
                                    backgroundColor: 'rgba(253, 67, 20, 0.08)',
                                    border: '1px solid #FD4314',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: '#FD4314'
                                  }}
                                >
                                  {disc}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trade Packages & Subcontractors */}
                          <div>
                            <h4 style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#6B7280',
                              margin: '0 0 12px 0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Trade Packages & Subcontractors
                            </h4>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}>
                              {scope.tradePackages.map((tp, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '16px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#272721',
                                    marginBottom: '12px'
                                  }}>
                                    {tp.code} - {tp.name}
                                  </div>
                                  <div style={{
                                    fontSize: '12px',
                                    color: '#6B7280',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: '600'
                                  }}>
                                    Subcontractors
                                  </div>
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                  }}>
                                    {tp.subcontractors.map((sub, subIdx) => (
                                      <div
                                        key={subIdx}
                                        style={{
                                          padding: '6px 12px',
                                          backgroundColor: '#F9FAFB',
                                          border: '1px solid #D8DEE8',
                                          borderRadius: '4px',
                                          fontSize: '13px',
                                          color: '#272721'
                                        }}
                                      >
                                        {sub}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Scope Modal */}
            {showAddScopeModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  padding: '32px',
                  width: '400px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#272721',
                    margin: '0 0 24px 0'
                  }}>
                    Add New Scope
                  </h3>

                  <div style={{
                    marginBottom: '24px'
                  }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6B7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Select Scope <span style={{ color: '#FD4314' }}>*</span>
                    </label>
                    <StandardDropdown
                      options={scopeMaster.map(scope => ({ value: scope.id, label: `${scope.code} - ${scope.name}` }))}
                      value={selectedScopeFromMaster}
                      onChange={(value) => setSelectedScopeFromMaster(value)}
                      placeholder="Select a scope..."
                      mode="single"
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => setShowAddScopeModal(false)}
                      style={{
                        height: '40px',
                        padding: '0 20px',
                        border: '1px solid #D8DEE8',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#272721',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={handleAddScope}
                      style={{
                        height: '40px',
                        padding: '0 20px',
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
                    >
                      <Plus size={16} />
                      Add Scope
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CODING DIMENSIONS TAB */}
        {activeTab === 'dimensions' && (
          <div>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0'
            }}>
              Manage project-specific coding dimensions
            </p>

            {/* Dimension Tabs */}
            <div style={{
              borderBottom: '1px solid #D8DEE8',
              marginBottom: '24px',
              display: 'flex',
              gap: '4px'
            }}>
              {dimensionTabs.map(tab => {
                const isActive = activeDimensionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDimensionTab(tab.id)}
                    style={{
                      padding: '12px 20px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      borderBottom: isActive ? '2px solid #FD4314' : '2px solid transparent',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#FD4314' : '#6B7280',
                      cursor: 'pointer',
                      marginBottom: '-1px'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Add New Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => toast.success(`Add new ${dimensionTabs.find(t => t.id === activeDimensionTab)?.label}`)}
                style={{
                  height: '40px',
                  padding: '0 20px',
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
              >
                <Plus size={16} />
                Add {dimensionTabs.find(t => t.id === activeDimensionTab)?.label}
              </button>
            </div>

            {/* Dimension Table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '140px 200px 1fr 110px 110px',
                padding: '16px 20px',
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #D8DEE8',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <div>Code</div>
                <div>Name</div>
                <div>Description</div>
                <div>Status</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>

              {/* Table Rows */}
              {dimensions[activeDimensionTab].map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 200px 1fr 110px 110px',
                    padding: '16px 20px',
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
                    borderBottom: index < dimensions[activeDimensionTab].length - 1 ? '1px solid #F0F1F3' : 'none',
                    fontSize: '14px',
                    color: '#272721',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{item.code}</div>
                  <div style={{ fontWeight: '500' }}>{item.name}</div>
                  <div style={{ color: '#6B7280' }}>{item.description}</div>
                  <div>
                    <button
                      onClick={() => toggleDimensionStatus(activeDimensionTab, item.id)}
                      style={{
                        padding: '5px 12px',
                        border: 'none',
                        backgroundColor: item.status === 'Active' ? '#E8F5E9' : '#FFF4EF',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: item.status === 'Active' ? '#2E7D32' : '#FD4314',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {item.status === 'Active' ? <Eye size={12} /> : <EyeOff size={12} />}
                      {item.status}
                    </button>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => toast.success('Edit functionality')}
                      style={{
                        padding: '6px',
                        border: '1px solid #D8DEE8',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#272721'
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteDimension(activeDimensionTab, item.id)}
                      style={{
                        padding: '6px',
                        border: '1px solid #D8DEE8',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#EF4444'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITIES (ROCs) TAB */}
        {activeTab === 'activities' && (
          <div>
            <div style={{
              textAlign: 'center',
              padding: '80px 32px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '4px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                backgroundColor: 'rgba(253, 67, 20, 0.08)',
                border: '1px solid #FD4314',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '28px',
                  color: '#FD4314'
                }}>
                  📋
                </div>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 8px 0'
              }}>
                Activities (ROCs) Management
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                This section will display the ROC activities table with pagination and expandable sub-steps
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
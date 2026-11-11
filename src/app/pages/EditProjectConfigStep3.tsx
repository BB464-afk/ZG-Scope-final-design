import React, { useState } from 'react';
import { Plus, X, Archive, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

// STEP 3: PROJECT SCOPE - Edit Mode
export function EditPhasesStep() {
  const [scopes, setScopes] = useState([
    {
      id: 'scope-1',
      code: 'SC-01',
      name: 'Design & Engineering',
      isUsed: true, // Used scope
      selectedDisciplines: ['DISC01', 'DISC02', 'DISC03', 'DISC04'],
      tradePackages: [
        { id: 'WP01', selectedSubcontractors: ['SUB01', 'SUB02'] },
        { id: 'WP02', selectedSubcontractors: ['SUB03'] }
      ],
      isArchived: false
    },
    {
      id: 'scope-2',
      code: 'SC-02',
      name: 'Site Preparation & Foundation',
      isUsed: false, // Unused scope
      selectedDisciplines: ['DISC04'],
      tradePackages: [
        { id: 'WP01', selectedSubcontractors: ['SUB01'] }
      ],
      isArchived: false
    }
  ]);

  const [editingScopeId, setEditingScopeId] = useState<string | null>(null);
  const [showAddTPModal, setShowAddTPModal] = useState(false);
  const [selectedScopeForTP, setSelectedScopeForTP] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningAction, setWarningAction] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});

  // Master data
  const scopeMaster = [
    { id: 'SCO-001', code: 'SCO-001', name: 'Design & Engineering' },
    { id: 'SCO-002', code: 'SCO-002', name: 'Construction & Installation' },
    { id: 'SCO-003', code: 'SCO-003', name: 'Procurement' },
    { id: 'SCO-004', code: 'SCO-004', name: 'Commissioning & Handover' }
  ];

  const disciplineMaster = [
    { id: 'DISC01', code: 'DISC01', name: 'Electrical' },
    { id: 'DISC02', code: 'DISC02', name: 'Mechanical' },
    { id: 'DISC03', code: 'DISC03', name: 'IT/Network' },
    { id: 'DISC04', code: 'DISC04', name: 'Civil' },
    { id: 'DISC05', code: 'DISC05', name: 'Architectural' }
  ];

  const tradePackageMaster = [
    { id: 'WP01', code: 'WP01', name: 'Civil & Structural' },
    { id: 'WP02', code: 'WP02', name: 'Electrical Systems' },
    { id: 'WP03', code: 'WP03', name: 'Cooling Systems' },
    { id: 'WP04', code: 'WP04', name: 'IT Infrastructure' },
    { id: 'WP05', code: 'WP05', name: 'Fire & Security' },
    { id: 'WP06', code: 'WP06', name: 'Finishing Works' }
  ];

  const subcontractorMaster = [
    { id: 'SUB01', code: 'SUB01', name: 'BuildTech Solutions' },
    { id: 'SUB02', code: 'SUB02', name: 'ElectroPro Services' },
    { id: 'SUB03', code: 'SUB03', name: 'CoolAir Systems' },
    { id: 'SUB04', code: 'SUB04', name: 'ITNet Infrastructure' },
    { id: 'SUB05', code: 'SUB05', name: 'SecureFire Ltd' }
  ];

  const handleAddScope = () => {
    const newScope = {
      id: `scope-${Date.now()}`,
      code: '',
      name: '',
      isUsed: false,
      selectedDisciplines: [] as string[],
      tradePackages: [] as any[],
      isArchived: false
    };
    setScopes([...scopes, newScope]);
    setEditingScopeId(newScope.id);
  };

  const handleArchiveScope = (scopeId: string) => {
    const scope = scopes.find(s => s.id === scopeId);
    if (!scope) return;

    if (scope.isUsed) {
      setWarningAction({
        type: 'archive',
        scopeId,
        message: 'This scope is currently in use. Archiving it may affect existing data.'
      });
      setShowWarningModal(true);
    } else {
      executeArchive(scopeId);
    }
  };

  const executeArchive = (scopeId: string) => {
    setScopes(scopes.map(s => s.id === scopeId ? { ...s, isArchived: true } : s));
    toast.success('Scope archived successfully');
    if (editingScopeId === scopeId) {
      setEditingScopeId(null);
    }
  };

  const updateScope = (scopeId: string, field: string, value: any) => {
    const scope = scopes.find(s => s.id === scopeId);
    if (!scope) return;

    // Check if edit is allowed
    if (field === 'code') {
      toast.error('Scope code cannot be edited');
      return;
    }

    if (field === 'name' && scope.isUsed) {
      setWarningAction({
        type: 'edit',
        scopeId,
        field,
        value,
        message: 'This scope is currently in use. Changing the name may affect existing references.'
      });
      setShowWarningModal(true);
      return;
    }

    setScopes(scopes.map(s => s.id === scopeId ? { ...s, [field]: value } : s));
  };

  const handleRemoveDiscipline = (scopeId: string, disciplineId: string) => {
    const scope = scopes.find(s => s.id === scopeId);
    if (!scope) return;

    if (scope.isUsed) {
      setWarningAction({
        type: 'removeDiscipline',
        scopeId,
        disciplineId,
        message: 'This scope is currently in use. Removing this discipline may affect existing data.'
      });
      setShowWarningModal(true);
    } else {
      executeRemoveDiscipline(scopeId, disciplineId);
    }
  };

  const executeRemoveDiscipline = (scopeId: string, disciplineId: string) => {
    setScopes(scopes.map(s => 
      s.id === scopeId 
        ? { ...s, selectedDisciplines: s.selectedDisciplines.filter(id => id !== disciplineId) }
        : s
    ));
  };

  const handleRemoveTradePackage = (scopeId: string, tpId: string) => {
    const scope = scopes.find(s => s.id === scopeId);
    if (!scope) return;

    if (scope.isUsed) {
      setWarningAction({
        type: 'removeTP',
        scopeId,
        tpId,
        message: 'This scope is currently in use. Removing this trade package may affect existing data.'
      });
      setShowWarningModal(true);
    } else {
      executeRemoveTradePackage(scopeId, tpId);
    }
  };

  const executeRemoveTradePackage = (scopeId: string, tpId: string) => {
    setScopes(scopes.map(s => 
      s.id === scopeId 
        ? { ...s, tradePackages: s.tradePackages.filter(tp => tp.id !== tpId) }
        : s
    ));
  };

  const handleRemoveSubcontractor = (scopeId: string, tpId: string, subId: string) => {
    const scope = scopes.find(s => s.id === scopeId);
    if (!scope) return;

    if (scope.isUsed) {
      setWarningAction({
        type: 'removeSubcontractor',
        scopeId,
        tpId,
        subId,
        message: 'This scope is currently in use. Removing this subcontractor may affect existing data.'
      });
      setShowWarningModal(true);
    } else {
      executeRemoveSubcontractor(scopeId, tpId, subId);
    }
  };

  const executeRemoveSubcontractor = (scopeId: string, tpId: string, subId: string) => {
    setScopes(scopes.map(s => 
      s.id === scopeId 
        ? {
            ...s,
            tradePackages: s.tradePackages.map(tp => 
              tp.id === tpId 
                ? { ...tp, selectedSubcontractors: tp.selectedSubcontractors.filter(id => id !== subId) }
                : tp
            )
          }
        : s
    ));
  };

  const handleConfirmWarning = () => {
    if (!warningAction) return;

    switch (warningAction.type) {
      case 'archive':
        executeArchive(warningAction.scopeId);
        break;
      case 'edit':
        setScopes(scopes.map(s => 
          s.id === warningAction.scopeId 
            ? { ...s, [warningAction.field]: warningAction.value }
            : s
        ));
        break;
      case 'removeDiscipline':
        executeRemoveDiscipline(warningAction.scopeId, warningAction.disciplineId);
        break;
      case 'removeTP':
        executeRemoveTradePackage(warningAction.scopeId, warningAction.tpId);
        break;
      case 'removeSubcontractor':
        executeRemoveSubcontractor(warningAction.scopeId, warningAction.tpId, warningAction.subId);
        break;
    }

    setShowWarningModal(false);
    setWarningAction(null);
  };

  const handleAddTradePackages = (tpIds: string[]) => {
    if (!selectedScopeForTP) return;

    const scope = scopes.find(s => s.id === selectedScopeForTP);
    if (!scope) return;

    const newTPs = tpIds
      .filter(tpId => !scope.tradePackages.some(tp => tp.id === tpId))
      .map(tpId => ({ id: tpId, selectedSubcontractors: [] }));

    setScopes(scopes.map(s => 
      s.id === selectedScopeForTP 
        ? { ...s, tradePackages: [...s.tradePackages, ...newTPs] }
        : s
    ));

    setShowAddTPModal(false);
    setSelectedScopeForTP(null);
  };

  const handleSave = () => {
    const errors: {[key: string]: string[]} = {};

    // Validate at least one scope
    const activeScopes = scopes.filter(s => !s.isArchived);
    if (activeScopes.length === 0) {
      toast.error('At least one scope is required');
      return;
    }

    // Validate all TPs have subcontractors
    scopes.forEach(scope => {
      const scopeErrors: string[] = [];
      scope.tradePackages.forEach(tp => {
        if (tp.selectedSubcontractors.length === 0) {
          const tpData = tradePackageMaster.find(t => t.id === tp.id);
          scopeErrors.push(`Trade Package "${tpData?.name}" must have at least one subcontractor`);
        }
      });
      if (scopeErrors.length > 0) {
        errors[scope.id] = scopeErrors;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix validation errors before saving');
      return;
    }

    setValidationErrors({});
    toast.success('Scope configuration saved successfully');
  };

  const activeScopes = scopes.filter(s => !s.isArchived);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 4px 0'
          }}>
            Project Scope Configuration
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            Define scopes and assign disciplines, trade packages, and subcontractors
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            <Plus size={16} />
            Add Scope
          </button>
          <button
            onClick={handleSave}
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
            Save Changes
          </button>
        </div>
      </div>

      {/* Scopes List */}
      {activeScopes.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          padding: '64px 48px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            No active scopes. Click "Add Scope" to create a new scope.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeScopes.map((scope) => {
            const isEditing = editingScopeId === scope.id;
            const hasErrors = validationErrors[scope.id]?.length > 0;

            return (
              <div
                key={scope.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: hasErrors ? '1px solid #DC2626' : '1px solid #D8DEE8',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                {/* Scope Header */}
                <div
                  style={{
                    padding: '20px 24px',
                    backgroundColor: hasErrors ? '#FEF2F2' : '#F9FAFB',
                    borderBottom: '1px solid #D8DEE8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#272721'
                    }}>
                      {scope.code || 'N/A'}
                    </div>

                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#272721'
                    }}>
                      {scope.name || 'Unnamed Scope'}
                    </div>

                    {scope.isUsed && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(253, 67, 20, 0.1)',
                        color: '#FD4314',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        In Use
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingScopeId(isEditing ? null : scope.id)}
                      style={{
                        height: '36px',
                        padding: '0 16px',
                        border: '1px solid #D8DEE8',
                        backgroundColor: isEditing ? '#FD4314' : '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: isEditing ? '#FFFFFF' : '#374151',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isEditing) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (!isEditing) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      {isEditing ? 'Close' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleArchiveScope(scope.id)}
                      style={{
                        height: '36px',
                        padding: '0 16px',
                        border: '1px solid #D8DEE8',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#6B7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <Archive size={16} />
                      Archive
                    </button>
                  </div>
                </div>

                {/* Validation Errors */}
                {hasErrors && (
                  <div style={{
                    padding: '12px 24px',
                    backgroundColor: '#FEF2F2',
                    borderBottom: '1px solid #FEE2E2'
                  }}>
                    {validationErrors[scope.id].map((error, idx) => (
                      <div key={idx} style={{
                        fontSize: '13px',
                        color: '#DC2626',
                        marginBottom: idx < validationErrors[scope.id].length - 1 ? '4px' : 0
                      }}>
                        • {error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Edit Form */}
                {isEditing && (
                  <div style={{ padding: '24px' }}>
                    {/* Basic Info */}
                    {scope.code && scope.name ? (
                      // Editing existing scope - show code (disabled) and name (editable)
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '200px 1fr',
                        gap: '16px',
                        marginBottom: '24px'
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Scope Code*
                          </label>
                          <input
                            type="text"
                            value={scope.code}
                            disabled
                            style={{
                              width: '100%',
                              height: '40px',
                              padding: '0 12px',
                              border: '1px solid #D8DEE8',
                              borderRadius: '4px',
                              fontSize: '14px',
                              backgroundColor: '#F3F4F6',
                              color: '#9CA3AF',
                              cursor: 'not-allowed'
                            }}
                          />
                          <div style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            marginTop: '4px'
                          }}>
                            Code cannot be edited
                          </div>
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Scope Name*
                          </label>
                          <input
                            type="text"
                            value={scope.name}
                            onChange={(e) => updateScope(scope.id, 'name', e.target.value)}
                            placeholder="Enter scope name"
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
                      </div>
                    ) : (
                      // Adding new scope - show dropdown to select from Scope Master
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Select Scope <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <StandardDropdown
                          options={scopeMaster.map(s => ({
                            value: s.id,
                            label: `${s.code} - ${s.name}`
                          }))}
                          value=""
                          onChange={(value) => {
                            const selectedScope = scopeMaster.find(s => s.id === value);
                            if (selectedScope) {
                              setScopes(scopes.map(s => 
                                s.id === scope.id 
                                  ? { ...s, code: selectedScope.code, name: selectedScope.name }
                                  : s
                              ));
                            }
                          }}
                          placeholder="Select a scope from master..."
                          mode="single"
                        />
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          marginTop: '6px'
                        }}>
                          Select a scope from the Scope Master
                        </div>
                      </div>
                    )}

                    {/* Disciplines */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#272721',
                        marginBottom: '12px'
                      }}>
                        Disciplines
                      </label>

                      {/* Multi-select Dropdown Simulation */}
                      <div style={{
                        border: '1px solid #D8DEE8',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        minHeight: '40px',
                        padding: '8px'
                      }}>
                        {/* Selected Tags */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: scope.selectedDisciplines.length > 0 ? '8px' : 0
                        }}>
                          {scope.selectedDisciplines.map(discId => {
                            const disc = disciplineMaster.find(d => d.id === discId);
                            return disc ? (
                              <div
                                key={discId}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 8px 4px 12px',
                                  backgroundColor: 'rgba(253, 67, 20, 0.08)',
                                  border: '1px solid #FD4314',
                                  borderRadius: '16px',
                                  fontSize: '13px',
                                  color: '#FD4314',
                                  fontWeight: '500'
                                }}
                              >
                                {disc.code} - {disc.name}
                                <button
                                  onClick={() => handleRemoveDiscipline(scope.id, discId)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#FD4314'
                                  }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>

                        {/* Dropdown options */}
                        <select
                          onChange={(e) => {
                            if (e.target.value && !scope.selectedDisciplines.includes(e.target.value)) {
                              setScopes(scopes.map(s => 
                                s.id === scope.id 
                                  ? { ...s, selectedDisciplines: [...s.selectedDisciplines, e.target.value] }
                                  : s
                              ));
                            }
                            e.target.value = '';
                          }}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#6B7280',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Select disciplines...</option>
                          {disciplineMaster
                            .filter(d => !scope.selectedDisciplines.includes(d.id))
                            .map(disc => (
                              <option key={disc.id} value={disc.id}>
                                {disc.code} - {disc.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Trade Packages & Subcontractors */}
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          Trade Packages & Subcontractors ({scope.tradePackages.length} packages)
                        </label>
                        <button
                          onClick={() => {
                            setSelectedScopeForTP(scope.id);
                            setShowAddTPModal(true);
                          }}
                          style={{
                            height: '32px',
                            padding: '0 16px',
                            border: '1px solid #FD4314',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#FD4314',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                          <Plus size={14} />
                          Add New Trade Package
                        </button>
                      </div>

                      {/* Trade Package List */}
                      <div style={{
                        border: '1px solid #D8DEE8',
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden'
                      }}>
                        {scope.tradePackages.length === 0 ? (
                          <div style={{
                            padding: '32px',
                            textAlign: 'center',
                            color: '#6B7280',
                            fontSize: '14px'
                          }}>
                            No trade packages added. Click "Add New Trade Package" to get started.
                          </div>
                        ) : (
                          scope.tradePackages.map((tp, tpIdx) => {
                            const tpData = tradePackageMaster.find(t => t.id === tp.id);
                            const hasSubError = tp.selectedSubcontractors.length === 0;

                            return (
                              <div
                                key={tp.id}
                                style={{
                                  padding: '16px',
                                  borderBottom: tpIdx < scope.tradePackages.length - 1 ? '1px solid #E5E7EB' : 'none',
                                  backgroundColor: hasSubError ? '#FEF2F2' : '#FFFFFF'
                                }}
                              >
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '16px'
                                }}>
                                  {/* Trade Package Name */}
                                  <div style={{
                                    flex: '0 0 250px',
                                    paddingTop: '8px'
                                  }}>
                                    <div style={{
                                      fontSize: '14px',
                                      fontWeight: '600',
                                      color: '#272721',
                                      marginBottom: '4px'
                                    }}>
                                      {tpData?.name}
                                    </div>
                                    <div style={{
                                      fontSize: '12px',
                                      color: '#6B7280'
                                    }}>
                                      {tpData?.code}
                                    </div>
                                  </div>

                                  {/* Subcontractors Dropdown */}
                                  <div style={{ flex: 1 }}>
                                    <div style={{
                                      border: hasSubError ? '1px solid #DC2626' : '1px solid #D8DEE8',
                                      borderRadius: '4px',
                                      backgroundColor: '#FFFFFF',
                                      minHeight: '40px',
                                      padding: '8px'
                                    }}>
                                      {/* Selected Subcontractors Tags */}
                                      <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        marginBottom: tp.selectedSubcontractors.length > 0 ? '8px' : 0
                                      }}>
                                        {tp.selectedSubcontractors.map(subId => {
                                          const sub = subcontractorMaster.find(s => s.id === subId);
                                          return sub ? (
                                            <div
                                              key={subId}
                                              style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 8px 4px 12px',
                                                backgroundColor: 'rgba(228, 238, 254, 0.5)',
                                                border: '1px solid #E4EEFE',
                                                borderRadius: '16px',
                                                fontSize: '13px',
                                                color: '#3B82F6',
                                                fontWeight: '500'
                                              }}
                                            >
                                              {sub.code} - {sub.name}
                                              <button
                                                onClick={() => handleRemoveSubcontractor(scope.id, tp.id, subId)}
                                                style={{
                                                  background: 'none',
                                                  border: 'none',
                                                  cursor: 'pointer',
                                                  padding: '2px',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  color: '#3B82F6'
                                                }}
                                              >
                                                <X size={14} />
                                              </button>
                                            </div>
                                          ) : null;
                                        })}
                                      </div>

                                      {/* Dropdown */}
                                      <select
                                        onChange={(e) => {
                                          if (e.target.value && !tp.selectedSubcontractors.includes(e.target.value)) {
                                            setScopes(scopes.map(s => 
                                              s.id === scope.id 
                                                ? {
                                                    ...s,
                                                    tradePackages: s.tradePackages.map(t => 
                                                      t.id === tp.id 
                                                        ? { ...t, selectedSubcontractors: [...t.selectedSubcontractors, e.target.value] }
                                                        : t
                                                    )
                                                  }
                                                : s
                                            ));
                                            // Clear validation error
                                            if (validationErrors[scope.id]) {
                                              setValidationErrors({
                                                ...validationErrors,
                                                [scope.id]: validationErrors[scope.id].filter(err => !err.includes(tpData?.name || ''))
                                              });
                                            }
                                          }
                                          e.target.value = '';
                                        }}
                                        style={{
                                          width: '100%',
                                          border: 'none',
                                          outline: 'none',
                                          fontSize: '14px',
                                          color: '#6B7280',
                                          backgroundColor: 'transparent',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <option value="">Select subcontractors...</option>
                                        {subcontractorMaster
                                          .filter(s => !tp.selectedSubcontractors.includes(s.id))
                                          .map(sub => (
                                            <option key={sub.id} value={sub.id}>
                                              {sub.code} - {sub.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    {hasSubError && (
                                      <div style={{
                                        fontSize: '12px',
                                        color: '#DC2626',
                                        marginTop: '4px'
                                      }}>
                                        At least one subcontractor is required
                                      </div>
                                    )}
                                  </div>

                                  {/* Remove TP Button */}
                                  <button
                                    onClick={() => handleRemoveTradePackage(scope.id, tp.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: '#EF4444',
                                      padding: '8px',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                    title="Remove trade package"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Trade Package Modal */}
      {showAddTPModal && (
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
          onClick={() => {
            setShowAddTPModal(false);
            setSelectedScopeForTP(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90vw',
              border: '1px solid #E2E6ED',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Add Trade Packages
              </h3>
              <button
                onClick={() => {
                  setShowAddTPModal(false);
                  setSelectedScopeForTP(null);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div style={{
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {tradePackageMaster.map((tp, idx) => {
                  const scope = scopes.find(s => s.id === selectedScopeForTP);
                  const isAlreadyAdded = scope?.tradePackages.some(t => t.id === tp.id);

                  return (
                    <label
                      key={tp.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: idx < tradePackageMaster.length - 1 ? '1px solid #E5E7EB' : 'none',
                        cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                        backgroundColor: isAlreadyAdded ? '#F9FAFB' : '#FFFFFF',
                        opacity: isAlreadyAdded ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isAlreadyAdded) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (!isAlreadyAdded) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      <input
                        type="checkbox"
                        disabled={isAlreadyAdded}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddTradePackages([tp.id]);
                          }
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                          accentColor: '#FD4314',
                          marginRight: '12px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          {tp.code}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6B7280'
                        }}>
                          {tp.name}
                        </div>
                      </div>
                      {isAlreadyAdded && (
                        <span style={{
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          Already added
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowAddTPModal(false);
                  setSelectedScopeForTP(null);
                }}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && warningAction && (
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
            zIndex: 1001
          }}
          onClick={() => {
            setShowWarningModal(false);
            setWarningAction(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '480px',
              maxWidth: '90vw',
              border: '1px solid #E2E6ED',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={24} style={{ color: '#DC2626' }} />
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Confirm Action
              </h3>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <p style={{
                fontSize: '14px',
                color: '#5F6B7A',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {warningAction.message}
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  setWarningAction(null);
                }}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWarning}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
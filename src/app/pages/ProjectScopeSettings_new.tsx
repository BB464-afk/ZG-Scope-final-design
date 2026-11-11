// Project Scope Settings - Custom HTML Table (No AG Grid)
// Updated: Removed Status column and field, replaced with Action column containing Remove button with confirmation modal
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Plus, X, AlertTriangle, Trash2, Search, ChevronRight, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

interface Subcontractor {
  id: string;
  code: string;
  name: string;
  isUsed?: boolean;
}

interface TradePackage {
  id: string;
  code: string;
  name: string;
  subcontractors: Subcontractor[]; // Array of subcontractor objects with isUsed flag
  isUsed?: boolean;
}

interface Discipline {
  id: string;
  code: string;
  name: string;
  isUsed?: boolean;
}

interface Scope {
  id: string;
  code: string;
  name: string;
  isUsed: boolean;
  disciplines: Discipline[]; // Array of discipline objects with isUsed flag
  tradePackages: TradePackage[];
  isActive: boolean;
}

export default function ProjectScopeSettings() {
  const { projectId } = useParams();

  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';

  // Scope Master Data
  const scopeMaster = [
    { id: 'SCO-001', code: 'SCO-001', name: 'Design & Engineering' },
    { id: 'SCO-002', code: 'SCO-002', name: 'Construction & Installation' },
    { id: 'SCO-003', code: 'SCO-003', name: 'Procurement' },
    { id: 'SCO-004', code: 'SCO-004', name: 'Commissioning & Handover' }
  ];

  const [scopes, setScopes] = useState<Scope[]>([
    {
      id: 'scope-1',
      code: 'SC-01',
      name: 'Design & Engineering',
      isUsed: true,
      disciplines: [
        { id: 'DISC01', code: 'DISC01', name: 'Electrical', isUsed: true },
        { id: 'DISC02', code: 'DISC02', name: 'Mechanical', isUsed: false },
        { id: 'DISC03', code: 'DISC03', name: 'IT/Network', isUsed: false }
      ],
      tradePackages: [
        { 
          id: 'tp-1', 
          code: 'WP01', 
          name: 'Civil & Structural', 
          subcontractors: [
            { id: 'SUB01', code: 'SUB01', name: 'BuildTech LLC', isUsed: true },
            { id: 'SUB02', code: 'SUB02', name: 'ConstructPro', isUsed: false }
          ],
          isUsed: true
        },
        { 
          id: 'tp-2', 
          code: 'WP02', 
          name: 'Electrical Systems', 
          subcontractors: [
            { id: 'SUB03', code: 'SUB03', name: 'ElectroMax Solutions', isUsed: false }
          ],
          isUsed: false
        }
      ],
      isActive: true
    },
    {
      id: 'scope-2',
      code: 'SC-02',
      name: 'Construction & Installation',
      isUsed: false,
      disciplines: [
        { id: 'DISC01', code: 'DISC01', name: 'Electrical', isUsed: false },
        { id: 'DISC04', code: 'DISC04', name: 'Civil', isUsed: false }
      ],
      tradePackages: [
        { 
          id: 'tp-3', 
          code: 'WP03', 
          name: 'HVAC Systems', 
          subcontractors: [
            { id: 'SUB04', code: 'SUB04', name: 'Climate Control Inc', isUsed: false }
          ],
          isUsed: false
        }
      ],
      isActive: true
    },
    {
      id: 'scope-3',
      code: 'SC-03',
      name: 'Testing & Commissioning',
      isUsed: true,
      disciplines: [
        { id: 'DISC02', code: 'DISC02', name: 'Mechanical', isUsed: true }
      ],
      tradePackages: [],
      isActive: false
    },
    {
      id: 'scope-4',
      code: 'SC-04',
      name: 'Quality Assurance',
      isUsed: false,
      disciplines: [
        { id: 'DISC05', code: 'DISC05', name: 'Plumbing', isUsed: false }
      ],
      tradePackages: [],
      isActive: true
    }
  ]);

  const [editingScopeId, setEditingScopeId] = useState<string | null>(null);
  const [editingScope, setEditingScope] = useState<Scope | null>(null);
  const [showAddTPModal, setShowAddTPModal] = useState(false);
  const [selectedTPsForAdd, setSelectedTPsForAdd] = useState<string[]>([]);
  const [tpSearchQuery, setTpSearchQuery] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningAction, setWarningAction] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | ''>('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  // Multiselect dropdown state
  const [disciplineDropdownOpen, setDisciplineDropdownOpen] = useState(false);
  const [disciplineSearchQuery, setDisciplineSearchQuery] = useState('');
  const [subcontractorDropdownOpen, setSubcontractorDropdownOpen] = useState<string | null>(null); // Store TP code
  const [subcontractorSearchQuery, setSubcontractorSearchQuery] = useState('');
  const [showInlineTPAdd, setShowInlineTPAdd] = useState(false); // Show/hide inline TP multiselect
  const [inlineTPDropdownOpen, setInlineTPDropdownOpen] = useState(false); // Dropdown open state
  const [inlineTPSearchQuery, setInlineTPSearchQuery] = useState(''); // Search query for inline TP dropdown
  const [selectedTPsForInlineAdd, setSelectedTPsForInlineAdd] = useState<string[]>([]); // Selected TPs for inline add
  
  // Table state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [scopeToRemove, setScopeToRemove] = useState<Scope | null>(null);

  // Master data
  const disciplineMaster = [
    { id: 'DISC01', code: 'DISC01', name: 'Electrical' },
    { id: 'DISC02', code: 'DISC02', name: 'Mechanical' },
    { id: 'DISC03', code: 'DISC03', name: 'IT/Network' },
    { id: 'DISC04', code: 'DISC04', name: 'Civil' },
    { id: 'DISC05', code: 'DISC05', name: 'Plumbing' },
    { id: 'DISC06', code: 'DISC06', name: 'Fire Protection' }
  ];

  const subcontractorMaster = [
    { id: 'SUB01', code: 'SUB01', name: 'BuildTech LLC' },
    { id: 'SUB02', code: 'SUB02', name: 'ConstructPro' },
    { id: 'SUB03', code: 'SUB03', name: 'ElectroMax Solutions' },
    { id: 'SUB04', code: 'SUB04', name: 'Climate Control Inc' },
    { id: 'SUB05', code: 'SUB05', name: 'PlumbMasters Ltd' },
    { id: 'SUB06', code: 'SUB06', name: 'FireSafe Systems' },
    { id: 'SUB07', code: 'SUB07', name: 'TechInstall Corp' }
  ];

  const availableTradePackages = [
    { code: 'WP01', name: 'Civil & Structural' },
    { code: 'WP02', name: 'Electrical Systems' },
    { code: 'WP03', name: 'HVAC Systems' },
    { code: 'WP04', name: 'Plumbing & Drainage' },
    { code: 'WP05', name: 'Fire Protection' },
    { code: 'WP06', name: 'IT Infrastructure' },
    { code: 'WP07', name: 'Mechanical Equipment' }
  ];

  // Table handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(filteredData.map(s => s.id)));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === filteredData.length);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp size={14} style={{ color: '#FD4314' }} /> : 
      <ArrowDown size={14} style={{ color: '#FD4314' }} />;
  };

  // Apply filters and sorting
  const filteredData = scopes
    .filter(s => s.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(s => s.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(s => {
      if (!statusSearch) return true;
      const status = s.isActive ? 'active' : 'inactive';
      return status.includes(statusSearch.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      let aVal: any;
      let bVal: any;
      
      if (sortColumn === 'code') {
        aVal = a.code;
        bVal = b.code;
      } else if (sortColumn === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortColumn === 'status') {
        aVal = a.isActive ? 'active' : 'inactive';
        bVal = b.isActive ? 'active' : 'inactive';
      } else {
        return 0;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const gridTemplateColumns = `180px 1fr 130px`;

  const handleBulkSetActive = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select at least one scope');
      return;
    }

    // Check if any selected scopes are in use
    const selectedIds = Array.from(selectedRows);
    const usedScopes = selectedIds.filter(id => {
      const scope = scopes.find(s => s.id === id);
      return scope && scope.isUsed && !scope.isActive;
    });
    
    if (usedScopes.length > 0) {
      // Scopes are in use - show warning modal first
      setWarningAction({
        type: 'bulkActive',
        message: `${usedScopes.length} of the selected scope(s) are currently in use. Changing their status may affect existing data.`
      });
      setShowWarningModal(true);
    } else {
      // No scopes in use - go directly to confirmation modal
      setConfirmAction('activate');
      setShowConfirmModal(true);
    }
  };

  const handleBulkSetInactive = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select at least one scope');
      return;
    }

    // Check if any selected scopes are in use
    const selectedIds = Array.from(selectedRows);
    const usedScopes = selectedIds.filter(id => {
      const scope = scopes.find(s => s.id === id);
      return scope && scope.isUsed && scope.isActive;
    });
    
    if (usedScopes.length > 0) {
      // Scopes are in use - show warning modal first
      setWarningAction({
        type: 'bulkInactive',
        message: `${usedScopes.length} of the selected scope(s) are currently in use. Changing their status to Inactive may affect existing data.`
      });
      setShowWarningModal(true);
    } else {
      // No scopes in use - go directly to confirmation modal
      setConfirmAction('deactivate');
      setShowConfirmModal(true);
    }
  };

  const confirmBulkAction = () => {
    const selectedIds = Array.from(selectedRows);
    
    if (confirmAction === 'activate') {
      setScopes(scopes.map(s => 
        selectedIds.includes(s.id) ? { ...s, isActive: true } : s
      ));
      toast.success(`${selectedRows.size} scope(s) set to Active`);
    } else if (confirmAction === 'deactivate') {
      setScopes(scopes.map(s => 
        selectedIds.includes(s.id) ? { ...s, isActive: false } : s
      ));
      toast.success(`${selectedRows.size} scope(s) set to Inactive`);
    }
    
    setSelectedRows(new Set());
    setSelectAll(false);
    setShowConfirmModal(false);
    setConfirmAction('');
  };

  const handleRemoveScope = (scope: Scope) => {
    setScopeToRemove(scope);
    setShowRemoveConfirmModal(true);
  };

  const confirmRemoveScope = () => {
    if (scopeToRemove) {
      setScopes(scopes.filter(s => s.id !== scopeToRemove.id));
      toast.success(`Scope "${scopeToRemove.code}" removed from project`);
      setScopeToRemove(null);
    }
    setShowRemoveConfirmModal(false);
  };

  const handleAddScope = () => {
    const newScope: Scope = {
      id: `scope-${Date.now()}`,
      code: '',
      name: '',
      isUsed: false,
      disciplines: [],
      tradePackages: [],
      isActive: true
    };
    setScopes([...scopes, newScope]);
    setEditingScope(newScope);
    setEditingScopeId(newScope.id);
  };

  const handleEditScope = (scope: Scope) => {
    setEditingScope({ ...scope });
    setEditingScopeId(scope.id);
    setValidationErrors([]);
  };

  const handleCancelEdit = () => {
    if (editingScope && !editingScope.code && !editingScope.name) {
      setScopes(scopes.filter(s => s.id !== editingScope.id));
    }
    setEditingScope(null);
    setEditingScopeId(null);
    setValidationErrors([]);
  };

  const handleSaveEdit = () => {
    if (!editingScope) return;

    const errors: string[] = [];
    if (!editingScope.code || editingScope.code.trim() === '') {
      errors.push('Scope Code is required');
    }
    if (!editingScope.name || editingScope.name.trim() === '') {
      errors.push('Scope Name is required');
    }
    if (editingScope.disciplines.length === 0) {
      errors.push('At least one discipline must be selected');
    }
    if (editingScope.tradePackages.length === 0) {
      errors.push('At least one trade package must be added');
    }
    
    const tpsWithoutSubs = editingScope.tradePackages.filter(tp => tp.subcontractors.length === 0);
    if (tpsWithoutSubs.length > 0) {
      errors.push('All trade packages must have at least one subcontractor');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const originalScope = scopes.find(s => s.id === editingScope.id);
    
    // Check if name changed and scope is in use
    if (originalScope && originalScope.isUsed && originalScope.name !== editingScope.name) {
      setWarningAction({
        type: 'save',
        message: 'This scope is currently in use. Changing the name may affect existing references.'
      });
      setShowWarningModal(true);
      return;
    }

    executeSave();
  };

  const executeSave = () => {
    if (!editingScope) return;
    setScopes(scopes.map(s => s.id === editingScope.id ? editingScope : s));
    toast.success('Scope saved successfully');
    setEditingScope(null);
    setEditingScopeId(null);
    setValidationErrors([]);
  };

  const updateEditingScope = (field: string, value: any) => {
    if (!editingScope) return;

    if (field === 'code') {
      const originalScope = scopes.find(s => s.id === editingScope.id);
      if (originalScope && originalScope.code && originalScope.code.trim() !== '') {
        toast.error('Scope code cannot be edited once set');
        return;
      }
    }

    setEditingScope({ ...editingScope, [field]: value });
  };

  const handleToggleDiscipline = (disciplineId: string) => {
    if (!editingScope) return;

    const isAdding = !editingScope.disciplines.some(d => d.id === disciplineId);
    
    if (!isAdding) {
      // Check if discipline is used before removing
      const disciplineToRemove = editingScope.disciplines.find(d => d.id === disciplineId);
      if (disciplineToRemove?.isUsed) {
        const disc = disciplineMaster.find(d => d.id === disciplineId);
        setWarningAction({
          type: 'removeDiscipline',
          disciplineId,
          message: `Discipline "${disc?.code} - ${disc?.name}" is currently attached to one or more tasks. Removing it may affect existing data.`
        });
        setShowWarningModal(true);
        return;
      }
    }

    const newDisciplines = isAdding
      ? [...editingScope.disciplines, disciplineMaster.find(d => d.id === disciplineId)!]
      : editingScope.disciplines.filter(d => d.id !== disciplineId);

    setEditingScope({ ...editingScope, disciplines: newDisciplines });
  };

  const handleOpenAddTPModal = () => {
    setShowInlineTPAdd(true);
    setSelectedTPsForInlineAdd([]);
    setInlineTPSearchQuery('');
  };

  const handleToggleInlineTP = (tpCode: string) => {
    setSelectedTPsForInlineAdd(prev =>
      prev.includes(tpCode)
        ? prev.filter(c => c !== tpCode)
        : [...prev, tpCode]
    );
  };

  const handleAddInlineTradePackages = () => {
    if (!editingScope || selectedTPsForInlineAdd.length === 0) return;

    const newTPs = selectedTPsForInlineAdd
      .filter(tpCode => !editingScope.tradePackages.some(tp => tp.code === tpCode))
      .map(tpCode => {
        const tpData = availableTradePackages.find(tp => tp.code === tpCode);
        return {
          id: `tp-${Date.now()}-${tpCode}`,
          code: tpCode,
          name: tpData?.name || '',
          subcontractors: [],
          isUsed: false
        };
      });

    // Add at the beginning (LIFO)
    setEditingScope({
      ...editingScope,
      tradePackages: [...newTPs, ...editingScope.tradePackages]
    });

    setShowInlineTPAdd(false);
    setSelectedTPsForInlineAdd([]);
    setInlineTPSearchQuery('');
    toast.success(`${newTPs.length} trade package${newTPs.length > 1 ? 's' : ''} added`);
  };

  const handleCancelInlineTPAdd = () => {
    setShowInlineTPAdd(false);
    setSelectedTPsForInlineAdd([]);
    setInlineTPSearchQuery('');
    setInlineTPDropdownOpen(false);
  };

  const handleAddTradePackages = () => {
    if (!editingScope || selectedTPsForAdd.length === 0) return;

    const newTPs = selectedTPsForAdd
      .filter(tpCode => !editingScope.tradePackages.some(tp => tp.code === tpCode))
      .map(tpCode => {
        const tpData = availableTradePackages.find(tp => tp.code === tpCode);
        return {
          id: `tp-${Date.now()}-${tpCode}`,
          code: tpCode,
          name: tpData?.name || '',
          subcontractors: [],
          isUsed: false
        };
      });

    setEditingScope({
      ...editingScope,
      tradePackages: [...newTPs, ...editingScope.tradePackages]
    });

    setShowAddTPModal(false);
    setSelectedTPsForAdd([]);
    setTpSearchQuery('');
    toast.success(`${newTPs.length} trade package${newTPs.length > 1 ? 's' : ''} added`);
  };

  const handleRemoveTradePackage = (tp: TradePackage) => {
    if (!editingScope) return;
    
    if (tp.isUsed) {
      setWarningAction({
        type: 'deleteTP',
        tpCode: tp.code,
        message: `Trade package "${tp.code} - ${tp.name}" is currently in use. Removing it may affect existing data.`
      });
      setShowWarningModal(true);
    } else {
      executeRemoveTP(tp.code);
    }
  };

  const executeRemoveTP = (tpCode: string) => {
    if (!editingScope) return;
    
    setEditingScope({
      ...editingScope,
      tradePackages: editingScope.tradePackages.filter(tp => tp.code !== tpCode)
    });
    toast.success('Trade package removed');
  };

  const executeRemoveDiscipline = (disciplineId: string) => {
    if (!editingScope) return;
    
    setEditingScope({
      ...editingScope,
      disciplines: editingScope.disciplines.filter(d => d.id !== disciplineId)
    });
    toast.success('Discipline removed');
  };

  const executeRemoveSubcontractor = (tpCode: string, subId: string) => {
    if (!editingScope) return;
    
    setEditingScope({
      ...editingScope,
      tradePackages: editingScope.tradePackages.map(tp =>
        tp.code === tpCode
          ? { ...tp, subcontractors: tp.subcontractors.filter(s => s.id !== subId) }
          : tp
      )
    });
    toast.success('Subcontractor removed');
  };

  const handleAddSubcontractor = (tpCode: string, subId: string) => {
    if (!editingScope) return;

    const subToAdd = subcontractorMaster.find(s => s.id === subId);
    if (!subToAdd) return;

    setEditingScope({
      ...editingScope,
      tradePackages: editingScope.tradePackages.map(tp =>
        tp.code === tpCode
          ? { ...tp, subcontractors: [...tp.subcontractors, { ...subToAdd, isUsed: false }] }
          : tp
      )
    });
  };

  const handleRemoveSubcontractor = (tpCode: string, subId: string) => {
    if (!editingScope) return;

    // Find the trade package and subcontractor
    const tp = editingScope.tradePackages.find(t => t.code === tpCode);
    const sub = tp?.subcontractors.find(s => s.id === subId);
    
    if (sub?.isUsed) {
      setWarningAction({
        type: 'removeSubcontractor',
        tpCode,
        subId,
        message: `Subcontractor "${sub.code} - ${sub.name}" is currently attached to one or more tasks. Removing it may affect existing data.`
      });
      setShowWarningModal(true);
      return;
    }

    setEditingScope({
      ...editingScope,
      tradePackages: editingScope.tradePackages.map(tp =>
        tp.code === tpCode
          ? { ...tp, subcontractors: tp.subcontractors.filter(s => s.id !== subId) }
          : tp
      )
    });
  };

  // If editing, show edit view
  if (editingScopeId && editingScope) {
    const originalScope = scopes.find(s => s.id === editingScope.id);
    const isScopeUsed = originalScope?.isUsed || false;
    const canEditCode = !originalScope?.code || originalScope.code.trim() === '';

    return (
      <div style={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#F7F9FC',
        padding: '32px 48px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#6B7280'
          }}>
            <span 
              onClick={handleCancelEdit}
              style={{ 
                cursor: 'pointer',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FD4314'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
            >
              Project Scope
            </span>
            <ChevronRight size={14} style={{ color: '#D8DEE8' }} />
            <span style={{ color: '#272721', fontWeight: '500' }}>
              {originalScope && originalScope.code ? `Edit Scope: ${originalScope.code}` : 'Create New Scope'}
            </span>
          </div>

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
              {originalScope && originalScope.code ? `Edit Scope: ${originalScope.code}` : 'Create New Scope'}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0
            }}>
              Configure scope details, disciplines, trade packages, and subcontractors
            </p>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              {validationErrors.map((error, idx) => (
                <div key={idx} style={{
                  fontSize: '13px',
                  color: '#DC2626',
                  marginBottom: idx < validationErrors.length - 1 ? '4px' : 0
                }}>
                  • {error}
                </div>
              ))}
            </div>
          )}

          {/* Scope Basic Info Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '4px',
            padding: '20px 24px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#858D9D',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px'
            }}>
              Basic Information
            </div>

            {canEditCode ? (
              // Adding new scope - show dropdown to select from Scope Master
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Scope Code - Auto-filled */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Scope Code <span style={{ color: '#FD4314' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={editingScope.code}
                      disabled
                      placeholder="Auto-filled based on Scope Name"
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 12px',
                        border: '1px solid #D8DEE8',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: '#F3F4F6',
                        color: '#9CA3AF',
                        cursor: 'not-allowed',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      marginTop: '4px'
                    }}>
                      Auto-filled based on selected scope
                    </div>
                  </div>

                  {/* Scope Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Scope Name <span style={{ color: '#FD4314' }}>*</span>
                    </label>
                    <StandardDropdown
                      options={scopeMaster.map(s => ({
                        value: s.id,
                        label: s.name
                      }))}
                      value={editingScope.name ? scopeMaster.find(s => s.name === editingScope.name)?.id || '' : ''}
                      onChange={(value) => {
                        const selectedScope = scopeMaster.find(s => s.id === value);
                        if (selectedScope) {
                          setEditingScope({
                            ...editingScope,
                            code: selectedScope.code,
                            name: selectedScope.name
                          });
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
                </div>
              </>
            ) : (
              // Editing existing scope - show name dropdown (single select) and code (auto-filled)
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 200px',
                gap: '16px'
              }}>
                {/* Scope Name - Dropdown */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Scope Name <span style={{ color: '#FD4314' }}>*</span>
                    {isScopeUsed && (
                      <div 
                        style={{ position: 'relative', display: 'inline-flex' }}
                        onMouseEnter={() => setShowTooltip('name')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <Info 
                          size={14} 
                          style={{ color: '#6B7280', cursor: 'pointer' }}
                        />
                        {showTooltip === 'name' && (
                          <div style={{
                            position: 'absolute',
                            left: '20px',
                            top: '-8px',
                            backgroundColor: '#1F2937',
                            color: '#FFFFFF',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            zIndex: 1000,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}>
                            Changing name may affect existing references
                          </div>
                        )}
                      </div>
                    )}
                  </label>
                  <StandardDropdown
                    options={scopeMaster.map(s => ({
                      value: s.id,
                      label: s.name
                    }))}
                    value={scopeMaster.find(s => s.name === editingScope.name)?.id || ''}
                    onChange={(value) => {
                      const selectedScope = scopeMaster.find(s => s.id === value);
                      if (selectedScope) {
                        setEditingScope({
                          ...editingScope,
                          code: selectedScope.code,
                          name: selectedScope.name
                        });
                      }
                    }}
                    placeholder="Select scope name..."
                    mode="single"
                  />
                </div>

                {/* Scope Code - Auto-filled */}
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Scope Code <span style={{ color: '#FD4314' }}>*</span>
                    <div 
                      style={{ position: 'relative', display: 'inline-flex' }}
                      onMouseEnter={() => setShowTooltip('code')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info 
                        size={14} 
                        style={{ color: '#6B7280', cursor: 'pointer' }}
                      />
                      {showTooltip === 'code' && (
                        <div style={{
                          position: 'absolute',
                          left: '20px',
                          top: '-8px',
                          backgroundColor: '#1F2937',
                          color: '#FFFFFF',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          zIndex: 1000,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                          Auto-filled based on scope name
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    value={editingScope.code}
                    disabled
                    placeholder="Auto-filled"
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 12px',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: '#F3F4F6',
                      color: '#9CA3AF',
                      cursor: 'not-allowed',
                      outline: 'none'
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginTop: '4px'
                  }}>
                    Auto-filled based on scope name
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Disciplines Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '4px',
            padding: '20px 24px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#858D9D',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px'
            }}>
              Disciplines <span style={{ color: '#FD4314' }}>*</span>
            </div>

            <div style={{
              border: '1px solid #D8DEE8',
              borderRadius: '4px',
              minHeight: '40px',
              backgroundColor: '#FFFFFF',
              position: 'relative'
            }}>
              {/* Search Input with Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                gap: '8px'
              }}>
                <Search size={16} style={{ color: '#858D9D', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search and select disciplines..."
                  value={disciplineSearchQuery}
                  onChange={(e) => setDisciplineSearchQuery(e.target.value)}
                  onFocus={() => setDisciplineDropdownOpen(true)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#272721',
                    backgroundColor: 'transparent'
                  }}
                />
                <ChevronDown 
                  size={16} 
                  style={{ 
                    color: '#858D9D', 
                    flexShrink: 0, 
                    cursor: 'pointer',
                    transform: disciplineDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease'
                  }}
                  onClick={() => setDisciplineDropdownOpen(!disciplineDropdownOpen)}
                />
              </div>

              {/* Selected Disciplines Pills - Hidden when dropdown is open */}
              {!disciplineDropdownOpen && editingScope.disciplines.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '8px 12px',
                  paddingTop: '4px',
                  borderTop: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF'
                }}>
                  {editingScope.disciplines.map((disc) => (
                    <div
                      key={disc.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px 4px 12px',
                        backgroundColor: '#E4EEFE',
                        border: '1px solid #FD4314',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#272721',
                        fontWeight: '500'
                      }}
                    >
                      {disc.name}
                      <button
                        onClick={() => handleToggleDiscipline(disc.id)}
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
                  ))}
                </div>
              )}

              {/* Dropdown List */}
              {disciplineDropdownOpen && (
                <>
                  <div 
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999
                    }}
                    onClick={() => {
                      setDisciplineDropdownOpen(false);
                      setDisciplineSearchQuery('');
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8DEE8',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    {disciplineMaster
                      .filter(d => 
                        disciplineSearchQuery === '' || 
                        d.name.toLowerCase().includes(disciplineSearchQuery.toLowerCase()) ||
                        d.code.toLowerCase().includes(disciplineSearchQuery.toLowerCase())
                      )
                      .map((disc) => {
                        const isSelected = editingScope.disciplines.some(d => d.id === disc.id);
                        return (
                          <div
                            key={disc.id}
                            onClick={() => handleToggleDiscipline(disc.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 12px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? '#E4EEFE' : '#FFFFFF',
                              transition: 'background-color 150ms ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = '#F7F9FC';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                            }}
                          >
                            {/* Checkbox */}
                            <div style={{
                              width: '16px',
                              height: '16px',
                              border: `2px solid ${isSelected ? '#FD4314' : '#D1D5DB'}`,
                              borderRadius: '3px',
                              backgroundColor: isSelected ? '#FD4314' : '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 150ms ease'
                            }}>
                              {isSelected && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path 
                                    d="M1 4L3.5 6.5L9 1" 
                                    stroke="#FFFFFF" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span style={{
                              fontSize: '14px',
                              color: '#272721',
                              fontWeight: isSelected ? '500' : '400'
                            }}>
                              {disc.name}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Trade Packages Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '4px',
            padding: '20px 24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#858D9D',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Trade Packages & Subcontractors <span style={{ color: '#FD4314' }}>*</span>
              </div>
              {!showInlineTPAdd && (
                <button
                  onClick={handleOpenAddTPModal}
                  style={{
                    height: '32px',
                    padding: '0 14px',
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
                  Add Trade Package
                </button>
              )}
            </div>

            {/* Inline Multiselect Add Section */}
            {showInlineTPAdd && (
              <div style={{
                marginBottom: '16px',
                padding: '16px',
                backgroundColor: '#F7F9FC',
                border: '1px solid #D8DEE8',
                borderRadius: '4px'
              }}>
                {/* Dropdown Section with Search */}
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <div style={{
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px'
                  }}>
                    {/* Search Input */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      gap: '8px'
                    }}>
                      <Search size={16} style={{ color: '#858D9D', flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder="Search and select trade packages..."
                        value={inlineTPSearchQuery}
                        onChange={(e) => setInlineTPSearchQuery(e.target.value)}
                        onFocus={() => setInlineTPDropdownOpen(true)}
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          fontSize: '14px',
                          color: '#272721',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <ChevronDown 
                        size={16} 
                        style={{ 
                          color: '#858D9D', 
                          flexShrink: 0, 
                          cursor: 'pointer',
                          transform: inlineTPDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 200ms ease'
                        }}
                        onClick={() => setInlineTPDropdownOpen(!inlineTPDropdownOpen)}
                      />
                    </div>
                  </div>

                  {/* Selected Pills - Hidden when dropdown is open */}
                  {!inlineTPDropdownOpen && selectedTPsForInlineAdd.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '8px 12px',
                      marginTop: '4px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px'
                    }}>
                      {selectedTPsForInlineAdd.map((tpCode) => {
                        const tp = availableTradePackages.find(t => t.code === tpCode);
                        return tp ? (
                          <div
                            key={tpCode}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 8px 4px 12px',
                              backgroundColor: '#E4EEFE',
                              border: '1px solid #FD4314',
                              borderRadius: '4px',
                              fontSize: '13px',
                              color: '#272721',
                              fontWeight: '500'
                            }}
                          >
                            {tp.code} - {tp.name}
                            <button
                              onClick={() => handleToggleInlineTP(tpCode)}
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
                  )}

                  {inlineTPDropdownOpen && (
                    <>
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999
                        }}
                        onClick={() => setInlineTPDropdownOpen(false)}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D8DEE8',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        {/* Trade Package List */}
                        <div style={{ 
                          overflowY: 'auto',
                          maxHeight: '240px'
                        }}>
                          {availableTradePackages
                            .filter(tp => !editingScope.tradePackages.some(etp => etp.code === tp.code))
                            .filter(tp => 
                              inlineTPSearchQuery === '' ||
                              tp.code.toLowerCase().includes(inlineTPSearchQuery.toLowerCase()) ||
                              tp.name.toLowerCase().includes(inlineTPSearchQuery.toLowerCase())
                            )
                            .map((tp) => {
                              const isSelected = selectedTPsForInlineAdd.includes(tp.code);
                              return (
                                <div
                                  key={tp.code}
                                  onClick={() => handleToggleInlineTP(tp.code)}
                                  style={{
                                    padding: '10px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#E4EEFE' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    borderBottom: '1px solid #F3F4F6'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                  }}
                                >
                                  {/* Checkbox */}
                                  <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: `2px solid ${isSelected ? '#FD4314' : '#D1D5DB'}`,
                                    borderRadius: '3px',
                                    backgroundColor: isSelected ? '#FD4314' : '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    transition: 'all 150ms ease'
                                  }}>
                                    {isSelected && (
                                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path 
                                          d="M1 4L3.5 6.5L9 1" 
                                          stroke="#FFFFFF" 
                                          strokeWidth="2" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span style={{
                                    fontSize: '14px',
                                    color: '#272721',
                                    fontWeight: isSelected ? '500' : '400'
                                  }}>
                                    {tp.code} - {tp.name}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={handleCancelInlineTPAdd}
                    style={{
                      height: '36px',
                      padding: '0 16px',
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
                    onClick={handleAddInlineTradePackages}
                    disabled={selectedTPsForInlineAdd.length === 0}
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      border: 'none',
                      backgroundColor: selectedTPsForInlineAdd.length > 0 ? '#FD4314' : '#E5E7EB',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: selectedTPsForInlineAdd.length > 0 ? '#FFFFFF' : '#9CA3AF',
                      cursor: selectedTPsForInlineAdd.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTPsForInlineAdd.length > 0) {
                        e.currentTarget.style.backgroundColor = '#E63D13';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTPsForInlineAdd.length > 0) {
                        e.currentTarget.style.backgroundColor = '#FD4314';
                      }
                    }}
                  >
                    Add ({selectedTPsForInlineAdd.length})
                  </button>
                </div>
              </div>
            )}

            {editingScope.tradePackages.length === 0 ? (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '14px',
                border: '1px dashed #D8DEE8',
                borderRadius: '4px'
              }}>
                No trade packages added yet. Click "Add Trade Package" to get started.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {editingScope.tradePackages.map((tp) => {
                  const hasSubError = validationErrors.some(e => 
                    e.includes('subcontractor') || e.includes('trade package')
                  ) && tp.subcontractors.length === 0;

                  return (
                    <div
                      key={tp.id}
                      style={{
                        border: hasSubError ? '1px solid #DC2626' : '1px solid #D8DEE8',
                        borderRadius: '4px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      {/* TP Code & Name */}
                      <div style={{ width: '220px', flexShrink: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721'
                        }}>
                          {tp.code}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280'
                        }}>
                          {tp.name}
                        </div>
                      </div>

                      {/* Subcontractors Multi-Select */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          border: '1px solid #D8DEE8',
                          borderRadius: '4px',
                          minHeight: '40px',
                          backgroundColor: '#FFFFFF',
                          position: 'relative'
                        }}>
                          {/* Search Input with Icon */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 12px',
                            gap: '8px'
                          }}>
                            <Search size={16} style={{ color: '#858D9D', flexShrink: 0 }} />
                            <input
                              type="text"
                              placeholder="Search and select subcontractors..."
                              value={subcontractorDropdownOpen === tp.code ? subcontractorSearchQuery : ''}
                              onChange={(e) => setSubcontractorSearchQuery(e.target.value)}
                              onFocus={() => setSubcontractorDropdownOpen(tp.code)}
                              style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                color: '#272721',
                                backgroundColor: 'transparent'
                              }}
                            />
                            <ChevronDown 
                              size={16} 
                              style={{ 
                                color: '#858D9D', 
                                flexShrink: 0, 
                                cursor: 'pointer',
                                transform: subcontractorDropdownOpen === tp.code ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 200ms ease'
                              }}
                              onClick={() => {
                                if (subcontractorDropdownOpen === tp.code) {
                                  setSubcontractorDropdownOpen(null);
                                } else {
                                  setSubcontractorDropdownOpen(tp.code);
                                }
                              }}
                            />
                          </div>

                          {/* Dropdown List */}
                          {subcontractorDropdownOpen === tp.code && (
                            <>
                              <div 
                                style={{
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 999
                                }}
                                onClick={() => {
                                  setSubcontractorDropdownOpen(null);
                                  setSubcontractorSearchQuery('');
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #D8DEE8',
                                borderTop: 'none',
                                borderRadius: '0 0 4px 4px',
                                maxHeight: '240px',
                                overflowY: 'auto',
                                zIndex: 1000,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}>
                                {subcontractorMaster
                                  .filter(s => 
                                    subcontractorSearchQuery === '' || 
                                    s.name.toLowerCase().includes(subcontractorSearchQuery.toLowerCase()) ||
                                    s.code.toLowerCase().includes(subcontractorSearchQuery.toLowerCase())
                                  )
                                  .map((sub) => {
                                    const isSelected = tp.subcontractors.some(s => s.id === sub.id);
                                    return (
                                      <div
                                        key={sub.id}
                                        onClick={() => {
                                          if (isSelected) {
                                            handleRemoveSubcontractor(tp.code, sub.id);
                                          } else {
                                            handleAddSubcontractor(tp.code, sub.id);
                                          }
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          padding: '10px 12px',
                                          cursor: 'pointer',
                                          backgroundColor: isSelected ? '#E4EEFE' : '#FFFFFF',
                                          transition: 'background-color 150ms ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isSelected) e.currentTarget.style.backgroundColor = '#F7F9FC';
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                                        }}
                                      >
                                        {/* Checkbox */}
                                        <div style={{
                                          width: '16px',
                                          height: '16px',
                                          border: `2px solid ${isSelected ? '#FD4314' : '#D1D5DB'}`,
                                          borderRadius: '3px',
                                          backgroundColor: isSelected ? '#FD4314' : '#FFFFFF',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                          transition: 'all 150ms ease'
                                        }}>
                                          {isSelected && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                              <path 
                                                d="M1 4L3.5 6.5L9 1" 
                                                stroke="#FFFFFF" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          )}
                                        </div>
                                        <span style={{
                                          fontSize: '14px',
                                          color: '#272721',
                                          fontWeight: isSelected ? '500' : '400'
                                        }}>
                                          {sub.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Selected Subcontractors Pills - Hidden when dropdown is open */}
                        {subcontractorDropdownOpen !== tp.code && tp.subcontractors.length > 0 && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            padding: '8px 12px',
                            marginTop: '4px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D8DEE8',
                            borderRadius: '4px'
                          }}>
                            {tp.subcontractors.map((sub) => (
                              <div
                                key={sub.id}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '4px 8px 4px 12px',
                                  backgroundColor: '#E4EEFE',
                                  border: '1px solid #FD4314',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  color: '#272721',
                                  fontWeight: '500'
                                }}
                              >
                                {sub.name}
                                <button
                                  onClick={() => handleRemoveSubcontractor(tp.code, sub.id)}
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
                            ))}
                          </div>
                        )}

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

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveTradePackage(tp)}
                        style={{
                          flexShrink: 0,
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'none',
                          border: '1px solid #D8DEE8',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#EF4444'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                          e.currentTarget.style.borderColor = '#EF4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#D8DEE8';
                        }}
                        title="Remove trade package"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #E2E6ED'
          }}>
            <button
              onClick={handleCancelEdit}
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
              onClick={handleSaveEdit}
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
              Save
            </button>
          </div>
        </div>

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
              setSelectedTPsForAdd([]);
              setTpSearchQuery('');
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
                    setSelectedTPsForAdd([]);
                    setTpSearchQuery('');
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
                {/* Search Bar */}
                <div style={{
                  position: 'relative',
                  marginBottom: '16px'
                }}>
                  <Search size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7280'
                  }} />
                  <input
                    type="text"
                    value={tpSearchQuery}
                    onChange={(e) => setTpSearchQuery(e.target.value)}
                    placeholder="Search trade packages..."
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px 0 40px',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Selected Count */}
                {selectedTPsForAdd.length > 0 && (
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0369A1',
                    marginBottom: '12px'
                  }}>
                    {selectedTPsForAdd.length} trade package{selectedTPsForAdd.length > 1 ? 's' : ''} selected
                  </div>
                )}

                {/* Trade Package List */}
                <div style={{
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {availableTradePackages
                    .filter(tp => {
                      const searchLower = tpSearchQuery.toLowerCase();
                      return tp.code.toLowerCase().includes(searchLower) || 
                             tp.name.toLowerCase().includes(searchLower);
                    })
                    .map((tp, idx, filteredArray) => {
                      const isAlreadyAdded = editingScope.tradePackages.some(t => t.code === tp.code);
                      const isSelected = selectedTPsForAdd.includes(tp.code);

                      return (
                        <div
                          key={tp.code}
                          onClick={() => {
                            if (!isAlreadyAdded) {
                              if (isSelected) {
                                setSelectedTPsForAdd(selectedTPsForAdd.filter(code => code !== tp.code));
                              } else {
                                setSelectedTPsForAdd([...selectedTPsForAdd, tp.code]);
                              }
                            }
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom: idx < filteredArray.length - 1 ? '1px solid #E5E7EB' : 'none',
                            cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                            backgroundColor: isAlreadyAdded ? '#F9FAFB' : (isSelected ? '#F0F9FF' : '#FFFFFF'),
                            opacity: isAlreadyAdded ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isAlreadyAdded && !isSelected) e.currentTarget.style.backgroundColor = '#F9FAFB';
                          }}
                          onMouseLeave={(e) => {
                            if (!isAlreadyAdded && !isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                        >
                          {/* Checkbox */}
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: `2px solid ${isSelected ? '#FD4314' : '#D1D5DB'}`,
                            borderRadius: '3px',
                            backgroundColor: isSelected ? '#FD4314' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 150ms ease'
                          }}>
                            {isSelected && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path 
                                  d="M1 4L3.5 6.5L9 1" 
                                  stroke="#FFFFFF" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
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
                        </div>
                      );
                    })}
                  {availableTradePackages.filter(tp => {
                    const searchLower = tpSearchQuery.toLowerCase();
                    return tp.code.toLowerCase().includes(searchLower) || 
                           tp.name.toLowerCase().includes(searchLower);
                  }).length === 0 && (
                    <div style={{
                      padding: '32px',
                      textAlign: 'center',
                      color: '#6B7280',
                      fontSize: '14px'
                    }}>
                      No trade packages found matching "{tpSearchQuery}"
                    </div>
                  )}
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
                    setSelectedTPsForAdd([]);
                    setTpSearchQuery('');
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
                  onClick={handleAddTradePackages}
                  disabled={selectedTPsForAdd.length === 0}
                  style={{
                    height: '40px',
                    padding: '0 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    backgroundColor: selectedTPsForAdd.length === 0 ? '#D1D5DB' : '#FD4314',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedTPsForAdd.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTPsForAdd.length > 0) e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTPsForAdd.length > 0) e.currentTarget.style.backgroundColor = '#FD4314';
                  }}
                >
                  Add {selectedTPsForAdd.length > 0 ? `(${selectedTPsForAdd.length})` : ''}
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
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E2E6ED'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
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
              </div>

              <div style={{
                padding: '24px',
                fontSize: '14px',
                color: '#4B5563',
                lineHeight: '1.5'
              }}>
                {warningAction.message}
              </div>

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
                  onClick={() => {
                    if (warningAction.type === 'save') {
                      executeSave();
                      setShowWarningModal(false);
                      setWarningAction(null);
                    } else if (warningAction.type === 'deleteTP') {
                      executeRemoveTP(warningAction.tpCode);
                      setShowWarningModal(false);
                      setWarningAction(null);
                    } else if (warningAction.type === 'removeDiscipline') {
                      executeRemoveDiscipline(warningAction.disciplineId);
                      setShowWarningModal(false);
                      setWarningAction(null);
                    } else if (warningAction.type === 'removeSubcontractor') {
                      executeRemoveSubcontractor(warningAction.tpCode, warningAction.subId);
                      setShowWarningModal(false);
                      setWarningAction(null);
                    } else if (warningAction.type === 'bulkActive') {
                      // Show confirmation modal after warning for bulk active
                      setShowWarningModal(false);
                      setWarningAction(null);
                      setConfirmAction('activate');
                      setShowConfirmModal(true);
                    } else if (warningAction.type === 'bulkInactive') {
                      // Show confirmation modal after warning for bulk inactive
                      setShowWarningModal(false);
                      setWarningAction(null);
                      setConfirmAction('deactivate');
                      setShowConfirmModal(true);
                    }
                  }}
                  style={{
                    height: '40px',
                    padding: '0 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    backgroundColor: '#F59E0B',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default List View with AG Grid
  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#F7F9FC',
      padding: '32px 48px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 4px 0'
            }}>
              Project Scope
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0
            }}>
              Define scopes and assign disciplines, trade packages, and subcontractors
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Add Scope Button */}
            <button
              onClick={() => !isProjectReadOnly && handleAddScope()}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Add Scope disabled - Project is On Hold" : ""}
              style={{
                height: '40px',
                padding: '0 20px',
                border: 'none',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FD4314',
                borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: isProjectReadOnly ? '#9CA3AF' : '#FFFFFF',
              cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isProjectReadOnly ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isProjectReadOnly) {
                e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProjectReadOnly) {
                e.currentTarget.style.backgroundColor = '#FD4314';
              }
            }}
          >
            <Plus size={16} />
            Add Scope
          </button>
        </div>
      </div>

      {/* AG Grid Table */}
        {/* NOTE: AG Grid will be implemented here, so the look and feel of the table might differ during development */}
        <div style={{
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '12px',
          fontSize: '12px',
          color: '#6B7280'
        }}>
          Note: AG Grid will be implemented here, so the look and feel of the table might differ during development.
        </div>

        {scopes.length === 0 ? (
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
              No scopes yet. Click "Add Scope" to create a new scope.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #C8D9EE',
            borderRadius: '4px',
            position: 'relative'
          }}>
            {/* Table Header */}
            <div style={{
              backgroundColor: '#E4EEF8',
              display: 'grid',
              gridTemplateColumns,
              borderBottom: '1px solid #C8D9EE',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div 
                onClick={() => handleSort('code')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Scope Code</span>
                {getSortIcon('code')}
              </div>

              <div 
                onClick={() => handleSort('name')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Scope Name</span>
                {getSortIcon('name')}
              </div>

              <div 
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721'
                }}
              >
                <span>Action</span>
              </div>
            </div>

            {/* Filter Row */}
            <div style={{
              backgroundColor: '#FAFBFC',
              display: 'grid',
              gridTemplateColumns,
              borderBottom: '1px solid #C8D9EE'
            }}>
              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>

              <div style={{
                height: '40px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <input
                  type="text"
                  placeholder="Filter..."
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: '28px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '3px',
                    padding: '0 8px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              </div>

              <div style={{ height: '40px' }} />
            </div>

            {/* Table Rows */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {filteredData.map((scope, index) => (
                <div
                  key={scope.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns,
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                    borderBottom: '1px solid #E2E6ED',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD'}
                >
                  <div
                    onClick={() => !isProjectReadOnly && handleEditScope(scope)}
                    title={isProjectReadOnly ? "Edit disabled - Project is On Hold" : ""}
                    style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#6B7280',
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      cursor: isProjectReadOnly ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {scope.code}
                  </div>

                  <div
                    onClick={() => !isProjectReadOnly && handleEditScope(scope)}
                    title={isProjectReadOnly ? "Edit disabled - Project is On Hold" : ""}
                    style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#272721',
                      fontWeight: '500',
                      cursor: isProjectReadOnly ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {scope.name}
                  </div>

                  <div 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 12px'
                    }}
                  >
                    <button
                      onClick={() => !isProjectReadOnly && handleRemoveScope(scope)}
                      disabled={scope.isUsed || isProjectReadOnly}
                      style={{
                        height: '28px',
                        padding: '0 12px',
                        border: (scope.isUsed || isProjectReadOnly) ? '1px solid #D1D5DB' : '1px solid #EF4444',
                        backgroundColor: '#FFFFFF',
                        color: (scope.isUsed || isProjectReadOnly) ? '#9CA3AF' : '#EF4444',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: (scope.isUsed || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        whiteSpace: 'nowrap',
                        opacity: (scope.isUsed || isProjectReadOnly) ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!scope.isUsed && !isProjectReadOnly) {
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      title={isProjectReadOnly ? 'Remove disabled - Project is On Hold' : scope.isUsed ? 'Cannot remove - scope is in use' : 'Remove scope from project'}
                    >
                      <X size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Record Count */}
            <div style={{
              height: '44px',
              backgroundColor: '#FAFBFC',
              borderTop: '1px solid #C8D9EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              fontSize: '13px',
              color: '#5F6B7A'
            }}>
              <div>
                Total Records: {filteredData.length}
              </div>
            </div>
          </div>
        )}
      </div>

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
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '480px',
              width: '90%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
              <AlertTriangle size={24} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '8px'
                  }}
                >
                  Warning
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}
                >
                  {warningAction.message}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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
                onClick={() => {
                  if (warningAction.type === 'bulkActive') {
                    setShowWarningModal(false);
                    setWarningAction(null);
                    setConfirmAction('activate');
                    setShowConfirmModal(true);
                  } else if (warningAction.type === 'bulkInactive') {
                    setShowWarningModal(false);
                    setWarningAction(null);
                    setConfirmAction('deactivate');
                    setShowConfirmModal(true);
                  }
                }}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  backgroundColor: '#F59E0B',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              Confirm Status Change
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '20px'
            }}>
              Are you sure you want to {confirmAction === 'activate' ? 'activate' : 'deactivate'} {selectedRows.size} selected scope(s)?
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction('');
                }}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkAction}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Scope Confirmation Modal */}
      {showRemoveConfirmModal && scopeToRemove && (
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
            setShowRemoveConfirmModal(false);
            setScopeToRemove(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '480px',
              maxWidth: '90%',
              border: '1px solid #E2E6ED',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <div style={{
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
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: 0
                }}>
                  Remove Scope from Project
                </h3>
              </div>
            </div>
            <div style={{
              padding: '20px 24px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '12px',
                lineHeight: '1.5'
              }}>
                Are you sure you want to remove the scope <strong>"{scopeToRemove.code} - {scopeToRemove.name}"</strong> from this project?
              </p>
              <p style={{
                fontSize: '13px',
                color: '#9CA3AF',
                margin: 0,
                lineHeight: '1.5'
              }}>
                This action cannot be undone.
              </p>
            </div>
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowRemoveConfirmModal(false);
                  setScopeToRemove(null);
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
                Cancel
              </button>
              <button
                onClick={confirmRemoveScope}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
              >
                Remove Scope
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
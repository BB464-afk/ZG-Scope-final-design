import React, { useState } from 'react';
import { Settings, X, Filter, Download, Upload, Plus, GripVertical, Info, FileDown, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import CodingDimensionImportModal from '../components/CodingDimensionImportModal';
import ExportConfirmationModal from '../components/ExportConfirmationModal';

interface DimensionValue {
  id: string;
  code: string;
  name: string;
  status: 'Active' | 'Inactive';
}

interface Dimension {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
  values: DimensionValue[];
}

export default function CodingDimensionsSettings() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Check if project is read-only (On Hold)
  const isProjectReadOnly = projectId === '5';

  // Project-level setting: Is Cost Code enabled?
  const [isCostCodeEnabled, setIsCostCodeEnabled] = useState(false);
  
  // Dynamic dimensions
  const [dimensions, setDimensions] = useState<Dimension[]>([
    {
      id: 'area',
      name: 'Area',
      code: 'AR',
      description: 'Physical location or zone within the project',
      status: 'Active',
      values: [
        { id: '1', code: 'A01', name: 'North Wing', status: 'Active' },
        { id: '2', code: 'A02', name: 'South Wing', status: 'Active' },
        { id: '3', code: 'A03', name: 'East Wing', status: 'Active' },
        { id: '4', code: 'A04', name: 'West Wing', status: 'Inactive' },
        { id: '5', code: 'A05', name: 'Central Tower', status: 'Active' },
        { id: '6', code: 'A06', name: 'Basement Level', status: 'Active' }
      ]
    },
    {
      id: 'workPackage',
      name: 'Work Package',
      code: 'WP',
      description: 'Major work categories or disciplines',
      status: 'Active',
      values: [
        { id: '1', code: 'WP01', name: 'Civil & Structural', status: 'Active' },
        { id: '2', code: 'WP02', name: 'Electrical Systems', status: 'Active' },
        { id: '3', code: 'WP03', name: 'HVAC Systems', status: 'Active' },
        { id: '4', code: 'WP04', name: 'Plumbing & Drainage', status: 'Active' },
        { id: '5', code: 'WP05', name: 'Fire Protection', status: 'Inactive' },
        { id: '6', code: 'WP06', name: 'MEP Integration', status: 'Active' },
        { id: '7', code: 'WP07', name: 'Façade Works', status: 'Active' },
        { id: '8', code: 'WP08', name: 'Interior Fit-out', status: 'Active' },
        { id: '9', code: 'WP09', name: 'Landscaping', status: 'Active' },
        { id: '10', code: 'WP10', name: 'Infrastructure', status: 'Active' },
        { id: '11', code: 'WP11', name: 'Special Systems', status: 'Active' },
        { id: '12', code: 'WP12', name: 'Site Preparation', status: 'Active' }
      ]
    },
    {
      id: 'spa',
      name: 'SPA',
      code: 'SP',
      description: 'Service Performance Agreement phases',
      status: 'Active',
      values: [
        { id: '1', code: 'SPA01', name: 'Design Phase', status: 'Active' },
        { id: '2', code: 'SPA02', name: 'Construction Phase', status: 'Active' },
        { id: '3', code: 'SPA03', name: 'Testing Phase', status: 'Active' },
        { id: '4', code: 'SPA04', name: 'Commissioning Phase', status: 'Active' }
      ]
    },
    {
      id: 'costType',
      name: 'Cost Type',
      code: 'CT',
      description: 'Classification of cost categories',
      status: 'Active',
      values: [
        { id: '1', code: 'CT01', name: 'Direct Costs', status: 'Active' },
        { id: '2', code: 'CT02', name: 'Indirect Costs', status: 'Active' },
        { id: '3', code: 'CT03', name: 'Contingency', status: 'Active' }
      ]
    }
  ]);

  // Cost code configuration
  const [costCodeDimensions, setCostCodeDimensions] = useState<Array<{ dimensionId: string; order: number }>>([
    { dimensionId: 'area', order: 1 },
    { dimensionId: 'workPackage', order: 2 },
    { dimensionId: 'spa', order: 3 }
  ]);

  const [activeTab, setActiveTab] = useState(dimensions[0]?.id || '');
  const [showCostCodeModal, setShowCostCodeModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Add/Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingValue, setEditingValue] = useState<DimensionValue | null>(null);
  const [modalCode, setModalCode] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalStatus, setModalStatus] = useState<'Active' | 'Inactive'>('Active');
  
  // Search/filter state
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Drag state for cost code configuration
  const [draggedDimension, setDraggedDimension] = useState<string | null>(null);

  const currentDimension = dimensions.find(d => d.id === activeTab);

  // Apply filters
  const getFilteredValues = () => {
    if (!currentDimension) return [];
    
    return currentDimension.values
      .filter(v => v.code.toLowerCase().includes(codeSearch.toLowerCase()))
      .filter(v => v.name.toLowerCase().includes(nameSearch.toLowerCase()))
      .filter(v => v.status.toLowerCase().includes(statusSearch.toLowerCase()));
  };

  const filteredValues = getFilteredValues();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredValues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredValues.length / itemsPerPage);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === currentItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentItems.map(v => v.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Bulk actions
  const handleBulkStatusChange = (status: 'Active' | 'Inactive') => {
    setDimensions(dimensions.map(dim => {
      if (dim.id === activeTab) {
        return {
          ...dim,
          values: dim.values.map(v => 
            selectedIds.has(v.id) ? { ...v, status } : v
          )
        };
      }
      return dim;
    }));
    toast.success(`${selectedIds.size} value(s) marked as ${status}`);
    setSelectedIds(new Set());
  };

  // Generate preview code
  const generatePreviewCode = () => {
    const orderedDims = costCodeDimensions
      .sort((a, b) => a.order - b.order)
      .map(cd => dimensions.find(d => d.id === cd.dimensionId))
      .filter(Boolean) as Dimension[];
    
    if (orderedDims.length === 0) return 'No dimensions configured';
    
    const previewParts = orderedDims.map(dim => {
      const firstValue = dim.values.find(v => v.status === 'Active');
      return firstValue?.code || 'XXX';
    });
    
    return previewParts.join('.');
  };

  // Handle drag and drop for cost code configuration
  const handleDragStart = (dimensionId: string) => {
    setDraggedDimension(dimensionId);
  };

  const handleDragOver = (e: React.DragEvent, targetDimensionId: string) => {
    e.preventDefault();
    if (!draggedDimension || draggedDimension === targetDimensionId) return;

    const draggedIndex = costCodeDimensions.findIndex(cd => cd.dimensionId === draggedDimension);
    const targetIndex = costCodeDimensions.findIndex(cd => cd.dimensionId === targetDimensionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newConfig = [...costCodeDimensions];
    const [draggedItem] = newConfig.splice(draggedIndex, 1);
    newConfig.splice(targetIndex, 0, draggedItem);

    const reordered = newConfig.map((cd, index) => ({ ...cd, order: index + 1 }));
    setCostCodeDimensions(reordered);
  };

  const handleDragEnd = () => {
    setDraggedDimension(null);
  };

  // Remove dimension from cost code
  const handleRemoveDimensionFromCostCode = (dimensionId: string) => {
    setCostCodeDimensions(prev => prev.filter(cd => cd.dimensionId !== dimensionId));
  };

  // Add dimension to cost code
  const handleAddDimensionToCostCode = (dimensionId: string) => {
    const maxOrder = Math.max(0, ...costCodeDimensions.map(cd => cd.order));
    setCostCodeDimensions([...costCodeDimensions, { dimensionId, order: maxOrder + 1 }]);
  };

  // Add/Edit Value Handlers
  const handleOpenAddModal = () => {
    setModalCode('');
    setModalName('');
    setModalStatus('Active');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (value: DimensionValue) => {
    setEditingValue(value);
    setModalCode(value.code);
    setModalName(value.name);
    setModalStatus(value.status);
    setShowEditModal(true);
  };

  const handleSaveAdd = () => {
    if (!modalCode.trim() || !modalName.trim()) {
      toast.error('Code and Name are required');
      return;
    }

    const newValue: DimensionValue = {
      id: Date.now().toString(),
      code: modalCode,
      name: modalName,
      status: modalStatus
    };

    setDimensions(dimensions.map(dim => {
      if (dim.id === activeTab) {
        return {
          ...dim,
          values: [...dim.values, newValue]
        };
      }
      return dim;
    }));

    toast.success(`${currentDimension?.name} value added successfully`);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!modalCode.trim() || !modalName.trim()) {
      toast.error('Code and Name are required');
      return;
    }

    setDimensions(dimensions.map(dim => {
      if (dim.id === activeTab) {
        return {
          ...dim,
          values: dim.values.map(v => 
            v.id === editingValue?.id 
              ? { ...v, code: modalCode, name: modalName, status: modalStatus }
              : v
          )
        };
      }
      return dim;
    }));

    toast.success(`${currentDimension?.name} value updated successfully`);
    setShowEditModal(false);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  // Cost Code Modal Content
  const renderCostCodeModal = () => {
    if (!isCostCodeEnabled) {
      // Scenario B - Cost Code Disabled
      return (
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
          onClick={() => setShowCostCodeModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '8px',
              maxWidth: '560px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                color: '#1F2937',
                margin: 0
              }}>
                Enable Cost Code Generation
              </h3>
              <button
                onClick={() => setShowCostCodeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} style={{ color: '#6B7280' }} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #D8DEE8',
                borderRadius: '6px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 12px 0'
                }}>
                  Cost Account Code is currently disabled for this project
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 20px 0',
                  lineHeight: '1.6'
                }}>
                  Cost code generation helps standardize cost tracking across tasks using configured coding dimensions.
                </p>
                <button
                  onClick={() => {
                    setIsCostCodeEnabled(true);
                  }}
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
                  Enable Cost Code Generation
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Scenario A - Cost Code Enabled - Configuration Screen (matching the image)
    const includedDimensions = costCodeDimensions
      .sort((a, b) => a.order - b.order)
      .map(cd => dimensions.find(d => d.id === cd.dimensionId))
      .filter(Boolean) as Dimension[];

    const availableDimensions = dimensions.filter(
      d => !costCodeDimensions.some(cd => cd.dimensionId === d.id) && d.status === 'Active'
    );

    return (
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
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setShowCostCodeModal(false)}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '8px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
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
              color: '#1F2937',
              margin: 0
            }}>
              Cost Account Code Generation
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Preview:</span>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  backgroundColor: '#F9FAFB',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #D8DEE8'
                }}>
                  {generatePreviewCode()}
                </span>
              </div>
              <button
                onClick={() => setShowCostCodeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} style={{ color: '#6B7280' }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {/* Toggle Section */}
            <div style={{ 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#272721'
              }}>
                Enable Cost Account Code Generation?
              </span>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setIsCostCodeEnabled(false);
                    toast.success('Cost Code Generation disabled');
                  }}
                  style={{
                    padding: '6px 16px',
                    border: `1px solid ${!isCostCodeEnabled ? '#FD4314' : '#D8DEE8'}`,
                    backgroundColor: !isCostCodeEnabled ? '#FFF4ED' : '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: !isCostCodeEnabled ? '#FD4314' : '#6B7280',
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => {
                    setIsCostCodeEnabled(true);
                    toast.success('Cost Code Generation enabled');
                  }}
                  style={{
                    padding: '6px 16px',
                    border: `1px solid ${isCostCodeEnabled ? '#FD4314' : '#D8DEE8'}`,
                    backgroundColor: isCostCodeEnabled ? '#FFF4ED' : '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: isCostCodeEnabled ? '#FD4314' : '#6B7280',
                    cursor: 'pointer'
                  }}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div style={{
              backgroundColor: '#E4EEFE',
              border: '1px solid #BFDBFE',
              borderRadius: '4px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px'
            }}>
              <Info size={16} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                fontSize: '13px',
                color: '#1E40AF',
                margin: 0,
                lineHeight: '1.5'
              }}>
                The sequence in which you arrange the dimensions below will determine how the cost code is structured. Drag and drop to reorder. Use the × icon to exclude dimensions.
              </p>
            </div>

            {/* Section Title */}
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 12px 0'
            }}>
              Select & Order Dimensions for Cost Code
            </h4>

            {/* Dimension List */}
            {includedDimensions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {includedDimensions.map((dim) => {
                  const config = costCodeDimensions.find(cd => cd.dimensionId === dim.id);
                  return (
                    <div
                      key={dim.id}
                      draggable
                      onDragStart={() => handleDragStart(dim.id)}
                      onDragOver={(e) => handleDragOver(e, dim.id)}
                      onDragEnd={handleDragEnd}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D8DEE8',
                        borderRadius: '4px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'grab'
                      }}
                    >
                      <GripVertical size={16} style={{ color: '#9CA3AF' }} />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#272721',
                        flex: 1
                      }}>
                        {dim.name}
                      </span>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#FD4314',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {config?.order}
                      </div>
                      <button
                        onClick={() => handleRemoveDimensionFromCostCode(dim.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#DC2626'
                        }}
                        title="Remove from cost code"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                border: '1px dashed #D8DEE8',
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                  No dimensions added. Add dimensions from the list below.
                </p>
              </div>
            )}

            {/* Available Dimensions */}
            {availableDimensions.length > 0 && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {availableDimensions.map((dim) => (
                    <button
                      key={dim.id}
                      onClick={() => handleAddDimensionToCostCode(dim.id)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #D8DEE8',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#6B7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.color = '#FD4314';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.color = '#6B7280';
                      }}
                    >
                      + Add
                      <span>{dim.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E6ED',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              onClick={() => setShowCostCodeModal(false)}
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
              onClick={() => {
                toast.success('Cost code configuration saved');
                setShowCostCodeModal(false);
              }}
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
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main List View
  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#F7F9FC',
      padding: '32px 48px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
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
              color: '#1F2937',
              margin: '0 0 4px 0'
            }}>
              Coding Dimensions
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0'
            }}>
              Manage project coding dimensions and cost account code configuration
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowCostCodeModal(true)}
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
              <Settings size={16} />
              Cost Account Configuration
            </button>

            <button
              onClick={() => navigate(`/app/projects/${projectId}/settings/dimensions/add`)}
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
              Add Coding Dimension
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          borderBottom: '1px solid #D8DEE8',
          marginBottom: '16px',
          display: 'flex',
          gap: '4px'
        }}>
          {dimensions.map(dim => (
            <button
              key={dim.id}
              onClick={() => {
                setActiveTab(dim.id);
                setCurrentPage(1);
                setCodeSearch('');
                setNameSearch('');
                setStatusSearch('');
                setSelectedIds(new Set());
              }}
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === dim.id ? '2px solid #FD4314' : '2px solid transparent',
                fontSize: '14px',
                fontWeight: activeTab === dim.id ? '600' : '500',
                color: activeTab === dim.id ? '#FD4314' : '#6B7280',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== dim.id) {
                  e.currentTarget.style.color = '#272721';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== dim.id) {
                  e.currentTarget.style.color = '#6B7280';
                }
              }}
            >
              {dim.name} <span style={{ color: '#858D9D', marginLeft: '4px' }}>({dim.values.length})</span>
            </button>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          {/* Selected Count - Left Side */}
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            {selectedIds.size > 0 && (
              <span style={{
                fontSize: '13px',
                color: '#6B7280'
              }}>
                {selectedIds.size} record(s) selected
              </span>
            )}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
            <button
              onClick={() => !isProjectReadOnly && selectedIds.size > 0 && handleBulkStatusChange('Active')}
              disabled={selectedIds.size === 0 || isProjectReadOnly}
              title={isProjectReadOnly ? "Status change disabled - Project is On Hold" : ""}
              style={{
                height: '32px',
                padding: '0 14px',
                border: '1px solid #10B981',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: (selectedIds.size === 0 || isProjectReadOnly) ? '#9CA3AF' : '#10B981',
                cursor: (selectedIds.size === 0 || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                opacity: (selectedIds.size === 0 || isProjectReadOnly) ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (selectedIds.size > 0 && !isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIds.size > 0 && !isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              Mark Active
            </button>
            <button
              onClick={() => !isProjectReadOnly && selectedIds.size > 0 && handleBulkStatusChange('Inactive')}
              disabled={selectedIds.size === 0 || isProjectReadOnly}
              title={isProjectReadOnly ? "Status change disabled - Project is On Hold" : ""}
              style={{
                height: '32px',
                padding: '0 14px',
                border: '1px solid #EF4444',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: (selectedIds.size === 0 || isProjectReadOnly) ? '#9CA3AF' : '#EF4444',
                cursor: (selectedIds.size === 0 || isProjectReadOnly) ? 'not-allowed' : 'pointer',
                opacity: (selectedIds.size === 0 || isProjectReadOnly) ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (selectedIds.size > 0 && !isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIds.size > 0 && !isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              Mark Inactive
            </button>

            <button 
              onClick={() => {
                toast.success('Template downloaded successfully');
              }}
              title="Download Template"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <FileDown size={16} />
            </button>

            <button
              onClick={() => !isProjectReadOnly && setShowImportModal(true)}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Import disabled - Project is On Hold" : "Import"}
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '4px',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isProjectReadOnly ? '#9CA3AF' : '#6B7280',
                opacity: isProjectReadOnly ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProjectReadOnly) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#6B7280';
                }
              }}
            >
              <Upload size={16} />
            </button>

            <button 
              onClick={() => setShowExportModal(true)}
              title="Export to Excel"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <FileSpreadsheet size={16} />
            </button>

            <button
              onClick={() => !isProjectReadOnly && handleOpenAddModal()}
              disabled={isProjectReadOnly}
              title={isProjectReadOnly ? "Add disabled - Project is On Hold" : ""}
              style={{
                height: '32px',
                padding: '0 16px',
                border: 'none',
                backgroundColor: isProjectReadOnly ? '#F3F4F6' : '#FD4314',
                color: isProjectReadOnly ? '#9CA3AF' : '#FFFFFF',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <Plus size={14} />
              Add New {currentDimension?.name} Value
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              {/* Header Row */}
              <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#272721',
                  width: '40px'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.size === currentItems.length && currentItems.length > 0}
                    onChange={toggleSelectAll}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      accentColor: '#FD4314'
                    }}
                  />
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#272721',
                  width: '30%'
                }}>
                  Code
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#272721',
                  width: '50%'
                }}>
                  Name
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#272721',
                  width: '20%'
                }}>
                  Status
                </th>
              </tr>

              {/* Filter Row */}
              <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #C8D9EE' }}>
                <td style={{ padding: '8px' }}></td>
                <td style={{ padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="text"
                      placeholder="Search Code"
                      value={codeSearch}
                      onChange={(e) => setCodeSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                  </div>
                </td>
                <td style={{ padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="text"
                      placeholder="Search Name"
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                  </div>
                </td>
                <td style={{ padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="text"
                      placeholder="Search Status"
                      value={statusSearch}
                      onChange={(e) => setStatusSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#9CA3AF'
                  }}>
                    No values found
                  </td>
                </tr>
              ) : (
                currentItems.map((value, index) => (
                  <tr
                    key={value.id}
                    onClick={() => !isProjectReadOnly && handleOpenEditModal(value)}
                    title={isProjectReadOnly ? "Edit disabled - Project is On Hold" : ""}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
                      cursor: isProjectReadOnly ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!isProjectReadOnly) {
                        e.currentTarget.style.backgroundColor = '#E4EEFE';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#FAFBFC';
                    }}
                  >
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      borderBottom: '1px solid #E5E7EB'
                    }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(value.id)}
                        onChange={() => toggleSelect(value.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#FD4314'
                        }}
                      />
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#272721',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      {value.code}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#272721',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      {value.name}
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: value.status === 'Active' 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : 'rgba(239, 68, 68, 0.1)',
                        color: value.status === 'Active' ? '#059669' : '#DC2626'
                      }}>
                        {value.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer with Record Count and Pagination */}
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
              Total Records: {filteredValues.length}
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: currentPage === 1 ? '#F9FAFB' : '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? '#9CA3AF' : '#374151'
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: (currentPage === totalPages || totalPages === 0) ? '#F9FAFB' : '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                  color: (currentPage === totalPages || totalPages === 0) ? '#9CA3AF' : '#374151'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Code Modal */}
      {showCostCodeModal && renderCostCodeModal()}

      {/* Import Modal */}
      {showImportModal && (
        <CodingDimensionImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          dimensionName={currentDimension?.name || 'Dimension'}
        />
      )}

      {/* Add Value Modal */}
      {showAddModal && (
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
          onClick={handleCancelAdd}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                color: '#1F2937',
                margin: 0
              }}>
                Add New {currentDimension?.name} Value
              </h3>
              <button
                onClick={handleCancelAdd}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} style={{ color: '#6B7280' }} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Code *
                </label>
                <input
                  type="text"
                  value={modalCode}
                  onChange={(e) => setModalCode(e.target.value)}
                  placeholder="Enter code"
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Enter name"
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={handleCancelAdd}
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
                onClick={handleSaveAdd}
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
        </div>
      )}

      {/* Edit Value Modal */}
      {showEditModal && (
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
          onClick={handleCancelEdit}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DEE8',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                color: '#1F2937',
                margin: 0
              }}>
                Edit {currentDimension?.name} Value
              </h3>
              <button
                onClick={handleCancelEdit}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} style={{ color: '#6B7280' }} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Code *
                </label>
                <input
                  type="text"
                  value={modalCode}
                  onChange={(e) => setModalCode(e.target.value)}
                  placeholder="Enter code"
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Enter name"
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    padding: '0 12px',
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
                  Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as 'Active' | 'Inactive')}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
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
        </div>
      )}

      {/* Import Modal */}
      <CodingDimensionImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        dimensionName={currentDimension?.name || 'Dimension'}
      />

      {/* Export Modal */}
      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={() => {
          toast.success(`${currentDimension?.name} values exported successfully`);
          setShowExportModal(false);
        }}
        title={`Export ${currentDimension?.name} Values`}
      />
    </div>
  );
}
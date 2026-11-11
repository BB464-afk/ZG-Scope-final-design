import React, { useState } from 'react';
import { ChevronRight, X, Filter, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import ImportFilesModal from '../components/ImportFilesModal';

export default function AddCodingDimension() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [dimensionName, setDimensionName] = useState('');
  
  const [values, setValues] = useState<Array<{ code: string; name: string; status: 'Active' | 'Inactive'; isNew?: boolean }>>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  // Search filters
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');

  // Filter values
  const filteredValues = values.filter(row => {
    const matchesCode = !codeSearch || row.code.toLowerCase().includes(codeSearch.toLowerCase());
    const matchesName = !nameSearch || row.name.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesStatus = !statusSearch || row.status.toLowerCase().includes(statusSearch.toLowerCase());
    return matchesCode && matchesName && matchesStatus;
  });

  const handleAddNewValue = () => {
    const newValue = {
      code: '',
      name: '',
      status: 'Active' as 'Active' | 'Inactive',
      isNew: true
    };
    setValues([newValue, ...values]);
  };

  const handleDeleteValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
    toast.success('Value deleted');
  };

  const handleUpdateValue = (index: number, field: string, value: string) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value, isNew: false };
    setValues(newValues);
  };

  const handleSave = () => {
    if (!dimensionName.trim()) {
      toast.error('Dimension name is required');
      return;
    }

    // Validate that all values have code and name
    const incompleteValues = values.filter(v => !v.code.trim() || !v.name.trim());
    if (incompleteValues.length > 0) {
      toast.error('All dimension values must have both code and name');
      return;
    }

    toast.success(`Dimension "${dimensionName}" created successfully`);
    // Navigate back and the new tab should appear
    navigate(`/app/projects/${projectId}/settings/dimensions`);
  };

  const handleCancel = () => {
    navigate(`/app/projects/${projectId}/settings/dimensions`);
  };

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
            onClick={handleCancel}
            style={{ 
              cursor: 'pointer',
              color: '#6B7280'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FD4314'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            Coding Dimensions
          </span>
          <ChevronRight size={14} style={{ color: '#D8DEE8' }} />
          <span style={{ color: '#272721', fontWeight: '500' }}>
            Add New Dimension
          </span>
        </div>

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
              color: '#1F2937',
              margin: '0 0 4px 0'
            }}>
              Add New Coding Dimension
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0'
            }}>
              Define a new dimension and its values
            </p>
          </div>
        </div>

        {/* Dimension Details Form */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 20px 0'
          }}>
            Dimension Details
          </h2>

          {/* Dimension Name Only */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Dimension Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Building Zone"
              value={dimensionName}
              onChange={(e) => setDimensionName(e.target.value)}
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

        {/* Values Section */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#272721',
              margin: '0'
            }}>
              Dimension Values
            </h2>

            <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
              <button 
                onClick={() => setShowImportModal(true)}
                title="Import"
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
                <Upload size={16} />
              </button>

              <button
                onClick={handleAddNewValue}
                style={{
                  height: '32px',
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
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                <Plus size={14} />
                Add Value
              </button>
            </div>
          </div>

          {/* Values Table */}
          <div style={{
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
                    width: '20%'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#272721',
                    width: '5%'
                  }}>
                    Action
                  </th>
                </tr>

                {/* Filter Row */}
                <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #C8D9EE' }}>
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
                  <td style={{ padding: '8px' }}></td>
                </tr>
              </thead>

              <tbody>
                {filteredValues.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#9CA3AF'
                    }}>
                      No values added yet. Click "Add Value" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredValues.map((value, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFBFC'
                      }}
                    >
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <input
                          type="text"
                          value={value.code}
                          onChange={(e) => handleUpdateValue(index, 'code', e.target.value)}
                          placeholder="Code"
                          style={{
                            width: '100%',
                            height: '32px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '3px',
                            padding: '0 8px',
                            fontSize: '13px',
                            outline: 'none',
                            backgroundColor: value.isNew ? '#FFF4ED' : '#FFFFFF'
                          }}
                        />
                      </td>
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <input
                          type="text"
                          value={value.name}
                          onChange={(e) => handleUpdateValue(index, 'name', e.target.value)}
                          placeholder="Name"
                          style={{
                            width: '100%',
                            height: '32px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '3px',
                            padding: '0 8px',
                            fontSize: '13px',
                            outline: 'none',
                            backgroundColor: value.isNew ? '#FFF4ED' : '#FFFFFF'
                          }}
                        />
                      </td>
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <select
                          value={value.status}
                          onChange={(e) => handleUpdateValue(index, 'status', e.target.value)}
                          style={{
                            width: '100%',
                            height: '32px',
                            border: '1px solid #D8DEE8',
                            borderRadius: '3px',
                            padding: '0 8px',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <button
                          onClick={() => handleDeleteValue(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#DC2626'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons - Right aligned */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px'
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            Save Dimension
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportFilesModal
          onClose={() => setShowImportModal(false)}
          onImport={() => {
            toast.success('Data imported successfully');
            setShowImportModal(false);
          }}
          title="Import Dimension Values"
        />
      )}
    </div>
  );
}
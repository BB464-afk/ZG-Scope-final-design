import React, { useState } from 'react';
import { Plus, Trash2, Search, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// STEP 2: CODING DIMENSIONS - Edit Mode
export function EditCodingDimensionsStep() {
  const [selectedDimension, setSelectedDimension] = useState('area');
  const [searchValue, setSearchValue] = useState('');
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string>('');

  const [dimensions, setDimensions] = useState([
    { id: 'area', name: 'Area', valueCount: 8 },
    { id: 'work-package', name: 'Work Package', valueCount: 6 },
    { id: 'discipline', name: 'Discipline', valueCount: 5 },
    { id: 'cost-type', name: 'Cost Type', valueCount: 4 }
  ]);

  const [dimensionValuesMap, setDimensionValuesMap] = useState<{ [key: string]: any[] }>({
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

  const currentValues = dimensionValuesMap[selectedDimension] || [];

  const handleAddNewValue = () => {
    const newValue = {
      code: '',
      name: '',
      status: 'Active',
      isNew: true
    };
    const newValues = [...currentValues, newValue];
    setDimensionValuesMap({ ...dimensionValuesMap, [selectedDimension]: newValues });
    
    // Update dimension value count
    setDimensions(dimensions.map(dim =>
      dim.id === selectedDimension ? { ...dim, valueCount: newValues.length } : dim
    ));
  };

  const handleDeleteValue = (index: number) => {
    const newValues = currentValues.filter((_, i) => i !== index);
    setDimensionValuesMap({ ...dimensionValuesMap, [selectedDimension]: newValues });
    
    // Update dimension value count
    setDimensions(dimensions.map(dim =>
      dim.id === selectedDimension ? { ...dim, valueCount: newValues.length } : dim
    ));
    
    toast.success('Value deleted successfully');
  };

  const handleUpdateValue = (index: number, field: string, value: string) => {
    const newValues = [...currentValues];
    newValues[index] = { ...newValues[index], [field]: value };
    if (newValues[index].isNew && newValues[index].code && newValues[index].name) {
      delete newValues[index].isNew;
    }
    setDimensionValuesMap({ ...dimensionValuesMap, [selectedDimension]: newValues });
  };

  const filteredValues = currentValues.filter(v => 
    v.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    v.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '24px'
      }}>
        {/* Left Panel - Dimensions List */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px',
          height: 'fit-content'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #D8DEE8'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#272721',
              margin: 0
            }}>
              Coding Dimensions
            </h3>
          </div>

          <div style={{ padding: '12px' }}>
            {dimensions.map((dim) => (
              <div
                key={dim.id}
                onClick={() => setSelectedDimension(dim.id)}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  backgroundColor: selectedDimension === dim.id ? 'rgba(253, 67, 20, 0.08)' : 'transparent',
                  border: selectedDimension === dim.id ? '1px solid #FD4314' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedDimension !== dim.id) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDimension !== dim.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: selectedDimension === dim.id ? '#FD4314' : '#272721'
                  }}>
                    {dim.name}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: selectedDimension === dim.id ? '#FD4314' : '#6B7280',
                    backgroundColor: selectedDimension === dim.id ? '#FFF4EF' : '#F3F4F6',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {dim.valueCount}
                  </span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280'
                }}>
                  {dim.valueCount} value{dim.valueCount !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Dimension Values */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DEE8',
          borderRadius: '4px'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #D8DEE8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 4px 0'
              }}>
                {dimensions.find(d => d.id === selectedDimension)?.name} Values
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Manage values for this dimension
              </p>
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
                gap: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
            >
              <Plus size={14} />
              Add New Value
            </button>
          </div>

          {/* Search */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                placeholder="Search by code or name..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
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
          </div>

          {/* Values Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '25%'
                  }}>
                    Code
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '50%'
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721',
                    borderBottom: '1px solid #C8D9EE',
                    width: '15%'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '12px 24px',
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
              </thead>
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
                      No values found. Click "Add New Value" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredValues.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                        borderBottom: '1px solid #E2E6ED',
                        height: '52px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)'}
                    >
                      <td style={{
                        padding: '8px 24px',
                        fontSize: '13px',
                        color: '#272721'
                      }}>
                        <input
                          type="text"
                          value={row.code}
                          onChange={(e) => handleUpdateValue(index, 'code', e.target.value)}
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
                        padding: '8px 24px',
                        fontSize: '13px',
                        color: '#272721'
                      }}>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleUpdateValue(index, 'name', e.target.value)}
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
                        padding: '8px 24px',
                        fontSize: '13px',
                        color: '#272721'
                      }}>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={row.status}
                            onChange={(e) => handleUpdateValue(index, 'status', e.target.value)}
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
                        padding: '8px 24px',
                        fontSize: '13px',
                        color: '#272721',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => handleDeleteValue(index)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

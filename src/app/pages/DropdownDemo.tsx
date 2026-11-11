import React, { useState } from 'react';
import StandardDropdown from '../components/StandardDropdown';
import { X } from 'lucide-react';

export default function DropdownDemo() {
  const [singleValue, setSingleValue] = useState<string>('');
  const [multiValue, setMultiValue] = useState<string[]>([]);

  // Sample data
  const subcontractors = [
    { value: 'sc-001', label: 'ABC Electrical Contractors' },
    { value: 'sc-002', label: 'Global MEP Solutions' },
    { value: 'sc-003', label: 'Elite Engineering Services' },
    { value: 'sc-004', label: 'Master Builders Inc' },
    { value: 'sc-005', label: 'Premier Construction Group' },
    { value: 'sc-006', label: 'Quality Contractors LLC' },
    { value: 'sc-007', label: 'Reliable Building Solutions' },
    { value: 'sc-008', label: 'Superior Construction Co' },
    { value: 'sc-009', label: 'TechBuild Systems' },
    { value: 'sc-010', label: 'Universal Contractors' }
  ];

  const disciplines = [
    { value: 'arch', label: 'Architectural' },
    { value: 'civil', label: 'Civil' },
    { value: 'elec', label: 'Electrical' },
    { value: 'mech', label: 'Mechanical' },
    { value: 'plumb', label: 'Plumbing' },
    { value: 'struct', label: 'Structural' }
  ];

  const handleRemoveMultiValue = (valueToRemove: string) => {
    setMultiValue(multiValue.filter(v => v !== valueToRemove));
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '32px',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 8px 0'
          }}>
            Standard Dropdown Component Demo
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            Demonstration of the reusable dropdown component in both single-select and multi-select modes
          </p>
        </div>

        {/* Demo Sections */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {/* Single Select Demo */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 8px 0'
            }}>
              Single Select Mode
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: '0 0 20px 0'
            }}>
              Select one option from the list. The dropdown closes automatically after selection.
            </p>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Select Discipline
              </label>
              <StandardDropdown
                options={disciplines}
                value={singleValue}
                onChange={(value) => setSingleValue(value as string)}
                placeholder="Search and select discipline..."
                mode="single"
              />
            </div>
          </div>

          {/* Multi Select Demo */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 8px 0'
            }}>
              Multi Select Mode
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: '0 0 20px 0'
            }}>
              Select multiple options using checkboxes. Selected items appear as tags inside the field.
            </p>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Select Subcontractors
              </label>
              <StandardDropdown
                options={subcontractors}
                value={multiValue}
                onChange={(value) => setMultiValue(value as string[])}
                placeholder="Search and select subcontractors..."
                mode="multi"
              />

              {/* Selected Values Section */}
              {multiValue.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4EEFE',
                  borderRadius: '4px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {multiValue.map(val => {
                    const option = subcontractors.find(s => s.value === val);
                    return option ? (
                      <div
                        key={val}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          border: '1px solid #FD4314',
                          borderRadius: '4px',
                          backgroundColor: '#E4EEFE',
                          fontSize: '13px',
                          color: '#272721'
                        }}
                      >
                        <span>{option.label}</span>
                        <X
                          size={14}
                          style={{ color: '#FD4314', cursor: 'pointer' }}
                          onClick={() => handleRemoveMultiValue(val)}
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Feature List */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DEE8',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 16px 0'
            }}>
              Component Features
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  🔍 Searchable
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Real-time filtering of options as you type
                </p>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  🏷️ Tag Display
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Multi-select values shown as removable tags
                </p>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  ✅ Checkbox Selection
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Visual feedback with orange accent checkboxes
                </p>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  🎨 Theme Consistent
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Follows ZG-CMP design system colors
                </p>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  📱 Click Outside
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Automatically closes when clicking outside
                </p>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 8px 0'
                }}>
                  🔄 Flexible Modes
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Supports both single and multi-select
                </p>
              </div>
            </div>
          </div>

          {/* Usage Example */}
          <div style={{
            backgroundColor: '#272721',
            color: '#E5E7EB',
            borderRadius: '8px',
            padding: '24px',
            fontFamily: 'monospace'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: '0 0 16px 0'
            }}>
              Usage Example
            </h2>

            <pre style={{
              fontSize: '13px',
              lineHeight: '1.6',
              margin: 0,
              overflow: 'auto'
            }}>
{`// Single Select
<StandardDropdown
  options={disciplines}
  value={singleValue}
  onChange={(value) => setSingleValue(value as string)}
  placeholder="Search and select discipline..."
  mode="single"
/>

// Multi Select
<StandardDropdown
  options={subcontractors}
  value={multiValue}
  onChange={(value) => setMultiValue(value as string[])}
  placeholder="Search and select subcontractors..."
  mode="multi"
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
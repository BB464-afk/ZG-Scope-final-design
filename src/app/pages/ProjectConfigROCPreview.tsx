import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, Edit2, Plus, AlertCircle } from 'lucide-react';

interface SubStep {
  name: string;
  weightage: number;
}

interface ROCStep {
  main: string;
  weightage: number;
  subSteps: SubStep[];
}

interface ROCData {
  id: number;
  rocId: string;
  activityName: string;
  uom: string;
  step1: ROCStep;
  step2: ROCStep;
  step3: ROCStep;
  step4: ROCStep;
  total: number;
  hasSubSteps: boolean;
  configuredId?: number;
  source?: string;
}

interface ProjectConfigROCPreviewProps {
  selectedRocs: ROCData[];
  onBack: () => void;
  onComplete: () => void;
  onEdit: (roc: ROCData) => void;
  onAddMore: () => void;
}

export default function ProjectConfigROCPreview({
  selectedRocs,
  onBack,
  onComplete,
  onEdit,
  onAddMore
}: ProjectConfigROCPreviewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpandRow = (rocId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rocId)) {
      newExpanded.delete(rocId);
    } else {
      newExpanded.add(rocId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Page Title */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#272721',
          margin: '0 0 8px 0'
        }}>
          Review Selected Activities
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0
        }}>
          Review your selected ROCs below. You can edit individual ROCs or add more from the library.
        </p>
      </div>

      {/* Confirmation Banner */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'rgba(228, 238, 254, 0.5)',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
      }}>
        <AlertCircle size={20} style={{ color: '#FD4314', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <p style={{
            margin: '0 0 6px 0',
            fontSize: '14px',
            color: '#272721',
            fontWeight: '600'
          }}>
            Review Your Selection ({selectedRocs.length} ROCs)
          </p>
          <div style={{
            fontSize: '13px',
            color: '#6B7280',
            lineHeight: '1.6'
          }}>
            This is what your selected data looks like. Do you want to modify anything or add more ROCs? 
            Use the <strong>Edit</strong> button next to any ROC to customize its values.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        <button
          onClick={onAddMore}
          style={{
            height: '36px',
            padding: '0 16px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#111827',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <Plus size={16} />
          Add More ROCs
        </button>
      </div>

      {/* ROC Preview Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DEE8',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        {/* Section Header */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#F3F6FA',
          borderBottom: '1px solid #D8DEE8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Selected Activities
            </h3>
            <span style={{
              fontSize: '13px',
              color: '#6B7280',
              backgroundColor: '#E5E7EB',
              padding: '4px 10px',
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              {selectedRocs.length} ROCs
            </span>
          </div>
        </div>

        {/* ROC Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F6FA' }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '40px'
                }}>
                  
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '100px'
                }}>
                  ROC ID
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  minWidth: '200px'
                }}>
                  Activity Name
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '80px'
                }}>
                  UOM
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '100px'
                }}>
                  Step 1
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '100px'
                }}>
                  Step 2
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '100px'
                }}>
                  Step 3
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '100px'
                }}>
                  Step 4
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '80px'
                }}>
                  Total
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#272721',
                  borderBottom: '1px solid #D8DEE8',
                  width: '100px'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedRocs.flatMap((roc, index) => {
                const isExpanded = expandedRows.has(roc.id);
                const rows = [];
                
                // Main row
                rows.push(
                  <tr key={`main-${roc.id}`} style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFBFC'
                  }}>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.hasSubSteps && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandRow(roc.id, e);
                          }}
                          style={{
                            padding: '4px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '0 auto'
                          }}
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      )}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#111827',
                      fontWeight: '600',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.rocId}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#111827',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.activityName}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#6B7280',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.uom}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#111827',
                      fontWeight: '600',
                      fontSize: '14px',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.step1.weightage > 0 ? `${roc.step1.weightage}%` : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#111827',
                      fontWeight: '600',
                      fontSize: '14px',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.step2.weightage > 0 ? `${roc.step2.weightage}%` : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#111827',
                      fontWeight: '600',
                      fontSize: '14px',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.step3.weightage > 0 ? `${roc.step3.weightage}%` : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#111827',
                      fontWeight: '600',
                      fontSize: '14px',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.step4.weightage > 0 ? `${roc.step4.weightage}%` : <span style={{ color: '#D1D5DB' }}>—</span>}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#111827',
                      fontWeight: '600',
                      fontSize: '14px',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      {roc.total}%
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      borderBottom: isExpanded ? 'none' : '1px solid #E5E7EB'
                    }}>
                      <button
                        onClick={() => onEdit(roc)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #FD4314',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#FD4314',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          margin: '0 auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
                
                // Expansion row
                if (isExpanded && roc.hasSubSteps) {
                  rows.push(
                    <tr key={`expanded-${roc.id}`} style={{
                      backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#F3F4F6'
                    }}>
                      <td colSpan={10} style={{
                        padding: '16px 60px',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '20px',
                          fontSize: '12px'
                        }}>
                          {/* Step 1 */}
                          {roc.step1.subSteps.length > 0 && (
                            <div>
                              <div style={{ fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                                {roc.step1.main} ({roc.step1.weightage}%)
                              </div>
                              {roc.step1.subSteps.map((sub, idx) => (
                                <div key={idx} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '6px 0',
                                  color: '#111827'
                                }}>
                                  <span>{sub.name}</span>
                                  <span style={{ fontWeight: '600' }}>{sub.weightage}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Step 2 */}
                          {roc.step2.subSteps.length > 0 && (
                            <div>
                              <div style={{ fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                                {roc.step2.main} ({roc.step2.weightage}%)
                              </div>
                              {roc.step2.subSteps.map((sub, idx) => (
                                <div key={idx} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '6px 0',
                                  color: '#111827'
                                }}>
                                  <span>{sub.name}</span>
                                  <span style={{ fontWeight: '600' }}>{sub.weightage}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Step 3 */}
                          {roc.step3.subSteps.length > 0 && (
                            <div>
                              <div style={{ fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                                {roc.step3.main} ({roc.step3.weightage}%)
                              </div>
                              {roc.step3.subSteps.map((sub, idx) => (
                                <div key={idx} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '6px 0',
                                  color: '#111827'
                                }}>
                                  <span>{sub.name}</span>
                                  <span style={{ fontWeight: '600' }}>{sub.weightage}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Step 4 */}
                          {roc.step4.subSteps.length > 0 && (
                            <div>
                              <div style={{ fontWeight: '600', color: '#6B7280', marginBottom: '8px' }}>
                                {roc.step4.main} ({roc.step4.weightage}%)
                              </div>
                              {roc.step4.subSteps.map((sub, idx) => (
                                <div key={idx} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '6px 0',
                                  color: '#111827'
                                }}>
                                  <span>{sub.name}</span>
                                  <span style={{ fontWeight: '600' }}>{sub.weightage}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
                
                return rows;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        marginTop: '32px'
      }}>
        <button
          onClick={onBack}
          style={{
            height: '40px',
            padding: '0 20px',
            border: '1px solid #D8DEE8',
            backgroundColor: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          Back to Selection
        </button>

        <button
          onClick={onComplete}
          style={{
            height: '40px',
            padding: '0 24px',
            border: 'none',
            backgroundColor: '#10B981',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
        >
          Complete Configuration
        </button>
      </div>
    </div>
  );
}
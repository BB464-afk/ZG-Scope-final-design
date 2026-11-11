import React from 'react';
import { formatDate } from '../components/EnterpriseTable';

interface PlanningBudgetSectionProps {
  isEditMode: boolean;
  formData: {
    budgetCost: string;
    budgetManHours: string;
    budgetQuantity: string;
    baselineStartDate: string;
    baselineFinishDate: string;
    actualStartDate?: string;
    actualFinishDate?: string;
    actualValue: string;
    actualManHours: string;
    actualQuantity: string;
    approvedChangeCost: string;
    approvedChangeHours: string;
    completion: string;
    status?: string;
  };
  selectedUOM: string;
  handleInputChange: (field: string, value: string) => void;
}

const PlanningBudgetSection: React.FC<PlanningBudgetSectionProps> = ({
  isEditMode,
  formData,
  selectedUOM,
  handleInputChange
}) => {
  const fieldStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500' as const,
    color: '#272721',
    marginBottom: '6px'
  };

  const inputStyle = {
    width: '100%',
    height: '36px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '12px',
    paddingRight: '12px',
    border: '1px solid #D8DEE8',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#272721',
    outline: 'none'
  };

  const readOnlyInputStyle = {
    width: '100%',
    height: '36px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '12px',
    paddingRight: '12px',
    border: '1px solid #D8DEE8',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
    outline: 'none',
    cursor: 'not-allowed'
  };

  const inputWithSuffixStyle = {
    width: '100%',
    height: '36px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '12px',
    paddingRight: '40px',
    border: '1px solid #D8DEE8',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#272721',
    outline: 'none',
    textAlign: 'right' as const
  };

  const readOnlyInputWithSuffixStyle = {
    width: '100%',
    height: '36px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '12px',
    paddingRight: '40px',
    border: '1px solid #D8DEE8',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
    outline: 'none',
    cursor: 'not-allowed',
    textAlign: 'right' as const
  };

  const suffixStyle = {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '13px',
    color: '#6B7280',
    pointerEvents: 'none' as const,
    fontWeight: '500'
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = '#F3F4F6';
    let textColor = '#6B7280';
    
    switch (status) {
      case 'In Progress':
        bgColor = '#FEF3C7';
        textColor = '#92400E';
        break;
      case 'Completed':
        bgColor = '#D1FAE5';
        textColor = '#065F46';
        break;
      case 'On Hold':
        bgColor = '#DBEAFE';
        textColor = '#1E40AF';
        break;
      case 'Not Started':
        bgColor = '#FEE2E2';
        textColor = '#991B1B';
        break;
      case 'Draft':
        bgColor = '#F3F4F6';
        textColor = '#6B7280';
        break;
      default:
        bgColor = '#F3F4F6';
        textColor = '#6B7280';
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '13px',
        fontWeight: '500',
        borderRadius: '4px'
      }}>
        {status}
      </span>
    );
  };

  // For Edit Mode: Use table-like layout with better comparison
  if (isEditMode) {
    return (
      <>
        {/* Budget & Planning Section */}
        <div style={{
          backgroundColor: '#FAFBFC',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '650',
            color: '#111827',
            margin: '0 0 20px 0',
            letterSpacing: '-0.01em'
          }}>
            Budget & Planning
          </h3>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #E5E7EB',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Metric
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Planned Value
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Earned Value
            </div>
          </div>

          {/* Table Rows */}
          {/* Row 1: Cost */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #F3F4F6'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Cost (EUR)
            </div>
            <div>
              <input
                type="text"
                value={formData.budgetCost}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>
            <div>
              <input
                type="text"
                value={formData.actualValue}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>
          </div>

          {/* Row 2: Man-Hours */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #F3F4F6'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Man-Hours (hrs)
            </div>
            <div>
              <input
                type="text"
                value={formData.budgetManHours}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>
            <div>
              <input
                type="text"
                value={formData.actualManHours}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>
          </div>

          {/* Row 3: Quantity */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Quantity ({selectedUOM})
            </div>
            <div>
              <input
                type="text"
                value={formData.budgetQuantity}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>
            <div>
              <input
                type="text"
                value={formData.actualQuantity}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>
          </div>
        </div>

        {/* Baseline v/s Actual Section */}
        <div style={{
          backgroundColor: '#FAFBFC',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '650',
            color: '#111827',
            margin: '0 0 20px 0',
            letterSpacing: '-0.01em'
          }}>
            Baseline v/s Actual
          </h3>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #E5E7EB',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Date Type
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Baseline Date
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Actual Date
            </div>
          </div>

          {/* Row 1: Start Date */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #F3F4F6'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Start Date
            </div>
            <div>
              <input
                type="date"
                value={formData.baselineStartDate}
                onChange={(e) => handleInputChange('baselineStartDate', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <input
                type="date"
                value={formData.actualStartDate || ''}
                onChange={(e) => handleInputChange('actualStartDate', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 2: Finish Date */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Finish Date
            </div>
            <div>
              <input
                type="date"
                value={formData.baselineFinishDate}
                onChange={(e) => handleInputChange('baselineFinishDate', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <input
                type="date"
                value={formData.actualFinishDate || ''}
                onChange={(e) => handleInputChange('actualFinishDate', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div style={{
          backgroundColor: '#FAFBFC',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '650',
            color: '#111827',
            margin: '0 0 20px 0',
            letterSpacing: '-0.01em'
          }}>
            Status
          </h3>

          <div>
            <label style={labelStyle}>Task Status</label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 32px 0 12px',
                border: '1px solid #D8DEE8',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#272721',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23272721' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
            >
              <option value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Void">Void</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Approved Changes Section */}
        <div style={{
          backgroundColor: '#FAFBFC',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '650',
            color: '#111827',
            margin: '0 0 20px 0',
            letterSpacing: '-0.01em'
          }}>
            Approved Changes
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {/* Approved Change Cost */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Approved Change Cost</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={formData.approvedChangeCost}
                  onChange={(e) => handleInputChange('approvedChangeCost', e.target.value)}
                  placeholder="0.00"
                  style={inputWithSuffixStyle}
                />
                <span style={suffixStyle}>EUR</span>
              </div>
            </div>

            {/* Approved Change Hours */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Approved Change Hours</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={formData.approvedChangeHours}
                  onChange={(e) => handleInputChange('approvedChangeHours', e.target.value)}
                  placeholder="0"
                  style={inputWithSuffixStyle}
                />
                <span style={suffixStyle}>h</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // For Create Mode: Keep original single-column layout
  return (
    <div style={{
      backgroundColor: '#FAFBFC',
      border: '1px solid #E5E7EB',
      borderRadius: '6px',
      padding: '24px',
      marginTop: '8px'
    }}>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '650',
        color: '#111827',
        margin: '0 0 20px 0',
        letterSpacing: '-0.01em'
      }}>
        Planning & Budget
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {/* Budget Cost */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Budget Cost (EUR) <span style={{ color: '#DC2626' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={formData.budgetCost}
              onChange={(e) => handleInputChange('budgetCost', e.target.value)}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Budget Man-Hours */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Budget Man-Hours (hrs) <span style={{ color: '#DC2626' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={formData.budgetManHours}
              onChange={(e) => handleInputChange('budgetManHours', e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Total Quantity */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Total Quantity ({selectedUOM}) <span style={{ color: '#DC2626' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={formData.budgetQuantity}
              onChange={(e) => handleInputChange('budgetQuantity', e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Baseline Start Date */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Baseline Start Date</label>
          <input
            type="date"
            value={formData.baselineStartDate}
            onChange={(e) => handleInputChange('baselineStartDate', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Baseline Finish Date */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Baseline Finish Date</label>
          <input
            type="date"
            value={formData.baselineFinishDate}
            onChange={(e) => handleInputChange('baselineFinishDate', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanningBudgetSection;
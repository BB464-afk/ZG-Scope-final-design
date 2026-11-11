import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

interface FormData {
  code: string;
  name: string;
  symbol: string;
  status: 'Active' | 'Inactive';
}

export default function UOMForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<FormData>({
    code: '',
    name: '',
    symbol: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      // Mock data loading
      setFormData({
        code: 'SQM',
        name: 'Square Meter',
        symbol: 'm²',
        status: 'Active'
      });
    }
  }, [isEditMode, id]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.code.trim()) newErrors.code = 'This field is required';
    if (!formData.name.trim()) newErrors.name = 'This field is required';
    if (!formData.symbol.trim()) newErrors.symbol = 'This field is required';
    if (isEditMode && !formData.status) newErrors.status = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Mock: Check for duplicate code (only in add mode)
    if (!isEditMode && formData.code === 'SQM') {
      setErrors({ code: 'UOM Code already exists' });
      return;
    }

    const message = isEditMode ? 'UOM updated successfully' : 'UOM created successfully';
    toast.success(message, {
      duration: 4000,
      position: 'top-right'
    });
    navigate('/app/general-settings/uom');
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/app/general-settings/uom');
    }
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: '13px',
        color: '#5F6B7A',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/app/general-settings/uom')}>
          UOM Master
        </span>
        <span>/</span>
        <span style={{ color: '#272721', fontWeight: '500' }}>
          {isEditMode ? 'Edit UOM' : 'Add UOM'}
        </span>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1F2937',
          margin: '0 0 4px 0'
        }}>
          UOM (Units of Measurement)
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5F6B7A',
          margin: '0'
        }}>
          {isEditMode ? 'Edit' : 'Add'} New UOM
        </p>
      </div>

      {/* Form Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '6px',
        padding: '32px',
        marginBottom: '24px',
        position: 'relative'
      }}>
        {/* Two-column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px 32px',
          paddingBottom: '72px'
        }}>
          {/* UOM Code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              UOM Code <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              disabled={isEditMode}
              placeholder="Enter UOM Code"
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                border: `1px solid ${errors.code ? '#DC2626' : '#D8DEE8'}`,
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: isEditMode ? '#F3F4F6' : '#FFFFFF',
                color: '#272721',
                outline: 'none',
                cursor: isEditMode ? 'not-allowed' : 'text'
              }}
            />
            {errors.code && (
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                color: '#DC2626'
              }}>
                {errors.code}
              </span>
            )}
          </div>

          {/* UOM Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              UOM Name <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter UOM Name"
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                border: `1px solid ${errors.name ? '#DC2626' : '#D8DEE8'}`,
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#272721',
                outline: 'none'
              }}
            />
            {errors.name && (
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                color: '#DC2626'
              }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Symbol */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Symbol <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => handleChange('symbol', e.target.value)}
              placeholder="Enter Symbol"
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                border: `1px solid ${errors.symbol ? '#DC2626' : '#D8DEE8'}`,
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#272721',
                outline: 'none'
              }}
            />
            {errors.symbol && (
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                color: '#DC2626'
              }}>
                {errors.symbol}
              </span>
            )}
          </div>

          {/* Status - Only show in Edit mode */}
          {isEditMode && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Status <span style={{ color: '#FF3B30' }}>*</span>
              </label>
              <StandardDropdown
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
                value={formData.status}
                onChange={(value) => handleChange('status', value as 'Active' | 'Inactive')}
                placeholder="Select Status"
                mode="single"
                error={errors.status}
                searchable={false}
              />
            </div>
          )}
        </div>

        {/* Footer Actions - Positioned at Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '32px',
          right: '32px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          alignItems: 'center'
        }}>
          <button
            onClick={handleCancel}
            style={{
              height: '36px',
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
              height: '36px',
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
            {isEditMode ? 'Save' : 'Add'}
          </button>
        </div>
      </div>

      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowDiscardModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '480px',
              maxWidth: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '24px 24px 16px 24px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Unsaved changes will be lost
              </h2>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{
                fontSize: '14px',
                color: '#5F6B7A',
                lineHeight: '1.5',
                margin: 0
              }}>
                Are you sure you want to cancel?
              </p>
            </div>

            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: '#F9FAFB'
            }}>
              <button
                onClick={() => setShowDiscardModal(false)}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Stay
              </button>
              <button
                onClick={() => navigate('/app/general-settings/uom')}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
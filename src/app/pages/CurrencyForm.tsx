import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

interface FormData {
  code: string;
  name: string;
  symbol: string;
  status?: string;
}

export default function CurrencyForm() {
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
        code: 'USD',
        name: 'United States Dollar',
        symbol: '$',
        status: 'Active'
      });
    }
  }, [isEditMode, id]);

  const handleChange = (field: keyof FormData, value: any) => {
    // Auto-uppercase for currency code
    if (field === 'code') {
      value = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}; // Mandatory fields
    if (!formData.code.trim()) {
      newErrors.code = 'Currency Code is required';
    } else if (formData.code.length > 10) {
      newErrors.code = 'Maximum 10 characters allowed';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Currency Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Maximum 100 characters allowed';
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }

    if (isEditMode && !formData.status) {
      newErrors.status = 'This field is required';
    }

    // Check for duplicate code (mock)
    if (!isEditMode && formData.code === 'USD') {
      newErrors.code = 'Currency Code already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    toast.success('Currency saved successfully', {
      duration: 4000,
      position: 'top-right'
    });
    navigate('/app/general-settings/currency');
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/app/general-settings/currency');
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
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/app/general-settings/currency')}>
          Currency Master
        </span>
        <span>/</span>
        <span style={{ color: '#272721', fontWeight: '500' }}>
          {isEditMode ? 'Edit Currency' : 'Add Currency'}
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
          Currency Master
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5F6B7A',
          margin: '0'
        }}>
          {isEditMode ? 'Edit' : 'Add'} currency details
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
          {/* Currency Code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Currency Code <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              disabled={isEditMode}
              maxLength={10}
              placeholder="e.g., USD, EUR, GBP"
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
                cursor: isEditMode ? 'not-allowed' : 'text',
                textTransform: 'uppercase'
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
            {isEditMode && (
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                color: '#5F6B7A'
              }}>
                Currency Code cannot be edited
              </span>
            )}
          </div>

          {/* Currency Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Currency Name <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              maxLength={100}
              placeholder="e.g., United States Dollar"
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
              placeholder="e.g., $, €, £, ₹"
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

          {/* Status - Only in Edit Mode */}
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
                value={formData.status || 'Active'}
                onChange={(value) => handleChange('status', value)}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
                placeholder="Select Status"
              />
              {errors.status && (
                <span style={{
                  display: 'block',
                  marginTop: '4px',
                  fontSize: '12px',
                  color: '#DC2626'
                }}>
                  {errors.status}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions - Fixed at Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '32px',
          right: '32px',
          display: 'flex',
          justifyContent: 'flex-start',
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
                Discard unsaved changes?
              </h2>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{
                fontSize: '14px',
                color: '#5F6B7A',
                lineHeight: '1.5',
                margin: 0
              }}>
                You have unsaved changes. Are you sure you want to discard them?
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
                Continue Editing
              </button>
              <button
                onClick={() => navigate('/app/general-settings/currency')}
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
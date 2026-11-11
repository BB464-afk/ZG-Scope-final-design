import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

export default function TPForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive' | '' // Default to Active
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isCodeUsed, setIsCodeUsed] = useState(false);

  // Mock: Load data if editing
  useEffect(() => {
    if (isEdit && id) {
      // Simulate loading existing data
      const mockData = {
        code: 'TP-MEP-001',
        name: 'Mechanical, Electrical & Plumbing Works',
        description: 'Includes all MEP systems for the main building including HVAC, electrical distribution, plumbing, and fire protection systems',
        status: 'Active' as 'Active' | 'Inactive' | ''
      };
      setFormData(mockData);
      
      // Check if TP code is used in other modules (mock logic)
      setIsCodeUsed(id === '1');
    }
  }, [id, isEdit]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Auto-uppercase for code field
    if (field === 'code') {
      setFormData(prev => ({ ...prev, [field]: value.toUpperCase() }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // TP Code validation
    if (!formData.code.trim()) {
      newErrors.code = 'TP Code is required';
    } else if (formData.code.length > 20) {
      newErrors.code = 'Maximum 20 characters allowed';
    } else if (!isEdit || formData.code !== 'TP-MEP-001') {
      // Mock uniqueness check (skip if editing and code unchanged)
      const existingCodes = ['TP-ARC-001', 'TP-STR-001', 'TP-ELE-001'];
      if (existingCodes.includes(formData.code)) {
        newErrors.code = 'TP Code already exists';
      }
    }

    // Trade Package Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Trade Package Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Maximum 100 characters allowed';
    }

    // Description validation (optional - only validate length if provided)
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Maximum 200 characters allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save logic
      const message = isEdit
        ? 'Trade Package updated successfully'
        : 'Trade Package created successfully';

      toast.success(message);
      navigate('/app/general-settings/tp');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      navigate('/app/general-settings/tp');
    }
  };

  const handleDiscard = () => {
    setShowDiscardModal(false);
    navigate('/app/general-settings/tp');
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
        color: '#858D9D',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px'
      }}>
        <span 
          className="cursor-pointer hover:text-[#1F2937]"
          onClick={() => navigate('/app/general-settings/tp')}
        >
          Trade Package Master
        </span>
        <span>/</span>
        <span style={{ color: '#1F2937' }}>{isEdit ? 'Edit' : 'Add'} Trade Package</span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1F2937',
        margin: '0 0 24px 0'
      }}>
        {isEdit ? 'Edit Trade Package' : 'Add New Trade Package'}
      </h1>

      {/* Form Container */}
      <div>
        {/* Basic Information Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* TP Code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              TP Code <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              maxLength={20}
              placeholder="e.g., TP-MEP-001"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#1F2937',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                cursor: 'text'
              }}
            />
            {errors.code && (
              <div style={{
                fontSize: '12px',
                color: '#DC2626',
                marginTop: '4px'
              }}>
                {errors.code}
              </div>
            )}
          </div>

          {/* Trade Package Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Trade Package Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              maxLength={100}
              placeholder="Enter trade package name"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#1F2937',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            />
            {errors.name && (
              <div style={{
                fontSize: '12px',
                color: '#DC2626',
                marginTop: '4px'
              }}>
                {errors.name}
              </div>
            )}
          </div>

          {/* Description - Spans both columns */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={200}
              placeholder="Enter description (optional)"
              style={{
                width: '100%',
                height: '80px',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#1F2937',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                resize: 'vertical'
              }}
            />
            {errors.description && (
              <div style={{
                fontSize: '12px',
                color: '#DC2626',
                marginTop: '4px'
              }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Status - Only show in Edit mode */}
          {isEdit && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Status <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <StandardDropdown
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
                value={formData.status}
                onChange={(value) => handleChange('status', value as string)}
                placeholder="Select Status"
                mode="single"
                error={errors.status}
                searchable={false}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          {/* Cancel */}
          <button 
            onClick={handleCancel}
            style={{
              height: '40px',
              padding: '0 24px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          {/* Save/Add */}
          <button 
            onClick={handleSubmit}
            style={{
              height: '40px',
              padding: '0 24px',
              border: 'none',
              backgroundColor: '#FD4314',
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </div>

      {/* Discard Changes Modal */}
      {showDiscardModal && (
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
            borderRadius: '6px',
            padding: '24px',
            width: '90%',
            maxWidth: '420px',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 12px 0'
            }}>
              Discard Changes?
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: '1.5'
            }}>
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowDiscardModal(false)}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
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
                Keep Editing
              </button>
              <button
                onClick={handleDiscard}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
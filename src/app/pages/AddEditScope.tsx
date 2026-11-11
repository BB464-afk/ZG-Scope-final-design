import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

export default function AddEditScope() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Form state
  const [code, setCode] = useState(isEdit ? 'SCO-001' : '');
  const [name, setName] = useState(isEdit ? 'Design & Engineering' : '');
  const [description, setDescription] = useState(isEdit ? 'Covers all engineering design activities including structural, electrical, mechanical, and architectural design phases' : '');
  const [status, setStatus] = useState(isEdit ? 'Active' : 'Active'); // Default to 'Active' for add mode
  
  // Track original status for edit mode
  const [originalStatus] = useState(isEdit ? 'Active' : '');

  // Validation error state
  const [errors, setErrors] = useState({
    code: '',
    name: '',
    description: ''
  });

  const validateForm = () => {
    const newErrors = {
      code: '',
      name: '',
      description: ''
    };

    let isValid = true;

    if (!code.trim()) {
      newErrors.code = 'Scope code is required';
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = 'Scope name is required';
      isValid = false;
    }

    // Description is optional - only validate length if provided
    if (description && description.length > 200) {
      newErrors.description = 'Maximum 200 characters allowed';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (isEdit) {
        // Check if status changed
        if (status !== originalStatus) {
          if (status === 'Active') {
            toast.success('Scope updated successfully', {
              description: "This scope will now be shown in dropdowns when creating new projects. Changes won't affect existing projects.",
              duration: 5000
            });
          } else {
            toast.success('Scope updated successfully', {
              description: "This scope won't be shown in dropdowns when creating new projects. Changes won't affect existing projects.",
              duration: 5000
            });
          }
        } else {
          toast.success('Scope updated successfully');
        }
      } else {
        toast.success('Scope added successfully');
      }
      navigate('/app/scope');
    } else {
      toast.error('Please fix the validation errors');
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
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#5F6B7A',
        marginBottom: '24px'
      }}>
        <span 
          className="cursor-pointer hover:text-[#1F2937]"
          onClick={() => navigate('/app/scope')}
        >
          Scope Master
        </span>
        <ChevronRight size={14} />
        <span style={{ fontWeight: '500', color: '#1F2937' }}>
          {isEdit ? 'Edit Scope' : 'Add Scope'}
        </span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: '32px'
      }}>
        {isEdit ? 'Edit Scope' : 'Add Scope'}
      </h1>

      {/* Form Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E6ED',
        borderRadius: '6px',
        padding: '32px'
      }}>
        {/* Form Fields - Two Column Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px 32px'
        }}>
          {/* Scope Code Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Scope Code <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter scope code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) setErrors({...errors, code: ''});
              }}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: `1px solid ${errors.code ? '#DC2626' : '#D1D5DB'}`,
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = errors.code ? '#DC2626' : '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = errors.code ? '#DC2626' : '#D1D5DB'}
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

          {/* Scope Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Scope Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter scope name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({...errors, name: ''});
              }}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: `1px solid ${errors.name ? '#DC2626' : '#D1D5DB'}`,
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = errors.name ? '#DC2626' : '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = errors.name ? '#DC2626' : '#D1D5DB'}
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
        </div>

        {/* Description Field */}
        <div style={{ 
          marginTop: '24px'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Description
          </label>
          <textarea
            placeholder="Enter scope description (optional)"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({...errors, description: ''});
            }}
            maxLength={200}
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              border: `1px solid ${errors.description ? '#DC2626' : '#D1D5DB'}`,
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = errors.description ? '#DC2626' : '#FD4314'}
            onBlur={(e) => e.target.style.borderColor = errors.description ? '#DC2626' : '#D1D5DB'}
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

        {/* Status Field - Only show in Edit mode */}
        {isEdit && (
          <div style={{ marginTop: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Status <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <StandardDropdown
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
              value={status}
              onChange={(value) => {
                setStatus(value as string);
              }}
              placeholder="Select status"
              mode="single"
              searchable={false}
            />
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #E2E6ED'
        }}>
          {/* Cancel */}
          <button 
            onClick={() => navigate('/app/scope')}
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
    </div>
  );
}
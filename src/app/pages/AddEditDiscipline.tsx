import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

export default function AddEditDiscipline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Form state
  const [code, setCode] = useState(isEdit ? 'DISC-001' : '');
  const [name, setName] = useState(isEdit ? 'Architectural' : '');
  const [description, setDescription] = useState(isEdit ? 'Architectural design and planning work' : '');
  const [status, setStatus] = useState(isEdit ? 'Active' : 'Active'); // Default to 'Active' for add mode
  
  // Track original status for edit mode
  const [originalStatus] = useState(isEdit ? 'Active' : '');
  
  // Modal state
  const [showInactiveConfirmModal, setShowInactiveConfirmModal] = useState(false);

  // Validation error state
  const [errors, setErrors] = useState({
    code: '',
    name: ''
  });

  const validateForm = () => {
    const newErrors = {
      code: '',
      name: ''
    };

    let isValid = true;

    if (!code.trim()) {
      newErrors.code = 'Discipline code is required';
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = 'Discipline name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Check if status is being changed to Inactive in edit mode
      if (isEdit && status === 'Inactive' && originalStatus !== 'Inactive') {
        setShowInactiveConfirmModal(true);
        return;
      }
      
      // Proceed with save
      saveChanges();
    } else {
      toast.error('Please fix the validation errors');
    }
  };

  const saveChanges = () => {
    if (isEdit) {
      // Check if status changed
      if (status !== originalStatus) {
        if (status === 'Active') {
          toast.success('Discipline updated successfully', {
            description: "This discipline will now be shown in dropdowns when creating new projects. Changes won't affect existing projects.",
            duration: 5000
          });
        } else {
          toast.success('Discipline updated successfully', {
            description: "This discipline won't be shown in dropdowns when creating new projects. Changes won't affect existing projects.",
            duration: 5000
          });
        }
      } else {
        toast.success('Discipline updated successfully');
      }
    } else {
      toast.success('Discipline added successfully');
    }
    navigate('/app/disciplines');
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
          onClick={() => navigate('/app/disciplines')}
        >
          Discipline Master
        </span>
        <ChevronRight size={14} />
        <span style={{ fontWeight: '500', color: '#1F2937' }}>
          {isEdit ? 'Edit Discipline' : 'Add Discipline'}
        </span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: '32px'
      }}>
        {isEdit ? 'Edit Discipline' : 'Add Discipline'}
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
          {/* Discipline Code Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Discipline Code <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter discipline code"
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

          {/* Discipline Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Discipline Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter discipline name"
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

          {/* Description Field - Spans both columns */}
          <div style={{ gridColumn: 'span 2' }}>
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
              placeholder="Enter discipline description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {/* Status Field - Only show in Edit mode */}
          {isEdit && (
            <div>
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
        </div>

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
            onClick={() => navigate('/app/disciplines')}
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

      {/* Inactive Confirmation Modal */}
      {showInactiveConfirmModal && (
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
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '480px',
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '12px'
            }}>
              Confirm Status Change
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              The selected discipline(s) is used in existing projects and will continue to be used there. It will not be available for selection in new projects. Do you want to continue?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowInactiveConfirmModal(false);
                  setStatus(originalStatus); // Revert to original status
                }}
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
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInactiveConfirmModal(false);
                  saveChanges();
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
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
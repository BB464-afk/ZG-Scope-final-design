import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

interface FormData {
  code: string;
  name: string;
  contactFirstName: string;
  contactLastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  category: string[];
  status: 'Active' | 'Inactive';
}

const categoryOptions = [
  'Mechanical',
  'Piping',
  'Electrical',
  'Civil',
  'Structural',
  'HVAC',
  'Fabrication',
  'Instrumentation',
  'Insulation'
];

const countryCodes = [
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+971', country: 'UAE' },
  { code: '+49', country: 'Germany' }
];

export default function SubContractorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<FormData>({
    code: '',
    name: '',
    contactFirstName: '',
    contactLastName: '',
    countryCode: '+1',
    phoneNumber: '',
    email: '',
    category: [],
    status: 'Active' // Default to Active
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    // Load data in edit mode
    if (isEditMode && id) {
      // Mock data loading
      setFormData({
        code: 'SC-001',
        name: 'Mechanical Solutions Ltd',
        contactFirstName: 'John',
        contactLastName: 'Smith',
        countryCode: '+1',
        phoneNumber: '5551234567',
        email: 'john.smith@mechanical.com',
        category: ['Mechanical', 'HVAC'],
        status: 'Active'
      });
    }
  }, [isEditMode, id]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => {
      const newCategories = prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category];
      return { ...prev, category: newCategories };
    });
    setIsDirty(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Mandatory fields
    if (!formData.code.trim()) {
      newErrors.code = 'SC Code is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation
    if (formData.phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      const isRepeating = /^(\d)\1{9}$/.test(formData.phoneNumber);
      
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      } else if (isRepeating) {
        newErrors.phoneNumber = 'Phone number cannot have all repeating digits';
      }
    }

    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Mock: Check for duplicate SC Code (only in add mode)
    if (!isEditMode && formData.code === 'SC-001') {
      setErrors({ code: 'SC Code already exists' });
      return;
    }

    // Success
    toast.success('Sub-Contractor saved successfully.', {
      duration: 4000,
      position: 'top-right'
    });
    navigate('/app/general-settings/subcontractor');
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/app/general-settings/subcontractor');
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
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/app/general-settings/subcontractor')}>
          Sub Contractor Master
        </span>
        <span>/</span>
        <span style={{ color: '#272721', fontWeight: '500' }}>
          {isEditMode ? 'Edit Sub Contractor' : 'Add Sub Contractor'}
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
          Sub-Contractor Master
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5F6B7A',
          margin: '0'
        }}>
          {isEditMode ? 'Edit' : 'Add'} subcontractor details and assignments
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
          {/* SC Code */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              SC Code <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Enter SC Code"
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                border: `1px solid ${errors.code ? '#DC2626' : '#D8DEE8'}`,
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#272721',
                outline: 'none',
                cursor: 'text'
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

          {/* Empty space for grid alignment */}
          <div></div>

          {/* Sub-Contractor Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Sub-Contractor Name <span style={{ color: '#FF3B30' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter Sub-Contractor Name"
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

          {/* Contact Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Contact Name
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={formData.contactFirstName}
                onChange={(e) => handleChange('contactFirstName', e.target.value)}
                placeholder="First Name"
                style={{
                  flex: 1,
                  height: '36px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#272721',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                value={formData.contactLastName}
                onChange={(e) => handleChange('contactLastName', e.target.value)}
                placeholder="Last Name"
                style={{
                  flex: 1,
                  height: '36px',
                  padding: '0 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#272721',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Phone Number
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <StandardDropdown
                options={countryCodes.map(cc => ({
                  value: cc.code,
                  label: `${cc.code} (${cc.country})`
                }))}
                value={formData.countryCode}
                onChange={(value) => handleChange('countryCode', value as string)}
                placeholder="Code"
                mode="single"
                style={{ width: '120px' }}
              />
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    handleChange('phoneNumber', value);
                  }
                }}
                placeholder="Enter Phone Number"
                style={{
                  flex: 1,
                  height: '36px',
                  padding: '0 12px',
                  border: `1px solid ${errors.phoneNumber ? '#DC2626' : '#D8DEE8'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#272721',
                  outline: 'none'
                }}
              />
            </div>
            {errors.phoneNumber && (
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                color: '#DC2626'
              }}>
                {errors.phoneNumber}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter Email"
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                border: `1px solid ${errors.email ? '#DC2626' : '#D8DEE8'}`,
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#272721',
                outline: 'none'
              }}
            />
            {errors.email && (
              <span style={{
                display: 'block',
                marginTop: '4px',
                fontSize: '12px',
                color: '#DC2626'
              }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Category */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '6px'
            }}>
              Category
            </label>
            <StandardDropdown
              options={categoryOptions.map(cat => ({
                value: cat,
                label: cat
              }))}
              value={formData.category}
              onChange={(value) => handleChange('category', value)}
              placeholder="Select Categories"
              mode="multi"
            />
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
                onClick={() => navigate('/app/general-settings/subcontractor')}
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
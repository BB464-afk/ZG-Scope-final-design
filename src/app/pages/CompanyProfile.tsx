import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

interface FormData {
  companyName: string;
  registeredAddress: string;
  companyLogo: string | null;
  countryCode: string;
  primaryContactPhone: string;
  country: string;
  regionCity: string;
  primaryContactEmail: string;
  companyURL: string;
}

const countryCodes = [
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+91', country: 'India' },
  { code: '+971', country: 'UAE' },
  { code: '+61', country: 'Australia' },
  { code: '+1', country: 'Canada' },
  { code: '+65', country: 'Singapore' },
  { code: '+81', country: 'Japan' }
];

const countries = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'India',
  'UAE',
  'Australia',
  'Canada',
  'Singapore',
  'Japan'
];

export default function CompanyProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    companyName: 'Zauner Group',
    registeredAddress: 'ZAUNER Anlagentechnik GmbH Mauer 20 / Gewerbepark · 4702 Wallern an der Trattnach',
    companyLogo: 'zs-logo.png',
    countryCode: '+49-Germany',
    primaryContactPhone: '710-0090',
    country: 'Germany',
    regionCity: 'Wallern an der Trattnach',
    primaryContactEmail: 'taylorslauren@hotmail.com',
    companyURL: 'https://www.zaunergroup.com/en'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, companyLogo: file.name }));
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, companyLogo: null }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Mandatory fields
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.primaryContactEmail.trim()) {
      newErrors.primaryContactEmail = 'Primary contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    // Save logic here
    toast.success('Company profile updated successfully');
    navigate('/app');
  };

  const handleCancel = () => {
    toast.info('Changes Discarded', {
      duration: 4000,
      position: 'top-right'
    });
    navigate('/app');
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
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
          {/* Company Name Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Company Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="text"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: `1px solid ${errors.companyName ? '#DC2626' : '#D1D5DB'}`,
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = errors.companyName ? '#DC2626' : '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = errors.companyName ? '#DC2626' : '#D1D5DB'}
            />
            {errors.companyName && (
              <div style={{
                fontSize: '12px',
                color: '#DC2626',
                marginTop: '4px'
              }}>
                {errors.companyName}
              </div>
            )}
          </div>

          {/* Registered Address Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Registered Address
            </label>
            <input 
              type="text"
              placeholder="Enter registered address"
              value={formData.registeredAddress}
              onChange={(e) => handleChange('registeredAddress', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {/* Company Logo Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Company Logo
            </label>
            
            {formData.companyLogo ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #D1D5DB',
                borderRadius: '4px'
              }}>
                <span style={{
                  fontSize: '13px',
                  color: '#374151'
                }}>{formData.companyLogo}</span>
                <button
                  onClick={handleRemoveLogo}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
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
                <Upload size={16} />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Primary Contact Phone Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Primary Contact Phone
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Country Code Dropdown */}
              <StandardDropdown
                options={countryCodes.map((item, index) => ({ 
                  value: `${item.code}-${item.country}`, 
                  label: `${item.code} (${item.country})` 
                }))}
                value={formData.countryCode}
                onChange={(value) => handleChange('countryCode', value as string)}
                placeholder="Code"
                mode="single"
                style={{ width: '180px' }}
              />
              
              {/* Phone Number Input */}
              <input 
                type="text"
                placeholder="Enter phone number"
                value={formData.primaryContactPhone}
                onChange={(e) => handleChange('primaryContactPhone', e.target.value)}
                style={{
                  flex: 1,
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FD4314'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>
          </div>

          {/* Country Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Country
            </label>
            <StandardDropdown
              options={countries.map(country => ({ value: country, label: country }))}
              value={formData.country}
              onChange={(value) => handleChange('country', value as string)}
              placeholder="Select Country"
              mode="single"
            />
          </div>

          {/* Region/City Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Region/City
            </label>
            <input 
              type="text"
              placeholder="Enter region or city"
              value={formData.regionCity}
              onChange={(e) => handleChange('regionCity', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>

          {/* Primary Contact Email Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Primary Contact Email <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input 
              type="email"
              placeholder="Enter email address"
              value={formData.primaryContactEmail}
              onChange={(e) => handleChange('primaryContactEmail', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: `1px solid ${errors.primaryContactEmail ? '#DC2626' : '#D1D5DB'}`,
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = errors.primaryContactEmail ? '#DC2626' : '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = errors.primaryContactEmail ? '#DC2626' : '#D1D5DB'}
            />
            {errors.primaryContactEmail && (
              <div style={{
                fontSize: '12px',
                color: '#DC2626',
                marginTop: '4px'
              }}>
                {errors.primaryContactEmail}
              </div>
            )}
          </div>

          {/* Company URL Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Company URL
            </label>
            <input 
              type="text"
              placeholder="https://www.example.com"
              value={formData.companyURL}
              onChange={(e) => handleChange('companyURL', e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FD4314'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Cancel
          </button>

          {/* Save Button */}
          <button 
            onClick={handleSave}
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            Save
          </button>
        </div>
      </div>

      {/* CSS for dropdown styling */}
      <style>{`
        select option {
          background-color: #FFFFFF !important;
          color: #374151 !important;
          padding: 8px 12px !important;
        }

        select option:hover {
          background-color: #FFF4EF !important;
          color: #FD4314 !important;
        }

        select option:checked,
        select option:focus,
        select option:active {
          background-color: #FFF4EF !important;
          color: #FD4314 !important;
        }
      `}</style>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

interface FormData {
  // Basic Information
  clientCode: string;
  clientName: string;
  companyLegalName: string;
  // Primary Contact
  contactFirstName: string;
  contactLastName: string;
  jobRole: string;
  email: string;
  phone: string;
  // Address
  country: string;
  region: string;
  postalCode: string;
  // Notes
  notes: string;
  status?: string;
}

interface Project {
  id: string;
  projectId: string;
  projectName: string;
  projectStatus: string;
}

const clientTypes = ['General Contractor', 'Developer', 'Owner', 'Consultant', 'Vendor'];
const countries = ['United States', 'United Kingdom', 'India', 'United Arab Emirates', 'Germany'];
const statesByCountry: Record<string, string[]> = {
  'United States': ['California', 'Texas', 'New York', 'Florida'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'India': ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Germany': ['Bavaria', 'Berlin', 'Hamburg', 'Hesse']
};
const citiesByState: Record<string, string[]> = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego'],
  'Texas': ['Houston', 'Dallas', 'Austin'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Dubai': ['Dubai City', 'Deira', 'Bur Dubai']
};

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [activeTab, setActiveTab] = useState<'details' | 'projects'>('details');
  const [formData, setFormData] = useState<FormData>({
    clientCode: '',
    clientName: '',
    companyLegalName: '',
    contactFirstName: '',
    contactLastName: '',
    jobRole: '',
    email: '',
    phone: '',
    country: '',
    region: '',
    postalCode: '',
    notes: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Mock projects data
  const mockProjects: Project[] = [
    { id: '1', projectId: 'PRJ-001', projectName: 'Downtown Plaza Development', projectStatus: 'Active' },
    { id: '2', projectId: 'PRJ-002', projectName: 'Riverside Apartments', projectStatus: 'Completed' },
    { id: '3', projectId: 'PRJ-003', projectName: 'Tech Park Phase 2', projectStatus: 'Active' }
  ];

  useEffect(() => {
    if (isEditMode && id) {
      // Mock data loading
      setFormData({
        clientCode: 'CLT-001',
        clientName: 'ABC Construction Corp',
        companyLegalName: 'ABC Construction Corporation Inc.',
        contactFirstName: 'John',
        contactLastName: 'Williams',
        jobRole: 'Project Director',
        email: 'john.w@abcconstruction.com',
        phone: '+1 555-0101',
        country: 'United States',
        region: 'California',
        postalCode: '90001',
        notes: 'Long-standing client with multiple active projects',
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

    // Basic Information
    if (!formData.clientCode.trim()) newErrors.clientCode = 'This field is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'This field is required';
    if (isEditMode && !formData.status) newErrors.status = 'This field is required';

    // Primary Contact
    if (!formData.contactFirstName.trim()) newErrors.contactFirstName = 'This field is required';
    if (!formData.contactLastName.trim()) newErrors.contactLastName = 'This field is required';
    if (!formData.email.trim()) {
      newErrors.email = 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Address
    if (!formData.country) newErrors.country = 'This field is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        duration: 4000,
        position: 'top-right'
      });
      return;
    }

    toast.success('Client saved successfully', {
      duration: 4000,
      position: 'top-right'
    });
    navigate('/app/general-settings/client');
  };

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      navigate('/app/general-settings/client');
    }
  };

  const availableStates = formData.country ? statesByCountry[formData.country] || [] : [];
  const availableCities = formData.region ? citiesByState[formData.region] || [] : [];

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
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/app/general-settings/client')}>
          Client Master
        </span>
        <span>/</span>
        <span style={{ color: '#272721', fontWeight: '500' }}>
          {isEditMode ? 'Edit Client Details' : 'Add Client Details'}
        </span>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1F2937',
          margin: '0 0 4px 0'
        }}>
          Client Master
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5F6B7A',
          margin: '0'
        }}>
          {isEditMode ? 'Edit' : 'Add'} client details
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #E2E6ED',
        marginBottom: '24px',
        gap: '32px'
      }}>
        <button
          onClick={() => setActiveTab('details')}
          style={{
            padding: '12px 0',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            fontWeight: '500',
            color: activeTab === 'details' ? '#FD4314' : '#5F6B7A',
            cursor: 'pointer',
            borderBottom: activeTab === 'details' ? '2px solid #FD4314' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          Client Details
        </button>
        {isEditMode && (
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '12px 0',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'projects' ? '#FD4314' : '#5F6B7A',
              cursor: 'pointer',
              borderBottom: activeTab === 'projects' ? '2px solid #FD4314' : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Projects
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'details' ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '6px',
          padding: '0',
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          {/* SECTION 1: Basic Information */}
          <div style={{
            backgroundColor: '#F7F9FC',
            padding: '24px 32px',
            borderBottom: '1px solid #C8D9EE'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0'
            }}>
              Basic Information
            </h3>
          </div>
          <div style={{
            padding: '32px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 32px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Client Code <span style={{ color: '#FF3B30' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientCode}
                  onChange={(e) => handleChange('clientCode', e.target.value)}
                  disabled={isEditMode}
                  placeholder="Enter Client Code"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: `1px solid ${errors.clientCode ? '#DC2626' : '#D8DEE8'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isEditMode ? '#F3F4F6' : '#FFFFFF',
                    color: '#272721',
                    outline: 'none',
                    cursor: isEditMode ? 'not-allowed' : 'text'
                  }}
                />
                {errors.clientCode && (
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.clientCode}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Client Name <span style={{ color: '#FF3B30' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  placeholder="Enter Client Name"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: `1px solid ${errors.clientName ? '#DC2626' : '#D8DEE8'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    outline: 'none'
                  }}
                />
                {errors.clientName && (
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.clientName}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Company Legal Name
                </label>
                <input
                  type="text"
                  value={formData.companyLegalName}
                  onChange={(e) => handleChange('companyLegalName', e.target.value)}
                  placeholder="Enter Company Legal Name"
                  style={{
                    width: '100%',
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

              {/* Status - Only shown in Edit Mode */}
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
                    value={formData.status || 'Active'}
                    onChange={(value) => handleChange('status', value as string)}
                    placeholder="Select Status"
                    mode="single"
                    searchable={false}
                  />
                  {errors.status && (
                    <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                      {errors.status}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Primary Contact */}
          <div style={{
            backgroundColor: '#F7F9FC',
            padding: '24px 32px',
            borderBottom: '1px solid #C8D9EE'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0'
            }}>
              Primary Contact
            </h3>
          </div>
          <div style={{
            padding: '32px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 32px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Contact First Name <span style={{ color: '#FF3B30' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactFirstName}
                  onChange={(e) => handleChange('contactFirstName', e.target.value)}
                  placeholder="Enter Contact First Name"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: `1px solid ${errors.contactFirstName ? '#DC2626' : '#D8DEE8'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    outline: 'none'
                  }}
                />
                {errors.contactFirstName && (
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.contactFirstName}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Contact Last Name <span style={{ color: '#FF3B30' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactLastName}
                  onChange={(e) => handleChange('contactLastName', e.target.value)}
                  placeholder="Enter Contact Last Name"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: `1px solid ${errors.contactLastName ? '#DC2626' : '#D8DEE8'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    outline: 'none'
                  }}
                />
                {errors.contactLastName && (
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.contactLastName}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Job Role
                </label>
                <input
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => handleChange('jobRole', e.target.value)}
                  placeholder="Enter Job Role"
                  style={{
                    width: '100%',
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

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Email <span style={{ color: '#FF3B30' }}>*</span>
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
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter Phone"
                  style={{
                    width: '100%',
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
          </div>

          {/* SECTION 3: Address */}
          <div style={{
            backgroundColor: '#F7F9FC',
            padding: '24px 32px',
            borderBottom: '1px solid #C8D9EE'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0'
            }}>
              Address
            </h3>
          </div>
          <div style={{
            padding: '32px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 32px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Country <span style={{ color: '#FF3B30' }}>*</span>
                </label>
                <StandardDropdown
                  options={countries.map(country => ({ value: country, label: country }))}
                  value={formData.country}
                  onChange={(value) => handleChange('country', value as string)}
                  placeholder="Select Country"
                  mode="single"
                  error={errors.country}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  placeholder="Enter Region"
                  style={{
                    width: '100%',
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

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Postal / Zip Code <span style={{ color: '#FF3B30' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="Enter Postal Code"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    border: `1px solid ${errors.postalCode ? '#DC2626' : '#D8DEE8'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    outline: 'none'
                  }}
                />
                {errors.postalCode && (
                  <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.postalCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: Notes */}
          <div style={{
            backgroundColor: '#F7F9FC',
            padding: '24px 32px',
            borderBottom: '1px solid #C8D9EE'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0'
            }}>
              Notes
            </h3>
          </div>
          <div style={{
            padding: '32px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 32px'
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Notes / Remarks
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Enter notes or remarks"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    color: '#272721',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Projects Tab
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#E4EEF8',
                borderBottom: '1px solid #C8D9EE'
              }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>
                  Project ID
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>
                  Project Name
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721' }}>
                  Project Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map((project, index) => (
                <tr
                  key={project.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                    borderBottom: '1px solid #C8D9EE'
                  }}
                >
                  <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721', fontWeight: '600' }}>
                    {project.projectId}
                  </td>
                  <td style={{ padding: '12px 16px', borderRight: '1px solid #C8D9EE', fontSize: '13px', color: '#272721' }}>
                    {project.projectName}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#272721' }}>
                    {project.projectStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        alignItems: 'center'
      }}>
        {activeTab === 'details' && (
          <>
            <button
              onClick={handleBack}
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                height: '36px',
                padding: '0 20px',
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
          </>
        )}
        {activeTab === 'projects' && (
          <button
            onClick={() => navigate('/app/general-settings/client')}
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Close
          </button>
        )}
      </div>

      {/* Discard Modal */}
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
                You have unsaved changes
              </h2>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{
                fontSize: '14px',
                color: '#5F6B7A',
                lineHeight: '1.5',
                margin: 0
              }}>
                Do you want to discard them?
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
                Cancel
              </button>
              <button
                onClick={() => navigate('/app/general-settings/client')}
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [phoneCode, setPhoneCode] = useState('+43');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [workspaceRole, setWorkspaceRole] = useState('Project Manager');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload a PNG or JPG image');
      }
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  const handleBack = () => {
    toast.info('Changes Discarded', {
      duration: 4000,
      position: 'top-right'
    });
    navigate(-1);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#FFFFFF',
      padding: '32px 48px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div>
            {/* Title */}
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 4px 0'
            }}>
              Edit Profile
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0'
            }}>
              Manage My Profile
            </p>
          </div>
        </div>

        {/* Main Profile Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '40px'
          }}>
            {/* SECTION 1 - Profile Photo */}
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 16px 0'
              }}>
                Profile photo
              </h3>

              {/* Avatar Placeholder with Delete/Upload Icon */}
              <div style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  backgroundColor: '#F3F4F6',
                  border: '2px dashed #D1D5DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: profileImage ? 'default' : 'pointer'
                }}
                onClick={() => {
                  if (!profileImage) {
                    document.getElementById('file-upload')?.click();
                  }
                }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6B7280'
                      }}>
                        <Upload size={24} />
                      </div>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        fontWeight: '500'
                      }}>
                        Click to upload
                      </span>
                    </div>
                  )}
                </div>

                {/* Delete Icon - Only shown when image exists */}
                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    title="Remove image"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #FCA5A5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#DC2626',
                      transition: 'all 150ms ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {/* Hidden file input */}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Instructions */}
              <div style={{
                fontSize: '13px',
                color: '#6B7280',
                lineHeight: '1.5'
              }}>
                <div style={{ marginBottom: '4px', fontWeight: '500' }}>Upload your photo</div>
                <div>Your photo should be in PNG or JPG format</div>
              </div>
            </div>

            {/* SECTION 2 - User Details */}
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 20px 0'
              }}>
                User Details
              </h3>

              {/* Two-column grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}>
                {/* System Code (read-only) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    System Code <span style={{ color: '#FD4314' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value="USR-001"
                    readOnly
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Email ID (read-only) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Email ID <span style={{ color: '#FD4314' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value="michael.gainey@zauner.com"
                    readOnly
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Full Name (read-only) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Full Name <span style={{ color: '#FD4314' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value="Michael Gainey"
                    readOnly
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Global Role (read-only) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Global Role <span style={{ color: '#FD4314' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value="Super Administrator"
                    readOnly
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Phone Number (editable) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Phone Number
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <StandardDropdown
                      options={[
                        { value: '+43', label: '+43' },
                        { value: '+49', label: '+49' },
                        { value: '+1', label: '+1' },
                        { value: '+31', label: '+31' },
                        { value: '+44', label: '+44' },
                        { value: '+91', label: '+91' },
                        { value: '+65', label: '+65' },
                        { value: '+971', label: '+971' }
                      ]}
                      value={phoneCode}
                      onChange={(value) => setPhoneCode(value as string)}
                      placeholder="Code"
                      mode="single"
                      style={{ width: '120px' }}
                    />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      style={{
                        flex: 1,
                        height: '40px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        padding: '0 12px',
                        fontSize: '14px',
                        color: '#272721',
                        backgroundColor: '#FFFFFF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#FD4314'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                    />
                  </div>
                </div>

                {/* Status (read-only) */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Status <span style={{ color: '#FD4314' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value="Active"
                    readOnly
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 - Company Info */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C8D9EE',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 20px 0'
          }}>
            Company Info
          </h3>

          {/* Two fields side-by-side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Workspace Role */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Workspace Role
              </label>
              <input
                type="text"
                value={workspaceRole}
                onChange={(e) => setWorkspaceRole(e.target.value)}
                placeholder="Enter workspace role..."
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#272721',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FD4314'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
              />
            </div>

            {/* Company */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Company
              </label>
              <StandardDropdown
                options={[
                  { value: 'Zauner Group', label: 'Zauner Group' },
                  { value: 'Acme Corp', label: 'Acme Corp' },
                  { value: 'Tech Solutions Inc', label: 'Tech Solutions Inc' },
                  { value: 'BuildCo Ltd', label: 'BuildCo Ltd' }
                ]}
                value={company}
                onChange={(value) => setCompany(value as string)}
                placeholder="Select Company"
                mode="single"
              />
            </div>
          </div>

          {/* Department and Additional Notes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {/* Department */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department..."
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#272721',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FD4314'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Additional Notes
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Enter additional notes..."
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#272721',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FD4314'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingBottom: '32px'
        }}>
          <button
            onClick={handleBack}
            style={{
              height: '40px',
              padding: '0 32px',
              border: '1px solid #D8DEE8',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              height: '40px',
              padding: '0 32px',
              border: 'none',
              backgroundColor: '#FD4314',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
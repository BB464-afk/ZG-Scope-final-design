import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Save, X, Edit2, ChevronRight, Upload, Lock } from 'lucide-react';
import { toast } from 'sonner';
import googleLogo from 'figma:asset/02312bd222e09f3da777fcea6a361c8c5c1389e0.png';
import LogoUploadModal from '../components/LogoUploadModal';
import { formatDate } from '../components/EnterpriseTable';

export default function ProjectDetailsSettings() {
  const { projectId } = useParams();

  // Check if project is read-only (On Hold, Completed, or Archived)
  const isProjectReadOnly = projectId === '5';

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoUpload, setShowLogoUpload] = useState(false);

  const [projectData, setProjectData] = useState(
    projectId === '5'
      ? {
          systemId: 'ZG-DC-PRJ-2026-005',
          projectId: 'PRJ-2026-005',
          projectName: 'Water Treatment Facility',
          clientName: 'Emirates Digital Infrastructure LLC',
          country: 'United Arab Emirates',
          city: 'Abu Dhabi',
          timezone: 'GMT+4 (Gulf Standard Time)',
          currency: 'AED - Dirham',
          startDate: '2026-03-01',
          finishDate: '2027-12-31',
          status: 'On Hold',
          additionalNotes: 'Water treatment facility project currently on hold pending regulatory approvals.'
        }
      : {
          systemId: 'ZG-DC-PRJ-2026-0018',
          projectId: 'GC-NOR-001',
          projectName: 'Google Data Center - Norway',
          clientName: 'Google LLC',
          country: 'Norway',
          city: 'Oslo',
          timezone: 'GMT+1 (Central European Time)',
          currency: 'NOK - Norwegian Krone',
          startDate: '2026-01-15',
          finishDate: '2027-09-30',
          status: 'Active',
          additionalNotes: 'Sustainable data center project with focus on renewable energy sources and local infrastructure integration.'
        }
  );

  // Mock data for dropdowns
  const clients = [
    'Google LLC',
    'Microsoft Corporation',
    'Amazon Web Services',
    'Emirates Digital Infrastructure LLC',
    'Abu Dhabi Smart Solutions',
    'Qatar Technology Holdings',
    'Saudi Digital Corp'
  ];

  const countries = [
    'Norway',
    'Sweden',
    'Denmark',
    'Finland',
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Oman',
    'Bahrain'
  ];

  const timezones = [
    'GMT+1 (Central European Time)',
    'GMT+2 (Eastern European Time)',
    'GMT+3 (Moscow Time)',
    'GMT+4 (Gulf Standard Time)',
    'GMT+5 (Pakistan Time)',
    'GMT+8 (Singapore Time)'
  ];

  const currencies = [
    'NOK - Norwegian Krone',
    'SEK - Swedish Krona',
    'DKK - Danish Krone',
    'EUR - Euro',
    'USD - US Dollar',
    'GBP - British Pound',
    'AED - Dirham',
    'SAR - Saudi Riyal',
    'QAR - Qatari Riyal'
  ];

  const statuses = [
    'Draft',
    'Active',
    'Completed',
    'On Hold',
    'Archive'
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Project details updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.info('Changes Discarded', {
      duration: 4000,
      position: 'top-right'
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      toast.success(`Logo "${file.name}" uploaded successfully`);
      setShowLogoUpload(false);
    } else {
      toast.error('Please upload an image file (PNG, JPG, JPEG)');
    }
  };

  // Determine what's editable based on status
  const isTimezoneEditable = projectData.status === 'Draft';
  const isCurrencyEditable = projectData.status === 'Draft';
  const isGenerallyEditable = ['Draft', 'Active'].includes(projectData.status);

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#F7F9FC',
      padding: '32px 48px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with Edit Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 4px 0'
            }}>
              Project Details
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0
            }}>
              View and manage project information
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              title={isProjectReadOnly ? "Only Project Status can be changed for On Hold projects" : ""}
              style={{
                height: '36px',
                padding: '0 20px',
                border: '1px solid #D8DEE8',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#272721',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
        </div>

        {/* Form Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '32px'
        }}>
          {/* Logo Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingBottom: '24px',
            marginBottom: '24px',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid #E5E7EB'
              }}>
                <img src={googleLogo} alt="Client" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {isEditing && isGenerallyEditable && (
                <button
                  onClick={() => setShowLogoUpload(true)}
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #D8DEE8',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={16} style={{ color: '#6B7280' }} />
                </button>
              )}
            </div>
            {isEditing && isGenerallyEditable && (
              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  Click to upload new logo
                </div>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Project ID - Non-editable */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Project ID
              </label>
              <div style={{
                fontSize: '14px',
                color: '#272721',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '6px'
              }}>
                {projectData.projectId}
              </div>
            </div>

            {/* Project Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Project Name <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing && isGenerallyEditable ? (
                <input
                  type="text"
                  value={projectData.projectName}
                  onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                  placeholder="Enter project name"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#272721'
                }}>
                  {projectData.projectName}
                </div>
              )}
            </div>

            {/* Client Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Client <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing && isGenerallyEditable ? (
                <select
                  value={projectData.clientName}
                  onChange={(e) => setProjectData({ ...projectData, clientName: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {clients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#272721'
                }}>
                  {projectData.clientName}
                </div>
              )}
            </div>

            {/* Country */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Country <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing && isGenerallyEditable ? (
                <select
                  value={projectData.country}
                  onChange={(e) => setProjectData({ ...projectData, country: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#272721'
                }}>
                  {projectData.country}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Status <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing ? (
                <select
                  value={projectData.status}
                  onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: projectData.status === 'Active' ? '#2E7D32' : '#6B7280',
                  backgroundColor: projectData.status === 'Active' ? '#E8F5E9' : '#F3F6FA',
                  border: `1px solid ${projectData.status === 'Active' ? '#4CAF50' : '#E5E7EB'}`,
                  borderRadius: '6px'
                }}>
                  {projectData.status}
                </div>
              )}
            </div>

            {/* City / Region */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                City / Region
              </label>
              {isEditing && isGenerallyEditable ? (
                <input
                  type="text"
                  value={projectData.city}
                  onChange={(e) => setProjectData({ ...projectData, city: e.target.value })}
                  placeholder="Enter city or region"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#272721'
                }}>
                  {projectData.city}
                </div>
              )}
            </div>

            {/* Timezone - Locked after Draft */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Timezone <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing && isTimezoneEditable ? (
                <select
                  value={projectData.timezone}
                  onChange={(e) => setProjectData({ ...projectData, timezone: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: isTimezoneEditable ? '#272721' : '#858D9D'
                }}>
                  {projectData.timezone}
                </div>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Start Date <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing && isGenerallyEditable ? (
                <input
                  type="date"
                  value={projectData.startDate}
                  onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#272721'
                }}>
                  {formatDate(projectData.startDate)}
                </div>
              )}
            </div>

            {/* Finish Date */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Finish Date
              </label>
              {isEditing && isGenerallyEditable ? (
                <input
                  type="date"
                  value={projectData.finishDate}
                  onChange={(e) => setProjectData({ ...projectData, finishDate: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  color: '#272721'
                }}>
                  {formatDate(projectData.finishDate)}
                </div>
              )}
            </div>

            {/* Currency - Locked after Draft */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#272721',
                marginBottom: '8px'
              }}>
                Currency <span style={{ color: '#FD4314' }}>*</span>
              </label>
              {isEditing && isCurrencyEditable ? (
                <select
                  value={projectData.currency}
                  onChange={(e) => setProjectData({ ...projectData, currency: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isCurrencyEditable ? '#272721' : '#858D9D'
                  }}>
                    {projectData.currency}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Additional Notes
            </label>
            {isEditing && isGenerallyEditable ? (
              <textarea
                value={projectData.additionalNotes}
                onChange={(e) => setProjectData({ ...projectData, additionalNotes: e.target.value })}
                placeholder="Input any additional notes here..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#272721',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            ) : (
              <div style={{
                minHeight: '100px',
                padding: '12px',
                fontSize: '14px',
                color: '#272721',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '6px'
              }}>
                {projectData.additionalNotes || 'No additional notes'}
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          {isEditing && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #E5E7EB'
            }}>
              <button
                onClick={handleCancel}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#272721',
                  cursor: 'pointer'
                }}
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
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logo Upload Modal */}
      <LogoUploadModal
        isOpen={showLogoUpload}
        onClose={() => setShowLogoUpload(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
}
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronRight, Filter, Settings, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

// Mock Data for User
const USER_DATA = {
  systemCode: 'USR-001',
  fullName: 'John Doe',
  email: 'john.doe@zauner.com',
  globalRole: 'Super Admin',
  department: 'Engineering',
  workspaceRole: 'Head of Planning',
  phoneCode: '+43',
  phoneNumber: '664 1234567',
  company: 'Zaunergroup',
  status: 'Active'
};

// Mock Projects Assigned to User
const USER_PROJECTS = [
  { 
    id: 1, 
    projectId: 'GC-NOR-001', 
    projectName: 'Google Data Center - Norway', 
    projectType: 'Data Center', 
    clientName: 'Google', 
    startDate: '25-07-2025', 
    finishDate: '28-08-2026', 
    projectRole: 'Project Admin',
    status: 'Published' 
  },
  { 
    id: 2, 
    projectId: 'PRJ-005', 
    projectName: 'Microsoft Data Hub - Finland', 
    projectType: 'Data Center', 
    clientName: 'Microsoft', 
    startDate: '17-12-2024', 
    finishDate: '09-08-2025', 
    projectRole: 'Standard User',
    status: 'Archived' 
  },
  { 
    id: 3, 
    projectId: 'PRJ-008', 
    projectName: 'FB Data Center - Germany', 
    projectType: 'Data Center', 
    clientName: 'FB', 
    startDate: '25-03-2023', 
    finishDate: '09-09-2024', 
    projectRole: 'Contributor',
    status: 'Completed' 
  },
];

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile');
  
  // Profile state
  const [fullName, setFullName] = useState(USER_DATA.fullName);
  const [email, setEmail] = useState(USER_DATA.email);
  const [globalRole, setGlobalRole] = useState(USER_DATA.globalRole);
  const [department, setDepartment] = useState(USER_DATA.department);
  const [workspaceRole, setWorkspaceRole] = useState(USER_DATA.workspaceRole);
  const [phoneCode, setPhoneCode] = useState(USER_DATA.phoneCode);
  const [phoneNumber, setPhoneNumber] = useState(USER_DATA.phoneNumber);
  const [company, setCompany] = useState(USER_DATA.company);
  const [status, setStatus] = useState(USER_DATA.status);
  
  // Projects state
  const [projects, setProjects] = useState(USER_PROJECTS);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [tempRole, setTempRole] = useState('');
  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);
  const [projectToRevoke, setProjectToRevoke] = useState<number | null>(null);
  
  // Column search state for Projects tab
  const [projectIdSearch, setProjectIdSearch] = useState('');
  const [projectNameSearch, setProjectNameSearch] = useState('');
  const [projectTypeSearch, setProjectTypeSearch] = useState('');
  const [clientNameSearch, setClientNameSearch] = useState('');
  const [startDateSearch, setStartDateSearch] = useState('');
  const [finishDateSearch, setFinishDateSearch] = useState('');
  const [projectRoleSearch, setProjectRoleSearch] = useState('');
  const [projectStatusSearch, setProjectStatusSearch] = useState('');

  const handleUpdateProfile = () => {
    toast.success('User profile updated successfully');
  };

  const handleCancelProfile = () => {
    // Reset form values
    setFullName(USER_DATA.fullName);
    setEmail(USER_DATA.email);
    setGlobalRole(USER_DATA.globalRole);
    setDepartment(USER_DATA.department);
    setWorkspaceRole(USER_DATA.workspaceRole);
    setPhoneCode(USER_DATA.phoneCode);
    setPhoneNumber(USER_DATA.phoneNumber);
    setCompany(USER_DATA.company);
    setStatus(USER_DATA.status);
    toast.info('Changes Discarded', {
      duration: 4000,
      position: 'top-right'
    });
    navigate('/app/users');
  };

  const handleEditRole = (projectId: number, currentRole: string) => {
    setEditingRole(projectId);
    setTempRole(currentRole);
  };

  const handleSaveRole = (projectId: number) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, projectRole: tempRole } : p
    ));
    setEditingRole(null);
    toast.success('Project role updated successfully');
  };

  const handleCancelEditRole = () => {
    setEditingRole(null);
    setTempRole('');
  };

  const handleInitiateRevoke = (projectId: number) => {
    setProjectToRevoke(projectId);
    setShowRevokeConfirmation(true);
    setEditingRole(null);
  };

  const handleConfirmRevoke = () => {
    if (projectToRevoke !== null) {
      setProjects(projects.map(p => 
        p.id === projectToRevoke ? { ...p, status: 'Access Revoked' } : p
      ));
      toast.success('User access revoked from project successfully');
      setShowRevokeConfirmation(false);
      setProjectToRevoke(null);
    }
  };

  const handleCancelRevoke = () => {
    setShowRevokeConfirmation(false);
    setProjectToRevoke(null);
  };

  const filteredProjects = projects.filter(project =>
    projectIdSearch === '' || project.projectId.toLowerCase().includes(projectIdSearch.toLowerCase()) &&
    projectNameSearch === '' || project.projectName.toLowerCase().includes(projectNameSearch.toLowerCase()) &&
    projectTypeSearch === '' || project.projectType.toLowerCase().includes(projectTypeSearch.toLowerCase()) &&
    clientNameSearch === '' || project.clientName.toLowerCase().includes(clientNameSearch.toLowerCase()) &&
    startDateSearch === '' || project.startDate.toLowerCase().includes(startDateSearch.toLowerCase()) &&
    finishDateSearch === '' || project.finishDate.toLowerCase().includes(finishDateSearch.toLowerCase()) &&
    projectRoleSearch === '' || project.projectRole.toLowerCase().includes(projectRoleSearch.toLowerCase()) &&
    projectStatusSearch === '' || project.status.toLowerCase().includes(projectStatusSearch.toLowerCase())
  );

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 64px)',
      backgroundColor: '#F7F9FC',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 32px',
        fontSize: '13px',
        color: '#6B7280',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E6ED'
      }}>
        <span 
          className="cursor-pointer hover:text-[#1F2937]"
          onClick={() => navigate('/app/users')}
        >
          User Management
        </span>
        <ChevronRight size={14} />
        <span style={{ fontWeight: '500', color: '#1F2937' }}>User Details</span>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E6ED',
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '16px 0',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'profile' ? '#272721' : '#6B7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid #FD4314' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'profile') {
                e.currentTarget.style.color = '#272721';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'profile') {
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '16px 0',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'projects' ? '#272721' : '#6B7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'projects' ? '2px solid #FD4314' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'projects') {
                e.currentTarget.style.color = '#272721';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'projects') {
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '32px'
      }}>
        {activeTab === 'profile' ? (
          /* PROFILE TAB */
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E6ED',
            borderRadius: '8px',
            padding: '32px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '24px'
            }}>
              {/* System Code */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  System Code<span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={USER_DATA.systemCode}
                  readOnly
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    backgroundColor: '#F9FAFB',
                    color: '#6B7280',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Full Name<span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={USER_DATA.fullName}
                  readOnly
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    backgroundColor: '#F9FAFB',
                    color: '#6B7280',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email<span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="email"
                  value={USER_DATA.email}
                  readOnly
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    backgroundColor: '#F9FAFB',
                    color: '#6B7280',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Global Role */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Global Role
                </label>
                <input
                  type="text"
                  value={globalRole}
                  readOnly
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    backgroundColor: '#F9FAFB',
                    color: '#6B7280',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Department */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Workspace Role */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Workspace Role
                </label>
                <input
                  type="text"
                  value={workspaceRole}
                  onChange={(e) => setWorkspaceRole(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
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
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter Phone Number"
                    style={{
                      flex: 1,
                      height: '40px',
                      padding: '0 12px',
                      fontSize: '14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Company
                </label>
                <StandardDropdown
                  options={[
                    { value: 'Zaunergroup', label: 'Zauner Group' },
                    { value: 'External Partner', label: 'External Partner' },
                    { value: 'Client Co', label: 'Client Co' },
                    { value: 'BuildRight Inc', label: 'BuildRight Inc' }
                  ]}
                  value={company}
                  onChange={(value) => setCompany(value as string)}
                  mode="single"
                />
              </div>

              {/* Status */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Status
                </label>
                <StandardDropdown
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' }
                  ]}
                  value={status}
                  onChange={(value) => setStatus(value as string)}
                  mode="single"
                  searchable={false}
                />
              </div>
            </div>

            {/* Action Buttons */}
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
                onClick={handleCancelProfile}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>

              {/* Save Button */}
              <button
                onClick={handleUpdateProfile}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  backgroundColor: '#FD4314',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          /* PROJECTS TAB */
          <div>
            {/* Projects Table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #C8D9EE',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              {/* Scrollable Wrapper */}
              <div style={{
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 320px)'
              }}>
                <div style={{ minWidth: '1240px', display: 'flex', flexDirection: 'column' }}>
                  {/* Table Header */}
                  <div style={{
                    backgroundColor: '#E4EEF8',
                    display: 'grid',
                    gridTemplateColumns: '140px 240px 180px 130px 130px 150px 140px 150px',
                    alignItems: 'center',
                    height: '40px',
                    borderBottom: '1px solid #C8D9EE',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    <div style={{ paddingLeft: '16px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Project ID</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Project Name</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Client Name</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Start Date</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Finish Date</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Project Role</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Status</div>
                    <div style={{ paddingLeft: '12px', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Actions</div>
                  </div>

                  {/* Column Filter Row */}
                  <div style={{
                    backgroundColor: '#FAFBFC',
                    display: 'grid',
                    gridTemplateColumns: '140px 240px 180px 130px 130px 150px 140px 150px',
                    borderBottom: '1px solid #C8D9EE',
                    position: 'sticky',
                    top: '40px',
                    zIndex: 9
                  }}>
                    {/* Project ID Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={projectIdSearch}
                        onChange={(e) => setProjectIdSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>

                    {/* Project Name Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={projectNameSearch}
                        onChange={(e) => setProjectNameSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>

                    {/* Client Name Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={clientNameSearch}
                        onChange={(e) => setClientNameSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>

                    {/* Start Date Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={startDateSearch}
                        onChange={(e) => setStartDateSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>

                    {/* Finish Date Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={finishDateSearch}
                        onChange={(e) => setFinishDateSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>

                    {/* Project Role Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={projectRoleSearch}
                        onChange={(e) => setProjectRoleSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>

                    {/* Status Filter */}
                    <div style={{
                      height: '40px',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={projectStatusSearch}
                        onChange={(e) => setProjectStatusSearch(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '28px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '3px',
                          padding: '0 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div style={{ flex: 1 }}>
                    {filteredProjects.length === 0 ? (
                      <div style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9CA3AF',
                        fontSize: '14px'
                      }}>
                        No projects found
                      </div>
                    ) : (
                      filteredProjects.map((project, index) => (
                        <div
                          key={project.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '140px 240px 180px 130px 130px 150px 140px 150px',
                            alignItems: 'center',
                            height: '52px',
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                            borderBottom: '1px solid #E2E6ED',
                            fontSize: '13px',
                            transition: 'background-color 150ms ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD'}
                        >
                          <div style={{
                            paddingLeft: '16px',
                            fontFamily: 'monospace',
                            color: '#6B7280'
                          }}>
                            {project.projectId}
                          </div>
                          <div style={{
                            paddingLeft: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#272721',
                            fontWeight: '500'
                          }}>
                            {project.projectName}
                          </div>
                          <div style={{
                            paddingLeft: '12px',
                            color: '#6B7280'
                          }}>
                            {project.clientName}
                          </div>
                          <div style={{
                            paddingLeft: '12px',
                            color: '#6B7280',
                            fontSize: '12px'
                          }}>
                            {project.startDate}
                          </div>
                          <div style={{
                            paddingLeft: '12px',
                            color: '#6B7280',
                            fontSize: '12px'
                          }}>
                            {project.finishDate}
                          </div>
                          <div style={{
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#272721'
                          }}>
                            {project.projectRole}
                          </div>
                          <div style={{ paddingLeft: '12px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '11px',
                              fontWeight: '500',
                              whiteSpace: 'nowrap',
                              backgroundColor: 
                                project.status === 'Published' ? '#FD4314' : 
                                project.status === 'Completed' ? '#10B981' : 
                                project.status === 'Archived' ? '#6B7280' : 
                                project.status === 'Access Revoked' ? '#DC2626' : '#6B7280',
                              color: '#FFFFFF'
                            }}>
                              {project.status}
                            </span>
                          </div>
                          <div style={{
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <button
                              onClick={() => handleEditRole(project.id, project.projectRole)}
                              style={{
                                height: '32px',
                                padding: '0 12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#FD4314',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #FD4314',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFF3EE';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFFFFF';
                              }}
                            >
                              Update User Role
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Project Role Modal */}
      {editingRole !== null && (
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
        }}
        onClick={handleCancelEditRole}
        >
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            width: '480px',
            maxWidth: '90vw',
            border: '1px solid #E2E6ED',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Update Project Role
              </h3>
              <button
                onClick={handleCancelEditRole}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <label style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Select New Project Role<span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <button
                    onClick={() => handleInitiateRevoke(editingRole)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '0',
                      textDecoration: 'underline'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#B91C1C'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#DC2626'}
                  >
                    Revoke Access
                  </button>
                </div>
                <StandardDropdown
                  options={[
                    { value: 'Project Admin', label: 'Project Admin' },
                    { value: 'Standard User', label: 'Standard User' },
                    { value: 'Contributor', label: 'Contributor' },
                    { value: 'Viewer', label: 'Viewer' }
                  ]}
                  value={tempRole}
                  onChange={(value) => setTempRole(value as string)}
                  mode="single"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={handleCancelEditRole}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveRole(editingRole)}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  backgroundColor: '#FD4314',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Access Confirmation Modal */}
      {showRevokeConfirmation && (
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
          zIndex: 1001
        }}
        onClick={handleCancelRevoke}
        >
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            width: '480px',
            maxWidth: '90vw',
            border: '1px solid #E2E6ED',
            overflow: 'visible'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#272721',
                margin: 0
              }}>
                Revoke Project Access
              </h3>
              <button
                onClick={handleCancelRevoke}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <p style={{
                fontSize: '14px',
                color: '#5F6B7A',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                Are you sure you want to revoke access for this user from the project?
              </p>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '4px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: '#DC2626',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  <strong>Note:</strong> This action will remove their permissions immediately.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={handleCancelRevoke}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                style={{
                  height: '40px',
                  padding: '0 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
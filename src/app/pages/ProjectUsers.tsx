import React, { useState } from 'react';
import { useParams } from 'react-router';
import { UserPlus, Search, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';
import AddUserModal from '../components/AddUserModal';

interface ProjectUser {
  id: string;
  code: string;
  name: string;
  baseRole: string;
  email: string;
  department: string;
  company: string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Access Revoked';
}

interface SystemUser {
  id: string;
  code: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: 'Active' | 'Inactive';
  projectRole?: 'Viewer' | 'Contributor' | 'Standard User' | 'Project Admin';
}

export default function ProjectUsers() {
  const { projectId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState<ProjectUser | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [selectedSystemUsers, setSelectedSystemUsers] = useState<Set<string>>(new Set());
  const [systemUsersRoles, setSystemUsersRoles] = useState<Map<string, 'Viewer' | 'Contributor' | 'Standard User' | 'Project Admin'>>(new Map());
  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<ProjectUser | null>(null);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  
  // Add User Modal State
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<string>('');
  const [selectedRoleForNewUser, setSelectedRoleForNewUser] = useState<'Project Admin' | 'Standard User' | 'Contributor' | 'Viewer'>('Viewer');

  // Search state for filters
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [lastLoginSearch, setLastLoginSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock project users data
  const mockProjectUsers: ProjectUser[] = [
    {
      id: '1',
      code: 'USR001',
      name: 'John Smith',
      baseRole: 'Project Admin',
      email: 'john.smith@construction.com',
      department: 'Project Management',
      company: 'ABC Construction Ltd',
      lastLogin: '04/03/2024',
      status: 'Active'
    },
    {
      id: '2',
      code: 'USR002',
      name: 'Sarah Johnson',
      baseRole: 'Contributor',
      email: 'sarah.j@construction.com',
      department: 'Engineering',
      company: 'ABC Construction Ltd',
      lastLogin: '03/03/2024',
      status: 'Active'
    },
    {
      id: '3',
      code: 'USR003',
      name: 'Mike Chen',
      baseRole: 'Viewer',
      email: 'mike.chen@subcontractor.com',
      department: 'Construction',
      company: 'BuildTech Solutions',
      lastLogin: '01/03/2024',
      status: 'Active'
    },
    {
      id: '4',
      code: 'USR004',
      name: 'Emma Wilson',
      baseRole: 'Contributor',
      email: 'emma.w@construction.com',
      department: 'Quality Control',
      company: 'ABC Construction Ltd',
      lastLogin: '28/02/2024',
      status: 'Active'
    },
    {
      id: '5',
      code: 'USR005',
      name: 'David Brown',
      baseRole: 'Standard User',
      email: 'david.b@construction.com',
      department: 'Engineering',
      company: 'ABC Construction Ltd',
      lastLogin: '25/02/2024',
      status: 'Active'
    },
    {
      id: '6',
      code: 'USR006',
      name: 'Lisa Anderson',
      baseRole: 'Viewer',
      email: 'lisa.a@consultant.com',
      department: 'Consulting',
      company: 'Engineering Consultants',
      lastLogin: '20/02/2024',
      status: 'Inactive'
    }
  ];

  // Mock system users (available to add)
  const mockSystemUsers: SystemUser[] = [
    {
      id: '7',
      code: 'USR007',
      name: 'Robert Taylor',
      email: 'robert.t@subcontractor.com',
      company: 'BuildTech Solutions',
      role: 'Site Supervisor',
      status: 'Active',
      projectRole: 'Viewer'
    },
    {
      id: '8',
      code: 'USR008',
      name: 'Jennifer Lee',
      email: 'jennifer.l@construction.com',
      company: 'ABC Construction Ltd',
      role: 'Architect',
      status: 'Active',
      projectRole: 'Viewer'
    }
  ];

  // Initialize projectUsers with mock data
  React.useEffect(() => {
    if (projectUsers.length === 0) {
      setProjectUsers(mockProjectUsers);
    }
  }, []);

  // Apply filters
  const filteredProjectUsers = projectUsers
    .filter(user => user.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(user => user.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(user => user.baseRole.toLowerCase().includes(roleSearch.toLowerCase()))
    .filter(user => user.email.toLowerCase().includes(emailSearch.toLowerCase()))
    .filter(user => user.department.toLowerCase().includes(departmentSearch.toLowerCase()))
    .filter(user => user.company.toLowerCase().includes(companySearch.toLowerCase()))
    .filter(user => user.lastLogin.includes(lastLoginSearch))
    .filter(user => user.status.toLowerCase().includes(statusSearch.toLowerCase()));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjectUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectSystemUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedSystemUsers);
    if (checked) {
      newSelected.add(userId);
      // Set default role to Viewer if not already set
      if (!systemUsersRoles.has(userId)) {
        const newRoles = new Map(systemUsersRoles);
        newRoles.set(userId, 'Viewer');
        setSystemUsersRoles(newRoles);
      }
    } else {
      newSelected.delete(userId);
    }
    setSelectedSystemUsers(newSelected);
  };

  const handleRoleChange = (userId: string, role: 'Viewer' | 'Contributor' | 'Standard User' | 'Project Admin') => {
    const newRoles = new Map(systemUsersRoles);
    newRoles.set(userId, role);
    setSystemUsersRoles(newRoles);
  };

  const handleAddUsers = () => {
    if (!selectedUserToAdd) {
      toast.error('Please select a user');
      return;
    }
    const selectedUser = mockSystemUsers.find(u => u.id === selectedUserToAdd);
    if (selectedUser) {
      toast.success(`${selectedUser.name} added to project as ${selectedRoleForNewUser}`);
    }
    setShowAddModal(false);
    setSelectedUserToAdd('');
    setSelectedRoleForNewUser('Viewer');
  };

  const handleBulkStatusChange = (status: 'Active' | 'Inactive') => {
    if (selectedUsers.size === 0) {
      toast.error('Please select at least one user');
      return;
    }
    toast.success(`${selectedUsers.size} user(s) marked as ${status}`);
    setSelectedUsers(new Set());
  };

  const handleOpenUpdateRole = (user: ProjectUser) => {
    setSelectedUserForUpdate(user);
    setNewRole(user.baseRole);
    setShowUpdateRoleModal(true);
  };

  const handleUpdateRole = () => {
    if (selectedUserForUpdate && newRole) {
      setProjectUsers(projectUsers.map(u => 
        u.id === selectedUserForUpdate.id ? { ...u, baseRole: newRole } : u
      ));
      toast.success(`Role updated for ${selectedUserForUpdate.name}`);
      setShowUpdateRoleModal(false);
      setSelectedUserForUpdate(null);
      setNewRole('');
    }
  };

  const handleInitiateRevoke = () => {
    if (selectedUserForUpdate) {
      setUserToRevoke(selectedUserForUpdate);
      setShowRevokeConfirmation(true);
      setShowUpdateRoleModal(false);
    }
  };

  const handleConfirmRevokeAccess = () => {
    if (userToRevoke) {
      setProjectUsers(projectUsers.map(u => 
        u.id === userToRevoke.id ? { ...u, status: 'Access Revoked' } : u
      ));
      toast.success(`Access revoked for ${userToRevoke.name}`);
      setShowRevokeConfirmation(false);
      setUserToRevoke(null);
    }
  };

  const handleCancelRevokeAccess = () => {
    setShowRevokeConfirmation(false);
    setUserToRevoke(null);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            margin: '0 0 4px 0'
          }}>
            Project Users
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage users in the project
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: 'none',
            backgroundColor: '#FD4314',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
        >
          <UserPlus size={16} />
          Add User to Project
        </button>
      </div>

      {/* Table Container */}
      {/* NOTE: AG Grid will be implemented here, so the look and feel of the table might differ during development */}
      <div style={{
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '4px',
        padding: '8px 12px',
        marginBottom: '12px',
        fontSize: '12px',
        color: '#6B7280'
      }}>
        Note: AG Grid will be implemented here, so the look and feel of the table might differ during development.
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
          {/* Table Headers */}
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '100px'
              }}>
                User Code
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '180px'
              }}>
                Full Name
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '140px'
              }}>
                Project Role
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '200px'
              }}>
                Email
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '140px'
              }}>
                Department
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '180px'
              }}>
                Company
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '120px'
              }}>
                Last Login
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '100px'
              }}>
                Status
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#272721',
                width: '100px'
              }}>
                Actions
              </th>
            </tr>

            {/* Search Row */}
            <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #C8D9EE' }}>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Code"
                    value={codeSearch}
                    onChange={(e) => setCodeSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Role"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Email"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Dept"
                    value={departmentSearch}
                    onChange={(e) => setDepartmentSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Company"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Date"
                    value={lastLoginSearch}
                    onChange={(e) => setLastLoginSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="text"
                    placeholder="Search Status"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '3px',
                      padding: '0 8px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <Filter size={14} style={{ color: '#6B7280', flexShrink: 0, cursor: 'pointer' }} />
                </div>
              </td>
              <td style={{ padding: '8px' }}></td>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={9} style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '14px'
                }}>
                  No users found.
                </td>
              </tr>
            ) : (
              currentItems.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                    borderBottom: '1px solid #E2E6ED',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF4EF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)';
                  }}
                >
                  <td style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#272721',
                    fontWeight: '500'
                  }}>
                    {user.code}
                  </td>
                  <td style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#272721'
                  }}>
                    {user.name}
                  </td>
                  <td style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#272721'
                  }}>
                    {user.baseRole}
                  </td>
                  <td style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#272721'
                  }}>
                    {user.email}
                  </td>
                  <td style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#272721'
                  }}>
                    {user.department}
                  </td>
                  <td style={{
                    padding: '12px',
                    fontSize: '13px',
                    color: '#272721'
                  }}>
                    {user.company}
                  </td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#6B7280'
                  }}>
                    {user.lastLogin}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      backgroundColor: 
                        user.status === 'Active' ? '#D1FAE5' : 
                        user.status === 'Access Revoked' ? '#FEE2E2' : '#FEE2E2',
                      color: 
                        user.status === 'Active' ? '#065F46' : 
                        user.status === 'Access Revoked' ? '#991B1B' : '#991B1B'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <button
                      onClick={() => handleOpenUpdateRole(user)}
                      style={{
                        height: '32px',
                        padding: '0 12px',
                        border: '1px solid #FD4314',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#FD4314',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEF2F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer with Record Count and Pagination */}
        <div style={{
          height: '44px',
          backgroundColor: '#FAFBFC',
          borderTop: '1px solid #C8D9EE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontSize: '13px',
          color: '#5F6B7A'
        }}>
          <div>
            Total Records: {filteredProjectUsers.length}
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '4px 12px',
                border: '1px solid #D1D5DB',
                backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                color: currentPage === 1 ? '#9CA3AF' : '#374151'
              }}
            >
              Previous
            </button>
            <span>Page {currentPage} of {Math.ceil(filteredProjectUsers.length / itemsPerPage) || 1}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProjectUsers.length / itemsPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredProjectUsers.length / itemsPerPage)}
              style={{
                padding: '4px 12px',
                border: '1px solid #D1D5DB',
                backgroundColor: currentPage >= Math.ceil(filteredProjectUsers.length / itemsPerPage) ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: currentPage >= Math.ceil(filteredProjectUsers.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                color: currentPage >= Math.ceil(filteredProjectUsers.length / itemsPerPage) ? '#9CA3AF' : '#374151'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddUsers}
        systemUsers={mockSystemUsers}
        selectedUserId={selectedUserToAdd}
        selectedRole={selectedRoleForNewUser}
        onUserChange={setSelectedUserToAdd}
        onRoleChange={setSelectedRoleForNewUser}
      />

      {/* Update Role Modal */}
      {showUpdateRoleModal && selectedUserForUpdate && (
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
          onClick={() => setShowUpdateRoleModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Update User Role
              </h2>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '24px'
            }}>
              {/* Role Dropdown with Revoke Access on Right */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Select New Role
                  </label>
                  <button
                    onClick={handleInitiateRevoke}
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
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Contributor">Contributor</option>
                  <option value="Standard User">Standard User</option>
                  <option value="Project Admin">Project Admin</option>
                </select>
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
                onClick={() => setShowUpdateRoleModal(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
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
                onClick={handleUpdateRole}
                style={{
                  height: '36px',
                  padding: '0 16px',
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
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Access Confirmation Modal */}
      {showRevokeConfirmation && userToRevoke && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleCancelRevokeAccess}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 12px 0'
            }}>
              Confirm Revoke Access
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0'
            }}>
              Are you sure you want to revoke access for <strong>{userToRevoke.name}</strong>? This user will no longer be able to access this project.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={handleCancelRevokeAccess}
                style={{
                  height: '36px',
                  padding: '0 16px',
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
                onClick={handleConfirmRevokeAccess}
                style={{
                  height: '36px',
                  padding: '0 16px',
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
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
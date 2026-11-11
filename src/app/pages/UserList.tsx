import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserPlus, FolderPlus, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import StandardDropdown from '../components/StandardDropdown';

// Mock Data
const MOCK_USERS = [
  { id: 1, code: 'USR-001', fullName: 'John Doe', email: 'john.doe@zauner.com', globalRole: 'Super Admin', projectsAssigned: 8, department: 'Engineering', company: 'Zaunergroup', lastLogin: '04/03/2026', status: 'Active' },
  { id: 2, code: 'USR-002', fullName: 'Jane Smith', email: 'jane.smith@zauner.com', globalRole: 'Normal User', projectsAssigned: 5, department: 'Project Management', company: 'Zaunergroup', lastLogin: '03/03/2026', status: 'Active' },
  { id: 3, code: 'USR-003', fullName: 'Michael Brown', email: 'm.brown@partner.com', globalRole: 'Normal User', projectsAssigned: 3, department: 'Construction', company: 'External Partner', lastLogin: '01/03/2026', status: 'Active' },
  { id: 4, code: 'USR-004', fullName: 'Sarah Wilson', email: 's.wilson@client.com', globalRole: 'Normal User', projectsAssigned: 2, department: 'Quality Control', company: 'Client Co', lastLogin: '28/02/2026', status: 'Active' },
  { id: 5, code: 'USR-005', fullName: 'Robert Johnson', email: 'r.johnson@zauner.com', globalRole: 'Normal User', projectsAssigned: 6, department: 'Engineering', company: 'Zaunergroup', lastLogin: '15/02/2026', status: 'Inactive' },
  { id: 6, code: 'USR-006', fullName: 'Emily Davis', email: 'e.davis@zauner.com', globalRole: 'Super Admin', projectsAssigned: 12, department: 'IT', company: 'Zaunergroup', lastLogin: '04/03/2026', status: 'Active' },
  { id: 7, code: 'USR-007', fullName: 'David Miller', email: 'd.miller@zauner.com', globalRole: 'Normal User', projectsAssigned: 4, department: 'Finance', company: 'Zaunergroup', lastLogin: '02/03/2026', status: 'Active' },
  { id: 8, code: 'USR-008', fullName: 'Lisa Taylor', email: 'l.taylor@audit.com', globalRole: 'Normal User', projectsAssigned: 1, department: 'Audit', company: 'Audit Firm', lastLogin: '29/02/2026', status: 'Active' },
  { id: 9, code: 'USR-009', fullName: 'Thomas Anderson', email: 't.anderson@zauner.com', globalRole: 'Normal User', projectsAssigned: 7, department: 'Engineering', company: 'Zaunergroup', lastLogin: '03/03/2026', status: 'Active' },
  { id: 10, code: 'USR-010', fullName: 'Jessica Martinez', email: 'j.martinez@contractor.com', globalRole: 'Normal User', projectsAssigned: 2, department: 'Construction', company: 'BuildRight Inc', lastLogin: '27/02/2026', status: 'Active' },
  { id: 11, code: 'USR-011', fullName: 'Daniel White', email: 'd.white@gov.at', globalRole: 'Normal User', projectsAssigned: 1, department: 'Compliance', company: 'Government Body', lastLogin: '10/02/2026', status: 'Inactive' },
  { id: 12, code: 'USR-012', fullName: 'Jennifer Garcia', email: 'j.garcia@zauner.com', globalRole: 'Super Admin', projectsAssigned: 10, department: 'Operations', company: 'Zaunergroup', lastLogin: '04/03/2026', status: 'Active' },
  { id: 13, code: 'USR-013', fullName: 'James Wilson', email: 'j.wilson@zauner.com', globalRole: 'Normal User', projectsAssigned: 5, department: 'Engineering', company: 'Zaunergroup', lastLogin: '03/03/2026', status: 'Active' },
  { id: 14, code: 'USR-014', fullName: 'Maria Rodriguez', email: 'm.rodriguez@zauner.com', globalRole: 'Normal User', projectsAssigned: 4, department: 'Project Management', company: 'Zaunergroup', lastLogin: '02/03/2026', status: 'Active' },
  { id: 15, code: 'USR-015', fullName: 'Robert Smith', email: 'r.smith@supplier.com', globalRole: 'Normal User', projectsAssigned: 2, department: 'Procurement', company: 'Steel Suppliers Ltd', lastLogin: '25/02/2026', status: 'Active' },
];

// Mock Projects Data
const MOCK_PROJECTS = [
  { id: 9, code: 'PRJ-2025-076', name: 'Google Data Center – Norway' },
  { id: 1, code: 'PRJ-2026-001', name: 'North Terminal Expansion' },
  { id: 2, code: 'PRJ-2026-002', name: 'Offshore Platform Alpha' },
  { id: 3, code: 'PRJ-2026-003', name: 'Highway Infrastructure Upgrade' },
  { id: 4, code: 'PRJ-2026-004', name: 'Residential Complex Phase 2' },
  { id: 5, code: 'PRJ-2026-005', name: 'Water Treatment Facility' },
  { id: 6, code: 'PRJ-2026-006', name: 'Data Center Construction' },
  { id: 7, code: 'PRJ-2026-007', name: 'Bridge Restoration Project' },
  { id: 8, code: 'PRJ-2025-089', name: 'Metro Line Extension' },
  { id: 10, code: 'PRJ-2026-010', name: 'Smart City Initiative' },
  { id: 11, code: 'PRJ-2026-011', name: 'Solar Farm Development' },
  { id: 12, code: 'PRJ-2026-012', name: 'Hospital Renovation Phase 1' },
  { id: 13, code: 'PRJ-2026-013', name: 'Airport Terminal Modernization' },
  { id: 14, code: 'PRJ-2026-014', name: 'University Campus Expansion' },
];

export default function UserList() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | ''>('');
  
  // Assign Project Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedProjectRole, setSelectedProjectRole] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  
  // Validation errors
  const [userError, setUserError] = useState('');
  const [projectError, setProjectError] = useState('');
  const [roleError, setRoleError] = useState('');
  
  // Column search state
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [projectsSearch, setProjectsSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [lastLoginSearch, setLastLoginSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Apply filters
  const filteredData = MOCK_USERS
    .filter(u => u.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(u => u.fullName.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(u => u.email.toLowerCase().includes(emailSearch.toLowerCase()))
    .filter(u => u.globalRole.toLowerCase().includes(roleSearch.toLowerCase()))
    .filter(u => u.projectsAssigned.toString().includes(projectsSearch))
    .filter(u => u.department.toLowerCase().includes(departmentSearch.toLowerCase()))
    .filter(u => u.company.toLowerCase().includes(companySearch.toLowerCase()))
    .filter(u => u.lastLogin.includes(lastLoginSearch))
    .filter(u => u.status.toLowerCase().includes(statusSearch.toLowerCase()));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length && filteredData.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(u => u.id)));
    }
  };

  const handleRowSelect = (rowId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleMarkActive = () => {
    if (selectedRows.size > 0) {
      setBulkAction('activate');
      setShowConfirmModal(true);
    }
  };

  const handleMarkInactive = () => {
    if (selectedRows.size > 0) {
      setBulkAction('deactivate');
      setShowConfirmModal(true);
    }
  };

  const confirmBulkAction = () => {
    if (bulkAction === 'activate') {
      toast.success(`${selectedRows.size} user(s) activated successfully`);
    } else if (bulkAction === 'deactivate') {
      toast.success(`${selectedRows.size} user(s) deactivated successfully`);
    }
    setShowConfirmModal(false);
    setSelectedRows(new Set());
    setBulkAction('');
  };

  const handleAssignProject = () => {
    // Reset errors
    setUserError('');
    setProjectError('');
    setRoleError('');

    // Validation
    let hasError = false;
    if (!selectedUser) {
      setUserError('Please select a user');
      hasError = true;
    }
    if (!selectedProject) {
      setProjectError('Please select a project');
      hasError = true;
    }
    if (!selectedProjectRole) {
      setRoleError('Please select a project role');
      hasError = true;
    }

    if (hasError) return;

    // Success
    const user = MOCK_USERS.find(u => u.id.toString() === selectedUser);
    const project = MOCK_PROJECTS.find(p => p.id.toString() === selectedProject);
    toast.success(`${user?.fullName} assigned to ${project?.name} as ${selectedProjectRole}`);
    
    // Reset and close
    setSelectedUser('');
    setSelectedProject('');
    setSelectedProjectRole('');
    setShowAssignModal(false);
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
            User Management
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0'
          }}>
            Manage system-wide users
          </p>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Bulk Actions */}
          <button 
            onClick={handleMarkActive}
            disabled={selectedRows.size === 0}
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1px solid #10B981',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: selectedRows.size === 0 ? '#9CA3AF' : '#10B981',
              cursor: selectedRows.size === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedRows.size === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedRows.size > 0) {
                e.currentTarget.style.backgroundColor = '#F0FDF4';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Mark Active
          </button>
          <button 
            onClick={handleMarkInactive}
            disabled={selectedRows.size === 0}
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1px solid #EF4444',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: selectedRows.size === 0 ? '#9CA3AF' : '#EF4444',
              cursor: selectedRows.size === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedRows.size === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedRows.size > 0) {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Mark Inactive
          </button>
        </div>
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1500px' }}>
          {/* Table Headers */}
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#272721',
                width: '40px'
              }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#FD4314'
                  }}
                />
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '100px' }}>Code</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '150px' }}>Full Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '200px' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '120px' }}>Global Role</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '80px' }}>Projects Assigned</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '140px' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', width: '150px' }}>Company</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '100px' }}>Last Login</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '80px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '140px' }}>Action</th>
            </tr>

            {/* Search Row */}
            <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #C8D9EE' }}>
              <td style={{ padding: '8px' }}></td>
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
                    placeholder="Search"
                    value={projectsSearch}
                    onChange={(e) => setProjectsSearch(e.target.value)}
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
                <td colSpan={10} style={{
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
                  onClick={() => navigate(`/app/users/${user.id}`)}
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
                  <td 
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: '12px', textAlign: 'center' }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(user.id)}
                      onChange={(e) => handleRowSelect(user.id, e)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        accentColor: '#FD4314'
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#272721', fontWeight: '500' }}>{user.code}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#272721' }}>{user.fullName}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>{user.email}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#272721' }}>{user.globalRole}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>{user.projectsAssigned}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>{user.department}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>{user.company}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>{user.lastLogin}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.status === 'Active' ? '#E8F5E9' : '#F3F4F6',
                      color: user.status === 'Active' ? '#2E7D32' : '#6B7280'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td 
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: '12px', textAlign: 'center' }}
                  >
                    {user.globalRole !== 'Super Admin' && (
                      <button
                        onClick={() => {
                          setSelectedUser(user.id.toString());
                          setShowAssignModal(true);
                        }}
                        style={{
                          height: '28px',
                          padding: '0 10px',
                          border: '1px solid #FD4314',
                          backgroundColor: '#FFFFFF',
                          color: '#FD4314',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFF3EE';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        <FolderPlus size={13} />
                        Assign Project
                      </button>
                    )}
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
            Total Records: {filteredData.length}
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
            <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage) || 1}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredData.length / itemsPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
              style={{
                padding: '4px 12px',
                border: '1px solid #D1D5DB',
                backgroundColor: currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? '#F3F4F6' : '#FFFFFF',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                color: currentPage >= Math.ceil(filteredData.length / itemsPerPage) ? '#9CA3AF' : '#374151'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
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
          onClick={() => setShowConfirmModal(false)}
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
              color: '#272721',
              margin: '0 0 12px 0'
            }}>
              Confirm Action
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0'
            }}>
              Are you sure you want to {bulkAction === 'activate' ? 'activate' : 'deactivate'} {selectedRows.size} user(s)?
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
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
                onClick={confirmBulkAction}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: bulkAction === 'activate' ? '#10B981' : '#EF4444',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Project Modal */}
      {showAssignModal && (
        <div
          style={{
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
          onClick={() => setShowAssignModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              minHeight: isRoleDropdownOpen ? '490px' : '350px',
              transition: 'min-height 0.2s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#272721',
                  margin: '0 0 4px 0'
                }}>
                  Assign User to Project
                </h3>
                {selectedUser && (
                  <p style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    margin: 0
                  }}>
                    User: {MOCK_USERS.find(u => u.id.toString() === selectedUser)?.fullName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
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
            <div style={{ padding: '24px', flex: 1, overflow: 'visible' }}>
              {/* Project Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Select Project <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <StandardDropdown
                  options={MOCK_PROJECTS.map(p => ({ value: p.id.toString(), label: `${p.name} (${p.code})` }))}
                  value={selectedProject}
                  onChange={setSelectedProject}
                  placeholder="Search and select project..."
                  forceDirection="bottom"
                />
                {projectError && (
                  <p style={{ fontSize: '12px', color: '#EF4444', margin: '4px 0 0 0' }}>{projectError}</p>
                )}
              </div>

              {/* Project Role Selection */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Project Role <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <StandardDropdown
                  options={[
                    { value: 'Project Admin', label: 'Project Admin' },
                    { value: 'Standard User', label: 'Standard User' },
                    { value: 'Contributor', label: 'Contributor' },
                    { value: 'Viewer', label: 'Viewer' }
                  ]}
                  value={selectedProjectRole}
                  onChange={(value) => setSelectedProjectRole(value as string)}
                  onOpenChange={(isOpen) => setIsRoleDropdownOpen(isOpen)}
                  placeholder="Select role..."
                  mode="single"
                  error={roleError}
                  forceDirection="bottom"
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
                onClick={() => setShowAssignModal(false)}
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
                onClick={handleAssignProject}
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
                Assign to Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Send, X } from 'lucide-react';
import { toast } from 'sonner';
// CLIENT VIEW MODE: Import configuration
import { hiddenPages } from '../config/clientViewConfig';

type TabType = 'my-projects' | 'all-projects';
type AccessStatus = 'granted' | 'pending' | 'none';

interface Project {
  id: number;
  code: string;
  name: string;
  type: string;
  client: string;
  role: string;
  completion: number;
  createdAt: string;
  status: string;
  accessStatus?: AccessStatus;
}

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('my-projects');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [requestReason, setRequestReason] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [roleError, setRoleError] = useState('');
  
  // Column search state
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [createdAtSearch, setCreatedAtSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    code: true,
    name: true,
    client: true,
    role: true,
    createdAt: true,
    status: true
  });

  // All projects in the system with access status
  const allSystemProjects: Project[] = [
    { id: 9, code: 'PRJ-2025-076', name: 'Google Data Center – Norway', type: 'Commercial', client: 'Google', role: 'Project Admin', completion: 78, createdAt: '26-06-2025', status: 'Published', accessStatus: 'granted' },
    { id: 1, code: 'PRJ-2026-001', name: 'North Terminal Expansion', type: 'Infrastructure', client: 'Metropolitan Transit Authority', role: 'Project Admin', completion: 45, createdAt: '15-01-2026', status: 'Published', accessStatus: 'granted' },
    { id: 2, code: 'PRJ-2026-002', name: 'Offshore Platform Alpha', type: 'Industrial', client: 'Oceanic Energy Corp', role: 'Contributor', completion: 12, createdAt: '22-01-2026', status: 'Draft', accessStatus: 'granted' },
    { id: 3, code: 'PRJ-2026-003', name: 'Highway Infrastructure Upgrade', type: 'Infrastructure', client: 'Department of Transportation', role: 'Project Admin', completion: 62, createdAt: '08-01-2026', status: 'Published', accessStatus: 'granted' },
    { id: 4, code: 'PRJ-2026-004', name: 'Residential Complex Phase 2', type: 'Residential', client: 'UrbanLiving Developers', role: 'Standard User', completion: 33, createdAt: '18-01-2026', status: 'Published', accessStatus: 'granted' },
    { id: 5, code: 'PRJ-2026-005', name: 'Water Treatment Facility', type: 'Utilities', client: 'City Water & Utilities', role: 'Viewer', completion: 55, createdAt: '12-01-2026', status: 'On Hold', accessStatus: 'granted' },
    { id: 6, code: 'PRJ-2026-006', name: 'Data Center Construction', type: 'Commercial', client: 'TechCore Solutions', role: 'Project Admin', completion: 8, createdAt: '01-02-2026', status: 'Draft', accessStatus: 'granted' },
    { id: 7, code: 'PRJ-2026-007', name: 'Bridge Restoration Project', type: 'Infrastructure', client: 'State Infrastructure Board', role: 'Contributor', completion: 89, createdAt: '25-01-2026', status: 'Published', accessStatus: 'granted' },
    { id: 8, code: 'PRJ-2025-089', name: 'Metro Line Extension', type: 'Infrastructure', client: 'Regional Rail Commission', role: 'Viewer', completion: 100, createdAt: '20-11-2025', status: 'Completed', accessStatus: 'granted' },
    // Additional projects without access
    { id: 10, code: 'PRJ-2026-010', name: 'Smart City Initiative', type: 'Infrastructure', client: 'City Development Corp', role: 'N/A', completion: 25, createdAt: '10-02-2026', status: 'Published', accessStatus: 'none' },
    { id: 11, code: 'PRJ-2026-011', name: 'Solar Farm Development', type: 'Energy', client: 'GreenTech Energy', role: 'N/A', completion: 40, createdAt: '14-02-2026', status: 'Published', accessStatus: 'none' },
    { id: 12, code: 'PRJ-2026-012', name: 'Hospital Renovation Phase 1', type: 'Healthcare', client: 'Regional Health Authority', role: 'N/A', completion: 15, createdAt: '18-02-2026', status: 'Published', accessStatus: 'pending' },
    { id: 13, code: 'PRJ-2026-013', name: 'Airport Terminal Modernization', type: 'Infrastructure', client: 'International Aviation Board', role: 'N/A', completion: 55, createdAt: '05-02-2026', status: 'Published', accessStatus: 'none' },
    { id: 14, code: 'PRJ-2026-014', name: 'University Campus Expansion', type: 'Education', client: 'State University Board', role: 'N/A', completion: 30, createdAt: '12-02-2026', status: 'Published', accessStatus: 'none' },
  ];

  // Filter projects based on active tab
  const myProjects = allSystemProjects.filter(p => p.accessStatus === 'granted' && p.status !== 'Draft');
  const allProjects = allSystemProjects.filter(p => p.accessStatus !== 'granted' || p.status === 'Draft');

  // Get current dataset based on tab
  const currentDataset = activeTab === 'my-projects' ? myProjects : allProjects;

  // Apply filters and sorting
  const projectData = currentDataset
    .filter(p => p.code.toLowerCase().includes(codeSearch.toLowerCase()))
    .filter(p => p.name.toLowerCase().includes(nameSearch.toLowerCase()))
    .filter(p => p.client.toLowerCase().includes(clientSearch.toLowerCase()))
    .filter(p => p.role.toLowerCase().includes(roleSearch.toLowerCase()))
    .filter(p => p.createdAt.toLowerCase().includes(createdAtSearch.toLowerCase()))
    .filter(p => p.status.toLowerCase().includes(statusSearch.toLowerCase()))
    .sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      const aVal = a[sortColumn as keyof typeof a];
      const bVal = b[sortColumn as keyof typeof b];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(projectData.map(p => p.id)));
      setSelectAll(true);
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
    setSelectAll(newSelected.size === projectData.length);
  };

  const handleProjectClick = (projectId: number) => {
    const project = allSystemProjects.find(p => p.id === projectId);
    
    // Only allow navigation if user has access
    if (project?.accessStatus !== 'granted') {
      return;
    }
    
    // If project is Draft, redirect to project configuration to continue setup
    if (project?.status === 'Draft') {
      navigate(`/app/project-config/${projectId}`);
    } else {
      navigate(`/app/projects/${projectId}/tasks`);
    }
  };

  const handleRequestAccess = (project: Project) => {
    setSelectedProject(project);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    if (!selectedProject) return;
    
    // Validate role selection
    if (!requestedRole) {
      setRoleError('This field is mandatory');
      return;
    }
    
    toast.success(`Access request sent for "${selectedProject.name}"`);
    
    // Update project access status to pending
    const projectIndex = allSystemProjects.findIndex(p => p.id === selectedProject.id);
    if (projectIndex !== -1) {
      allSystemProjects[projectIndex].accessStatus = 'pending';
    }
    
    setShowRequestModal(false);
    setRequestReason('');
    setRequestedRole('');
    setRoleError('');
    setSelectedProject(null);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp size={14} style={{ color: '#FD4314' }} /> : 
      <ArrowDown size={14} style={{ color: '#FD4314' }} />;
  };

  const toggleColumnVisibility = (column: keyof typeof columnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Build grid template columns dynamically based on visibility
  const visibleColumns = [];
  if (columnVisibility.code) visibleColumns.push('140px');
  if (columnVisibility.name) visibleColumns.push('1fr');
  if (columnVisibility.client) visibleColumns.push('220px');
  if (columnVisibility.role) visibleColumns.push('180px');
  if (columnVisibility.createdAt) visibleColumns.push('120px');
  if (columnVisibility.status) visibleColumns.push('130px');
  
  // Add action column for both tabs
  visibleColumns.push('150px');
  
  const gridTemplateColumns = `${visibleColumns.join(' ')}`;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '24px 32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Create Project Button Row - Always visible, but flow shows Design In Progress in Client View */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      }}>
        {/* Create Project Button */}
        <button 
          onClick={() => navigate('/app/projects/create')}
          style={{
            height: '36px',
            padding: '0 16px',
            backgroundColor: '#FD4314',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
        >
          + Create Project
        </button>
      </div>

      {/* AG Grid Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        position: 'relative'
      }}>
        {/* Tabs */}
        <div style={{
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          padding: '0 16px'
        }}>
          <button
            onClick={() => {
              setActiveTab('my-projects');
              setSelectedRows(new Set());
              setSelectAll(false);
            }}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: activeTab === 'my-projects' ? '600' : '500',
              color: activeTab === 'my-projects' ? '#272721' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === 'my-projects' ? '2px solid #FD4314' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 150ms ease'
            }}
          >
            My Projects <span style={{ 
              color: '#858D9D', 
              fontWeight: '500',
              marginLeft: '6px'
            }}>({myProjects.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('all-projects');
              setSelectedRows(new Set());
              setSelectAll(false);
            }}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: activeTab === 'all-projects' ? '600' : '500',
              color: activeTab === 'all-projects' ? '#272721' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === 'all-projects' ? '2px solid #FD4314' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 150ms ease'
            }}
          >
            Unassigned Projects <span style={{ 
              color: '#858D9D', 
              fontWeight: '500',
              marginLeft: '6px'
            }}>({allProjects.length})</span>
          </button>
        </div>

        {/* Main Table Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Bulk Action Bar */}
          {selectedRows.size > 0 && (
            <div style={{
              height: '48px',
              backgroundColor: '#FFF3EE',
              borderBottom: '1px solid #FD4314',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#272721'
              }}>
                {selectedRows.size} project{selectedRows.size > 1 ? 's' : ''} selected
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button style={{
                  fontSize: '13px',
                  color: '#5F6B7A',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8EAED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Open
                </button>
                <button style={{
                  fontSize: '13px',
                  color: '#5F6B7A',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8EAED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Export
                </button>
                <button style={{
                  fontSize: '13px',
                  color: '#5F6B7A',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8EAED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Archive
                </button>
              </div>
            </div>
          )}

          {/* Table Header with Sort */}
          <div style={{
            backgroundColor: '#E4EEF8',
            display: 'grid',
            gridTemplateColumns,
            borderBottom: '1px solid #C8D9EE',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            {columnVisibility.code && (
              <div 
                onClick={() => handleSort('code')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Project ID</span>
                {getSortIcon('code')}
              </div>
            )}

            {columnVisibility.name && (
              <div 
                onClick={() => handleSort('name')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Project Name</span>
                {getSortIcon('name')}
              </div>
            )}

            {columnVisibility.client && (
              <div 
                onClick={() => handleSort('client')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Client Name</span>
                {getSortIcon('client')}
              </div>
            )}

            {columnVisibility.role && (
              <div 
                onClick={() => handleSort('role')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Project Role</span>
                {getSortIcon('role')}
              </div>
            )}

            {columnVisibility.createdAt && (
              <div 
                onClick={() => handleSort('createdAt')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Created On</span>
                {getSortIcon('createdAt')}
              </div>
            )}

            {columnVisibility.status && (
              <div 
                onClick={() => handleSort('status')}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                <span>Status</span>
                {getSortIcon('status')}
              </div>
            )}

            <div style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721'
            }}>
              {activeTab === 'my-projects' ? 'Action' : 'Access'}
            </div>
          </div>

          {/* Search/Filter Row */}
          <div style={{
            backgroundColor: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns,
            borderBottom: '1px solid #C8D9EE',
            position: 'sticky',
            top: 40,
            zIndex: 10
          }}>
            {columnVisibility.code && (
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Filter size={14} style={{ 
                    position: 'absolute', 
                    left: '8px',
                    color: codeSearch ? '#FD4314' : '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={codeSearch}
                    onChange={(e) => setCodeSearch(e.target.value)}
                    placeholder="Filter..."
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px 0 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            {columnVisibility.name && (
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Filter size={14} style={{ 
                    position: 'absolute', 
                    left: '8px',
                    color: nameSearch ? '#FD4314' : '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    placeholder="Filter..."
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px 0 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            {columnVisibility.client && (
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Filter size={14} style={{ 
                    position: 'absolute', 
                    left: '8px',
                    color: clientSearch ? '#FD4314' : '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Filter..."
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px 0 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            {columnVisibility.role && (
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Filter size={14} style={{ 
                    position: 'absolute', 
                    left: '8px',
                    color: roleSearch ? '#FD4314' : '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    placeholder="Filter..."
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px 0 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            {columnVisibility.createdAt && (
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Filter size={14} style={{ 
                    position: 'absolute', 
                    left: '8px',
                    color: createdAtSearch ? '#FD4314' : '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={createdAtSearch}
                    onChange={(e) => setCreatedAtSearch(e.target.value)}
                    placeholder="Filter..."
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px 0 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            {columnVisibility.status && (
              <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Filter size={14} style={{ 
                    position: 'absolute', 
                    left: '8px',
                    color: statusSearch ? '#FD4314' : '#9CA3AF',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                    placeholder="Filter..."
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 8px 0 28px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px'
            }}>
              {/* Empty cell for Access column */}
            </div>
          </div>

          {/* Table Body */}
          <div style={{ overflow: 'auto' }}>
            {projectData.length === 0 ? (
              <div style={{
                padding: '64px 24px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#272721',
                  marginBottom: '8px'
                }}>
                  {activeTab === 'my-projects' ? 'No projects assigned yet' : 'No projects found'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '20px'
                }}>
                  {activeTab === 'my-projects' 
                    ? 'Browse all projects to request access or contact your administrator' 
                    : 'Try adjusting your search criteria'}
                </div>
                {activeTab === 'my-projects' && (
                  <button
                    onClick={() => setActiveTab('all-projects')}
                    style={{
                      height: '36px',
                      padding: '0 20px',
                      backgroundColor: '#FD4314',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Browse All Projects
                  </button>
                )}
              </div>
            ) : (
              projectData.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns,
                    borderBottom: '1px solid #E2E6ED',
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                    cursor: project.accessStatus === 'granted' ? 'pointer' : 'default',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (project.accessStatus === 'granted') {
                      e.currentTarget.style.backgroundColor = '#FFF4EF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD';
                  }}
                >
                  {columnVisibility.code && (
                    <div style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#272721',
                      fontFamily: 'monospace'
                    }}>
                      {project.code}
                    </div>
                  )}

                  {columnVisibility.name && (
                    <div style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#272721'
                    }}>
                      {project.name}
                    </div>
                  )}

                  {columnVisibility.client && (
                    <div style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#5F6B7A'
                    }}>
                      {project.client}
                    </div>
                  )}

                  {columnVisibility.role && (
                    <div style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#5F6B7A'
                    }}>
                      {project.role}
                    </div>
                  )}

                  {columnVisibility.createdAt && (
                    <div style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#5F6B7A'
                    }}>
                      {project.createdAt}
                    </div>
                  )}

                  {columnVisibility.status && (
                    <div style={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px'
                    }}>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        backgroundColor: 
                          project.status === 'Published' ? '#DEF7EC' : 
                          project.status === 'Draft' ? '#F3F4F6' : 
                          project.status === 'Completed' ? '#E0E7FF' :
                          project.status === 'On Hold' ? '#FFF3E0' :
                          project.status === 'Archive' ? '#FDE8E8' : '#F3F4F6',
                        color: 
                          project.status === 'Published' ? '#03543F' : 
                          project.status === 'Draft' ? '#374151' : 
                          project.status === 'Completed' ? '#3730A3' :
                          project.status === 'On Hold' ? '#E65100' :
                          project.status === 'Archive' ? '#9B1C1C' : '#374151',
                        fontWeight: '500'
                      }}>
                        {project.status}
                      </div>
                    </div>
                  )}

                  <div style={{
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 12px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  >
                    {project.accessStatus === 'granted' ? (
                      project.status === 'Draft' ? (
                        // Draft projects - Continue Setup button with blue color scheme
                        <button
                          onClick={() => navigate(`/app/projects/create?draft=${project.id}`)}
                          style={{
                            width: '130px',
                            height: '28px',
                            padding: '0 12px',
                            backgroundColor: 'rgba(59, 130, 246, 0.08)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#2563EB',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
                            e.currentTarget.style.borderColor = '#2563EB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                          }}
                        >
                          Continue Setup
                        </button>
                      ) : (
                        // Published/Completed projects - Open button
                        <button
                          onClick={() => navigate(`/app/projects/${project.id}/tasks`)}
                          style={{
                            width: '130px',
                            height: '28px',
                            padding: '0 12px',
                            backgroundColor: 'rgba(253, 67, 20, 0.08)',
                            border: '1px solid rgba(253, 67, 20, 0.3)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#FD4314',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.12)';
                            e.currentTarget.style.borderColor = '#FD4314';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(253, 67, 20, 0.3)';
                          }}
                        >
                          Open
                        </button>
                      )
                    ) : project.accessStatus === 'pending' ? (
                      // Pending access - Text-like display (center aligned)
                      <span style={{
                        fontSize: '12px',
                        color: '#858D9D',
                        fontWeight: '500',
                        textAlign: 'center',
                        width: '100%'
                      }}>
                        Request Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRequestAccess(project)}
                        style={{
                          width: '130px',
                          height: '28px',
                          padding: '0 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D8DEE8',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#272721',
                          cursor: 'pointer',
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                          e.currentTarget.style.borderColor = '#FD4314';
                          e.currentTarget.style.color = '#FD4314';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#D8DEE8';
                          e.currentTarget.style.color = '#272721';
                        }}
                      >
                        Request Access
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Request Access Modal */}
      {showRequestModal && selectedProject && (
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
          onClick={() => {
            setShowRequestModal(false);
            setRequestReason('');
            setSelectedProject(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              width: '520px',
              maxWidth: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#272721',
                  marginBottom: '4px'
                }}>
                  Request Project Access
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#6B7280'
                }}>
                  Your request will be sent to the administrator
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestReason('');
                  setRequestedRole('');
                  setRoleError('');
                  setSelectedProject(null);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Project Role Dropdown */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Project Role <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={requestedRole}
                  onChange={(e) => {
                    setRequestedRole(e.target.value);
                    setRoleError('');
                  }}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    border: `1px solid ${roleError ? '#EF4444' : '#D8DEE8'}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#272721',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" disabled style={{ color: '#9CA3AF' }}>Select project role</option>
                  <option value="Project Admin" style={{ color: '#272721' }}>Project Admin</option>
                  <option value="Standard User" style={{ color: '#272721' }}>Standard User</option>
                  <option value="Contributor" style={{ color: '#272721' }}>Contributor</option>
                  <option value="Viewer" style={{ color: '#272721' }}>Viewer</option>
                </select>
                {roleError && (
                  <p style={{ 
                    color: '#EF4444', 
                    fontSize: '12px', 
                    margin: '4px 0 0 0' 
                  }}>
                    {roleError}
                  </p>
                )}
              </div>

              {/* Reason Field */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  marginBottom: '6px'
                }}>
                  Reason/Comment <span style={{ color: '#858D9D', fontWeight: '400' }}>(Optional)</span>
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Briefly explain why you need access to this project..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px 12px',
                    border: '1px solid #D8DEE8',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#272721',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestReason('');
                  setRequestedRole('');
                  setRoleError('');
                  setSelectedProject(null);
                }}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: '1px solid #D8DEE8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#272721',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
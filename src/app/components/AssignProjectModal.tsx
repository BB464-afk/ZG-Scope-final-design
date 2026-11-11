import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface AssignProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (selectedProjects: any[]) => void;
}

const MOCK_PROJECTS = [
  { id: 1, code: 'PRJ-2026-001', name: 'Google Data Center - Norway', type: 'Infrastructure', client: 'Metropolitan Transit Authority', start: '2026-01-15', finish: '2027-06-30', status: 'Active' },
  { id: 2, code: 'PRJ-2026-002', name: 'Offshore Platform Alpha', type: 'Industrial', client: 'Oceanic Energy Corp', start: '2026-02-01', finish: '2028-12-31', status: 'Draft' },
  { id: 3, code: 'PRJ-2026-003', name: 'Highway Infrastructure Upgrade', type: 'Infrastructure', client: 'Department of Transportation', start: '2026-03-10', finish: '2026-11-20', status: 'Active' },
  { id: 4, code: 'PRJ-2026-004', name: 'Residential Complex Phase 2', type: 'Residential', client: 'UrbanLiving Developers', start: '2026-04-05', finish: '2027-09-15', status: 'Active' },
  { id: 5, code: 'PRJ-2026-005', name: 'Water Treatment Facility', type: 'Utilities', client: 'City Water & Utilities', start: '2026-05-20', finish: '2028-02-28', status: 'Active' },
  { id: 6, code: 'PRJ-2026-006', name: 'Data Center Construction', type: 'Commercial', client: 'TechCore Solutions', start: '2026-02-01', finish: '2027-03-15', status: 'Draft' },
  { id: 7, code: 'PRJ-2026-007', name: 'Bridge Restoration Project', type: 'Infrastructure', client: 'State Infrastructure Board', start: '2026-01-25', finish: '2026-10-10', status: 'Active' },
];

export default function AssignProjectModal({ isOpen, onClose, onAssign }: AssignProjectModalProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(MOCK_PROJECTS.map(p => p.id)));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (rowId: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === MOCK_PROJECTS.length);
  };

  const handleAssign = () => {
    const selectedProjects = MOCK_PROJECTS.filter(p => selectedRows.has(p.id));
    onAssign(selectedProjects);
    // Reset selection
    setSelectedRows(new Set());
    setSelectAll(false);
    setSearchText('');
  };

  const handleClose = () => {
    // Reset selection on close
    setSelectedRows(new Set());
    setSelectAll(false);
    setSearchText('');
    onClose();
  };

  if (!isOpen) return null;

  const filteredProjects = MOCK_PROJECTS.filter(project => 
    searchText === '' || 
    project.name.toLowerCase().includes(searchText.toLowerCase()) ||
    project.code.toLowerCase().includes(searchText.toLowerCase()) ||
    project.client.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-[900px] h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E6ED]">
          <h2 className="text-lg font-semibold text-[#1F2937]">Assign Project to User</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Grid Container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            {/* Grid Toolbar */}
            <div style={{
              height: '56px',
              backgroundColor: '#FAFBFC',
              borderBottom: '1px solid #E2E6ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px'
            }}>
              {/* Left - Count */}
              <div style={{
                fontSize: '14px',
                color: '#5F6B7A'
              }}>
                {filteredProjects.length} projects available
              </div>

              {/* Right - Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9CA3AF' 
                  }} />
                  <input 
                    type="text"
                    placeholder="Search projects…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      width: '280px',
                      height: '36px',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      paddingLeft: '38px',
                      paddingRight: '12px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div style={{ 
              flex: 1, 
              overflow: 'auto',
              border: '1px solid #E2E6ED',
              borderTop: 'none',
              backgroundColor: '#FFFFFF'
            }}>
              {/* Table Header */}
              <div style={{
                height: '48px',
                backgroundColor: '#111827',
                display: 'grid',
                gridTemplateColumns: '48px 140px 1fr 200px 140px 110px',
                alignItems: 'center',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div style={{ paddingLeft: '12px' }}>Project ID</div>
                <div style={{ paddingLeft: '12px' }}>Project Name</div>
                <div style={{ paddingLeft: '12px' }}>Client</div>
                <div style={{ paddingLeft: '12px' }}>Project Type</div>
                <div style={{ paddingLeft: '12px' }}>Status</div>
              </div>

              {/* Table Rows */}
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id}
                  onClick={() => handleRowSelect(project.id)}
                  style={{
                    height: '44px',
                    display: 'grid',
                    gridTemplateColumns: '48px 140px 1fr 200px 140px 110px',
                    alignItems: 'center',
                    backgroundColor: selectedRows.has(project.id) ? '#F3F6FA' : (index % 2 === 0 ? '#FFFFFF' : '#FAFBFC'),
                    borderBottom: '1px solid #E2E6ED',
                    fontSize: '13px',
                    color: '#272721',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedRows.has(project.id) ? '#E8EEF5' : '#F3F6FA'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedRows.has(project.id) ? '#F3F6FA' : (index % 2 === 0 ? '#FFFFFF' : '#FAFBFC')}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.has(project.id)}
                      readOnly
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ 
                    paddingLeft: '12px', 
                    fontFamily: 'monospace', 
                    color: '#5F6B7A',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {project.code}
                  </div>
                  <div style={{ 
                    paddingLeft: '12px', 
                    fontWeight: '500',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {project.name}
                  </div>
                  <div style={{ 
                    paddingLeft: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {project.client}
                  </div>
                  <div style={{ 
                    paddingLeft: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {project.type}
                  </div>
                  <div style={{ paddingLeft: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      backgroundColor: project.status === 'Active' ? '#DEF7EC' : (project.status === 'Draft' ? '#F3F4F6' : '#FDE8E8'),
                      color: project.status === 'Active' ? '#03543F' : (project.status === 'Draft' ? '#374151' : '#9B1C1C'),
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredProjects.length === 0 && (
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
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E2E6ED] bg-[#FAFBFC]">
          <div style={{
            fontSize: '14px',
            color: '#5F6B7A',
            fontWeight: '500'
          }}>
            {selectedRows.size > 0 && `${selectedRows.size} project${selectedRows.size > 1 ? 's' : ''} selected`}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleClose}
              className="px-5 py-2 border border-[#D1D5DB] rounded text-[#374151] text-sm font-medium hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAssign}
              disabled={selectedRows.size === 0}
              style={{
                padding: '8px 20px',
                borderRadius: '4px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: selectedRows.size > 0 ? 'pointer' : 'not-allowed',
                backgroundColor: selectedRows.size > 0 ? '#FD4314' : '#D1D5DB',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedRows.size > 0) {
                  e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRows.size > 0) {
                  e.currentTarget.style.backgroundColor = '#FD4314';
                }
              }}
            >
              Assign {selectedRows.size > 0 ? `(${selectedRows.size})` : 'Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
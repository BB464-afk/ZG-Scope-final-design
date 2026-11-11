import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, CheckCircle, X, LayoutGrid, Table2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectAccessRequest {
  id: string;
  userName: string;
  userEmail: string;
  projectName: string;
  projectId: string;
  projectRole: string;
  requestedDate: string;
  reason: string;
  status: 'In Review' | 'Approved' | 'Rejected';
}

const MOCK_ACCESS_REQUESTS: ProjectAccessRequest[] = [
  {
    id: 'acc-1',
    userName: 'Sarah Martinez',
    userEmail: 'sarah.martinez@example.com',
    projectName: 'Marina Bay Complex',
    projectId: 'PRJ-2024-001',
    projectRole: 'Project Manager',
    requestedDate: '2026-03-12',
    reason: 'Need access to manage project timeline and resources',
    status: 'In Review'
  },
  {
    id: 'acc-2',
    userName: 'James Wilson',
    userEmail: 'james.wilson@example.com',
    projectName: 'Skyline Tower',
    projectId: 'PRJ-2024-002',
    projectRole: 'Contributor',
    requestedDate: '2026-03-14',
    reason: 'Contributing to electrical installation tasks',
    status: 'In Review'
  },
  {
    id: 'acc-3',
    userName: 'Emily Chen',
    userEmail: 'emily.chen@example.com',
    projectName: 'Riverside Plaza',
    projectId: 'PRJ-2024-003',
    projectRole: 'Viewer',
    requestedDate: '2026-03-15',
    reason: 'Need read-only access for project oversight',
    status: 'In Review'
  },
  {
    id: 'acc-4',
    userName: 'Michael Brown',
    userEmail: 'michael.brown@example.com',
    projectName: 'Marina Bay Complex',
    projectId: 'PRJ-2024-001',
    projectRole: 'Standard User',
    requestedDate: '2026-03-10',
    reason: 'Assigned to work on HVAC systems',
    status: 'Approved'
  },
  {
    id: 'acc-5',
    userName: 'Lisa Anderson',
    userEmail: 'lisa.anderson@example.com',
    projectName: 'Skyline Tower',
    projectId: 'PRJ-2024-002',
    projectRole: 'Contributor',
    requestedDate: '2026-03-11',
    reason: 'Supporting structural engineering team',
    status: 'Rejected'
  }
];

const PROJECT_ROLES = [
  'Project Owner',
  'Project Admin',
  'Contributor',
  'Standard User',
  'Viewer'
];

export default function Approvals() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccessRequests, setSelectedAccessRequests] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('flat');

  // Modal states
  const [showAccessReviewModal, setShowAccessReviewModal] = useState(false);
  const [selectedAccessRequest, setSelectedAccessRequest] = useState<ProjectAccessRequest | null>(null);
  const [approvalRole, setApprovalRole] = useState('');
  const [approvalReason, setApprovalReason] = useState('');

  const pendingAccessCount = MOCK_ACCESS_REQUESTS.filter(r => r.status === 'In Review').length;

  const handleAccessReview = (request: ProjectAccessRequest) => {
    setSelectedAccessRequest(request);
    setApprovalRole(request.projectRole);
    setApprovalReason('');
    setShowAccessReviewModal(true);
  };

  const handleApprove = () => {
    if (selectedAccessRequest) {
      toast.success(`Access request for ${selectedAccessRequest.userName} approved successfully`);
      setShowAccessReviewModal(false);
      setSelectedAccessRequest(null);
      setApprovalRole('');
      setApprovalReason('');
    }
  };

  const handleReject = () => {
    if (selectedAccessRequest) {
      toast.error(`Access request for ${selectedAccessRequest.userName} rejected`);
      setShowAccessReviewModal(false);
      setSelectedAccessRequest(null);
      setApprovalRole('');
      setApprovalReason('');
    }
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Content Container */}
      <div style={{
        width: '100%',
        padding: '32px',
        backgroundColor: '#FFFFFF'
      }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '6px',
          border: '1px solid #E2E6ED',
          gap: '16px'
        }}>
          {/* Left - View Toggle and Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            {/* View Toggle */}
            <div style={{
              display: 'inline-flex',
              border: '1px solid #D8DEE8',
              borderRadius: '4px',
              backgroundColor: '#F9FAFB',
              padding: '2px'
            }}>
              <button
                onClick={() => setViewMode('flat')}
                style={{
                  height: '34px',
                  padding: '0 14px',
                  border: 'none',
                  backgroundColor: viewMode === 'flat' ? '#FFFFFF' : 'transparent',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: viewMode === 'flat' ? '#1F2937' : '#6B7280',
                  boxShadow: viewMode === 'flat' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <Table2 size={14} />
                Flat View
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                style={{
                  height: '34px',
                  padding: '0 14px',
                  border: 'none',
                  backgroundColor: viewMode === 'grouped' ? '#FFFFFF' : 'transparent',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: viewMode === 'grouped' ? '#1F2937' : '#6B7280',
                  boxShadow: viewMode === 'grouped' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <LayoutGrid size={14} />
                Grouped View
              </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF'
              }} />
              <input
                type="text"
                placeholder="Search by user, email, or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              {pendingAccessCount} pending request{pendingAccessCount !== 1 ? 's' : ''}
            </div>

            {/* Approve/Reject buttons - always visible, disabled when no selection */}
            <button
              onClick={() => {
                if (selectedAccessRequests.size > 0) {
                  toast.success(`${selectedAccessRequests.size} request${selectedAccessRequests.size > 1 ? 's' : ''} approved successfully`);
                  setSelectedAccessRequests(new Set());
                }
              }}
              disabled={selectedAccessRequests.size === 0}
              style={{
                height: '36px',
                padding: '0 16px',
                backgroundColor: selectedAccessRequests.size > 0 ? '#10B981' : '#F9FAFB',
                border: '1px solid #10B981',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600',
                color: selectedAccessRequests.size > 0 ? '#FFFFFF' : '#9CA3AF',
                cursor: selectedAccessRequests.size > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (selectedAccessRequests.size > 0) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAccessRequests.size > 0) {
                  e.currentTarget.style.backgroundColor = '#10B981';
                }
              }}
            >
              <CheckCircle size={14} />
              Approve
            </button>
            <button
              onClick={() => {
                if (selectedAccessRequests.size > 0) {
                  toast.success(`${selectedAccessRequests.size} request${selectedAccessRequests.size > 1 ? 's' : ''} rejected successfully`);
                  setSelectedAccessRequests(new Set());
                }
              }}
              disabled={selectedAccessRequests.size === 0}
              style={{
                height: '36px',
                padding: '0 16px',
                backgroundColor: selectedAccessRequests.size > 0 ? '#FFFFFF' : '#F9FAFB',
                border: '1px solid #DC2626',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600',
                color: selectedAccessRequests.size > 0 ? '#DC2626' : '#9CA3AF',
                cursor: selectedAccessRequests.size > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (selectedAccessRequests.size > 0) {
                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAccessRequests.size > 0) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              <X size={14} />
              Reject
            </button>
          </div>
        </div>

        {/* Access Requests Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E6ED',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ minWidth: '1000px', width: '100%' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 200px 1fr 200px 160px 120px 120px 120px',
              backgroundColor: '#E4EEFE',
              borderBottom: '1px solid #C8D9EE',
              padding: '0 20px',
              height: '44px',
              alignItems: 'center',
              fontSize: '13px',
              fontWeight: '600',
              color: '#272721',
              gap: '12px',
              width: '100%'
            }}>
              <div>
                <input 
                  type="checkbox" 
                  style={{ cursor: 'pointer' }}
                  checked={selectedAccessRequests.size === MOCK_ACCESS_REQUESTS.length && MOCK_ACCESS_REQUESTS.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAccessRequests(new Set(MOCK_ACCESS_REQUESTS.map(r => r.id)));
                    } else {
                      setSelectedAccessRequests(new Set());
                    }
                  }}
                />
              </div>
              <div>User Name</div>
              <div>User Email</div>
              <div>Project Name</div>
              <div>Project Role</div>
              <div>Status</div>
              <div>Requested Date</div>
              <div style={{ textAlign: 'center' }}>Action</div>
            </div>

            {/* Table Body */}
            {MOCK_ACCESS_REQUESTS.map((request, index) => (
              <div
                key={request.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 200px 1fr 200px 160px 120px 120px 120px',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                  height: '52px',
                  borderBottom: index < MOCK_ACCESS_REQUESTS.length - 1 ? '1px solid #E2E6ED' : 'none',
                  padding: '0 20px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF4EF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD';
                }}
              >
                {/* Checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    style={{ cursor: 'pointer' }}
                    checked={selectedAccessRequests.has(request.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedAccessRequests);
                      if (e.target.checked) {
                        newSelected.add(request.id);
                      } else {
                        newSelected.delete(request.id);
                      }
                      setSelectedAccessRequests(newSelected);
                    }}
                  />
                </div>

                {/* User Name */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#1F2937'
                }}>
                  {request.userName}
                </div>

                {/* User Email */}
                <div style={{
                  fontSize: '13px',
                  color: '#374151',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {request.userEmail}
                </div>

                {/* Project Name */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#1F2937',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {request.projectName}
                </div>

                {/* Project Role */}
                <div style={{
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {request.projectRole}
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: 
                      request.status === 'Approved' ? '#D1FAE5' :
                      request.status === 'Rejected' ? '#FEE2E2' :
                      '#E4EEFE',
                    color: 
                      request.status === 'Approved' ? '#065F46' :
                      request.status === 'Rejected' ? '#991B1B' :
                      '#1E40AF'
                  }}>
                    {request.status}
                  </span>
                </div>

                {/* Requested Date */}
                <div style={{
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  {new Date(request.requestedDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-')}
                </div>

                {/* Action */}
                <div style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  {request.status === 'In Review' && (
                    <button
                      onClick={() => handleAccessReview(request)}
                      style={{
                        height: '32px',
                        padding: '0 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #FD4314',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#FD4314',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF5F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Access Review Modal */}
        {showAccessReviewModal && selectedAccessRequest && (
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
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                  Review Project Access Request
                </h3>
                <button
                  onClick={() => {
                    setShowAccessReviewModal(false);
                    setSelectedAccessRequest(null);
                    setApprovalRole('');
                    setApprovalReason('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6B7280'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Request Details (Read-only) */}
              <div style={{
                backgroundColor: '#F7F9FC',
                border: '1px solid #E2E6ED',
                borderRadius: '6px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  marginBottom: '16px'
                }}>
                  Request Details
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>User Name</div>
                    <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                      {selectedAccessRequest.userName}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>User Email</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>
                      {selectedAccessRequest.userEmail}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Project Name</div>
                    <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                      {selectedAccessRequest.projectName}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Project ID</div>
                    <div style={{ fontSize: '14px', color: '#1F2937', fontFamily: 'monospace' }}>
                      {selectedAccessRequest.projectId}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Requested Role</div>
                    <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                      {selectedAccessRequest.projectRole}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Requested Date</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>
                      {new Date(selectedAccessRequest.requestedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Reason</div>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>
                      {selectedAccessRequest.reason}
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Form */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#272721',
                  marginBottom: '16px'
                }}>
                  Approval Details
                </h4>

                {/* Project Role Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Assign Project Role
                  </label>
                  <select
                    value={approvalRole}
                    onChange={(e) => setApprovalRole(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    {PROJECT_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Approval Reason */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Approval/Rejection Reason (Optional)
                  </label>
                  <textarea
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    placeholder="Add a comment about your decision..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '1px solid #D8DEE8',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleReject}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DC2626',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#DC2626',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  Reject Request
                </button>
                <button
                  onClick={handleApprove}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10B981';
                  }}
                >
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
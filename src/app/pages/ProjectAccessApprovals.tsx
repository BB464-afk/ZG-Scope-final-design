import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Search, CheckCircle, XCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectAccessRequest {
  id: string;
  userName: string;
  userEmail: string;
  projectRole: string;
  requestedDate: string;
  reason: string;
  status: 'Pending';
}

const MOCK_ACCESS_REQUESTS: ProjectAccessRequest[] = [
  {
    id: 'req-1',
    userName: 'Alex Thompson',
    userEmail: 'alex.thompson@contractor.com',
    projectRole: 'Project Admin',
    requestedDate: '2026-02-24',
    reason: 'Need access to oversee MEP coordination and manage subcontractor activities for Tower A construction phase.',
    status: 'Pending'
  },
  {
    id: 'req-2',
    userName: 'Linda Chen',
    userEmail: 'linda.chen@engineering.com',
    projectRole: 'Contributor',
    requestedDate: '2026-02-23',
    reason: 'Assigned as lead site engineer for structural works. Require access to review drawings and update progress.',
    status: 'Pending'
  },
  {
    id: 'req-3',
    userName: 'Robert Kim',
    userEmail: 'robert.kim@subcontractor.com',
    projectRole: 'Contributor',
    requestedDate: '2026-02-22',
    reason: 'Subcontractor for electrical works. Need access to submit progress updates and view task assignments.',
    status: 'Pending'
  },
  {
    id: 'req-4',
    userName: 'Sarah Martinez',
    userEmail: 'sarah.martinez@consultant.com',
    projectRole: 'Standard User',
    requestedDate: '2026-02-21',
    reason: 'Quality assurance role for interior fit-out phase. Need to access inspection records and submit reports.',
    status: 'Pending'
  },
  {
    id: 'req-5',
    userName: 'James Wilson',
    userEmail: 'james.wilson@architect.com',
    projectRole: 'Viewer',
    requestedDate: '2026-02-20',
    reason: 'Lead architect for facade design. Require view access to coordinate with structural and MEP teams.',
    status: 'Pending'
  }
];

const PROJECT_ROLES = [
  'Project Admin',
  'Contributor',
  'Standard User',
  'Viewer'
];

export default function ProjectAccessApprovals() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [accessSearchQuery, setAccessSearchQuery] = useState('');
  const [selectedAccessRequests, setSelectedAccessRequests] = useState<Set<string>>(new Set());
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [showAccessReviewModal, setShowAccessReviewModal] = useState(false);
  const [selectedAccessRequest, setSelectedAccessRequest] = useState<ProjectAccessRequest | null>(null);
  const [approvalRole, setApprovalRole] = useState('');
  const [approvalReason, setApprovalReason] = useState('');

  const toggleAccessRequest = (id: string) => {
    const newSelected = new Set(selectedAccessRequests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAccessRequests(newSelected);
  };

  const toggleAllAccessRequests = () => {
    if (selectedAccessRequests.size === MOCK_ACCESS_REQUESTS.length) {
      setSelectedAccessRequests(new Set());
    } else {
      setSelectedAccessRequests(new Set(MOCK_ACCESS_REQUESTS.map(r => r.id)));
    }
  };

  const handleBulkApprove = () => {
    setShowBulkApproveModal(false);
    toast.success(`${selectedAccessRequests.size} request${selectedAccessRequests.size > 1 ? 's' : ''} approved successfully`);
    setSelectedAccessRequests(new Set());
  };

  const handleBulkReject = () => {
    setShowBulkRejectModal(false);
    toast.success(`${selectedAccessRequests.size} request${selectedAccessRequests.size > 1 ? 's' : ''} rejected successfully`);
    setSelectedAccessRequests(new Set());
  };

  const handleAccessReview = (request: ProjectAccessRequest) => {
    setSelectedAccessRequest(request);
    setApprovalRole(request.projectRole);
    setApprovalReason('');
    setShowAccessReviewModal(true);
  };

  const handleAccessApprove = () => {
    if (selectedAccessRequest) {
      toast.success(`Access approved for ${selectedAccessRequest.userName} as ${approvalRole}`);
      setShowAccessReviewModal(false);
      setSelectedAccessRequest(null);
      setApprovalRole('');
      setApprovalReason('');
    }
  };

  const handleAccessReject = () => {
    if (selectedAccessRequest) {
      if (!approvalReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }
      toast.success(`Access rejected for ${selectedAccessRequest.userName}`);
      setShowAccessReviewModal(false);
      setSelectedAccessRequest(null);
      setApprovalRole('');
      setApprovalReason('');
    }
  };

  const filteredAccessRequests = MOCK_ACCESS_REQUESTS.filter(req =>
    req.userName.toLowerCase().includes(accessSearchQuery.toLowerCase()) ||
    req.userEmail.toLowerCase().includes(accessSearchQuery.toLowerCase()) ||
    req.projectRole.toLowerCase().includes(accessSearchQuery.toLowerCase())
  );

  const pendingAccessCount = MOCK_ACCESS_REQUESTS.length;

  // Helper function to format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      padding: '32px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          margin: '0'
        }}>
          Project Access Approvals
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#5F6B7A',
          margin: '4px 0 0 0'
        }}>
          Review and approve project access requests from users
        </p>
      </div>

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
            placeholder="Search by user, email, or role..."
            value={accessSearchQuery}
            onChange={(e) => setAccessSearchQuery(e.target.value)}
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

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#6B7280' }}>
            {pendingAccessCount} pending request{pendingAccessCount !== 1 ? 's' : ''}
          </div>

          {/* Bulk Action Buttons - always visible, disabled when no selection */}
          <button
            onClick={() => {
              if (selectedAccessRequests.size > 0) {
                setShowBulkApproveModal(true);
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
            Approve {selectedAccessRequests.size > 0 ? `(${selectedAccessRequests.size})` : ''}
          </button>
          <button
            onClick={() => {
              if (selectedAccessRequests.size > 0) {
                setShowBulkRejectModal(true);
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
            Reject {selectedAccessRequests.size > 0 ? `(${selectedAccessRequests.size})` : ''}
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
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '48px 200px 1fr 140px 140px 100px',
          padding: '12px 16px',
          backgroundColor: '#E4EEF8',
          borderBottom: '1px solid #C8D9EE',
          height: '40px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#272721',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input
              type="checkbox"
              checked={selectedAccessRequests.size === MOCK_ACCESS_REQUESTS.length && MOCK_ACCESS_REQUESTS.length > 0}
              onChange={toggleAllAccessRequests}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#FD4314'
              }}
            />
          </div>
          <div>User Name</div>
          <div>Email</div>
          <div>Requested Role</div>
          <div>Requested Date</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {filteredAccessRequests.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#9CA3AF'
          }}>
            No access requests found
          </div>
        ) : (
          filteredAccessRequests.map((request, index) => (
            <div
              key={request.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 200px 1fr 140px 140px 100px',
                padding: '16px',
                borderBottom: '1px solid #E2E6ED',
                fontSize: '14px',
                alignItems: 'center',
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : 'rgba(228, 238, 254, 0.35)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedAccessRequests.has(request.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleAccessRequest(request.id);
                  }}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#FD4314'
                  }}
                />
              </div>
              <div style={{ fontWeight: '500', color: '#1F2937' }}>{request.userName}</div>
              <div style={{ color: '#6B7280' }}>{request.userEmail}</div>
              <div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: '#E4EEFE',
                  color: '#3B82F6'
                }}>
                  {request.projectRole}
                </span>
              </div>
              <div style={{ color: '#6B7280' }}>{formatDate(request.requestedDate)}</div>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccessReview(request);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#FFFFFF',
                    color: '#FD4314',
                    border: '1px solid #FD4314',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk Approve Modal */}
      {showBulkApproveModal && (
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
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 16px 0'
            }}>
              Approve Access Requests
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: '1.6'
            }}>
              Are you sure you want to approve {selectedAccessRequests.size} request{selectedAccessRequests.size > 1 ? 's' : ''}? Selected users will be granted access to the project with their requested roles.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowBulkApproveModal(false)}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkApprove}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10B981';
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reject Modal */}
      {showBulkRejectModal && (
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
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 16px 0'
            }}>
              Reject Access Requests
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0',
              lineHeight: '1.6'
            }}>
              Are you sure you want to reject {selectedAccessRequests.size} request{selectedAccessRequests.size > 1 ? 's' : ''}? Selected users will be notified of the rejection.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowBulkRejectModal(false)}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkReject}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

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
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setShowAccessReviewModal(false);
                setSelectedAccessRequest(null);
                setApprovalRole('');
                setApprovalReason('');
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={20} />
            </button>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 24px 0'
            }}>
              Review Access Request
            </h3>

            {/* Request Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
                  User Name
                </div>
                <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                  {selectedAccessRequest.userName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
                  Email
                </div>
                <div style={{ fontSize: '14px', color: '#1F2937' }}>
                  {selectedAccessRequest.userEmail}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
                Reason for Access
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6'
              }}>
                {selectedAccessRequest.reason}
              </div>
            </div>

            {/* Role Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
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

            {/* Add Reason Text Box */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#272721',
                marginBottom: '6px'
              }}>
                Add Reason
              </label>
              <textarea
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder="Optional: Add notes or reason for your decision..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px 12px',
                  border: '1px solid #D8DEE8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={handleAccessReject}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: '1px solid #DC2626',
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Reject
              </button>
              <button
                onClick={handleAccessApprove}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E63C13';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FD4314';
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
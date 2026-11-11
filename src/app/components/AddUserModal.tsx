import React, { useState } from 'react';
import { X } from 'lucide-react';
import StandardDropdown from './StandardDropdown';

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

interface AddUserModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (userId: string, role: string) => void;
  systemUsers: SystemUser[];
  selectedUserId: string;
  selectedRole: 'Project Admin' | 'Standard User' | 'Contributor' | 'Viewer';
  onUserChange: (userId: string) => void;
  onRoleChange: (role: 'Project Admin' | 'Standard User' | 'Contributor' | 'Viewer') => void;
}

export default function AddUserModal({
  show,
  onClose,
  onAdd,
  systemUsers,
  selectedUserId,
  selectedRole,
  onUserChange,
  onRoleChange
}: AddUserModalProps) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  if (!show) return null;

  // Prepare options for dropdowns
  const userOptions = systemUsers.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`
  }));

  const roleOptions = [
    { value: 'Project Admin', label: 'Project Admin' },
    { value: 'Standard User', label: 'Standard User' },
    { value: 'Contributor', label: 'Contributor' },
    { value: 'Viewer', label: 'Viewer' }
  ];

  // Calculate modal height based on role dropdown state
  const baseHeight = 310; // Header + content + footer height
  const expandedHeight = baseHeight + 280; // Additional space for dropdown options

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '480px',
          maxWidth: '90%',
          minHeight: isRoleDropdownOpen ? `${expandedHeight}px` : `${baseHeight}px`,
          transition: 'min-height 0.2s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            Add User to Project
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              padding: '4px',
              color: '#5F6B7A'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flex: 1
        }}>
          {/* Select User Dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Select User <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <StandardDropdown
              options={userOptions}
              value={selectedUserId}
              onChange={(value) => onUserChange(value as string)}
              placeholder="Choose a user..."
              mode="single"
              style={{ height: '44px' }}
              forceDirection="bottom"
            />
          </div>

          {/* Project Role Dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#272721',
              marginBottom: '8px'
            }}>
              Project Role <span style={{ color: '#FD4314' }}>*</span>
            </label>
            <StandardDropdown
              options={roleOptions}
              value={selectedRole}
              onChange={(value) => {
                onRoleChange(value as any);
              }}
              onOpenChange={(isOpen) => setIsRoleDropdownOpen(isOpen)}
              placeholder="Select role..."
              mode="single"
              style={{ height: '44px' }}
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
            onClick={onClose}
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
            onClick={() => onAdd(selectedUserId, selectedRole)}
            disabled={!selectedUserId}
            style={{
              height: '36px',
              padding: '0 16px',
              border: 'none',
              backgroundColor: !selectedUserId ? '#D1D5DB' : '#FD4314',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: !selectedUserId ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (selectedUserId) {
                e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUserId) {
                e.currentTarget.style.backgroundColor = '#FD4314';
              }
            }}
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}
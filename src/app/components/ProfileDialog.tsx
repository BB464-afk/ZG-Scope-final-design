import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Edit2 } from 'lucide-react';

interface ProfileDialogProps {
  onClose: () => void;
  position: { top: number; right: number };
}

export default function ProfileDialog({ onClose, position }: ProfileDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Small delay to prevent immediate closing from the click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleSignOut = () => {
    onClose();
    // Navigate to login or perform logout logic
    navigate('/');
  };

  const handleLogout = () => {
    onClose();
    // Navigate to login or perform logout logic
    navigate('/');
  };

  const handleEditProfile = () => {
    onClose();
    navigate('/app/general-settings/profile');
  };

  return (
    <div
      ref={dialogRef}
      style={{
        position: 'fixed',
        top: position.top + 'px',
        right: position.right + 'px',
        width: '320px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        border: '1px solid #E2E6ED',
        zIndex: 10000,
        overflow: 'hidden'
      }}
    >
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1F2937'
        }}>
          Personal
        </span>
        <button
          onClick={handleEditProfile}
          title="Edit Profile"
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
            color: '#6B7280',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
            e.currentTarget.style.color = '#FD4314';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <Edit2 size={16} />
        </button>
      </div>

      {/* User Information Section */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {/* Profile Avatar */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#4A90E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: '600',
            flexShrink: 0
          }}>
            MG
          </div>

          {/* User Name and Email */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Michael Gainey
            </div>
            <div style={{
              fontSize: '13px',
              color: '#6B7280',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              michael.gainey@zauner.com
            </div>
          </div>
        </div>

        {/* Role Information */}
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#858D9D',
            marginBottom: '4px'
          }}>
            System Role
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#1F2937'
          }}>
            Super Administrator
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            height: '36px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FD4314',
            borderRadius: '6px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.04)';
            e.currentTarget.style.borderColor = '#FD4314';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#FD4314';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
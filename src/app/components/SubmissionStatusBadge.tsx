import React, { useState } from 'react';
import { Lock, CheckCircle } from 'lucide-react';

interface SubmissionStatusBadgeProps {
  isLocked: boolean;
}

export function SubmissionStatusBadge({ isLocked }: SubmissionStatusBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        marginLeft: '12px',
        verticalAlign: 'middle'
      }}
      onMouseEnter={() => isLocked && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '16px',
        backgroundColor: isLocked ? '#FEF3C7' : '#D1FAE5',
        fontSize: '13px',
        fontWeight: '500',
        color: isLocked ? '#92400E' : '#065F46',
        cursor: isLocked ? 'help' : 'default'
      }}>
        {isLocked ? (
          <>
            <Lock size={14} style={{ flexShrink: 0 }} />
            <span>Progress Submissions Locked</span>
          </>
        ) : (
          <>
            <CheckCircle size={14} style={{ flexShrink: 0 }} />
            <span>Open for Progress Submissions</span>
          </>
        )}
      </div>
      
      {/* Tooltip */}
      {isLocked && showTooltip && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: '#1F2937',
          color: '#FFFFFF',
          fontSize: '12px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          Progress submissions are currently locked. Users cannot submit new progress updates.
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '4px solid #1F2937'
          }} />
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { Wrench } from 'lucide-react';

interface DesignInProgressProps {
  message?: string;
}

export default function DesignInProgress({ message = 'Design In Progress' }: DesignInProgressProps) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7F9FC',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '48px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E2E6ED'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(253, 67, 20, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Wrench size={40} style={{ color: '#FD4314' }} />
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          margin: 0
        }}>
          {message}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0,
          textAlign: 'center'
        }}>
          This section is currently under development
        </p>
      </div>
    </div>
  );
}

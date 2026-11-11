import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      fontSize: '13px'
    }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {index > 0 && (
            <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
          )}
          {item.path ? (
            <button
              onClick={() => navigate(item.path!)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0',
                color: '#6B7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '400'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FD4314';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6B7280';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              {item.label}
            </button>
          ) : (
            <span style={{
              color: '#272721',
              fontWeight: '500'
            }}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

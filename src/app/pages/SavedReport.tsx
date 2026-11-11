import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../components/EnterpriseTable';

interface SavedReport {
  id: string;
  name: string;
  type: 'Manhours' | 'Cost' | 'Quantity';
  periodStart: string;
  periodEnd: string;
  createdBy: string;
  createdDate: string;
  savedAs: 'System' | 'Client';
}

export default function SavedReport() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReportForDelete, setSelectedReportForDelete] = useState<string | null>(null);

  const mockSavedReports: SavedReport[] = [
    {
      id: '1',
      name: 'Jan 2026 Manhours Report',
      type: 'Manhours',
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
      createdBy: 'John Smith',
      createdDate: '2026-02-01',
      savedAs: 'System'
    },
    {
      id: '2',
      name: 'Dec 2025 Cost Report',
      type: 'Cost',
      periodStart: '2025-12-01',
      periodEnd: '2025-12-31',
      createdBy: 'Sarah Johnson',
      createdDate: '2026-01-02',
      savedAs: 'Client'
    },
    {
      id: '3',
      name: 'Jan 2026 Quantity Report',
      type: 'Quantity',
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
      createdBy: 'Mike Chen',
      createdDate: '2026-02-01',
      savedAs: 'System'
    }
  ];

  const handleViewSavedReport = (report: SavedReport) => {
    navigate(`/app/projects/${projectId}/reports/${report.id}`);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#F7F9FC',
      minHeight: 'calc(100vh - 64px)',
      padding: '24px 32px'
    }}>
      {/* Page Header */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          margin: '0 0 4px 0'
        }}>
          Saved Reports
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0'
        }}>
          View and manage all saved reports
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#E4EEF8',
              borderBottom: '1px solid #C8D9EE'
            }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Report Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Type</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Period Start</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Period End</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Created By</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Created Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Saved As</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockSavedReports.map((report, index) => (
              <tr
                key={report.id}
                onClick={() => handleViewSavedReport(report)}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                  borderBottom: '1px solid #E2E6ED',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF4EF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD'}
              >
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#272721', borderRight: '1px solid #E2E6ED' }}>{report.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>{report.type}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>
                  {formatDate(report.periodStart)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>
                  {formatDate(report.periodEnd)}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>{report.createdBy}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>
                  {formatDate(report.createdDate)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', borderRight: '1px solid #E2E6ED' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: report.savedAs === 'System' ? '#E8F5E9' : '#E3F2FD',
                    color: report.savedAs === 'System' ? '#2E7D32' : '#1565C0'
                  }}>
                    {report.savedAs === 'System' ? 'Saved to System' : 'Client Report'}
                  </span>
                </td>
                <td
                  style={{ padding: '12px 16px', textAlign: 'center' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setSelectedReportForDelete(report.id);
                      setShowDeleteModal(true);
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #FCA5A5',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#DC2626'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
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
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#272721',
              margin: '0 0 12px 0'
            }}>
              Delete Report
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 24px 0'
            }}>
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
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
                onClick={() => {
                  toast.success('Report deleted successfully');
                  setShowDeleteModal(false);
                  setSelectedReportForDelete(null);
                }}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

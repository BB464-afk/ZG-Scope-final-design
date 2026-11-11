import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Download, FileText, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../components/EnterpriseTable';

interface ActivityTaskReportRecord {
  id: string;
  reportName: string;
  periodStart: string;
  periodEnd: string;
  reportView: 'All Tasks' | 'Period Progress Only';
  generatedBy: string;
  generatedAt: string;
}

interface GenerateModalState {
  reportName: string;
  startDate: string;
  endDate: string;
  showOnlyWithProgress: boolean;
  reportType: 'Activity-wise' | 'Consolidated';
  errors: { reportName?: string; startDate?: string; endDate?: string };
}

const initialModal: GenerateModalState = {
  reportName: '',
  startDate: '',
  endDate: '',
  showOnlyWithProgress: false,
  reportType: 'Activity-wise',
  errors: {}
};

export default function ActivityTaskReport() {
  useParams<{ projectId: string }>();

  const [reports, setReports] = useState<ActivityTaskReportRecord[]>([
    {
      id: '1',
      reportName: 'Phase 1 Activity-Task Report',
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
      reportView: 'All Tasks',
      generatedBy: 'John Smith',
      generatedAt: '2026-02-01T09:14:00'
    },
    {
      id: '2',
      reportName: 'Q4 2025 Activity-Task Report',
      periodStart: '2025-10-01',
      periodEnd: '2025-12-31',
      reportView: 'Period Progress Only',
      generatedBy: 'Sarah Johnson',
      generatedAt: '2026-01-05T14:30:00'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<GenerateModalState>(initialModal);
  const [generating, setGenerating] = useState(false);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const validate = (): boolean => {
    const errors: GenerateModalState['errors'] = {};
    if (!modal.reportName.trim()) errors.reportName = 'Report Name is required.';
    if (!modal.startDate) errors.startDate = 'Start Date is required.';
    if (!modal.endDate) errors.endDate = 'End Date is required.';
    if (modal.startDate && modal.endDate && modal.endDate < modal.startDate) {
      errors.endDate = 'End Date cannot be before Start Date.';
    }
    setModal(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setGenerating(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      const newRecord: ActivityTaskReportRecord = {
        id: String(Date.now()),
        reportName: modal.reportName.trim(),
        periodStart: modal.startDate,
        periodEnd: modal.endDate,
        reportView: modal.showOnlyWithProgress ? 'Period Progress Only' : 'All Tasks',
        generatedBy: 'Current User',
        generatedAt: new Date().toISOString()
      };
      setReports(prev => [newRecord, ...prev]);
      setShowModal(false);
      setModal(initialModal);
      toast.success('Report generated successfully.');
    } catch {
      toast.error('Report generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report: ActivityTaskReportRecord) => {
    toast.success(`Downloading "${report.reportName}"…`);
  };

  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast.success('Report deleted.');
  };

  const handleModalClose = () => {
    if (!generating) {
      setShowModal(false);
      setModal(initialModal);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    height: '36px',
    padding: '0 12px',
    fontSize: '13px',
    color: '#272721',
    backgroundColor: '#FFFFFF',
    border: `1px solid ${hasError ? '#DC2626' : '#C8D9EE'}`,
    borderRadius: '4px',
    outline: 'none',
    boxSizing: 'border-box'
  });

  const errorStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#DC2626',
    marginTop: '4px'
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
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
            Activity-Task Report
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>
            Generate and download activity-task Excel workbooks
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            height: '36px',
            padding: '0 16px',
            backgroundColor: '#FD4314',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E03D12'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FD4314'; }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          Generate Report
        </button>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #C8D9EE',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        {reports.length === 0 ? (
          <div style={{
            padding: '64px 32px',
            textAlign: 'center'
          }}>
            <FileText size={40} style={{ color: '#C8D9EE', marginBottom: '16px' }} />
            <p style={{ fontSize: '15px', fontWeight: '500', color: '#374151', margin: '0 0 6px 0' }}>
              No Activity-Task Reports generated yet.
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0' }}>
              Generate a report to view it here.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#E4EEF8', borderBottom: '1px solid #C8D9EE' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE' }}>Report Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '220px' }}>Reporting Period</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '160px' }}>Report View</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '160px' }}>Generated By</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#272721', borderRight: '1px solid #C8D9EE', minWidth: '180px' }}>Generated Date & Time</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#272721', width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={report.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                    borderBottom: '1px solid #E2E6ED'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF4EF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F4F8FD'; }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: '#272721', borderRight: '1px solid #E2E6ED' }}>
                    {report.reportName}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>
                    {formatDate(report.periodStart)} – {formatDate(report.periodEnd)}
                  </td>
                  <td style={{ padding: '12px 16px', borderRight: '1px solid #E2E6ED' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: report.reportView === 'All Tasks' ? '#E4EEFE' : '#FFF0EB',
                      color: report.reportView === 'All Tasks' ? '#2563EB' : '#FD4314',
                      border: `1px solid ${report.reportView === 'All Tasks' ? '#BFDBFE' : '#FDD0C0'}`
                    }}>
                      {report.reportView}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>
                    {report.generatedBy}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280', borderRight: '1px solid #E2E6ED' }}>
                    {formatDateTime(report.generatedAt)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleDownload(report)}
                        title="Download Excel workbook"
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #C8D9EE',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#374151'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E4EEF8';
                          e.currentTarget.style.borderColor = '#93BFEE';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#C8D9EE';
                        }}
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        title="Delete report"
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #C8D9EE',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#6B7280'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFF0EB';
                          e.currentTarget.style.borderColor = '#FDD0C0';
                          e.currentTarget.style.color = '#FD4314';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#C8D9EE';
                          e.currentTarget.style.color = '#6B7280';
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate Report Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleModalClose}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #C8D9EE',
              borderRadius: '4px',
              width: '480px',
              maxWidth: '90%',
              padding: '0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #E2E6ED'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#272721', margin: 0 }}>
                Generate Activity-Task Report
              </h2>
              <button
                onClick={handleModalClose}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#6B7280',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              {/* Report Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Report Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={modal.reportName}
                  onChange={(e) => setModal(prev => ({ ...prev, reportName: e.target.value, errors: { ...prev.errors, reportName: undefined } }))}
                  placeholder="e.g. Phase 1 Activity-Task Report"
                  style={inputStyle(!!modal.errors.reportName)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = modal.errors.reportName ? '#DC2626' : '#FD4314'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = modal.errors.reportName ? '#DC2626' : '#C8D9EE'; }}
                />
                {modal.errors.reportName && <p style={errorStyle}>{modal.errors.reportName}</p>}
              </div>

              {/* Date Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
                {/* Start Date */}
                <div>
                  <label style={labelStyle}>
                    Start Date <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={modal.startDate}
                    onChange={(e) => setModal(prev => ({ ...prev, startDate: e.target.value, errors: { ...prev.errors, startDate: undefined, endDate: undefined } }))}
                    style={inputStyle(!!modal.errors.startDate)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = modal.errors.startDate ? '#DC2626' : '#FD4314'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = modal.errors.startDate ? '#DC2626' : '#C8D9EE'; }}
                  />
                  {modal.errors.startDate && <p style={errorStyle}>{modal.errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                  <label style={labelStyle}>
                    End Date <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={modal.endDate}
                    min={modal.startDate || undefined}
                    onChange={(e) => setModal(prev => ({ ...prev, endDate: e.target.value, errors: { ...prev.errors, endDate: undefined } }))}
                    style={inputStyle(!!modal.errors.endDate)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = modal.errors.endDate ? '#DC2626' : '#FD4314'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = modal.errors.endDate ? '#DC2626' : '#C8D9EE'; }}
                  />
                  {modal.errors.endDate && <p style={errorStyle}>{modal.errors.endDate}</p>}
                </div>
              </div>
              {/* Toggle: Show only tasks with progress */}
              <div style={{ marginTop: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: '#374151', userSelect: 'none', cursor: 'pointer' }}
                  onClick={() => setModal(prev => ({ ...prev, showOnlyWithProgress: !prev.showOnlyWithProgress }))}>
                  Show only tasks with progress during the selected period
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={modal.showOnlyWithProgress}
                  onClick={() => setModal(prev => ({ ...prev, showOnlyWithProgress: !prev.showOnlyWithProgress }))}
                  style={{
                    flexShrink: 0,
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: modal.showOnlyWithProgress ? '#FD4314' : '#D1D5DB',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s',
                    padding: 0
                  }}
                >
                  <span style={{
                    display: 'block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: modal.showOnlyWithProgress ? '19px' : '3px',
                    transition: 'left 0.2s'
                  }} />
                </button>
              </div>

              {/* Report Type */}
              <div style={{ marginBottom: '8px' }}>
                <label style={labelStyle}>Report Type</label>
                <select
                  value={modal.reportType}
                  onChange={(e) => setModal(prev => ({ ...prev, reportType: e.target.value as GenerateModalState['reportType'] }))}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '13px',
                    color: '#272721',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #C8D9EE',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    appearance: 'auto'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#FD4314'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#C8D9EE'; }}
                >
                  <option value="Activity-wise">Activity-wise</option>
                  <option value="Consolidated">Consolidated</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '14px 20px',
              borderTop: '1px solid #E2E6ED'
            }}>
              <button
                onClick={handleModalClose}
                disabled={generating}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  opacity: generating ? 0.6 : 1
                }}
                onMouseEnter={(e) => { if (!generating) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: 'none',
                  backgroundColor: generating ? '#F97C56' : '#FD4314',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => { if (!generating) e.currentTarget.style.backgroundColor = '#E03D12'; }}
                onMouseLeave={(e) => { if (!generating) e.currentTarget.style.backgroundColor = '#FD4314'; }}
              >
                {generating ? 'Generating…' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

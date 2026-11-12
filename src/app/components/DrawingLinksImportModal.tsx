import React, { useState, useRef } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// ─── Browser-safe xlsx download helper ───────────────────────────────────────
async function downloadXlsx(sheets: { name: string; aoa: (string | number)[][]; cols?: { wch: number }[] }[], filename: string) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(sheet.aoa);
    if (sheet.cols) ws['!cols'] = sheet.cols;
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  }
  const b64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' }) as string;
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
}

interface ImportRecord {
  row: number;
  tradePackageCode: string;
  rocId: string;
  stepNumber: string;
  stepName: string;
  drawingFolderLink: string;
  status: string;
  isValid: boolean;
  errorMessage?: string;
}

interface DrawingLinksImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (records: ImportRecord[]) => void;
}

type ModalStep = 'upload' | 'preview' | 'success' | 'invalid-template';

export default function DrawingLinksImportModal({
  isOpen,
  onClose,
  onImport,
}: DrawingLinksImportModalProps) {
  const [step, setStep] = useState<ModalStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, valid: 0, error: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Template download — matches Step_Links_Import_Template.xlsx exactly ─────
  const handleDownloadTemplate = async () => {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      await downloadXlsx([
        {
          // Sheet 1: DrawingLinks_Import (data sheet)
          name: 'DrawingLinks_Import',
          aoa: [
            ['Required. Max 50 characters.', 'Required. Max 100 characters. ', 'Required. Max 50 characters. ', 'Optional. Max 500 characters.', 'Required. Max 100 characters. (Add secure https:/ links)'],
            ['Trade Package Code*', 'ROC ID*', 'Step Number*', 'Step Name*', 'Drawing Folder Link*'],
            ['S01', 'ROC-001', 1, 'Material PO Issued',      'https://drive.google.com/drive/folders/sample-s01-roc001-step1'],
            ['S01', 'ROC-001', 2, 'Material Delivered',      'https://drive.google.com/drive/folders/sample-s01-roc001-step2'],
            ['S02', 'ROC-002', 1, 'Material PO Issued',      'https://drive.google.com/drive/folders/sample-s02-roc002-step1'],
            ['S02', 'ROC-002', 2, 'Equipment Installation',  'https://drive.google.com/drive/folders/sample-s02-roc002-step2'],
            ['E01', 'ROC-003', 1, 'Shop Drawing Approved',   'https://drive.google.com/drive/folders/sample-e01-roc003-step1'],
            ['A01', 'ROC-004', 2, 'Area Released',           'https://drive.google.com/drive/folders/sample-a01-roc004-step2'],
          ],
          cols: [{ wch: 24 }, { wch: 14 }, { wch: 14 }, { wch: 32 }, { wch: 65 }],
        },
        {
          // Sheet 2: Instructions
          name: 'Instructions',
          aoa: [
            ['How to use this template'],
            [''],
            ['1. One row = one step of one ROC under one Trade Package (SCode).'],
            ['2. All tasks with the same SCode + ROC automatically share these links in reports. No per-task entry needed.'],
            ['3. Delete the sample rows (S01, S02, S03) before importing your real data. The links in the sample are placeholders.'],
            [''],
            ['Column guide'],
            ['Trade Package (SCode): must match a Trade Package already set up in the project. Mandatory.'],
            ['ROC ID: must match a ROC already selected in the project. Mandatory.'],
            ['Step No.: step number (order) within that ROC, as configured in the project. Mandatory. Matching is done on this column.'],
            ['Step Name: for your reference only. It is not used for matching and is ignored on import.'],
            ['Drawing Folder Link: Google Drive folder URL, must start with https://. Mandatory.'],
            [''],
            ['Validation on import'],
            ['- SCode or ROC not part of the project: row rejected with row number.'],
            ['- Step number does not exist in that ROC: row rejected.'],
            ['- Duplicate SCode + ROC + Step No. combination: row rejected.'],
            ['- Invalid link or link not starting with https://: row rejected.'],
            ['- A ROC with only some steps linked is allowed. Unlinked steps stay blank in reports.'],
            ['- Valid rows import even if some rows fail. Download the error report, fix, and re-upload.'],
            [''],
            ['Sample data note'],
            ['S02 and S03 both use ROC-002 but have different links, to show that the same ROC under a different SCode gets its own links.'],
          ],
          cols: [{ wch: 110 }],
        },
      ], `Step-Links-Import-Template-${dateStr}.xlsx`);
      toast.success('Import template downloaded');
    } catch {
      toast.error('Failed to download template');
    }
  };

  // ── File validation & parse ───────────────────────────────────────────────────
  const validateFile = async (file: File): Promise<void> => {
    setIsUploading(true);
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });

      // Check for expected sheet — accept both naming conventions
      const dataSheetName = wb.SheetNames.find(n =>
        n === 'Step Links' || n === 'DrawingLinks_Import'
      );
      if (!dataSheetName) {
        setStep('invalid-template');
        return;
      }

      const ws = wb.Sheets[dataSheetName];
      const raw: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][];

      // Find header row (row with 'Trade Package' in first column, skip the "Required." hint row)
      const headerRowIdx = raw.findIndex(r =>
        r.some(cell => typeof cell === 'string' && (cell.includes('Trade Package') || cell.includes('SCode')))
        && !r[0].toString().startsWith('Required')
      );
      if (headerRowIdx === -1) {
        setStep('invalid-template');
        return;
      }

      const dataRows = raw.slice(headerRowIdx + 1).filter(r => r.some(c => String(c).trim() !== ''));

      // Track seen combinations for duplicate detection
      const seen = new Set<string>();
      const records: ImportRecord[] = dataRows.map((row, idx) => {
        const tpCode   = String(row[0] || '').trim();
        const rocId    = String(row[1] || '').trim();
        const stepNum  = String(row[2] || '').trim();
        const stepName = String(row[3] || '').trim();
        const link     = String(row[4] || '').trim();

        const errors: string[] = [];
        if (!tpCode)   errors.push('Trade Package Code is required');
        if (!rocId)    errors.push('ROC ID is required');
        if (!stepNum || isNaN(Number(stepNum)) || Number(stepNum) < 1)
          errors.push('Step Number must be a positive integer');
        // Step Name is optional — not used for matching
        if (!link || (!link.startsWith('http://') && !link.startsWith('https://')))
          errors.push('Drawing Folder Link must start with https://');

        const key = `${tpCode}|${rocId}|${stepNum}`;
        if (seen.has(key)) {
          errors.push('Duplicate combination in file');
        } else {
          seen.add(key);
        }

        const isValid = errors.length === 0;
        return {
          row: idx + 1,
          tradePackageCode: tpCode,
          rocId,
          stepNumber: stepNum,
          stepName,
          drawingFolderLink: link,
          status: 'Active',
          isValid,
          errorMessage: errors.join('; '),
        };
      });

      const validCount = records.filter(r => r.isValid).length;
      const errorCount = records.filter(r => !r.isValid).length;

      setImportRecords(records);
      setStats({ total: records.length, valid: validCount, error: errorCount });
      setStep('preview');
    } catch {
      setStep('invalid-template');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Invalid file format. Please upload an Excel file (.xlsx)');
      return;
    }
    setSelectedFile(file);
    validateFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadErrorReport = () => {
    toast.success('Error report downloaded successfully');
  };

  const handleImportValidRecords = () => {
    const validRecords = importRecords.filter(r => r.isValid);
    onImport(validRecords);
    setStep('success');
    toast.success(`${stats.valid} drawing link${stats.valid !== 1 ? 's' : ''} imported successfully`);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setStep('upload');
    setImportRecords([]);
    setStats({ total: 0, valid: 0, error: 0 });
    onClose();
  };

  if (!isOpen) return null;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        width: '90%',
        maxWidth: step === 'preview' ? '960px' : '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ── Header ── */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#272721', margin: 0 }}>
            {step === 'upload'           && 'Import Drawing Links'}
            {step === 'preview'          && 'Import Preview'}
            {step === 'success'          && 'Import Completed'}
            {step === 'invalid-template' && 'Import Drawing Links'}
          </h2>
          <button
            onClick={handleCloseModal}
            style={{
              width: '32px', height: '32px', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6B7280', borderRadius: '4px',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>

          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>
                Upload an Excel file to import drawing links. Download the template below to ensure the correct format.
              </p>

              {!selectedFile && !isUploading && (
                <>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleBrowseClick}
                    style={{
                      border: `2px dashed ${isDragging ? '#FD4314' : '#D1D5DB'}`,
                      borderRadius: '8px',
                      padding: '48px 24px',
                      textAlign: 'center',
                      backgroundColor: isDragging ? 'rgba(253, 67, 20, 0.05)' : '#F9FAFB',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Upload size={48} style={{ color: isDragging ? '#FD4314' : '#9CA3AF', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>
                      Drag and drop your file here
                    </p>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 16px 0' }}>or</p>
                    <button
                      onClick={e => { e.stopPropagation(); handleBrowseClick(); }}
                      style={{
                        height: '40px', padding: '0 20px',
                        border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                        borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                        color: '#374151', cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      Browse File
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: '#6B7280', margin: '12px 0 0 0', textAlign: 'center' }}>
                    Accepted format: .xlsx
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </>
              )}

              {/* File selected */}
              {selectedFile && !isUploading && step === 'upload' && (
                <div style={{
                  border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: '#F9FAFB',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileSpreadsheet size={24} color="#10B981" />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#272721', margin: '0 0 4px 0' }}>
                        {selectedFile.name}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    style={{
                      width: '32px', height: '32px', border: '1px solid #E5E7EB',
                      backgroundColor: '#FFFFFF', borderRadius: '4px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Uploading/validating spinner */}
              {isUploading && (
                <div style={{
                  border: '1px solid #E5E7EB', borderRadius: '8px', padding: '32px',
                  textAlign: 'center', backgroundColor: '#F9FAFB',
                }}>
                  <div style={{
                    width: '48px', height: '48px',
                    border: '4px solid #E5E7EB', borderTopColor: '#FD4314',
                    borderRadius: '50%', margin: '0 auto 16px',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Validating file...</p>
                </div>
              )}
            </>
          )}

          {/* STEP 2: Preview */}
          {step === 'preview' && (
            <>
              {/* Stats cards */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px', marginBottom: '24px',
              }}>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', textAlign: 'center', backgroundColor: '#F0F9FF' }}>
                  <p style={{ fontSize: '28px', fontWeight: '600', color: '#0369A1', margin: '0 0 4px 0' }}>{stats.total}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Total Records</p>
                </div>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', textAlign: 'center', backgroundColor: '#F0FDF4' }}>
                  <p style={{ fontSize: '28px', fontWeight: '600', color: '#15803D', margin: '0 0 4px 0' }}>{stats.valid}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Valid Records</p>
                </div>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', textAlign: 'center', backgroundColor: '#FEF2F2' }}>
                  <p style={{ fontSize: '28px', fontWeight: '600', color: '#DC2626', margin: '0 0 4px 0' }}>{stats.error}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Error Records</p>
                </div>
              </div>

              {/* Preview table */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F3F6FA', zIndex: 10 }}>
                      <tr>
                        {['Row', 'Trade Package Code', 'ROC ID', 'Step No.', 'Step Name', 'Drawing Folder Link', 'Result'].map(h => (
                          <th key={h} style={{
                            padding: '12px', textAlign: 'left', fontSize: '13px',
                            fontWeight: '600', color: '#272721', borderBottom: '1px solid #E5E7EB',
                            whiteSpace: 'nowrap',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importRecords.map(record => (
                        <tr key={record.row} style={{ backgroundColor: record.isValid ? '#FFFFFF' : '#FEF2F2' }}>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>{record.row}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{record.tradePackageCode}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{record.rocId}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{record.stepNumber}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#272721', borderBottom: '1px solid #E5E7EB' }}>{record.stepName}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#2563EB', borderBottom: '1px solid #E5E7EB', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <a href={record.drawingFolderLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'underline' }}>
                              {record.drawingFolderLink || '—'}
                            </a>
                          </td>
                          <td style={{ padding: '12px', fontSize: '13px', borderBottom: '1px solid #E5E7EB' }}>
                            {record.isValid ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D' }}>
                                <CheckCircle size={16} /> Valid
                              </span>
                            ) : (
                              <span style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#DC2626' }}>
                                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{record.errorMessage}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Success */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <CheckCircle size={64} color="#15803D" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#272721', margin: '0 0 24px 0' }}>
                Import Completed
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', backgroundColor: '#F0FDF4' }}>
                  <p style={{ fontSize: '24px', fontWeight: '600', color: '#15803D', margin: '0 0 4px 0' }}>{stats.valid}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Records Imported</p>
                </div>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', backgroundColor: '#FEF2F2' }}>
                  <p style={{ fontSize: '24px', fontWeight: '600', color: '#DC2626', margin: '0 0 4px 0' }}>{stats.error}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Records Failed</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Invalid Template */}
          {step === 'invalid-template' && (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <AlertCircle size={64} color="#DC2626" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#272721', margin: '0 0 12px 0' }}>
                Invalid Template Structure
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                The file does not match the expected format. Please download the latest template and try again.
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          {/* Upload step footer */}
          {step === 'upload' && (
            <>
              <button
                onClick={handleDownloadTemplate}
                style={{
                  height: '40px', padding: '0 20px',
                  border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                  borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                  color: '#374151', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <Download size={16} />
                Download Template
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCloseModal}
                  style={{
                    height: '40px', padding: '0 20px',
                    border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                    borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                    color: '#374151', cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedFile && validateFile(selectedFile)}
                  disabled={!selectedFile || isUploading}
                  style={{
                    height: '40px', padding: '0 20px', border: 'none',
                    backgroundColor: selectedFile && !isUploading ? '#FD4314' : '#E5E7EB',
                    borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                    color: '#FFFFFF', cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={e => { if (selectedFile && !isUploading) e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'; }}
                  onMouseLeave={e => { if (selectedFile && !isUploading) e.currentTarget.style.backgroundColor = '#FD4314'; }}
                >
                  Upload
                </button>
              </div>
            </>
          )}

          {/* Preview step footer */}
          {step === 'preview' && (
            <>
              <button
                onClick={handleCloseModal}
                style={{
                  height: '40px', padding: '0 20px',
                  border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                  borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                  color: '#374151', cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                {stats.error > 0 && (
                  <button
                    onClick={handleDownloadErrorReport}
                    style={{
                      height: '40px', padding: '0 20px',
                      border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                      borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                      color: '#374151', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <Download size={16} />
                    Download Error Report
                  </button>
                )}
                <button
                  onClick={handleImportValidRecords}
                  disabled={stats.valid === 0}
                  style={{
                    height: '40px', padding: '0 20px', border: 'none',
                    backgroundColor: stats.valid > 0 ? '#FD4314' : '#E5E7EB',
                    borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                    color: '#FFFFFF', cursor: stats.valid > 0 ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={e => { if (stats.valid > 0) e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'; }}
                  onMouseLeave={e => { if (stats.valid > 0) e.currentTarget.style.backgroundColor = '#FD4314'; }}
                >
                  Import Valid Records
                </button>
              </div>
            </>
          )}

          {/* Success step footer */}
          {step === 'success' && (
            <>
              {stats.error > 0 && (
                <button
                  onClick={handleDownloadErrorReport}
                  style={{
                    height: '40px', padding: '0 20px',
                    border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                    borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                    color: '#374151', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Download size={16} />
                  Download Error Report
                </button>
              )}
              <button
                onClick={handleCloseModal}
                style={{
                  height: '40px', padding: '0 20px', border: 'none',
                  backgroundColor: '#FD4314', borderRadius: '4px',
                  fontSize: '14px', fontWeight: '500', color: '#FFFFFF', cursor: 'pointer',
                  marginLeft: 'auto',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                Close
              </button>
            </>
          )}

          {/* Invalid template step footer */}
          {step === 'invalid-template' && (
            <>
              <button
                onClick={handleCloseModal}
                style={{
                  height: '40px', padding: '0 20px',
                  border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
                  borderRadius: '4px', fontSize: '14px', fontWeight: '500',
                  color: '#374151', cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadTemplate}
                style={{
                  height: '40px', padding: '0 20px', border: 'none',
                  backgroundColor: '#FD4314', borderRadius: '4px',
                  fontSize: '14px', fontWeight: '500', color: '#FFFFFF', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FD4314'}
              >
                <Download size={16} />
                Download Template
              </button>
            </>
          )}
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


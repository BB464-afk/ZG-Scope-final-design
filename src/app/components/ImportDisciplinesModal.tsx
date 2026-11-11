import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImportRecord {
  row: number;
  code: string;
  name: string;
  status: string;
  isValid: boolean;
  errorMessage?: string;
}

interface ImportDisciplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = 'upload' | 'uploading' | 'preview' | 'success' | 'invalidTemplate';

export default function ImportDisciplinesModal({ isOpen, onClose }: ImportDisciplinesModalProps) {
  const [modalState, setModalState] = useState<ModalState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const [importStats, setImportStats] = useState({
    total: 0,
    valid: 0,
    errors: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for preview
  const MOCK_IMPORT_DATA: ImportRecord[] = [
    { row: 1, code: 'CIV', name: 'Civil', status: 'Active', isValid: true },
    { row: 2, code: 'ELE', name: 'Electrical', status: 'Active', isValid: true },
    { row: 3, code: 'CIV', name: 'Structural', status: 'Active', isValid: false, errorMessage: 'Discipline Code already exists' },
    { row: 4, code: 'MEP', name: 'Mechanical', status: 'Active', isValid: true },
    { row: 5, code: 'ARC', name: 'Architectural', status: 'Active', isValid: true },
    { row: 6, code: 'PLM', name: 'Plumbing', status: 'Active', isValid: true },
    { row: 7, code: 'HVC', name: 'HVAC', status: 'Active', isValid: true },
    { row: 8, code: 'FIR', name: 'Fire Protection', status: 'Active', isValid: true },
    { row: 9, code: 'MEP', name: 'MEP Systems', status: 'Active', isValid: false, errorMessage: 'Duplicate Discipline Code in file' },
    { row: 10, code: 'STR', name: 'Structural', status: 'Active', isValid: true },
  ];

  const handleClose = () => {
    setModalState('upload');
    setSelectedFile(null);
    setImportRecords([]);
    setImportStats({ total: 0, valid: 0, errors: 0 });
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Invalid file format. Please upload .xlsx file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    // Simulate upload and validation
    setModalState('uploading');

    // Simulate API call
    setTimeout(() => {
      // Random: 90% chance valid template, 10% invalid
      const isValidTemplate = Math.random() > 0.1;

      if (!isValidTemplate) {
        setModalState('invalidTemplate');
        return;
      }

      // Process mock data
      const validRecords = MOCK_IMPORT_DATA.filter(r => r.isValid).length;
      const errorRecords = MOCK_IMPORT_DATA.filter(r => !r.isValid).length;

      setImportRecords(MOCK_IMPORT_DATA);
      setImportStats({
        total: MOCK_IMPORT_DATA.length,
        valid: validRecords,
        errors: errorRecords
      });
      setModalState('preview');
    }, 2000);
  };

  const handleImportValidRecords = () => {
    // Simulate import
    const validRecords = importRecords.filter(r => r.isValid);
    
    setTimeout(() => {
      setModalState('success');
      toast.success(`${validRecords.length} records imported successfully`);
    }, 1000);
  };

  const handleDownloadErrorReport = () => {
    toast.success('Error report downloaded');
    // In real implementation, this would download an Excel file with errors
  };

  const handleDownloadTemplate = () => {
    toast.success('Template downloaded');
    // In real implementation, this would download the template Excel file
  };

  if (!isOpen) return null;

  return (
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
        width: modalState === 'preview' ? '900px' : '560px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E6ED',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#272721',
            margin: 0
          }}>
            {modalState === 'upload' || modalState === 'uploading' ? 'Import Disciplines' :
             modalState === 'preview' ? 'Import Preview' :
             modalState === 'success' ? 'Import Completed' :
             'Invalid Template'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {/* Upload State */}
          {modalState === 'upload' && (
            <>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 24px 0'
              }}>
                Upload Excel file to create new disciplines.
              </p>

              {!selectedFile ? (
                <>
                  {/* Drag & Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                      border: `2px dashed ${isDragging ? '#FD4314' : '#D1D5DB'}`,
                      borderRadius: '8px',
                      padding: '48px 24px',
                      textAlign: 'center',
                      backgroundColor: isDragging ? '#FFF5F2' : '#F9FAFB',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={handleBrowseClick}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Upload size={28} color="#6B7280" />
                      </div>
                      
                      <div>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: '500',
                          color: '#272721',
                          margin: '0 0 8px 0'
                        }}>
                          Drag and drop your file here
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#6B7280',
                          margin: '0 0 16px 0'
                        }}>
                          or
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBrowseClick();
                          }}
                          style={{
                            padding: '8px 20px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151',
                            cursor: 'pointer'
                          }}
                        >
                          Browse File
                        </button>
                      </div>

                      <p style={{
                        fontSize: '13px',
                        color: '#9CA3AF',
                        margin: 0
                      }}>
                        Accepted format: .xlsx
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </>
              ) : (
                /* File Selected State */
                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileSpreadsheet size={20} color="#10B981" />
                    </div>
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#272721',
                        margin: '0 0 4px 0'
                      }}>
                        {selectedFile.name}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        margin: 0
                      }}>
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#6B7280'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Uploading State */}
          {modalState === 'uploading' && (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                border: '4px solid #F3F4F6',
                borderTopColor: '#FD4314',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#272721',
                margin: '0 0 8px 0'
              }}>
                Uploading and validating...
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                Please wait while we process your file
              </p>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          )}

          {/* Preview State */}
          {modalState === 'preview' && (
            <>
              {/* Summary Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#1E40AF',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    Total Records
                  </p>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#1E40AF',
                    margin: 0
                  }}>
                    {importStats.total}
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '8px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#065F46',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    Valid Records
                  </p>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#10B981',
                    margin: 0
                  }}>
                    {importStats.valid}
                  </p>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#991B1B',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    Error Records
                  </p>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#EF4444',
                    margin: 0
                  }}>
                    {importStats.errors}
                  </p>
                </div>
              </div>

              {/* Preview Table */}
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead style={{
                      position: 'sticky',
                      top: 0,
                      backgroundColor: '#F9FAFB',
                      zIndex: 1
                    }}>
                      <tr>
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          width: '60px'
                        }}>Row</th>
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          width: '150px'
                        }}>Discipline Code</th>
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB'
                        }}>Discipline Name</th>
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          width: '100px'
                        }}>Status</th>
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#272721',
                          borderBottom: '1px solid #E5E7EB',
                          width: '200px'
                        }}>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importRecords.map((record) => (
                        <tr
                          key={record.row}
                          style={{
                            backgroundColor: record.isValid ? '#FFFFFF' : '#FEF2F2'
                          }}
                        >
                          <td style={{
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: '#6B7280',
                            borderBottom: '1px solid #E5E7EB'
                          }}>{record.row}</td>
                          <td style={{
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB',
                            fontWeight: '500'
                          }}>{record.code}</td>
                          <td style={{
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB'
                          }}>{record.name}</td>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #E5E7EB'
                          }}>
                            <span style={{
                              padding: '4px 8px',
                              backgroundColor: '#D1FAE5',
                              color: '#065F46',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '12px',
                              border: '1px solid #A7F3D0'
                            }}>
                              {record.status}
                            </span>
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #E5E7EB'
                          }}>
                            {record.isValid ? (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#10B981',
                                fontSize: '13px',
                                fontWeight: '500'
                              }}>
                                <CheckCircle2 size={16} />
                                Valid
                              </div>
                            ) : (
                              <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                                color: '#EF4444',
                                fontSize: '13px'
                              }}>
                                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <span>{record.errorMessage}</span>
                              </div>
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

          {/* Success State */}
          {modalState === 'success' && (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={32} color="#10B981" />
              </div>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 16px 0'
              }}>
                Import Successful
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '15px',
                  color: '#272721',
                  margin: 0
                }}>
                  <strong>Records Imported:</strong> {importStats.valid}
                </p>
                {importStats.errors > 0 && (
                  <p style={{
                    fontSize: '15px',
                    color: '#EF4444',
                    margin: 0
                  }}>
                    <strong>Records Failed:</strong> {importStats.errors}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Invalid Template State */}
          {modalState === 'invalidTemplate' && (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={32} color="#EF4444" />
              </div>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#272721',
                margin: '0 0 12px 0'
              }}>
                Invalid Template Structure
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                Please download the latest template and try again.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E6ED',
          display: 'flex',
          justifyContent: modalState === 'preview' || modalState === 'success' ? 'space-between' : 'flex-end',
          gap: '12px'
        }}>
          {modalState === 'upload' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                style={{
                  padding: '10px 24px',
                  backgroundColor: selectedFile ? '#FD4314' : '#D1D5DB',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: selectedFile ? 'pointer' : 'not-allowed'
                }}
              >
                Upload
              </button>
            </>
          )}

          {modalState === 'preview' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                {importStats.errors > 0 && (
                  <button
                    onClick={handleDownloadErrorReport}
                    style={{
                      padding: '10px 24px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Download size={16} />
                    Download Error Report
                  </button>
                )}
                <button
                  onClick={handleImportValidRecords}
                  disabled={importStats.valid === 0}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: importStats.valid > 0 ? '#FD4314' : '#D1D5DB',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: importStats.valid > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Import Valid Records
                </button>
              </div>
            </>
          )}

          {modalState === 'success' && (
            <>
              {importStats.errors > 0 && (
                <button
                  onClick={handleDownloadErrorReport}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={16} />
                  Download Error Report
                </button>
              )}
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#FD4314',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </>
          )}

          {modalState === 'invalidTemplate' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadTemplate}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#FD4314',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={16} />
                Download Template
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
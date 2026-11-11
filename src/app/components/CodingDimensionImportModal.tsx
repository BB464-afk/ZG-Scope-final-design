import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImportRecord {
  row: number;
  code: string;
  name: string;
  status: string;
  isValid: boolean;
  errorMessage?: string;
}

interface CodingDimensionImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dimensionName: string;
}

type ModalStep = 'upload' | 'preview' | 'success' | 'invalid-template';

export default function CodingDimensionImportModal({ isOpen, onClose, dimensionName }: CodingDimensionImportModalProps) {
  const [step, setStep] = useState<ModalStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, valid: 0, error: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  // Mock validation - in real app this would call an API
  const validateFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      
      // Simulate validation delay
      validationTimeoutRef.current = setTimeout(() => {
        // Check if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        setIsUploading(false);
        
        // Mock: Check if valid template (in real app, parse Excel)
        const isValidTemplate = Math.random() > 0.1; // 90% chance of valid template
        
        if (!isValidTemplate) {
          setStep('invalid-template');
          reject(new Error('Invalid template'));
          return;
        }

        // Mock parsed data with some errors
        const mockRecords: ImportRecord[] = [
          { row: 1, code: 'A01', name: 'North Wing', status: 'Active', isValid: true },
          { row: 2, code: 'A02', name: 'South Wing', status: 'Active', isValid: true },
          { row: 3, code: 'A01', name: 'East Tower', status: 'Active', isValid: false, errorMessage: 'Code already exists' },
          { row: 4, code: 'A03', name: 'West Wing', status: 'Active', isValid: true },
          { row: 5, code: 'A04', name: 'Central Hub', status: 'Active', isValid: true },
          { row: 6, code: 'A05', name: 'Basement Level', status: 'Active', isValid: true },
          { row: 7, code: 'A06', name: 'Rooftop Area', status: 'Active', isValid: true },
          { row: 8, code: 'A02', name: 'Parking Area', status: 'Active', isValid: false, errorMessage: 'Duplicate Code in file' },
        ];

        const validCount = mockRecords.filter(r => r.isValid).length;
        const errorCount = mockRecords.filter(r => !r.isValid).length;

        setImportRecords(mockRecords);
        setStats({
          total: mockRecords.length,
          valid: validCount,
          error: errorCount
        });
        setStep('preview');
        resolve();
      }, 1500);
    });
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Invalid file format. Please upload an Excel file (.xlsx)');
      return;
    }
    
    setSelectedFile(file);
    validateFile(file).catch(() => {
      // Error handled by setting step to 'invalid-template'
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadErrorReport = () => {
    toast.success('Error report downloaded successfully');
  };

  const handleDownloadTemplate = () => {
    toast.success('Template downloaded successfully');
  };

  const handleTryAgain = () => {
    setSelectedFile(null);
    setStep('upload');
    setImportRecords([]);
    setStats({ total: 0, valid: 0, error: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportValidRecords = () => {
    setStep('success');
    toast.success(`${stats.valid} ${dimensionName} values imported successfully`);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setStep('upload');
    setImportRecords([]);
    setStats({ total: 0, valid: 0, error: 0 });
    onClose();
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
      zIndex: 1100
    }}
    onClick={isUploading ? undefined : handleCloseModal}
    >
      {/* Validation Spinner - Replaces modal content */}
      {isUploading && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '400px'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #E5E7EB',
            borderTopColor: '#FD4314',
            borderRadius: '50%',
            margin: '0 auto 24px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#272721',
            margin: '0 0 8px 0'
          }}>
            Validating File
          </p>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            Please wait while we validate your import file...
          </p>
        </div>
      )}

      {/* Success Modal - Replaces modal content */}
      {!isUploading && step === 'success' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          padding: '48px',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle 
            size={64} 
            color="#15803D" 
            style={{ margin: '0 auto 24px' }}
          />
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#272721',
            margin: '0 0 12px 0'
          }}>
            Import Completed
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '0 0 32px 0'
          }}>
            Your data has been successfully imported.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#F0FDF4'
            }}>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#15803D',
                margin: '0 0 4px 0'
              }}>
                {stats.valid}
              </p>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Records Imported
              </p>
            </div>
            <div style={{
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#FEF2F2'
            }}>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#DC2626',
                margin: '0 0 4px 0'
              }}>
                {stats.error}
              </p>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Records Failed
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            style={{
              width: '100%',
              height: '44px',
              border: 'none',
              backgroundColor: '#FD4314',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
          >
            Done
          </button>
        </div>
      )}

      {/* Main Import Modal - Upload, Preview, Invalid Template */}
      {!isUploading && step !== 'success' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          width: '90%',
          maxWidth: step === 'preview' ? '900px' : '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #E5E7EB',
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
              {step === 'upload' && `Import ${dimensionName} Values`}
              {step === 'preview' && 'Import Preview'}
              {step === 'success' && 'Import Completed'}
              {step === 'invalid-template' && `Import ${dimensionName} Values`}
            </h2>
            <button
              onClick={handleCloseModal}
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{
            padding: '24px',
            flex: 1,
            overflowY: 'auto'
          }}>
            {/* STEP 1: Upload */}
            {step === 'upload' && (
              <>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 24px 0'
                }}>
                  Upload Excel file to create new {dimensionName.toLowerCase()} values.
                </p>

                {!selectedFile && !isUploading && (
                  <>
                    {/* Drag & Drop Area */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      style={{
                        border: `2px dashed ${isDragging ? '#FD4314' : '#D1D5DB'}`,
                        borderRadius: '8px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        backgroundColor: isDragging ? 'rgba(253, 67, 20, 0.05)' : '#F9FAFB',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={handleBrowseClick}
                    >
                      <Upload 
                        size={48} 
                        style={{ 
                          color: isDragging ? '#FD4314' : '#9CA3AF',
                          margin: '0 auto 16px'
                        }} 
                      />
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        margin: '0 0 8px 0'
                      }}>
                        Drag and drop your file here
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: '#9CA3AF',
                        margin: '0 0 16px 0'
                      }}>
                        or
                      </p>
                      <button
                        onClick={handleBrowseClick}
                        style={{
                          height: '40px',
                          padding: '0 20px',
                          border: '1px solid #D1D5DB',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      >
                        Browse File
                      </button>
                    </div>

                    <p style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      margin: '12px 0 0 0',
                      textAlign: 'center'
                    }}>
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

                {/* File Selected State */}
                {selectedFile && !isUploading && (
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F9FAFB'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileSpreadsheet size={24} color="#10B981" />
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
                        width: '32px',
                        height: '32px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6B7280'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Uploading State */}
                {isUploading && (
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '32px',
                    textAlign: 'center',
                    backgroundColor: '#F9FAFB'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      border: '4px solid #E5E7EB',
                      borderTopColor: '#FD4314',
                      borderRadius: '50%',
                      margin: '0 auto 16px',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      margin: 0
                    }}>
                      Validating file...
                    </p>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: Preview */}
            {step === 'preview' && (
              <>
                {/* Summary Section */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {/* Total Records */}
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#F0F9FF'
                  }}>
                    <p style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#0369A1',
                      margin: '0 0 4px 0'
                    }}>
                      {stats.total}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      margin: 0
                    }}>
                      Total Records
                    </p>
                  </div>

                  {/* Valid Records */}
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#F0FDF4'
                  }}>
                    <p style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#15803D',
                      margin: '0 0 4px 0'
                    }}>
                      {stats.valid}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      margin: 0
                    }}>
                      Valid Records
                    </p>
                  </div>

                  {/* Error Records */}
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: '#FEF2F2'
                  }}>
                    <p style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#DC2626',
                      margin: '0 0 4px 0'
                    }}>
                      {stats.error}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      margin: 0
                    }}>
                      Error Records
                    </p>
                  </div>
                </div>

                {/* Preview Table */}
                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
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
                        backgroundColor: '#F3F6FA',
                        zIndex: 10
                      }}>
                        <tr>
                          <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB',
                            width: '60px'
                          }}>
                            Row
                          </th>
                          <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB'
                          }}>
                            Code
                          </th>
                          <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB'
                          }}>
                            Name
                          </th>
                          <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB',
                            width: '100px'
                          }}>
                            Status
                          </th>
                          <th style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#272721',
                            borderBottom: '1px solid #E5E7EB',
                            width: '250px'
                          }}>
                            Result
                          </th>
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
                              padding: '12px',
                              fontSize: '13px',
                              color: '#6B7280',
                              borderBottom: '1px solid #E5E7EB'
                            }}>
                              {record.row}
                            </td>
                            <td style={{
                              padding: '12px',
                              fontSize: '13px',
                              color: '#272721',
                              borderBottom: '1px solid #E5E7EB'
                            }}>
                              {record.code}
                            </td>
                            <td style={{
                              padding: '12px',
                              fontSize: '13px',
                              color: '#272721',
                              borderBottom: '1px solid #E5E7EB'
                            }}>
                              {record.name}
                            </td>
                            <td style={{
                              padding: '12px',
                              fontSize: '13px',
                              color: '#272721',
                              borderBottom: '1px solid #E5E7EB'
                            }}>
                              {record.status}
                            </td>
                            <td style={{
                              padding: '12px',
                              fontSize: '13px',
                              borderBottom: '1px solid #E5E7EB'
                            }}>
                              {record.isValid ? (
                                <span style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  color: '#15803D'
                                }}>
                                  <CheckCircle size={16} />
                                  Valid
                                </span>
                              ) : (
                                <span style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '6px',
                                  color: '#DC2626'
                                }}>
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

            {/* STEP 4: Invalid Template */}
            {step === 'invalid-template' && (
              <div style={{
                textAlign: 'center',
                padding: '32px'
              }}>
                <AlertCircle 
                  size={64} 
                  color="#DC2626" 
                  style={{ margin: '0 auto 24px' }}
                />
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
            padding: '24px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            {step === 'upload' && (
              <>
                {/* Left Side - Download Template */}
                <button
                  onClick={handleDownloadTemplate}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Download size={16} />
                  Download Template
                </button>

                {/* Right Side - Cancel and Upload */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedFile && validateFile(selectedFile)}
                    disabled={!selectedFile || isUploading}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: 'none',
                      backgroundColor: !selectedFile || isUploading ? '#D1D5DB' : '#FD4314',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#FFFFFF',
                      cursor: !selectedFile || isUploading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFile && !isUploading) {
                        e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFile && !isUploading) {
                        e.currentTarget.style.backgroundColor = '#FD4314';
                      }
                    }}
                  >
                    Upload
                  </button>
                </div>
              </>
            )}

            {step === 'preview' && (
              <>
                {/* Left Side - Download Error Report (only if errors exist) */}
                <div>
                  {stats.error > 0 && (
                    <button
                      onClick={handleDownloadErrorReport}
                      style={{
                        height: '40px',
                        padding: '0 20px',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <Download size={16} />
                      Download Error Report
                    </button>
                  )}
                </div>

                {/* Right Side - Cancel and Import */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportValidRecords}
                    disabled={stats.valid === 0}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: 'none',
                      backgroundColor: stats.valid === 0 ? '#D1D5DB' : '#FD4314',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#FFFFFF',
                      cursor: stats.valid === 0 ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (stats.valid > 0) {
                        e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (stats.valid > 0) {
                        e.currentTarget.style.backgroundColor = '#FD4314';
                      }
                    }}
                  >
                    Import {stats.valid} Valid Record{stats.valid !== 1 ? 's' : ''}
                  </button>
                </div>
              </>
            )}

            {step === 'invalid-template' && (
              <>
                <button
                  onClick={handleDownloadTemplate}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Download size={16} />
                  Download Template
                </button>

                <button
                  onClick={handleTryAgain}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    border: 'none',
                    backgroundColor: '#FD4314',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 67, 20, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD4314'}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
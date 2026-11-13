import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  Trash2,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  File,
  Paperclip,
  Eye,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Archive,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

// ── Shared Drawing Links data (mirrors DrawingLinks.tsx INITIAL_LINKS) ─────────
interface DrawingLinkRecord {
  id: number;
  tradePackageCode: string;
  tradePackageName: string;
  rocId: string;
  stepNumber: number;
  stepName: string;
  drawingFolderLink: string;
  updatedBy: string;
  updatedOn: string;
}

const ALL_DRAWING_LINKS: DrawingLinkRecord[] = [
  { id: 1, tradePackageCode: 'S15-A5000', tradePackageName: 'EYD Fuel Oil Electrical Assembly', rocId: 'ROC-001', stepNumber: 1, stepName: 'Material PO Issued', drawingFolderLink: 'https://drive.google.com/file/d/1RHH8mRH_6DIgm4JSkRgHlkKx1ty2CP-D/view?usp=sharing', updatedBy: 'Christian Feichtinger', updatedOn: '14/10/2026 09:00 AM' },
  { id: 2, tradePackageCode: 'S15-A5000', tradePackageName: 'EYD Fuel Oil Electrical Assembly', rocId: 'ROC-001', stepNumber: 2, stepName: 'Material Delivered to Site', drawingFolderLink: 'https://drive.google.com/file/d/1RHH8mRH_6DIgm4JSkRgHlkKx1ty2CP-D/view?usp=sharing', updatedBy: 'Christian Feichtinger', updatedOn: '14/10/2026 09:15 AM' },
  { id: 3, tradePackageCode: 'S15-A5000', tradePackageName: 'EYD Fuel Oil Electrical Assembly', rocId: 'ROC-001', stepNumber: 3, stepName: 'Equipment Installation', drawingFolderLink: 'https://drive.google.com/file/d/1RHH8mRH_6DIgm4JSkRgHlkKx1ty2CP-D/view?usp=sharing', updatedBy: 'Bogdan-Constantin Pana', updatedOn: '17/10/2026 10:00 AM' },
  { id: 4, tradePackageCode: 'S19-A5000', tradePackageName: 'MYD Secondary Substation Electrical Assembly', rocId: 'ROC-002', stepNumber: 1, stepName: 'Shop Drawing Approved', drawingFolderLink: 'https://drive.google.com/file/d/1RHH8mRH_6DIgm4JSkRgHlkKx1ty2CP-D/view?usp=sharing', updatedBy: 'Manali Ruchandani', updatedOn: '03/11/2026 10:10 AM' },
  { id: 5, tradePackageCode: 'S19-A5000', tradePackageName: 'MYD Secondary Substation Electrical Assembly', rocId: 'ROC-002', stepNumber: 2, stepName: 'Lift & Place', drawingFolderLink: 'https://drive.google.com/file/d/1RHH8mRH_6DIgm4JSkRgHlkKx1ty2CP-D/view?usp=sharing', updatedBy: 'Manali Ruchandani', updatedOn: '03/11/2026 10:30 AM' },
  { id: 6, tradePackageCode: 'S14-A5000', tradePackageName: 'EYD Conveyance Electrical Assembly', rocId: 'ROC-003', stepNumber: 1, stepName: 'Steel Fabrication Approved', drawingFolderLink: 'https://drive.google.com/file/d/1RHH8mRH_6DIgm4JSkRgHlkKx1ty2CP-D/view?usp=sharing', updatedBy: 'Bhoomi Barot', updatedOn: '10/11/2026 11:00 AM' },
];

interface Attachment {
  id: number;
  fileName: string;
  fileType: 'url' | 'file' | 'image';
  fileExtension?: string;
  fileSize?: string;
  url?: string;
  uploadedBy: string;
  uploadDate: string;
  relatedStep?: string;
  isEvidence?: boolean; // Flag for evidence files that cannot be deleted
  version?: string; // e.g., 'V1', 'V2', 'V3' - only for evidence files
}

interface ROCStep {
  id: number;
  stepName: string;
  stepWeightage: number;
  measurementType: 'Percentage' | 'Quantity';
  totalQuantity: number | null;
  installedQuantity: number | null;
  percentComplete: number;
  expanded: boolean;
  evidenceCount?: number;
  status: 'completed' | 'in-progress' | 'behind' | 'not-started';
}

interface AttachmentsTabContentProps {
  attachments: Attachment[];
  rocSteps: ROCStep[];
  handleDeleteAttachment: (id: number) => void;
  showAddAttachmentModal: boolean;
  setShowAddAttachmentModal: (show: boolean) => void;
  showAddLinkModal: boolean;
  setShowAddLinkModal: (show: boolean) => void;
  selectedStepForAttachment: string;
  setSelectedStepForAttachment: (step: string) => void;
  isProjectReadOnly?: boolean;
  tradePackageCode?: string; // e.g. 'S02'
  rocId?: string;            // e.g. 'ROC-002'
}

export const AttachmentsTabContent: React.FC<AttachmentsTabContentProps> = ({
  attachments,
  rocSteps,
  handleDeleteAttachment,
  showAddAttachmentModal,
  setShowAddAttachmentModal,
  showAddLinkModal,
  setShowAddLinkModal,
  selectedStepForAttachment,
  setSelectedStepForAttachment,
  isProjectReadOnly = false,
  tradePackageCode = '',
  rocId = '',
}) => {
  const [filesExpanded, setFilesExpanded] = useState(true);
  const [linksExpanded, setLinksExpanded] = useState(true);
  const [drawingLinksExpanded, setDrawingLinksExpanded] = useState(true);

  // Drawing links for this task (matched by tradePackageCode + rocId)
  const taskDrawingLinks = ALL_DRAWING_LINKS.filter(
    l => l.tradePackageCode === tradePackageCode && l.rocId === rocId
  );

  // Bulk selection state
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<number[]>([]);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Tooltip state for evidence badges
  const [hoveredEvidence, setHoveredEvidence] = useState<number | null>(null);

  const getFileIcon = (att: Attachment) => {
    if (att.fileType === 'url') {
      return <ExternalLink size={18} style={{ color: '#3B82F6' }} />;
    }

    switch (att.fileExtension) {
      case 'pdf':
        return <File size={18} style={{ color: '#DC2626' }} />;
      case 'xlsx':
        return <File size={18} style={{ color: '#10B981' }} />;
      case 'docx':
        return <File size={18} style={{ color: '#3B82F6' }} />;
      default:
        return <FileText size={18} style={{ color: '#6B7280' }} />;
    }
  };

  const getIconBg = (att: Attachment) => {
    if (att.fileType === 'url') return '#EFF6FF';
    switch (att.fileExtension) {
      case 'pdf': return '#FEF2F2';
      case 'xlsx': return '#F0FDF4';
      case 'docx': return '#EFF6FF';
      default: return '#F9FAFB';
    }
  };

  // Separate files and links
  const allFiles = attachments.filter(a => a.fileType === 'file' || a.fileType === 'image');
  const allLinks = attachments.filter(a => a.fileType === 'url');

  // Use all files and links without filtering
  const filteredFiles = allFiles;
  const filteredLinks = allLinks;

  // Bulk actions
  const handleSelectAllFiles = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles.map(f => f.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, id]);
    } else {
      setSelectedFiles(selectedFiles.filter(fid => fid !== id));
    }
  };

  const handleSelectAllLinks = (checked: boolean) => {
    if (checked) {
      setSelectedLinks(filteredLinks.map(l => l.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelectLink = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedLinks([...selectedLinks, id]);
    } else {
      setSelectedLinks(selectedLinks.filter(lid => lid !== id));
    }
  };

  const handleBulkDownload = () => {
    toast.success(`Downloading ${selectedFiles.length} file(s)...`);
    setSelectedFiles([]);
  };

  const handleBulkDeleteFiles = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      selectedFiles.forEach(id => handleDeleteAttachment(id));
      toast.success(`Deleted ${selectedFiles.length} file(s)`);
      setSelectedFiles([]);
    }
  };

  const handleBulkDeleteLinks = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLinks.length} link(s)?`)) {
      selectedLinks.forEach(id => handleDeleteAttachment(id));
      toast.success(`Deleted ${selectedLinks.length} link(s)`);
      setSelectedLinks([]);
    }
  };

  const handleSingleDelete = (id: number, name: string) => {
    setDeleteTarget({ id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      handleDeleteAttachment(deleteTarget.id);
      toast.success('Deleted successfully');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleDownloadAll = () => {
    toast.success('A download link will be sent to your email: michael.gainey@zauner.com');
  };

  return (
    <>
      <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
            Attachments & Links
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} and {filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>

          {/* FILES SECTION - Top */}
          <div>
            <div
              onClick={() => setFilesExpanded(!filesExpanded)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                cursor: 'pointer',
                padding: '8px 12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {filesExpanded ? <ChevronUp size={16} style={{ color: '#6B7280' }} /> : <ChevronDown size={16} style={{ color: '#6B7280' }} />}
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Files ({filteredFiles.length})
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadAll();
                  }}
                  style={{
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <Download size={14} />
                  Download All
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isProjectReadOnly) setShowAddAttachmentModal(true);
                  }}
                  disabled={isProjectReadOnly}
                  title={isProjectReadOnly ? "Add Attachment disabled - Project is On Hold" : ""}
                  style={{
                    height: '32px',
                    padding: '0 12px',
                    border: 'none',
                    backgroundColor: isProjectReadOnly ? '#D1D5DB' : '#FD4314',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isProjectReadOnly ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#E03A0F')}
                  onMouseLeave={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FD4314')}
                >
                  <Paperclip size={14} />
                  Add Attachment
                </button>
              </div>
            </div>

            {/* Bulk Actions for Files */}
            {filesExpanded && selectedFiles.length > 0 && (
              <div style={{
                backgroundColor: '#E4EEFE',
                border: '1px solid #BFDBFE',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E40AF' }}>
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleBulkDownload}
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      border: '1px solid #1E40AF',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#1E40AF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    onClick={handleBulkDeleteFiles}
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      border: '1px solid #DC2626',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {filesExpanded && filteredFiles.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  backgroundColor: '#E4EEF8',
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 150px 150px 200px 180px',
                  borderBottom: '1px solid #C8D9EE',
                  height: '40px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    File Name
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Version
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Uploaded By
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Uploaded At
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Step Name
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Actions
                  </div>
                </div>

                {/* Column Filter Row */}
                <div style={{
                  backgroundColor: '#FAFBFC',
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 150px 150px 200px 180px',
                  borderBottom: '1px solid #C8D9EE',
                  height: '40px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px'
                  }} />
                </div>

                {/* Table Body */}
                <div style={{ flex: 1 }}>
                  {filteredFiles.map((att, index) => (
                    <div
                      key={att.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 100px 150px 150px 200px 180px',
                        height: '52px',
                        alignItems: 'center',
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        borderBottom: index < filteredFiles.length - 1 ? '1px solid #E2E6ED' : 'none'
                      }}
                    >
                      {/* File Name with Icon */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0 12px',
                        minWidth: 0
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: getIconBg(att),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {getFileIcon(att)}
                        </div>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#272721',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {att.fileName}
                        </span>
                      </div>

                      {/* Version */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px'
                      }}>
                        {att.isEvidence && att.version ? (
                          <div style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            backgroundColor: '#F3E8FF',
                            color: '#6B21A8',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {att.version}
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>—</span>
                        )}
                      </div>

                      {/* Uploaded By */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        fontSize: '13px',
                        color: '#272721'
                      }}>
                        {att.uploadedBy}
                      </div>

                      {/* Uploaded At */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        fontSize: '13px',
                        color: '#6B7280'
                      }}>
                        {att.uploadDate}
                      </div>

                      {/* Step Name */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px'
                      }}>
                        {att.relatedStep ? (
                          <div style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            backgroundColor: '#E4EEFE',
                            color: '#1E40AF',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {att.relatedStep}
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>—</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        gap: '6px',
                        padding: '0 12px',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Download started');
                          }}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                          title="Download"
                        >
                          <Download size={14} />
                          Download
                        </button>
                        <div
                          style={{
                            position: 'relative'
                          }}
                          onMouseEnter={() => att.isEvidence ? setHoveredEvidence(att.id) : null}
                          onMouseLeave={() => setHoveredEvidence(null)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!att.isEvidence) {
                                handleSingleDelete(att.id, att.fileName);
                              }
                            }}
                            disabled={att.isEvidence}
                            style={{
                              padding: '6px',
                              border: att.isEvidence ? '1px solid #E5E7EB' : '1px solid #FEE2E2',
                              backgroundColor: att.isEvidence ? '#F9FAFB' : '#FEF2F2',
                              borderRadius: '4px',
                              cursor: att.isEvidence ? 'not-allowed' : 'pointer',
                              color: att.isEvidence ? '#D1D5DB' : '#DC2626',
                              display: 'flex',
                              alignItems: 'center',
                              opacity: att.isEvidence ? 0.5 : 1
                            }}
                            title={att.isEvidence ? "Evidence can't be deleted" : "Delete"}
                          >
                            <Trash2 size={14} />
                          </button>
                          {hoveredEvidence === att.id && att.isEvidence && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '100%',
                                right: 0,
                                marginBottom: '8px',
                                backgroundColor: '#1F2937',
                                color: '#FFFFFF',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                zIndex: 1000,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                              }}
                            >
                              Evidence can't be deleted
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: '10px',
                                  width: 0,
                                  height: 0,
                                  borderLeft: '5px solid transparent',
                                  borderRight: '5px solid transparent',
                                  borderTop: '5px solid #1F2937'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with Record Count */}
                <div style={{
                  height: '44px',
                  backgroundColor: '#FAFBFC',
                  borderTop: '1px solid #C8D9EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  fontSize: '13px',
                  color: '#5F6B7A'
                }}>
                  <div>
                    Total Records: {filteredFiles.length}
                  </div>
                </div>
              </div>
            )}

            {filesExpanded && filteredFiles.length === 0 && (
              <div style={{
                backgroundColor: '#F9FAFB',
                border: '2px dashed #D1D5DB',
                borderRadius: '6px',
                padding: '24px 16px',
                textAlign: 'center'
              }}>
                <File size={32} style={{ color: '#D1D5DB', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                  No files yet
                </p>
              </div>
            )}
          </div>

          {/* LINKS SECTION - Bottom */}
          <div>
            <div
              onClick={() => setLinksExpanded(!linksExpanded)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                cursor: 'pointer',
                padding: '8px 12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {linksExpanded ? <ChevronUp size={16} style={{ color: '#6B7280' }} /> : <ChevronDown size={16} style={{ color: '#6B7280' }} />}
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  BIM Links ({filteredLinks.length})
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isProjectReadOnly) setShowAddLinkModal(true);
                }}
                disabled={isProjectReadOnly}
                title={isProjectReadOnly ? "Add Link disabled - Project is On Hold" : ""}
                style={{
                  height: '32px',
                  padding: '0 12px',
                  border: 'none',
                  backgroundColor: isProjectReadOnly ? '#D1D5DB' : '#FD4314',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: isProjectReadOnly ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: isProjectReadOnly ? 0.5 : 1
                }}
                onMouseEnter={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#E03A0F')}
                onMouseLeave={(e) => !isProjectReadOnly && (e.currentTarget.style.backgroundColor = '#FD4314')}
              >
                <LinkIcon size={14} />
                Add Link
              </button>
            </div>

            {/* Bulk Actions for Links */}
            {linksExpanded && selectedLinks.length > 0 && (
              <div style={{
                backgroundColor: '#E4EEFE',
                border: '1px solid #BFDBFE',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E40AF' }}>
                  {selectedLinks.length} link{selectedLinks.length !== 1 ? 's' : ''} selected
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleBulkDeleteLinks}
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      border: '1px solid #DC2626',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {linksExpanded && filteredLinks.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  backgroundColor: '#E4EEF8',
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr 150px 150px 250px 140px',
                  borderBottom: '1px solid #C8D9EE',
                  height: '40px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Link Name
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Link
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Uploaded By
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Uploaded At
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Step Name
                  </div>
                  <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#272721'
                  }}>
                    Actions
                  </div>
                </div>

                {/* Column Filter Row */}
                <div style={{
                  backgroundColor: '#FAFBFC',
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr 150px 150px 250px 140px',
                  borderBottom: '1px solid #C8D9EE',
                  height: '40px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '28px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '3px',
                        padding: '0 8px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                    <Filter size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  </div>
                  <div style={{
                    height: '40px'
                  }} />
                </div>

                {/* Table Body */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {filteredLinks.map((att, index) => (
                    <div
                      key={att.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '220px 1fr 150px 150px 250px 140px',
                        height: '52px',
                        alignItems: 'center',
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F8FD',
                        borderBottom: index < filteredLinks.length - 1 ? '1px solid #E2E6ED' : 'none'
                      }}
                    >
                      {/* Link Name */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        minWidth: 0
                      }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#272721',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {att.fileName}
                        </span>
                      </div>

                      {/* Link URL */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        minWidth: 0
                      }}>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '13px',
                            color: '#3B82F6',
                            textDecoration: 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                          }}
                        >
                          {att.url}
                        </a>
                      </div>

                      {/* Uploaded By */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        fontSize: '13px',
                        color: '#272721'
                      }}>
                        {att.uploadedBy}
                      </div>

                      {/* Uploaded At */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        fontSize: '13px',
                        color: '#6B7280'
                      }}>
                        {att.uploadDate}
                      </div>

                      {/* Step Name */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px'
                      }}>
                        {att.relatedStep ? (
                          <div style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            backgroundColor: '#E4EEFE',
                            color: '#1E40AF',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {att.relatedStep}
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>—</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{
                        height: '52px',
                        display: 'flex',
                        gap: '6px',
                        padding: '0 12px',
                        alignItems: 'center'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (att.url) {
                              window.open(att.url, '_blank');
                              toast.success('Opening link in new tab');
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            border: '1px solid #BFDBFE',
                            backgroundColor: '#EFF6FF',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#1E40AF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                          title="Open Link"
                        >
                          <ExternalLink size={14} />
                          Open
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSingleDelete(att.id, att.fileName);
                          }}
                          style={{
                            padding: '6px',
                            border: '1px solid #FEE2E2',
                            backgroundColor: '#FEF2F2',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#DC2626',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with Record Count */}
                <div style={{
                  height: '44px',
                  backgroundColor: '#FAFBFC',
                  borderTop: '1px solid #C8D9EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  fontSize: '13px',
                  color: '#5F6B7A'
                }}>
                  <div>
                    Total Records: {filteredLinks.length}
                  </div>
                </div>
              </div>
            )}

            {linksExpanded && filteredLinks.length === 0 && (
              <div style={{
                backgroundColor: '#F9FAFB',
                border: '2px dashed #D1D5DB',
                borderRadius: '6px',
                padding: '24px 16px',
                textAlign: 'center'
              }}>
                <LinkIcon size={32} style={{ color: '#D1D5DB', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                  No links yet
                </p>
              </div>
            )}
          </div>

          {/* ── DRAWING LINKS SECTION ── */}
          <div style={{ marginTop: '24px' }}>
            {/* Section header — same style as BIM Links */}
            <div
              onClick={() => setDrawingLinksExpanded(!drawingLinksExpanded)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                cursor: 'pointer',
                padding: '8px 12px',
                backgroundColor: '#F9FAFB',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {drawingLinksExpanded
                  ? <ChevronUp size={16} style={{ color: '#6B7280' }} />
                  : <ChevronDown size={16} style={{ color: '#6B7280' }} />}
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Drawing Folder Links ({taskDrawingLinks.length})
                </h3>
                {tradePackageCode && rocId && (
                  <span style={{
                    fontSize: '11px',
                    backgroundColor: '#E4EEF8',
                    color: '#1F4B8E',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: '500',
                  }}>
                    {tradePackageCode} · {rocId}
                  </span>
                )}
              </div>
            </div>

            {drawingLinksExpanded && taskDrawingLinks.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #C8D9EE',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                {/* Table header — same grid as BIM Links table */}
                <div style={{
                  backgroundColor: '#E4EEF8',
                  display: 'grid',
                  gridTemplateColumns: '60px 200px 1fr 150px 150px 100px',
                  borderBottom: '1px solid #C8D9EE',
                  height: '40px',
                  alignItems: 'center',
                }}>
                  {['Step No.', 'Step Name', 'Drawing Folder Link', 'Updated By', 'Updated On', ''].map(h => (
                    <div key={h} style={{
                      padding: '0 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#272721',
                    }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                {taskDrawingLinks.map((dl, idx) => (
                  <div
                    key={dl.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 200px 1fr 150px 150px 100px',
                      borderBottom: idx < taskDrawingLinks.length - 1 ? '1px solid #E2E6ED' : 'none',
                      alignItems: 'center',
                      minHeight: '52px',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Step No */}
                    <div style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                      {dl.stepNumber}
                    </div>
                    {/* Step Name */}
                    <div style={{ padding: '10px 12px', fontSize: '13px', color: '#272721', fontWeight: '500' }}>
                      {dl.stepName}
                    </div>
                    {/* Link */}
                    <div style={{ padding: '10px 12px', minWidth: 0, overflow: 'hidden' }}>
                      <a
                        href={dl.drawingFolderLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#2563EB',
                          textDecoration: 'underline',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {dl.drawingFolderLink.replace('https://drive.google.com/folders/', 'drive.google.com/...')}
                        </span>
                        <ExternalLink size={11} style={{ flexShrink: 0 }} />
                      </a>
                    </div>
                    {/* Updated By */}
                    <div style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>
                      {dl.updatedBy}
                    </div>
                    {/* Updated On */}
                    <div style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>
                      {dl.updatedOn}
                    </div>
                    {/* Open button */}
                    <div style={{ padding: '10px 12px' }}>
                      <a
                        href={dl.drawingFolderLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          height: '28px',
                          padding: '0 10px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #2563EB',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#2563EB',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#EFF6FF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FFFFFF'; }}
                      >
                        <ExternalLink size={12} />
                        Open
                      </a>
                    </div>
                  </div>
                ))}

                {/* Footer — same as BIM Links */}
                <div style={{
                  height: '44px',
                  backgroundColor: '#FAFBFC',
                  borderTop: '1px solid #C8D9EE',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  fontSize: '13px',
                  color: '#5F6B7A',
                }}>
                  Total Records: {taskDrawingLinks.length}
                </div>
              </div>
            )}

            {drawingLinksExpanded && taskDrawingLinks.length === 0 && (
              <div style={{
                backgroundColor: '#F9FAFB',
                border: '2px dashed #D1D5DB',
                borderRadius: '6px',
                padding: '24px 16px',
                textAlign: 'center',
              }}>
                <FolderOpen size={32} style={{ color: '#D1D5DB', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                  No drawing folder links configured for this task's Trade Package + ROC combination
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
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
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Trash2 size={20} style={{ color: '#DC2626' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Confirm Delete
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
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

      {/* Add Attachment Modal */}
      {showAddAttachmentModal && (
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
          onClick={() => setShowAddAttachmentModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                Add Attachment
              </h3>
              <button
                onClick={() => setShowAddAttachmentModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Related Step
              </label>
              <select
                value={selectedStepForAttachment}
                onChange={(e) => setSelectedStepForAttachment(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="">None</option>
                {rocSteps.map(step => (
                  <option key={step.id} value={step.stepName}>{step.stepName}</option>
                ))}
              </select>
            </div>

            <div
              style={{
                border: '2px dashed #D1D5DB',
                borderRadius: '6px',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                marginBottom: '20px'
              }}
            >
              <Upload size={32} style={{ color: '#9CA3AF', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                Drag and drop files here, or click to browse
              </p>
              <button
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Choose Files
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddAttachmentModal(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Attachment uploaded successfully');
                  setShowAddAttachmentModal(false);
                }}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {showAddLinkModal && (
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
          onClick={() => setShowAddLinkModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                Add Link
              </h3>
              <button
                onClick={() => setShowAddLinkModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Link Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter link name"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                URL <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Related Step
              </label>
              <select
                value={selectedStepForAttachment}
                onChange={(e) => setSelectedStepForAttachment(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="">None</option>
                {rocSteps.map(step => (
                  <option key={step.id} value={step.stepName}>{step.stepName}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddLinkModal(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Link added successfully');
                  setShowAddLinkModal(false);
                }}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  backgroundColor: '#FD4314',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
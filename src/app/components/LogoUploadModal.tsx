import React, { useState } from 'react';
import { X, Upload, Image } from 'lucide-react';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void;
}

export default function LogoUploadModal({ isOpen, onClose, onUpload }: LogoUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        if (onUpload) {
          onUpload(file);
        }
        onClose();
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        if (onUpload) {
          onUpload(file);
        }
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '560px',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #E2E6ED'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            Upload Logo
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Description */}
          <p style={{
            fontSize: '14px',
            color: '#5F6B7A',
            marginBottom: '24px',
            margin: 0
          }}>
            Upload your company or project logo. Supported formats: JPG, PNG, JPEG, HEIC, SVG
          </p>

          {/* Upload Dropzone */}
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? '#FD4314' : '#D1D5DB'}`,
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: dragActive ? '#FEF2F2' : '#F9FAFB',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'block',
              marginBottom: '24px'
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            {/* Upload Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Upload size={28} style={{ color: '#6B7280' }} />
              </div>
            </div>

            {/* Upload Text */}
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Drag and drop your logo here or <span style={{ color: '#FD4314' }}>click to browse</span>
            </p>

            {/* File Types */}
            <p style={{
              fontSize: '13px',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: 0
            }}>
              <Image size={16} />
              JPG, PNG, JPEG, HEIC, SVG
            </p>
          </label>
        </div>

        {/* Modal Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '16px 24px',
          borderTop: '1px solid #E2E6ED',
          backgroundColor: '#FAFBFC'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '8px 20px',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

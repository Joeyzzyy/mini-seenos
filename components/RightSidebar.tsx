'use client';

import { useState, useEffect, useRef } from 'react';
import type { FileRecord } from '@/lib/supabase';
import FilePreviewModal from './FilePreviewModal';

interface RightSidebarProps {
  files: FileRecord[];
  onDeleteFile: (fileId: string, storagePath: string) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RightSidebar({ 
  files, 
  onDeleteFile,
  isOpen,
  onOpenChange
}: RightSidebarProps) {
  const [fileToDelete, setFileToDelete] = useState<FileRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewingFile, setPreviewingFile] = useState<FileRecord | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Only close if not currently deleting or previewing to avoid accidental closes
        if (!fileToDelete && !previewingFile) {
          onOpenChange(false);
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange, fileToDelete, previewingFile]);

  const handleDeleteClick = (file: FileRecord) => {
    setFileToDelete(file);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      setIsDeleting(true);
      try {
        await onDeleteFile(fileToDelete.id, fileToDelete.storage_path);
      } finally {
        setIsDeleting(false);
        setFileToDelete(null);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateFilename = (name: string, maxLength: number = 20) => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex === -1) return name.substring(0, maxLength - 3) + '...';
    
    const extension = name.substring(lastDotIndex);
    const baseName = name.substring(0, lastDotIndex);
    const charsToShow = maxLength - extension.length - 3;
    
    if (charsToShow <= 0) return name.substring(0, maxLength - 3) + '...';
    
    return baseName.substring(0, charsToShow) + '...' + extension;
  };

  const isImageFile = (fileType: string, filename: string) => {
    if (fileType.startsWith('image/')) return true;
    const ext = filename.toLowerCase().split('.').pop();
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext || '');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-3.5 h-3.5 text-[#9A8FEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    }
    if (fileType === 'text/csv' || fileType.includes('spreadsheet')) {
      return (
        <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
    <div 
      ref={sidebarRef}
      className={`fixed right-6 top-[60px] w-80 bg-white/90 backdrop-blur-md border border-[#F0F0F0] shadow-2xl rounded-2xl flex flex-col max-h-[calc(100vh-100px)] z-40 overflow-hidden transition-all duration-500 ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
    >
        <div className="p-4 flex items-center justify-between border-b border-[#F5F5F5] shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-black text-[#374151] uppercase tracking-widest">Artifacts in current conversation</h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto thin-scrollbar p-2">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center opacity-60">
              <svg className="w-8 h-8 text-[#E5E5E5] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[11px] text-[#9CA3AF] font-medium">No artifacts yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {files.map(file => {
                const isImg = isImageFile(file.file_type, file.filename);
                return (
                  <div key={file.id} className="group relative bg-white border border-[#F5F5F5] hover:border-[#9A8FEA]/30 rounded-xl p-2.5 transition-all hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {isImg && file.public_url ? (
                          <div className="w-10 h-10 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] overflow-hidden flex items-center justify-center">
                            <img src={file.public_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] flex items-center justify-center">
                            {getFileIcon(file.file_type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => {
                            if (file.public_url) {
                              setPreviewingFile(file);
                            }
                          }}
                          className="w-full text-left cursor-pointer group/btn"
                        >
                          <p 
                            className="text-[11px] font-bold text-[#374151] truncate group-hover/btn:text-[#9A8FEA] transition-colors"
                            title={file.filename}
                          >
                            {truncateFilename(file.filename)}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-tighter">
                              {formatDate(file.created_at)}
                            </span>
                            <span className="text-[9px] text-[#D1D5DB]">•</span>
                            <span className="text-[9px] font-medium text-[#D1D5DB] truncate uppercase">
                              {file.file_type.split('/')[1] || file.file_type}
                            </span>
                          </div>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.public_url && (
                          <button
                            onClick={() => window.open(file.public_url!, '_blank')}
                            className="p-1.5 hover:bg-[#F3F4F6] rounded-lg text-[#9CA3AF] hover:text-[#6B7280] transition-all"
                            title="Open"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(file)}
                          className="p-1.5 hover:bg-[#FEF2F2] rounded-lg text-[#9CA3AF] hover:text-[#EF4444] transition-all"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => !isDeleting && setFileToDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[#111827] mb-2">Delete Artifact?</h3>
            <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
              Are you sure you want to delete &quot;{fileToDelete.filename}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-[#6B7280] hover:bg-[#F3F4F6] rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewingFile && (
        <FilePreviewModal
          isOpen={!!previewingFile}
          onClose={() => setPreviewingFile(null)}
          fileUrl={previewingFile.public_url || ''}
          filename={previewingFile.filename}
        />
      )}
    </>
  );
}

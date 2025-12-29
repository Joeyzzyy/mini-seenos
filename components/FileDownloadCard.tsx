'use client';

import { useState } from 'react';
import type { FileRecord } from '@/lib/supabase';

interface FileDownloadCardProps {
  result: {
    filename: string;
    content?: string;
    mimeType: string;
    size: number;
    rowCount?: number;
    fileId?: string;
    publicUrl?: string;
    status?: 'success' | 'error';
    error?: string;
    provider?: string;
    fallbackUsed?: boolean;
    primaryServiceFailed?: string;
  };
  userId?: string;
  conversationId?: string;
  files?: FileRecord[];
  onUploadSuccess?: () => void;
  toolName?: string;
  allToolInvocations?: any[];
  compact?: boolean; // New prop for compact display in file lists
}

export default function FileDownloadCard({ result, files = [], toolName, compact = false }: FileDownloadCardProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<string[][] | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const handleDownload = () => {
    if (result.publicUrl) {
      const link = document.createElement('a');
      link.href = result.publicUrl;
      link.download = result.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (result.content) {
      const blob = new Blob([result.content], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      return;
    }
    setDownloaded(true);
  };

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      let csvContent = '';
      
      if (result.content) {
        csvContent = result.content;
      } else if (result.publicUrl) {
        const response = await fetch(result.publicUrl);
        csvContent = await response.text();
      } else {
        return;
      }
      
      // Parse CSV
      const lines = csvContent.trim().split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing (handles basic cases)
        const cells: string[] = [];
        let cell = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            cells.push(cell);
            cell = '';
          } else {
            cell += char;
          }
        }
        cells.push(cell);
        return cells;
      });
      
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const formatSize = (bytes: any) => {
    const numBytes = Number(bytes);
    if (isNaN(numBytes) || numBytes <= 0) return 'Unknown size';
    if (numBytes < 1024) return `${numBytes} B`;
    if (numBytes < 1024 * 1024) return `${(numBytes / 1024).toFixed(1)} KB`;
    return `${(numBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Check if file actually exists
  // Try to match by fileId first, then by filename if fileId is not available
  const matchedFile = result.fileId 
    ? files.find(f => f.id === result.fileId)
    : (result.filename ? files.find(f => f.filename === result.filename || f.original_filename === result.filename) : null);
  
  // Use file size from result, or from matched file record, or 0
  const displaySize = result.size ?? matchedFile?.file_size ?? 0;
  
  // Check if this is a failed generation
  const isFailed = result.status === 'error' || (!!result.error && !result.fallbackUsed);
  
  // Check if fallback was used (successful generation via fallback service)
  const usedFallback = result.fallbackUsed && result.status !== 'error';
  
  // File exists if:
  // 1. Has content (not yet uploaded or still in memory)
  // 2. Has publicUrl (uploaded successfully) - THIS IS THE PRIMARY CHECK NOW
  // 3. Has matchedFile record (found in database)
  const fileStillExists = !!(result.publicUrl || result.content || matchedFile);
  
  // Can download if file exists and has either publicUrl or content (and not failed)
  const canDownload = !isFailed && fileStillExists && !!(result.publicUrl || result.content);
  const isImage = result.mimeType?.startsWith('image/') || 
    (result.filename?.toLowerCase().endsWith('.png') || 
     result.filename?.toLowerCase().endsWith('.jpg') || 
     result.filename?.toLowerCase().endsWith('.jpeg') || 
     result.filename?.toLowerCase().endsWith('.webp'));

  return (
    <div className="flex items-start gap-3">
      {/* Thumbnail or Icon */}
      {isImage && (result.publicUrl || result.content) ? (
        compact ? (
          /* Compact thumbnail */
          <div 
            className="max-w-[60px] max-h-10 rounded overflow-hidden bg-[#F9FAFB] cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            onClick={() => window.open(result.publicUrl || `data:${result.mimeType || 'image/png'};base64,${result.content}`, '_blank')}
          >
            <img 
              src={result.publicUrl || `data:${result.mimeType || 'image/png'};base64,${result.content}`} 
              alt={result.filename} 
              className="max-w-full max-h-10 object-contain"
            />
          </div>
        ) : (
          /* Full size preview */
          <div 
            className="max-w-md rounded-lg overflow-hidden bg-[#F9FAFB] cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => window.open(result.publicUrl || `data:${result.mimeType || 'image/png'};base64,${result.content}`, '_blank')}
          >
            <img 
              src={result.publicUrl || `data:${result.mimeType || 'image/png'};base64,${result.content}`} 
              alt={result.filename} 
              className="max-w-full h-auto object-contain"
            />
          </div>
        )
      ) : !isFailed ? (
        /* File icon for non-images and successful files */
        <div className="w-10 h-10 rounded bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
      ) : null}
      
      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div 
              className={`text-sm font-medium text-[#111827] truncate ${
                canDownload ? 'cursor-pointer hover:text-[#6B7280] transition-colors' : ''
              }`}
              onClick={() => {
                if (canDownload && result.publicUrl) {
                  window.open(result.publicUrl, '_blank');
                }
              }}
            >
              {result.filename}
            </div>
            
            {/* Size and row count */}
            {!isFailed && displaySize > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mt-0.5">
                <span>{formatSize(displaySize)}</span>
                {result.rowCount && (
                  <>
                    <span>·</span>
                    <span>{result.rowCount} rows</span>
                  </>
                )}
              </div>
            )}
            
            {/* Fallback info */}
            {usedFallback && result.primaryServiceFailed && (
              <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span>{result.primaryServiceFailed} failed, switched to {toolName === 'deerapi_generate_images' ? 'DeerAPI' : 'fallback'}</span>
              </div>
            )}
            
            {/* Error state */}
            {isFailed && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="font-medium">Generation Failed</span>
                {result.error && (
                  <>
                    <span>·</span>
                    <span className="truncate">{result.error.length > 30 ? result.error.substring(0, 30) + '...' : result.error}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          {canDownload && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Preview button (CSV only) */}
              {result.mimeType?.includes('csv') && (
                <button
                  onClick={handlePreview}
                  disabled={isLoadingPreview}
                  className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors"
                  title="Preview"
                >
                  <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              )}
              
              {/* Download button */}
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors"
                title="Download"
              >
                {downloaded ? (
                  <svg className="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Modal */}
      {showPreview && previewData && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowPreview(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#E5E5E5]">
                <h3 className="text-base font-semibold text-[#111827]">{result.filename}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              {/* Table */}
              <div className="overflow-auto p-4 flex-1">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB]">
                      {previewData[0]?.map((header, i) => (
                        <th key={i} className="border border-[#E5E5E5] px-3 py-2 text-left font-medium text-[#111827]">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1, 51).map((row, i) => (
                      <tr key={i} className="hover:bg-[#F9FAFB]">
                        {row.map((cell, j) => (
                          <td key={j} className="border border-[#E5E5E5] px-3 py-2 text-[#374151]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 51 && (
                  <div className="mt-4 text-center text-sm text-[#9CA3AF]">
                    Showing first 50 rows of {previewData.length - 1} total rows
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

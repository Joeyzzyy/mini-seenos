'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  filename: string;
}

export default function MarkdownPreviewModal({
  isOpen,
  onClose,
  fileUrl,
  filename
}: MarkdownPreviewModalProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !fileUrl) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[MarkdownPreview] Fetching content from:', fileUrl);
        
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log('[MarkdownPreview] Content loaded:', text.length, 'characters');
        setContent(text);
      } catch (err) {
        console.error('[MarkdownPreview] Error fetching file:', err);
        setError(err instanceof Error ? err.message : 'Failed to load file');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isOpen, fileUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E5E5]">
        {/* Header */}
        <div className="p-4 border-b border-[#F3F4F6] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <svg className="w-5 h-5 text-[#6B7280] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-base font-bold text-[#111827] truncate">{filename}</h2>
          </div>
          
          {/* Download and Close buttons */}
          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              download={filename}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
              title="Download"
            >
              <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA] thin-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Image 
                src="/logo.svg" 
                alt="Loading..." 
                width={96} 
                height={96}
                className="animate-subtle-shake"
              />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 max-w-md">
                <svg className="w-12 h-12 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-[#EF4444] text-center">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#6B7280] border border-[#E5E5E5] rounded-lg hover:bg-[#F3F4F6] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-none bg-white rounded-lg border border-[#E5E5E5] p-6 shadow-sm">
              <div className="prose prose-sm max-w-none
                prose-headings:text-[#111827] prose-headings:font-bold
                prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-0
                prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
                prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
                prose-p:text-[#374151] prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-[#9A8FEA] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#111827] prose-strong:font-semibold
                prose-code:text-[#EF4444] prose-code:bg-[#FEF2F2] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-[#F3F4F6] prose-pre:border prose-pre:border-[#E5E5E5] prose-pre:rounded-lg prose-pre:p-4
                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                prose-li:text-[#374151] prose-li:mb-1
                prose-blockquote:border-l-4 prose-blockquote:border-[#9A8FEA] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#6B7280]
                prose-hr:border-[#E5E5E5] prose-hr:my-8
                prose-table:border-collapse prose-table:w-full
                prose-th:border prose-th:border-[#E5E5E5] prose-th:bg-[#F9FAFB] prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
                prose-td:border prose-td:border-[#E5E5E5] prose-td:px-4 prose-td:py-2
              ">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


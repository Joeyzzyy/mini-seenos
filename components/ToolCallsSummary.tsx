'use client';

import { useState, useEffect, useRef } from 'react';
import FileDownloadCard from './FileDownloadCard';
import type { FileRecord } from '@/lib/supabase';

interface ToolCallsSummaryProps {
  toolInvocations: any[];
  userId?: string;
  conversationId?: string;
  files?: FileRecord[];
  onUploadSuccess?: () => void;
  onPreviewContentItem?: (itemId: string) => void;
  isLastMessage?: boolean;
  isStreaming?: boolean;
  showFiles?: boolean;
}

// Get tool display name
function getToolDisplayName(toolName: string): string {
  const nameMap: Record<string, string> = {
    'keyword_overview': 'Keyword Overview',
    'generate_csv': 'Generate CSV',
    'web_search': 'Web Search',
    'extract_content': 'Extract Content',
    'search_serp': 'SERP Search',
    'analyze_serp_structure': 'Analyze Page Structures',
    'generate_outline': 'Generate Outline',
    'save_content_item': 'Save to Library',
    'save_content_items_batch': 'Batch Save',
    'create_plan': 'Create Plan',
    'acquire_context_field': 'Acquire Context Field',
  };
  return nameMap[toolName] || toolName?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Tool';
}

// Get brief action description
function getToolAction(inv: any): string {
  const args = inv.args || {};
  const result = inv.result || {};
  
  switch (inv.toolName) {
    case 'keyword_overview':
      return args.keyword || result.keyword || '';
    case 'web_search':
      return args.query || '';
    case 'extract_content':
      return args.url?.slice(0, 50) || '';
    case 'search_serp':
      return args.query || '';
    case 'analyze_serp_structure':
      return args.query || '';
    case 'generate_outline':
      return args.title || args.target_keyword || '';
    case 'save_content_item':
      return args.title || '';
    case 'save_content_items_batch':
      return `${args.items?.length || 0} items`;
    case 'acquire_context_field':
      return args.field || '';
    default:
      const firstArg = Object.values(args).find(v => typeof v === 'string');
      return typeof firstArg === 'string' ? firstArg.slice(0, 50) : '';
  }
}

export default function ToolCallsSummary({ 
  toolInvocations, 
  userId, 
  conversationId, 
  files = [],
  onUploadSuccess,
  onPreviewContentItem,
  isLastMessage = false,
  isStreaming = false,
  showFiles = false,
}: ToolCallsSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filesExpanded, setFilesExpanded] = useState(true);

  if (!toolInvocations || toolInvocations.length === 0) {
    return null;
  }

  // Filter out tracker tools and failed image generations
  const excludedToolNames = new Set(['create_conversation_tracker', 'add_task_to_tracker', 'update_task_status', 'create_plan']);
  
  const failedGenerateImagesIds = new Set<string>();
  toolInvocations.forEach(inv => {
    if (inv.toolName === 'deerapi_generate_images' && inv.result?.success) {
      const failedGenerateImages = toolInvocations.find(
        (prevInv: any) => 
          prevInv.toolName === 'generate_images' && 
          prevInv.toolCallId !== inv.toolCallId &&
          (!prevInv.result?.success || prevInv.result?.images?.some((img: any) => img.status === 'error'))
      );
      if (failedGenerateImages) {
        failedGenerateImagesIds.add(failedGenerateImages.toolCallId);
      }
    }
  });

  // Separate file results from other invocations
  const fileResults: any[] = [];
  const displayInvocations: any[] = [];
  
  toolInvocations.forEach(inv => {
    if (excludedToolNames.has(inv.toolName)) return;
    if (inv.result?.metadata?.isTracker || inv.result?.filename?.includes('conversation-tracker-')) return;
    if (inv.toolName === 'generate_images' && failedGenerateImagesIds.has(inv.toolCallId)) return;
    
    const isResult = inv.state === 'result' || (inv.result && !inv.state);
    
    if (isResult && ((inv.result?.filename && inv.result?.mimeType) || Array.isArray(inv.result?.images))) {
      fileResults.push(inv);
    }
    
    displayInvocations.push(inv);
  });
  
  const completedCount = displayInvocations.filter(inv => inv.state === 'result' || (!inv.state && inv.result)).length;
  const totalCount = displayInvocations.length;
  const isRunningAny = displayInvocations.some(inv => inv.state === 'call');
  const wasRunningRef = useRef(false);

  // Auto-collapse when all tools complete
  useEffect(() => {
    if (wasRunningRef.current && !isRunningAny && totalCount > 0 && completedCount === totalCount) {
      // All tools completed, auto-collapse after a short delay
      setTimeout(() => {
        setIsExpanded(false);
      }, 500);
    }
    wasRunningRef.current = isRunningAny;
  }, [isRunningAny, totalCount, completedCount]);

  // Find the latest save_final_page result with item_id
  const latestSavedPage = toolInvocations
    .filter(inv => inv.toolName === 'save_final_page' && inv.result?.item_id)
    .pop();

  return (
    <div className="space-y-2">
      {/* HTML Preview Button - Show prominently if a page was saved */}
      {latestSavedPage && latestSavedPage.result?.item_id && (
        <div className="flex items-center gap-3">
          {onPreviewContentItem && (
            <button
              onClick={() => onPreviewContentItem(latestSavedPage.result.item_id)}
              className="text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <svg className="w-3.5 h-3.5 text-[#9A8FEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ stroke: '#9A8FEA', strokeOpacity: 0.8 }}>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Open Internal Preview
            </button>
          )}
          
          <a
            href={`/api/preview/${latestSavedPage.result.item_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-all flex items-center gap-1.5 px-3 py-1 bg-[#FAFAFA] border border-[#E5E5E5] rounded-full shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 8" />
              <line x1="10" y1="11" x2="21" y2="3" />
            </svg>
            View Live Page
          </a>
        </div>
      )}

      {/* Simple Tool List */}
      {displayInvocations.length > 0 && (
        <div className="border border-[#F0F0F0] rounded-lg bg-[#FAFAFA] overflow-hidden">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isRunningAny ? (
                <svg className="w-4 h-4 animate-spin text-[#9A8FEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              <span className="text-sm font-medium text-[#374151]">
                {isRunningAny ? 'Running...' : 'Completed'} ({completedCount}/{totalCount})
              </span>
            </div>
            <svg 
              className={`w-4 h-4 text-[#9CA3AF] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Tool List */}
          {isExpanded && (
            <div className="border-t border-[#F0F0F0] divide-y divide-[#F0F0F0]">
              {displayInvocations
                .sort((a, b) => {
                  // Sort: running tools last (so they appear at bottom)
                  const aRunning = a.state === 'call';
                  const bRunning = b.state === 'call';
                  if (aRunning && !bRunning) return 1; // a goes after b
                  if (!aRunning && bRunning) return -1; // a goes before b
                  return 0; // maintain original order for same state
                })
                .map((inv) => {
                const isRunning = inv.state === 'call';
                const isComplete = inv.state === 'result' || (!inv.state && inv.result);
                const isError = inv.result?.found === false || inv.result?.error;
                const toolName = getToolDisplayName(inv.toolName);
                const action = getToolAction(inv);
                
                return (
                  <div 
                    key={inv.toolCallId} 
                    className="flex items-center gap-3 px-3 py-2 bg-white hover:bg-[#FAFAFA] transition-colors"
                  >
                    {/* Status Icon */}
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {isRunning && (
                        <svg className="w-3.5 h-3.5 animate-spin text-[#9A8FEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      )}
                      {isComplete && !isError && (
                        <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {isError && (
                        <svg className="w-3.5 h-3.5 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Tool Name */}
                    <span className={`text-xs font-semibold min-w-[120px] ${isRunning ? 'text-[#9A8FEA]' : isError ? 'text-[#EF4444]' : 'text-[#374151]'}`}>
                      {toolName}
                    </span>
                    
                    {/* Action */}
                    {action && (
                      <span className={`text-xs truncate flex-1 ${isRunning ? 'text-[#B4A8F8] italic' : 'text-[#6B7280]'}`}>
                        {action}
                      </span>
                    )}
                    
                    {/* Keyword Metrics */}
                    {inv.result?.keyword && inv.result?.found !== false && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-medium flex-shrink-0">
                        <span className="bg-[#F3F4F6] px-1.5 py-0.5 rounded">Vol: {inv.result.searchVolume?.toLocaleString()}</span>
                        <span className="bg-[#F3F4F6] px-1.5 py-0.5 rounded">KD: {inv.result.keywordDifficulty?.toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* File List */}
      {showFiles && fileResults.length > 0 && (
        <div className="border border-[#F0F0F0] rounded-lg bg-[#FAFAFA] overflow-hidden">
          <button
            onClick={() => setFilesExpanded(!filesExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-sm font-medium text-[#374151]">
                Generated Files ({fileResults.reduce((acc, inv) => {
                  if (Array.isArray(inv.result?.images)) {
                    return acc + inv.result.images.length;
                  }
                  return acc + 1;
                }, 0)})
              </span>
            </div>
            <svg 
              className={`w-4 h-4 text-[#9CA3AF] transition-transform ${filesExpanded ? 'rotate-180' : ''}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {filesExpanded && (
            <div className="border-t border-[#F0F0F0] p-2 space-y-2 bg-white/50">
              {fileResults.map(inv => {
                let fallbackInfo: { primaryServiceFailed?: string; fallbackUsed?: boolean } = {};
                if (inv.toolName === 'deerapi_generate_images') {
                  const previousGenerateImages = toolInvocations.find(
                    (prevInv: any) => 
                      prevInv.toolName === 'generate_images' && 
                      prevInv.toolCallId !== inv.toolCallId &&
                      (!prevInv.result?.success || prevInv.result?.images?.some((img: any) => img.status === 'error'))
                  );
                  if (previousGenerateImages) {
                    fallbackInfo = {
                      primaryServiceFailed: 'Google Gemini',
                      fallbackUsed: true
                    };
                  }
                }
                
                if (Array.isArray(inv.result?.images)) {
                  return inv.result.images.map((img: any, idx: number) => (
                    <FileDownloadCard
                      key={`${inv.toolCallId}-${idx}`}
                      result={{ ...img, needsUpload: false, ...fallbackInfo }}
                      userId={userId}
                      conversationId={conversationId}
                      files={files}
                      onUploadSuccess={onUploadSuccess}
                      toolName={inv.toolName}
                      compact={true}
                    />
                  ));
                }

                const safeResult = { ...inv.result, needsUpload: false, ...fallbackInfo };
                return (
                  <FileDownloadCard
                    key={inv.toolCallId}
                    result={safeResult}
                    userId={userId}
                    conversationId={conversationId}
                    files={files}
                    onUploadSuccess={onUploadSuccess}
                    toolName={inv.toolName}
                    compact={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

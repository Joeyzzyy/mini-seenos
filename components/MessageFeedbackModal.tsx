'use client';

import { useState } from 'react';

interface MessageFeedbackModalProps {
  isOpen: boolean;
  feedbackType: 'like' | 'dislike' | null;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function MessageFeedbackModal({
  isOpen,
  feedbackType,
  onClose,
  onSubmit,
  isLoading = false,
}: MessageFeedbackModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !feedbackType) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    await onSubmit(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const isLike = feedbackType === 'like';
  const placeholder = isLike 
    ? 'Please tell us why you like this response...'
    : 'Please tell us why you dislike this response so we can improve...';

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50" 
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isLike ? 'bg-[#ECFDF5]' : 'bg-[#FEF2F2]'
              }`}>
                {isLike ? (
                  <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#111827] mb-1">
                  {isLike ? 'Like this response' : 'Dislike this response'}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {isLike 
                    ? 'Thank you for your feedback! Please tell us why you like this response.'
                    : 'Thank you for your feedback! Please tell us what needs improvement.'
                  }
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[100px] px-4 py-3 border border-[#E5E5E5] rounded-lg text-sm text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent resize-none"
                autoFocus
                disabled={isLoading}
              />
              
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-white border border-[#E5E5E5] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim() || isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLike
                      ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                      : 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                  }`}
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


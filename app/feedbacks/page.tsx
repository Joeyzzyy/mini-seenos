'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface Feedback {
  id: string;
  message_id: string;
  user_id: string;
  conversation_id: string;
  feedback_type: 'like' | 'dislike';
  reason: string;
  message_content: string | null;
  created_at: string;
  updated_at: string;
}

interface ConversationInfo {
  id: string;
  title: string;
}

interface UserInfo {
  id: string;
  email: string;
}

export default function FeedbacksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [conversations, setConversations] = useState<Record<string, ConversationInfo>>({});
  const [users, setUsers] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'like' | 'dislike'>('all');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadFeedbacks();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadFeedbacks();
      } else {
        setFeedbacks([]);
        setConversations({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      // Load all feedbacks from API
      const response = await fetch('/api/feedbacks');
      if (!response.ok) throw new Error('Failed to load feedbacks');
      
      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
      setConversations(data.conversations || {});
      setUsers(data.users || {});
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filter by type
    if (filterType !== 'all' && feedback.feedback_type !== filterType) {
      return false;
    }
    return true;
  });

  const stats = {
    total: feedbacks.length,
    likes: feedbacks.filter(f => f.feedback_type === 'like').length,
    dislikes: feedbacks.filter(f => f.feedback_type === 'dislike').length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Image 
              src="/product-logo.webp" 
              alt="Mini Seenos Logo" 
              width={96} 
              height={96}
              className="mx-auto animate-subtle-shake"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] mb-4">Message Feedbacks</h1>
          <p className="text-[#6B7280]">Please sign in to view feedbacks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FAFAFA] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Feedbacks</p>
                <p className="text-3xl font-bold text-[#111827]">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Likes</p>
                <p className="text-3xl font-bold text-[#10B981]">{stats.likes}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Dislikes</p>
                <p className="text-3xl font-bold text-[#EF4444]">{stats.dislikes}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('like')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'like'
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              Likes
            </button>
            <button
              onClick={() => setFilterType('dislike')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'dislike'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              Dislikes
            </button>
          </div>
        </div>

        {/* Feedbacks List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-[#E5E5E5] border-t-[#111827] animate-spin"></div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-[#E5E5E5] text-center">
            <svg className="w-16 h-16 text-[#E5E5E5] mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z" />
            </svg>
            <p className="text-[#6B7280] text-lg">No feedbacks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Feedback Type Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    feedback.feedback_type === 'like'
                      ? 'bg-[#ECFDF5]'
                      : 'bg-[#FEF2F2]'
                  }`}>
                    {feedback.feedback_type === 'like' ? (
                      <svg className="w-5 h-5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[#EF4444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className={`text-sm font-semibold mb-1 ${
                          feedback.feedback_type === 'like' ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}>
                          {feedback.feedback_type === 'like' ? 'Liked' : 'Disliked'}
                        </h3>
                        <p className="text-xs text-[#6B7280]">
                          <span className="font-medium text-[#374151]">{users[feedback.user_id]?.email || 'Unknown User'}</span> • {conversations[feedback.conversation_id]?.title || 'Unknown Conversation'} • {new Date(feedback.created_at).toLocaleDateString()} {new Date(feedback.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-[#111827] mb-1">Feedback Reason:</p>
                      <p className="text-sm text-[#374151] bg-[#F9FAFB] rounded-lg p-3">
                        {feedback.reason}
                      </p>
                    </div>

                    {/* Message Content */}
                    {feedback.message_content && (
                      <div>
                        <p className="text-sm font-medium text-[#111827] mb-1">Agent Response:</p>
                        <div className="text-sm text-[#6B7280] bg-[#F9FAFB] rounded-lg p-3 whitespace-pre-wrap break-words max-h-96 overflow-y-auto thin-scrollbar">
                          {feedback.message_content}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


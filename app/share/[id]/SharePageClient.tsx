'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Conversation, FileRecord, ContentItem } from '@/lib/supabase';
import { getContentItemById } from '@/lib/supabase';
import MessageList from '@/components/MessageList';
import ContentDrawer from '@/components/ContentDrawer';

interface SharePageClientProps {
  conversation: Conversation;
  messages: any[];
  files: FileRecord[];
}

export default function SharePageClient({ conversation, messages, files }: SharePageClientProps) {
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);

  const handlePreviewContentItem = async (itemId: string) => {
    try {
      const item = await getContentItemById(itemId);
      if (item) {
        setSelectedContentItem(item);
      }
    } catch (error) {
      console.error('Failed to load content item for preview:', error);
    }
  };

  return (
    <div className="h-screen bg-[#FAFAFA] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-[#F3F4F6] bg-white sticky top-0 z-10 flex items-center px-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold text-[#111827] truncate">
              {conversation.title}
            </h1>
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-bold">Shared Conversation</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#111827] bg-[#F3F4F6] px-4 py-2 rounded-xl border border-[#E5E5E5] hover:bg-[#E5E5E5] transition-all"
          >
            Try Alternative Page Generator
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <MessageList 
            messages={messages} 
            isLoading={false} 
            userId={conversation.user_id}
            conversationId={conversation.id}
            files={files}
            onPreviewContentItem={handlePreviewContentItem}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-[#F3F4F6] bg-white text-center">
        <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-widest">
          Created with Alternative Page Generator &bull; 2025
        </p>
      </footer>

      {/* Content Detail Drawer (for HTML preview) */}
      <ContentDrawer
        item={selectedContentItem}
        onClose={() => setSelectedContentItem(null)}
      />
    </div>
  );
}


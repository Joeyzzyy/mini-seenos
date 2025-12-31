'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './AuthButton';
import type { Conversation, ContentItem, ContentProject, SiteContext } from '@/lib/supabase';

interface ConversationSidebarProps {
  contentItems: ContentItem[];
  contentProjects: ContentProject[];
  siteContexts: SiteContext[];
  onSelectContentItem: (item: ContentItem) => void;
  onRefreshContent: () => void;
  onDeleteProject: (projectId: string, projectName: string) => void;
  onDeleteContentItem: (itemId: string, itemTitle: string) => void;
  onEditSiteContext: (type: 'logo' | 'header' | 'footer' | 'meta' | 'sitemap') => void;
  // Conversation props
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewConversation: () => void;
  onSwitchConversation: (conversation: Conversation) => void;
  onRenameConversation: (conversationId: string, newTitle: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onToggleShowcase: (conversationId: string, isShowcase: boolean) => void;
}

export default function ConversationSidebar({
  contentItems,
  contentProjects,
  siteContexts,
  onSelectContentItem,
  onRefreshContent,
  onDeleteProject,
  onDeleteContentItem,
  onEditSiteContext,
  conversations,
  currentConversation,
  onNewConversation,
  onSwitchConversation,
  onRenameConversation,
  onDeleteConversation,
  onToggleShowcase,
}: ConversationSidebarProps) {
  const [expandedClusters, setExpandedClusters] = useState<Record<string, boolean>>({});
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'project' | 'item';
    id: string;
    name: string;
    itemCount?: number;
  } | null>(null);

  // Conversation editing state
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startEditingConversation = (conversationId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle);
  };

  const cancelEditingConversation = () => {
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const handleRename = (conversationId: string) => {
    if (!editingTitle.trim()) {
      cancelEditingConversation();
      return;
    }
    onRenameConversation(conversationId, editingTitle);
    cancelEditingConversation();
  };

  const sidebarWidth = 'w-72';

  const siteContextTypes: Array<{ 
    type: 'logo' | 'header' | 'footer' | 'meta' | 'sitemap'; 
    label: string; 
    icon: React.ReactNode;
    hasContent: boolean;
  }> = [
    {
      type: 'logo',
      label: 'Logo',
      icon: (
        <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      hasContent: !!siteContexts.find(c => c.type === 'logo' && (c.file_url || c.content)),
    },
    {
      type: 'header',
      label: 'Header',
      icon: (
        <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="4" rx="1" />
          <rect x="3" y="10" width="18" height="11" rx="1" />
        </svg>
      ),
      hasContent: !!siteContexts.find(c => c.type === 'header' && c.content),
    },
    {
      type: 'footer',
      label: 'Footer',
      icon: (
        <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="11" rx="1" />
          <rect x="3" y="17" width="18" height="4" rx="1" />
        </svg>
      ),
      hasContent: !!siteContexts.find(c => c.type === 'footer' && c.content),
    },
    {
      type: 'meta',
      label: 'Meta Tags',
      icon: (
        <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      hasContent: !!siteContexts.find(c => c.type === 'meta' && c.content),
    },
    {
      type: 'sitemap',
      label: 'Sitemap',
      icon: (
        <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      hasContent: !!siteContexts.find(c => c.type === 'sitemap' && c.content),
    },
  ];

  const toggleCluster = (projectId: string) => {
    setExpandedClusters(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Group items by project
  const groupedContent = contentProjects.map(project => ({
    ...project,
    items: contentItems.filter(item => item.project_id === project.id)
  }));

  // Items without a project (Uncategorized)
  const uncategorizedItems = contentItems.filter(item => !item.project_id);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return '';
      case 'in_production': return 'Production';
      case 'generated': return 'Generated';
      case 'published': return 'Published';
      default: return status;
    }
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === 'ready') {
      return {
        background: 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    if (status === 'generated') {
      return {
        background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    switch (status) {
      case 'in_production': return { color: '#F59E0B' };
      case 'published': return { color: '#10B981' };
      default: return { color: '#9CA3AF' };
    }
  };

  const handleProjectContextMenu = (e: React.MouseEvent, project: ContentProject) => {
    e.preventDefault();
    e.stopPropagation();
    const itemCount = contentItems.filter(item => item.project_id === project.id).length;
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'project',
      id: project.id,
      name: project.name,
      itemCount,
    });
  };

  const handleItemContextMenu = (e: React.MouseEvent, item: ContentItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'item',
      id: item.id,
      name: item.title,
    });
  };

  const handleContextMenuAction = (action: 'delete') => {
    if (!contextMenu) return;
    
    if (action === 'delete') {
      if (contextMenu.type === 'project') {
        onDeleteProject(contextMenu.id, contextMenu.name);
      } else {
        onDeleteContentItem(contextMenu.id, contextMenu.name);
      }
    }
    setContextMenu(null);
  };

  return (
    <aside className={`${sidebarWidth} bg-white border-r border-[#F5F5F5] flex flex-col h-screen overflow-hidden`} onClick={() => setContextMenu(null)}>
      {/* Sidebar Header - Logo */}
      <div className="p-4 shrink-0">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
          <Image 
            src="/product-logo.webp" 
            alt="Mini Seenos Logo" 
            width={32} 
            height={32}
            className="w-full h-full object-contain rounded-xl"
          />
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* On Going Pages Section (Top 1/3) */}
        <div className="flex flex-col h-1/3 min-h-0 border-b border-[#F5F5F5]">
          <div className="px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span>On Going Pages</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshContent();
                }}
                className="p-0.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
                title="Refresh Content"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
              </button>
            </div>
            <span className="bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded text-[11px] font-medium">
              {contentItems.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto thin-scrollbar px-2 pb-2">
            {contentItems.length === 0 && contentProjects.length === 0 ? (
              <div className="px-3 py-4 text-[11px] text-[#9CA3AF] italic text-center">
                No content items yet
              </div>
            ) : (
              <div className="space-y-1">
                {/* Topic Clusters (Projects) */}
                {groupedContent.map((cluster) => (
                  <div key={cluster.id} className="space-y-0.5">
                    <button
                      onClick={() => toggleCluster(cluster.id)}
                      onContextMenu={(e) => handleProjectContextMenu(e, cluster)}
                      className="w-full flex items-center gap-1.5 p-1 rounded hover:bg-[#F3F4F6] transition-all cursor-pointer group"
                    >
                      <span className={`text-[10px] text-[#D1D5DB] transition-transform ${expandedClusters[cluster.id] ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                      <span className="flex-1 text-[11px] font-bold text-[#4B5563] truncate text-left uppercase tracking-tight">
                        {cluster.name}
                      </span>
                    </button>
                    
                    {expandedClusters[cluster.id] && (
                      <div className="pl-2 ml-2 space-y-0.5">
                        {cluster.items.map((item) => {
                          const isGenerated = item.status === 'generated' || !!item.generated_content;
                          return (
                          <div key={item.id} className="group relative flex items-center gap-2 p-1 rounded hover:bg-[#F3F4F6] transition-all text-left">
                            <button
                              onClick={() => onSelectContentItem(item)}
                              onContextMenu={(e) => handleItemContextMenu(e, item)}
                              className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer"
                            >
                              {isGenerated ? (
                                <svg className="w-3.5 h-3.5 text-[#10B981] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                  <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-[#D1D5DB] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                  <polyline points="13 2 13 9 20 9" />
                                </svg>
                              )}
                              <span className="flex-1 text-[11px] text-[#374151] truncate">
                                {item.title}
                              </span>
                              {item.status !== 'ready' && !isGenerated && (
                                <span 
                                  className="text-[9px] font-bold uppercase shrink-0"
                                  style={getStatusStyle(item.status)}
                                >
                                  {getStatusText(item.status)}
                                </span>
                              )}
                            </button>
                            
                            {/* Live Preview Link for Generated Pages */}
                            {isGenerated && (
                              <a
                                href={`/api/preview/${item.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-all shrink-0 cursor-pointer"
                                title="View Live Page"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="w-3 h-3 text-[#9A8FEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 8" />
                                  <line x1="10" y1="11" x2="21" y2="3" />
                                </svg>
                              </a>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Uncategorized Items */}
                {uncategorizedItems.map((item) => {
                  const isGenerated = item.status === 'generated' || !!item.generated_content;
                  return (
                  <div key={item.id} className="group relative flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-all text-left">
                    <button
                      onClick={() => onSelectContentItem(item)}
                      onContextMenu={(e) => handleItemContextMenu(e, item)}
                      className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer"
                    >
                      {isGenerated ? (
                        <svg className="w-3.5 h-3.5 text-[#10B981] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-[#D1D5DB] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <polyline points="13 2 13 9 20 9" />
                        </svg>
                      )}
                      <span className="flex-1 text-[11px] text-[#374151] truncate">
                        {item.title}
                      </span>
                      {item.status !== 'ready' && !isGenerated && (
                        <span 
                          className="text-[9px] font-bold uppercase shrink-0"
                          style={getStatusStyle(item.status)}
                        >
                          {getStatusText(item.status)}
                        </span>
                      )}
                    </button>
                    
                    {/* Live Preview Link for Generated Pages */}
                    {isGenerated && (
                      <a
                        href={`/api/preview/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-all shrink-0 cursor-pointer"
                        title="View Live Page"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3 h-3 text-[#9A8FEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 8" />
                          <line x1="10" y1="11" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* On Site Context Section (Middle 1/3) */}
        <div className="flex flex-col h-1/3 min-h-0 border-b border-[#F5F5F5]">
          <div className="px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider shrink-0">
            On Site Context
          </div>
          <div className="flex-1 overflow-y-auto thin-scrollbar px-2 pb-2 space-y-0.5">
            {siteContextTypes.map((item) => (
              <button
                key={item.type}
                onClick={() => onEditSiteContext(item.type)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#F3F4F6] transition-all cursor-pointer text-left group"
              >
                {item.icon}
                <span className="flex-1 text-xs font-medium text-[#374151]">
                  {item.label}
                </span>
                <span className={`text-[10px] font-medium shrink-0 ${item.hasContent ? 'text-[#9A8FEA]' : 'text-[#9CA3AF]'}`}>
                  {item.hasContent ? 'Configured' : 'Empty'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Your Chats Section (Bottom 1/3) */}
        <div className="flex flex-col h-1/3 min-h-0">
          <div className="px-4 py-3 flex items-center justify-between shrink-0">
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Your Chats</h2>
            <div className="flex items-center gap-2">
              <span className="bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded text-[11px] font-medium">
                {conversations.length}
              </span>
              <button
                onClick={onNewConversation}
                className="p-1 rounded hover:bg-[#F3F4F6] text-[#6B7280] transition-colors cursor-pointer"
                title="New Chat"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto thin-scrollbar px-2 py-2">
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${
                    currentConversation?.id === conv.id
                      ? 'bg-[#F3F4F6]'
                      : 'hover:bg-[#F3F4F6]'
                  }`}
                >
                  {editingConversationId === conv.id ? (
                    // Editing mode
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(conv.id);
                          } else if (e.key === 'Escape') {
                            cancelEditingConversation();
                          }
                        }}
                        className="flex-1 px-2 py-1 text-xs border border-[#E5E5E5] rounded focus:outline-none focus:border-[#E5E5E5] bg-white"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={() => handleRename(conv.id)}
                        className="p-0.5 rounded hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                        title="Save"
                      >
                        <svg className="w-3.5 h-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    // Normal mode
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleShowcase(conv.id, !conv.is_showcase);
                        }}
                        className={`p-1 rounded transition-all cursor-pointer shrink-0 ${
                          conv.is_showcase 
                            ? 'text-[#F59E0B] hover:text-[#D97706]' 
                            : 'text-[#D1D5DB] hover:text-[#F59E0B]'
                        }`}
                        title={conv.is_showcase ? 'Remove from showcase' : 'Mark as showcase'}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={conv.is_showcase ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onSwitchConversation(conv)}
                        className="flex-1 text-left text-xs font-medium text-[#374151] truncate"
                      >
                        {conv.title}
                      </button>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => startEditingConversation(conv.id, conv.title, e)}
                          className="p-1 rounded hover:bg-white transition-all cursor-pointer"
                          title="Rename"
                        >
                          <svg className="w-3.5 h-3.5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          }}
                          className="p-1 rounded hover:bg-white transition-all cursor-pointer text-[#EF4444]"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#F5F5F5] flex items-center gap-2 shrink-0">
        {/* User Info */}
        <AuthButton />
        
        {/* Skills Link */}
        <Link
          href="/skills"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-all flex-shrink-0"
          title="AI Skills & Tools"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </Link>
        
        {/* Feedbacks Link */}
        <Link
          href="/feedbacks"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-all flex-shrink-0"
          title="Message Feedbacks"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </Link>
        
        {/* Sign Out Button */}
        <button
          onClick={() => {
            // Sign out via supabase
            import('@/lib/supabase').then(({ supabase }) => {
              supabase.auth.signOut();
            });
          }}
          className="flex items-center justify-center p-2 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-all flex-shrink-0"
          title="Sign Out"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          {/* Invisible overlay to catch clicks */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed bg-white border border-[#E5E5E5] rounded-md shadow-lg py-0.5 z-50 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleContextMenuAction('delete')}
              className="w-full px-3 py-1.5 text-left text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>
                {contextMenu.type === 'project' 
                  ? `Delete Project${contextMenu.itemCount && contextMenu.itemCount > 0 ? ` (${contextMenu.itemCount})` : ''}`
                  : 'Delete'
                }
              </span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}


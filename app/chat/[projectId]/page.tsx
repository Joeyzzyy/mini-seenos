'use client';

import { useChat } from 'ai/react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  supabase, 
  createConversation, 
  getUserConversations, 
  getConversationMessages, 
  saveMessage, 
  deleteConversation,
  updateConversationTitle,
  toggleConversationShowcase, 
  getConversationTokenStats, 
  getConversationApiStats, 
  incrementTavilyCalls, 
  incrementSemrushCalls,
  incrementSerperCalls, 
  getConversationFiles, 
  getUserContentItems,
  getUserContentProjects,
  getContentItemById,
  deleteFile,
  deleteContentItem,
  deleteContentProject,
  uploadFileToStorage,
  getSiteContexts,
  getSiteContextByType,
  upsertSiteContext,
  getSEOProjectById
} from '@/lib/supabase';
import type { Conversation, FileRecord, ContentItem, ContentProject, SiteContext, SEOProject } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthButton from '@/components/AuthButton';
import ConversationSidebar from '@/components/ConversationSidebar';
import MessageList from '@/components/MessageList';
import ChatInput, { KnowledgeFileRef } from '@/components/ChatInput';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ConfirmModal from '@/components/ConfirmModal';
import ContentDrawer from '@/components/ContentDrawer';
import GSCIntegrationStatus from '@/components/GSCIntegrationStatus';
import DomainsModal from '@/components/DomainsModal';
import ContextModalNew from '@/components/ContextModalNew';
import Toast from '@/components/Toast';
import TopBar from '@/components/TopBar';
import ConversationsDropdown from '@/components/ConversationsDropdown';

interface Skill {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: Array<{
    id: string;
    description: string;
  }>;
  examples: string[];
  metadata: {
    category?: string;
    tags?: string[];
    playbook?: {
      trigger?: {
        type: 'form' | 'direct';
        fields?: Array<{
          id: string;
          label: string;
          type: 'text' | 'select' | 'country';
          options?: Array<{ label: string; value: string }>;
          placeholder?: string;
          required?: boolean;
          defaultValue?: string;
        }>;
        initialMessage?: string;
      }
    };
  };
}

export default function ProjectChatPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const currentConversationRef = useRef<Conversation | null>(null);
  
  const updateCurrentConversation = (conv: Conversation | null) => {
    setCurrentConversation(conv);
    currentConversationRef.current = conv;
  };
  
  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentProjects, setContentProjects] = useState<ContentProject[]>([]);
  const [siteContexts, setSiteContexts] = useState<SiteContext[]>([]);
  const [deletingCluster, setDeletingCluster] = useState<{ id: string; name: string } | null>(null);
  const [deletingContentItem, setDeletingContentItem] = useState<{ id: string; name: string } | null>(null);
  const [tokenStats, setTokenStats] = useState({ inputTokens: 0, outputTokens: 0 });
  const [apiStats, setApiStats] = useState({ tavilyCalls: 0, semrushCalls: 0, serperCalls: 0 });
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
  const [deletingContent, setDeletingContent] = useState<{
    type: 'project' | 'item';
    id: string;
    name: string;
  } | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [attachedFileIds, setAttachedFileIds] = useState<string[]>([]);
  const [attachedContentItemIds, setAttachedContentItemIds] = useState<string[]>([]);
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false);
  const [isDomainsOpen, setIsDomainsOpen] = useState(false);
  const [isGSCOpen, setIsGSCOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [contextModalInitialTab, setContextModalInitialTab] = useState<'onsite' | 'knowledge'>('onsite');
  const [isConversationsListOpen, setIsConversationsListOpen] = useState(false);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFileRef[]>([]);
  const [mentionedFiles, setMentionedFiles] = useState<KnowledgeFileRef[]>([]);
  const allChatsButtonRef = useRef<HTMLButtonElement>(null);

  // Chat hook
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, setMessages, setInput, stop } = useChat({
    onError: async (error) => {
      console.error('[useChat:onError] Chat stream error:', error);
      const lastMessage = messages[messages.length - 1];
      const hasPartialResponse = lastMessage && lastMessage.role === 'assistant';
      let errorMessage = `❌ Error: ${error.message || 'An unexpected error occurred. Please try again.'}`;
      
      const errorMsg = {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        content: errorMessage,
      };
      
      setMessages(prev => [...prev, errorMsg as any]);
      
      const conversation = currentConversationRef.current;
      if (conversation && user) {
        try {
          if (hasPartialResponse && (lastMessage.content || (lastMessage.toolInvocations?.length ?? 0) > 0)) {
            const estimatedOutputTokens = Math.ceil((lastMessage.content || '').length / 4);
            const estimatedInputTokens = Math.ceil(messages.slice(0, -1).map((m: any) => m.content).join(' ').length / 4);
            
            await saveMessage(
              conversation.id,
              'assistant',
              lastMessage.content || '⚠️ (Partial response - interrupted by error)',
              estimatedInputTokens,
              estimatedOutputTokens,
              lastMessage.toolInvocations
            );
          }
          await saveMessage(conversation.id, 'assistant', errorMessage, 0, 0, null);
        } catch (saveError) {
          console.error('[useChat:onError] Failed to save error message:', saveError);
        }
      }
    },
    onFinish: async (message: any, options: any) => {
      const messageId = message.id || `${message.role}-${message.content?.slice(0, 50)}`;
      if (processedMessageIdsRef.current.has(messageId)) return;
      
      const conversation = currentConversationRef.current;
      if (conversation && user) {
        processedMessageIdsRef.current.add(messageId);
        try {
          const estimatedOutputTokens = Math.ceil((message.content || '').length / 4);
          const estimatedInputTokens = Math.ceil(messages.map(m => m.content).join(' ').length / 4);
          
          const savedMsg = await saveMessage(
            conversation.id, 'assistant', message.content || '',
            estimatedInputTokens, estimatedOutputTokens, message.toolInvocations
          );

          await loadTokenStats(conversation.id);
          await loadFiles(conversation.id);
        } catch (error) {
          console.error('Failed to save message:', error);
        }
      }
    },
  });

  const processedMessageIdsRef = useRef<Set<string>>(new Set());
  const isLoadingRef = useRef(false);
  
  useEffect(() => {
    if (isLoadingRef.current && !isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const messageId = lastMessage.id || `${lastMessage.role}-${lastMessage.content?.slice(0, 50)}`;
      if (lastMessage.role === 'assistant' && !processedMessageIdsRef.current.has(messageId)) {
        handleAssistantMessageComplete(lastMessage);
      }
    }
    isLoadingRef.current = isLoading;
  }, [isLoading, messages.length]);

  const handleAssistantMessageComplete = async (message: any) => {
    const messageId = message.id || `${message.role}-${message.content?.slice(0, 50)}`;
    if (processedMessageIdsRef.current.has(messageId)) return;
    
    const conversation = currentConversationRef.current;
    if (!conversation || !user) return;
    
    processedMessageIdsRef.current.add(messageId);
    try {
      const estimatedOutputTokens = Math.ceil((message.content || '').length / 4);
      const estimatedInputTokens = Math.ceil(messages.map(m => m.content).join(' ').length / 4);
      
      await saveMessage(
        conversation.id, 'assistant', message.content || '',
        estimatedInputTokens, estimatedOutputTokens, message.toolInvocations
      );
      
      await loadFiles(conversation.id);
      await loadTokenStats(conversation.id);
    } catch (error) {
      console.error('[handleAssistantMessageComplete] Failed to save message:', error);
    }
  };

  // Track if project has been initialized to prevent re-initialization on auth state changes
  const projectInitializedRef = useRef<string | null>(null);

  // Auth & Project state
  useEffect(() => {
    if (!projectId) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Only initialize if not already initialized for this project
        if (projectInitializedRef.current !== projectId) {
          initProject(session.user.id);
          projectInitializedRef.current = projectId;
        }
      } else {
        router.push('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Only initialize if not already initialized for this project
        // This prevents re-initialization on token refresh
        if (projectInitializedRef.current !== projectId) {
          initProject(session.user.id);
          projectInitializedRef.current = projectId;
        }
      } else {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [projectId]);

  const initProject = async (userId: string) => {
    try {
      console.log(`[Project-Init] Initializing project: ${projectId} for user: ${userId}`);
      setInitialLoading(true);
      const project = await getSEOProjectById(projectId);
      if (!project || project.user_id !== userId) {
        console.error('[Project-Init] Project not found or unauthorized');
        router.push('/projects');
        return;
      }
      setCurrentProject(project);
      
      // Load project specific data
      const contexts = await getSiteContexts(userId, projectId);
      setSiteContexts(contexts);
      console.log(`[Project-Init] Loaded ${contexts.length} site contexts`);
      
      const [convos] = await Promise.all([
        loadConversations(userId, projectId),
        loadContentItems(userId),
        loadContentProjects(userId),
        loadKnowledgeFiles()
      ]);

      // Check if context is empty and auto-initiate via skill
      // Check for 'logo' type which is our main brand context indicator
      const hasBrandContext = contexts.some(c => c.type === 'logo');
      
      if (!hasBrandContext && lastInitiatedProjectId.current !== projectId) {
        console.log('[Auto-Initiate] No brand context found, triggering skill acquisition...');
        lastInitiatedProjectId.current = projectId;
        
        // Check if any conversation has messages
        let hasExistingMessages = false;
        if (convos && convos.length > 0) {
          const msgs = await getConversationMessages(convos[0].id);
          hasExistingMessages = msgs.length > 0;
        }

        if (!hasExistingMessages) {
          autoInitiateSiteContext(project.domain, userId, convos?.[0] || null);
        }
      }
    } catch (error) {
      console.error('Failed to init project:', error);
      router.push('/projects');
    } finally {
      setInitialLoading(false);
    }
  };

  const lastInitiatedProjectId = useRef<string | null>(null);

  const autoInitiateSiteContext = async (domain: string, userId: string, existingConvo: Conversation | null = null) => {
    // Create first conversation for the project if none exists
    let conversationToUse = existingConvo;
    if (!conversationToUse) {
      try {
        console.log('[Auto-Initiate] Creating new conversation for context analysis...');
        conversationToUse = await createConversation(userId, projectId, `Alternative Page Planning: ${domain}`);
        setConversations([conversationToUse]);
        updateCurrentConversation(conversationToUse);
      } catch (error) {
        console.error('[Auto-Initiate] Failed to create conversation:', error);
        return;
      }
    } else {
      updateCurrentConversation(conversationToUse);
    }

    // Ensure domain has protocol
    const fullUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const prompt = `[Auto-initiated by system]

I'm starting the Alternative Page planning process for ${fullUrl}. You MUST complete ALL THREE PHASES in ONE continuous execution without stopping or asking for confirmation. Do not pause between phases - execute them sequentially in a single response.

## EXECUTION RULES:
- Complete ALL phases in ONE go - do not wait for user confirmation
- Execute phases sequentially: Phase 1 → Phase 2 → Phase 3
- Do not stop or ask "should I continue?" - just proceed automatically
- Report completion only after ALL phases are done

## PHASE 1: Brand Assets Collection (use 'acquire_context_field' tool)
Collect and save the following brand assets to the database:
- 'brand-assets' → Logo, colors, fonts, metadata
- 'about-us' → Company story, mission, values  
- 'products-services' → Product/service offerings
- 'who-we-serve' → Target audience
- 'contact-info' → Email, phone, social links
- 'faq' → Frequently asked questions
- 'social-proof' → Testimonials, reviews, awards

Execute these in parallel batches for efficiency. Each field call requires: url="${fullUrl}", userId, projectId.

## PHASE 2: Competitor Research & Saving (CRITICAL: use ONLY 'save_site_context' tool)
After analyzing the website, identify and save at least 10 competitors to the BRAND ASSETS database:

**CRITICAL INSTRUCTIONS:**
- You MUST use the 'save_site_context' tool (NOT 'save_content_item' or 'save_content_items_batch')
- This saves to site_contexts table (Brand Assets), NOT to content_items table
- DO NOT create a content page or save to any cluster/project
- This is part of Brand Assets collection, just like logo, colors, etc.

Steps:
1. Research competitors in the same industry/market as ${fullUrl}
2. Find competitors offering similar products/services
3. Use web search or your knowledge to find at least 10 competitors
4. For each competitor, collect:
   - Competitor name (company/product name)
   - Competitor website URL (full URL with https://)
5. Call 'save_site_context' tool ONCE with ALL competitors:
   - type: 'competitors' (exactly this string)
   - content: JSON string of array format: [{"name": "Competitor Name", "url": "https://competitor.com"}, ...]
   - userId: (pass the userId from your context)
   - projectId: (pass the projectId from your context)
   
   Example content format (must be valid JSON string):
   [{"name": "Competitor 1", "url": "https://competitor1.com"}, {"name": "Competitor 2", "url": "https://competitor2.com"}, ...]

**VERY IMPORTANT:**
- You must find and save at least 10 competitors
- Use web search if needed to find relevant competitors
- DO NOT use save_content_item or save_content_items_batch - those save to content library, not brand assets
- The competitors list should appear in Brand Assets modal, not in Page Blueprint section

## PHASE 3: Page Planning (use 'keyword_overview', 'search_serp', 'save_content_item' tools)
After competitors are saved:
1. For each competitor, search "[Competitor] alternative" keyword data
2. Design alternative page strategies with:
   - Page title and target keyword
   - Key differentiators to highlight
   - Target audience segments
3. Generate detailed content outlines (H1, H2, H3) and save to content library

## CRITICAL EXECUTION INSTRUCTIONS:
- Execute ALL THREE phases in ONE continuous response
- Do NOT stop after Phase 1 or Phase 2 - continue immediately to the next phase
- Do NOT ask for user confirmation - proceed automatically
- Complete Phase 1 → immediately proceed to Phase 2 → immediately proceed to Phase 3
- Only report final completion after ALL phases are done

Start executing Phase 1 now, then immediately continue to Phase 2 and Phase 3 without stopping.`;
    
    console.log(`[Auto-Initiate] Sending context acquisition request for: ${fullUrl}`);
    
    // Save the auto-initiated message to database FIRST
    try {
      await saveMessage(conversationToUse.id, 'user', prompt, Math.ceil(prompt.length / 4), 0);
      console.log('[Auto-Initiate] User message saved to database');
    } catch (saveError) {
      console.error('[Auto-Initiate] Failed to save user message:', saveError);
    }
    
    // Wait for state to settle, then trigger without specific skill (let AI use multiple skills)
    setTimeout(() => {
      console.log('[Auto-Initiate] Calling append for brand assets + page planning...');
      append(
        { role: 'user', content: prompt } as any,
        {
          data: {
            userId: userId,
            conversationId: conversationToUse!.id,
            projectId: projectId,
            // Don't set activeSkillId - let AI use multiple skills as needed
            isAutoInitiated: true,
          } as any,
        }
      ).then(() => {
        console.log('[Auto-Initiate] Append completed');
      }).catch(err => {
        console.error('[Auto-Initiate] Error calling append:', err);
      });
    }, 500);
  };

  // Fetch skills
  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data.skills || []))
      .catch(err => console.error('Failed to fetch skills:', err));
  }, []);

  // Load data functions
  const loadConversations = async (userId: string, projectId: string) => {
    try {
      const convos = await getUserConversations(userId, projectId);
      setConversations(convos);
      if (convos.length > 0) {
        await switchConversation(convos[0]);
      }
      return convos;
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  };

  const loadFiles = async (conversationId: string | null) => {
    if (!conversationId) {
      setFiles([]);
      return;
    }
    try {
      const conversationFiles = await getConversationFiles(conversationId);
      setFiles(conversationFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const loadContentItems = async (userId: string) => {
    try {
      const items = await getUserContentItems(userId);
      setContentItems(items);
    } catch (error) {
      console.error('Failed to load content items:', error);
    }
  };

  const loadContentProjects = async (userId: string) => {
    try {
      const projects = await getUserContentProjects(userId);
      setContentProjects(projects);
    } catch (error) {
      console.error('Failed to load content projects:', error);
    }
  };

  const handleDeleteCluster = async () => {
    if (!deletingCluster || !user) return;
    try {
      await deleteContentProject(deletingCluster.id);
      setContentProjects(prev => prev.filter(p => p.id !== deletingCluster.id));
      setContentItems(prev => prev.filter(i => i.project_id !== deletingCluster.id));
      setDeletingCluster(null);
    } catch (error) {
      console.error('Failed to delete cluster:', error);
      alert('Failed to delete cluster. Please try again.');
    }
  };

  const handleDeleteContentItem = async () => {
    if (!deletingContentItem || !user) return;
    try {
      await deleteContentItem(deletingContentItem.id);
      setContentItems(prev => prev.filter(i => i.id !== deletingContentItem.id));
      setDeletingContentItem(null);
    } catch (error) {
      console.error('Failed to delete content item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const loadSiteContexts = async (userId: string) => {
    try {
      const contexts = await getSiteContexts(userId, projectId);
      setSiteContexts(contexts);
    } catch (error) {
      console.error('Failed to load site contexts:', error);
    }
  };

  const loadKnowledgeFiles = async () => {
    if (!projectId) {
      setKnowledgeFiles([]);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      
      const response = await fetch(`/api/knowledge?projectId=${projectId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setKnowledgeFiles(data.files.map((f: any) => ({
          id: f.id,
          file_name: f.file_name,
          file_type: f.file_type,
          storage_path: f.storage_path,
          url: f.url
        })));
      }
    } catch (error) {
      console.error('Failed to load knowledge files:', error);
    }
  };

  const handleMentionFile = (file: KnowledgeFileRef) => {
    if (!mentionedFiles.find(f => f.id === file.id)) {
      setMentionedFiles(prev => [...prev, file]);
    }
  };

  const handleRemoveMentionedFile = (fileId: string) => {
    setMentionedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const loadTokenStats = async (conversationId: string) => {
    try {
      const [stats, apiCalls] = await Promise.all([
        getConversationTokenStats(conversationId),
        getConversationApiStats(conversationId),
      ]);
      setTokenStats({
        inputTokens: stats.inputTokens,
        outputTokens: stats.outputTokens,
      });
      setApiStats({
        tavilyCalls: apiCalls.tavilyCalls,
        semrushCalls: apiCalls.semrushCalls,
        serperCalls: apiCalls.serperCalls || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const switchConversation = async (conversation: Conversation) => {
    updateCurrentConversation(conversation);
    processedMessageIdsRef.current.clear();
    try {
      const msgs = await getConversationMessages(conversation.id);
      const mappedMessages = msgs.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        toolInvocations: m.tool_invocations,
        annotations: m.annotations,
      }));
      setMessages(mappedMessages);
      loadTokenStats(conversation.id);
      loadFiles(conversation.id);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewConversation = async () => {
    if (!user) return;
    try {
      const newConvo = await createConversation(user.id, projectId);
      setConversations([newConvo, ...conversations]);
      updateCurrentConversation(newConvo);
      setMessages([]);
      setFiles([]);
      setTokenStats({ inputTokens: 0, outputTokens: 0 });
      setApiStats({ tavilyCalls: 0, semrushCalls: 0, serperCalls: 0 });
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleRenameConversation = async (conversationId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      await updateConversationTitle(conversationId, newTitle.trim());
      setConversations(conversations.map(c => c.id === conversationId ? { ...c, title: newTitle.trim() } : c));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation({ ...currentConversation, title: newTitle.trim() });
      }
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  };

  const confirmDeleteConversation = (conversationId: string) => {
    setDeletingConversationId(conversationId);
  };

  const handleDeleteConversation = async () => {
    if (!deletingConversationId) return;
    const conversationId = deletingConversationId;
    setDeletingConversationId(null);
    try {
      await deleteConversation(conversationId);
      const updatedConversations = conversations.filter(c => c.id !== conversationId);
      setConversations(updatedConversations);
      if (currentConversation?.id === conversationId) {
        if (updatedConversations.length > 0) switchConversation(updatedConversations[0]);
        else {
          setCurrentConversation(null);
          setMessages([]);
          setFiles([]);
          setTokenStats({ inputTokens: 0, outputTokens: 0 });
          setApiStats({ tavilyCalls: 0, semrushCalls: 0, serperCalls: 0 });
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSaveSiteContext = async (data: any) => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

      const response = await fetch('/api/site-contexts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...data, projectId: projectId }),
      });

      if (!response.ok) throw new Error('Failed to save site context');
      await loadSiteContexts(user.id);
      setToast({ isOpen: true, message: 'Context saved successfully!' });
    } catch (error) {
      console.error('Failed to save site context:', error);
      setToast({ isOpen: true, message: 'Failed to save context' });
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    let conversationToUse = currentConversation;
    if (!conversationToUse) {
      conversationToUse = await createConversation(user.id, projectId);
      setConversations([conversationToUse, ...conversations]);
      updateCurrentConversation(conversationToUse);
    }
    
    // Build message content with file references
    let messageContent = input;
    const currentMentionedFiles = [...mentionedFiles];
    
    // Add file reference info at the start of message for agent
    if (currentMentionedFiles.length > 0) {
      const fileRefs = currentMentionedFiles.map(f => 
        `[Referenced Knowledge File: "${f.file_name}" (${f.file_type}) - Storage: ${f.storage_path}${f.url ? ` - URL: ${f.url}` : ''}]`
      ).join('\n');
      messageContent = `${fileRefs}\n\n${messageContent}`;
    }
    
    setInput('');
    setMentionedFiles([]); // Clear mentioned files after sending
    
    saveMessage(conversationToUse.id, 'user', messageContent, Math.ceil(messageContent.length / 4), 0)
      .then(() => loadTokenStats(conversationToUse!.id))
      .catch(err => console.error('Failed to save message:', err));
    
    await append({ role: 'user', content: messageContent } as any, {
      data: {
        userId: user.id,
        conversationId: conversationToUse.id,
        projectId: projectId,
        mentionedKnowledgeFiles: currentMentionedFiles,
      } as any,
    });
  };


  const handleExportLog = () => {
    if (!messages.length) return;
    let logText = `CONVERSATION LOG: ${currentConversation?.title || 'Untitled'}\nID: ${currentConversation?.id || 'N/A'}\n\n`;
    messages.forEach((msg, idx) => {
      logText += `[${msg.role.toUpperCase()} #${idx + 1}]\n${msg.content}\n\n`;
    });
    navigator.clipboard.writeText(logText);
    setToast({ isOpen: true, message: 'Log copied to clipboard!' });
  };

  return (
    <div className="h-screen bg-[#FAFAFA] flex flex-col p-2 gap-2">
      {user && (
        <TopBar 
          user={user}
          onDomainsClick={() => setIsDomainsOpen(true)}
          onGSCClick={() => setIsGSCOpen(true)}
          showBackToProjects={true}
        />
      )}

      <div className="flex-1 flex overflow-hidden gap-2">
        {user && (
          <div className="shrink-0">
            <ConversationSidebar
              siteContexts={siteContexts}
              contentItems={contentItems}
              contentProjects={contentProjects}
              onEditSiteContext={() => {}}
              onSelectContentItem={(item) => setSelectedContentItem(item)}
              onRefreshContent={() => loadContentItems(user.id)}
              onDeleteProject={(id, name) => setDeletingCluster({ id, name })}
              onDeleteContentItem={(id, name) => setDeletingContentItem({ id, name })}
              onOpenContextModal={(tab) => {
                setContextModalInitialTab(tab || 'onsite');
                setIsContextModalOpen(true);
              }}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col bg-white rounded-lg border border-[#E5E5E5] shadow-sm overflow-hidden">
          <header className="px-6 py-1.5 border-b border-[#E5E5E5] shrink-0 h-10 flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  {currentProject?.domain ? `Chat: ${currentProject.domain}` : 'Chat'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentConversation && (
                  <button onClick={handleExportLog} className="px-2 py-1 rounded border border-[#E5E5E5] text-[10px] font-medium text-[#6B7280] hover:bg-[#F3F4F6]">
                    Copy Chat
                  </button>
                )}
                <div className="flex items-center gap-2 relative">
                  <button onClick={() => setIsConversationsListOpen(!isConversationsListOpen)} ref={allChatsButtonRef} className="px-2 py-0.5 rounded border border-[#E5E5E5] text-[#6B7280] hover:bg-white text-[10px] font-medium">
                    All Chats
                  </button>
                  <button onClick={handleNewConversation} className="px-2 py-0.5 rounded border border-[#E5E5E5] text-[#6B7280] hover:bg-white text-[10px] font-medium">
                    New Chat
                  </button>
                  <ConversationsDropdown
                    isOpen={isConversationsListOpen}
                    onClose={() => setIsConversationsListOpen(false)}
                    conversations={conversations}
                    currentConversationId={currentConversation?.id}
                    buttonRef={allChatsButtonRef}
                    onSelectConversation={(id) => {
                      const c = conversations.find(x => x.id === id);
                      if (c) switchConversation(c);
                    }}
                    onDeleteConversation={confirmDeleteConversation}
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col bg-white overflow-hidden">
            {initialLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto thin-scrollbar">
                  <div className="w-full max-w-5xl mx-auto px-4 py-6">
                    <MessageList
                      messages={messages}
                      isLoading={isLoading}
                      userId={user?.id}
                      conversationId={currentConversation?.id}
                      files={files}
                      contentItems={contentItems}
                      onUploadSuccess={() => loadFiles(currentConversation?.id || null)}
                      onShowToast={(m) => setToast({ isOpen: true, message: m })}
                      onPreviewContentItem={async (itemId) => {
                        try {
                          const item = await getContentItemById(itemId);
                          if (item) {
                            setSelectedContentItem(item);
                          } else {
                            setToast({ isOpen: true, message: 'Content item not found' });
                          }
                        } catch (error) {
                          console.error('Failed to load content item:', error);
                          setToast({ isOpen: true, message: 'Failed to load content item' });
                        }
                      }}
                    />
                  </div>
                </div>

                <ChatInput
                  input={input}
                  isLoading={isLoading}
                  files={files}
                  contentItems={contentItems}
                  attachedFileIds={attachedFileIds}
                  attachedContentItemIds={attachedContentItemIds}
                  skills={skills}
                  referenceImageUrl={referenceImageUrl}
                  conversationId={currentConversation?.id}
                  projectId={projectId}
                  knowledgeFiles={knowledgeFiles}
                  mentionedFiles={mentionedFiles}
                  onInputChange={handleInputChange}
                  onSubmit={handleCustomSubmit}
                  onStop={stop}
                  onAttachFile={(id) => setAttachedFileIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
                  onRemoveFile={(id) => setAttachedFileIds(p => p.filter(x => x !== id))}
                  onAttachContentItem={(id) => setAttachedContentItemIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
                  onRemoveContentItem={(id) => setAttachedContentItemIds(p => p.filter(x => x !== id))}
                  onReferenceImageChange={setReferenceImageUrl}
                  onUploadSuccess={() => loadFiles(currentConversation?.id || null)}
                  onMentionFile={handleMentionFile}
                  onRemoveMentionedFile={handleRemoveMentionedFile}
                />
              </>
            )}
          </main>
        </div>

      </div>

      {isContextModalOpen && (
        <ContextModalNew
          isOpen={isContextModalOpen}
          onClose={() => setIsContextModalOpen(false)}
          siteContexts={siteContexts}
          onSave={handleSaveSiteContext}
          projectId={projectId}
          initialTab={contextModalInitialTab}
        />
      )}

      <DomainsModal isOpen={isDomainsOpen} onClose={() => setIsDomainsOpen(false)} />
      <ContentDrawer item={selectedContentItem} onClose={() => setSelectedContentItem(null)} />
      <Toast isOpen={toast.isOpen} message={toast.message} onClose={() => setToast(p => ({ ...p, isOpen: false }))} />
      {deletingConversationId && <DeleteConfirmModal onConfirm={handleDeleteConversation} onCancel={() => setDeletingConversationId(null)} />}
      
      {deletingCluster && (
        <ConfirmModal
          title="Delete Cluster"
          message={`Are you sure you want to delete "${deletingCluster.name}"? This will permanently remove all pages in this cluster.`}
          confirmText="Delete Cluster"
          onConfirm={handleDeleteCluster}
          onCancel={() => setDeletingCluster(null)}
          isDangerous={true}
        />
      )}
      
      {deletingContentItem && (
        <ConfirmModal
          title="Delete Page"
          message={`Are you sure you want to delete "${deletingContentItem.name}"? This action cannot be undone.`}
          confirmText="Delete Page"
          onConfirm={handleDeleteContentItem}
          onCancel={() => setDeletingContentItem(null)}
          isDangerous={true}
        />
      )}
    </div>
  );
}


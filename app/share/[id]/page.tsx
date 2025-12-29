import { getServiceSupabase } from '@/lib/supabase';
import SharePageClient from './SharePageClient';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function SharePage({ params }: PageProps) {
  // Handle both Promise and plain object for params compatibility
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const supabase = getServiceSupabase();

  try {
    // Fetch data using service role (bypassing RLS)
    const [convRes, msgsRes, filesRes] = await Promise.all([
      supabase.from('conversations').select('*').eq('id', id).single(),
      supabase.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true }),
      supabase.from('files').select('*').eq('conversation_id', id).order('created_at', { ascending: false })
    ]);

    if (convRes.error || !convRes.data) {
      console.error('Error fetching conversation:', convRes.error);
      return (
        <div className="h-screen flex items-center justify-center bg-white p-4">
          <div className="text-center max-w-md">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
              <p className="text-sm font-medium">Conversation not found or inaccessible</p>
            </div>
            <Link href="/chat" className="text-sm font-bold text-[#111827] hover:underline">
              Back to Mini Seenos
            </Link>
          </div>
        </div>
      );
    }

    // Map messages (snake_case from DB to camelCase for component)
    const mappedMessages = (msgsRes.data || []).map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      toolInvocations: m.tool_invocations,
      attachedFiles: m.attached_files,
      attachedContentItems: m.attached_content_items,
      created_at: m.created_at
    }));

    return (
      <SharePageClient 
        conversation={convRes.data} 
        messages={mappedMessages} 
        files={filesRes.data || []} 
      />
    );
  } catch (err) {
    console.error('Unexpected error in SharePage:', err);
    return (
      <div className="h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            <p className="text-sm font-medium">An unexpected error occurred while loading the conversation.</p>
          </div>
        </div>
      </div>
    );
  }
}

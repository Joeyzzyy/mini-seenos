import { tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

export const read_conversation_tracker = tool({
  description: `Read the current conversation tracker to see all tasks and their status.

Call this when you need to:
- Check what tasks have been done in this conversation
- See the status of ongoing tasks
- Review the plan for the current task
- Get context about the conversation history

This is especially useful:
- At the start of a new task (to avoid duplicating work)
- When the user asks "what have we done so far?"
- To resume work after an interruption
- To provide a summary of the conversation`,
  parameters: z.object({
    conversation_id: z.string().describe('The current conversation ID'),
  }),
  execute: async ({ conversation_id }) => {
    try {
      // Find the tracker file for this conversation
      // Try precise filename first, then try a more flexible search if that fails
      const trackerFilename = `conversation-tracker-${conversation_id.slice(0, 8)}.md`;
      
      let { data: files, error: filesError } = await supabase
        .from('files')
        .select('*')
        .eq('conversation_id', conversation_id)
        .eq('filename', trackerFilename)
        .order('created_at', { ascending: false })
        .limit(1);

      // Robustness: If precise filename fails, search for any tracker file in this conversation
      if (!files || files.length === 0) {
        console.log(`[read_conversation_tracker] Precise match failed for ${trackerFilename}, trying flexible search...`);
        const { data: altFiles, error: altError } = await supabase
          .from('files')
          .select('*')
          .eq('conversation_id', conversation_id)
          .ilike('filename', 'conversation-tracker-%.md')
          .order('created_at', { ascending: false })
          .limit(1);
        
        files = altFiles;
        filesError = altError;
      }

      if (filesError) {
        console.error('[read_conversation_tracker] Error fetching files:', filesError);
        return {
          success: false,
          error: 'Failed to fetch tracker file',
          message: 'Could not find tracker file for this conversation.'
        };
      }

      if (!files || files.length === 0) {
        return {
          success: true,
          found: false,
          message: 'No tracker file exists for this conversation yet. Use create_conversation_tracker to create one.',
          conversationId: conversation_id
        };
      }

      const trackerFile = files[0];

      // Download file content from storage
      const { data: fileData, error: storageError } = await supabase.storage
        .from('files')
        .download(trackerFile.storage_path);

      if (storageError || !fileData) {
        console.error('[read_conversation_tracker] Error downloading file:', storageError);
        return {
          success: false,
          error: 'Failed to download tracker file',
          message: 'Could not read tracker file content.'
        };
      }

      // Convert blob to text
      const content = await fileData.text();

      return {
        success: true,
        found: true,
        fileId: trackerFile.id,
        filename: trackerFile.filename,
        content: content,
        conversationId: conversation_id,
        message: 'Tracker file found and read successfully.'
      };
    } catch (error) {
      console.error('[read_conversation_tracker] Unexpected error:', error);
      return {
        success: false,
        error: 'Unexpected error reading tracker',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});


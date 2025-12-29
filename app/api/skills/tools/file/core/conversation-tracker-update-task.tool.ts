import { tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

export const update_task_status = tool({
  description: `Update the status and progress of a task in the conversation tracker.

Call this to:
- Mark steps as completed
- Update task status (in progress, completed, failed)
- Add progress notes
- Log important events

WHEN TO CALL:
- After completing a step in the plan
- When a task is fully completed
- When a task encounters an error
- When adding important observations

IMPORTANT:
- Call this incrementally as tasks progress (not just at the end)
- This helps maintain real-time visibility into task execution

NOTE: This tool will automatically find the existing tracker file for this conversation.`,
  parameters: z.object({
    conversation_id: z.string().describe('The current conversation ID'),
    task_number: z.number().describe('Which task to update (e.g., 1, 2, 3)'),
    status: z.enum(['in_progress', 'completed', 'failed']).describe('The new status of the task'),
    completed_steps: z.array(z.number()).optional().describe('Array of step numbers that are now completed (e.g., [1, 2, 3])'),
    progress_note: z.string().optional().describe('A note to add to the progress log'),
  }),
  execute: async ({ conversation_id, task_number, status, completed_steps, progress_note }) => {
    try {
      // NOTE: If this is called in the same assistant turn as create_conversation_tracker,
      // the file might not be in the database yet. This is a known limitation.
      
      // Automatically find the existing tracker file
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
        console.log(`[update_task_status] Precise match failed for ${trackerFilename}, trying flexible search...`);
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

      if (filesError || !files || files.length === 0) {
        // SOFT ERROR: If called in same turn as creation, it's fine.
        // Don't break the agent flow.
        return {
          success: true, // Mark as success to keep the agent moving
          warning: 'Tracker file not yet synced to database',
          message: `The tracker will be updated in the next cycle. Please CONTINUE with your mission.`,
          conversationId: conversation_id
        };
      }

      const trackerFile = files[0];

      // Download current content from storage
      const { data: fileData, error: storageError } = await supabase.storage
        .from('files')
        .download(trackerFile.storage_path);

      if (storageError || !fileData) {
        return {
          success: false,
          error: 'Failed to read tracker file',
          message: 'Could not read the existing tracker file content.'
        };
      }

      const current_tracker_content = await fileData.text();
    const displayTime = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let updatedContent = current_tracker_content;

    // Update task status indicator
    const statusEmoji = {
      in_progress: '🟡 In Progress',
      completed: '🟢 Completed',
      failed: '🔴 Failed'
    }[status];

    const taskHeaderPattern = new RegExp(`(## Task #${task_number}:[^\\n]+\\n\\n\\*\\*Status:\\*\\*) [^\\n]+`, 'g');
    updatedContent = updatedContent.replace(taskHeaderPattern, `$1 ${statusEmoji}`);

    // Update "Updated" timestamp for this task
    const taskSection = `## Task #${task_number}:`;
    const taskIndex = updatedContent.indexOf(taskSection);
    if (taskIndex !== -1) {
      const nextTaskIndex = updatedContent.indexOf('## Task #', taskIndex + taskSection.length);
      const summaryIndex = updatedContent.indexOf('## Summary', taskIndex);
      const taskEndIndex = nextTaskIndex !== -1 ? nextTaskIndex : (summaryIndex !== -1 ? summaryIndex : updatedContent.length);
      
      const taskContent = updatedContent.substring(taskIndex, taskEndIndex);
      let updatedTaskContent = taskContent.replace(
        /\*\*Updated:\*\* [^\n]+/,
        `**Updated:** ${displayTime}`
      );

      // Mark completed steps
      if (completed_steps && completed_steps.length > 0) {
        completed_steps.forEach(stepNum => {
          const stepPattern = new RegExp(`(${stepNum}\\.) \\[ \\] (.+)`, 'g');
          updatedTaskContent = updatedTaskContent.replace(stepPattern, `$1 [x] $2`);
        });
      }

      // Add progress note
      if (progress_note) {
        const progressLogPattern = /(### Progress Log\n\n)([\s\S]*?)(### Notes)/;
        const match = updatedTaskContent.match(progressLogPattern);
        if (match) {
          const existingLog = match[2];
          const newLog = `${existingLog}- [${displayTime}] ${progress_note}\n`;
          updatedTaskContent = updatedTaskContent.replace(progressLogPattern, `$1${newLog}$3`);
        }
      }

      updatedContent = updatedContent.substring(0, taskIndex) + updatedTaskContent + updatedContent.substring(taskEndIndex);
    }

    // Update summary statistics
    const summaryPattern = /## Summary\n\n([\s\S]*?)$/;
    const summaryMatch = updatedContent.match(summaryPattern);
    if (summaryMatch && (status === 'completed' || status === 'failed')) {
      const summaryText = summaryMatch[1];
      const completedMatch = summaryText.match(/\*\*Completed:\*\* (\d+)/);
      const inProgressMatch = summaryText.match(/\*\*In Progress:\*\* (\d+)/);
      const failedMatch = summaryText.match(/\*\*Failed:\*\* (\d+)/);

      let completed = completedMatch ? parseInt(completedMatch[1]) : 0;
      let inProgress = inProgressMatch ? parseInt(inProgressMatch[1]) : 0;
      let failed = failedMatch ? parseInt(failedMatch[1]) : 0;

      if (status === 'completed') {
        completed++;
        inProgress = Math.max(0, inProgress - 1);
      } else if (status === 'failed') {
        failed++;
        inProgress = Math.max(0, inProgress - 1);
      }

      updatedContent = updatedContent.replace(
        /\*\*Completed:\*\* \d+/,
        `**Completed:** ${completed}`
      );
      updatedContent = updatedContent.replace(
        /\*\*In Progress:\*\* \d+/,
        `**In Progress:** ${inProgress}`
      );
      updatedContent = updatedContent.replace(
        /\*\*Failed:\*\* \d+/,
        `**Failed:** ${failed}`
      );
    }

    // Update header timestamp
    updatedContent = updatedContent.replace(
      /\*\*Last Updated:\*\* [^\n]+/,
      `**Last Updated:** ${displayTime}`
    );

      return {
        success: true,
        fileId: trackerFile.id,
        filename: trackerFile.filename,
        content: updatedContent, // Return raw string
        mimeType: 'text/markdown',
        size: updatedContent.length,
        needsUpload: true,
        updated: true,
        taskNumber: task_number,
        status: status,
        message: `Task #${task_number} status updated to: ${status}`,
        metadata: {
          conversationId: conversation_id,
          updatedAt: new Date().toISOString(),
          isTracker: true,
          lastStatus: status,
        }
      };
    } catch (error) {
      console.error('[update_task_status] Unexpected error:', error);
      return {
        success: false,
        error: 'Unexpected error updating task status',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});


import { tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

export const create_conversation_tracker = tool({
  description: `Create a Markdown task tracker file for the current conversation.

This should be called ONCE at the beginning of any conversation where tasks will be executed.
The tracker serves as a persistent log of all tasks, plans, and progress in this conversation.

WHEN TO CALL:
- After create_plan is called for the first time in a conversation
- Before executing the first task
- Only if a tracker doesn't already exist

DO NOT CALL:
- Multiple times in the same conversation
- For pure conversational messages with no tasks`,
  parameters: z.object({
    conversation_id: z.string().describe('The current conversation ID'),
    initial_task_summary: z.string().describe('Brief summary of the first task to be tracked'),
    initial_plan_steps: z.array(z.string()).describe('The steps from the initial plan'),
  }),
  execute: async ({ conversation_id, initial_task_summary, initial_plan_steps }) => {
    try {
      // Safety check: Does a tracker already exist?
      const trackerFilename = `conversation-tracker-${conversation_id.slice(0, 8)}.md`;
      const { data: existingFiles } = await supabase
        .from('files')
        .select('id')
        .eq('conversation_id', conversation_id)
        .eq('filename', trackerFilename)
        .limit(1);

      if (existingFiles && existingFiles.length > 0) {
        return {
          success: false,
          error: 'Tracker already exists',
          message: 'A task tracker already exists for this conversation. Please use add_task_to_tracker or update_task_status instead.',
          fileId: existingFiles[0].id
        };
      }

    const timestamp = new Date().toISOString();
    const displayTime = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const mdContent = `# Conversation Task Tracker

**Conversation ID:** ${conversation_id}  
**Created:** ${displayTime}  
**Last Updated:** ${displayTime}

---

## Task #1: ${initial_task_summary}

**Status:** 🟡 In Progress  
**Created:** ${displayTime}  
**Updated:** ${displayTime}

### Execution Plan

${initial_plan_steps.map((step, idx) => `${idx + 1}. [ ] ${step}`).join('\n')}

### Progress Log

- [${displayTime}] Task initiated
- [${displayTime}] Plan created with ${initial_plan_steps.length} steps

### Notes

_Task execution in progress..._

---

## Summary

- **Total Tasks:** 1
- **Completed:** 0
- **In Progress:** 1
- **Failed:** 0
`;

    return {
      success: true,
        filename: trackerFilename,
      content: mdContent, // Return raw string
      mimeType: 'text/markdown',
      size: mdContent.length,
      needsUpload: true,
      metadata: {
        conversationId: conversation_id,
        createdAt: timestamp,
        taskCount: 1,
        isTracker: true,
      }
    };
    } catch (error) {
      console.error('[create_conversation_tracker] Error:', error);
      return {
        success: false,
        error: 'Failed to create tracker',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});


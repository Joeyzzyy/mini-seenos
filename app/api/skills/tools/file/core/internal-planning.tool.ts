import { tool } from 'ai';
import { z } from 'zod';

/**
 * Planning Tool
 * Creates a structured plan for task execution.
 * This is a mandatory first step before executing any other tools.
 */
export const create_plan = tool({
  description: `MANDATORY: Create a structured plan before executing any task.
  
This tool MUST be called as the FIRST tool in any action-oriented conversation turn.
It creates a blueprint for task execution, listing steps, required tools, and considerations.

Use this for:
- Any task requiring tool calls
- Multi-step workflows
- Complex analysis or generation tasks

DO NOT skip this step - it is enforced at the system level.`,

  parameters: z.object({
    task_summary: z.string().describe('Brief summary of what needs to be accomplished'),
    steps: z.array(z.object({
      step_number: z.number().describe('Sequential step number'),
      description: z.string().describe('What this step will accomplish'),
      required_tools: z.array(z.string()).describe('Tools needed for this step'),
      estimated_complexity: z.enum(['simple', 'moderate', 'complex']).describe('Complexity level'),
    })).describe('Ordered list of steps to complete the task'),
    considerations: z.array(z.string()).optional().describe('Important notes, risks, or dependencies'),
    estimated_total_time: z.string().optional().describe('Rough time estimate for completion'),
  }),

  execute: async ({ task_summary, steps, considerations, estimated_total_time }) => {
    console.log(`[create_plan] Planning task: ${task_summary}`);
    console.log(`[create_plan] Steps: ${steps.length}`);
    
    // Format the plan for display
    const formattedSteps = steps.map(step => ({
      step: step.step_number,
      action: step.description,
      tools: step.required_tools,
      complexity: step.estimated_complexity,
    }));

    return {
      success: true,
      plan: {
        task: task_summary,
        steps: formattedSteps,
        total_steps: steps.length,
        considerations: considerations || [],
        estimated_time: estimated_total_time || 'Not specified',
      },
      message: `✅ Plan created with ${steps.length} steps. Ready to execute.`,
      next_action: 'Proceed with Step 1 immediately.',
    };
  },
});

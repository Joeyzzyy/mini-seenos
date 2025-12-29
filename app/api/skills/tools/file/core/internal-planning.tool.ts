import { tool } from 'ai';
import { z } from 'zod';

export const create_plan = tool({
  description: `MANDATORY FIRST TOOL - ALWAYS CALL THIS BEFORE ANY OTHER TOOL

This is the REQUIRED planning tool. You are FORBIDDEN from calling any other tool before calling this one.

STRICT RULE:
- If the user's request requires ANY tool call, create_plan MUST be your FIRST tool call
- After calling this, you MUST IMMEDIATELY call the conversation tracker (create_conversation_tracker or add_task_to_tracker) AND THEN start the first step of your plan.
- DO NOT STOP after calling this tool. Continuous execution is REQUIRED.

WHY THIS IS MANDATORY:
- Ensures systematic thinking before execution
- Prevents tool misuse and errors
- Provides transparency to the user about what you'll do
- Allows validation of approach before costly operations

AFTER CALLING THIS:
- You are then permitted to call other execution tools
- Follow your plan step by step
- Reference your plan as you execute`,
  parameters: z.object({
    task_summary: z.string().describe('Brief summary of what the user wants to accomplish'),
    steps: z.array(z.object({
      step_number: z.number().describe('The sequence number of this step'),
      description: z.string().describe('What needs to be done in this step'),
      required_skills: z.array(z.string()).describe('Which skills are needed (e.g., "web-research", "content-planner", "file-operations")'),
      required_tools: z.array(z.string()).describe('Which specific tools will be used (e.g., "web_search", "generate_outline", "generate_csv")'),
      estimated_complexity: z.enum(['simple', 'moderate', 'complex']).describe('Complexity level of this step'),
    })).describe('Ordered list of steps to complete the task'),
    considerations: z.array(z.string()).optional().describe('Any potential issues, alternatives, or notes'),
  }),
  execute: async ({ task_summary, steps, considerations }) => {
    const planSummary = `
EXECUTION PLAN

Task: ${task_summary}

Steps (${steps.length} total):
${steps.map(s => `
${s.step_number}. ${s.description}
   Skills: ${s.required_skills.join(', ')}
   Tools: ${s.required_tools.join(', ')}
   Complexity: ${s.estimated_complexity}
`).join('\n')}

${considerations && considerations.length > 0 ? `
Considerations:
${considerations.map(c => `  - ${c}`).join('\n')}
` : ''}

Plan created. Now executing steps...
`;

    return {
      success: true,
      plan: {
        task_summary,
        steps,
        considerations,
        total_steps: steps.length,
      },
      message: planSummary,
    };
  },
});


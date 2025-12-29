import { tool } from 'ai';
import { z } from 'zod';

export const generate_markdown = tool({
  description: `Generate a Markdown (.md) file with custom content.

REMINDER: Before using this tool, you MUST call 'create_plan' first!

Use this tool for:
- Creating documentation files
- Generating reports or summaries
- Creating README files
- Any custom Markdown content

DO NOT use this for:
- Task tracking (use conversation tracker tools instead)
- Content outlines (use content-planner tools instead)

USAGE:
- Provide well-formatted Markdown content
- Support for headers, lists, tables, code blocks, etc.
- Content will be saved as a downloadable .md file`,
  parameters: z.object({
    filename: z.string().describe('The name of the Markdown file (e.g., "report.md" or just "report")'),
    content: z.string().describe('REQUIRED: The complete Markdown content to save. Must include proper formatting with headers, lists, etc.'),
    description: z.string().optional().describe('Optional description of what this file contains'),
  }),
  execute: async ({ filename, content, description }) => {
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: 'No content provided. You must provide the Markdown content to generate a file.'
      };
    }

    const finalFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    
    return {
      success: true,
      filename: finalFilename,
      content: content, // Return raw string
      mimeType: 'text/markdown',
      size: content.length,
      needsUpload: true,
      metadata: {
        description: description || 'Markdown document',
        createdAt: new Date().toISOString(),
      }
    };
  },
});


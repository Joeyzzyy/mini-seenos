import { Skill } from '../types';
import { generate_csv } from '../tools/file/internal-file-generate-csv.tool';
import { generate_json } from '../tools/file/internal-file-generate-json.tool';
import { generate_markdown } from '../tools/file/internal-file-generate-markdown.tool';

export const fileOperationsSkill: Skill = {
  id: 'file-operations',
  name: 'System: File Manager',
  description: 'Generate downloadable files (CSV, JSON, Markdown) from data you have prepared',
  systemPrompt: `REMINDER: Before using any file generation tools, you MUST call 'create_plan' first!

When generating files:

CRITICAL WORKFLOW:
1. First, gather/prepare/structure the complete data you want to export
2. Then, call the appropriate tool (generate_csv, generate_json, or generate_markdown) with required parameters:
   - filename: the desired file name
   - data: the complete data array/object you prepared

COMMON MISTAKES TO AVOID:
- DO NOT call generate_csv, generate_json, or generate_markdown without providing the required data/content parameter
- DO NOT assume the tool will fetch or generate data for you
- DO NOT call the tool before you have prepared all the data

CORRECT USAGE PATTERN:
- Prepare data → Call tool with filename + data → File is generated
- Always provide complete, structured data in the data parameter
- For CSV: data must be an array of objects with consistent keys
- For JSON: data can be any valid JSON structure
- For Markdown: content must be complete Markdown text with proper formatting

USER EXPERIENCE:
- Never include download links in your text response
- Files will automatically appear in the Artifacts panel
- Tell the user what data you included in the file`,
  tools: {
    generate_csv,
    generate_json,
    generate_markdown,
  },
  enabled: true,
  metadata: {
    category: 'system',
    tags: ['csv', 'json', 'markdown', 'export'],
    version: '1.1.0',
    solution: 'Solves multi-format data export and persistence needs. Bridges AI-generated insights and user-downloadable assets by providing unified interfaces for CSV, JSON, and Markdown generation, ensuring data portability in professional SEO workflows.',
    changeDescription: 'Handles read/write conversion for multiple formats including Markdown, CSV, JSON, and Word (DOCX).',
  },
};

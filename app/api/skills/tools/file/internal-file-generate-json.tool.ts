import { tool } from 'ai';
import { z } from 'zod';

export const generate_json = tool({
  description: `Generate a downloadable JSON file from structured data.

CRITICAL REQUIREMENTS:
1. You MUST provide the actual data to be saved in the JSON file
2. Data can be any valid JSON structure (object, array, etc.)
3. Do NOT call this tool without preparing the complete data first
4. This tool does NOT fetch or generate data - you must provide it

USAGE PATTERN:
- First, gather/prepare your complete data
- Then, call this tool with BOTH filename AND data parameters
- Example: generate_json({ filename: "config.json", data: {setting: "value", items: [1,2,3]} })`,
  parameters: z.object({
    filename: z.string().describe('The name of the JSON file to create (e.g., "data.json")'),
    data: z.any().describe('REQUIRED: The complete data structure to save as JSON. Can be an object, array, or any JSON-serializable value. Example: {name: "Project", items: [{id: 1}, {id: 2}]}'),
  }),
  execute: async ({ filename, data }) => {
    if (data === undefined || data === null) {
      return {
        success: false,
        error: 'No data provided. You must provide data to generate a JSON file.'
      };
    }
    
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      return {
        success: true,
        filename: filename.endsWith('.json') ? filename : `${filename}.json`,
        content: Buffer.from(jsonContent).toString('base64'),
        mimeType: 'application/json',
        size: jsonContent.length,
        needsUpload: true
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to serialize data to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
});


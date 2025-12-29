import { tool } from 'ai';
import { z } from 'zod';

export const generate_csv = tool({
  description: `Generate a downloadable CSV file from structured data. 
  
CRITICAL REQUIREMENTS:
1. You MUST provide the actual data array with all rows/records
2. Data must be an array of objects with consistent keys
3. Do NOT call this tool without preparing the complete data first
4. This tool does NOT fetch or generate data - you must provide it

USAGE PATTERN:
- First, gather/prepare your complete data
- Then, call this tool with BOTH filename AND data parameters
- Example: generate_csv({ filename: "keywords.csv", data: [{keyword: "ai", volume: 1000}, {keyword: "ml", volume: 500}] })`,
  parameters: z.object({
    filename: z.string().describe('The name of the CSV file to create (e.g., "keywords.csv")'),
    data: z.array(z.record(z.any())).nonempty().describe('REQUIRED: Complete array of data objects to convert to CSV. Each object represents one row. Keys become column headers. Example: [{name: "John", age: 30}, {name: "Jane", age: 25}]'),
  }),
  execute: async ({ filename, data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { 
        success: false, 
        error: 'No data provided. You must provide a non-empty data array to generate CSV.' 
      };
    }
    
    const headers = Object.keys(data[0]);
    if (headers.length === 0) {
      return {
        success: false,
        error: 'Invalid data: objects must have at least one property/column.'
      };
    }
    
    const csvContent = [
      headers.join(','), 
      ...data.map(row => 
        headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    
    return {
      success: true,
      filename: filename.endsWith('.csv') ? filename : `${filename}.csv`,
      content: Buffer.from(csvContent).toString('base64'),
      mimeType: 'text/csv',
      size: csvContent.length,
      needsUpload: true
    };
  },
});


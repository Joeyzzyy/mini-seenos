import { tool } from 'ai';
import { z } from 'zod';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

export const markdown_to_docx = tool({
  description: 'Convert a markdown file to a professional Word document (.docx) with proper formatting, tables, headings, and styles. Perfect for business reports, competitive analysis, and executive presentations.',
  parameters: z.object({
    markdown_content: z.string().describe('The markdown content to convert to Word document'),
    filename: z.string().describe('The output filename (without extension, .docx will be added automatically)'),
    user_id: z.string().optional().describe('User ID for file storage organization'),
    title: z.string().optional().describe('Document title (will be added as the first heading)'),
    subtitle: z.string().optional().describe('Document subtitle or description'),
  }),
  execute: async ({ markdown_content, filename, user_id, title, subtitle }) => {
    try {
      console.log(`[markdown_to_docx] Converting markdown to Word document: ${filename}`);

      // Parse markdown and convert to docx elements
      const sections: any[] = [];

      // Add title if provided
      if (title) {
        sections.push(
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // Add subtitle if provided
      if (subtitle) {
        sections.push(
          new Paragraph({
            text: subtitle,
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            style: 'subtitle',
          })
        );
      }

      // Parse markdown content
      const lines = markdown_content.split('\n');
      let inCodeBlock = false;
      let inTable = false;
      let tableRows: string[][] = [];
      let currentList: Paragraph[] = [];
      let listLevel = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Handle code blocks
        if (trimmedLine.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          continue;
        }

        if (inCodeBlock) {
          sections.push(
            new Paragraph({
              text: line,
              style: 'code',
            })
          );
          continue;
        }

        // Handle tables
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
          if (!inTable) {
            inTable = true;
            tableRows = [];
          }
          
          // Skip separator lines (---|---|---)
          if (trimmedLine.match(/^\|[\s\-:]+\|$/)) {
            continue;
          }

          const cells = trimmedLine
            .split('|')
            .slice(1, -1)
            .map(cell => cell.trim());
          
          tableRows.push(cells);
          continue;
        } else if (inTable && tableRows.length > 0) {
          // End of table - create table element
          const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows.map((row, rowIndex) => 
              new TableRow({
                children: row.map(cell => 
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: cell,
                        style: rowIndex === 0 ? 'tableHeader' : 'tableCell',
                      })
                    ],
                    shading: rowIndex === 0 ? { fill: 'E5E7EB' } : undefined,
                  })
                ),
              })
            ),
          });
          sections.push(table);
          inTable = false;
          tableRows = [];
        }

        // Handle headings
        if (trimmedLine.startsWith('#')) {
          // Flush any pending list
          if (currentList.length > 0) {
            sections.push(...currentList);
            currentList = [];
          }

          const level = (trimmedLine.match(/^#+/) || [''])[0].length;
          const text = trimmedLine.replace(/^#+\s*/, '');
          
          let headingLevel;
          if (level === 2) headingLevel = HeadingLevel.HEADING_2;
          else if (level === 3) headingLevel = HeadingLevel.HEADING_3;
          else if (level === 4) headingLevel = HeadingLevel.HEADING_4;
          else headingLevel = HeadingLevel.HEADING_1;

          sections.push(
            new Paragraph({
              text: text,
              heading: headingLevel,
              spacing: { before: 400, after: 200 },
            })
          );
          continue;
        }

        // Handle horizontal rules
        if (trimmedLine.match(/^[\-\*_]{3,}$/)) {
          sections.push(
            new Paragraph({
              text: '',
              border: {
                bottom: {
                  color: 'D1D5DB',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { before: 200, after: 200 },
            })
          );
          continue;
        }

        // Handle lists
        if (trimmedLine.match(/^[\-\*\+]\s/) || trimmedLine.match(/^\d+\.\s/)) {
          const isBullet = trimmedLine.match(/^[\-\*\+]\s/);
          const text = trimmedLine.replace(/^([\-\*\+]|\d+\.)\s*/, '');
          
          currentList.push(
            new Paragraph({
              text: text,
              bullet: isBullet ? { level: 0 } : undefined,
              numbering: !isBullet ? { reference: 'default-numbering', level: 0 } : undefined,
              spacing: { before: 100, after: 100 },
            })
          );
          continue;
        } else if (currentList.length > 0) {
          // End of list
          sections.push(...currentList);
          currentList = [];
        }

        // Handle bold and italic text
        if (trimmedLine) {
          const textRuns: TextRun[] = [];
          let remaining = trimmedLine;
          
          // Simple bold/italic parsing (not perfect but good enough)
          const boldRegex = /\*\*(.+?)\*\*/g;
          const italicRegex = /\*(.+?)\*/g;
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

          // Replace all formatting with placeholders and collect runs
          let match;
          let lastIndex = 0;
          
          // Process bold
          while ((match = boldRegex.exec(remaining)) !== null) {
            if (match.index > lastIndex) {
              textRuns.push(new TextRun(remaining.substring(lastIndex, match.index)));
            }
            textRuns.push(new TextRun({ text: match[1], bold: true }));
            lastIndex = match.index + match[0].length;
          }
          
          if (lastIndex < remaining.length) {
            textRuns.push(new TextRun(remaining.substring(lastIndex)));
          }

          if (textRuns.length === 0) {
            textRuns.push(new TextRun(trimmedLine));
          }

          sections.push(
            new Paragraph({
              children: textRuns,
              spacing: { before: 100, after: 100 },
            })
          );
        } else {
          // Empty line
          sections.push(
            new Paragraph({
              text: '',
              spacing: { before: 100, after: 100 },
            })
          );
        }
      }

      // Create the document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: sections,
          },
        ],
        styles: {
          paragraphStyles: [
            {
              id: 'subtitle',
              name: 'Subtitle',
              basedOn: 'Normal',
              next: 'Normal',
              run: {
                size: 24,
                color: '6B7280',
                italics: true,
              },
              paragraph: {
                spacing: { after: 120 },
              },
            },
            {
              id: 'code',
              name: 'Code',
              basedOn: 'Normal',
              run: {
                font: 'Courier New',
                size: 20,
              },
              paragraph: {
                shading: {
                  fill: 'F3F4F6',
                },
                spacing: { before: 100, after: 100 },
              },
            },
            {
              id: 'tableHeader',
              name: 'Table Header',
              basedOn: 'Normal',
              run: {
                bold: true,
                size: 20,
              },
            },
            {
              id: 'tableCell',
              name: 'Table Cell',
              basedOn: 'Normal',
              run: {
                size: 20,
              },
            },
          ],
        },
      });

      // Generate buffer
      const buffer = await Packer.toBuffer(doc);

      const docxFilename = filename.endsWith('.docx') ? filename : `${filename}.docx`;

      console.log(`[markdown_to_docx] Document created successfully: ${docxFilename}`);

      return {
        success: true,
        filename: docxFilename,
        content: buffer.toString('base64'),
        size: buffer.length,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        needsUpload: true,
        message: `Word document created successfully: ${docxFilename}`,
        metadata: {
          originalMarkdownLength: markdown_content.length,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error('[markdown_to_docx] Error:', error);
      return {
        success: false,
        error: `Failed to create Word document: ${error.message}`,
      };
    }
  },
});


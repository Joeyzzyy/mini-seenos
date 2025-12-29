import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { skillRegistry } from '../index';

/**
 * GET /api/skills/tool-source?toolId=xxx&skillId=xxx
 * Returns the source code of a tool
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const skillId = searchParams.get('skillId');

    if (!toolId) {
      return NextResponse.json(
        { error: 'toolId is required' },
        { status: 400 }
      );
    }

    // Get the skill to verify the tool exists
    const skill = skillRegistry.get(skillId || '');
    if (skill && !(toolId in skill.tools)) {
      return NextResponse.json(
        { error: `Tool ${toolId} not found in skill ${skillId}` },
        { status: 404 }
      );
    }

    // Scan all tool files recursively to find the one that exports this toolId
    const toolsBaseDir = join(process.cwd(), 'app/api/skills/tools');
    
    let sourceCode = null;
    let filePath = null;

    async function findToolInDir(dir: string): Promise<boolean> {
      try {
        const entries = await readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          
          if (entry.isDirectory()) {
            if (await findToolInDir(fullPath)) return true;
          } else if (entry.isFile() && entry.name.endsWith('.tool.ts')) {
          try {
            const content = await readFile(fullPath, 'utf-8');
            // Check if this file exports the tool with the matching toolId
              const escapedToolId = toolId!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const exportPattern = new RegExp(`export\\s+const\\s+${escapedToolId}\\s*=\\s*tool\\(`, 'm');
            if (exportPattern.test(content)) {
              sourceCode = content;
              filePath = fullPath.replace(process.cwd(), '');
                return true;
            }
          } catch (error) {
            continue;
            }
          }
        }
      } catch (error) {
        return false;
      }
      return false;
    }

    await findToolInDir(toolsBaseDir);

    if (!sourceCode) {
      return NextResponse.json(
        { error: `Tool source file not found for toolId: ${toolId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      toolId,
      skillId: skillId || null,
      filePath,
      sourceCode,
    });
  } catch (error) {
    console.error('Error fetching tool source:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool source' },
      { status: 500 }
    );
  }
}


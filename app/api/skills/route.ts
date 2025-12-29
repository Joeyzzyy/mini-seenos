import { NextResponse } from 'next/server';
import { skillRegistry } from './index';

/**
 * GET /api/skills
 * Returns all registered skills and their tools
 */
export async function GET() {
  try {
    const skills = skillRegistry.getEnabled();
    
    const skillsData = skills.map(skill => {
      return {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        systemPrompt: skill.systemPrompt,
        examples: skill.examples || [],
        metadata: skill.metadata || {},
        tools: Object.keys(skill.tools).map(toolId => {
          const tool = skill.tools[toolId] as any;
          // 动态提取工具的元数据，如果没有则美化 ID
          return {
            id: toolId,
            name: tool.metadata?.name || toolId.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            provider: tool.metadata?.provider || 'Internal',
            description: tool.description || skill.description,
          };
        }),
      };
    });

    return NextResponse.json({
      skills: skillsData,
      total: skillsData.length,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}


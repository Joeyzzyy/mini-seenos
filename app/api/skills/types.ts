import { z } from 'zod';
import { CoreTool } from 'ai';

/**
 * Skill Definition
 * A skill is a reusable capability unit that combines:
 * - Specific system prompts
 * - Dedicated tools
 * - Context and examples
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  
  /** Display name of the skill */
  name: string;
  
  /** Short description of what this skill does */
  description: string;
  
  /** Detailed system prompt for this skill */
  systemPrompt: string;
  
  /** Tools available to this skill */
  tools: Record<string, CoreTool<any, any>>;
  
  /** Example queries that would trigger this skill */
  examples?: string[];
  
  /** Whether this skill is enabled */
  enabled?: boolean;
  
  /** Skill metadata */
  metadata?: {
    category?: string;
    tags?: string[];
    version?: string;
    priority?: string;
    status?: string;
    solution?: string; // What problems this skill solves (Chinese description)
    expectedOutput?: string; // Expected output description (Chinese)
    expectedOutputEn?: string; // Expected output description (English)
    whatThisSkillWillDo?: string[]; // List of actions this skill will perform
    whatArtifactsWillBeGenerated?: string[]; // List of artifacts/outputs generated
    demoUrl?: string;  // A showcase URL for this skill
    renamingInfo?: string;  // Original name -> New name
    changeDescription?: string; // Explanation of the change/value
    playbook?: {
      trigger?: {
        type: 'form' | 'direct' | 'auto';
        condition?: string; // For 'auto' type: condition to match (e.g., "page_type === 'blog'")
        fields?: Array<{
          id: string;
          label: string;
          type: 'text' | 'select' | 'country';
          options?: Array<{ label: string; value: string }>;
          placeholder?: string;
          required?: boolean;
          defaultValue?: string;
        }>;
        initialMessage?: string; // Template string like "Research keyword {keyword} in {region}"
      }
    };
  };
}

/**
 * Skill Registry
 * Manages all available skills in the system
 */
export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  register(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  unregister(skillId: string): void {
    this.skills.delete(skillId);
  }

  get(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAll(): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.enabled !== false);
  }

  getEnabled(): Skill[] {
    return this.getAll().filter(s => s.enabled !== false);
  }

  getAllTools(): Record<string, CoreTool<any, any>> {
    const allTools: Record<string, CoreTool<any, any>> = {};
    for (const skill of this.getEnabled()) {
      Object.assign(allTools, skill.tools);
    }
    return allTools;
  }

  getSkillByToolId(toolId: string): Skill | undefined {
    for (const skill of this.getEnabled()) {
      if (toolId in skill.tools) {
        return skill;
      }
    }
    return undefined;
  }
}

/**
 * Skill Execution Context
 * Provides context information during skill execution
 */
export interface SkillContext {
  /** Current user message */
  userMessage?: string;
  
  /** Conversation history */
  messageHistory?: any[];
  
  /** Detected user intent */
  intent?: string;
  
  /** Extracted entities from user input */
  entities?: Record<string, any>;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}


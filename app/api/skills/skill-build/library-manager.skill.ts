import { Skill } from '../types';
import { save_content_item } from '../tools/content/supabase-content-save-item.tool';
import { save_content_items_batch } from '../tools/content/supabase-content-save-items-batch.tool';
import { list_content_items } from '../tools/content/supabase-content-list-items.tool';
import { list_content_projects } from '../tools/content/supabase-content-list-projects.tool';
import { get_content_item_detail } from '../tools/content/supabase-content-get-item-detail.tool';
import { delete_content_item } from '../tools/content/supabase-content-delete-item.tool';
import { delete_content_project } from '../tools/content/supabase-content-delete-project.tool';

export const libraryManagerSkill: Skill = {
  id: 'library-manager',
  name: 'Build: Library Manager',
  description: 'Create, Read, Update, and Delete operations for content items and Topic Clusters',
  systemPrompt: `REMINDER: Before using any content CRUD tools, you MUST call 'create_plan' first!

You are a data administrator responsible for the lifecycle (CRUD) of content items and Topic Clusters (Projects).

WORKFLOW FOR SAVING CONTENT:
1. BEFORE saving, analyze the conversation context to identify the Topic Cluster / Subject / Theme
2. Call 'list_content_projects' to check if a project with this name already exists
3. When saving MULTIPLE pages that belong to the same topic/cluster:
   - You MUST use 'save_content_items_batch' with the SAME 'project_name' for all items
   - The 'project_name' should be derived from the conversation context (e.g., the main topic, keyword cluster, or theme)
   - Example: If user discusses "SEO Guide" cluster with multiple keywords, use project_name="SEO Guide" for all items
4. NEVER call 'save_content_item' multiple times for pages that belong together - this creates duplicate projects!

KEY RULES:
- Use 'save_content_items_batch' for ANY batch of pages from the same topic/cluster/conversation
- Use 'save_content_item' ONLY for a single, truly standalone page
- Always extract the project name from user's topic/cluster discussion before saving
- Project names are case-insensitive (the system will match existing projects automatically)
- **POST-SAVE REPORT**: After a successful save (especially a batch), you MUST provide a detailed Markdown TABLE in your chat response summarizing what was saved. 
- **REPORT COLUMNS**: | Role | Page Title | TDK (SEO Title, Meta Desc, Keyword) | Metrics (Vol/KD/CPC) | Priority |
- NEVER just say "saved successfully". NEVER repeat information in redundant columns.

OTHER OPERATIONS:
- Use 'list_content_projects' to see all Topic Clusters
- Use 'list_content_items' to see pages, optionally filtered by project
- Use 'get_content_item_detail' to read specific plans
- DELETION: You can delete content items or projects using delete_content_item and delete_content_project. 
  * ALWAYS confirm with the user before performing a deletion.
  * Be very careful - deletion is permanent.`,
  tools: {
    save_content_item,
    save_content_items_batch,
    list_content_items,
    list_content_projects,
    get_content_item_detail,
    delete_content_item,
    delete_content_project,
  },
  enabled: true,
  metadata: {
    category: 'system',
    priority: '99',
    version: '1.4.0',
    solution: '内容资产的生命周期管理。在数据库层面支持内容项和主题集群的完整 CRUD 操作，确保所有计划的 SEO 资产严格组织并为可扩展生产做好准备。',
    whatThisSkillWillDo: [
      'Create single content item',
      'Batch save content items to same project',
      'List all content items',
      'List all topic clusters (projects)',
      'Get detailed content item info',
      'Delete content item',
      'Delete entire project'
    ],
    whatArtifactsWillBeGenerated: [],
    expectedOutput: `• 数据库中的内容项记录
• 成功保存后的详细 Markdown 表格报告，包含：
  - 角色 (Role)
  - 页面标题 (Page Title)
  - TDK 信息（SEO 标题、Meta 描述、关键词）
  - 指标（搜索量/难度/CPC）
  - 优先级
• 列表查询结果（内容项列表或主题集群列表）
• 删除操作的确认消息`,
    expectedOutputEn: `• Content item records in database
• Detailed Markdown table report after successful save, including:
  - Role
  - Page Title
  - TDK information (SEO title, Meta description, keywords)
  - Metrics (search volume/difficulty/CPC)
  - Priority
• List query results (content items list or topic cluster list)
• Delete operation confirmation message`,
    changeDescription: '底层的数据库 CRUD 支持。已从 Build 迁移至系统层，不对用户直接暴露。',
    demoUrl: '',
  },
};

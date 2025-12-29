# Planning-First Rule 优化方案

## 当前问题分析

### 现状
1. **硬性中断**：违反规则时直接返回错误，中断执行
2. **用户体验差**：看到大段错误消息，不知道发生了什么
3. **不够智能**：某些简单场景也被强制要求 planning
4. **重复提示**：system prompt 中大量重复强调

### 用户反馈
> "话说每次要求先调用 plan 这个，实现上能更优雅吗"

---

## 🎨 优化方案

### 方案 1：**自动补偿式 Planning（推荐）** ⭐

**核心思路**：当检测到违规时，不中断，而是**自动帮 AI 创建一个简单的 plan**，然后继续执行。

#### 实现方式

```typescript
// app/api/chat/route.ts
if (isFirstTool && !exemptTools.includes(toolName)) {
  // 不是返回错误，而是自动创建一个简化的 plan
  console.warn(`⚠️ Planning skipped for ${toolName}, auto-generating simple plan...`);
  
  // 自动创建一个简化的 plan
  const autoPlan = {
    task_summary: `Execute ${toolName}`,
    steps: [{
      step_number: 1,
      description: `Call ${toolName} with provided parameters`,
      required_skills: [identifySkillForTool(toolName)],
      required_tools: [toolName],
      estimated_complexity: 'simple'
    }],
    considerations: ['Auto-generated plan for single tool execution']
  };
  
  // 标记为已执行 planning
  requestState.hasCalledPlan = true;
  requestState.autoPlanned = true;
  
  console.log('✅ Auto-plan created:', autoPlan.task_summary);
  
  // 继续执行原工具
  const result = await (toolDef as any).execute(args);
  return result;
}
```

**优势**：
- ✅ 不中断用户体验
- ✅ 仍然有 planning 记录
- ✅ 简单任务自动处理
- ✅ 复杂任务 AI 仍会主动 plan

**劣势**：
- ⚠️ 可能让 AI "偷懒"，不主动思考

---

### 方案 2：**Skill 级别配置**

**核心思路**：某些 skill 不需要强制 planning，在 skill 定义中配置。

#### Skill 配置

```typescript
export interface Skill {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: Record<string, any>;
  enabled: boolean;
  metadata?: {
    category?: string;
    tags?: string[];
    version?: string;
    requiresPlanning?: boolean; // ← 新增：是否需要 planning
    planningMode?: 'mandatory' | 'recommended' | 'optional'; // ← 新增：planning 模式
  };
}
```

#### 执行逻辑

```typescript
// 在 chat/route.ts 中
const toolSkill = identifySkillForTool(toolName);
const skillConfig = getSkillConfig(toolSkill);

if (isFirstTool && !exemptTools.includes(toolName)) {
  // 检查该 skill 的 planning 配置
  const planningMode = skillConfig?.metadata?.planningMode || 'mandatory';
  
  switch (planningMode) {
    case 'optional':
      // 完全不需要 planning，直接执行
      break;
      
    case 'recommended':
      // 建议但不强制，记录警告
      console.warn(`⚠️ Planning recommended but skipped for ${toolName}`);
      break;
      
    case 'mandatory':
    default:
      // 强制要求，返回错误
      return { success: false, error: '...' };
  }
}
```

**示例配置**：

```typescript
// 简单工具：optional planning
export const fileOperationsSkill: Skill = {
  ...
  metadata: {
    planningMode: 'optional'  // 文件操作不需要 planning
  }
};

// 复杂工具：mandatory planning
export const contentProductionSkill: Skill = {
  ...
  metadata: {
    planningMode: 'mandatory'  // 内容生产必须 planning
  }
};
```

**优势**：
- ✅ 灵活控制
- ✅ 简单任务不被干扰
- ✅ 复杂任务仍受保护

**劣势**：
- ⚠️ 需要为每个 skill 配置
- ⚠️ 配置不当可能导致混乱

---

### 方案 3：**基于上下文智能判断**

**核心思路**：根据对话历史、工具复杂度、用户意图智能判断是否需要 planning。

#### 判断逻辑

```typescript
function needsPlanning(context: {
  toolName: string;
  conversationHistory: number;  // 对话轮次
  userRequest: string;           // 用户请求
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
}): boolean {
  // 规则 1：对话历史超过 3 轮，用户可能在调试/快速操作
  if (context.conversationHistory > 3) {
    return false;
  }
  
  // 规则 2：简单工具 + 简单请求 = 不需要 planning
  const simpleTools = ['keyword_overview', 'generate_csv', 'generate_json'];
  if (simpleTools.includes(context.toolName) && context.estimatedComplexity === 'simple') {
    return false;
  }
  
  // 规则 3：用户明确说"快速"、"直接"等关键词
  const skipKeywords = ['快速', '直接', 'quickly', 'just'];
  if (skipKeywords.some(kw => context.userRequest.toLowerCase().includes(kw))) {
    return false;
  }
  
  // 规则 4：复杂工具链 = 必须 planning
  const complexTools = ['draft_page_section', 'generate_images', 'save_final_page'];
  if (complexTools.includes(context.toolName)) {
    return true;
  }
  
  // 默认：需要 planning
  return true;
}
```

**优势**：
- ✅ 最智能的方案
- ✅ 自适应用户行为
- ✅ 平衡体验和质量

**劣势**：
- ⚠️ 实现复杂
- ⚠️ 需要大量测试和调优
- ⚠️ 可能有边界情况

---

### 方案 4：**柔性提示而非硬性中断**

**核心思路**：不返回错误，而是在工具执行结果中添加温和的提示。

#### 实现方式

```typescript
if (isFirstTool && !exemptTools.includes(toolName)) {
  console.warn(`⚠️ Tool ${toolName} called without planning (non-blocking)`);
  
  // 执行工具
  const result = await (toolDef as any).execute(args);
  
  // 在结果中添加提示（不影响工具执行）
  return {
    ...result,
    _planningNote: `ℹ️ Note: For better results on complex tasks, consider calling 'create_plan' first to structure your approach.`,
    _planningSuggestion: 'This helps ensure systematic execution and better error handling.'
  };
}
```

**优势**：
- ✅ 完全不中断
- ✅ 教育性提示
- ✅ AI 可以看到但不会报错

**劣势**：
- ⚠️ AI 可能完全忽略提示
- ⚠️ 不保证 planning 被执行

---

### 方案 5：**延迟执行 + Planning 提示**

**核心思路**：第一次违规时给一次机会，提示 AI 重新思考。

#### 实现方式

```typescript
if (isFirstTool && !exemptTools.includes(toolName)) {
  // 第一次违规：给出友好提示
  if (!requestState.planningViolationWarned) {
    requestState.planningViolationWarned = true;
    
    return {
      success: false,
      error: null,  // 不是真正的错误
      suggestion: `Consider starting with 'create_plan' for better task structuring`,
      alternativeAction: {
        recommended: 'create_plan',
        reason: 'Creates a systematic approach for multi-step tasks',
        skipable: true,  // 可以跳过
        message: 'You can proceed directly, but planning is recommended for complex tasks'
      }
    };
  }
  
  // 第二次违规：直接执行（用户坚持）
  console.log(`📝 User chose to skip planning, proceeding...`);
}
```

**优势**：
- ✅ 给 AI 机会重新思考
- ✅ 不强制但有指导
- ✅ 用户有最终控制权

**劣势**：
- ⚠️ 增加一轮交互
- ⚠️ 可能让用户困惑

---

## 📊 方案对比

| 方案 | 用户体验 | 代码复杂度 | 保证质量 | 推荐度 |
|------|---------|-----------|---------|-------|
| 1. 自动补偿 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 2. Skill 配置 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 3. 智能判断 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 4. 柔性提示 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 5. 延迟执行 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 现状（硬中断） | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |

---

## 🚀 推荐实施方案

### **组合方案：方案 1 + 方案 2**

1. **默认启用自动补偿**（方案 1）
   - 检测到违规时自动创建简单 plan
   - 不中断执行
   - 记录到日志

2. **为关键 Skill 配置强制模式**（方案 2）
   - Content Production → `planningMode: 'mandatory'`
   - 复杂的多步骤任务 → 强制 planning
   - 简单工具 → `planningMode: 'optional'`

3. **添加监控和统计**
   - 记录自动补偿的频率
   - 分析哪些工具经常被跳过 planning
   - 优化 prompt 引导 AI 主动 planning

### 实施步骤

```typescript
// Step 1: 添加 Skill 配置
interface SkillMetadata {
  planningMode?: 'mandatory' | 'auto' | 'optional';
}

// Step 2: 修改 enforcement 逻辑
if (isFirstTool && !exemptTools.includes(toolName)) {
  const skillConfig = getSkillForTool(toolName);
  const mode = skillConfig?.metadata?.planningMode || 'auto';
  
  if (mode === 'optional') {
    // 完全跳过
  } else if (mode === 'auto') {
    // 自动创建简单 plan
    await autoCreatePlan(toolName, args);
  } else {
    // mandatory - 返回错误
    return { success: false, error: '...' };
  }
}
```

---

## 💡 额外优化建议

### 1. **简化 System Prompt**

当前 prompt 太长，重复内容过多。可以简化为：

```
PLANNING RULE:
- Complex tasks? Call create_plan first
- Simple single-tool tasks? Optional (but recommended)
- If unsure? Plan first (safer)
```

### 2. **上下文感知**

```typescript
// 如果用户在同一对话中重复类似操作，自动降低 planning 要求
if (conversationHistory.includes('similar_task_completed')) {
  relaxPlanningRequirement();
}
```

### 3. **用户反馈机制**

```typescript
// 允许用户选择是否需要 planning
interface UserPreferences {
  alwaysPlan: boolean;      // 总是要求 planning
  skipSimpleTasks: boolean; // 跳过简单任务
  autoMode: boolean;        // 自动判断（默认）
}
```

---

## 总结

**推荐实施：自动补偿式 Planning**

优势最明显：
- ✅ 不影响用户体验
- ✅ 保留 planning 的好处
- ✅ 代码改动量适中
- ✅ 易于监控和优化

这样既能保证质量，又不会让用户感到"被强制"。


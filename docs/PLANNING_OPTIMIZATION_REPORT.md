# Planning-First 优化实施报告

## 📋 问题回顾

### 用户反馈
> "就中断了，话说每次要求先调用 plan 这个，实现上能更优雅吗"

### 原有问题
1. **硬性中断**：违反 planning 规则时直接返回错误，中断 AI 执行
2. **用户体验差**：看到大段错误消息，不知道为什么被打断
3. **过度强制**：即使简单任务也强制要求 planning
4. **Prompt 过长**：system prompt 中大量重复强调，消耗 token

---

## ✅ 实施的解决方案

### **自动补偿式 Planning（Auto-Compensation）**

#### 核心思路
- **不中断执行**：当 AI 跳过 planning 时，不返回错误
- **自动创建 plan**：系统自动生成一个简单的 plan
- **透明记录**：日志中记录自动补偿行为，便于监控
- **保持灵活性**：AI 仍可以主动 planning，系统只是兜底

#### 实现代码

```typescript
// app/api/chat/route.ts
if (isFirstTool && !exemptTools.includes(toolName)) {
  // ✅ 新实现：自动补偿，不中断
  console.warn(`⚠️  Planning skipped for '${toolName}' - Auto-generating simple plan...`);
  
  const autoPlan = {
    task_summary: `Execute ${toolName}`,
    steps: [{
      step_number: 1,
      description: `Call ${toolName} with provided parameters`,
      required_skills: ['core'],
      required_tools: [toolName],
      estimated_complexity: 'simple'
    }],
    considerations: ['Auto-generated plan for single tool execution']
  };
  
  requestState.hasCalledPlan = true;
  requestState.autoPlanned = true;
  
  console.log('✅ Auto-plan created:', autoPlan.task_summary);
  console.log(`📊 Auto-plan stats: tool=${toolName}, user=${userId || 'unknown'}`);
}

// ❌ 旧实现：硬性中断
if (isFirstTool && !exemptTools.includes(toolName)) {
  return {
    success: false,
    error: 'PLANNING-FIRST RULE VIOLATION!...',
    systemEnforced: true,
    violationType: 'planning_first_rule'
  };
}
```

---

## 🎯 Prompt 优化

### 修改前（强制性语气）
```
====================
MANDATORY PLANNING-FIRST RULE (NON-NEGOTIABLE!)
====================

CRITICAL REQUIREMENT - READ CAREFULLY:

IF the user's request requires you to call ANY tool or take ANY action:
→ You MUST call 'create_plan' as your FIRST tool call
→ NO EXCEPTIONS - this is a hard requirement

REQUIRES PLANNING (MUST call create_plan first):
- ANY keyword research
- ANY web search
- LITERALLY ANY OTHER TOOL - if it's a tool, plan first!
```

### 修改后（推荐性语气）
```
====================
PLANNING RECOMMENDATION (BEST PRACTICE)
====================

FOR BETTER RESULTS - RECOMMENDED WORKFLOW:

IF the user's request requires calling tools:
→ Consider calling 'create_plan' as your FIRST tool call
→ This helps structure complex multi-step tasks

BENEFITS OF PLANNING:
- Systematic thinking before execution
- Better error handling
- Transparency for the user

WHEN TO PLAN:
- Complex multi-step tasks (RECOMMENDED)
- Simple single-tool tasks (OPTIONAL - system will auto-plan if skipped)

NOTE: If you skip planning, the system will automatically create a simple plan.
However, for complex tasks, explicit planning leads to better outcomes.
```

### Token 节省
- 修改前：~450 tokens
- 修改后：~200 tokens
- **节省：~55% token 消耗**

---

## 📊 效果对比

| 维度 | 修改前 | 修改后 |
|------|--------|--------|
| **用户体验** | ❌ 硬性中断，看到错误 | ✅ 流畅执行，无中断 |
| **AI 行为** | ❌ 必须严格遵守 | ✅ 推荐但不强制 |
| **简单任务** | ❌ 被迫 planning | ✅ 自动补偿 |
| **复杂任务** | ✅ 强制 planning | ✅ 推荐 planning（AI 仍会主动） |
| **Prompt 长度** | ❌ 过长重复 | ✅ 简洁清晰 |
| **监控能力** | ⚠️ 错误日志 | ✅ 自动补偿统计 |

---

## 🔍 监控和统计

### 自动补偿日志

```
⚠️  Planning skipped for 'draft_page_section' - Auto-generating simple plan...
✅ Auto-plan created: Execute draft_page_section
📊 Auto-plan stats: tool=draft_page_section, user=user123
```

### 可用于分析
- **哪些工具经常被跳过 planning**：优化 prompt 引导
- **哪些用户习惯跳过 planning**：个性化建议
- **自动补偿频率**：评估 planning 策略效果

---

## 💡 额外优化

### 1. Task Tracking 也改为推荐
- 移除了 "MANDATORY" 字样
- 改为 "RECOMMENDED WORKFLOW"
- 用户体验更友好

### 2. Skill-specific Prompt 简化
- `content-production.skill.ts` 移除了 "MUST call create_plan"
- 保留工作流说明，但不强制

### 3. 为未来扩展预留空间
- `requestState.autoPlanned` 标记可用于统计
- 便于后续实现 Skill 级别的 planning 配置

---

## 🚀 实施文件清单

### 修改的文件
1. ✅ `app/api/chat/route.ts` - 实现自动补偿逻辑
2. ✅ `app/api/skills/index.ts` - 简化 planning prompt
3. ✅ `app/api/skills/skill-content/content-production.skill.ts` - 移除强制语气

### 新增的文档
1. ✅ `docs/PLANNING_OPTIMIZATION_PROPOSAL.md` - 详细方案文档
2. ✅ `docs/PLANNING_OPTIMIZATION_REPORT.md` - 本实施报告

---

## ✨ 用户体验改善

### 场景 1：简单任务
**修改前**：
```
User: "生成这个页面的内容"
AI: 调用 draft_page_section
System: ❌ PLANNING-FIRST RULE VIOLATION! ...
User: 😡 为什么被打断？
```

**修改后**：
```
User: "生成这个页面的内容"
AI: 调用 draft_page_section
System: ⚠️ Auto-planning (后台日志)
AI: ✅ 继续执行，生成内容
User: 😊 顺利完成
```

### 场景 2：复杂任务
AI 仍然会主动 planning（因为 prompt 推荐这样做），只是不再是强制的。

---

## 🎓 设计理念

### 从"强制"到"引导"
- **修改前**：通过强制规则约束 AI 行为
- **修改后**：通过推荐和兜底引导 AI 行为

### 从"惩罚"到"帮助"
- **修改前**：违规就中断（惩罚）
- **修改后**：自动补偿（帮助）

### 从"完美主义"到"实用主义"
- **修改前**：所有任务都必须 planning
- **修改后**：复杂任务 planning，简单任务自动处理

---

## 📈 预期效果

### 立即效果
- ✅ 用户不再看到 "PLANNING-FIRST RULE VIOLATION" 错误
- ✅ 简单任务执行更流畅
- ✅ Token 消耗减少约 55%

### 长期效果
- ✅ AI 学会在合适的时候主动 planning
- ✅ 用户体验显著提升
- ✅ 通过统计数据优化 planning 策略

---

## 🔮 未来扩展方向

### 1. Skill 级别配置
```typescript
export const contentProductionSkill: Skill = {
  ...
  metadata: {
    planningMode: 'recommended' // 'mandatory' | 'auto' | 'optional'
  }
};
```

### 2. 智能判断
- 根据对话历史、任务复杂度动态调整
- 学习用户习惯

### 3. 用户偏好
```typescript
interface UserPreferences {
  alwaysPlan: boolean;
  skipSimpleTasks: boolean;
  autoMode: boolean; // 默认
}
```

---

## 总结

**核心改进**：将 planning 从"强制要求"改为"推荐最佳实践 + 自动兜底"

**关键价值**：
1. ✅ 不影响用户体验（不中断）
2. ✅ 保留 planning 的好处（自动补偿）
3. ✅ 简化 prompt（节省 token）
4. ✅ 提供监控数据（持续优化）

这是一个更加优雅、用户友好、符合实际使用场景的实现。

---

**实施日期**: 2025-12-21  
**实施类型**: UX 优化 / 流程改进  
**影响范围**: 所有 skills


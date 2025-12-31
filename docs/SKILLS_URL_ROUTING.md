# Skills 页面 URL 路由功能

## 🎯 功能说明

每个 skill 和 tool 现在都有独立的 URL，支持直接访问和分享。

## 📋 URL 参数格式

### 1. **基础访问**
```
/skills
→ 默认显示第一个 Research 技能
```

### 2. **选择 Tab**
```
/skills?tab=research
/skills?tab=build
/skills?tab=optimize
/skills?tab=monitor
/skills?tab=context
```

### 3. **选择特定 Skill**
```
/skills?tab=research&skill=serp-analyzer
/skills?tab=build&skill=topic-brainstorm
/skills?tab=optimize&skill=internal-linking
```

### 4. **打开特定 Tool 弹窗**
```
/skills?tab=build&skill=topic-brainstorm&tool=web_search
/skills?skill=topic-brainstorm&tool=detect_site_topics
```

**注意**：`tab` 参数可选，系统会根据 `skill` 自动匹配所属 tab

---

## 🔄 交互行为

### Tab 切换
- 点击任意 tab → URL 更新为 `?tab=xxx&skill=<该tab第一个技能>`
- 自动选中该 tab 的第一个技能

### Skill 选择
- 点击任意 skill 卡片 → URL 更新为 `?tab=xxx&skill=xxx`
- 卡片高亮显示当前选中状态

### Tool 打开
- 点击 "源代码" 按钮 → URL 添加 `&tool=xxx`
- 弹窗自动打开，显示源代码
- 关闭弹窗 → URL 移除 `tool` 参数

---

## 🎨 URL 示例

### 实际场景

#### 1. 分享 "Topic Brainstorm" 技能
```
https://yoursite.com/skills?tab=build&skill=topic-brainstorm
```
→ 访问后直接定位到该技能

#### 2. 分享 "Web Search" 工具源码
```
https://yoursite.com/skills?skill=topic-brainstorm&tool=web_search
```
→ 访问后自动打开工具源码弹窗

#### 3. 分享 "Detect Site Topics" 工具
```
https://yoursite.com/skills?skill=site-context&tool=detect_site_topics
```
→ 访问后定位到 Site Context Acquisition 技能并打开工具弹窗

---

## 💡 技术实现

### 核心功能

```typescript
// 1. 读取 URL 参数
const searchParams = useSearchParams();
const tabParam = searchParams.get('tab');
const skillParam = searchParams.get('skill');
const toolParam = searchParams.get('tool');

// 2. 更新 URL（不刷新页面）
const updateURL = (tab?: string, skillId?: string, toolId?: string) => {
  const params = new URLSearchParams();
  if (tab) params.set('tab', tab);
  if (skillId) params.set('skill', skillId);
  if (toolId) params.set('tool', toolId);
  
  const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
  router.push(newURL, { scroll: false });
};

// 3. 初始化时根据 URL 设置状态
useEffect(() => {
  if (skillParam) {
    setSelectedSkillId(skillParam);
    if (toolParam) {
      openToolModal(toolParam, skillParam);
    }
  }
}, [searchParams]);
```

### 触发 URL 更新的动作

1. **切换 Tab** → `updateURL(newTab, firstSkillInTab)`
2. **选择 Skill** → `updateURL(currentTab, selectedSkillId)`
3. **打开 Tool** → `updateURL(currentTab, currentSkillId, toolId)`
4. **关闭 Tool** → `updateURL(currentTab, currentSkillId)` (移除 tool)

---

## 🧪 测试用例

### 测试 1: 直接访问技能
```bash
# 访问 URL
/skills?skill=topic-brainstorm

# 预期结果
✓ 自动切换到 Build tab
✓ 选中 Topic Brainstorm 技能
✓ 右侧显示该技能详情
```

### 测试 2: 打开工具源码
```bash
# 访问 URL
/skills?skill=topic-brainstorm&tool=web_search

# 预期结果
✓ 定位到 Topic Brainstorm 技能
✓ 自动打开 Web Search 工具源码弹窗
✓ 显示完整源代码
```

### 测试 3: URL 参数容错
```bash
# 访问不存在的技能
/skills?skill=non-existent-skill

# 预期结果
✓ 回退到默认行为（显示第一个 Research 技能）
✓ 不报错，用户体验流畅
```

### 测试 4: 切换后的 URL 同步
```bash
# 操作流程
1. 访问 /skills
2. 点击 "Build" tab
3. 点击 "Page Planner" 技能
4. 点击 "Generate Outline" 工具的源码按钮

# 预期 URL 变化
/skills 
→ /skills?tab=build&skill=page-planner
→ /skills?tab=build&skill=page-planner&tool=generate_outline

# 5. 关闭工具弹窗
→ /skills?tab=build&skill=page-planner
```

---

## 🚀 使用场景

### 1. **文档链接**
在文档中直接链接到特定工具：
```markdown
查看 [Topic Brainstorm 的 Web Search 工具](/skills?skill=topic-brainstorm&tool=web_search)
```

### 2. **团队协作**
分享具体技能给团队成员：
```
"看下这个 SERP Analyzer 技能，能解决你的问题"
→ /skills?tab=research&skill=serp-analyzer
```

### 3. **用户支持**
客服可以发送精确的 URL：
```
"请访问这个链接查看 Detect Site Topics 工具的实现"
→ /skills?skill=site-context&tool=detect_site_topics
```

### 4. **调试追踪**
记录用户访问路径，便于问题排查：
```
用户反馈: "Topic Brainstorm 的 Check Duplication 工具有问题"
→ 直接访问该工具进行验证
```

---

## ⚡ 性能优化

- ✅ 使用 `router.push(url, { scroll: false })` 避免页面滚动
- ✅ URL 更新不触发页面刷新
- ✅ 状态更新和 URL 更新同步，无延迟感
- ✅ 支持浏览器前进/后退按钮

---

## 📌 注意事项

1. **Tab 参数可选**
   - 如果只提供 `skill`，系统会自动推断所属 tab
   - 显式提供 `tab` 可以提升加载速度

2. **Tool 必须配合 Skill**
   - 单独提供 `tool` 参数无效
   - 必须同时提供 `skill` 参数

3. **URL 参数容错**
   - 无效的参数会被忽略
   - 自动回退到默认状态
   - 不会显示错误给用户

4. **浏览器历史记录**
   - 每次 URL 更新都会创建新的历史记录
   - 用户可以使用浏览器的前进/后退功能
   - 历史记录包含完整的访问路径

---

## 🎉 总结

现在 Skills 页面完全支持 URL 路由，用户可以：
- 📎 分享任意技能/工具的直接链接
- 🔖 收藏常用技能的 URL
- ↩️ 使用浏览器前进/后退按钮
- 🔗 在文档中嵌入精确的技能链接

所有交互都会自动同步到 URL，提供流畅的用户体验！🚀


# 消息反馈功能 (Message Feedback Feature)

## 功能概述

用户可以对每条 agent 回复的消息进行点赞或踩，并填写反馈原因。所有反馈数据会被保存到数据库中，方便未来在后台查看和分析问题。

## 实现的功能

### 1. 数据库表结构

创建了 `message_feedback` 表，包含以下字段：
- `id`: 主键
- `message_id`: 被反馈的消息 ID
- `user_id`: 用户 ID
- `conversation_id`: 对话 ID
- `feedback_type`: 反馈类型（'like' 或 'dislike'）
- `reason`: 用户填写的反馈原因
- `message_content`: 消息内容快照（用于未来分析）
- `created_at`: 创建时间

### 2. 用户界面

- 在每条 agent 消息下方显示"Like"和"Dislike"按钮
- 点击按钮后弹出模态框，要求用户填写反馈原因
- 已反馈的消息会高亮显示对应的按钮（绿色表示点赞，红色表示踩）
- 用户可以修改已有的反馈

### 3. API 接口

#### POST `/api/message-feedback`
提交或更新消息反馈

请求体：
```json
{
  "messageId": "uuid",
  "userId": "uuid",
  "conversationId": "uuid",
  "feedbackType": "like" | "dislike",
  "reason": "用户填写的原因",
  "messageContent": "消息内容快照（可选）"
}
```

#### GET `/api/message-feedback?messageId=xxx&userId=xxx`
获取特定用户对特定消息的反馈

#### GET `/api/message-feedback?messageId=xxx`
获取某条消息的所有反馈（用于后台分析）

## 使用方法

### 运行数据库迁移

在 Supabase SQL Editor 中运行以下迁移文件：
```bash
mini-agent/supabase/migrations/add_message_feedback.sql
```

### 查看反馈数据

在 Supabase Dashboard 中，可以查询 `message_feedback` 表来查看所有用户反馈：

```sql
-- 查看所有反馈
SELECT * FROM message_feedback ORDER BY created_at DESC;

-- 查看特定对话的反馈
SELECT * FROM message_feedback WHERE conversation_id = 'your-conversation-id';

-- 统计点赞和踩的数量
SELECT 
  feedback_type,
  COUNT(*) as count
FROM message_feedback
GROUP BY feedback_type;

-- 查看最近的负面反馈（踩）
SELECT 
  mf.reason,
  mf.message_content,
  mf.created_at,
  c.title as conversation_title
FROM message_feedback mf
JOIN conversations c ON mf.conversation_id = c.id
WHERE mf.feedback_type = 'dislike'
ORDER BY mf.created_at DESC
LIMIT 20;
```

## 安全性

- 启用了行级安全（RLS）策略
- 用户只能查看和创建自己的反馈
- 使用 service role key 在 API 路由中进行数据库操作

## 未来改进建议

1. 创建管理后台页面，可视化展示所有反馈数据
2. 添加反馈分类标签（如：不准确、不完整、格式问题等）
3. 添加反馈统计和趋势分析
4. 支持导出反馈数据为 CSV 或 Excel
5. 添加邮件通知，当收到负面反馈时通知管理员


# 创建 Supabase Logos Storage Bucket

在使用 Site Context 的 Logo 上传功能之前，需要在 Supabase 中创建 storage bucket。

## 步骤

### 1. 在 Supabase Dashboard 中创建 Bucket

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 **Storage**
4. 点击 **New bucket** 按钮
5. 填写信息：
   - **Name**: `logos`
   - **Public**: ✅ 勾选（这样 logos 可以公开访问）
6. 点击 **Create bucket**

### 2. 设置 Storage Policies

创建 bucket 后，需要设置访问策略。在 **Storage > logos > Policies** 中添加以下策略：

#### Policy 1: 允许认证用户上传 logos

```sql
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: 允许公开读取 logos

```sql
CREATE POLICY "Allow public read access to logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');
```

#### Policy 3: 允许用户更新自己的 logos

```sql
CREATE POLICY "Allow users to update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: 允许用户删除自己的 logos

```sql
CREATE POLICY "Allow users to delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. 验证设置

创建完成后，可以在 Storage 页面看到 `logos` bucket，并且它应该显示为 **Public**。

## 文件结构

上传的 logos 将按用户 ID 组织：
```
logos/
  └── {user_id}/
      ├── {timestamp}-{random}.png
      ├── {timestamp}-{random}.jpg
      └── ...
```

## 支持的文件格式

- PNG
- JPG/JPEG
- GIF
- SVG
- WebP
- 所有 `image/*` MIME 类型

## 注意事项

- 确保 bucket 名称是 `logos`（小写）
- 必须设置为 Public bucket，否则图片无法在前端显示
- 文件会自动按用户 ID 分组，避免文件名冲突
- 每个文件都有唯一的时间戳和随机字符串


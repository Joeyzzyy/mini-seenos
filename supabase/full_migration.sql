-- ============================================
-- SEOPages.pro - 完整数据库迁移脚本
-- 用于迁移到新的 Supabase 项目
-- ============================================
-- 使用方法：
-- 1. 在新 Supabase 项目的 SQL Editor 中运行此脚本
-- 2. 然后导入数据（如果需要）
-- ============================================

-- ============================================
-- 第一部分：基础表结构
-- ============================================

-- 1. SEO Projects 表
CREATE TABLE IF NOT EXISTS seo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversations 表
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE, -- 代码中使用的别名
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messages 表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT,
  tool_invocations JSONB,
  annotations JSONB,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  attached_files JSONB,
  attached_content_items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Files 表
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Content Items 表
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  page_type TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Content Item Sections 表
CREATE TABLE IF NOT EXISTS content_item_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  section_order INT NOT NULL DEFAULT 0,
  section_html TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_item_id, section_id)
);

-- 7. Content Projects 表
CREATE TABLE IF NOT EXISTS content_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  brand_site TEXT,
  competitor_sites TEXT[],
  template_type TEXT DEFAULT 'alternative',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Contexts 表
CREATE TABLE IF NOT EXISTS site_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT,
  html TEXT,
  file_url TEXT,
  -- Brand Assets fields
  domain_name TEXT,
  brand_name TEXT,
  subtitle TEXT,
  meta_description TEXT,
  og_image TEXT,
  favicon TEXT,
  logo_url TEXT,
  logo_light_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,
  favicon_light_url TEXT,
  favicon_dark_url TEXT,
  -- Legacy logo/favicon fields for compatibility
  logo_light TEXT,
  logo_dark TEXT,
  icon_light TEXT,
  icon_dark TEXT,
  -- Style fields
  primary_color TEXT,
  secondary_color TEXT,
  heading_font TEXT,
  body_font TEXT,
  tone TEXT,
  languages TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, seo_project_id, type)
);

-- 9. Offsite Contexts 表
CREATE TABLE IF NOT EXISTS offsite_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  context_data JSONB NOT NULL DEFAULT '{}',
  source_type TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. User Domains 表
CREATE TABLE IF NOT EXISTS user_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  verification_type TEXT DEFAULT 'txt',
  verification_token TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, domain)
);

-- 11. Domain Subdirectories 表
CREATE TABLE IF NOT EXISTS domain_subdirectories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES user_domains(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain_id, path)
);

-- 12. GSC Integrations 表
CREATE TABLE IF NOT EXISTS gsc_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  expiry_date BIGINT,
  authorized_sites TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Project Knowledge 表
CREATE TABLE IF NOT EXISTS project_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seo_project_id UUID REFERENCES seo_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. User Profiles 表（积分系统）
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'standard', 'pro')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Payment Orders 表
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paypal_capture_id TEXT,
  credits_added INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Feedbacks 表
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message_id UUID,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative')),
  feedback_text TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 第二部分：索引
-- ============================================

CREATE INDEX IF NOT EXISTS idx_seo_projects_user_id ON seo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seo_project_id ON conversations(seo_project_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_seo_project_id ON content_items(seo_project_id);
CREATE INDEX IF NOT EXISTS idx_content_item_sections_content_item_id ON content_item_sections(content_item_id);
CREATE INDEX IF NOT EXISTS idx_site_contexts_user_id ON site_contexts(user_id);
CREATE INDEX IF NOT EXISTS idx_site_contexts_seo_project_id ON site_contexts(seo_project_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);

-- ============================================
-- 第三部分：启用 RLS
-- ============================================

ALTER TABLE seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_item_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE offsite_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_subdirectories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsc_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 第四部分：RLS 策略
-- ============================================

-- SEO Projects
CREATE POLICY "Users can access own seo_projects" ON seo_projects
  FOR ALL USING (auth.uid() = user_id);

-- Conversations
CREATE POLICY "Users can access own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Users can access own messages" ON messages
  FOR ALL USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));

-- Files
CREATE POLICY "Users can access own files" ON files
  FOR ALL USING (auth.uid() = user_id);

-- Content Items
CREATE POLICY "Users can access own content" ON content_items
  FOR ALL USING (auth.uid() = user_id);

-- Content Item Sections
CREATE POLICY "Users can manage their own sections" ON content_item_sections
  FOR ALL USING (content_item_id IN (
    SELECT id FROM content_items WHERE user_id = auth.uid()
  ));

-- Content Projects
CREATE POLICY "Users can access own content_projects" ON content_projects
  FOR ALL USING (auth.uid() = user_id);

-- Site Contexts
CREATE POLICY "Users can access own site_contexts" ON site_contexts
  FOR ALL USING (auth.uid() = user_id);

-- Offsite Contexts
CREATE POLICY "Users can access own offsite_contexts" ON offsite_contexts
  FOR ALL USING (auth.uid() = user_id);

-- User Domains
CREATE POLICY "Users can access own domains" ON user_domains
  FOR ALL USING (auth.uid() = user_id);

-- Domain Subdirectories
CREATE POLICY "Users can access own subdirectories" ON domain_subdirectories
  FOR ALL USING (domain_id IN (
    SELECT id FROM user_domains WHERE user_id = auth.uid()
  ));

-- GSC Integrations
CREATE POLICY "Users can access own gsc" ON gsc_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Project Knowledge
CREATE POLICY "Users can access own project_knowledge" ON project_knowledge
  FOR ALL USING (auth.uid() = user_id);

-- User Profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Payment Orders
CREATE POLICY "Users can view own orders" ON payment_orders
  FOR SELECT USING (auth.uid() = user_id);

-- Feedbacks
CREATE POLICY "Users can insert feedback" ON feedbacks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON feedbacks
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 第五部分：函数和触发器
-- ============================================

-- 自动创建用户 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, credits)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 更新 updated_at 字段
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表添加 updated_at 触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_seo_projects_updated_at ON seo_projects;
CREATE TRIGGER update_seo_projects_updated_at
  BEFORE UPDATE ON seo_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 添加积分函数
CREATE OR REPLACE FUNCTION public.add_user_credits(
  user_id UUID,
  credits_to_add INTEGER,
  new_tier TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_total INTEGER;
BEGIN
  UPDATE public.user_profiles
  SET 
    credits = credits + credits_to_add,
    subscription_tier = COALESCE(new_tier, subscription_tier),
    subscription_status = CASE WHEN new_tier IS NOT NULL THEN 'active' ELSE subscription_status END,
    updated_at = NOW()
  WHERE id = user_id
  RETURNING credits INTO new_total;
  
  RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 消费积分函数
CREATE OR REPLACE FUNCTION public.consume_credit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits
  FROM public.user_profiles
  WHERE id = user_id;
  
  IF current_credits > 0 THEN
    UPDATE public.user_profiles
    SET credits = credits - 1, updated_at = NOW()
    WHERE id = user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户积分函数
CREATE OR REPLACE FUNCTION public.get_user_credits(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_credits INTEGER;
BEGIN
  SELECT credits INTO user_credits
  FROM public.user_profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_credits, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 第六部分：Storage Buckets
-- ============================================

-- 1. Knowledge bucket (私有，10MB，特定文件类型)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'knowledge', 
  'knowledge', 
  false,
  10485760, -- 10MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/json',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Logos bucket (公开，无限制)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Files bucket (公开，5MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('files', 'files', true, 5242880) -- 5MB
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage RLS 策略 - Knowledge bucket
-- ============================================

CREATE POLICY "knowledge_insert_own_folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'knowledge' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "knowledge_select_own_files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'knowledge' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "knowledge_update_own_files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'knowledge' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "knowledge_delete_own_files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'knowledge' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- Storage RLS 策略 - Logos bucket (公开读，认证用户写)
-- ============================================

CREATE POLICY "logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "logos_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "logos_auth_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'logos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "logos_auth_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'logos' AND
    auth.role() = 'authenticated'
  );

-- ============================================
-- Storage RLS 策略 - Files bucket (公开读，认证用户写)
-- ============================================

CREATE POLICY "files_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "files_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'files' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "files_auth_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'files' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "files_auth_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'files' AND
    auth.role() = 'authenticated'
  );

-- ============================================
-- 完成！
-- ============================================
-- 注意：迁移完成后，需要：
-- 1. 更新 .env.local 中的 Supabase 配置
-- 2. 在 Supabase Dashboard 中配置 Google OAuth
-- 3. 如果需要迁移数据，使用 pg_dump/pg_restore
-- ============================================

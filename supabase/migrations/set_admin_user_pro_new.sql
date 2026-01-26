-- 将 zhuyuejoey@gmail.com 设为 Pro 套餐（最高级别）
-- 在新 Supabase 项目中运行此脚本

-- 更新用户为 Pro 套餐
UPDATE public.user_profiles 
SET 
  credits = 999,
  subscription_tier = 'pro',
  subscription_status = 'active',
  updated_at = NOW()
WHERE email = 'zhuyuejoey@gmail.com';

-- 如果用户 profile 不存在，则插入
INSERT INTO public.user_profiles (id, email, credits, subscription_tier, subscription_status)
SELECT 
  id,
  email,
  999,
  'pro',
  'active'
FROM auth.users
WHERE email = 'zhuyuejoey@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  credits = 999,
  subscription_tier = 'pro',
  subscription_status = 'active',
  updated_at = NOW();

-- 验证更新结果
SELECT 
  id,
  email,
  credits,
  subscription_tier,
  subscription_status,
  updated_at
FROM public.user_profiles
WHERE email = 'zhuyuejoey@gmail.com';

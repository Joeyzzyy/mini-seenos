-- 将 zhuyuejoe@gmail.com 设为 Starter 套餐（入门版）
-- 2 个页面 credits

-- 更新用户为 Starter 套餐
UPDATE public.user_profiles 
SET 
  credits = 2,
  subscription_tier = 'starter',
  subscription_status = 'active',
  updated_at = NOW()
WHERE email = 'zhuyuejoe@gmail.com';

-- 如果用户 profile 不存在，则插入
INSERT INTO public.user_profiles (id, email, credits, subscription_tier, subscription_status)
SELECT 
  id,
  email,
  2,
  'starter',
  'active'
FROM auth.users
WHERE email = 'zhuyuejoe@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  credits = 2,
  subscription_tier = 'starter',
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
WHERE email = 'zhuyuejoe@gmail.com';

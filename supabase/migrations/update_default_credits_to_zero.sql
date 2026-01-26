-- Update default credits from 1 to 0 for free tier users
-- New users must purchase credits before they can generate pages

-- Update the table default
ALTER TABLE public.user_profiles 
ALTER COLUMN credits SET DEFAULT 0;

-- Update the trigger function to give 0 credits by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, credits)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    0 -- Default 0 credits for new users (must purchase to use)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comment
COMMENT ON COLUMN public.user_profiles.credits IS 'Number of page generation credits remaining. Default 0 for free tier.';

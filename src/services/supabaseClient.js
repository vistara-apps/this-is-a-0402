import { createClient } from '@supabase/supabase-js'

// These would be environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema setup (run these SQL commands in Supabase SQL editor)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'basic',
  test_tiktok_account VARCHAR(255),
  test_ig_account VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_image_url TEXT,
  ad_text TEXT NOT NULL,
  headline VARCHAR(255),
  cta VARCHAR(100),
  platform VARCHAR(50) NOT NULL, -- 'tiktok' or 'instagram'
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  is_posted BOOLEAN DEFAULT FALSE,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad variations table (for storing generated variations before posting)
CREATE TABLE IF NOT EXISTS ad_variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_image_url TEXT,
  headline VARCHAR(255),
  ad_text TEXT NOT NULL,
  cta VARCHAR(100),
  platform VARCHAR(50) NOT NULL,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  ad_variations_limit INTEGER,
  auto_posts_limit INTEGER,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, ad_variations_limit, auto_posts_limit, features) VALUES
('Basic', 19.00, 50, 10, '{"analytics": true, "basic_support": true}'),
('Pro', 49.00, 200, 50, '{"analytics": true, "priority_support": true, "advanced_targeting": true}'),
('Unlimited', 99.00, -1, -1, '{"analytics": true, "priority_support": true, "advanced_targeting": true, "custom_branding": true}')
ON CONFLICT DO NOTHING;

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media accounts table
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'tiktok' or 'instagram'
  account_username VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_platform ON ads(platform);
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at);
CREATE INDEX IF NOT EXISTS idx_ad_variations_user_id ON ad_variations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_social_media_accounts_user_id ON social_media_accounts(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own ads" ON ads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own ad variations" ON ad_variations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own social accounts" ON social_media_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (true);
`

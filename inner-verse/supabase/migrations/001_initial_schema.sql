-- ============================================
-- INNER VERSE - Initial Database Schema
-- Run this in your Supabase SQL editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- QUESTION SETS
-- Expandable for future question categories
-- ============================================
CREATE TABLE question_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'personal', -- personal, relationship, milestone, seasonal
  hero_question TEXT NOT NULL,
  hero_guidance TEXT,
  deepening_prompts JSONB NOT NULL DEFAULT '[]',
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PROFILES
-- Extends Supabase auth.users
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  poems_remaining INTEGER DEFAULT 1, -- Free poems after signup
  subscription_tier TEXT DEFAULT 'free', -- free, one-off, subscriber
  completed_sets UUID[] DEFAULT '{}',
  total_journeys INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  email_consent BOOLEAN DEFAULT FALSE, -- For newsletter
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOURNEYS
-- Each reflection session
-- ============================================
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_token TEXT, -- For pre-signup linking
  question_set_id UUID REFERENCES question_sets(id),
  answers JSONB NOT NULL, -- { heroAnswer, deepeningAnswers }
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  privacy_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for anonymous token lookup
CREATE INDEX idx_journeys_anonymous_token ON journeys(anonymous_token);
CREATE INDEX idx_journeys_user_id ON journeys(user_id);

-- ============================================
-- POEMS
-- Generated poems
-- ============================================
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  question_set_id UUID REFERENCES question_sets(id),
  share_slug TEXT UNIQUE NOT NULL,
  occasion TEXT, -- For future gifting categories
  is_premium BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE, -- Can be shared
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for share slug lookup
CREATE INDEX idx_poems_share_slug ON poems(share_slug);
CREATE INDEX idx_poems_user_id ON poems(user_id);

-- ============================================
-- EVENTS
-- Analytics tracking
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_token TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_user_id ON events(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- User profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Journeys: users can see their own
CREATE POLICY "Users can view own journeys"
  ON journeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert journeys"
  ON journeys FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Poems: users can see their own, public poems are viewable by all
CREATE POLICY "Users can view own poems"
  ON poems FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert poems"
  ON poems FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Events: insert only (no viewing from client)
CREATE POLICY "Anyone can insert events"
  ON events FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_question_sets_updated_at
  BEFORE UPDATE ON question_sets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- Insert the default question set
-- ============================================
INSERT INTO question_sets (
  slug,
  title,
  description,
  category,
  hero_question,
  hero_guidance,
  deepening_prompts,
  is_premium,
  is_active,
  display_order
) VALUES (
  'self-discovery',
  'Self Discovery',
  'Explore the person you''re becoming',
  'personal',
  'Sitting in the middle of my most successful life, what do I see within me that I didn''t know was available to me before?',
  'Don''t rush. Picture the scene first. Write honestly — first thoughts are usually the most true.',
  '[
    {"id": "place", "question": "Where are you? Describe the place you''re sitting in this successful life.", "placeholder": "A room, a garden, a city...", "isOptional": true},
    {"id": "people", "question": "Who is around you?", "placeholder": "People, presence, solitude...", "isOptional": true},
    {"id": "body", "question": "What feeling is present in your body as you sit there?", "placeholder": "Warmth, lightness, stillness...", "isOptional": true},
    {"id": "work", "question": "What does your work or career look like from this vantage point?", "placeholder": "The nature of your days...", "isOptional": true},
    {"id": "relationships", "question": "What do your closest relationships look like?", "placeholder": "Connection, trust, love...", "isOptional": true},
    {"id": "obvious", "question": "Of all these things, which were obvious to your future self but are not obvious to you today?", "placeholder": "What surprised you about becoming this person...", "isOptional": true},
    {"id": "fear", "question": "What fear did you have to walk through to get here?", "placeholder": "The thing that almost stopped you...", "isOptional": true},
    {"id": "message", "question": "Is there anything else your future self wants you to know?", "placeholder": "A final word, a reminder, a truth...", "isOptional": true}
  ]',
  FALSE,
  TRUE,
  1
);

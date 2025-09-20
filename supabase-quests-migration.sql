-- Create quests table
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reward_exp INTEGER DEFAULT 0,
    reward_paw_points INTEGER DEFAULT 0,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Basic', 'Advanced', 'Expert')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('walk', 'social', 'health', 'discovery', 'marketplace')),
    requirements JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_quests table to track user progress
CREATE TABLE IF NOT EXISTS public.user_quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'active', 'completed', 'claimed')),
    progress JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quest_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quests_category ON public.quests(category);
CREATE INDEX IF NOT EXISTS idx_quests_difficulty ON public.quests(difficulty);
CREATE INDEX IF NOT EXISTS idx_quests_active ON public.quests(is_active);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON public.user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_status ON public.user_quests(status);

-- Enable RLS
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- Create policies for quests
CREATE POLICY "Quests are viewable by everyone" ON public.quests
    FOR SELECT USING (is_active = true);

-- Create policies for user_quests
CREATE POLICY "Users can view own quests" ON public.user_quests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests" ON public.user_quests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests" ON public.user_quests
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample quests
INSERT INTO public.quests (title, description, reward_exp, reward_paw_points, difficulty, category) VALUES
('Evening Walk', 'Stretch those little paws! Take your furry friend for a 30-minute stroll.', 50, 10, 'Basic', 'walk'),
('Pet Cafe Review', 'Share the love! Write a fun review of a pet-friendly café you visited.', 200, 25, 'Advanced', 'social'),
('Weekend Pet Meet', 'Sniff, wag, and mingle! Bring your pet to the weekend social event.', 350, 40, 'Advanced', 'social'),
('First Vet Visit', 'Take your pet for their first health checkup.', 100, 15, 'Basic', 'health'),
('Discover New Park', 'Find and visit a new pet-friendly park in your area.', 150, 20, 'Basic', 'discovery'),
('Marketplace Purchase', 'Make your first purchase in the pet marketplace.', 75, 10, 'Basic', 'marketplace'),
('Social Media Post', 'Share a cute photo of your pet on social media.', 125, 15, 'Basic', 'social'),
('Grooming Session', 'Give your pet a spa day with professional grooming.', 200, 25, 'Advanced', 'health'),
('Pet Training', 'Teach your pet a new trick or command.', 300, 35, 'Expert', 'health'),
('Community Event', 'Participate in a local pet community event.', 400, 50, 'Expert', 'social');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_quests_updated_at 
    BEFORE UPDATE ON public.quests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_quests_updated_at 
    BEFORE UPDATE ON public.user_quests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 
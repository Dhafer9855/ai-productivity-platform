
-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    module_id BIGINT REFERENCES public.modules(id) NOT NULL,
    lesson_id BIGINT REFERENCES public.lessons(id),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Update projects table to include more fields
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Enable RLS on new tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Projects policies (update existing table)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', '')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add sample course data if tables are empty (using quoted "order" column)
INSERT INTO public.modules (id, "order", title, description) VALUES 
(1, 1, 'Getting Started with AI', 'Learn the fundamentals of AI tools and their applications in the workplace'),
(2, 2, 'Productivity Enhancement', 'Master AI-powered productivity techniques and workflows'),
(3, 3, 'Communication & Collaboration', 'Leverage AI for better team communication and project management'),
(4, 4, 'Data Analysis & Insights', 'Use AI to analyze data and generate actionable insights'),
(5, 5, 'Automation & Efficiency', 'Implement AI automation to streamline your work processes'),
(6, 6, 'Creative Applications', 'Explore AI tools for content creation and design'),
(7, 7, 'Advanced Strategies', 'Advanced AI implementation strategies and best practices')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, "order", title, module_id, content_url) VALUES 
(1, 1, 'Introduction to AI in the Workplace', 1, 'https://example.com/lesson1'),
(2, 2, 'Setting Up Your AI Toolkit', 1, 'https://example.com/lesson2'),
(3, 3, 'AI Ethics and Best Practices', 1, 'https://example.com/lesson3'),
(4, 1, 'Time Management with AI', 2, 'https://example.com/lesson4'),
(5, 2, 'Task Prioritization Systems', 2, 'https://example.com/lesson5'),
(6, 3, 'Automated Scheduling', 2, 'https://example.com/lesson6'),
(7, 1, 'AI-Powered Email Management', 3, 'https://example.com/lesson7'),
(8, 2, 'Virtual Meeting Enhancement', 3, 'https://example.com/lesson8'),
(9, 3, 'Collaborative Document Creation', 3, 'https://example.com/lesson9')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON public.user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

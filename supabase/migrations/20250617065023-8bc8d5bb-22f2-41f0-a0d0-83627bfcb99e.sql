
-- Drop existing policies from modules and lessons tables since they should be publicly accessible
DROP POLICY IF EXISTS "Public read access" ON public.modules;
DROP POLICY IF EXISTS "Public read access" ON public.lessons;

-- Also drop any other policies that might exist on these tables
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on modules table
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'modules'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.modules', pol.policyname);
    END LOOP;
    
    -- Drop all policies on lessons table
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lessons'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.lessons', pol.policyname);
    END LOOP;
END
$$;

-- Add user_id column to agents table
ALTER TABLE public.agents ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.agents;
DROP POLICY IF EXISTS "Allow public insert access" ON public.agents;
DROP POLICY IF EXISTS "Allow public update access" ON public.agents;
DROP POLICY IF EXISTS "Allow public delete access" ON public.agents;

-- Create proper user-scoped RLS policies
CREATE POLICY "Users can view their own agents" 
ON public.agents FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents" 
ON public.agents FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
ON public.agents FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
ON public.agents FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);
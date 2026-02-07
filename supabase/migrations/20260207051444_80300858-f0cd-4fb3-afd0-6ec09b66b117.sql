-- Create the update function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create agents table for storing deployed AI agents
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  email TEXT,
  phone_option TEXT NOT NULL DEFAULT 'new',
  current_phone TEXT,
  ai_phone_number TEXT,
  calendar_type TEXT,
  business_hours TEXT DEFAULT '24/7',
  greeting TEXT,
  services TEXT,
  industry TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  total_calls INTEGER DEFAULT 0,
  revenue_recovered DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- For now, allow public read/write (no auth yet)
CREATE POLICY "Allow public read access" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.agents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.agents FOR DELETE USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
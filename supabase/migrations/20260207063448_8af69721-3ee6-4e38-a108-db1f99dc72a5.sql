-- Create user_credits table to track call minutes
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  included_minutes INTEGER NOT NULL DEFAULT 0,
  purchased_minutes INTEGER NOT NULL DEFAULT 0,
  used_minutes INTEGER NOT NULL DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase history table
CREATE TABLE public.credit_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  minutes_purchased INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create call usage log table
CREATE TABLE public.call_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id UUID NOT NULL,
  minutes_used INTEGER NOT NULL,
  call_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  call_ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "Users can view their own credits"
ON public.user_credits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
ON public.user_credits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.user_credits FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for credit_purchases
CREATE POLICY "Users can view their own purchases"
ON public.credit_purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
ON public.credit_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for call_usage
CREATE POLICY "Users can view their own call usage"
ON public.call_usage FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own call usage"
ON public.call_usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add foreign key to call_usage for agent_id
ALTER TABLE public.call_usage
ADD CONSTRAINT call_usage_agent_id_fkey
FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;

-- Add trigger for updated_at on user_credits
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to reset monthly minutes based on subscription tier
CREATE OR REPLACE FUNCTION public.reset_monthly_minutes(
  p_user_id UUID,
  p_tier_minutes INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_credits (user_id, included_minutes, used_minutes, last_reset_at)
  VALUES (p_user_id, p_tier_minutes, 0, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    included_minutes = p_tier_minutes,
    used_minutes = 0,
    last_reset_at = now(),
    updated_at = now();
END;
$$;

-- Function to deduct minutes from user balance (called when call engages)
CREATE OR REPLACE FUNCTION public.deduct_call_minutes(
  p_user_id UUID,
  p_agent_id UUID,
  p_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_available INTEGER;
  v_included INTEGER;
  v_purchased INTEGER;
  v_used INTEGER;
BEGIN
  -- Get current balance
  SELECT included_minutes, purchased_minutes, used_minutes
  INTO v_included, v_purchased, v_used
  FROM user_credits
  WHERE user_id = p_user_id;
  
  -- Calculate available minutes (included - used + purchased)
  v_available := GREATEST(0, v_included - v_used) + v_purchased;
  
  -- Check if enough minutes
  IF v_available < p_minutes THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct from included first, then purchased
  IF (v_included - v_used) >= p_minutes THEN
    -- All from included
    UPDATE user_credits
    SET used_minutes = used_minutes + p_minutes, updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Some from included, rest from purchased
    UPDATE user_credits
    SET 
      used_minutes = included_minutes,
      purchased_minutes = purchased_minutes - (p_minutes - GREATEST(0, v_included - v_used)),
      updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Log the usage
  INSERT INTO call_usage (user_id, agent_id, minutes_used, call_started_at)
  VALUES (p_user_id, p_agent_id, p_minutes, now());
  
  RETURN TRUE;
END;
$$;
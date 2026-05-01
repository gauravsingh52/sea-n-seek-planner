
-- Add last_credit_refresh column to profiles
ALTER TABLE public.profiles ADD COLUMN last_credit_refresh TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Update deduct_credit to auto-refresh credits daily
CREATE OR REPLACE FUNCTION public.deduct_credit(p_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  remaining INTEGER;
  last_refresh TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if credits need daily refresh
  SELECT last_credit_refresh INTO last_refresh
  FROM public.profiles WHERE user_id = p_user_id;
  
  IF last_refresh IS NOT NULL AND (now() - last_refresh) >= interval '24 hours' THEN
    UPDATE public.profiles 
    SET credits = 10, last_credit_refresh = now(), updated_at = now()
    WHERE user_id = p_user_id;
  END IF;

  -- Now deduct
  UPDATE public.profiles SET credits = credits - 1, updated_at = now()
  WHERE user_id = p_user_id AND credits > 0
  RETURNING credits INTO remaining;
  
  IF remaining IS NULL THEN
    RETURN -1;
  END IF;
  
  INSERT INTO public.credit_usage (user_id, action, credits_used)
  VALUES (p_user_id, 'chat_message', 1);
  
  RETURN remaining;
END;
$function$;

-- Also create a function to check and refresh credits (for frontend use)
CREATE OR REPLACE FUNCTION public.refresh_daily_credits(p_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_credits INTEGER;
  last_refresh TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT credits, last_credit_refresh INTO current_credits, last_refresh
  FROM public.profiles WHERE user_id = p_user_id;
  
  IF last_refresh IS NOT NULL AND (now() - last_refresh) >= interval '24 hours' THEN
    UPDATE public.profiles 
    SET credits = 10, last_credit_refresh = now(), updated_at = now()
    WHERE user_id = p_user_id
    RETURNING credits INTO current_credits;
  END IF;
  
  RETURN COALESCE(current_credits, 0);
END;
$function$;

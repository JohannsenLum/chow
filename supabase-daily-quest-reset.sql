-- Create a function to reset daily quests
CREATE OR REPLACE FUNCTION reset_daily_quests()
RETURNS void AS $$
BEGIN
    -- Reset all user quests that are not claimed to available
    UPDATE public.user_quests 
    SET 
        status = 'available',
        started_at = NULL,
        completed_at = NULL,
        progress = '{}',
        updated_at = NOW()
    WHERE status IN ('active', 'completed');
    
    -- Log the reset
    INSERT INTO public.quest_reset_log (reset_date, quests_reset_count)
    VALUES (CURRENT_DATE, (
        SELECT COUNT(*) FROM public.user_quests 
        WHERE status = 'available' AND updated_at::date = CURRENT_DATE
    ));
END;
$$ LANGUAGE plpgsql;

-- Create a table to track quest resets
CREATE TABLE IF NOT EXISTS public.quest_reset_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reset_date DATE NOT NULL,
    quests_reset_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to check if quests need daily reset
CREATE OR REPLACE FUNCTION check_and_reset_daily_quests()
RETURNS boolean AS $$
DECLARE
    last_reset_date DATE;
    today DATE := CURRENT_DATE;
BEGIN
    -- Get the last reset date
    SELECT MAX(reset_date) INTO last_reset_date 
    FROM public.quest_reset_log;
    
    -- If no previous reset or last reset was not today, reset quests
    IF last_reset_date IS NULL OR last_reset_date < today THEN
        PERFORM reset_daily_quests();
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get daily quests (calls reset if needed)
CREATE OR REPLACE FUNCTION get_daily_quests(user_uuid UUID)
RETURNS TABLE (
    quest_id UUID,
    title VARCHAR,
    description TEXT,
    reward_exp INTEGER,
    reward_paw_points INTEGER,
    difficulty VARCHAR,
    category VARCHAR,
    status VARCHAR,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check and reset if needed
    PERFORM check_and_reset_daily_quests();
    
    -- Return quests for the user
    RETURN QUERY
    SELECT 
        q.id as quest_id,
        q.title,
        q.description,
        q.reward_exp,
        q.reward_paw_points,
        q.difficulty,
        q.category,
        COALESCE(uq.status, 'available') as status,
        uq.started_at,
        uq.completed_at
    FROM public.quests q
    LEFT JOIN public.user_quests uq ON q.id = uq.quest_id AND uq.user_id = user_uuid
    WHERE q.is_active = true
    ORDER BY q.difficulty, q.title;
END;
$$ LANGUAGE plpgsql; 
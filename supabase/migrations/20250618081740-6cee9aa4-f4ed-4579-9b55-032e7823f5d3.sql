
-- First, remove duplicate entries keeping only the most recent one
DELETE FROM user_progress 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, module_id) id
    FROM user_progress 
    ORDER BY user_id, module_id, created_at DESC
);

-- Now add the unique constraint
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_module_unique UNIQUE (user_id, module_id);

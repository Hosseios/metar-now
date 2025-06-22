
-- Create a function to delete a user account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the user from auth.users (this will cascade to related tables due to foreign key constraints)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Fix critical security issue: Restrict access to users table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can create users" ON public.users;
DROP POLICY IF EXISTS "Users can update users" ON public.users;
DROP POLICY IF EXISTS "Users can delete users" ON public.users;

-- Create secure RLS policies for users table
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = id::text);

-- Users can only update their own profile  
CREATE POLICY "Users can update own profile" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = id::text);

-- Only allow user creation during signup (service role)
CREATE POLICY "Enable insert for service role only" 
ON public.users 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Prevent user deletion (can be modified later if needed)
CREATE POLICY "Prevent user deletion" 
ON public.users 
FOR DELETE 
TO authenticated
USING (false);
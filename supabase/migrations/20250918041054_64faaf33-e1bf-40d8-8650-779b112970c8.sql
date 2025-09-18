-- Fix critical medical privacy issue: Restrict access to medicines table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view all medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can create medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can update medicines" ON public.medicines;
DROP POLICY IF EXISTS "Users can delete medicines" ON public.medicines;

-- Create secure RLS policies for medicines table
-- Users can only view medicines for their own elder_id (elders see their own medicines)
CREATE POLICY "Users can view own medicines" 
ON public.medicines 
FOR SELECT 
TO authenticated
USING (elder_id = auth.uid());

-- Users can only create medicines for their own elder_id
CREATE POLICY "Users can create own medicines" 
ON public.medicines 
FOR INSERT 
TO authenticated
WITH CHECK (elder_id = auth.uid());

-- Users can only update medicines for their own elder_id
CREATE POLICY "Users can update own medicines" 
ON public.medicines 
FOR UPDATE 
TO authenticated
USING (elder_id = auth.uid());

-- Users can only delete medicines for their own elder_id
CREATE POLICY "Users can delete own medicines" 
ON public.medicines 
FOR DELETE 
TO authenticated
USING (elder_id = auth.uid());
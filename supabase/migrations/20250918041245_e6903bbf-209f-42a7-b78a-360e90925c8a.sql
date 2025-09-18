-- Fix critical care requests privacy issue: Restrict access to care_requests table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view all care requests" ON public.care_requests;
DROP POLICY IF EXISTS "Users can create care requests" ON public.care_requests;
DROP POLICY IF EXISTS "Users can update care requests" ON public.care_requests;
DROP POLICY IF EXISTS "Users can delete care requests" ON public.care_requests;

-- Create secure RLS policies for care_requests table
-- Users can only view care requests where they are the elder or assigned caregiver
CREATE POLICY "Users can view own care requests" 
ON public.care_requests 
FOR SELECT 
TO authenticated
USING (elder_id = auth.uid() OR caregiver_id = auth.uid());

-- Users can only create care requests for themselves as elders
CREATE POLICY "Users can create own care requests" 
ON public.care_requests 
FOR INSERT 
TO authenticated
WITH CHECK (elder_id = auth.uid());

-- Users can only update care requests where they are the elder or assigned caregiver
CREATE POLICY "Users can update own care requests" 
ON public.care_requests 
FOR UPDATE 
TO authenticated
USING (elder_id = auth.uid() OR caregiver_id = auth.uid());

-- Users can only delete care requests where they are the elder or assigned caregiver
CREATE POLICY "Users can delete own care requests" 
ON public.care_requests 
FOR DELETE 
TO authenticated
USING (elder_id = auth.uid() OR caregiver_id = auth.uid());
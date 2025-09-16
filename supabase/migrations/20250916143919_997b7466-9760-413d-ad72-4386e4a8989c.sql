-- Enable Row Level Security on all tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments table
CREATE POLICY "Users can view all appointments" 
ON public.appointments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update appointments" 
ON public.appointments 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (true);

-- Create RLS policies for care_requests table
CREATE POLICY "Users can view all care requests" 
ON public.care_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create care requests" 
ON public.care_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update care requests" 
ON public.care_requests 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete care requests" 
ON public.care_requests 
FOR DELETE 
USING (true);

-- Create RLS policies for medicines table
CREATE POLICY "Users can view all medicines" 
ON public.medicines 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create medicines" 
ON public.medicines 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update medicines" 
ON public.medicines 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete medicines" 
ON public.medicines 
FOR DELETE 
USING (true);

-- Create RLS policies for notifications table
CREATE POLICY "Users can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update notifications" 
ON public.notifications 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete notifications" 
ON public.notifications 
FOR DELETE 
USING (true);

-- Create RLS policies for users table
CREATE POLICY "Users can view all users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create users" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update users" 
ON public.users 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete users" 
ON public.users 
FOR DELETE 
USING (true);
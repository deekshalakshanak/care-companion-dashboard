-- Add latitude and longitude columns to appointments table
ALTER TABLE public.appointments 
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision;
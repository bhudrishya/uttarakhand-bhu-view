-- Add user_type column to profiles table
ALTER TABLE public.profiles
ADD COLUMN user_type TEXT NOT NULL DEFAULT 'buyer';

-- Add constraint to ensure valid user types
ALTER TABLE public.profiles
ADD CONSTRAINT valid_user_type CHECK (user_type IN ('buyer', 'seller', 'government_official', 'other'));
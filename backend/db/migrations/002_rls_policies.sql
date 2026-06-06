-- 002_rls_policies.sql

-- PROFILES POLICIES
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING ( auth.uid() = id );

-- EVENTS POLICIES
-- Allow everyone to read published events
CREATE POLICY "Anyone can view published events" 
ON public.events 
FOR SELECT 
USING ( is_published = true );

-- Allow users to view events they own
CREATE POLICY "Users can view own events" 
ON public.events 
FOR SELECT 
USING ( auth.uid() = owner_id );

-- Allow users to insert events (they must be the owner)
CREATE POLICY "Users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK ( auth.uid() = owner_id );

-- Allow users to update events they own
CREATE POLICY "Users can update own events" 
ON public.events 
FOR UPDATE 
USING ( auth.uid() = owner_id );

-- ShiftSync Edge-Case Architecture Schema

-- Create custom types for enums
CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'student');
CREATE TYPE class_type AS ENUM ('Theory', 'Practical');

-- 1. Institutions Table (Global Constraints)
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    days_active JSONB NOT NULL DEFAULT '["Mon", "Tue", "Wed", "Thu", "Fri"]'::jsonb,
    time_slots JSONB NOT NULL DEFAULT '[8, 9, 10, 11, 12, 13, 14, 15, 16, 17]'::jsonb,
    lunch_slot INTEGER DEFAULT 13,
    max_continuous_lectures INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'faculty',
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to create a profile automatically when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 'faculty');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Faculty Settings Table (Edge case constraints like blocked slots and shifts)
CREATE TABLE faculty_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    max_load_hrs INTEGER NOT NULL,
    shift_hours JSONB NOT NULL DEFAULT '[8, 9, 10, 11, 12, 13, 14, 15]'::jsonb, -- Array of integers
    blocked_slots JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of objects e.g. [{"day": "Mon", "time": 8}]
    class_teacher_for TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Rooms Table (Infrastructure configuration with tags)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings e.g. ["Projector", "Linux_Lab"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Workloads Table (The actual class events to be mapped by the AI)
CREATE TABLE workloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES faculty_settings(id) ON DELETE CASCADE NOT NULL,
    subject_code TEXT NOT NULL,
    type class_type NOT NULL,
    target_groups JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of division strings e.g. ["Div_A", "Div_B"]
    weekly_hours INTEGER NOT NULL,
    consecutive_hours INTEGER NOT NULL DEFAULT 1,
    required_tags JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings e.g. ["Projector"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Generated Timetables Table (Holds the Python Output Matrix)
CREATE TABLE generated_timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    matrix_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE workloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_timetables ENABLE ROW LEVEL SECURITY;

-- For rapid development, allow open read/write to Authenticated users
CREATE POLICY "Allow full access to auth users" ON institutions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to auth users" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to auth users" ON faculty_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to auth users" ON rooms FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to auth users" ON workloads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to auth users" ON generated_timetables FOR ALL TO authenticated USING (true);

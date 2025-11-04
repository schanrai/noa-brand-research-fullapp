# Step 10: Minimal User Profiles Foundation (Phased Implementation)

**Date**: November 3, 2025  
**Implementation Time**: 1-2 hours (phased with testing)  
**Approach**: Option 2 - Minimal Foundation (4 columns only)

---

## 📋 Overview

This is a **minimal, extensible foundation** for user profiles:
- ✅ Everyone on free tier for launch
- ✅ No billing complexity now
- ✅ Easy to add billing columns later (just ALTER TABLE)
- ✅ Foundation for preferences, settings, avatars

**What We're Building:**
- `user_profiles` table with 4 columns: id, email, created_at, updated_at
- Row Level Security policies
- Automatic profile creation on signup
- Testing at each phase

**What We're NOT Building (Yet):**
- ❌ No subscription_tier column
- ❌ No usage tracking
- ❌ No billing logic
- ❌ No payment integration

---

## 🎯 Phased Implementation

### Phase 1: Create Table Structure (15 min)
Create the basic user_profiles table and test it works.

### Phase 2: Add RLS Policies (20 min)
Secure the table so users can only access their own data.

### Phase 3: Auto-Creation Trigger (25 min)
Automatically create profiles when users sign up.

### Phase 4: Integration & Testing (30 min)
Full end-to-end testing and optional UI updates.

**Total Time**: ~90 minutes with testing

---

## 🔧 Phase 1: Create Table Structure

### SQL to Execute

Open Supabase Dashboard → SQL Editor → New Query, then run:

```sql
-- Create minimal user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on profile changes
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### ✅ Phase 1 Testing

**Test 1: Verify Table Exists**
```sql
-- Run in SQL Editor
SELECT * FROM user_profiles;
```
**Expected**: Empty result (no rows yet), no errors

**Test 2: Manual Insert (as admin)**
```sql
-- Insert a test profile (use your actual user ID from auth.users)
-- First, get your user ID:
SELECT id, email FROM auth.users LIMIT 1;

-- Then insert (replace UUID with your actual ID):
INSERT INTO user_profiles (id, email)
VALUES ('1b3f35d8-9d26-4149-8875-c5b702984ad3', 's@numbersonly.co');

-- Verify insert worked:
SELECT * FROM user_profiles;
```
**Expected**: See your test profile with created_at and updated_at timestamps

**Test 3: Update Timestamp Trigger**
```sql
-- Update the profile
UPDATE user_profiles 
SET email = 'updated@example.com' 
WHERE id = 'your-user-id-here';

-- Check updated_at changed:
SELECT id, email, created_at, updated_at FROM user_profiles;
```
**Expected**: `updated_at` should be newer than `created_at`

**✓ Phase 1 Complete When:**
- [Y] Table exists with 4 columns
- [Y] Can insert test data
- [Y] updated_at trigger works
- [Y] No SQL errors

---

## 🔒 Phase 2: Add Row Level Security (RLS)

### Why RLS?
Prevents users from seeing or modifying other users' profiles. Each user can only access their own data.

### SQL to Execute

```sql
-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Policy 3: System can insert profiles (for auto-creation)
CREATE POLICY "System can insert profiles"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

### ✅ Phase 2 Testing

**Test 1: Verify RLS is Enabled**
```sql
-- Run in SQL Editor (as admin)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';
```
**Expected**: `rowsecurity` = `true`

**Test 2: Test User Can Read Own Profile**

1. Sign in to your app at `http://localhost:3000/login`
2. Open browser DevTools → Console
3. Run this in console:
```javascript
// Fetch your own profile
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .single();

console.log('Profile:', data);
console.log('Error:', error);
```
**Expected**: See your profile data, no error

**Test 3: Test User Cannot Read Other Profiles**
```sql
-- In SQL Editor, get another user's ID (if you have multiple users)
SELECT id FROM auth.users WHERE id != 'your-user-id' LIMIT 1;
```
Then in browser console (while signed in as different user):
```javascript
// Try to read another user's profile
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', 'other-user-id-here')
  .single();

console.log('Should be empty:', data);
```
**Expected**: `data` is null (RLS blocked access)

**Test 4: Test Update Own Profile**
```javascript
// Update your own profile
const { data, error } = await supabase
  .from('user_profiles')
  .update({ email: 'newemail@example.com' })
  .eq('id', 'your-user-id')
  .select();

console.log('Updated:', data);
```
**Expected**: Profile updated successfully

**✓ Phase 2 Complete When:**
- [Y] RLS is enabled
- [Y] Can read own profile via client
- [Y] Cannot read other users' profiles
- [Y] Can update own profile
- [Y] All 3 policies created

---

## 🤖 Phase 3: Automatic Profile Creation

### Why Auto-Creation?
When users sign up (Google OAuth or email), automatically create their profile row. No manual work needed.

### SQL to Execute

```sql
-- Create function that runs when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### ✅ Phase 3 Testing

**Test 1: Verify Trigger Exists**
```sql
-- Check trigger is created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```
**Expected**: Shows trigger on auth.users table

**Test 2: Sign Up New Test User**

1. **Sign out** from your app (if logged in)
2. Go to `http://localhost:3000/login`
3. Click "Sign up" 
4. Create a new account with test email: `testuser+123@example.com`
5. Complete signup

**Test 3: Verify Profile Was Created**
```sql
-- In SQL Editor, check the new user has a profile
SELECT 
  u.id,
  u.email as auth_email,
  p.email as profile_email,
  p.created_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'testuser+123@example.com';
```
**Expected**: See both auth.users row AND user_profiles row with same ID

**Test 4: Test with Google OAuth (if configured)**
1. Sign out
2. Click "Continue with Google"
3. Complete OAuth flow
4. Check SQL:
```sql
-- Find the Google user
SELECT 
  u.id,
  u.email,
  p.email as profile_email,
  p.created_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'your-google-email@gmail.com';
```
**Expected**: Profile created automatically for Google user too

**✓ Phase 3 Complete When:**
- [ ] Trigger function created
- [ ] Trigger attached to auth.users
- [ ] New email signup creates profile automatically
- [ ] Google OAuth signup creates profile automatically
- [ ] Profile email matches auth email

---

## 🧪 Phase 4: Integration & End-to-End Testing

### Full System Test

**Test Scenario 1: Complete New User Flow**
1. Sign out completely
2. Sign up with `newuser+test@example.com`
3. Verify redirect to dashboard
4. Go to Profile page (`/profile`)
5. Verify email displays correctly
6. Check "Account Created" date shows

**Test Scenario 2: Existing User Login**
1. Sign out
2. Sign in with existing account
3. Go to Profile page
4. Verify data loads correctly
5. No errors in console

**Test Scenario 3: Cross-User Privacy**
1. Sign up User A
2. Note User A's ID from database
3. Sign out
4. Sign up User B
5. Verify User B cannot see User A's profile

### SQL Verification Queries

```sql
-- Check all profiles match auth users
SELECT 
  COUNT(*) as auth_users,
  (SELECT COUNT(*) FROM user_profiles) as profiles
FROM auth.users;
-- Should match (every auth user has a profile)

-- Check for orphaned profiles (shouldn't exist due to foreign key)
SELECT p.*
FROM user_profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;
-- Should be empty

-- Check RLS is working (run as authenticated user)
SELECT COUNT(*) FROM user_profiles;
-- Should return 1 (only your profile)
```

### Optional: Update Profile Page to Use Database

**File**: `app/profile/page.tsx`

Add this to fetch from user_profiles table:

```typescript
// After the existing code, add this function
const fetchUserProfile = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Profile fetch error:', error)
    return null
  }
  return data
}

// In the component, use created_at from database:
// Replace the existing formatDate(user.created_at) with:
// formatDate(profileData?.created_at || user.created_at)
```

**This is optional** - the page already shows account info from `auth.users`. You can use `user_profiles` for additional fields later.

---

## ✅ Success Criteria

### All Phases Complete When:
- [ ] user_profiles table exists with 4 columns (id, email, created_at, updated_at)
- [ ] RLS is enabled and policies protect user data
- [ ] New signups automatically create profiles
- [ ] Existing auth users can access their profile
- [ ] Users cannot access other users' profiles
- [ ] No errors in Supabase logs
- [ ] Profile page displays correct data

---

## 🔮 Future: Adding Billing (When Ready)

### How to Add Billing Columns Later

**Step 1: Add Columns (5 minutes)**
```sql
-- Add subscription tier
ALTER TABLE user_profiles 
ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise'));

-- Add usage tracking
ALTER TABLE user_profiles 
ADD COLUMN usage_count INTEGER DEFAULT 0;

ALTER TABLE user_profiles 
ADD COLUMN usage_limit INTEGER;
```

**Step 2: Update RLS Policies (if needed)**
No changes needed - existing policies cover new columns.

**Step 3: Build Billing UI**
- Add "Upgrade" button in Settings
- Show usage stats
- Integrate payment provider (Stripe, etc.)

**Benefits of This Approach:**
- ✅ No data migration needed (all existing users get 'free' default)
- ✅ No code breaks (new columns are additive)
- ✅ Can test billing with new users first
- ✅ Takes 5 minutes to add columns when ready

---

## 📁 Files Reference

**Supabase Setup:**
- `lib/supabase/client.ts` - Client-side Supabase instance
- `lib/supabase/server.ts` - Server-side Supabase instance
- `.env.local` - Supabase credentials

**Auth Integration:**
- `components/auth-provider.tsx` - Auth context with user state
- `app/profile/page.tsx` - Profile page (can show created_at from DB)
- `app/settings/page.tsx` - Settings page (future billing UI)

**Previous Steps:**
- `notes/step9-user-profile-sign-out.md` - User menu, sign out

---

## 🐛 Troubleshooting

### Issue: Profile Not Created on Signup
**Symptoms**: New user signs up but no row in user_profiles

**Fix**:
```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- If missing, re-run Phase 3 SQL
```

### Issue: RLS Blocking My Access
**Symptoms**: Can't read own profile, get empty results

**Fix**:
```sql
-- Verify you're authenticated
SELECT auth.uid(); -- Should return your user ID, not NULL

-- Check policy exists
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- If auth.uid() returns NULL, you're not properly authenticated
```

### Issue: Email Not Populated in Profile
**Symptoms**: Profile created but email is NULL

**Fix**:
```sql
-- Update existing profiles
UPDATE user_profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;
```

### Issue: updated_at Not Changing
**Symptoms**: updated_at stays the same after updates

**Fix**:
```sql
-- Re-create the trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎉 Summary

You've now established a **clean, minimal foundation** for user profiles:

### What You Built:
✅ user_profiles table (4 columns only)  
✅ Automatic profile creation on signup  
✅ Row Level Security protecting user data  
✅ Tested at each phase

### What You Avoided:
❌ Complex billing schema  
❌ Unused columns sitting empty  
❌ Premature optimization

### What You Gained:
✅ 1-2 hours setup time  
✅ Foundation for preferences, settings, avatars  
✅ Clean migration path to billing (just ALTER TABLE)  
✅ Production-ready security

**Ship with confidence!** 🚀

When you're ready for billing, it's a 5-minute ALTER TABLE + UI work. No data migration, no breaking changes.

---

## 📝 Phase Completion Checklist

- [ ] **Phase 1**: Table created, manual insert works, trigger works
- [ ] **Phase 2**: RLS enabled, policies tested, privacy verified
- [ ] **Phase 3**: Trigger created, auto-creation tested with signup
- [ ] **Phase 4**: Full end-to-end testing passed, no errors

**All phases complete = Ready to ship!** ✅


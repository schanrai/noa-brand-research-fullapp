# Supabase Authentication Testing Guide

## ✅ Steps 1-4 Implementation Complete

### What We've Done:
- ✅ Installed `@supabase/supabase-js` and `@supabase/ssr`
- ✅ Added environment variables to `.env.local` (placeholders)
- ✅ Created Supabase client utilities:
  - `lib/supabase/client.ts` (client-side)
  - `lib/supabase/server.ts` (server-side)
  - `lib/supabase/middleware.ts` (middleware helper)
- ✅ Added test component for connection verification

---

## 🧪 Testing Steps 1-4

### Prerequisites:
Before testing, you need to complete **Step 1** manually:

1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Create new project (name: "noa-brand-research" or similar)
   - Wait ~2 minutes for provisioning

2. **Get Credentials**:
   - Go to **Settings** → **API**
   - Copy these values:
     - `Project URL`
     - `anon public` key
     - `service_role` key

3. **Update `.env.local`**:
   Replace the placeholder values with your actual credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Restart Dev Server**:
   ```bash
   # Stop current server (Ctrl+C if running)
   npm run dev
   ```

---

### Test Procedure:

#### Test 1: Client Initialization
1. Open browser to `http://localhost:3000`
2. Look for **green notification** in bottom-right corner
3. Expected: "✅ Supabase connected! Check console for details."
4. If you see red error, check console for details

#### Test 2: Browser Console Verification
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Look for these messages:
   ```
   ✅ Supabase client created successfully
   Project URL: https://xxxxx.supabase.co
   Anon key (first 20 chars): eyJhbGciOiJIUzI1NiIsI...
   ✅ Supabase auth session check successful
   Current session: Not logged in
   ```

#### Test 3: Network Tab Check
1. In DevTools, go to **Network** tab
2. Look for requests to `supabase.co` domain
3. Should see auth-related requests (may show 401 - that's ok!)
4. No CORS errors should appear

#### Test 4: React DevTools (Optional)
1. Install React DevTools extension if you don't have it
2. Open Components tab
3. Search for `SupabaseConnectionTest`
4. Check component state shows `status: "connected"`

---

### ✅ Success Criteria:
- [ ] Green notification appears
- [ ] Console shows "✅ Supabase client created successfully"
- [ ] Console shows "✅ Supabase auth session check successful"
- [ ] No errors in console (warnings are ok)
- [ ] No CORS errors in Network tab

### ❌ Common Issues:

**Issue**: Red error notification appears
- **Fix**: Check `.env.local` has correct values
- **Fix**: Restart dev server after updating env vars
- **Fix**: Verify Supabase project is fully provisioned

**Issue**: "Invalid API key" error
- **Fix**: Make sure you copied the `anon public` key, not the `service_role` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Issue**: CORS errors
- **Fix**: Verify URL format (must start with https://)
- **Fix**: Check Supabase project settings

**Issue**: Nothing happens / no notification
- **Fix**: Clear browser cache
- **Fix**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

---

### After Successful Testing:

Once all tests pass, we'll proceed to **Step 5** (Auth Provider) and **Step 6** (Login UI).

### Cleanup:
After testing, we'll remove the `SupabaseConnectionTest` component from `app/page.tsx`.

---

## Next Steps (After Testing):
1. Build Auth Context & Provider
2. Create Login Page UI
3. Implement middleware for route protection
4. Add user menu to navigation

---

**Git Checkpoint Command** (after successful testing):
```bash
git add .
git commit -m "feat: add Supabase auth setup (steps 1-4)"
```


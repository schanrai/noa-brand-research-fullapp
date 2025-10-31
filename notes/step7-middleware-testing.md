# Step 7: Middleware for Route Protection - Testing Guide

## ✅ What We've Implemented:

1. **Root Middleware** (`middleware.ts`):
   - Uses the `updateSession` helper from `lib/supabase/middleware.ts`
   - Protects all app routes automatically
   - Redirects unauthenticated users to `/login`
   - Allows public access to `/login` and `/auth/callback` routes
   - Excludes static files and images from protection

2. **Route Matcher Configuration**:
   - Matches all routes except Next.js internals and static assets
   - Ensures auth check runs on every protected page

---

## 🧪 Testing Step 7

### Prerequisites:
- Dev server running (`npm run dev`)
- You should have the login page visible at `http://localhost:3000/login`
- Supabase credentials configured in `.env.local`

---

### Test 1: Unauthenticated Redirect

**Goal**: Verify that unauthenticated users are redirected to login

**Steps**:
1. Open an **incognito/private browser window** (to ensure no existing session)
2. Navigate to `http://localhost:3000/`
3. **Expected Result**: 
   - Should immediately redirect to `http://localhost:3000/login`
   - URL bar should show `/login`
   - Login page should be displayed

**What to check**:
- [ ] Redirect happens automatically
- [ ] No flash of the main app content
- [ ] Login page renders correctly

---

### Test 2: Login Page Accessible

**Goal**: Verify that the login page itself doesn't redirect

**Steps**:
1. In the same incognito window
2. Navigate directly to `http://localhost:3000/login`
3. **Expected Result**:
   - Should stay on `/login` (no redirect)
   - Login page displays normally
   - Google OAuth button visible
   - Email/password form visible

**What to check**:
- [ ] No redirect loop
- [ ] Page loads completely
- [ ] All UI elements present

---

### Test 3: Network Tab Verification

**Goal**: Verify the redirect mechanism

**Steps**:
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Network** tab
3. Clear network log
4. In incognito window, navigate to `http://localhost:3000/`
5. **Expected Result**:
   - Should see a 307 or 302 redirect response
   - From `/` to `/login`

**What to check**:
- [ ] HTTP redirect status code (307/302)
- [ ] Redirect target is `/login`
- [ ] No errors in console

---

### Test 4: Protected Routes

**Goal**: Verify all main app routes are protected

**Steps**:
1. In incognito window, try accessing various routes:
   - `http://localhost:3000/`
   - `http://localhost:3000/settings` (if exists)
   - Any other app route

2. **Expected Result**:
   - All should redirect to `/login`
   - None should be accessible without authentication

**What to check**:
- [ ] All app routes redirect to login
- [ ] No content visible before redirect

---

### Test 5: Static Assets Not Protected

**Goal**: Verify that images and static files are accessible

**Steps**:
1. In incognito window, try accessing:
   - `http://localhost:3000/Scova_Logo_Crop.png`
   - Other public images

2. **Expected Result**:
   - Images should load directly
   - No redirect to login page

**What to check**:
- [ ] Static files accessible
- [ ] Logo displays on login page

---

### Test 6: Console Check

**Goal**: Verify no errors in middleware execution

**Steps**:
1. Open browser console (F12)
2. Navigate around the app while unauthenticated
3. **Expected Result**:
   - No middleware errors
   - May see auth-related logs (that's ok)
   - No red error messages

**What to check**:
- [ ] No JavaScript errors
- [ ] No network errors (4xx/5xx)
- [ ] Clean console output

---

## ✅ Success Criteria:

- [x] Middleware file created at root
- [ x] Unauthenticated users redirected to `/login`
- [x ] Login page remains accessible (no redirect loop)
- [ x] Main app routes protected
- [ x] Static assets not affected
- [ ]x No console errors
- [ x] Redirects happen quickly (no flash of content)

---

## ❌ Common Issues:

### Issue: Redirect loop (keeps redirecting)
**Symptoms**: Browser shows "too many redirects" error
**Cause**: Middleware redirecting `/login` page itself
**Fix**: Check that `/login` is excluded in the middleware logic

### Issue: Static files not loading
**Symptoms**: Logo doesn't appear on login page
**Cause**: Matcher pattern too aggressive
**Fix**: Verify `config.matcher` excludes image files

### Issue: No redirect happening
**Symptoms**: Can access main app without logging in
**Cause**: Middleware not running or env vars not set
**Fix**: 
- Restart dev server
- Check `.env.local` has correct Supabase credentials
- Verify middleware.ts is at root (not in a subfolder)

### Issue: Auth callback breaks
**Symptoms**: OAuth fails after Google consent
**Cause**: `/auth/callback` being protected
**Fix**: Middleware should allow `/auth/*` routes (already handled in updateSession)

---

## Next Steps (After Testing):

Once Step 7 testing passes, you'll implement:
- **Step 8**: Auth callback handler (`app/auth/callback/route.ts`)
- **Step 9**: User menu in navigation with sign out

---

## Git Checkpoint:
```bash
git add middleware.ts
git commit -m "feat: add route protection middleware (step 7)"
```

---

## Notes:

- The middleware runs on **every request** to protected routes
- It checks the Supabase session using cookies
- If no valid session → redirect to `/login`
- If valid session → allow access to protected content
- The actual user authentication (Google OAuth, email/password) will work fully after Step 8


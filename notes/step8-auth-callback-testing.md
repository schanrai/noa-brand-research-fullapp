# Step 8: Auth Callback Handler - Testing Guide

## ✅ What We've Implemented:

1. **Auth Callback Route** (`app/auth/callback/route.ts`):
   - Handles OAuth redirect from Google
   - Exchanges authorization code for session
   - Sets session cookies automatically
   - Redirects to main app on success
   - Redirects to login with error on failure

2. **Error Handling**:
   - Catches auth errors
   - Logs errors to console (server-side)
   - Redirects to login with error parameter

---

## 🧪 Testing Step 8

### Prerequisites:
- Steps 1-7 completed and tested ✅
- Dev server running (`npm run dev`)
- Supabase project created with credentials in `.env.local`
- **Google OAuth configured in Supabase** (required for this test)

---

## ⚠️ Before Testing: Configure Google OAuth

If you haven't set up Google OAuth yet, you need to do this first:

### 1. Set up Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - Your production domain (later)
7. Add Authorized redirect URIs:
   - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
8. Save and copy **Client ID** and **Client Secret**

### 2. Configure in Supabase:
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Click on **Google**
4. Toggle **Google Enabled** to ON
5. Paste your **Client ID** and **Client Secret**
6. Save

---

## Test 1: Google OAuth Flow (End-to-End)

**Goal**: Test the complete Google sign-in flow

**Steps**:
1. Open an **incognito/private browser window**
2. Navigate to `http://localhost:3000/login`
3. Click the **"Continue with Google"** button
4. **Expected**: Browser redirects to Google OAuth consent screen

5. On Google consent screen:
   - Select your Google account
   - Grant permissions
   - Click "Allow" or "Continue"

6. **Expected**: 
   - Browser redirects back to `http://localhost:3000/auth/callback?code=...`
   - Then immediately redirects to `http://localhost:3000/`
   - You should see the **main app** (not login page)
   - URL should be just `http://localhost:3000/`

**What to check**:
- [ ] Redirects to Google
- [ ] Google consent screen appears
- [ ] Returns to your app
- [ ] Shows main app (not login page)
- [ ] No errors in console

---

## Test 2: Email/Password Sign Up

**Goal**: Test email/password account creation

**Steps**:
1. In incognito window, go to `http://localhost:3000/login`
2. Click "Don't have an account? **Sign up**"
3. Enter email: `test@example.com`
4. Enter password: `testpassword123`
5. Click "Sign up" button

6. **Expected**:
   - Message: "Check your email to confirm your account!"
   - Check the email inbox for confirmation email
   - Click confirmation link in email
   - Should redirect back to app and be logged in

**What to check**:
- [ ] Sign up form works
- [ ] Success message appears
- [ ] Confirmation email received
- [ ] Email link works
- [ ] Can access main app after confirmation

---

## Test 3: Email/Password Sign In

**Goal**: Test email/password login (with existing account)

**Steps**:
1. Use the account created in Test 2 (or create one first)
2. In incognito window, go to `http://localhost:3000/login`
3. Enter your email
4. Enter your password
5. Click "Sign in" button

6. **Expected**:
   - Immediately redirects to `http://localhost:3000/`
   - Shows main app
   - No login page visible

**What to check**:
- [ ] Login works
- [ ] Redirects to main app
- [ ] No errors
- [ ] Session persists (refresh page stays logged in)

---

## Test 4: Session Persistence

**Goal**: Verify session cookies work correctly

**Steps**:
1. Log in using any method (from Tests 1-3)
2. Verify you can see the main app
3. **Refresh the page** (F5 or Cmd+R)
4. **Expected**: Still logged in, shows main app

5. **Close the browser tab**
6. Open a new tab to `http://localhost:3000/`
7. **Expected**: Still logged in (session persists)

**What to check**:
- [ ] Session persists after refresh
- [ ] Session persists after closing tab
- [ ] Cookies are set correctly

---

## Test 5: Callback Error Handling

**Goal**: Verify error handling in callback

**Steps**:
1. Manually navigate to: `http://localhost:3000/auth/callback`
   (without a code parameter)
2. **Expected**: Redirects to `http://localhost:3000/`

3. Try with invalid code:
   `http://localhost:3000/auth/callback?code=invalid_code_12345`
4. **Expected**: 
   - Logs error to server console
   - Redirects to `/login?error=auth_failed`

**What to check**:
- [ ] No crashes
- [ ] Graceful error handling
- [ ] Appropriate redirects

---

## Test 6: Network Tab Inspection

**Goal**: Verify the OAuth callback flow

**Steps**:
1. Open DevTools → **Network** tab
2. Start a Google OAuth login
3. Watch the network requests

**Expected flow**:
```
1. POST to Google OAuth → 302 redirect
2. GET /auth/callback?code=... → 302 redirect  
3. GET / → 200 (main app loads)
```

**What to check**:
- [ ] See callback route called
- [ ] Code parameter present
- [ ] Redirects happen
- [ ] Cookies set (check Application tab)

---

## Test 7: Browser Cookies

**Goal**: Verify Supabase session cookies

**Steps**:
1. Log in successfully
2. Open DevTools → **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Go to **Cookies** → `http://localhost:3000`

**Expected cookies**:
- `sb-[project-ref]-auth-token`
- `sb-[project-ref]-auth-token.0`
- `sb-[project-ref]-auth-token.1`

**What to check**:
- [ ] Supabase cookies present
- [ ] Not expired
- [ ] HttpOnly flag set (security)

---

## ✅ Success Criteria:

- [ ] Google OAuth login works end-to-end
- [ ] Email/password sign up works
- [ ] Email/password sign in works
- [ ] Session persists after refresh
- [ ] Callback handles errors gracefully
- [ ] Cookies set correctly
- [ ] No console errors during auth flow
- [ ] Can access main app after login

---

## ❌ Common Issues:

### Issue: "Error 400: redirect_uri_mismatch"
**Cause**: Google OAuth redirect URI not configured correctly
**Fix**: 
- In Google Cloud Console, add exact Supabase callback URL
- Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- Must match exactly (no trailing slash)

### Issue: Stuck on callback URL
**Cause**: Callback route not working
**Fix**:
- Check server console for errors
- Verify `app/auth/callback/route.ts` exists
- Restart dev server

### Issue: "Invalid login credentials"
**Cause**: Wrong email/password or account doesn't exist
**Fix**:
- Sign up first, then sign in
- Check email for confirmation link
- Verify email is confirmed in Supabase dashboard

### Issue: Redirects back to login after OAuth
**Cause**: Session not being set
**Fix**:
- Check server console for errors
- Verify `.env.local` has correct Supabase keys
- Clear cookies and try again

### Issue: Confirmation email not received
**Cause**: Email delivery or Supabase email settings
**Fix**:
- Check spam folder
- In Supabase dashboard, go to Authentication → Email Templates
- For development, check the "Auth" logs in Supabase for the confirmation link

---

## Debug Checklist:

If authentication isn't working:

1. **Check server console** (terminal running `npm run dev`):
   - Look for "Auth callback error:" logs
   - Check for any error messages

2. **Check browser console** (F12):
   - Look for JavaScript errors
   - Check network tab for failed requests

3. **Check Supabase dashboard**:
   - Go to Authentication → Users
   - Verify user was created
   - Check email confirmation status

4. **Verify environment variables**:
   - `.env.local` has all Supabase keys
   - Restart dev server after changing env vars

5. **Check cookies**:
   - DevTools → Application → Cookies
   - Verify `sb-*` cookies exist and aren't expired

---

## Next Steps (After Testing):

Once Step 8 testing passes, you'll implement:
- **Step 9**: User menu in top navigation with sign out button
- **Step 10**: Database schema for user profiles and usage tracking

---

## Git Checkpoint:
```bash
git add app/auth/callback/
git commit -m "feat: add OAuth callback handler (step 8)"
```

---

## Notes:

- The callback route runs on the **server** (Route Handler)
- It exchanges the OAuth `code` for a Supabase session
- Sessions are stored in **HTTP-only cookies** (secure)
- Middleware automatically validates these cookies on each request
- After successful auth, users can access the protected main app


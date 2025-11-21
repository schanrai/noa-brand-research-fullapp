# Vercel Deployment & Domain Configuration Guide for scova.io

## Overview
Complete step-by-step guide for deploying your Next.js app to Vercel, connecting your Namecheap domain (scova.io), configuring Google OAuth branding, and setting up Supabase for production use.

## Prerequisites Checklist
- [x] Vercel account
- [x] Namecheap domain: scova.io
- [x] Supabase project created
- [X] Git repository connected to Vercel
- [X] Google Cloud Platform project with OAuth client

---

## Step 1: Prepare Environment Variables

### Required Environment Variables for Vercel
You'll need to add these in Vercel's dashboard under Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mqacaohhpioouvdlvyu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ld1XpIpyQ1iCA6I-R56Yeg_15MWe06Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_aeEucQ4ahUBMIzeIjlGt8Q_RXF_wc4Y
OPENROUTER_API_KEY=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
```

**Important Notes:**
- Never commit `.env.local` to git (already in `.gitignore` ✓)
- Copy values manually from your local `.env.local` to Vercel
- Set these for all environments (Production, Preview, Development)

---

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in

2. **Import Project**
   - Click "Add New Project"
   - Select your Git repository
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Node.js Version: 18.x or higher

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from Step 1
   - Select all environments: Production, Preview, Development
   - Click "Add" for each variable

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Note your Vercel project URL (e.g., `noa-brand-research-fullapp.vercel.app`)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project directory
cd /Users/sushichan/Documents/_WORK/NUMBERS_ONLY/NumbersOnlyBackend/noa-brand-research-fullapp

# Deploy
vercel

# Follow prompts to link project and configure
# Add environment variables via dashboard after deployment
```

**After Deployment:**
- ✅ Note your Vercel project URL
- ✅ Test the deployment at `https://your-project.vercel.app`
- ✅ Check build logs for any errors

---

## Step 3: Configure Google OAuth Branding

### Why This Matters
By default, Google's OAuth dialog shows your Supabase URL instead of your app name. This step fixes that by properly configuring Google Auth Platform branding.

### A) Access Google Auth Platform

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (the one with OAuth credentials)
3. Navigate to **APIs & Services** → **Google Auth Platform**
   - ⚠️ Do NOT use the old "OAuth consent screen" link (it will bounce you back)
   - Use the new Google Auth Platform menu instead

### B) Configure Branding

1. Click **Branding** in the left sidebar
2. Set the following:
   - **App name:** `Scova`
   - **User support email:** `s@numbersonly.co` (or `help@scova.io`)
   - **App logo:** Upload `public/Scova_Logo.png` from your repo
     - Requirements: Square PNG, ≥120×120 pixels
   - **App domain:**
     - Application home page: `https://scova.io` (or temp URL for now)
     - Privacy policy: `https://scova.io/privacy` (or temp URL)
     - Terms of service: `https://scova.io/terms` (or temp URL)
   - **Authorized domains:** 
     - Add `scova.io`
     - Keep `mqacaohhpioouvdlvyu.supabase.co` for now
3. Click **Save**

### C) Configure Audience

1. Click **Audience** in the left sidebar
2. Set:
   - **User type:** External
   - **Publishing status:** Testing (for now)
3. Click **Add Users** under "Test users"
4. Add your email and team members: `s@numbersonly.co`
5. Click **Save**

### D) Update OAuth Client Origins

1. Click **Clients** in the left sidebar
2. Select your **Web client**
3. Edit **Authorized JavaScript origins:**
   - **Development:**
     - `http://localhost:3000`
   - **Production (add after Step 4):**
     - `https://scova.io`
     - `https://www.scova.io` (if using www)
     - `https://your-project.vercel.app` (optional for previews)
   - **Remove:** Any `https://mqacaohhpioouvdlvyu.supabase.co` origin
     - ⚠️ This is key to showing your domain instead of Supabase

4. Edit **Authorized redirect URIs:**
   - Keep: `https://mqacaohhpioouvdlvyu.supabase.co/auth/v1/callback`
   - Add: `http://localhost:3000/auth/callback` (for dev)
   - Add after Step 4: `https://scova.io/auth/callback`

5. Click **Save**

### Expected Result

- **In development:** Dialog shows "Sign in to localhost:3000" with Scova branding
- **In production:** Dialog shows "Sign in to scova.io" with Scova branding ✨
- **No more:** Long Supabase URL in the header

---

## Step 4: Configure Supabase for Production

### Update Supabase Site URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Update **Site URL:**
   - Development: `http://localhost:3000`
   - Production: `https://scova.io` (update after DNS is configured)

### Add Redirect URLs

In the **Redirect URLs** allow-list, add:
- `http://localhost:3000/auth/callback` (keep for local dev)
- `https://scova.io/auth/callback`
- `https://www.scova.io/auth/callback` (if using www)
- `https://your-project.vercel.app/auth/callback` (replace with actual Vercel URL)

### Update OAuth Provider Settings (Google)

1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Verify your Client ID and Client Secret match Google Cloud Console
4. Ensure redirect URIs are consistent with Google Auth Platform

### Test Supabase Connection

```bash
# From your terminal
curl -X GET 'https://mqacaohhpioouvdlvyu.supabase.co/rest/v1/' \
  -H "apikey: sb_publishable_ld1XpIpyQ1iCA6I-R56Yeg_15MWe06Y"
```

Expected: `{"message":"Missing table operation"}` (this is good - means API is accessible)

---

## Step 5: Connect Namecheap Domain (scova.io) to Vercel

### A) In Vercel Dashboard

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `scova.io`
4. Click **Add**
5. (Optional) Add www: `www.scova.io`
6. Vercel will show you DNS records to configure

**Vercel will show:**
```
A Record
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto

CNAME Record (for www)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

### B) In Namecheap

1. **Log into Namecheap**
   - Go to [namecheap.com](https://www.namecheap.com)
   - Sign in to your account

2. **Manage Domain**
   - Go to **Domain List**
   - Click **Manage** next to `scova.io`

3. **Configure DNS**
   - Go to **Advanced DNS** tab
   - Add/modify these records:

**For root domain (scova.io):**
```
Type: A Record
Host: @
Value: 76.76.21.21 (or IP shown in Vercel)
TTL: Automatic
```

**For www subdomain (www.scova.io):**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

4. **Remove conflicting records**
   - Remove any existing A records pointing to different IPs
   - Remove any existing CNAME for @ or www that conflict

5. **Save all changes**

### C) Wait for DNS Propagation

- **Time:** Usually 1-2 hours, can take up to 48 hours
- **Check status in Vercel:** Settings → Domains (will show "Valid Configuration" when ready)
- **Verify DNS propagation:**

```bash
# Check A record
dig scova.io

# Check CNAME record
dig www.scova.io

# Or use online checker
# https://www.whatsmydns.net/#A/scova.io
```

---

## Step 6: Update Google OAuth with Production Domain

**After DNS propagation is complete** and scova.io is working:

1. Go back to Google Cloud Console → Google Auth Platform → Clients
2. Edit your Web client
3. Add to **Authorized JavaScript origins:**
   - `https://scova.io`
   - `https://www.scova.io`
4. Click **Save**
5. Test OAuth flow on production to verify branding

---

## Step 7: Verify Deployment

### Testing Checklist

#### 1. Basic Functionality
- [ ] Visit `https://scova.io`
- [ ] Visit `https://www.scova.io` (if configured)
- [ ] Verify app loads correctly
- [ ] Check browser console for errors (F12)
- [ ] Verify logo and branding appear correctly

#### 2. Authentication Flow
- [ ] Visit `https://scova.io/login`
- [ ] Click "Sign in with Google"
- [ ] Verify OAuth dialog shows:
  - Header: "Sign in to scova.io"
  - App name: "Scova"
  - Your logo appears
- [ ] Complete sign-in
- [ ] Verify redirect to `/auth/callback` works
- [ ] Verify landing on dashboard after auth
- [ ] Test logout functionality
- [ ] Verify session persists across page refreshes

#### 3. Protected Routes
- [ ] Verify `/profile` requires authentication
- [ ] Verify `/settings` requires authentication
- [ ] Verify unauthenticated users redirect to `/login`
- [ ] Test navigation after authentication

#### 4. API Routes
- [ ] Test `/api/llm` endpoint (if accessible)
- [ ] Check Vercel Function logs for errors
- [ ] Verify environment variables are loaded correctly

#### 5. Performance
- [ ] Check Lighthouse score
- [ ] Test page load times
- [ ] Verify images load correctly
- [ ] Test on mobile device

---

## Step 8: Post-Deployment Configuration

### Monitor Deployment

1. **Vercel Dashboard**
   - Go to your project
   - Check **Deployments** for status
   - Review **Logs** for any errors
   - Check **Analytics** for traffic

2. **Set Up Automatic Deployments**
   - Vercel auto-deploys on push to `main` branch
   - Preview deployments for pull requests
   - Configure in Settings → Git

### Update Environment Variables (if needed)

If you need to change any environment variable:
1. Go to Vercel → Settings → Environment Variables
2. Edit the variable
3. Trigger a redeploy (Deployments → ⋯ → Redeploy)

---

## Troubleshooting Common Issues

### Issue: OAuth redirect not working
**Symptoms:** Error after clicking "Continue" in Google dialog

**Solutions:**
- Verify redirect URLs in Supabase match exactly (including `https://`)
- Check Vercel environment variables are set correctly
- Verify Google Auth Platform authorized redirect URIs include Supabase callback
- Check browser console for errors

### Issue: OAuth dialog shows Supabase URL instead of scova.io
**Symptoms:** Dialog header shows "Sign in to mqacaohhpioouvdlvyu.supabase.co"

**Solutions:**
- Remove Supabase URL from Google Auth Platform → Clients → Authorized JavaScript origins
- Keep only your domain and localhost
- The Supabase URL should ONLY be in redirect URIs, not origins
- Clear browser cache and test again

### Issue: Domain not resolving
**Symptoms:** `scova.io` doesn't load or shows DNS error

**Solutions:**
- Wait longer for DNS propagation (up to 48 hours)
- Verify DNS records in Namecheap match Vercel's requirements exactly
- Check Vercel domain status shows "Valid Configuration"
- Use `nslookup scova.io` or `dig scova.io` to check DNS
- Use [whatsmydns.net](https://www.whatsmydns.net) to check global propagation

### Issue: Environment variables not loading
**Symptoms:** App crashes or features don't work

**Solutions:**
- Ensure all `NEXT_PUBLIC_*` vars are set in Vercel
- Verify variable names match exactly (case-sensitive)
- Check for typos in variable names
- Redeploy after adding new environment variables
- Check Vercel build logs for errors
- Test locally first with the same env vars

### Issue: Build fails on Vercel
**Symptoms:** Deployment fails during build

**Solutions:**
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify all dependencies are listed in `package.json`
- Check for TypeScript errors locally: `npm run build`
- Verify Node.js version compatibility
- Check for missing environment variables during build

### Issue: Google says "App is not verified"
**Symptoms:** Warning screen about unverified app

**Solutions:**
- This is normal for apps in "Testing" mode
- Click "Advanced" → "Go to Scova (unsafe)" to proceed
- Add users as "Test users" in Google Auth Platform → Audience
- To remove warning: Submit app for Google verification (takes time)
- For internal use: Keep in Testing mode with limited test users

---

## Files That May Need Updates

### `next.config.ts`
Current config is minimal and should work for most cases.

**May need to add:**
```typescript
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add if using external images
  images: {
    domains: ['mqacaohhpioouvdlvyu.supabase.co'],
  },
};
```

### `middleware.ts`
✅ Already configured correctly for Supabase auth. No changes needed.

### `app/auth/callback/route.ts`
✅ Already handles OAuth callbacks. Ensure Supabase redirect URLs match.

---

## Security Best Practices

1. ✅ **Never commit secrets:** `.env.local` is already gitignored
2. ✅ **Use environment variables:** All secrets in Vercel dashboard
3. ✅ **Service role key:** Only use server-side, never expose to client
4. ✅ **HTTPS only:** Vercel provides SSL automatically
5. ✅ **Domain verification:** Vercel verifies domain ownership
6. ⚠️ **OAuth testing mode:** Keep limited test users until ready for public
7. ✅ **Monitor logs:** Check Vercel and Supabase logs regularly

---

## Optional Enhancements (Post-Launch)

### 1. Custom Auth Domain (Advanced)
Configure `auth.scova.io` for fully branded callback URLs.

**Requires:**
- Supabase Pro plan ($25/month)
- Additional DNS configuration
- Updated redirect URIs in Google

**Benefit:** No `*.supabase.co` visible to users during auth flow

### 2. Error Tracking
Set up error monitoring:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- Vercel Analytics (built-in)

### 3. Google Verification
Submit your app for Google verification to remove "unverified app" warning:
- Required for > 100 users
- Takes 4-6 weeks
- Requires privacy policy, terms of service, and app review

### 4. Custom Error Pages
Create custom 404 and 500 error pages:
- `app/not-found.tsx`
- `app/error.tsx`

---

## Quick Reference: URLs and Endpoints

### Production URLs
- **Main site:** `https://scova.io`
- **WWW:** `https://www.scova.io`
- **Vercel preview:** `https://noa-brand-research-fullapp.vercel.app`

### Supabase
- **Project URL:** `https://mqacaohhpioouvdlvyu.supabase.co`
- **Auth callback:** `https://mqacaohhpioouvdlvyu.supabase.co/auth/v1/callback`

### OAuth Callbacks
- **Development:** `http://localhost:3000/auth/callback`
- **Production:** `https://scova.io/auth/callback`

### Important Dashboards
- **Vercel:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Supabase:** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Google Cloud:** [console.cloud.google.com](https://console.cloud.google.com)
- **Namecheap:** [namecheap.com](https://www.namecheap.com)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables documented
- [ ] `.env.local` is gitignored
- [ ] App tested locally with production-like config
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in development

### During Deployment
- [ ] Git repository connected to Vercel
- [ ] All environment variables added to Vercel
- [ ] First deployment successful
- [ ] Deployment URL working
- [ ] Build logs checked for warnings

### Post-Deployment
- [ ] DNS records configured in Namecheap
- [ ] Domain connected in Vercel
- [ ] SSL certificate provisioned (automatic)
- [ ] Google OAuth branding configured
- [ ] Supabase redirect URLs updated
- [ ] All authentication flows tested
- [ ] Protected routes verified
- [ ] API endpoints tested
- [ ] Monitoring set up

---

## Next Steps After Successful Deployment

1. ✅ Test all authentication flows end-to-end
2. ✅ Verify database connections work in production
3. ✅ Test API endpoints with production data
4. 📊 Monitor Vercel analytics for errors
5. 📧 Set up email notifications for deployment failures
6. 🎯 Add team members as test users in Google OAuth
7. 📱 Test on mobile devices
8. 🚀 Plan for scaling (if needed)

---

## Support & Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Google OAuth Docs:** [developers.google.com/identity](https://developers.google.com/identity)

---

**Last Updated:** November 21, 2025  
**Version:** 1.0  
**Domain:** scova.io  
**Vercel Project:** noa-brand-research-fullapp


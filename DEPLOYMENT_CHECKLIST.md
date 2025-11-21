# Quick Deployment Checklist for scova.io

## Pre-Flight Check
- [ ] Local build succeeds: `npm run build`
- [ ] No console errors in dev
- [ ] Git repo has latest changes committed
- [ ] `.env.local` is in `.gitignore`

---

## Step 1: Vercel Setup (15 min)

- [ ] Sign in to [vercel.com](https://vercel.com)
- [ ] Import Git repository
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `OPENROUTER_API_KEY`
- [ ] Deploy and note Vercel URL: `_____________________.vercel.app`
- [ ] Test deployment at Vercel URL

---

## Step 2: Google OAuth Branding (20 min)

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Navigate to **APIs & Services** → **Google Auth Platform**

### Branding
- [ ] Set App name: `Scova`
- [ ] Set Support email: `s@numbersonly.co`
- [ ] Upload logo: `public/Scova_Logo.png`
- [ ] Add authorized domain: `scova.io`
- [ ] Save

### Audience
- [ ] Set User type: **External**
- [ ] Set Status: **Testing**
- [ ] Add test user: `s@numbersonly.co`
- [ ] Save

### Clients → Web Client
- [ ] Edit **Authorized JavaScript origins:**
  - [ ] Keep: `http://localhost:3000`
  - [ ] **REMOVE:** Any `*.supabase.co` origin ⚠️
  - [ ] (Add later): `https://scova.io`
- [ ] Edit **Authorized redirect URIs:**
  - [ ] Keep: `https://mqacaohhpioouvdlvyu.supabase.co/auth/v1/callback`
  - [ ] Keep: `http://localhost:3000/auth/callback`
  - [ ] (Add later): `https://scova.io/auth/callback`
- [ ] Save

---

## Step 3: Supabase Config (10 min)

- [ ] Go to [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] **Authentication** → **URL Configuration**
- [ ] Update **Site URL**: Will be `https://scova.io` (after DNS)
- [ ] Add **Redirect URLs:**
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `https://scova.io/auth/callback`
  - [ ] `https://www.scova.io/auth/callback`
  - [ ] `https://_____.vercel.app/auth/callback` (your Vercel URL)

---

## Step 4: Domain Setup (30 min + propagation time)

### In Vercel
- [ ] Go to Settings → **Domains**
- [ ] Add domain: `scova.io`
- [ ] Add domain: `www.scova.io` (optional)
- [ ] Note DNS records shown

### In Namecheap
- [ ] Log in to [namecheap.com](https://namecheap.com)
- [ ] Manage domain: `scova.io`
- [ ] Go to **Advanced DNS** tab
- [ ] Add **A Record**:
  - Host: `@`
  - Value: `76.76.21.21` (or from Vercel)
  - TTL: Automatic
- [ ] Add **CNAME Record** (if using www):
  - Host: `www`
  - Value: `cname.vercel-dns.com`
  - TTL: Automatic
- [ ] Remove conflicting records
- [ ] Save all changes

### Wait for DNS
- [ ] Check Vercel domain status: Should say "Valid Configuration"
- [ ] Test in terminal: `dig scova.io`
- [ ] Or use: [whatsmydns.net](https://www.whatsmydns.net/#A/scova.io)

---

## Step 5: Update Google OAuth with Production Domain (5 min)

**Do this AFTER DNS propagation is complete**

- [ ] Go back to Google Cloud → Google Auth Platform → Clients
- [ ] Edit Web client
- [ ] Add to **Authorized JavaScript origins:**
  - [ ] `https://scova.io`
  - [ ] `https://www.scova.io`
- [ ] Save

---

## Step 6: Test Everything (30 min)

### Basic Site
- [ ] Visit `https://scova.io` - loads correctly
- [ ] Visit `https://www.scova.io` - loads correctly (if configured)
- [ ] No console errors (F12)
- [ ] Logo and branding correct

### Authentication
- [ ] Visit `https://scova.io/login`
- [ ] Click "Sign in with Google"
- [ ] OAuth dialog shows:
  - [ ] Header: "Sign in to **scova.io**" (not Supabase URL)
  - [ ] App name: **Scova**
  - [ ] Your logo appears
- [ ] Complete sign-in successfully
- [ ] Redirected to dashboard
- [ ] Session persists on refresh

### Protected Routes
- [ ] `/profile` requires auth
- [ ] `/settings` requires auth
- [ ] Unauthenticated users redirect to login
- [ ] Logout works correctly

### API & Performance
- [ ] Test brand research functionality
- [ ] Check Vercel function logs - no errors
- [ ] Test on mobile device
- [ ] Lighthouse score acceptable

---

## Post-Launch Monitoring

- [ ] Check Vercel Analytics for traffic
- [ ] Monitor Vercel logs for errors
- [ ] Check Supabase logs for auth issues
- [ ] Test from different devices/browsers
- [ ] Add more test users to Google OAuth if needed

---

## Rollback Plan (if needed)

If something goes wrong:

1. **Domain issues:** Remove DNS records in Namecheap (reverts to previous state)
2. **App issues:** Revert deployment in Vercel → Deployments → previous version
3. **OAuth issues:** Revert Google OAuth client settings to previous state
4. **Database issues:** Check Supabase dashboard for connection issues

---

## Quick Reference

**Vercel Project:** `_____________________.vercel.app`  
**Domain:** `scova.io`  
**Supabase:** `mqacaohhpioouvdlvyu.supabase.co`  

**Key Dashboards:**
- Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
- Supabase: [supabase.com/dashboard](https://supabase.com/dashboard)
- Google Cloud: [console.cloud.google.com](https://console.cloud.google.com)
- Namecheap: [namecheap.com/myaccount/login](https://www.namecheap.com/myaccount/login)

---

**Estimated Total Time:** 2-3 hours (including DNS propagation)  
**Last Updated:** November 21, 2025


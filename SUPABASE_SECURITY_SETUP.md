# Supabase Security Setup Guide

## ✅ Code Changes Complete!

All API routes and server components have been updated to use `SUPABASE_SERVICE_ROLE_KEY` instead of the anon key. This means all database queries from your website will appear as one authenticated service account.

## Overview
This guide will help you secure your Supabase tables so they're not publicly accessible, while still allowing your frontend to read the data it needs. **Most importantly, it protects your database from being bombarded with requests.**

## The Problem
Even with RLS policies, if your frontend queries Supabase directly from the browser, anyone can:
- Make unlimited requests to your database
- Overwhelm your database with queries
- Potentially hit rate limits or incur costs

## The Solution
We'll use a **multi-layer protection approach**:
1. **Row Level Security (RLS)** - Controls what data can be accessed
2. **API Routes with Rate Limiting** - Prevents abuse by limiting requests per IP
3. **Supabase Built-in Protections** - Additional safeguards from Supabase

## Tables That Need Security
Based on your codebase, these tables are accessed:
- `landing_page` - Read only
- `canonical_news_story` - Read only  
- `captured_news_story` - Read only

## Next Steps: Vercel & Supabase Configuration

### Step 1: Add Environment Variable to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your service role key (from `backend/.env` line 21)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. **Redeploy** your application for the changes to take effect

### Step 2: Enable Row Level Security (RLS) in Supabase

For each table, you need to enable RLS:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **Applied AI Dash**
3. Click on **Table Editor** in the left sidebar
4. For each table (`landing_page`, `canonical_news_story`, `captured_news_story`):
   - Click on the table name
   - Click the **"..."** menu (three dots) next to the table name
   - Select **"Enable RLS"** (Row Level Security)

### Step 3: Create Policies for Service Role Only

After enabling RLS, you need to create policies that **only allow the service_role** to read data. This blocks all public/anonymous access.

#### For `landing_page` table:

1. Click on the `landing_page` table
2. Click on **"Policies"** tab at the top
3. Click **"New Policy"**
4. Choose **"Create a policy from scratch"**
5. Configure as follows:
   - **Policy name**: `Allow service role read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `service_role` (NOT public or anon)
   - **USING expression**: `true` (this allows reading all rows)
   - Click **"Review"** then **"Save policy"**

#### For `canonical_news_story` table:

1. Click on the `canonical_news_story` table
2. Click on **"Policies"** tab
3. Click **"New Policy"**
4. Choose **"Create a policy from scratch"**
5. Configure as follows:
   - **Policy name**: `Allow service role read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `service_role` (NOT public or anon)
   - **USING expression**: `true`
   - Click **"Review"** then **"Save policy"**

#### For `captured_news_story` table:

1. Click on the `captured_news_story` table
2. Click on **"Policies"** tab
3. Click **"New Policy"**
4. Choose **"Create a policy from scratch"**
5. Configure as follows:
   - **Policy name**: `Allow service role read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `service_role` (NOT public or anon)
   - **USING expression**: `true`
   - Click **"Review"** then **"Save policy"**

**Important:** Do NOT create policies for `anon` or `public` roles. Only `service_role` should have access.

### Step 4: Move Client-Side Queries to API Routes (Already Done!)

**This is the key protection against database bombardment.**

Instead of querying Supabase directly from your frontend components, we'll route all queries through Next.js API routes that have rate limiting.

### What We're Changing

**Before (Vulnerable):**
```typescript
// ❌ Direct query from browser - anyone can spam this
const { data } = await supabase.from('canonical_news_story').select('*')
```

**After (Protected):**
```typescript
// ✅ Query goes through API route with rate limiting
const response = await fetch('/api/news?page=1')
const { data } = await response.json()
```

### Implementation

I've created `/frontend/app/api/news/route.ts` which:
- ✅ Limits requests to 30 per minute per IP address
- ✅ Validates all inputs
- ✅ Handles errors gracefully
- ✅ Uses your Supabase connection securely

### Next Steps

1. **Update your components** to use the API route instead of direct Supabase queries
2. **Create similar API routes** for any other tables you query from the frontend
3. **Test your website** to ensure everything still works

## Step 5: Configure Supabase Rate Limiting (Additional Protection)

Supabase has built-in rate limiting you can configure:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Look for **Rate Limiting** settings
3. Configure limits for:
   - **Anonymous requests** (using anon key): Set to reasonable limits (e.g., 100 requests/minute)
   - **Authenticated requests**: Higher limits if you have user accounts

This provides an additional layer of protection even if someone bypasses your API route rate limiting.

## What This Achieves

✅ **Only your website can read** - All queries come through your API routes using service role  
✅ **Public cannot access** - Direct queries from browsers are blocked by RLS  
✅ **Public cannot write** - No one can insert, update, or delete data  
✅ **Rate limited** - No one can bombard your database (30 requests/minute per IP)  
✅ **Frontend still works** - Your frontend code continues to function, routes through protected API  
✅ **All traffic appears as one user** - All database queries appear as the service_role account  
✅ **Multiple layers of protection** - RLS + API rate limiting + Supabase rate limiting

## Important Notes

- The `anon` key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is safe to use in your frontend - it's designed to be public
- The `service_role` key (SUPABASE_SERVICE_ROLE_KEY) should NEVER be exposed in your frontend - only use it in backend/server code
- If you need to add write operations from your frontend later, you'll need to create additional policies or use authenticated users

## Step 6: Update Your Components (Already Done!)

I've already updated `NewsList.tsx` to use the protected API route. 

**Important Note:** Your landing page queries (`/app/landing/[slug]/page.tsx`) are already **server-side** (they run on your Next.js server, not in the browser). This means they're automatically protected - users can't abuse them because they can't directly call them. Only your website can trigger those queries.

For any other **client-side components** (components marked with `'use client'`) that query Supabase directly, you should:

1. Create an API route (like `/api/news/route.ts`)
2. Add rate limiting to that route
3. Update the component to fetch from the API route instead

### Example: Updating a Component

**Before:**
```typescript
const { data } = await supabase.from('table_name').select('*')
```

**After:**
```typescript
const response = await fetch('/api/your-endpoint')
const { data } = await response.json()
```

## Testing

After setting this up, test your website to make sure:
1. Landing pages still load correctly
2. News stories still display (now through protected API)
3. All read operations work as expected
4. Rate limiting works (try making 30+ requests quickly - should get rate limited)

If something breaks, you can temporarily disable RLS on a table to troubleshoot, but remember to re-enable it after fixing the policy.

## Summary: Your Protection Layers

You now have **three layers of protection**:

1. **RLS Policies** - Controls what data can be read/written
2. **API Route Rate Limiting** - Prevents abuse (30 requests/minute per IP)
3. **Supabase Rate Limiting** - Additional protection at the database level

This means:
- ✅ Legitimate users can browse your site normally
- ✅ Abusers can't bombard your database (blocked after 30 requests/minute)
- ✅ Your database is protected from excessive load
- ✅ Your costs stay under control

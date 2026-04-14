# AG Dealer Connect — Deployment Guide
## antiquegatherings.com/submit

---

## STEP 1 — Run the Supabase Database Schema

1. Go to https://supabase.com and open your project
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `supabase_schema.sql` from this folder
5. Copy and paste the entire contents into the editor
6. Click **Run**
7. You should see "Success. No rows returned"

---

## STEP 2 — Create your Admin user in Supabase

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Email: `submitadmin@antiquegatherings.com`
4. Set a strong password
5. Click **Create user**
6. Copy the **User UID** shown (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
7. Go back to **SQL Editor** and run this query (replace with your actual UID):

```sql
INSERT INTO public.profiles (id, type, name)
VALUES ('YOUR-ADMIN-USER-UID-HERE', 'admin', 'Admin');
```

---

## STEP 3 — Set up Cloudinary Upload Preset

1. Go to https://cloudinary.com and log in
2. Click **Settings** (gear icon) → **Upload**
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Set **Preset name** to exactly: `ag_dealer_connect`
6. Set **Signing mode** to **Unsigned**
7. Under **Folder**, type: `ag-dealer-connect`
8. Click **Save**

---

## STEP 4 — Deploy to Vercel

1. Go to https://github.com and create a free account if you don't have one
2. Create a new repository called `ag-dealer-connect`
3. Upload all files from this folder to the repository
4. Go to https://vercel.com and log in with GitHub
5. Click **Add New Project**
6. Select your `ag-dealer-connect` repository
7. Click **Deploy** — Vercel will auto-detect the settings
8. Wait ~2 minutes — you'll get a URL like `ag-dealer-connect.vercel.app`
9. Test it works at that URL before connecting your domain

---

## STEP 5 — Add Environment Variables to Vercel

In your Vercel project dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add each of these:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://yrjotpgjljgksoyxhdzx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(your anon key)* |
| `VITE_CLOUDINARY_CLOUD_NAME` | `dujmo9fbu` |
| `VITE_CLOUDINARY_API_KEY` | `143166749166238` |
| `RESEND_API_KEY` | *(your resend key)* |
| `VITE_ADMIN_EMAIL` | `submitadmin@antiquegatherings.com` |

3. Click **Redeploy** after adding variables

---

## STEP 6 — Connect your GoDaddy domain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Type: `submit.antiquegatherings.com`
3. Click **Add**
4. Vercel will show you a CNAME record to add — copy the values

5. Log into GoDaddy → **My Products** → find `antiquegatherings.com` → **DNS**
6. Click **Add New Record**
7. Type: **CNAME**
8. Name: `submit`
9. Value: *(the value Vercel gave you, looks like `cname.vercel-dns.com`)*
10. TTL: 1 hour
11. Click **Save**

Wait 10–30 minutes for DNS to propagate, then visit:
**https://submit.antiquegatherings.com** ✓

---

## STEP 7 — Verify Resend domain (for email)

1. Go to https://resend.com → **Domains**
2. Click **Add Domain** → enter `antiquegatherings.com`
3. Resend will give you DNS records to add to GoDaddy
4. Add those records in GoDaddy DNS the same way as Step 6
5. Click **Verify** in Resend

---

## You're live! Test checklist:

- [ ] Create a seller account → upload a photo → add price and description
- [ ] Log in as admin → approve a dealer account
- [ ] Log in as dealer → browse submissions → contact a seller
- [ ] Check that approval email arrives at dealer's inbox
- [ ] Check that new submission alert arrives at submitadmin@antiquegatherings.com

---

## Support

For help: submitadmin@antiquegatherings.com

# Quick Start: Database Setup (5 Minutes)

Get your portfolio connected to Supabase in 5 minutes.

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - Project name: `portfolio` (or your choice)
   - Database password: (save this!)
   - Region: Choose closest to you
5. Click "Create new project"
6. Wait 1-2 minutes for provisioning

## Step 2: Get Your Credentials (30 sec)

1. In your Supabase project dashboard
2. Click the Settings icon (⚙️) in sidebar
3. Click "API" in settings menu
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 3: Add Environment Variables (30 sec)

Create a file `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_key_here
```

**Important:** Replace with YOUR actual values from Step 2!

## Step 4: Run Database Schema (1 min)

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New query"
3. Open the file `lib/database-schema.sql` from your project
4. Copy ALL the content (Cmd+A, Cmd+C)
5. Paste into Supabase SQL Editor
6. Click "Run" button (or press Cmd+Enter)
7. Wait for "Success" message

✅ Done! All tables are created.

## Step 5: Restart Your Dev Server (30 sec)

```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
pnpm dev
```

## Step 6: Test Connection (30 sec)

Open your browser and visit:
```
http://localhost:3000/api/test-db
```

You should see:
```json
{
  "overall": true,
  "summary": "✅ All 6 database connections are working!",
  ...
}
```

✅ **Success!** Your database is connected.

## Optional: Add Your First Photo (1 min)

In Supabase dashboard:

1. Click "Table Editor"
2. Select `photos` table
3. Click "Insert row"
4. Fill in:
   - album_id: `1` (the about-widget album)
   - image_url: `/photos/photo1.png` (or your image path)
   - alt_text: `My photo`
   - sort_order: `0`
5. Click "Save"

Now visit your About section - your photo should appear in the widget!

## Optional: Update About Text (1 min)

In Supabase dashboard:

1. Table Editor → `about_sections` table
2. Click the row with key `about-main-1`
3. Edit the `content` field
4. Click "Save"

Refresh your page - the new text appears!

## What's Next?

Your portfolio now uses the database for:
- ✅ Photo widget
- ✅ About text
- ✅ Projects (when you add them)
- ✅ Experience (when you add them)
- ✅ Articles (when you add them)

But don't worry! Everything still works with the built-in fallback content until you add your own data.

## Adding More Content

### Add a Project
```sql
-- In Supabase SQL Editor:
INSERT INTO projects (title, summary, featured_image_url, status, sort_order)
VALUES (
  'My Awesome Project',
  'A brief description of what this project does',
  '/projects/my-project.jpg',
  'active',
  0
);
```

### Add an Article
```sql
INSERT INTO articles (
  title, 
  slug, 
  excerpt, 
  content, 
  status, 
  published_at,
  category_id
)
VALUES (
  'My First Blog Post',
  'my-first-blog-post',
  'This is a short excerpt...',
  '# My First Blog Post\n\nFull article content here in markdown...',
  'published',
  NOW(),
  1  -- Development category
);
```

### Add Experience
```sql
INSERT INTO content_sections (
  key,
  title,
  subtitle,
  time_range,
  body,
  status,
  sort_order
)
VALUES (
  'experience_1',
  'Senior Developer',
  'Amazing Tech Company',
  '2024 — Present',
  'Working on cutting-edge projects using React, TypeScript, and Node.js...',
  'active',
  0
);
```

## Troubleshooting

### ❌ "Connection failed"
**Fix:**
- Check `.env.local` has correct values
- Make sure you restarted the dev server
- Verify Supabase project is running

### ❌ "No data appearing"
**This is normal!** Components use fallback content until you add data.

To add data:
1. Go to Supabase Table Editor
2. Click the table name
3. Click "Insert row"
4. Fill in the fields
5. Save

### ❌ Can't find `.env.local`
Create it in your project root (same level as `package.json`):
```bash
touch .env.local
```

Then add your environment variables.

## Need Help?

- 📖 Full setup guide: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- 🔍 Component overview: [DATABASE_CONNECTIONS.md](./DATABASE_CONNECTIONS.md)
- ✅ Step-by-step checklist: [DATABASE_CHECKLIST.md](./DATABASE_CHECKLIST.md)
- 📚 API reference: [lib/DATABASE_API_REFERENCE.md](./lib/DATABASE_API_REFERENCE.md)

## Summary

**What you did:**
1. ✅ Created Supabase project
2. ✅ Added environment variables
3. ✅ Ran database schema
4. ✅ Tested connection

**What's connected:**
- ✅ Photo widget → `photos` table
- ✅ About text → `about_sections` table
- ✅ Projects → `projects` table
- ✅ Experience → `content_sections` table
- ✅ Articles → `articles` table

**Total time:** ~5 minutes

Your portfolio now has a full database backend! 🎉

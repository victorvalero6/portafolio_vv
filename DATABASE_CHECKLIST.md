# Database Connection Checklist

Use this checklist to verify that all components are properly connected to your database.

## Pre-Setup

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create a new Supabase project
- [ ] Wait for project provisioning to complete
- [ ] Copy Project URL and Anon Key from Project Settings > API

## Environment Setup

- [ ] Create `.env.local` file in project root
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL=your_url_here`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here`
- [ ] Restart development server (`pnpm dev`)

## Database Schema Setup

- [ ] Open Supabase Dashboard > SQL Editor
- [ ] Open `lib/database-schema.sql` in your code editor
- [ ] Copy the entire SQL schema
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" to execute
- [ ] Verify all tables were created (check Table Editor)

## Verify Tables Created

Go to Supabase Dashboard > Table Editor and verify these tables exist:

### Core Tables
- [ ] `photo_albums`
- [ ] `photos`
- [ ] `about_sections`
- [ ] `projects`
- [ ] `technologies`
- [ ] `project_technologies`

### Content Tables
- [ ] `content_sections`
- [ ] `section_highlights`
- [ ] `section_tags`
- [ ] `content_section_tags`

### Article Tables
- [ ] `articles`
- [ ] `article_categories`
- [ ] `article_tags`
- [ ] `articles_article_tags`

## Add Sample Data

### 1. Photo Album & Photos
```sql
-- Already included in schema, but verify:
SELECT * FROM photo_albums WHERE key = 'about-widget';
```
- [ ] Photo album `about-widget` exists
- [ ] Add your own photos to the `photos` table

### 2. About Sections
```sql
-- Already included in schema, but verify:
SELECT * FROM about_sections WHERE is_active = true;
```
- [ ] About sections exist
- [ ] Customize the content text to match your story

### 3. Projects (Optional - component has fallback)
```sql
-- Example:
INSERT INTO projects (title, summary, featured_image_url, status, sort_order)
VALUES ('My Project', 'Description here', '/projects/image.jpg', 'active', 0);
```
- [ ] Add at least one project
- [ ] Add technologies for the project
- [ ] Link project to technologies

### 4. Experience (Optional - component has fallback)
```sql
-- Example:
INSERT INTO content_sections (
  key, title, subtitle, time_range, body, status, sort_order
) VALUES (
  'experience_1', 
  'Your Role', 
  'Company Name',
  '2024 — Present',
  'Description of what you did...',
  'active',
  0
);
```
- [ ] Add your work experience
- [ ] Add highlights/skills for each experience

### 5. Articles (Optional - for blog)
```sql
-- Add category first
INSERT INTO article_categories (name, slug) 
VALUES ('Development', 'development');

-- Then add article
INSERT INTO articles (
  title, slug, excerpt, content, 
  category_id, status, published_at
) VALUES (
  'My First Article',
  'my-first-article',
  'Short description',
  '# Full article content here...',
  1,
  'published',
  NOW()
);
```
- [ ] Add article categories (if using blog)
- [ ] Add article tags (if using blog)
- [ ] Write and publish your first article

## Test Connections

### Method 1: API Route
- [ ] Start dev server: `pnpm dev`
- [ ] Visit: `http://localhost:3000/api/test-db`
- [ ] Verify JSON response shows all connections working
- [ ] Check `overall: true` in response

### Method 2: Visual Inspection
- [ ] Visit your portfolio homepage
- [ ] Navigate to About section
- [ ] Verify PhotoWidget loads images (check for database photos vs fallback)
- [ ] Verify experience cards show your data
- [ ] Check browser console for any errors

### Method 3: Component-by-Component

#### PhotoWidget
- [ ] Navigate to About/Experience section
- [ ] PhotoWidget displays without errors
- [ ] Images are loading
- [ ] Can navigate between photos
- [ ] Check console: Should NOT see "Error fetching photos"

#### AboutQuote
- [ ] Add `<AboutQuote />` to a page
- [ ] Component renders without errors
- [ ] Text displays correctly
- [ ] Check console: Should NOT see "Error fetching about sections"

#### ProjectsGrid
- [ ] Navigate to Work/Projects section
- [ ] Projects display without errors
- [ ] Technologies/tags show correctly
- [ ] Links work properly

#### ExperienceSection
- [ ] Navigate to About/Experience section
- [ ] Experience cards display
- [ ] Skills/highlights appear
- [ ] Time ranges are correct

#### ArticlesList (if implemented)
- [ ] Navigate to articles/blog page
- [ ] Articles list displays
- [ ] Article cards show correct data
- [ ] Links to individual articles work

## Verify RLS Policies

Go to Supabase Dashboard > Authentication > Policies

- [ ] All tables have RLS enabled
- [ ] Public SELECT policies exist for:
  - [ ] `photo_albums` (where is_active = true)
  - [ ] `photos`
  - [ ] `about_sections` (where is_active = true)
  - [ ] `projects` (where status = 'active')
  - [ ] `content_sections` (where status = 'active')
  - [ ] `articles` (where status = 'published')
  - [ ] All junction/reference tables

## Troubleshooting

### ❌ "Unable to load from database" message appears
**Possible causes:**
- [ ] Environment variables not set correctly
- [ ] Development server not restarted after adding env vars
- [ ] Supabase credentials incorrect
- [ ] Network connection issues

**Fix:**
1. Verify `.env.local` has correct values
2. Restart dev server
3. Check Supabase project is running
4. Test connection at `/api/test-db`

### ❌ No data appearing but no errors
**Possible causes:**
- [ ] Data doesn't exist in tables
- [ ] Data has wrong status/is_active value
- [ ] RLS policies too restrictive

**Fix:**
1. Check table has data: `SELECT * FROM your_table;`
2. Verify status/is_active flags
3. Check RLS policies allow public read

### ❌ "Missing environment variables"
**Fix:**
- [ ] Create `.env.local` in project root (not in subdirectories)
- [ ] Add both required variables
- [ ] Restart dev server completely

### ❌ Components show fallback content
**This is expected if:**
- [ ] Database not set up yet (working as designed)
- [ ] No data in tables (working as designed)
- [ ] Environment variables missing (working as designed)

**Not a bug!** The fallback system ensures your portfolio always works.

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

- [ ] Add environment variables to hosting platform
- [ ] Verify Supabase project allows connections from production domain
- [ ] Test all connections in production
- [ ] Check production logs for any errors
- [ ] Verify RLS policies work correctly

## Customization

After everything is working:

- [ ] Customize fallback content in components
- [ ] Add your own data to database tables
- [ ] Upload images to Supabase Storage (optional)
- [ ] Create custom article pages
- [ ] Modify component styling as needed
- [ ] Add additional fields to tables if needed

## Documentation Reference

- [ ] Read [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup
- [ ] Check [DATABASE_CONNECTIONS.md](./DATABASE_CONNECTIONS.md) for component overview
- [ ] Review [lib/DATABASE_API_REFERENCE.md](./lib/DATABASE_API_REFERENCE.md) for API usage
- [ ] Explore [README.md](./README.md) for general project info

## Summary

### ✅ What's Connected:
1. **PhotoWidget** - Fetches photos from database
2. **AboutQuote** - Fetches about text from database
3. **ProjectsGrid** - Fetches projects with technologies
4. **ExperienceSection** - Fetches experience/education
5. **ArticlesList** - Ready to fetch blog articles

### ✅ What Has Fallback:
All components gracefully fall back to hardcoded content if:
- Database is not configured
- Connection fails
- No data exists

### ✅ What You Need:
1. Supabase account and project
2. Environment variables in `.env.local`
3. Database schema run in Supabase
4. Sample data added to tables

---

**Status Check:** Visit `http://localhost:3000/api/test-db` to see overall connection status!

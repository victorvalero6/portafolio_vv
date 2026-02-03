# Database Connections Summary

This document provides a complete overview of all database-connected components in the portfolio.

## ✅ Status: All Components Connected

All components that display dynamic content are now properly connected to Supabase with fallback support.

## Connected Components

### 1. 📸 Photo Widget
- **Component**: `components/ui/photo-widget.tsx`
- **Library**: `lib/photos.ts`
- **Function**: `getPhotosByAlbumKey(albumKey: string)`
- **Database Tables**: `photo_albums`, `photos`
- **Default Album Key**: `about-widget`
- **Status**: ✅ Connected
- **Fallback**: Yes - uses local photos if database unavailable

**Location Used**: About section (Experience page)

**How it works**:
```typescript
const photos = await getPhotosByAlbumKey('about-widget')
// Returns: Photo[] with image_url, alt_text, caption, etc.
```

---

### 2. 📝 About Text/Quote
- **Component**: `components/ui/about-quote.tsx`
- **Library**: `lib/about.ts`
- **Function**: `getActiveAboutSections()`
- **Database Table**: `about_sections`
- **Status**: ✅ Connected
- **Fallback**: Yes - uses default text if database unavailable

**Location Used**: Can be added to any page

**How it works**:
```typescript
const aboutSections = await getActiveAboutSections()
// Returns: AboutSection[] with content paragraphs
```

---

### 3. 💼 Projects Grid
- **Component**: `components/ui/projects-grid.tsx`
- **Library**: Uses `getSupabaseClient()` directly
- **Database Tables**: `projects`, `technologies`, `project_technologies`
- **Status**: ✅ Connected
- **Fallback**: Yes - uses hardcoded projects with translations

**Location Used**: Work section (main page)

**How it works**:
```typescript
const { data } = await supabase
  .from("projects")
  .select(`
    id, title, summary, featured_image_url,
    project_technologies ( technologies ( name ) )
  `)
  .eq("status", "active")
```

---

### 4. 💻 Experience Section
- **Component**: `components/ui/experience-section.tsx`
- **Library**: Uses `getSupabaseClient()` directly
- **Database Tables**: `content_sections`, `section_highlights`, `section_tags`
- **Status**: ✅ Connected
- **Fallback**: Yes - uses hardcoded experience with translations

**Location Used**: About section (main page)

**How it works**:
```typescript
const { data } = await supabase
  .from("content_sections")
  .select(`
    id, key, title, subtitle, time_range, body,
    section_highlights ( text, sort_order ),
    content_section_tags ( section_tags ( name ) )
  `)
  .eq("status", "active")
  .ilike("key", "experience_%")
```

---

### 5. 📰 Articles/Blog (Components Ready)
- **Components**: 
  - `components/ui/article-card.tsx` - Individual article card
  - `components/ui/articles-list.tsx` - Article grid/list
- **Library**: `lib/articles.ts`
- **Functions**: 
  - `getPublishedArticles()` - Get all published articles
  - `getArticleBySlug(slug)` - Get single article
  - `getArticlesByCategory(categorySlug)` - Filter by category
  - `getArticleCategories()` - Get all categories
  - `getArticleTags()` - Get all tags
- **Database Tables**: `articles`, `article_categories`, `article_tags`, `articles_article_tags`
- **Status**: ✅ Ready to use
- **Fallback**: Shows empty state if no articles

**How to use**:
```typescript
// In your articles page
import { ArticlesList } from '@/components/ui/articles-list'

export default function ArticlesPage() {
  return <ArticlesList />
}

// Or manually:
import { getPublishedArticles } from '@/lib/articles'
const articles = await getPublishedArticles()
```

---

## Database Tables Summary

| Table | Used By | Status | Purpose |
|-------|---------|--------|---------|
| `photo_albums` | PhotoWidget | ✅ | Store photo album metadata |
| `photos` | PhotoWidget | ✅ | Store individual photos |
| `about_sections` | AboutQuote | ✅ | Store about text paragraphs |
| `projects` | ProjectsGrid | ✅ | Store portfolio projects |
| `technologies` | ProjectsGrid | ✅ | Store technology tags |
| `project_technologies` | ProjectsGrid | ✅ | Link projects to technologies |
| `content_sections` | ExperienceSection | ✅ | Store experience/education entries |
| `section_highlights` | ExperienceSection | ✅ | Store bullet points for sections |
| `section_tags` | ExperienceSection | ✅ | Store tags for sections |
| `content_section_tags` | ExperienceSection | ✅ | Link sections to tags |
| `articles` | ArticlesList/Card | ✅ | Store blog articles |
| `article_categories` | Articles | ✅ | Store article categories |
| `article_tags` | Articles | ✅ | Store article tags |
| `articles_article_tags` | Articles | ✅ | Link articles to tags |

## Testing Connections

### Method 1: API Route
Visit the test endpoint in your browser:
```
http://localhost:3000/api/test-db
```

This will return a JSON report showing:
- ✅ Which connections are working
- 📊 Data counts for each component
- ❌ Any errors or issues

### Method 2: Component Inspector
Each component logs errors to the console if database connection fails. Open your browser's developer tools to see any connection issues.

### Method 3: Manual Testing
1. Check environment variables are set in `.env.local`
2. Verify Supabase dashboard shows your tables
3. Add sample data using SQL from `DATABASE_SETUP.md`
4. Refresh your portfolio page

## Fallback Strategy

All components follow this pattern:

```typescript
1. Try to fetch from database
2. If successful and data exists → Use database data
3. If fails or no data → Use fallback content
4. Optionally log error (hidden in production)
```

This ensures your portfolio **always works**, even without a database connection.

## Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Without these variables:
- ❌ Database connection will fail
- ✅ Components will use fallback content
- ✅ Portfolio will still work perfectly

## Next Steps

1. ✅ **Set up Supabase project** (if not done)
2. ✅ **Run database schema** from `lib/database-schema.sql`
3. ✅ **Add environment variables** to `.env.local`
4. ✅ **Add your content** to database tables
5. ✅ **Test connections** using `/api/test-db`
6. ✅ **Customize fallback content** in components if needed

## Troubleshooting

### "No data appearing" but connection works?
→ Check that you've added content to the correct tables with the right status/keys:
- Projects need `status = 'active'`
- Experience needs `key` starting with `experience_`
- Photo albums need `is_active = true`
- Articles need `status = 'published'`
- About sections need `is_active = true`

### "Connection failed" error?
→ Check:
1. Environment variables are correct
2. Supabase project is running
3. RLS policies allow public read access
4. Tables exist in your database

### Component shows fallback content?
→ This is normal if:
- Database is not set up yet
- Environment variables are missing
- No data exists in tables
- Network connection is slow/failed

The fallback ensures your site always works!

## Additional Resources

- [Database Setup Guide](./DATABASE_SETUP.md) - Complete setup instructions
- [Main README](./README.md) - Project overview
- [Supabase Docs](https://supabase.com/docs) - Official documentation

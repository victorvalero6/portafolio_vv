# Database Architecture

Visual overview of how components connect to the database.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Your Portfolio                          │
│                      (Next.js 15 + React)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Environment Variables
                                │ (NEXT_PUBLIC_SUPABASE_*)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    lib/supabase.ts                              │
│                   Supabase Client Setup                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Provides Client
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ lib/photos.ts│      │ lib/about.ts │      │lib/articles.ts│
│              │      │              │      │              │
│ Photo API    │      │ About API    │      │ Article API  │
└──────────────┘      └──────────────┘      └──────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │photo_albums  │  │about_sections│  │   articles   │      │
│  │   photos     │  │              │  │article_tags  │      │
│  └──────────────┘  └──────────────┘  │article_categories  │ │
│                                       └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  projects    │  │content_sections                        │
│  │technologies  │  │section_highlights                      │
│  │project_techs │  │section_tags  │                        │
│  └──────────────┘  └──────────────┘                        │
└──────────────────────────────────────────────────────────────┘
        │                       │                       │
        │ Feeds Data            │ Feeds Data            │ Feeds Data
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ PhotoWidget  │      │ AboutQuote   │      │ ArticlesList │
│              │      │              │      │ ArticleCard  │
│ (Component)  │      │ (Component)  │      │ (Components) │
└──────────────┘      └──────────────┘      └──────────────┘

┌──────────────┐      ┌──────────────┐
│ProjectsGrid  │      │ExperienceSection
│              │      │              │
│ (Component)  │      │ (Component)  │
└──────────────┘      └──────────────┘
        │                       │
        │ Displayed in          │ Displayed in
        │                       │
        ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     User sees on screen                          │
│                    (Fallback if DB fails)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Component → Database Mapping

### 1. PhotoWidget
```
PhotoWidget Component
    │
    ├─► lib/photos.ts
    │       │
    │       └─► getPhotosByAlbumKey('about-widget')
    │               │
    │               └─► Supabase Query
    │                       │
    │                       ├─► photo_albums (WHERE key = 'about-widget')
    │                       └─► photos (WHERE album_id = X)
    │
    └─► Displays: Photo carousel with navigation
```

**Database Tables:**
- `photo_albums` - Stores album metadata
- `photos` - Stores individual photo data

**Fallback:** Local photos from `/public/photos/`

---

### 2. AboutQuote
```
AboutQuote Component
    │
    ├─► lib/about.ts
    │       │
    │       └─► getActiveAboutSections()
    │               │
    │               └─► Supabase Query
    │                       │
    │                       └─► about_sections (WHERE is_active = true)
    │
    └─► Displays: Text paragraphs in styled box
```

**Database Tables:**
- `about_sections` - Stores about text paragraphs

**Fallback:** Hardcoded default about text

---

### 3. ProjectsGrid
```
ProjectsGrid Component
    │
    ├─► Direct Supabase Query
    │       │
    │       └─► Supabase Query (getSupabaseClient)
    │               │
    │               ├─► projects (WHERE status = 'active')
    │               ├─► project_technologies (JOIN)
    │               └─► technologies (JOIN)
    │
    └─► Displays: Grid of project cards
```

**Database Tables:**
- `projects` - Stores project data
- `technologies` - Stores technology tags
- `project_technologies` - Links projects to technologies

**Fallback:** Hardcoded projects with translations

---

### 4. ExperienceSection
```
ExperienceSection Component
    │
    ├─► Direct Supabase Query
    │       │
    │       └─► Supabase Query (getSupabaseClient)
    │               │
    │               ├─► content_sections (WHERE key LIKE 'experience_%')
    │               ├─► section_highlights (JOIN)
    │               └─► section_tags via content_section_tags (JOIN)
    │
    └─► Displays: Timeline of experience cards
```

**Database Tables:**
- `content_sections` - Stores experience entries
- `section_highlights` - Stores bullet points/skills
- `section_tags` - Stores technology tags
- `content_section_tags` - Links sections to tags

**Fallback:** Hardcoded experience with translations

---

### 5. ArticlesList (Ready to use)
```
ArticlesList Component
    │
    ├─► lib/articles.ts
    │       │
    │       └─► getPublishedArticles()
    │               │
    │               └─► Supabase Query
    │                       │
    │                       ├─► articles (WHERE status = 'published')
    │                       ├─► article_categories (JOIN)
    │                       ├─► article_tags via articles_article_tags (JOIN)
    │                       └─► ORDER BY published_at DESC
    │
    └─► Displays: Grid of article cards
```

**Database Tables:**
- `articles` - Stores blog posts
- `article_categories` - Stores categories
- `article_tags` - Stores tags
- `articles_article_tags` - Links articles to tags

**Fallback:** Empty state component

---

## Data Flow Diagram

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ Visits Page
     │
     ▼
┌─────────────────┐
│  Next.js Page   │
│  (Server/Client)│
└────┬────────────┘
     │
     │ Renders Component
     │
     ▼
┌─────────────────┐
│   Component     │
│  (React)        │
└────┬────────────┘
     │
     │ useEffect / Server Component
     │
     ▼
┌─────────────────┐
│  API Function   │
│  (lib/*.ts)     │
└────┬────────────┘
     │
     │ getSupabaseClient()
     │
     ▼
┌─────────────────┐
│ Supabase Client │
└────┬────────────┘
     │
     │ SELECT query
     │
     ▼
┌─────────────────┐
│   Supabase      │◄──────┐
│   Database      │       │
└────┬────────────┘       │
     │                    │
     │ Returns data       │ RLS Policy Check
     │                    │
     ▼                    │
┌─────────────────┐       │
│  API Function   │───────┘
│  (validates)    │
└────┬────────────┘
     │
     │ Returns Photo[] / Article[] / etc.
     │
     ▼
┌─────────────────┐
│   Component     │
│  (renders data) │
└────┬────────────┘
     │
     │ If error → Use fallback
     │
     ▼
┌─────────────────┐
│  User sees      │
│  content        │
└─────────────────┘
```

## Error Handling Flow

```
Component requests data
         │
         ▼
    Try database
         │
         ├─► Success? ──► Has data? ──┬─► YES → Use database data
         │                            │
         │                            └─► NO → Use fallback data
         │
         └─► Fail? ──► Log error ──► Use fallback data
                            │
                            └─► Console.error (dev only)
```

## Database Table Relationships

```
photo_albums
    │
    └──< photos (album_id)


projects
    │
    └──< project_technologies ──> technologies


content_sections
    │
    ├──< section_highlights
    │
    └──< content_section_tags ──> section_tags


articles
    │
    ├──> article_categories (category_id)
    │
    └──< articles_article_tags ──> article_tags
```

**Legend:**
- `──<` One-to-Many
- `──>` Many-to-One
- `──<──>` Many-to-Many (through junction table)

## Security: Row Level Security (RLS)

```
┌──────────────────────────────────────────────────────────┐
│                    PUBLIC USERS                          │
│                (Anyone on the internet)                  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ SELECT queries only
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  RLS POLICIES                            │
│                                                           │
│  ✅ Allow SELECT WHERE:                                  │
│     - photo_albums.is_active = true                      │
│     - about_sections.is_active = true                    │
│     - projects.status = 'active'                         │
│     - content_sections.status = 'active'                 │
│     - articles.status = 'published'                      │
│                                                           │
│  ❌ Deny INSERT, UPDATE, DELETE                          │
│     (Only authenticated users can modify)                │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ Filtered results
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                 SUPABASE DATABASE                        │
│              (Only published/active data)                │
└──────────────────────────────────────────────────────────┘
```

## API Functions Summary

| Function | Input | Output | Tables Used |
|----------|-------|--------|-------------|
| `getPhotosByAlbumKey()` | albumKey | Photo[] | photo_albums, photos |
| `getActiveAlbums()` | - | PhotoAlbum[] | photo_albums |
| `getActiveAboutSections()` | - | AboutSection[] | about_sections |
| `getAboutSectionByKey()` | key | AboutSection\|null | about_sections |
| `getPublishedArticles()` | - | Article[] | articles, article_categories, article_tags |
| `getArticleBySlug()` | slug | Article\|null | articles, article_categories, article_tags |
| `getArticlesByCategory()` | categorySlug | Article[] | articles, article_categories, article_tags |
| `getArticleCategories()` | - | ArticleCategory[] | article_categories |
| `getArticleTags()` | - | ArticleTag[] | article_tags |
| `incrementArticleViews()` | articleId | void | articles |

## Performance Optimizations

1. **Indexes** on frequently queried columns:
   - `photos.album_id`
   - `photos.sort_order`
   - `photo_albums.key`
   - `projects.status`
   - `articles.status`
   - `articles.slug`
   - `articles.published_at`

2. **Sorted queries** using `sort_order` field
   - Photos ordered within albums
   - Projects in custom order
   - Experience in chronological order

3. **RLS Policies** filter at database level
   - No inactive content sent over network
   - Reduced data transfer
   - Better security

4. **Selective fields** in queries
   - Only fetch needed columns
   - Join related data efficiently
   - Reduce payload size

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] RLS policies enabled
- [ ] Environment variables set in production
- [ ] Content added to tables
- [ ] Test endpoint verified (`/api/test-db`)
- [ ] All components tested with real data
- [ ] Fallback content customized

---

**Architecture Status:** ✅ Complete and Production-Ready

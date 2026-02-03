# Database API Reference

Quick reference for all database functions available in the portfolio.

## 📸 Photos API (`lib/photos.ts`)

### `getPhotosByAlbumKey(albumKey: string): Promise<Photo[]>`
Fetch all photos from a specific album.

```typescript
import { getPhotosByAlbumKey } from '@/lib/photos'

const photos = await getPhotosByAlbumKey('about-widget')
```

**Returns:**
```typescript
interface Photo {
  id: number
  album_id: number
  image_url: string
  alt_text: string | null
  caption: string | null
  taken_date: string | null
  sort_order: number
  is_featured: boolean
}
```

---

### `getActiveAlbums(): Promise<PhotoAlbum[]>`
Fetch all active photo albums.

```typescript
import { getActiveAlbums } from '@/lib/photos'

const albums = await getActiveAlbums()
```

**Returns:**
```typescript
interface PhotoAlbum {
  id: number
  key: string
  title: string
  description: string | null
  is_active: boolean
  sort_order: number
}
```

---

## 📝 About API (`lib/about.ts`)

### `getActiveAboutSections(): Promise<AboutSection[]>`
Fetch all active about sections.

```typescript
import { getActiveAboutSections } from '@/lib/about'

const sections = await getActiveAboutSections()
```

**Returns:**
```typescript
interface AboutSection {
  id: number
  key: string
  title: string | null
  content: string
  is_active: boolean
  sort_order: number
}
```

---

### `getAboutSectionByKey(key: string): Promise<AboutSection | null>`
Fetch a specific about section by key.

```typescript
import { getAboutSectionByKey } from '@/lib/about'

const section = await getAboutSectionByKey('about-main-1')
```

---

## 📰 Articles API (`lib/articles.ts`)

### `getPublishedArticles(): Promise<Article[]>`
Fetch all published articles, sorted by date (newest first).

```typescript
import { getPublishedArticles } from '@/lib/articles'

const articles = await getPublishedArticles()
```

**Returns:**
```typescript
interface Article {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  featured_image_alt: string | null
  author: string
  published_at: string | null
  view_count: number
  reading_time_minutes: number | null
  category?: ArticleCategory | null
  tags?: ArticleTag[]
}
```

---

### `getArticleBySlug(slug: string): Promise<Article | null>`
Fetch a single article by its slug.

```typescript
import { getArticleBySlug } from '@/lib/articles'

const article = await getArticleBySlug('getting-started-with-react')
```

---

### `getArticlesByCategory(categorySlug: string): Promise<Article[]>`
Fetch all articles in a specific category.

```typescript
import { getArticlesByCategory } from '@/lib/articles'

const articles = await getArticlesByCategory('development')
```

---

### `getArticleCategories(): Promise<ArticleCategory[]>`
Fetch all article categories.

```typescript
import { getArticleCategories } from '@/lib/articles'

const categories = await getArticleCategories()
```

**Returns:**
```typescript
interface ArticleCategory {
  id: number
  name: string
  slug: string
  description: string | null
}
```

---

### `getArticleTags(): Promise<ArticleTag[]>`
Fetch all article tags.

```typescript
import { getArticleTags } from '@/lib/articles'

const tags = await getArticleTags()
```

**Returns:**
```typescript
interface ArticleTag {
  id: number
  name: string
  slug: string
}
```

---

### `incrementArticleViews(articleId: number): Promise<void>`
Increment the view count for an article.

```typescript
import { incrementArticleViews } from '@/lib/articles'

await incrementArticleViews(1)
```

**Note:** Requires a Postgres function to be created:
```sql
CREATE OR REPLACE FUNCTION increment_article_views(article_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔧 Supabase Client (`lib/supabase.ts`)

### `getSupabaseClient()`
Get the Supabase client instance.

```typescript
import { getSupabaseClient } from '@/lib/supabase'

const supabase = getSupabaseClient()
if (!supabase) {
  // Environment variables not set
  return fallbackData
}

// Use the client
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

---

## 🧪 Testing API (`lib/test-connection.ts`)

### `testDatabaseConnections()`
Test all database connections and return a detailed report.

```typescript
import { testDatabaseConnections, formatTestResults } from '@/lib/test-connection'

const results = await testDatabaseConnections()
console.log(formatTestResults(results))
```

**Returns:**
```typescript
{
  overall: boolean           // True if all connections work
  results: ConnectionTestResult[]
  summary: string           // Human-readable summary
}
```

---

## Usage Examples

### Example 1: Display Articles
```typescript
// app/blog/page.tsx
import { getPublishedArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/ui/article-card'

export default async function BlogPage() {
  const articles = await getPublishedArticles()
  
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

### Example 2: Article Detail Page
```typescript
// app/blog/[slug]/page.tsx
import { getArticleBySlug, incrementArticleViews } from '@/lib/articles'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    notFound()
  }
  
  // Increment views (optional)
  await incrementArticleViews(article.id)
  
  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  )
}
```

### Example 3: Custom Photo Gallery
```typescript
// app/gallery/page.tsx
import { getActiveAlbums, getPhotosByAlbumKey } from '@/lib/photos'

export default async function GalleryPage() {
  const albums = await getActiveAlbums()
  
  return (
    <div>
      {albums.map(async (album) => {
        const photos = await getPhotosByAlbumKey(album.key)
        return (
          <section key={album.id}>
            <h2>{album.title}</h2>
            <div className="grid grid-cols-3 gap-4">
              {photos.map(photo => (
                <img 
                  key={photo.id} 
                  src={photo.image_url} 
                  alt={photo.alt_text || album.title} 
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

### Example 4: Direct Supabase Query
```typescript
import { getSupabaseClient } from '@/lib/supabase'

export async function getCustomData() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('your_custom_table')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error:', error)
    return []
  }

  return data
}
```

---

## Error Handling

All functions follow this pattern:
1. Check if Supabase client exists
2. If not, return empty array/null
3. Try to fetch data
4. If error, log it and return empty array/null
5. Return data if successful

This ensures graceful degradation - your app works even if the database is unavailable.

---

## Type Safety

All functions are fully typed with TypeScript. Import types like this:

```typescript
import type { Photo, PhotoAlbum } from '@/lib/photos'
import type { AboutSection } from '@/lib/about'
import type { Article, ArticleCategory, ArticleTag } from '@/lib/articles'
```

---

## See Also

- [Database Setup Guide](../DATABASE_SETUP.md)
- [Database Connections Summary](../DATABASE_CONNECTIONS.md)
- [Main README](../README.md)

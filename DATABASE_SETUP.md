# Database Setup Guide

This guide will help you set up your Supabase database for the portfolio website.

## Overview

The portfolio uses Supabase as an optional backend to store:
- **Articles/Blog Posts** - Dynamic content for your blog
- **About Sections** - Editable about text
- **Photo Albums & Photos** - Images for the photo widget
- **Projects** - Portfolio projects with technologies
- **Experience Sections** - Work experience and education

## Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be provisioned

### 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `lib/database-schema.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run**

This will create all necessary tables, indexes, and Row Level Security policies.

### 5. Add Your Content

#### Photo Albums & Photos

```sql
-- Create a photo album
INSERT INTO photo_albums (key, title, description, is_active, sort_order)
VALUES ('about-widget', 'About Section Photos', 'Photos for the about widget', true, 0);

-- Add photos to the album (get the album id first)
INSERT INTO photos (album_id, image_url, alt_text, caption, sort_order)
VALUES 
  (1, '/photos/photo1.png', 'Memory 01', 'Childhood memories', 0),
  (1, '/photos/photo2.png', 'Memory 02', 'Class gathering', 1);
```

#### About Sections

```sql
INSERT INTO about_sections (key, content, is_active, sort_order)
VALUES 
  ('about-main-1', 'Your first paragraph about yourself...', true, 0),
  ('about-main-2', 'Your second paragraph...', true, 1);
```

#### Projects

```sql
-- Add a technology
INSERT INTO technologies (name) VALUES ('React');

-- Add a project
INSERT INTO projects (title, summary, featured_image_url, featured_image_alt, external_url, status, sort_order)
VALUES (
  'My Awesome Project',
  'A brief description of the project',
  '/projects/my-project.jpg',
  'Project screenshot',
  'https://github.com/username/repo',
  'active',
  0
);

-- Link project to technology
INSERT INTO project_technologies (project_id, technology_id)
VALUES (1, 1);
```

#### Experience/Content Sections

```sql
-- Add a section tag
INSERT INTO section_tags (name) VALUES ('React');

-- Add an experience entry
INSERT INTO content_sections (key, title, subtitle, time_range, body, status, sort_order)
VALUES (
  'experience_1',
  'Senior Developer',
  'Tech Company',
  '2024 — Present',
  'Working on amazing projects...',
  'active',
  0
);

-- Add highlights to the experience
INSERT INTO section_highlights (section_id, text, sort_order)
VALUES 
  (1, 'React', 0),
  (1, 'TypeScript', 1),
  (1, 'Node.js', 2);
```

#### Articles

```sql
-- Add an article category
INSERT INTO article_categories (name, slug, description)
VALUES ('Development', 'development', 'Software development articles');

-- Add article tags
INSERT INTO article_tags (name, slug) VALUES ('React', 'react');
INSERT INTO article_tags (name, slug) VALUES ('TypeScript', 'typescript');

-- Add an article
INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  featured_image_url,
  featured_image_alt,
  category_id,
  author,
  status,
  published_at,
  reading_time_minutes
)
VALUES (
  'Getting Started with React',
  'getting-started-with-react',
  'Learn the basics of React in this comprehensive guide',
  '# Getting Started with React\n\nYour article content here...',
  '/articles/react-article.jpg',
  'React logo',
  1,
  'Victor Valero',
  'published',
  NOW(),
  5
);

-- Link article to tags
INSERT INTO articles_article_tags (article_id, tag_id)
VALUES (1, 1), (1, 2);
```

## Database Structure

### Tables Overview

| Table | Purpose |
|-------|---------|
| `photo_albums` | Photo album collections |
| `photos` | Individual photos within albums |
| `projects` | Portfolio projects |
| `technologies` | Technology tags for projects |
| `project_technologies` | Many-to-many relationship between projects and technologies |
| `content_sections` | Dynamic content sections (experience, education, etc.) |
| `section_highlights` | Bullet points/highlights for content sections |
| `section_tags` | Tags for content sections |
| `content_section_tags` | Many-to-many relationship between sections and tags |
| `about_sections` | About text paragraphs |
| `articles` | Blog posts/articles |
| `article_categories` | Article categories |
| `article_tags` | Article tags |
| `articles_article_tags` | Many-to-many relationship between articles and tags |

## API Usage

### Using the Library Functions

The project includes helper functions in the `lib/` directory:

```typescript
// Fetch photos
import { getPhotosByAlbumKey } from '@/lib/photos'
const photos = await getPhotosByAlbumKey('about-widget')

// Fetch about sections
import { getActiveAboutSections } from '@/lib/about'
const aboutSections = await getActiveAboutSections()

// Fetch articles
import { getPublishedArticles } from '@/lib/articles'
const articles = await getPublishedArticles()
```

## Components Connected to Database

### ✅ Already Connected

1. **PhotoWidget** (`components/ui/photo-widget.tsx`)
   - Fetches photos from `photos` table
   - Uses `getPhotosByAlbumKey()` function
   - Album key: `about-widget`

2. **ProjectsGrid** (`components/ui/projects-grid.tsx`)
   - Fetches projects from `projects` table
   - Includes related technologies
   - Falls back to hardcoded projects

3. **ExperienceSection** (`components/ui/experience-section.tsx`)
   - Fetches experience from `content_sections` table
   - Includes highlights and tags
   - Falls back to hardcoded experience

4. **AboutQuote** (`components/ui/about-quote.tsx`)
   - Fetches about text from `about_sections` table
   - Falls back to hardcoded content

### Article Components (Ready to Use)

You can now create article list and detail pages using the provided functions:

```typescript
// In your article list page
import { getPublishedArticles } from '@/lib/articles'

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()
  
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
```

## Fallback Strategy

All components are designed to work **without a database connection**. They will:

1. Attempt to fetch data from Supabase
2. If the connection fails or returns no data, use fallback content
3. Display an optional error message (commented out in production)

This ensures your portfolio works even if:
- Environment variables are not set
- Supabase is temporarily unavailable
- You haven't set up the database yet

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public Read**: Anyone can read published/active content
- **No Public Write**: Only authenticated users (you) can modify data

To manage content, you can:
1. Use the Supabase Dashboard
2. Create a custom admin panel
3. Use SQL queries directly

## Troubleshooting

### No data appearing?

1. Check environment variables in `.env.local`
2. Verify the database schema was run successfully
3. Check that you've added content to the tables
4. Look for errors in the browser console

### "Unable to load from database" message?

This usually means:
- Environment variables are missing
- Supabase credentials are incorrect
- RLS policies are blocking access (verify policies)

## Next Steps

1. **Add your content** to the database tables
2. **Upload images** to Supabase Storage (optional)
3. **Create article pages** using the article functions
4. **Customize** the fallback content in components
5. **Add more fields** to tables as needed

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project README](./README.md)

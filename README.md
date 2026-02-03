# Victor Valero Portfolio

A modern Next.js portfolio website showcasing design and development work.

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion, GSAP
- **Forms**: React Hook Form with Formspree
- **Database**: Supabase (optional)
- **Package Manager**: pnpm

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

To create a production build:

```bash
pnpm build
pnpm start
```

## Environment Variables (Optional)

If you want to use Supabase for dynamic content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

The application works without these variables and will fall back to local data.

**See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed database setup instructions.**

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and database helpers
  - `supabase.ts` - Supabase client setup
  - `photos.ts` - Photo album functions
  - `articles.ts` - Article/blog functions
  - `about.ts` - About section functions
  - `database-schema.sql` - Complete database schema
- `/public` - Static assets (images, music, etc.)

## Database-Connected Components

The following components fetch data from Supabase (with fallback to local data):

- **PhotoWidget** - Displays photos from the database
- **ProjectsGrid** - Shows portfolio projects with technologies
- **ExperienceSection** - Displays work experience and education
- **AboutQuote** - Dynamic about text content
- **ArticlesList** - Blog posts/articles (component ready to use)

All components work without a database connection and will gracefully fall back to hardcoded content.

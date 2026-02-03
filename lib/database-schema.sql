-- Portfolio Database Schema for Supabase
-- This file contains all the necessary tables and relationships for the portfolio

-- ============================================
-- Photo Albums & Photos (Already implemented)
-- ============================================

CREATE TABLE IF NOT EXISTS photo_albums (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  album_id INTEGER REFERENCES photo_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  caption TEXT,
  taken_date DATE,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Projects (Already implemented)
-- ============================================

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  featured_image_alt VARCHAR(255),
  external_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technologies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

-- ============================================
-- Content Sections (For About, Experience, etc.)
-- ============================================

CREATE TABLE IF NOT EXISTS section_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_sections (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  time_range VARCHAR(100),
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS section_highlights (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_section_tags (
  section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES section_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (section_id, tag_id)
);

-- ============================================
-- About Section (For dynamic about text)
-- ============================================

CREATE TABLE IF NOT EXISTS about_sections (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Articles/Blog Posts
-- ============================================

CREATE TABLE IF NOT EXISTS article_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  featured_image_alt VARCHAR(255),
  category_id INTEGER REFERENCES article_categories(id) ON DELETE SET NULL,
  author VARCHAR(255) DEFAULT 'Victor Valero',
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS article_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles_article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES article_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_sort_order ON photos(sort_order);
CREATE INDEX IF NOT EXISTS idx_photo_albums_key ON photo_albums(key);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON content_sections(key);
CREATE INDEX IF NOT EXISTS idx_content_sections_status ON content_sections(status);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_about_sections_key ON about_sections(key);
CREATE INDEX IF NOT EXISTS idx_about_sections_is_active ON about_sections(is_active);

-- ============================================
-- RLS (Row Level Security) Policies
-- Enable public read access for published content
-- ============================================

ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_section_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles_article_tags ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view active photo albums" ON photo_albums FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Public can view active projects" ON projects FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "Public can view project technologies" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Public can view active content sections" ON content_sections FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view section highlights" ON section_highlights FOR SELECT USING (true);
CREATE POLICY "Public can view section tags" ON section_tags FOR SELECT USING (true);
CREATE POLICY "Public can view content section tags" ON content_section_tags FOR SELECT USING (true);
CREATE POLICY "Public can view active about sections" ON about_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view article categories" ON article_categories FOR SELECT USING (true);
CREATE POLICY "Public can view article tags" ON article_tags FOR SELECT USING (true);
CREATE POLICY "Public can view articles article tags" ON articles_article_tags FOR SELECT USING (true);

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Sample photo album for about widget
INSERT INTO photo_albums (key, title, description, is_active, sort_order) 
VALUES ('about-widget', 'About Section Photos', 'Photos displayed in the about section widget', true, 0)
ON CONFLICT (key) DO NOTHING;

-- Sample about section
INSERT INTO about_sections (key, title, content, is_active, sort_order)
VALUES 
  ('about-main-1', NULL, 'We believe building beautiful, functional products should be simple. This template shows how AI and smart prompting make it easy to turn ideas into clean, professional interfaces.', true, 0),
  ('about-main-2', NULL, 'It''s designed to highlight key features, scale with your content, and let your AI-powered product shine - without extra setup or complexity.', true, 1)
ON CONFLICT (key) DO NOTHING;

-- Sample article category
INSERT INTO article_categories (name, slug, description)
VALUES 
  ('Development', 'development', 'Articles about software development and coding'),
  ('Design', 'design', 'Articles about design and UX'),
  ('Tutorials', 'tutorials', 'Step-by-step tutorials and guides')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Database Functions
-- ============================================

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_article_views(article_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at
CREATE TRIGGER update_photo_albums_updated_at BEFORE UPDATE ON photo_albums
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_sections_updated_at BEFORE UPDATE ON about_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

import { getSupabaseClient } from "./supabase"

export interface Article {
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

export interface ArticleCategory {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface ArticleTag {
  id: number
  name: string
  slug: string
}

/**
 * Fetch all published articles
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        featured_image_alt,
        author,
        published_at,
        view_count,
        reading_time_minutes,
        article_categories (
          id,
          name,
          slug,
          description
        ),
        articles_article_tags (
          article_tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching articles:", error)
      return []
    }

    return (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image_url: article.featured_image_url,
      featured_image_alt: article.featured_image_alt,
      author: article.author,
      published_at: article.published_at,
      view_count: article.view_count,
      reading_time_minutes: article.reading_time_minutes,
      category: article.article_categories,
      tags: article.articles_article_tags?.map((t: any) => t.article_tags).filter(Boolean) || [],
    }))
  } catch (error) {
    console.error("Error in getPublishedArticles:", error)
    return []
  }
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return null
    }

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        featured_image_alt,
        author,
        published_at,
        view_count,
        reading_time_minutes,
        article_categories (
          id,
          name,
          slug,
          description
        ),
        articles_article_tags (
          article_tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error) {
      console.error("Error fetching article:", error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featured_image_url: data.featured_image_url,
      featured_image_alt: data.featured_image_alt,
      author: data.author,
      published_at: data.published_at,
      view_count: data.view_count,
      reading_time_minutes: data.reading_time_minutes,
      category: data.article_categories,
      tags: data.articles_article_tags?.map((t: any) => t.article_tags).filter(Boolean) || [],
    }
  } catch (error) {
    console.error("Error in getArticleBySlug:", error)
    return null
  }
}

/**
 * Fetch articles by category
 */
export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        featured_image_alt,
        author,
        published_at,
        view_count,
        reading_time_minutes,
        article_categories!inner (
          id,
          name,
          slug,
          description
        ),
        articles_article_tags (
          article_tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("status", "published")
      .eq("article_categories.slug", categorySlug)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching articles by category:", error)
      return []
    }

    return (data || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image_url: article.featured_image_url,
      featured_image_alt: article.featured_image_alt,
      author: article.author,
      published_at: article.published_at,
      view_count: article.view_count,
      reading_time_minutes: article.reading_time_minutes,
      category: article.article_categories,
      tags: article.articles_article_tags?.map((t: any) => t.article_tags).filter(Boolean) || [],
    }))
  } catch (error) {
    console.error("Error in getArticlesByCategory:", error)
    return []
  }
}

/**
 * Fetch all article categories
 */
export async function getArticleCategories(): Promise<ArticleCategory[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching article categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getArticleCategories:", error)
    return []
  }
}

/**
 * Fetch all article tags
 */
export async function getArticleTags(): Promise<ArticleTag[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from("article_tags")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching article tags:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getArticleTags:", error)
    return []
  }
}

/**
 * Increment article view count
 */
export async function incrementArticleViews(articleId: number): Promise<void> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return
    }

    const { error } = await supabase.rpc("increment_article_views", {
      article_id: articleId,
    })

    if (error) {
      console.error("Error incrementing article views:", error)
    }
  } catch (error) {
    console.error("Error in incrementArticleViews:", error)
  }
}

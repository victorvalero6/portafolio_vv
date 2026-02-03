"use client"

import { useEffect, useState } from "react"
import { getPublishedArticles, type Article } from "@/lib/articles"
import { ArticleCard } from "./article-card"
import { BookOpen, FileText } from "lucide-react"
import DotPattern from "./dot-pattern"

export function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      setIsLoading(true)
      try {
        const fetchedArticles = await getPublishedArticles()

        if (!isMounted) return

        setArticles(fetchedArticles)
        if (fetchedArticles.length === 0) {
          setLoadError("No articles found")
        }
      } catch (error) {
        if (isMounted) {
          setLoadError("Failed to load articles")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="relative w-full">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm animate-pulse"
            >
              <div className="aspect-[16/9] w-full bg-white/10" />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="h-6 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loadError || articles.length === 0) {
    return (
      <div className="relative w-full">
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center">
          <div className="mb-4 rounded-full bg-white/5 p-4">
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-open-sans-custom">
            No Articles Yet
          </h3>
          <p className="text-gray-400 font-open-sans-custom max-w-md">
            Articles will appear here once you add them to your database. Check the DATABASE_SETUP.md
            file for instructions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Background decoration */}
      <div className="absolute -left-10 -top-10 h-64 w-64 bg-green-500/10 blur-[100px]" />

      {/* Section Header */}
      <div className="mb-12 flex flex-col gap-4 border-l-2 border-white/10 pl-6 md:flex-row md:items-end md:justify-between md:border-l-0 md:pl-0">
        <div className="relative">
          {/* Dot Pattern for header */}
          <div className="absolute -left-4 -top-8 -z-10 h-24 w-24 opacity-20">
            <DotPattern width={8} height={8} cx={1} cy={1} cr={1} className="fill-white" />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-open-sans-custom">
              Latest Articles
            </p>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom md:text-5xl">
            Blog & Insights
          </h2>
        </div>

        {/* Technical Deco Line */}
        <div className="hidden md:flex items-center gap-2 opacity-50">
          <div className="h-[1px] w-24 bg-white/20" />
          <span className="text-[10px] text-gray-400 font-mono">
            TOTAL: {articles.length}
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { Calendar, Clock, Eye, Tag } from "lucide-react"
import Link from "next/link"
import type { Article } from "@/lib/articles"

interface ArticleCardProps {
  article: Article
  className?: string
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 cursor-target",
        "hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]",
        className
      )}
    >
      {/* Featured Image */}
      {article.featured_image_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/5">
          {/* Scanline Overlay */}
          <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          
          <img
            src={article.featured_image_url}
            alt={article.featured_image_alt ?? article.title}
            className="h-full w-full object-cover transition-all duration-700 opacity-80 grayscale-[0.3] group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Category & Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {article.category && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] uppercase tracking-wider text-green-400 font-mono">
              <Tag className="h-3 w-3" />
              {article.category.name}
            </span>
          )}
          {article.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="rounded border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-300 font-open-sans-custom transition-colors group-hover:border-white/20 group-hover:text-white"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-open-sans-custom tracking-tight group-hover:text-green-400 transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm leading-relaxed text-gray-400 font-open-sans-custom line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-gray-500 font-open-sans-custom pt-4 border-t border-white/5">
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          )}
          {article.reading_time_minutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.reading_time_minutes} min read</span>
            </div>
          )}
          {article.view_count > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.view_count} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-2 w-2 border-t border-r border-white/50" />
      </div>
      <div className="absolute bottom-0 left-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-2 w-2 border-b border-l border-white/50" />
      </div>
    </Link>
  )
}

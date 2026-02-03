"use client"

import { cn } from "@/lib/utils"
import { ArrowUpRight, Folder, GitFork } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/translations"
import DotPattern from "@/components/ui/dot-pattern"
import { getSupabaseClient } from "@/lib/supabase"

interface Project {
  id?: number
  title: string
  summary: string
  tags: string[]
  image: string
  imageAlt?: string
  link?: string
}

type SupabaseProjectRow = {
  id: number
  title: string
  summary: string
  featured_image_url: string
  featured_image_alt: string | null
  external_url: string | null
  sort_order: number
  project_technologies?: {
    technologies?: { name?: string } | { name?: string }[] | null
  }[]
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Format index to look like "01", "02"
  const projectIndex = (index + 1).toString().padStart(2, '0');
  const link = project.link ?? "#"
  const isExternal = Boolean(project.link)

  return (
    <a
      href={link}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 cursor-target",
        "hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Technical Header inside Card */}
      <div className="flex items-center justify-between border-b border-white/5 bg-black/20 px-4 py-3">
        <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-green-500/80">PRJ-{projectIndex}</span>
            <div className="h-3 w-[1px] bg-white/10"></div>
            <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-green-400 transition-colors"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
            </div>
        </div>
        <ArrowUpRight
            className={cn(
            "h-4 w-4 text-white/40 transition-all duration-300",
            isHovered && "translate-x-0.5 -translate-y-0.5 text-white"
            )}
        />
      </div>

      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-white/5">
        {/* Scanline Overlay */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.imageAlt ?? project.title}
          className={cn(
            "h-full w-full object-cover transition-all duration-700 opacity-80 grayscale-[0.5]",
            isHovered && "scale-105 opacity-100 grayscale-0"
          )}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* UPDATED: Added group-hover:text-green-400 */}
          <h3 className="mb-2 text-xl font-bold text-white [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-open-sans-custom tracking-tight group-hover:text-green-400 transition-colors">
            {project.title}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-400 font-open-sans-custom">
            {project.summary}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-300 font-open-sans-custom transition-colors group-hover:border-white/20 group-hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-2 w-2 border-t border-r border-white/50"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-2 w-2 border-b border-l border-white/50"></div>
      </div>
    </a>
  )
}

export function ProjectsGrid() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const fallbackProjects: Project[] = [
    {
      title: t("caritas"),
      summary: t("caritasDesc"),
      tags: ["Swift", "iOS", "Maps", "Dashboards"],
      image: "/projects/caritas-mockup.jpg",
      link: "https://github.com/victorvalero6/Caritas-de-Monterrey.git",
      imageAlt: "Caritas app preview",
    },
    {
      title: t("whirlpool"),
      summary: t("whirlpoolDesc"),
      tags: ["React", "Unity", "Full-Stack", "Database"],
      image: "/projects/whirlpool.jpg",
      link: "https://github.com/victorvalero6/Whirlpool-React-Web.git",
      imageAlt: "Whirlpool project preview",
    },
    {
      title: t("mobile"),
      summary: t("mobileDesc"),
      tags: ["React Native", "Firebase", "Plaid"],
      image: "/projects/mobile-app.jpg",
      link: "#",
      imageAlt: "Mobile app preview",
    },
    {
      title: t("spaceGame"),
      summary: t("spaceGameDesc"),
      tags: ["JavaScript", "HTML5 Canvas", "Game Dev"],
      image: "/projects/space-game.jpg",
      link: "https://github.com/victorvalero6/Space-Game-.git",
      imageAlt: "Space game preview",
    },
  ]

  useEffect(() => {
    let isMounted = true

    const loadProjects = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setLoadError("Supabase client not initialized")
        return
      }

      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          id,
          title,
          summary,
          featured_image_url,
          featured_image_alt,
          external_url,
          sort_order,
          project_technologies (
            technologies ( name )
          )
        `
        )
        .eq("status", "active")
        .order("sort_order", { ascending: true })

      if (!isMounted) return

      if (error) {
        setLoadError(error.message)
        return
      }

      const rows = Array.isArray(data) ? data : []
      const mapped = rows.map((row) => {
        const project = row as SupabaseProjectRow
        const tags =
          project.project_technologies?.flatMap((rel) => {
            const tech = rel.technologies
            if (!tech) return []
            if (Array.isArray(tech)) {
              return tech.map((item) => item?.name).filter(Boolean) as string[]
            }
            return tech.name ? [tech.name] : []
          }) ?? []

        return {
          id: project.id,
          title: project.title,
          summary: project.summary,
          image: project.featured_image_url,
          imageAlt: project.featured_image_alt ?? project.title,
          link: project.external_url ?? undefined,
          tags,
        }
      })

      setProjects(mapped)
    }

    loadProjects()

    return () => {
      isMounted = false
    }
  }, [t])

  const projectsToRender = projects?.length ? projects : fallbackProjects

  return (
    <div className="relative w-full">
      {/* Background decoration for the section */}
      <div className="absolute -left-10 -top-10 h-64 w-64 bg-indigo-500/10 blur-[100px]" />
      
      {/* Section Header */}
      <div className="mb-12 flex flex-col gap-4 border-l-2 border-white/10 pl-6 md:flex-row md:items-end md:justify-between md:border-l-0 md:pl-0">
        <div className="relative">
            {/* Dot Pattern specifically for header area */}
            <div className="absolute -left-4 -top-8 -z-10 h-24 w-24 opacity-20">
               <DotPattern width={8} height={8} cx={1} cy={1} cr={1} className="fill-white" />
            </div>
            
            <div className="flex items-center gap-3 mb-2">
                <Folder className="h-4 w-4 text-gray-500" />
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-open-sans-custom">
                {t("selectedWork")}
                </p>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom md:text-5xl">
            {t("recentProjects")}
            </h2>
        </div>
        
        {/* Technical Deco Line */}
        <div className="hidden md:flex items-center gap-2 opacity-50">
             <div className="h-[1px] w-24 bg-white/20"></div>
             <span className="text-[10px] text-gray-400 font-mono">INDEX_VOL.01</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {projectsToRender.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>

      {loadError && (
        <p className="mt-4 text-center text-xs text-gray-500 font-open-sans-custom">
          Unable to load projects from the database. Showing fallback content.
        </p>
      )}
    </div>
  )
}

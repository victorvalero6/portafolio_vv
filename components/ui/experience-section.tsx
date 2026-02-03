"use client"

import { cn } from "@/lib/utils"
import DotPattern from "@/components/ui/dot-pattern"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "@/lib/translations"
import Image from "next/image" // Assuming you use Next.js Image
import { supabase } from "@/lib/supabase"
import { NowPlayingCard, type NowPlayingTrack } from "@/components/ui/now-playing-card"
import { PhotoWidget } from "@/components/ui/photo-widget"

interface Experience {
  period: string
  role: string
  focus?: string
  desc: string
  skills: string[]
}

type ExperienceRow = {
  id: number
  key: string
  title: string
  subtitle: string | null
  time_range: string | null
  body: string
  sort_order: number
  section_highlights?: { text: string; sort_order: number }[]
  content_section_tags?: { section_tags?: { name?: string } | null }[]
}

function ExperienceCard({ experience, index, totalCards }: { experience: Experience; index: number; totalCards: number }) {
  const isCurrent = index === totalCards - 1

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
      )}
    >
      {/* Decorative Corner accents appearing on hover */}
      <div className="absolute -left-px -top-px h-2 w-2 bg-white opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -bottom-px -right-px h-2 w-2 bg-white opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium tracking-wider font-open-sans-custom",
          isCurrent ? "text-white" : "text-gray-400"
        )}>
          {experience.period}
        </span>
        {isCurrent && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] font-open-sans-custom">
          {experience.role}
          {experience.focus && (
            <span className="block text-xs sm:text-sm font-normal text-gray-400 mt-1">
              {experience.focus}
            </span>
          )}
        </h3>
        
        <p className="text-xs sm:text-sm leading-relaxed text-gray-300/90 font-open-sans-custom">
          {experience.desc}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {experience.skills.map((skill, i) => (
          <span
            key={i}
            className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-300 font-open-sans-custom transition-colors group-hover:border-white/20 group-hover:text-white"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ExperienceSection({
  nowPlaying,
  isPlaying = false,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  currentTime = 0,
  duration = 0,
}: {
  nowPlaying?: NowPlayingTrack
  isPlaying?: boolean
  onTogglePlay?: () => void
  onNextTrack?: () => void
  onPrevTrack?: () => void
  currentTime?: number
  duration?: number
}) {
  const { t } = useTranslation()
  const [experiences, setExperiences] = useState<Experience[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const fallbackExperiences = useMemo<Experience[]>(
    () => [
      {
        period: "2026 — Present",
        role: t("creativeTechnologist"),
        focus: t("creativeTechnologistFocus"),
        desc: t("creativeTechnologistDesc"),
        skills: ["Creative Direction", "Frontend", "Backend", "APIs", "Visual Systems", "Mobile"],
      },
      {
        period: "2025",
        role: t("fullStackDev"),
        desc: t("fullStackDevDesc"),
        skills: ["Full-Stack Development", "Swift", "Unity", "Databases", "APIs", "Functional Programming"],
      },
      {
        period: "2024",
        role: t("systemsArch"),
        desc: t("systemsArchDesc"),
        skills: ["OOP", "Software Architecture", "Assembly", "Computational Biology", "Git"],
      },
      {
        period: "2023",
        role: t("foundations"),
        desc: t("foundationsDesc"),
        skills: ["Programming Fundamentals", "Data Structures", "OOP Thinking"],
      },
    ],
    [t]
  )

  useEffect(() => {
    let isMounted = true

    const loadExperiences = async () => {
      const { data, error } = await supabase
        .from("content_sections")
        .select(
          `
          id,
          key,
          title,
          subtitle,
          time_range,
          body,
          sort_order,
          section_highlights ( text, sort_order ),
          content_section_tags ( section_tags ( name ) )
        `
        )
        .eq("status", "active")
        .ilike("key", "experience_%")
        .order("sort_order", { ascending: true })

      if (!isMounted) return

      if (error) {
        setLoadError(error.message)
        return
      }

      const rows = Array.isArray(data) ? data : []
      const mapped = rows.map((row) => {
        const item = row as ExperienceRow
        const highlights =
          item.section_highlights?.length
            ? [...item.section_highlights]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((h) => h.text)
            : []
        const tags =
          item.content_section_tags?.map((tag) => tag.section_tags?.name).filter(Boolean) as string[] | undefined

        return {
          period: item.time_range ?? "",
          role: item.title,
          focus: item.subtitle ?? undefined,
          desc: item.body,
          skills: highlights.length > 0 ? highlights : tags ?? [],
        }
      })

      setExperiences(mapped)
    }

    loadExperiences()

    return () => {
      isMounted = false
    }
  }, [t])

  // Always use fallback experiences for proper translation support
  const experiencesToRender = fallbackExperiences

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-4 md:px-6 lg:px-10">
      
      {/* Grid Layout: Left (Info) - Right (Cards) */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 lg:items-start">
        
        {/* Left Column: Static Info */}
        <div className="flex flex-col gap-6 md:gap-8 order-1 lg:order-none">
            
          {/* Profile Picture Section */}
          <div className="relative aspect-square w-40 sm:w-48 mx-auto lg:mx-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm group/profile">
             {/* Dot pattern inside the image box for texture */}
            <DotPattern width={16} height={16} cx={1} cy={1} cr={1} className="absolute inset-0 -z-10 opacity-30 fill-white/20" />
            
            {/* Default Image */}
            <Image
              src="/placeholder-user.jpg"
              alt="Profile photo"
              fill
              className="object-cover opacity-90 transition-opacity duration-500 group-hover/profile:opacity-0"
              priority
            />

            {/* Hover Image */}
            <Image
              src="/profile-hover.png"
              alt="Profile photo hover"
              fill
              className="object-cover opacity-0 transition-opacity duration-500 group-hover/profile:opacity-90"
            />

            {/* Corner decorations for the picture box */}
            <div className="absolute -left-1 -top-1 h-3 w-3 border-l border-t border-white/40" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-white/40" />
          </div>

          {/* Header Block */}
          <div className="relative text-center lg:text-left">
            <p className="mb-3 md:mb-4 text-xs uppercase tracking-[0.2em] text-gray-500 font-open-sans-custom">
              {t("background")}
            </p>
            <h2 className="mb-4 md:mb-6 text-3xl sm:text-4xl font-bold tracking-tight text-white [text-shadow:_0_4px_30px_rgb(255_255_255_/_10%)] font-open-sans-custom md:text-5xl">
              {t("experience")}
            </h2>
            <p className="max-w-md mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed text-gray-400 font-open-sans-custom">
              {t("experienceIntro")}
            </p>

            {/* Education & Tech Stack */}
            <div className="mt-6 md:mt-10 flex flex-col gap-6 md:gap-8 font-open-sans-custom">
              
              {/* Education */}
              <div className="relative border-l border-white/10 pl-4">
                <h4 className="mb-2 text-xs font-bold text-white uppercase tracking-widest">{t("education")}</h4>
                <p className="text-gray-200 text-sm font-semibold">Tecnológico de Monterrey</p>
                <p className="text-xs text-gray-500">{t("degree")}</p>
              </div>
              
              {/* Core Tech */}
              <div className="relative border-l border-white/10 pl-4">
                <h4 className="mb-3 text-xs font-bold text-white uppercase tracking-widest">{t("coreTech")}</h4>
                <div className="flex flex-wrap gap-2 max-w-full lg:max-w-xs">
                  {["Next.js", "React", "TypeScript", "Swift", "Clojure", "Unity", "Database", "API"].map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase text-gray-300 transition-colors hover:border-white/30 hover:bg-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Now Playing (bottom-left under Core Tech) */}
              {nowPlaying && (
                <div className="relative border-l border-white/10 pl-4">
                  <NowPlayingCard
                    track={nowPlaying}
                    isPlaying={isPlaying}
                    onToggle={onTogglePlay ?? (() => {})}
                    onNext={onNextTrack}
                    onPrev={onPrevTrack}
                    currentTime={currentTime}
                    duration={duration}
                  />
                </div>
              )}

              {/* Photo Widget (desktop only - shown here) */}
              <div className="hidden lg:block relative border-l border-white/10 pl-4">
                <PhotoWidget albumKey="about-widget" />
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Experience Cards (Full View) */}
        <div className="flex flex-col gap-4 order-2 lg:order-none">
          {experiencesToRender.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} index={index} totalCards={experiencesToRender.length} />
          ))}
        </div>

        {/* Photo Widget (mobile only - shown at bottom) */}
        <div className="lg:hidden order-3 relative border-l border-white/10 pl-4">
          <PhotoWidget albumKey="about-widget" />
        </div>

      </div>

      {loadError && (
        <p className="mt-6 text-center text-xs text-gray-500 font-open-sans-custom">
          Unable to load experience data from the database. Showing fallback content.
        </p>
      )}
    </div>
  )
}
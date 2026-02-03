"use client"

import { useMemo, useEffect, useState, useRef } from "react"
import DotPattern from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import { ArrowDownRight, Cpu, Database, Globe, Layers, Layout, Server, Terminal, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/translations"

type Skill = {
  name: string
  detail?: string
  level: number // 0-100
  icon?: any
}

function SkillRow({ skill, index, isVisible }: { skill: Skill; index: number; isVisible: boolean }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(skill.level)
      }, 200 + index * 100) // Stagger the animation based on index
      return () => clearTimeout(timer)
    } else {
        setWidth(0) // Reset if out of view (optional, makes it replayable)
    }
  }, [isVisible, skill.level, index])

  return (
    <div className="group relative">
      <div className="flex items-end justify-between mb-2">
        <div className="flex items-center gap-3">
            {/* Hexagon-ish Icon Container */}
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-white/5 text-gray-400 group-hover:text-green-400 transition-colors">
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {skill.icon ? <skill.icon className="relative z-10 h-4 w-4" /> : <Terminal className="relative z-10 h-4 w-4" />}
            </div>
            
            {/* Text Info */}
            <div className="flex flex-col">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white group-hover:text-green-400 transition-colors">
                    {skill.name}
                </span>
                {skill.detail && (
                    <span className="font-open-sans-custom text-[10px] text-gray-500">
                        {skill.detail}
                    </span>
                )}
            </div>
        </div>
        
        {/* Percentage Value */}
        <span className="font-mono text-[10px] text-gray-500 group-hover:text-green-400 transition-colors">
          {width}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2 w-full overflow-hidden rounded-sm bg-white/5 border border-white/5">
        
        {/* Grid lines inside bar background */}
        <div className="absolute inset-0 z-0 flex gap-1 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-full w-full border-r border-white" />
            ))}
        </div>

        {/* Animated Fill */}
        <div
          className={cn(
            "h-full bg-gradient-to-r from-gray-500 via-white to-green-400 transition-all duration-[1500ms] ease-out group-hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]",
            "relative overflow-hidden"
          )}
          style={{ width: `${width}%` }}
        >
            {/* Animated Glitch/Scan effect inside the bar */}
            <div className="absolute top-0 right-0 h-full w-1 bg-white blur-[2px] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function SkillsSection({
  className,
  title,
  description,
  onContactClick,
}: {
  className?: string
  title?: string
  description?: string
  onContactClick?: () => void
}) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const displayTitle = title || t("skillsTitle")
  const displayDescription = description || t("skillsDesc")

  const skills = useMemo<Skill[]>(
    () => [
      { name: "JavaScript", detail: "React, Next.js, Node", level: 92, icon: Globe },
      { name: "Swift", detail: "iOS, SwiftUI, UIKit", level: 85, icon: Layers },
      { name: "SQL", detail: "PostgreSQL, Architecture", level: 80, icon: Database },
      { name: "C#", detail: ".NET, Unity Game Dev", level: 78, icon: Layout },
      { name: "Java", detail: "SpringBoot, Systems", level: 72, icon: Cpu },
      { name: "Docker", detail: "Containerization, CI/CD", level: 68, icon: Server },
      { name: "Elixir", detail: "Phoenix Framework", level: 55, icon: Terminal },
    ],
    []
  )

  // Intersection Observer to trigger animation only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className={cn("relative mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:px-10", className)}>
      
      {/* Background Ambience */}
      <div className="absolute right-0 top-20 -z-10 h-96 w-96 bg-green-500/5 blur-[120px]" />

      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20 items-center">
        
        {/* --- LEFT COLUMN: Header & Info --- */}
        <div className="relative">
          <div className="absolute -left-6 -top-10 -z-10 h-40 w-40 opacity-20">
            <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className="fill-white" />
          </div>

          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
             <div className={cn("h-1.5 w-1.5 rounded-full bg-green-500", isVisible ? "animate-pulse" : "opacity-50")} />
             <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                {isVisible ? t("systemOnline") : t("initializing")}
             </span>
          </div>

          <h2 className="text-5xl font-bold tracking-tighter text-white [text-shadow:_0_0_30px_rgb(255_255_255_/_10%)] font-open-sans-custom md:text-6xl mb-6">
            {displayTitle}
          </h2>
          
          <p className="max-w-md text-base leading-relaxed text-gray-400 font-open-sans-custom border-l-2 border-white/10 pl-6">
            {displayDescription}
          </p>

          <div className="mt-12 hidden md:block">
            <div className="flex items-center gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
               <span>Capacity: 100%</span>
               <span className="h-px w-8 bg-gray-800" />
               <span>Load: Optimal</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Diagnostics Card --- */}
        <div className="group/card relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md md:p-10 shadow-2xl">
          
          {/* Scanning Line Effect */}
          <div className={cn(
              "absolute left-0 right-0 h-[1px] bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,1)] z-0 pointer-events-none",
              isVisible ? "animate-[scan_3s_ease-in-out_forwards]" : "hidden"
          )} style={{ top: '-10%' }} />

          {/* Card Texture */}
          <DotPattern width={8} height={8} className="absolute inset-0 opacity-10" />
          
          {/* Header Line */}
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4 relative z-10">
             <div className="flex items-center gap-2">
                 <Zap className="h-3 w-3 text-green-400" />
                 <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">System_Modules</span>
             </div>
             <div className="text-[10px] font-mono text-gray-600">V.2.0</div>
          </div>

          <div className="relative z-10 grid gap-6">
            {skills.map((skill, i) => (
              <SkillRow key={skill.name} skill={skill} index={i} isVisible={isVisible} />
            ))}
          </div>

          {/* --- CENTERED BUTTON --- */}
          <div className="relative z-10 mt-12 flex flex-col items-center justify-center border-t border-white/5 pt-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-2 text-[9px] text-gray-600 uppercase tracking-widest">
                Action Required
            </div>
            
            <Button
                type="button"
                onClick={onContactClick}
                className="group relative h-12 w-full max-w-[200px] overflow-hidden rounded bg-white text-black transition-all hover:bg-green-400 hover:text-black font-mono uppercase tracking-widest cursor-target border-0"
            >
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-xs">
                  {t("contactMe")}
                  <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
                </span>
                
                {/* Button Glitch Background */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/20 transition-transform duration-300 skew-x-12" />
            </Button>
          </div>

          {/* Decorative Corner Brackets */}
          <div className="absolute left-0 top-0 p-3 opacity-50">
             <div className="h-3 w-3 border-l-2 border-t-2 border-white/30" />
          </div>
          <div className="absolute right-0 bottom-0 p-3 opacity-50">
             <div className="h-3 w-3 border-r-2 border-b-2 border-white/30" />
          </div>
          <div className="absolute right-0 top-0 p-3 opacity-50">
             <div className="h-3 w-3 border-r-2 border-t-2 border-white/30" />
          </div>
          <div className="absolute left-0 bottom-0 p-3 opacity-50">
             <div className="h-3 w-3 border-l-2 border-b-2 border-white/30" />
          </div>
        </div>

      </div>
      
      {/* Tailwind Custom Animation Style for Scanner */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
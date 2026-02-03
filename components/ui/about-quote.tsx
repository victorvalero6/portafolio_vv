"use client"

import { useEffect, useState } from "react"
import DotPattern from "@/components/ui/dot-pattern"
import { getActiveAboutSections, type AboutSection } from "@/lib/about"

export function AboutQuote() {
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fallback content
  const fallbackSections = [
    {
      id: 1,
      key: "about-main-1",
      title: null,
      content:
        "We believe building beautiful, functional products should be simple. This template shows how AI and smart prompting make it easy to turn ideas into clean, professional interfaces.",
      is_active: true,
      sort_order: 0,
    },
    {
      id: 2,
      key: "about-main-2",
      title: null,
      content:
        "It's designed to highlight key features, scale with your content, and let your AI-powered product shine - without extra setup or complexity.",
      is_active: true,
      sort_order: 1,
    },
  ]

  useEffect(() => {
    let isMounted = true

    const loadAboutSections = async () => {
      setIsLoading(true)
      const fetchedSections = await getActiveAboutSections()

      if (!isMounted) return

      if (fetchedSections.length > 0) {
        setAboutSections(fetchedSections)
      } else {
        setAboutSections(fallbackSections)
      }
      setIsLoading(false)
    }

    loadAboutSections()

    return () => {
      isMounted = false
    }
  }, [])

  const sectionsToRender = aboutSections.length ? aboutSections : fallbackSections

  if (isLoading) {
    return (
      <div className="mx-auto mb-10 max-w-7xl px-6 md:mb-20 xl:px-0">
        <div className="relative flex flex-col items-center border-2 border-white/20 rounded-lg backdrop-blur-sm bg-white/5 animate-pulse">
          <div className="relative z-20 mx-auto max-w-5xl rounded-[40px] py-6 md:p-10 xl:py-20">
            <div className="space-y-4 md:space-y-6">
              <div className="h-8 bg-white/10 rounded w-full" />
              <div className="h-8 bg-white/10 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mb-10 max-w-7xl px-6 md:mb-20 xl:px-0">
      <div className="relative flex flex-col items-center border-2 border-white/20 rounded-lg backdrop-blur-sm bg-white/5">
        <DotPattern width={5} height={5} />

        {/* Corner decorations */}
        <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-white/80" />
        <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-white/80" />
        <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-white/80" />
        <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-white/80" />

        <div className="relative z-20 mx-auto max-w-5xl rounded-[40px] py-6 md:p-10 xl:py-20">
          <div className="space-y-4 md:space-y-6">
            {sectionsToRender.map((section) => (
              <div key={section.id}>
                {section.title && (
                  <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-2 font-open-sans-custom">
                    {section.title}
                  </h3>
                )}
                <p className="text-base md:text-xl lg:text-2xl xl:text-3xl text-white/90 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-open-sans-custom leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

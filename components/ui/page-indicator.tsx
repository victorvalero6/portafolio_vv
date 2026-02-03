"use client"

import { cn } from "@/lib/utils"

interface PageIndicatorProps {
  currentSection: number
  totalSections: number
  onSectionClick: (index: number) => void
}

export function PageIndicator({
  currentSection,
  totalSections,
  onSectionClick,
}: PageIndicatorProps) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(index)}
            className="group flex items-center"
          >
            <div
              className={cn(
                "rounded-full transition-all duration-300",
                currentSection === index
                  ? "h-2.5 w-2.5 bg-white"
                  : "h-1.5 w-1.5 bg-white/40 group-hover:bg-white/60"
              )}
            />
            {index < totalSections - 1 && (
              <div
                className={cn(
                  "h-[1px] w-6 transition-all duration-300",
                  currentSection > index ? "bg-white/60" : "bg-white/20"
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

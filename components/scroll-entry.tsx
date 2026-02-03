"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

const FIRST_NAME = "VICTOR"
const LAST_NAME = "VALERO"
const NAME = "VICTOR VALERO"

export default function ScrollEntry({ onEnter }: { onEnter: () => void }) {
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 0 to 1 progress
  const progress = useMotionValue(0)
  
  // Smooth out the raw scroll input for a cinematic feel (mass/friction)
  const smoothProgress = useSpring(progress, { damping: 20, stiffness: 100 })
  
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isComplete) return

      // Mark as started on first scroll to hide the hint
      if (!hasStarted && Math.abs(e.deltaY) > 0) setHasStarted(true)

      const current = progress.get()
      // Adjust divisor to control "depth" of the scroll (higher = longer scroll)
      const delta = e.deltaY / 3000 
      
      const newProgress = Math.max(0, Math.min(1, current + delta))
      
      progress.set(newProgress)

      if (newProgress >= 1) {
        setIsComplete(true)
        setTimeout(onEnter, 800) // Wait for transition out
      }
    }

    // Lock scrolling
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchmove", (e) => e.preventDefault())
    }
  }, [progress, isComplete, onEnter, hasStarted])

  // --- Visual Transforms ---
  
  // Background fades from black to transparent (revealing main site) at the very end
  const bgOpacity = useTransform(smoothProgress, [0.8, 1], [1, 0])
  
  // The entire container scales up slightly to simulate momentum
  const containerScale = useTransform(smoothProgress, [0, 1], [1, 1.5])

  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black cursor-none"
      style={{ opacity: bgOpacity, pointerEvents: isComplete ? "none" : "auto" }}
    >
      {/* 3D Perspective Container */}
      <div className="relative flex items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
        {/* Desktop: Single line */}
        <motion.div 
          className="hidden md:flex relative items-center justify-center gap-[0.5em]"
          style={{ scale: containerScale }}
        >
          {NAME.split("").map((char, index) => (
            <Letter 
              key={index} 
              char={char} 
              index={index} 
              total={NAME.length} 
              progress={smoothProgress} 
              reduceMotion={!!reduceMotion}
            />
          ))}
        </motion.div>

        {/* Mobile: Two lines */}
        <motion.div 
          className="flex md:hidden relative flex-col items-center justify-center gap-2"
          style={{ scale: containerScale }}
        >
          {/* First Name */}
          <div className="flex items-center justify-center gap-[0.2em]">
            {FIRST_NAME.split("").map((char, index) => (
              <Letter 
                key={`first-${index}`}
                char={char} 
                index={index} 
                total={NAME.length} 
                progress={smoothProgress} 
                reduceMotion={!!reduceMotion}
              />
            ))}
          </div>
          {/* Last Name */}
          <div className="flex items-center justify-center gap-[0.2em]">
            {LAST_NAME.split("").map((char, index) => (
              <Letter 
                key={`last-${index}`}
                char={char} 
                index={FIRST_NAME.length + 1 + index} 
                total={NAME.length} 
                progress={smoothProgress} 
                reduceMotion={!!reduceMotion}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <motion.div 
        className="absolute bottom-12 z-20 flex flex-col items-center gap-2 text-white/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: hasStarted ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll to Begin</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Individual Letter Component that handles its own Z-flight
function Letter({ 
  char, 
  index, 
  total, 
  progress,
  reduceMotion 
}: { 
  char: string
  index: number
  total: number
  progress: any
  reduceMotion: boolean
}) {
  // Calculate specific trigger points for this letter based on its index
  // We divide the total scroll progress (0-1) into segments for each letter
  
  const step = 1 / total
  const start = index * step
  const end = start + step * 2 // Overlap slightly so multiple letters move at once

  // Z-Position: Moves from 0 (start) to 1000px (past camera)
  // If Reduced Motion: We just fade opacity instead of flying
  const z = useTransform(
    progress, 
    [start, 1], // Start moving when progress hits this letter's index
    [0, 1500], // Fly past camera
    { clamp: false }
  )

  // Opacity: Fades out quickly once it passes the "camera" threshold (z > 500)
  const opacity = useTransform(
    progress,
    [start + step, start + step + 0.1], 
    [1, 0]
  )
  
  // Blur: Adds speed blur as it gets closer to camera
  const blur = useTransform(
    progress,
    [start, start + step],
    ["0px", "10px"]
  )

  // Glow: Letters glow as they approach focus
  const textShadow = useTransform(
    progress,
    [start, start + step/2],
    ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.8)"]
  )

  if (char === " ") {
    return <span className="w-[1rem] md:w-[2rem]" />
  }

  return (
    <motion.span
      className={cn(
        "text-5xl md:text-9xl tracking-tight md:tracking-tighter text-white inline-block origin-center will-change-transform",
        index > 6 ? "font-serif italic" : "font-open-sans-custom not-italic" // Style first/last name differently
      )}
      style={{
        z: reduceMotion ? 0 : z,
        opacity: reduceMotion ? useTransform(progress, [start, end], [1, 0.2]) : opacity,
        filter: reduceMotion ? "none" : useTransform(blur, (b) => `blur(${b})`),
        textShadow: textShadow,
        display: "inline-block",
        backfaceVisibility: "hidden"
      }}
    >
      {char}
    </motion.span>
  )
}

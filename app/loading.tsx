"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"

export default function EntryScreen({ onEnter }: { onEnter: () => void }) {
  const [isComplete, setIsComplete] = useState(false)
  
  // Motion value to track virtual scroll progress (0 to 1)
  const scrollProgress = useMotionValue(0)
  
  // Map scroll progress to visual effects
  // 1. Scale: Starts at 1, zooms into the text massively
  const scale = useTransform(scrollProgress, [0, 1], [1, 50])
  
  // 2. Opacity: Text stays visible until the very end, then fades
  const opacity = useTransform(scrollProgress, [0.8, 1], [1, 0])
  
  // 3. Overlay Fade: The black background fades out to reveal the liquid metal
  const overlayOpacity = useTransform(scrollProgress, [0, 0.8], [1, 0])
  
  // 4. Blur: Text starts sharp, gets blurry as it gets too close (simulating depth)
  const blurValue = useTransform(scrollProgress, [0.6, 1], ["0px", "10px"])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isComplete) return

      // Adjust sensitivity: Lower divider = faster zoom
      const delta = e.deltaY
      const current = scrollProgress.get()
      const newProgress = current + delta / 2000 
      
      // Clamp value between 0 and 1
      const clamped = Math.max(0, Math.min(1, newProgress))
      
      scrollProgress.set(clamped)

      if (clamped >= 1) {
        setIsComplete(true)
        // Delay the actual state change slightly for a smooth transition
        setTimeout(onEnter, 200)
      }
    }

    // Prevent default scrolling behavior during the entry sequence
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchmove", (e) => e.preventDefault())
    }
  }, [scrollProgress, isComplete, onEnter])

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      style={{ opacity: overlayOpacity, pointerEvents: isComplete ? "none" : "auto" }}
    >
      {/* Typography Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        style={{ scale, opacity, filter: `blur(${blurValue})` }}
      >
        <h1 className="text-6xl md:text-9xl tracking-tighter text-white whitespace-nowrap">
          <span className="font-open-sans-custom font-bold">Victor</span>{" "}
          <span className="font-serif italic text-white/80">Valero</span>
        </h1>
        <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.4em] text-white/50 font-open-sans-custom text-center">
          Portfolio Experience
        </p>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div 
        className="absolute bottom-12 z-20 flex flex-col items-center gap-2 text-white/30"
        style={{ opacity: useTransform(scrollProgress, [0, 0.1], [1, 0]) }}
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll to Enter</span>
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
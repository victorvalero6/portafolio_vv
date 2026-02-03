"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, ScanLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPhotosByAlbumKey, type Photo } from "@/lib/photos"
import { motion, AnimatePresence } from "framer-motion"

interface PhotoWidgetProps {
  albumKey?: string
  autoScrollSpeed?: number
  className?: string
}

export function PhotoWidget({ 
  albumKey = "about-widget", 
  autoScrollSpeed = 4000,
  className 
}: PhotoWidgetProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Touch handling refs
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // Shuffle Array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Fallback Data
  const fallbackPhotos: Photo[] = [
    { id: 1, album_id: 1, image_url: "/photos/photo1.png", alt_text: "Memory 01", caption: "Childhood memories", taken_date: null, sort_order: 0, is_featured: false },
    { id: 2, album_id: 1, image_url: "/photos/photo2.png", alt_text: "Memory 02", caption: "Class gathering", taken_date: null, sort_order: 1, is_featured: false },
    { id: 3, album_id: 1, image_url: "/photos/photo3.png", alt_text: "Memory 03", caption: "Event at the stadium", taken_date: null, sort_order: 2, is_featured: false },
    { id: 4, album_id: 1, image_url: "/photos/photo4.png", alt_text: "Memory 04", caption: "Arcade nights", taken_date: null, sort_order: 3, is_featured: false },
  ]

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true)
      const fetchedPhotos = await getPhotosByAlbumKey(albumKey)
      if (fetchedPhotos.length > 0) {
        setPhotos(shuffleArray(fetchedPhotos))
      } else {
        setPhotos(shuffleArray(fallbackPhotos))
      }
      setIsLoading(false)
    }
    loadPhotos()
  }, [albumKey])

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = photos.length - 1
      if (nextIndex >= photos.length) nextIndex = 0
      return nextIndex
    })
  }, [photos.length])

  useEffect(() => {
    if (isHovered || photos.length === 0) return
    const timer = setInterval(() => {
      paginate(1)
    }, autoScrollSpeed)
    return () => clearInterval(timer)
  }, [isHovered, photos.length, autoScrollSpeed, paginate])

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      paginate(diff > 0 ? 1 : -1)
    }
    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)"
    })
  }

  if (isLoading) {
    return (
      <div className={cn("relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm animate-pulse", className)} />
    )
  }

  if (photos.length === 0) return null

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "group/widget relative flex w-full flex-col overflow-hidden bg-black shadow-2xl",
        isFullscreen ? "h-screen rounded-none" : "h-[400px] md:h-[500px] rounded-xl",
        className
      )}
    >
      {/* --- FULL SCREEN IMAGE AREA --- */}
      <div className="relative h-full w-full overflow-hidden">
        
        {/* Grain & Scanlines */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-10" />

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={photos[currentIndex].image_url}
              alt={photos[currentIndex].alt_text || "Archive Photo"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Hit Areas (Invisible but clickable) */}
        <div className="absolute inset-y-0 left-0 z-10 w-1/4 cursor-w-resize" onClick={() => paginate(-1)} />
        <div className="absolute inset-y-0 right-0 z-10 w-1/4 cursor-e-resize" onClick={() => paginate(1)} />
      </div>

      {/* --- FLOATING HUD CAPSULE (Merged Header/Footer) --- */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div className="relative flex items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-black/80 p-3 backdrop-blur-xl shadow-2xl">
           
           {/* Left: Status & Filename */}
           <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                 <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/30">
                   ARCHIVE_VIEWER
                 </span>
              </div>
              <p className="font-mono text-xs text-white/90 uppercase tracking-wider pl-3.5">
                 IMG_{String(photos[currentIndex]?.id || currentIndex + 1).padStart(4, '0')}.RAW
              </p>
           </div>

           {/* Right: Counter & Expand */}
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-white/30 tracking-widest">
                 <ScanLine className="h-3 w-3 opacity-50" />
                 <span>{String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
              </div>
              
              <button 
                 onClick={toggleFullscreen}
                 className="hidden md:flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                 aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                 <Maximize2 className="h-4 w-4" />
              </button>
           </div>

           {/* Progress Line attached to bottom of capsule */}
           <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
              <motion.div 
                 className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                 initial={{ width: "0%" }}
                 animate={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}
                 transition={{ duration: 0.3 }}
              />
           </div>
        </div>
      </div>

    </div>
  )
}
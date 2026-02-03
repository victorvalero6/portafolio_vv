"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Pause, Play, SkipBack, SkipForward, Disc3, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import TiltedCard from "@/components/ui/tilted-card"
import { useTranslation } from "@/lib/translations"

export type NowPlayingTrack = {
  title: string
  artist?: string
  coverUrl?: string
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

// Mini Audio Visualizer Component
const AudioVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-end gap-[2px] h-3 opacity-80">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-green-400 rounded-t-[1px]"
          animate={isPlaying ? {
            height: ["20%", "80%", "40%", "90%", "30%"],
          } : { height: "20%" }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
            delay: i * 0.1, // Stagger effect
          }}
          style={{ height: "20%" }}
        />
      ))}
    </div>
  )
}

export function NowPlayingCard({
  track,
  isPlaying,
  onToggle,
  onNext,
  onPrev,
  currentTime = 0,
  duration = 0,
  className,
}: {
  track: NowPlayingTrack
  isPlaying: boolean
  onToggle: () => void
  onNext?: () => void
  onPrev?: () => void
  currentTime?: number
  duration?: number
  className?: string
}) {
  const { t } = useTranslation()
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl transition-all duration-500",
        "hover:border-white/20 hover:bg-black/60 hover:shadow-2xl",
        "w-full max-w-md",
        className
      )}
    >
        {/* Ambient Glow Background (Activates on Play) */}
        <div 
            className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-[80px] transition-opacity duration-1000" 
            style={{ opacity: isPlaying ? 0.6 : 0 }}
        />
        
        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 flex items-center gap-4 w-full">
        
        {/* --- 1. Album Art Section --- */}
        <div className="shrink-0 relative group/cover">
           {/* Glow behind cover */}
           <div className={cn(
             "absolute inset-0 rounded-xl bg-white/10 blur-lg transition-all duration-700",
             isPlaying ? "scale-110 opacity-30" : "scale-100 opacity-0"
           )} />
           
          <div className="relative">
            <TiltedCard
                imageSrc={track.coverUrl ?? "/placeholder.jpg"} 
                altText={`${track.title} cover`}
                captionText="" 
                containerHeight="64px"
                containerWidth="64px"
                imageHeight="64px"
                imageWidth="64px"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showTooltip={false}
                displayOverlayContent
                overlayContent={
                <div className="flex h-full w-full items-center justify-center rounded-[15px] border border-white/10 bg-black/20 ring-1 ring-white/5">
                    {!track.coverUrl && <Disc3 className="text-white/20 w-8 h-8 animate-spin-slow" />} 
                </div>
                }
            />
          </div>
        </div>

        {/* --- 2. Track Info & Progress --- */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          
          {/* Header Row: Status & Visualizer */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-2 py-0.5">
                <div className={cn("h-1 w-1 rounded-full transition-colors duration-500", isPlaying ? "bg-green-400 shadow-[0_0_8px_#4ade80]" : "bg-white/20")} />
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">
                    {isPlaying ? t("online") : t("paused")}
                </span>
             </div>
             <AudioVisualizer isPlaying={isPlaying} />
          </div>

          {/* Track Details (Animated Swap) */}
          <div className="relative min-h-[2.5rem] flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                key={track.title + track.artist}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="w-full"
                >
                <h4 className="text-sm font-bold text-white leading-tight font-open-sans-custom drop-shadow-md line-clamp-2">
                    {track.title}
                </h4>
                <p className="truncate text-xs text-white/60 font-open-sans-custom">
                    {track.artist || t("unknownArtist")}
                </p>
                </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar & Timers */}
          <div className="group/progress mt-1 flex items-center gap-3">
             <span className="text-[9px] font-mono text-white/30 w-8 text-right tabular-nums">
                {formatTime(currentTime)}
             </span>
             
             <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                {/* Glowing Progress Fill */}
                <motion.div 
                    className="absolute inset-y-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full"
                    style={{ width: `${progress}%` }}
                    layoutId="progress-bar"
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
             </div>

             <span className="text-[9px] font-mono text-white/30 w-8 tabular-nums">
                {formatTime(duration)}
             </span>
          </div>
        </div>

        {/* --- 3. Controls Module --- */}
        <div className="flex shrink-0 items-center gap-2 pl-3 border-l border-white/5">
            <ControlButton onClick={onPrev} icon={SkipBack} label="Previous Track" />
            
            <button
                onClick={onToggle}
                className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 hover:scale-105 active:scale-95",
                    isPlaying ? "bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]" : "hover:bg-white/10"
                )}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
                    <Pause className="h-4 w-4 fill-white" />
                ) : (
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                )}
            </button>

            <ControlButton onClick={onNext} icon={SkipForward} label="Next Track" />
        </div>
      </div>
    </div>
  )
}

// Helper for smaller buttons
function ControlButton({ onClick, icon: Icon, label }: { onClick?: () => void, icon: any, label: string }) {
    if (!onClick) return null;
    return (
        <button
            onClick={onClick}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label={label}
        >
            <Icon className="h-4 w-4" />
        </button>
    )
}
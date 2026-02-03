"use client"

import { LiquidMetalBackground } from "@/components/liquid-metal-background"
import { FloatingNavbar } from "@/components/floating-navbar"
import { ShinyButton } from "@/components/ui/shiny-button"
import { ProjectsGrid } from "@/components/ui/projects-grid"
import { ExperienceSection } from "@/components/ui/experience-section"
import { ContactCard } from "@/components/ui/contact-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MailIcon, MapPinIcon, ArrowDownRight, ArrowLeft, ArrowRight, PhoneIcon, Play, Pause, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "@/lib/translations"
import { PageIndicator } from "@/components/ui/page-indicator"
import FuzzyText from "@/components/ui/fuzzy-text"
import { useForm } from "@formspree/react"
import TargetCursor from "@/components/ui/target-cursor"
import Noise from "@/components/ui/noise"
import ScrollEntry from "@/components/scroll-entry"
import { SkillsSection } from "@/components/ui/skills-section"

function SectionPager({
  onPrev,
  onNext,
  prevLabel = "Back",
  nextLabel = "Next",
}: {
  onPrev: () => void
  onNext?: () => void
  prevLabel?: string
  nextLabel?: string
}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        className="border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-target"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {prevLabel}
      </Button>
      {onNext && (
        <Button type="button" onClick={onNext} className="bg-white text-black hover:bg-gray-200 cursor-target">
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

const SECTION_COUNT = 5

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const workSectionRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const skillsSectionRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)
  const wheelAccumRef = useRef(0)
  const lastWheelAtRef = useRef(0)
  const lastSectionJumpAtRef = useRef(0)

  const { t } = useTranslation()
  const [currentSection, setCurrentSection] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playback, setPlayback] = useState({ currentTime: 0, duration: 0 })
  const [formState, handleFormSubmit] = useForm("xjgobpgd")

  const playlist = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/casiopea-3GUpLiMeo45hk5TGob3mSbQGGAuzmQ.mp3",
      title: "Casiopea",
      artist: "Casiopea",
      coverUrl: "/music/casiopea-cover.png",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cosmic%20Surfin-DKe96czTJBaj9pqb5RtglR73mHxz8S.mp3",
      title: "Cosmic Surfin",
      artist: "Casiopea",
      coverUrl: "/music/pacific-cover.png",
    },
    {
      src: "/music/milk.mp3",
      title: "Milk",
      artist: "Sweet Trip",
      coverUrl: "/music/milk-cover.png",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/I%20Want%20To%20Talk%20About%20You-9UcBLTBcuLs0hwvlZIY3Bes8zs6HoH.mp3",
      title: "I Want To Talk About You",
      artist: "Ryo Fukui",
      coverUrl: "/music/souvenir-cover.png",
    }
  ]

  const handleSongEnd = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(nextIndex)
  }

  const skipNext = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(nextIndex)
  }

  const skipPrev = () => {
    const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length
    setCurrentSongIndex(prevIndex)
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => setIsPlaying(false))
        }
      }
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio && isPlaying) {
      audio.src = playlist[currentSongIndex].src
      audio.play().catch(error => setIsPlaying(false))
    }
  }, [currentSongIndex])

  const scrollToSection = (sectionIndex: number) => {
    if (!hasEntered) return
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    const containerWidth = scrollContainer.offsetWidth
    scrollContainer.scrollTo({
      left: sectionIndex * containerWidth,
      behavior: "smooth",
    })
  }

  // --- SCROLL HANDLER (Track current section) ---
  useEffect(() => {
    if (!hasEntered) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const containerWidth = scrollContainer.offsetWidth
      const currentScroll = scrollContainer.scrollLeft
      const section = Math.round(currentScroll / containerWidth)
      setCurrentSection(section)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [hasEntered])

  return (
    <main className="relative h-screen overflow-hidden">
      <LiquidMetalBackground />
      <TargetCursor targetSelector=".cursor-target" />
      <Noise patternAlpha={20} patternRefreshInterval={3} />
  
      <div className="fixed inset-0 z-[5] bg-black/50" />

      {/* --- SCROLL ENTRY --- */}
      {!hasEntered && (
        <ScrollEntry onEnter={() => setHasEntered(true)} />
      )}

      {/* --- MAIN CONTENT --- */}
      <div 
        className={cn(
            "transition-opacity duration-1000 ease-in-out", 
            hasEntered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
          <FloatingNavbar />

          <PageIndicator
            currentSection={currentSection}
            totalSections={5}
            onSectionClick={scrollToSection}
          />

          <div
            ref={scrollContainerRef}
            className="relative z-10 flex h-screen w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Hero Section */}
            <section id="home" className="flex min-w-full snap-start items-center justify-center px-4 py-20">
              <div className="mx-auto max-w-4xl">
                <div className="text-center px-0 leading-5">
                  <p className="mb-4 text-sm uppercase tracking-widest text-gray-400 font-open-sans-custom">
                    {t("designerDeveloper")}
                  </p>
                  <h1 className="mb-8 text-balance text-5xl tracking-tight text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] md:text-6xl lg:text-8xl">
                    <span className="font-open-sans-custom not-italic">Victor</span>{" "}
                    <span className="font-serif italic">Valero</span>
                  </h1>

                  <p className="mb-8 mx-auto max-w-2xl text-pretty leading-relaxed text-gray-300 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-thin font-open-sans-custom tracking-wide leading-7 text-xl">
                    {t("heroQuote")}{" "}
                    <span className="font-serif italic">{t("thoughtfulDesign")}</span>
                    {t("heroQuoteEnd")}
                  </p>

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-4">
                      <ShinyButton className="px-8 py-3 text-base cursor-target" onClick={() => scrollToSection(1)}>{t("viewMyWork")}</ShinyButton>
                      <button
                        onClick={() => scrollToSection(4)}
                        className="flex items-center gap-2 text-gray-300 transition-colors hover:text-white font-open-sans-custom cursor-target"
                      >
                        {t("getInTouch")}
                        <ArrowDownRight className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={toggleMusic}
                      className="flex flex-col items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white font-open-sans-custom cursor-target"
                    >
                      <div className="flex items-center gap-2">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? t("pauseMusic") : t("playMusic")}
                      </div>
                      {isPlaying && (
                        <span className="text-xs text-gray-500">
                          {playlist[currentSongIndex].title}
                        </span>
                      )}
                    </button>
                  </div>
                  <audio 
                    ref={audioRef} 
                    preload="auto"
                    onEnded={handleSongEnd}
                    onLoadedMetadata={(e) => {
                      const target = e.currentTarget
                      if (target && Number.isFinite(target.duration)) {
                        setPlayback((p) => ({ ...p, duration: target.duration }))
                      }
                    }}
                    onDurationChange={(e) => {
                      const target = e.currentTarget
                      if (target && Number.isFinite(target.duration)) {
                        setPlayback((p) => ({ ...p, duration: target.duration }))
                      }
                    }}
                    onTimeUpdate={(e) => {
                      const target = e.currentTarget
                      if (target && Number.isFinite(target.currentTime)) {
                        setPlayback((p) => ({ ...p, currentTime: target.currentTime }))
                      }
                    }}
                    src={playlist[currentSongIndex].src}
                  />
                </div>
              </div>
            </section>

            {/* Work Section */}
            <section
              id="work"
              ref={workSectionRef}
              className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 z-0 size-full pointer-events-none",
                  "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
                  "bg-[size:12px_12px]",
                  "opacity-30",
                )}
              />
              <div className="relative z-10 mx-auto w-full max-w-5xl">
                <ProjectsGrid />
                <SectionPager onPrev={() => scrollToSection(0)} onNext={() => scrollToSection(2)} prevLabel={t("back")} nextLabel={t("next")} />
              </div>
            </section>

            {/* About Section */}
            <section
              id="about"
              ref={aboutSectionRef}
              className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 z-0 size-full pointer-events-none",
                  "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
                  "bg-[size:12px_12px]",
                  "opacity-30",
                )}
              />
              <div className="relative z-10 mx-auto w-full max-w-5xl">
                <ExperienceSection
                  nowPlaying={playlist[currentSongIndex]}
                  isPlaying={isPlaying}
                  onTogglePlay={toggleMusic}
                  onNextTrack={skipNext}
                  onPrevTrack={skipPrev}
                  currentTime={playback.currentTime}
                  duration={playback.duration}
                />
                <SectionPager onPrev={() => scrollToSection(1)} onNext={() => scrollToSection(3)} prevLabel={t("back")} nextLabel={t("next")} />
              </div>
            </section>

            {/* Skills Section */}
            <section
              id="skills"
              ref={skillsSectionRef}
              className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 z-0 size-full pointer-events-none",
                  "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
                  "bg-[size:12px_12px]",
                  "opacity-25",
                )}
              />
              <div className="relative z-10 mx-auto w-full max-w-5xl">
                <SkillsSection onContactClick={() => scrollToSection(4)} />
                <SectionPager onPrev={() => scrollToSection(2)} prevLabel={t("back")} />
              </div>
            </section>

            {/* Contact Section */}
            <section
              id="contact"
              ref={contactSectionRef}
              className="relative min-w-full snap-start overflow-y-auto px-4 pt-24 pb-20"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 z-0 size-full pointer-events-none",
                  "bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
                  "bg-[size:12px_12px]",
                  "opacity-30",
                )}
              />

              <div className="relative z-10 mx-auto w-full max-w-6xl mt-[5vh]">
                <ContactCard
                  title={t("letsWork")}
                  description={t("letsWorkDesc")}
                  contactInfo={[
                    {
                      icon: MailIcon,
                      label: t("email"),
                      value: "victorvaleromx@gmail.com",
                    },
                    {
                      icon: PhoneIcon,
                      label: t("phone"),
                      value: "+52 811 382 9358",
                    },
                    {
                      icon: MapPinIcon,
                      label: t("location"),
                      value: "Monterrey, Nuevo León, Mexico",
                      isCopyable: false
                    },
                  ]}
                >
                  {formState.succeeded ? (
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                       <div className="mb-4 rounded-full bg-green-500/10 p-4 text-green-400 border border-green-500/20">
                          <Check className="h-8 w-8" />
                       </div>
                      <p className="text-xl font-bold text-white font-open-sans-custom">Transmission Received</p>
                      <p className="mt-2 text-gray-400">I'll get back to you shortly.</p>
                    </div>
                  ) : (
                    <form 
                      onSubmit={handleFormSubmit}
                      className="w-full space-y-5"
                    >
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-gray-400 font-mono pl-1">
                          {t("name")}
                        </Label>
                        <Input
                          type="text"
                          name="name"
                          required
                          placeholder="ENTER_ID"
                          className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-white/30 focus:bg-white/10 focus:ring-0 font-mono text-sm transition-all"
                          disabled={formState.submitting}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-gray-400 font-mono pl-1">
                          {t("email")}
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          required
                          placeholder="ENTER_SIGNAL_SOURCE"
                          className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-white/30 focus:bg-white/10 focus:ring-0 font-mono text-sm transition-all"
                          disabled={formState.submitting}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider text-gray-400 font-mono pl-1">
                          {t("message")}
                        </Label>
                        <Textarea 
                          name="message"
                          required
                          placeholder="INPUT_DATA_STREAM..."
                          className="min-h-[120px] resize-none border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-white/30 focus:bg-white/10 focus:ring-0 font-mono text-sm transition-all p-4"
                          disabled={formState.submitting}
                        />
                      </div>

                      <Button
                        className="group relative w-full overflow-hidden rounded-md bg-white py-6 text-black transition-all hover:bg-gray-200"
                        type="submit"
                        disabled={formState.submitting}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 font-bold uppercase tracking-widest font-mono text-sm">
                           {formState.submitting ? "Transmitting..." : t("sendMessage")}
                           <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                        </span>
                         <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-green-400 transition-transform duration-300 group-hover:translate-y-0" />
                      </Button>
                    </form>
                  )}
                </ContactCard>
                
                <div className="mt-16 flex justify-center items-center px-4 w-full">
                  <div className="max-w-4xl w-full flex justify-center text-center">
                    <FuzzyText
                      fontSize="clamp(1.5rem, 5vw, 3.5rem)"
                      fontWeight={900}
                      color="#fff"
                      enableHover={true}
                      baseIntensity={0.18}
                      hoverIntensity={0.5}
                      fuzzRange={20}
                      direction="horizontal"
                      transitionDuration={500}
                      className="cursor-pointer break-words leading-tight max-w-full text-center whitespace-normal lg:whitespace-nowrap"
                    >
                      Let's Create Something Amazing
                    </FuzzyText>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => scrollToSection(3)}
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-target"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("back")}
                  </Button>
                </div>
              </div>
            </section>
          </div>
      </div>
    </main>
  )
}
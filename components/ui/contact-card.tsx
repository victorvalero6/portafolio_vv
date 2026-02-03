"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, PlusIcon, Copy, Check, Terminal } from "lucide-react"
import DotPattern from "@/components/ui/dot-pattern"

type ContactInfoProps = {
  icon: LucideIcon
  label: string
  value: string
  isCopyable?: boolean
}

type ContactCardProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  contactInfo?: ContactInfoProps[]
  formSectionClassName?: string
}

export function ContactCard({
  title = "Initialize Uplink",
  description = "Secure channel open. Awaiting transmission.",
  contactInfo,
  className,
  formSectionClassName,
  children,
  ...props
}: ContactCardProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Structural Grid */}
      <div className="grid lg:grid-cols-[1fr_1.4fr]">
        
        {/* --- LEFT COLUMN: DATA & INFO --- */}
        {/* UPDATED: Reduced padding on mobile (p-6) -> desktop (p-8) */}
        <div className="relative flex flex-col justify-between border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="absolute inset-0 -z-10 opacity-20 fill-white/10" />
          
          {/* Decorative Corner Brackets (Left Panel) */}
          <div className="absolute left-3 top-3 h-2 w-2 border-l border-t border-white/40" />
          <div className="absolute bottom-3 left-3 h-2 w-2 border-b border-l border-white/40" />

          {/* UPDATED: Tighter spacing on mobile */}
          <div className="space-y-6 md:space-y-8">
            {/* Header Block */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-green-500/80 font-mono">
                  System Online
                </span>
              </div>
              
              {/* UPDATED: Responsive font size (2xl -> 4xl) */}
              <h1 className="text-2xl font-bold text-white [text-shadow:_0_2px_15px_rgb(255_255_255_/_20%)] font-open-sans-custom md:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400 font-open-sans-custom">
                {description}
              </p>
            </div>

            {/* Contact Data Modules */}
            <div className="flex flex-col gap-3">
              {contactInfo?.map((info, index) => (
                <ContactInfo key={index} {...info} />
              ))}
            </div>
          </div>

          {/* Footer Tech Spec */}
          {/* UPDATED: Reduced top margin on mobile */}
          <div className="mt-8 flex items-center gap-4 text-[9px] uppercase tracking-widest text-gray-600 font-mono md:mt-12">
            <span>Lat: 25.6866° N</span>
            <span className="hidden sm:inline">//</span>
            <span>Lon: 100.3161° W</span>
          </div>
        </div>

        {/* --- RIGHT COLUMN: TRANSMISSION FORM --- */}
        <div
          className={cn(
            // UPDATED: Reduced padding on mobile (p-6) -> desktop (p-12)
            "relative flex flex-col justify-center bg-white/[0.02] p-6 md:p-12",
            formSectionClassName
          )}
        >
           {/* Background Grid Texture for Form Area */}
           <div className="absolute inset-0 z-0 opacity-[0.03]" 
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
           />
           
           {/* Decorative Top Right Corner */}
           <div className="absolute right-0 top-0 p-4">
             <PlusIcon className="h-4 w-4 text-white/20" />
           </div>

           <div className="relative z-10">
              <div className="mb-6 flex items-center gap-2 text-gray-500">
                <Terminal className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest font-mono">Message_Buffer</span>
              </div>
              {children}
           </div>
        </div>
      </div>
    </div>
  )
}

function ContactInfo({ icon: Icon, label, value, isCopyable = true }: ContactInfoProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (!isCopyable) return
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div 
      onClick={handleCopy}
      className={cn(
        "group relative flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-3 md:p-4 transition-all duration-300",
        isCopyable && "cursor-pointer hover:border-white/20 hover:bg-white/10"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/40 border border-white/10 text-white group-hover:text-green-400 group-hover:border-green-500/30 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-open-sans-custom group-hover:text-gray-400 transition-colors">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-gray-200 font-open-sans-custom">
          {value}
        </p>
      </div>

      {isCopyable && (
        <div className="text-gray-500 opacity-0 transition-all group-hover:opacity-100 hidden sm:block">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </div>
      )}
    </div>
  )
}
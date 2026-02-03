"use client"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Instagram, Globe, ChevronDown } from "lucide-react"
import { useTranslation, type Language } from "@/lib/translations"
import { useState } from "react"

export function FloatingNavbar() {
  const { language, setLanguage, t } = useTranslation()
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }
  }

  const languages = [
    { code: "en" as Language, label: "English" },
    { code: "es" as Language, label: "Español" },
    { code: "fr" as Language, label: "Français" },
    { code: "de" as Language, label: "Deutsch" },
  ]

  const currentLanguage = languages.find(lang => lang.code === language)?.label || "English"

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <div className="mx-auto max-w-7xl rounded-2xl border-2 border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
        <div className="relative flex items-center justify-between">
          {/* Logo / Name */}
          <button onClick={() => scrollToSection("home")} className="cursor-pointer cursor-target">
            <span className="text-lg font-bold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] font-open-sans-custom">
              VV
            </span>
          </button>

          {/* Navigation Links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection("work")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-target"
            >
              {t("work")}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-target"
            >
              {t("about")}
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-target"
            >
              {t("skills")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-open-sans-custom text-gray-300 transition-colors hover:text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] cursor-target"
            >
              {t("contact")}
            </button>
          </div>

          {/* Social Links & Language Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 font-open-sans-custom"
              >
                <Globe className="h-3.5 w-3.5" />
                {language.toUpperCase()}
                <ChevronDown className="h-3 w-3" />
              </button>
              
              {isLangDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-white/10 bg-black/90 backdrop-blur-sm shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setIsLangDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg font-open-sans-custom ${
                        language === lang.code ? "text-white bg-white/5" : "text-gray-300"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a
              href="https://github.com/victorvalero6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition-colors hover:text-white cursor-target"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/victor-valero-439365365/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition-colors hover:text-white cursor-target"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_victorvm_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition-colors hover:text-white cursor-target"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "en" | "es" | "fr" | "de"

export const translations = {
  en: {
    // Navbar
    work: "Work",
    about: "About",
    skills: "Skills",
    contact: "Contact",
    
    // Hero
    designerDeveloper: "Designer & Developer",
    heroQuote: "I craft digital experiences where",
    thoughtfulDesign: "thoughtful design",
    heroQuoteEnd: ", solid engineering, and artistic intuition converge—creating products that are functional, elegant, and deeply human.",
    viewMyWork: "View My Work",
    getInTouch: "Get in Touch",
    playMusic: "Play Some Music",
    pauseMusic: "Pause Music",
    
    // Projects
    selectedWork: "Selected Work",
    recentProjects: "Recent Projects",
    caritas: "Cáritas Donation Swift App",
    caritasDesc: "A modern iOS solution built with Swift to optimize donation flows, bazar coordination, and impact tracking through maps, dashboards, and intelligent tools.",
    whirlpool: "Web Frontend - Backend",
    whirlpoolDesc: "This project is a full-stack web application built with React for both frontend and backend, developed for Whirlpool. It includes all core features such as user authentication, dedicated user and admin pages, database integration, and an interactive Unity-based game seamlessly connected to the platform.",
    mobile: "Mobile Banking App",
    mobileDesc: "Cross-platform mobile application for digital banking",
    spaceGame: "Survival Space Game",
    spaceGameDesc: "Fast-paced arcade space shooter built with vanilla JavaScript and HTML5 Canvas. Pilot your ship through an endless battlefield, destroy incoming enemies, collect power-ups, unleash screen-clearing black holes, and face a final boss if you survive long enough.",
    
    // Experience
    background: "Background",
    experience: "Experience",
    experienceIntro: "I've spent the past years building a strong foundation in computing, design, and creative technology. My journey blends technical depth with artistic exploration, evolving from core programming principles to full-stack systems and expressive, unconventional digital experiences.",
    education: "Education",
    degree: "B.S. Computer Science",
    coreTech: "Core Tech",
    creativeTechnologist: "Creative Technologist",
    creativeTechnologistFocus: "Design & Engineering Focus",
    creativeTechnologistDesc: "Currently focused on crafting visually striking, vintage-inspired, and unconventional digital designs. I explore the intersection of aesthetics and systems, building experiences that combine front-end, back-end, databases, and APIs with a strong artistic identity. My work is driven by creativity, experimentation, and a clear goal of joining the Apple Developer Academy.",
    fullStackDev: "Full-Stack & Applied Computing Projects",
    fullStackDevDesc: "Designed and developed a complete web platform from scratch — frontend, backend, databases, APIs — and deployed it publicly. Worked with Unity on an industrial project for Whirlpool, integrating interactive systems and applied computing concepts. As a second major project, I developed a Swift application for Cáritas de Monterrey, combining technology, social impact, and user-centered design. Explored advanced computational methods, functional programming with Racket and Clojure, and complex problem solving.",
    systemsArch: "Systems, Architecture & Low-Level Computing",
    systemsArchDesc: "Deepened my understanding of Object-Oriented Programming in C++, software architecture, and web systems design. Worked with GitHub, explored assembly language, and applied computing concepts to computational biology. Studied software requirements, web architecture, and software architecture, strengthening my systems-thinking approach.",
    foundations: "Foundations of Computer Science",
    foundationsDesc: "Built a solid base in HTML, CSS, C++, and Python, focusing on language fundamentals, data structures, and practice-driven projects. Developed computational thinking, object-oriented reasoning, and problem-solving skills through hands-on experimentation.",
    
    // Skills
    skillsTitle: "Skills",
    skillsDesc: "A comprehensive overview of my technical capabilities, from front-end interfaces to back-end systems, databases, and creative tools.",
    contactMe: "contact me!",
    systemOnline: "System_Online",
    initializing: "Initializing...",
    
    // Now Playing
    nowPlaying: "Now Playing",
    online: "Online",
    paused: "Paused",
    unknownArtist: "Unknown Artist",
    
    // Navigation
    back: "Back",
    next: "Next",
    
    // Contact
    letsWork: "Let's Work Together",
    letsWorkDesc: "Have a project in mind? I'd love to hear about it. Drop me a message and let's create something amazing together.",
    email: "Email",
    phone: "Phone",
    location: "Location",
    name: "Name",
    yourName: "Your name",
    yourEmail: "your@email.com",
    message: "Message",
    tellMe: "Tell me about your project...",
    sendMessage: "Send Message",
  },
  es: {
    // Navbar
    work: "Trabajo",
    about: "Sobre Mí",
    skills: "Habilidades",
    contact: "Contacto",
    
    // Hero
    designerDeveloper: "Diseñador y Desarrollador",
    heroQuote: "Creo experiencias digitales donde",
    thoughtfulDesign: "el diseño reflexivo",
    heroQuoteEnd: ", la ingeniería sólida y la intuición artística convergen—creando productos funcionales, elegantes y profundamente humanos.",
    viewMyWork: "Ver Mi Trabajo",
    getInTouch: "Contáctame",
    playMusic: "Reproducir Música",
    pauseMusic: "Pausar Música",
    
    // Projects
    selectedWork: "Trabajo Seleccionado",
    recentProjects: "Proyectos Recientes",
    caritas: "App Cáritas Donaciones Swift",
    caritasDesc: "Una solución iOS moderna construida con Swift para optimizar flujos de donación, coordinación de bazares y seguimiento de impacto a través de mapas, dashboards y herramientas inteligentes.",
    whirlpool: "Web Frontend - Backend",
    whirlpoolDesc: "Este proyecto es una aplicación web full-stack construida con React para frontend y backend, desarrollada para Whirlpool. Incluye todas las funcionalidades principales como autenticación de usuarios, páginas dedicadas para usuarios y administradores, integración de base de datos, y un juego interactivo basado en Unity conectado sin problemas a la plataforma.",
    mobile: "App de Banca Móvil",
    mobileDesc: "Aplicación móvil multiplataforma para banca digital",
    spaceGame: "Juego de Supervivencia Espacial",
    spaceGameDesc: "Shooter espacial arcade de ritmo rápido construido con JavaScript vanilla y HTML5 Canvas. Pilota tu nave a través de un campo de batalla interminable, destruye enemigos, recolecta mejoras, desata agujeros negros que limpian la pantalla, y enfrenta un jefe final si sobrevives lo suficiente.",
    
    // Experience
    background: "Trayectoria",
    experience: "Experiencia",
    experienceIntro: "He pasado los últimos años construyendo una base sólida en computación, diseño y tecnología creativa. Mi camino combina profundidad técnica con exploración artística, evolucionando desde principios fundamentales de programación hasta sistemas full-stack y experiencias digitales expresivas y poco convencionales.",
    education: "Educación",
    degree: "Licenciatura en Ciencias de la Computación",
    coreTech: "Tecnologías Principales",
    creativeTechnologist: "Tecnólogo Creativo",
    creativeTechnologistFocus: "Enfoque en Diseño e Ingeniería",
    creativeTechnologistDesc: "Actualmente enfocado en crear diseños digitales visualmente impactantes, de inspiración vintage y poco convencionales. Exploro la intersección entre estética y sistemas, construyendo experiencias que combinan front-end, back-end, bases de datos y APIs con una fuerte identidad artística. Mi trabajo está impulsado por la creatividad, la experimentación y el objetivo claro de unirme a la Apple Developer Academy.",
    fullStackDev: "Proyectos Full-Stack y Computación Aplicada",
    fullStackDevDesc: "Diseñé y desarrollé una plataforma web completa desde cero — frontend, backend, bases de datos, APIs — y la desplegué públicamente. Trabajé con Unity en un proyecto industrial para Whirlpool, integrando sistemas interactivos y conceptos de computación aplicada. Como segundo proyecto importante, desarrollé una aplicación Swift para Cáritas de Monterrey, combinando tecnología, impacto social y diseño centrado en el usuario. Exploré métodos computacionales avanzados, programación funcional con Racket y Clojure, y resolución de problemas complejos.",
    systemsArch: "Sistemas, Arquitectura y Computación de Bajo Nivel",
    systemsArchDesc: "Profundicé mi comprensión de Programación Orientada a Objetos en C++, arquitectura de software y diseño de sistemas web. Trabajé con GitHub, exploré lenguaje ensamblador y apliqué conceptos de computación a biología computacional. Estudié requisitos de software, arquitectura web y arquitectura de software, fortaleciendo mi enfoque de pensamiento sistémico.",
    foundations: "Fundamentos de Ciencias de la Computación",
    foundationsDesc: "Construí una base sólida en HTML, CSS, C++ y Python, enfocándome en fundamentos del lenguaje, estructuras de datos y proyectos prácticos. Desarrollé pensamiento computacional, razonamiento orientado a objetos y habilidades de resolución de problemas a través de experimentación práctica.",
    
    // Skills
    skillsTitle: "Habilidades",
    skillsDesc: "Una descripción completa de mis capacidades técnicas, desde interfaces front-end hasta sistemas back-end, bases de datos y herramientas creativas.",
    contactMe: "¡contáctame!",
    systemOnline: "Sistema_En_Línea",
    initializing: "Inicializando...",
    
    // Now Playing
    nowPlaying: "Reproduciendo Ahora",
    online: "En Línea",
    paused: "Pausado",
    unknownArtist: "Artista Desconocido",
    
    // Navigation
    back: "Atrás",
    next: "Siguiente",
    
    // Contact
    letsWork: "Trabajemos Juntos",
    letsWorkDesc: "¿Tienes un proyecto en mente? Me encantaría saber de él. Envíame un mensaje y creemos algo increíble juntos.",
    email: "Correo",
    phone: "Teléfono",
    location: "Ubicación",
    name: "Nombre",
    yourName: "Tu nombre",
    yourEmail: "tu@correo.com",
    message: "Mensaje",
    tellMe: "Cuéntame sobre tu proyecto...",
    sendMessage: "Enviar Mensaje",
  },
  fr: {
    // Navbar
    work: "Travail",
    about: "À Propos",
    skills: "Compétences",
    contact: "Contact",
    
    // Hero
    designerDeveloper: "Designer & Développeur",
    heroQuote: "Je crée des expériences numériques où",
    thoughtfulDesign: "le design réfléchi",
    heroQuoteEnd: ", l'ingénierie solide et l'intuition artistique convergent—créant des produits fonctionnels, élégants et profondément humains.",
    viewMyWork: "Voir Mon Travail",
    getInTouch: "Contactez-Moi",
    playMusic: "Jouer de la Musique",
    pauseMusic: "Mettre en Pause",
    
    // Projects
    selectedWork: "Travaux Sélectionnés",
    recentProjects: "Projets Récents",
    caritas: "App Cáritas Donation Swift",
    caritasDesc: "Une solution iOS moderne construite avec Swift pour optimiser les flux de dons, la coordination des bazars et le suivi de l'impact via des cartes, tableaux de bord et outils intelligents.",
    whirlpool: "Web Frontend - Backend",
    whirlpoolDesc: "Ce projet est une application web full-stack construite avec React pour le frontend et le backend, développée pour Whirlpool. Il inclut toutes les fonctionnalités principales telles que l'authentification des utilisateurs, des pages dédiées pour les utilisateurs et les administrateurs, l'intégration de base de données et un jeu interactif basé sur Unity connecté de manière transparente à la plateforme.",
    mobile: "App Banque Mobile",
    mobileDesc: "Application mobile multiplateforme pour la banque numérique",
    spaceGame: "Jeu Spatial de Survie",
    spaceGameDesc: "Shooter spatial arcade rapide construit avec JavaScript vanilla et HTML5 Canvas. Pilotez votre vaisseau à travers un champ de bataille sans fin, détruisez les ennemis, collectez des power-ups, déclenchez des trous noirs qui nettoient l'écran et affrontez un boss final si vous survivez assez longtemps.",
    
    // Experience
    background: "Parcours",
    experience: "Expérience",
    experienceIntro: "J'ai passé ces dernières années à construire une base solide en informatique, design et technologie créative. Mon parcours mêle profondeur technique et exploration artistique, évoluant des principes fondamentaux de programmation vers des systèmes full-stack et des expériences numériques expressives et non conventionnelles.",
    education: "Éducation",
    degree: "Licence en Informatique",
    coreTech: "Technologies Principales",
    creativeTechnologist: "Technologue Créatif",
    creativeTechnologistFocus: "Focus Design & Ingénierie",
    creativeTechnologistDesc: "Actuellement concentré sur la création de designs numériques visuellement frappants, d'inspiration vintage et non conventionnels. J'explore l'intersection de l'esthétique et des systèmes, en construisant des expériences qui combinent front-end, back-end, bases de données et APIs avec une forte identité artistique. Mon travail est motivé par la créativité, l'expérimentation et l'objectif clair de rejoindre l'Apple Developer Academy.",
    fullStackDev: "Projets Full-Stack et Informatique Appliquée",
    fullStackDevDesc: "Conçu et développé une plateforme web complète de zéro — frontend, backend, bases de données, APIs — et l'ai déployée publiquement. Travaillé avec Unity sur un projet industriel pour Whirlpool, intégrant des systèmes interactifs et des concepts d'informatique appliquée. Comme deuxième projet majeur, j'ai développé une application Swift pour Cáritas de Monterrey, combinant technologie, impact social et design centré sur l'utilisateur. Exploré des méthodes computationnelles avancées, programmation fonctionnelle avec Racket et Clojure, et résolution de problèmes complexes.",
    systemsArch: "Systèmes, Architecture et Informatique Bas Niveau",
    systemsArchDesc: "Approfondi ma compréhension de la Programmation Orientée Objet en C++, de l'architecture logicielle et de la conception de systèmes web. Travaillé avec GitHub, exploré le langage assembleur et appliqué des concepts informatiques à la biologie computationnelle. Étudié les exigences logicielles, l'architecture web et l'architecture logicielle, renforçant mon approche de pensée systémique.",
    foundations: "Fondamentaux de l'Informatique",
    foundationsDesc: "Construit une base solide en HTML, CSS, C++ et Python, en me concentrant sur les fondamentaux du langage, les structures de données et les projets pratiques. Développé la pensée computationnelle, le raisonnement orienté objet et les compétences de résolution de problèmes à travers l'expérimentation pratique.",
    
    // Skills
    skillsTitle: "Compétences",
    skillsDesc: "Un aperçu complet de mes capacités techniques, des interfaces front-end aux systèmes back-end, bases de données et outils créatifs.",
    contactMe: "contactez-moi!",
    systemOnline: "Système_En_Ligne",
    initializing: "Initialisation...",
    
    // Now Playing
    nowPlaying: "En Cours de Lecture",
    online: "En Ligne",
    paused: "En Pause",
    unknownArtist: "Artiste Inconnu",
    
    // Navigation
    back: "Retour",
    next: "Suivant",
    
    // Contact
    letsWork: "Travaillons Ensemble",
    letsWorkDesc: "Vous avez un projet en tête? J'aimerais en entendre parler. Envoyez-moi un message et créons quelque chose d'incroyable ensemble.",
    email: "Email",
    phone: "Téléphone",
    location: "Localisation",
    name: "Nom",
    yourName: "Votre nom",
    yourEmail: "votre@email.com",
    message: "Message",
    tellMe: "Parlez-moi de votre projet...",
    sendMessage: "Envoyer Message",
  },
  de: {
    // Navbar
    work: "Arbeit",
    about: "Über Mich",
    skills: "Fähigkeiten",
    contact: "Kontakt",
    
    // Hero
    designerDeveloper: "Designer & Entwickler",
    heroQuote: "Ich gestalte digitale Erlebnisse, in denen",
    thoughtfulDesign: "durchdachtes Design",
    heroQuoteEnd: ", solide Technik und künstlerische Intuition zusammenkommen—und Produkte schaffen, die funktional, elegant und zutiefst menschlich sind.",
    viewMyWork: "Meine Arbeit Ansehen",
    getInTouch: "Kontaktieren",
    playMusic: "Musik Abspielen",
    pauseMusic: "Musik Pausieren",
    
    // Projects
    selectedWork: "Ausgewählte Arbeiten",
    recentProjects: "Aktuelle Projekte",
    caritas: "Cáritas Spenden Swift App",
    caritasDesc: "Eine moderne iOS-Lösung, die mit Swift entwickelt wurde, um Spendenabläufe, Basar-Koordination und Impact-Tracking durch Karten, Dashboards und intelligente Tools zu optimieren.",
    whirlpool: "Web Frontend - Backend",
    whirlpoolDesc: "Dieses Projekt ist eine Full-Stack-Webanwendung, die mit React für Frontend und Backend entwickelt wurde, für Whirlpool. Es umfasst alle Kernfunktionen wie Benutzerauthentifizierung, dedizierte Benutzer- und Admin-Seiten, Datenbankintegration und ein interaktives Unity-basiertes Spiel, das nahtlos mit der Plattform verbunden ist.",
    mobile: "Mobile Banking App",
    mobileDesc: "Plattformübergreifende Mobile-Anwendung für digitales Banking",
    spaceGame: "Weltraum-Überlebensspiel",
    spaceGameDesc: "Rasanter Arcade-Weltraum-Shooter, entwickelt mit Vanilla JavaScript und HTML5 Canvas. Steuern Sie Ihr Schiff durch ein endloses Schlachtfeld, zerstören Sie angreifende Feinde, sammeln Sie Power-Ups, entfesseln Sie bildschirmauslöschende schwarze Löcher und stellen Sie sich einem Endboss, wenn Sie lange genug überleben.",
    
    // Experience
    background: "Hintergrund",
    experience: "Erfahrung",
    experienceIntro: "Ich habe die letzten Jahre damit verbracht, eine solide Grundlage in Informatik, Design und kreativer Technologie aufzubauen. Meine Reise verbindet technische Tiefe mit künstlerischer Erkundung und entwickelt sich von grundlegenden Programmierprinzipien zu Full-Stack-Systemen und ausdrucksstarken, unkonventionellen digitalen Erlebnissen.",
    education: "Bildung",
    degree: "Bachelor in Informatik",
    coreTech: "Kerntechnologien",
    creativeTechnologist: "Kreativer Technologe",
    creativeTechnologistFocus: "Fokus auf Design & Technik",
    creativeTechnologistDesc: "Derzeit konzentriert auf die Gestaltung visuell beeindruckender, vintage-inspirierter und unkonventioneller digitaler Designs. Ich erforsche die Schnittstelle von Ästhetik und Systemen und baue Erlebnisse, die Frontend, Backend, Datenbanken und APIs mit einer starken künstlerischen Identität verbinden. Meine Arbeit wird von Kreativität, Experimenten und dem klaren Ziel angetrieben, der Apple Developer Academy beizutreten.",
    fullStackDev: "Full-Stack & Angewandte Informatik Projekte",
    fullStackDevDesc: "Entwurf und Entwicklung einer kompletten Webplattform von Grund auf — Frontend, Backend, Datenbanken, APIs — und öffentlich bereitgestellt. Arbeit mit Unity an einem Industrieprojekt für Whirlpool, Integration interaktiver Systeme und angewandter Informatikkonzepte. Als zweites Hauptprojekt entwickelte ich eine Swift-Anwendung für Cáritas de Monterrey, die Technologie, soziale Auswirkungen und benutzerzentriertes Design verbindet. Erforschung fortgeschrittener Rechenmethoden, funktionale Programmierung mit Racket und Clojure und komplexe Problemlösung.",
    systemsArch: "Systeme, Architektur & Low-Level-Computing",
    systemsArchDesc: "Vertiefung meines Verständnisses von Objektorientierter Programmierung in C++, Softwarearchitektur und Web-Systemdesign. Arbeit mit GitHub, Erforschung von Assemblersprache und Anwendung von Informatikkonzepten auf Computerbiologie. Studium von Softwareanforderungen, Webarchitektur und Softwarearchitektur, Stärkung meines systemischen Denkansatzes.",
    foundations: "Grundlagen der Informatik",
    foundationsDesc: "Aufbau einer soliden Basis in HTML, CSS, C++ und Python, mit Fokus auf Sprachgrundlagen, Datenstrukturen und praxisorientierte Projekte. Entwicklung von rechnerischem Denken, objektorientiertem Denken und Problemlösungsfähigkeiten durch praktische Experimente.",
    
    // Skills
    skillsTitle: "Fähigkeiten",
    skillsDesc: "Ein umfassender Überblick über meine technischen Fähigkeiten, von Front-End-Schnittstellen über Back-End-Systeme, Datenbanken bis hin zu kreativen Tools.",
    contactMe: "kontaktiere mich!",
    systemOnline: "System_Online",
    initializing: "Initialisierung...",
    
    // Now Playing
    nowPlaying: "Läuft Gerade",
    online: "Online",
    paused: "Pausiert",
    unknownArtist: "Unbekannter Künstler",
    
    // Navigation
    back: "Zurück",
    next: "Weiter",
    
    // Contact
    letsWork: "Lass uns Zusammenarbeiten",
    letsWorkDesc: "Haben Sie ein Projekt im Kopf? Ich würde gerne davon hören. Schicken Sie mir eine Nachricht und lassen Sie uns gemeinsam etwas Erstaunliches schaffen.",
    email: "E-Mail",
    phone: "Telefon",
    location: "Standort",
    name: "Name",
    yourName: "Ihr Name",
    yourEmail: "ihre@email.de",
    message: "Nachricht",
    tellMe: "Erzählen Sie mir von Ihrem Projekt...",
    sendMessage: "Nachricht Senden",
  },
}

type TranslationContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.en) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

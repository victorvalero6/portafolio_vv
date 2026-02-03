"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
} as const

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "120px",
  containerWidth = "120px",
  imageHeight = "120px",
  imageWidth = "120px",
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  className,
}: {
  imageSrc: string
  altText?: string
  captionText?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  scaleOnHover?: number
  rotateAmplitude?: number
  showTooltip?: boolean
  overlayContent?: React.ReactNode
  displayOverlayContent?: boolean
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(0, springValues)
  const rotateY = useSpring(0, springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0, springValues)
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 })

  const [lastY, setLastY] = useState(0)

  function handleMouse(e: React.MouseEvent) {
    if (reduceMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

    rotateX.set(rotationX)
    rotateY.set(rotationY)

    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)

    const velocityY = offsetY - lastY
    rotateFigcaption.set(-velocityY * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    if (reduceMotion) return
    scale.set(scaleOnHover)
    opacity.set(1)
  }

  function handleMouseLeave() {
    if (reduceMotion) return
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  return (
    <figure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: 800,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          scale: reduceMotion ? 1 : scale,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          style={{
            width: imageWidth,
            height: imageHeight,
            objectFit: "cover",
            borderRadius: 14,
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translateZ(0)",
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              transform: "translateZ(30px)",
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          style={{
            pointerEvents: "none",
            position: "absolute",
            left: 0,
            top: 0,
            borderRadius: 6,
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "4px 10px",
            fontSize: 10,
            color: "#111",
            zIndex: 3,
            x,
            y,
            opacity: reduceMotion ? 0 : opacity,
            rotate: reduceMotion ? 0 : rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  )
}


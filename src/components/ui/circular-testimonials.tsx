import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './circular-testimonials.css'

export interface Testimonial {
  quote: string
  name: string
  designation: string
  src: string
  alt: string
}

interface Colors {
  name?: string
  designation?: string
  testimony?: string
  arrowBackground?: string
  arrowForeground?: string
  arrowHoverBackground?: string
}

interface FontSizes {
  name?: string
  designation?: string
  quote?: string
}

interface CircularTestimonialsProps {
  testimonials: Testimonial[]
  autoplay?: boolean
  colors?: Colors
  fontSizes?: FontSizes
}

function calculateGap(width: number) {
  const minWidth = 1024
  const maxWidth = 1456
  const minGap = 56
  const maxGap = 82
  if (width <= minWidth) return minGap
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.04 * (width - maxWidth))
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) {
  const colorName = colors.name ?? '#f5f2ec'
  const colorDesignation = colors.designation ?? '#c6a76a'
  const colorTestimony = colors.testimony ?? '#f5f2ec'
  const colorArrowBg = colors.arrowBackground ?? '#171715'
  const colorArrowFg = colors.arrowForeground ?? '#f5f2ec'
  const colorArrowHoverBg = colors.arrowHoverBackground ?? '#c6a76a'
  const fontSizeName = fontSizes.name ?? '1.5rem'
  const fontSizeDesignation = fontSizes.designation ?? '.72rem'
  const fontSizeQuote = fontSizes.quote ?? '1.32rem'

  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const testimonialsLength = testimonials.length
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex] ?? testimonials[0],
    [activeIndex, testimonials],
  )
  const autoplayPaused = isHovered || isFocused || !isInView || Boolean(prefersReducedMotion)

  useEffect(() => {
    const container = imageContainerRef.current
    if (!container) return

    const updateWidth = () => setContainerWidth(container.getBoundingClientRect().width)
    updateWidth()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = imageContainerRef.current
    if (!container) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!autoplay || autoplayPaused || testimonialsLength < 2) return
    const interval = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % testimonialsLength)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [activeIndex, autoplay, autoplayPaused, testimonialsLength])

  const handleNext = useCallback(() => {
    if (testimonialsLength > 1) setActiveIndex((previous) => (previous + 1) % testimonialsLength)
  }, [testimonialsLength])

  const handlePrev = useCallback(() => {
    if (testimonialsLength > 1) setActiveIndex((previous) => (previous - 1 + testimonialsLength) % testimonialsLength)
  }, [testimonialsLength])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      handlePrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      handleNext()
    }
  }

  const getImageStyle = (index: number): React.CSSProperties => {
    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.72
    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength
    const isActive = index === activeIndex
    const isLeft = offset === testimonialsLength - 1
    const isRight = offset === 1
    const transition = prefersReducedMotion ? 'none' : 'transform .7s cubic-bezier(.22,.61,.36,1), opacity .45s ease'

    if (isActive) {
      return { zIndex: 3, opacity: 1, pointerEvents: 'auto', transform: 'translateX(0) translateY(0) scale(1) rotateY(0deg)', transition }
    }
    if (isLeft) {
      return { zIndex: 2, opacity: 0.72, pointerEvents: 'auto', transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(.84) rotateY(12deg)`, transition }
    }
    if (isRight) {
      return { zIndex: 2, opacity: 0.72, pointerEvents: 'auto', transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(.84) rotateY(-12deg)`, transition }
    }
    return { zIndex: 1, opacity: 0, pointerEvents: 'none', transform: 'scale(.82)', transition }
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false)
  }

  if (testimonialsLength === 0 || !activeTestimonial) return null

  const quoteVariants = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } }

  return (
    <div
      className="testimonial-container"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <div className="testimonial-grid">
        <div className="testimonial-image-container" ref={imageContainerRef} role="group" aria-label="Choose a testimonial">
          {testimonials.map((testimonial, index) => {
            const isVisible = index === activeIndex
              || index === (activeIndex - 1 + testimonialsLength) % testimonialsLength
              || index === (activeIndex + 1) % testimonialsLength
            return (
              <motion.button
                key={`${testimonial.src}-${index}`}
                type="button"
                className={`testimonial-image${index === activeIndex ? ' is-active' : ''}`}
                style={getImageStyle(index)}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show testimonial ${index + 1} of ${testimonialsLength}: ${testimonial.name}`}
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                <img src={testimonial.src} alt={testimonial.alt} loading="lazy" />
              </motion.button>
            )
          })}
          <span className="testimonial-count" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(testimonialsLength).padStart(2, '0')}
          </span>
        </div>

        <div className="testimonial-content">
          <p className="testimonial-overline">A note from a LUMÉRA home</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              className="testimonial-copy"
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: prefersReducedMotion ? 0 : 0.36, ease: 'easeInOut' }}
              aria-live={autoplay && !autoplayPaused ? 'off' : 'polite'}
              aria-atomic="true"
            >
              <blockquote className="testimonial-quote" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                {activeTestimonial.quote.split(/\s+/).map((word, index, words) => (
                  <React.Fragment key={`${activeIndex}-${index}`}>
                    <motion.span
                      className="testimonial-word"
                      initial={prefersReducedMotion ? false : { filter: 'blur(7px)', opacity: 0, y: 3 }}
                      animate={{ filter: 'blur(0)', opacity: 1, y: 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut', delay: prefersReducedMotion ? 0 : Math.min(0.012 * index, 0.18) }}
                    >
                      {word}
                    </motion.span>
                    {index < words.length - 1 ? ' ' : null}
                  </React.Fragment>
                ))}
              </blockquote>
              <p className="testimonial-name" style={{ color: colorName, fontSize: fontSizeName }}>{activeTestimonial.name}</p>
              <p className="testimonial-designation" style={{ color: colorDesignation, fontSize: fontSizeDesignation }}>{activeTestimonial.designation}</p>
            </motion.div>
          </AnimatePresence>

          <div className="testimonial-arrows">
            <button
              type="button"
              className="testimonial-arrow"
              onClick={handlePrev}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              onFocus={() => setHoverPrev(true)}
              onBlur={() => setHoverPrev(false)}
              style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg, color: colorArrowFg }}
              aria-label="Previous testimonial"
              disabled={testimonialsLength < 2}
            >
              <FaArrowLeft size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="testimonial-arrow"
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              onFocus={() => setHoverNext(true)}
              onBlur={() => setHoverNext(false)}
              style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg, color: colorArrowFg }}
              aria-label="Next testimonial"
              disabled={testimonialsLength < 2}
            >
              <FaArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularTestimonials

'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-bleed hero background with smooth scroll-driven parallax.
 * The image layer translates slower than the page (rAF-throttled) and is
 * tinted with brand-dark overlays so the gold/light hero text stays legible.
 */
export function HeroParallaxBg() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const update = () => {
      const y = window.scrollY
      const el = layerRef.current
      if (el) {
        // move at 0.4x scroll speed; slight scale keeps edges covered as it shifts
        const offset = prefersReduced ? 0 : y * 0.4
        el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.18)`
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Parallax image layer */}
      <div
        ref={layerRef}
        className="absolute inset-0 -top-[10%] h-[120%] will-change-transform"
        style={{ transform: 'scale(1.18)', transition: 'transform 0.12s linear' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <picture className="block w-full h-full">
          <source srcSet="/hero.webp" type="image/webp" />
          <img
            src="/hero.jpg"
            alt=""
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </div>

      {/* Brand-dark tint + readability gradients */}
      <div className="absolute inset-0 bg-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/30 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/40" />
      {/* subtle gold vignette glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.06),_transparent_60%)]" />
    </div>
  )
}

import Link from 'next/link'
import { getPublicSettings } from '@/lib/data/settings'
import { Button } from '@/components/ui/Button'
import { HeroParallaxBg } from '@/components/public/HeroParallaxBg'

export async function Hero() {
  const settings = await getPublicSettings()
  const hero = {
    headline: settings.hero_headline,
    subheadline: settings.hero_subheadline,
  }

  const words = hero.headline.split(' ')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg noise-overlay">
      {/* Parallax barbershop background */}
      <HeroParallaxBg />

      {/* Animated geometric lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="geometric-line top-[20%] animate-geometric-slow opacity-60" />
        <div className="geometric-line top-[50%] animate-geometric-reverse opacity-40" />
        <div className="geometric-line top-[80%] animate-geometric-slow opacity-50" />

        {/* Rotating diamond shapes */}
        <div
          className="geometric-diamond w-48 h-48 md:w-72 md:h-72"
          style={{
            top: '10%',
            right: '-60px',
            animation: 'geometricSpin 40s linear infinite',
          }}
        />
        <div
          className="geometric-diamond w-32 h-32 md:w-48 md:h-48"
          style={{
            bottom: '15%',
            left: '-40px',
            animation: 'geometricSpinReverse 35s linear infinite',
          }}
        />
        <div
          className="geometric-diamond w-20 h-20"
          style={{
            top: '30%',
            left: '10%',
            borderColor: 'rgba(201, 168, 76, 0.06)',
            animation: 'geometricSpin 50s linear infinite',
          }}
        />
      </div>

      {/* Gold horizontal accent line */}
      <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16">
        {/* Label */}
        <div
          className="inline-flex items-center gap-3 mb-8 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <div className="h-px w-8 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Premium Barbershop — Lagos
          </span>
          <div className="h-px w-8 bg-gold" />
        </div>

        {/* Headline — staggered words */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-[0.04em] mb-6">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block opacity-0 animate-fade-up mr-3 last:mr-0"
              style={{
                animationDelay: `${0.3 + i * 0.15}s`,
                animationFillMode: 'forwards',
              }}
            >
              {word === 'STYLE.' || word === 'IDENTITY.' ? (
                <span className="text-gold">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p
          className="text-text-muted text-lg md:text-xl font-body font-light tracking-wider mb-10 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          {hero.subheadline}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}
        >
          <Link href="/book">
            <Button variant="primary" size="lg">
              Book Appointment
            </Button>
          </Link>
          <Link href="/#services">
            <Button variant="outline" size="lg">
              View Services
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-center gap-8 md:gap-16 mt-16 opacity-0 animate-fade-in"
          style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}
        >
          {[
            { value: '5+', label: 'YRS' },
            { value: '200+', label: 'CLIENTS' },
            { value: '10+', label: 'STYLES' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-gold tracking-wider">
                {value}
              </div>
              <div className="text-[10px] text-text-muted font-body tracking-[0.2em] mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
        style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
      >
        <span className="text-[10px] text-text-muted tracking-[0.2em] uppercase font-body">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
        <svg
          className="w-4 h-4 text-gold animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

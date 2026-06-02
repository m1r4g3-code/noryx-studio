import Link from 'next/link'

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#reviews', label: 'Reviews' },
  { href: '/book', label: 'Book Now' },
]

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo & tagline */}
          <div>
            <Link href="/" className="inline-flex items-baseline gap-1 group mb-3">
              <span className="font-display text-2xl tracking-[0.15em] text-text-primary group-hover:text-gold transition-colors">
                NORYX
              </span>
              <span className="font-display text-sm tracking-[0.2em] text-gold">STUDIO</span>
            </Link>
            <p className="text-text-muted text-sm font-body tracking-wide">
              Precision. Style. Identity.
            </p>
            <p className="text-text-muted text-xs font-body tracking-wider mt-1">
              Premium Barbershop — Lagos
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted font-body mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted hover:text-gold transition-colors font-body tracking-wide"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted font-body mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="tel:09162035059"
                className="text-sm text-text-muted hover:text-gold transition-colors font-body"
              >
                09162035059
              </a>
              <a
                href="mailto:sain.tcuts3@gmail.com"
                className="text-sm text-text-muted hover:text-gold transition-colors font-body"
              >
                sain.tcuts3@gmail.com
              </a>
              <a
                href="https://wa.me/2349162035059"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold hover:text-gold-light transition-colors font-body"
              >
                WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs font-body tracking-[0.15em] uppercase">
            NORYX STUDIO © 2025 — All rights reserved
          </p>
          <div className="flex items-center gap-1">
            <div className="h-px w-4 bg-border" />
            <div className="w-1 h-1 bg-gold rotate-45" />
            <div className="h-px w-4 bg-border" />
          </div>
        </div>
      </div>
    </footer>
  )
}

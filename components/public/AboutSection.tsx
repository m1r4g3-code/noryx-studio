import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { AboutSettings } from '@/types'

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '200+', label: 'Happy Clients' },
  { value: '10+', label: 'Signature Styles' },
  { value: '100%', label: 'Satisfaction' },
]

export async function AboutSection() {
  const supabase = createServerSupabaseClient()
  const { data: aboutSetting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'about')
    .single()

  const about = (aboutSetting?.value as AboutSettings | null) ?? {
    text: 'Noryx Studio is where precision meets style. Our master barbers bring years of experience and an unwavering passion for the perfect cut.',
  }

  return (
    <section id="about" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — brand story */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
                Our Story
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl tracking-[0.05em] text-text-primary mb-6">
              MORE THAN JUST A CUT
            </h2>
            <div className="w-12 h-0.5 bg-gold mb-6" />
            <p className="text-text-muted font-body text-base leading-relaxed">
              {about.text}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-text-muted tracking-[0.2em] font-body uppercase">
                Est. 2019
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          {/* Right — stats grid */}
          <div className="grid grid-cols-2 gap-px bg-border">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-surface-elevated p-8 flex flex-col items-start justify-center group hover:bg-surface transition-colors"
              >
                <div className="font-display text-5xl md:text-6xl text-gold tracking-wider mb-2 group-hover:text-gold-light transition-colors">
                  {value}
                </div>
                <div className="text-[11px] text-text-muted font-body tracking-[0.15em] uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

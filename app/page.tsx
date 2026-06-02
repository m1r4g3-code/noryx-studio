import type { Metadata } from 'next'
import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { ServicesSection } from '@/components/public/ServicesSection'
import { AboutSection } from '@/components/public/AboutSection'
import { ReviewsSection } from '@/components/public/ReviewsSection'
import { BookingCTABanner } from '@/components/public/BookingCTABanner'
import { Footer } from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Noryx Studio | Premium Barbershop Lagos',
}

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesSection />
      <AboutSection />
      <ReviewsSection />
      <BookingCTABanner />
      <Footer />
    </main>
  )
}

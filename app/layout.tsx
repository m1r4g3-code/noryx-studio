import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Orbitron, Rajdhani, Exo_2 } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://noryx-studio.vercel.app'),
  title: {
    default: 'Noryx Studio | Premium Barbershop Lagos',
    template: '%s | Noryx Studio',
  },
  description:
    'Sharp cuts, clean lines, premium grooming. Book your appointment at Noryx Studio in Lagos.',
  keywords: [
    'barbershop',
    'haircut',
    'fade',
    'beard trim',
    'grooming',
    'Lagos',
    'Noryx Studio',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Noryx Studio',
    url: 'https://noryx-studio.vercel.app',
    title: 'Noryx Studio | Premium Barbershop',
    description: 'Precision. Style. Identity. Premium grooming in Lagos.',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Noryx Studio — Precision. Style. Identity.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noryx Studio | Premium Barbershop',
    description: 'Precision. Style. Identity. Premium grooming in Lagos.',
    images: ['/og.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${orbitron.variable} ${rajdhani.variable} ${exo2.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}

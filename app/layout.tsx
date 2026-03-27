import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Valore Milano | Luxury Italian Tableware',
  description: 'Discover timeless elegance with Valore Milano premium porcelain tableware. Handcrafted in Italy with exceptional attention to detail.',
  keywords: ['luxury tableware', 'Italian porcelain', 'premium dinnerware', 'fine dining', 'Valore Milano'],
  authors: [{ name: 'Valore Milano' }],
  openGraph: {
    title: 'Valore Milano | Luxury Italian Tableware',
    description: 'Discover timeless elegance with Valore Milano premium porcelain tableware.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#5A5F5A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

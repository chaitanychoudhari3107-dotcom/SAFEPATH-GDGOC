import type { Metadata, Viewport } from 'next'
import { DM_Sans, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700']
});

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'SafePath | AI-Powered Safe Navigation',
  description: 'Navigate safely with AI-powered route analysis. Real-time safety scoring, community feedback, and emergency SOS features for your journey.',
  generator: 'SafePath',
  keywords: ['safety', 'navigation', 'women safety', 'route planning', 'AI', 'Pune'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${spaceMono.variable} font-sans antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

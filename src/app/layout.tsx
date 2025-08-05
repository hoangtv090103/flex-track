import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { AppLayout } from '@/components/AppLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlexTrack - Fitness Tracker',
  description: 'Track your workouts effectively with FlexTrack',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="vi">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">
            <AppLayout>
              {children}
            </AppLayout>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}

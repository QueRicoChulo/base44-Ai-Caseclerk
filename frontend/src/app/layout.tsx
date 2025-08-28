/**
 * Root layout for CaseClerk AI Next.js application.
 * Provides global styles, metadata, and common layout structure.
 * Wraps all pages with consistent styling and configuration.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CaseClerk AI - Legal Practice Management',
  description: 'AI-powered legal practice management system for modern law firms',
  keywords: ['legal', 'practice management', 'AI', 'law firm', 'case management'],
  authors: [{ name: 'Base44' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
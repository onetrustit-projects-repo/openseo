import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenSEO - Self-Hosted SEO Platform',
  description: '100% self-hosted SEO tool with no third-party API dependencies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}

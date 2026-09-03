import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leafline Events — Every event begins with a leaf of faith.',
  description: 'Leafline Events — full-service event management, weddings, brand activations and unforgettable experiences.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

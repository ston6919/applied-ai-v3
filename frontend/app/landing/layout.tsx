import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Get Your Free Template - Applied AI',
  description: 'Get your free AI template and join our community',
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  )
}

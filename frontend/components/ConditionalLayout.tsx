'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname.startsWith('/landing/')
  const isToolsListPage = pathname === '/tools-list'
  const isOfferPage = pathname.startsWith('/offer/')
  const isVibeCodingPage = pathname.startsWith('/vibe-coding/')
  const isVibeCodingMiniCoursePage = pathname.startsWith('/vibe-coding-mini-course')

  if (
    isLandingPage ||
    isToolsListPage ||
    isOfferPage ||
    isVibeCodingPage ||
    isVibeCodingMiniCoursePage
  ) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}









'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function StickyBuyButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      setVisible(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
      <Link
        href="/api/checkout"
        prefetch={false}
        className="pointer-events-auto bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white text-sm md:text-base px-4 md:px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <span>Buy now</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}


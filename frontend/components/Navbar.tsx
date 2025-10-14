'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur border-b border-gray-200' 
        : 'bg-transparent border-b border-transparent backdrop-blur-none'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center py-3">
          {/* Left: Logo */}
          <div className="justify-self-start">
            <Link href="/" className="group">
              <div className="flex flex-col leading-tight">
                <img 
                  src="/AppliedAILogo.svg" 
                  alt="Applied AI" 
                  className="h-14 w-auto"
                />
                <span className={`text-xs group-hover:text-primary-600 transition-colors ${
                  isScrolled ? 'text-gray-500' : 'text-gray-600'
                }`}>by Matt Penny</span>
              </div>
            </Link>
          </div>

          {/* Center: Menu pill */}
          <div className="justify-self-center">
            <div className={`hidden md:flex items-center gap-6 rounded-full px-5 py-2 transition-all duration-300 ${
              isScrolled 
                ? 'shadow-sm border border-gray-200 backdrop-blur bg-white/70' 
                : 'border border-gray-200/50 backdrop-blur-none bg-white/95'
            }`}>
              <Link href="/" className="px-3 py-1 rounded-full text-gray-700 hover:text-primary-600 transition-all hover:ring-2 hover:ring-primary-300/70 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none hover:py-0.5 focus-visible:py-0.5">Home</Link>
              <Link href="/news" className="px-3 py-1 rounded-full text-gray-700 hover:text-primary-600 transition-all hover:ring-2 hover:ring-primary-300/70 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none hover:py-0.5 focus-visible:py-0.5">News</Link>
              <Link href="/tools" className="px-3 py-1 rounded-full text-gray-700 hover:text-primary-600 transition-all hover:ring-2 hover:ring-primary-300/70 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none hover:py-0.5 focus-visible:py-0.5">Tools</Link>
              <Link href="/templates" className="px-3 py-1 rounded-full text-gray-700 hover:text-primary-600 transition-all hover:ring-2 hover:ring-primary-300/70 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none hover:py-0.5 focus-visible:py-0.5">Templates</Link>
            </div>
          </div>

          {/* Right: Gradient CTA */}
          <div className="justify-self-end hidden md:block">
            <a
              href="https://www.skool.com/applied-ai-mastermind-9612"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient"
            >
              Join the Mastermind
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden justify-self-end">
            <button
              className="p-2 rounded-md border border-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link>
              <Link href="/news" className="text-gray-700 hover:text-primary-600 transition-colors">News</Link>
              <Link href="/tools" className="text-gray-700 hover:text-primary-600 transition-colors">Tools</Link>
              <Link href="/templates" className="text-gray-700 hover:text-primary-600 transition-colors">Templates</Link>
              <a
                href="https://www.skool.com/applied-ai-mastermind-9612"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient text-center"
              >
                Join the Mastermind
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

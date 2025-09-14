'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Applied AI
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-primary-600 transition-colors">
              News
            </Link>
            <Link href="/tools" className="text-gray-700 hover:text-primary-600 transition-colors">
              Tools
            </Link>
            <Link href="/automations" className="text-gray-700 hover:text-primary-600 transition-colors">
              Automations
            </Link>
            <Link href="/mastermind" className="text-gray-700 hover:text-primary-600 transition-colors">
              Mastermind
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/news" className="text-gray-700 hover:text-primary-600 transition-colors">
                News
              </Link>
              <Link href="/tools" className="text-gray-700 hover:text-primary-600 transition-colors">
                Tools
              </Link>
              <Link href="/automations" className="text-gray-700 hover:text-primary-600 transition-colors">
                Automations
              </Link>
              <Link href="/mastermind" className="text-gray-700 hover:text-primary-600 transition-colors">
                Mastermind
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

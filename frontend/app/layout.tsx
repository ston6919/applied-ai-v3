import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Applied AI - Your AI Solutions Partner',
  description: 'Discover the latest AI tools, automations, and insights with Applied AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          async
        />
      </head>
      <body className={inter.className}>
        {/* Global background layers */}
        <svg className="wave-svg" preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80">
          <defs>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>
          <g filter="url(#blur)">
            <path fill="rgba(139, 92, 246, 0.5)" className="out-top" transform="translate(-4 -4)" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"/>
            <path fill="rgba(236, 72, 153, 0.45)" className="in-top" transform="translate(-4 -4)" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"/>
            <path fill="rgba(99, 102, 241, 0.4)" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"/>
            <path fill="rgba(245, 158, 11, 0.35)" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"/>
          </g>
        </svg>
        <div className="white-overlay" />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}

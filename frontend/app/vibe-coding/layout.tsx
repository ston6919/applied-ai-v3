import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function VibeCodingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">{children}</div>
    </div>
  )
}


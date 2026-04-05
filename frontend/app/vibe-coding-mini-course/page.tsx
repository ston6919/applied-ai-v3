import type { Metadata } from 'next'
import VibeCodingMiniCourseSignup from '@/components/VibeCodingMiniCourseSignup'

export const metadata: Metadata = {
  title: 'Free 3-Day Vibe Coding Mini Course | Applied AI',
  description:
    'Learn to turn your ideas into real applications. A free three-day introduction to vibe coding.',
}

export default function VibeCodingMiniCoursePage() {
  return <VibeCodingMiniCourseSignup />
}

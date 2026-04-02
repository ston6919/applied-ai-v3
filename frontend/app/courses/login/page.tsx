import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import LoginForm from '@/app/courses/login/LoginForm'
import { getCoursesUserFromCookies } from '@/lib/courses-auth'

export const metadata: Metadata = {
  title: 'Courses Login | Applied AI',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CoursesLoginPage() {
  const user = await getCoursesUserFromCookies()
  if (user) {
    redirect('/courses')
  }

  return <LoginForm />
}


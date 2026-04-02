import { Metadata } from 'next'
import ResetPasswordForm from '@/app/courses/reset-password/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Set Password | Applied AI',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CoursesSetPasswordPage() {
  return <ResetPasswordForm />
}


'use client'

import { useRouter } from 'next/navigation'

export default function CoursesLogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/courses/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/courses/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
    >
      Log out
    </button>
  )
}


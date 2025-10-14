'use client'

import { ChatKit, useChatKit } from '@openai/chatkit-react'

function getOrCreateDeviceId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const storageKey = 'chatkit_device_id'
    const existing = window.localStorage.getItem(storageKey)
    if (existing) return existing
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    window.localStorage.setItem(storageKey, id)
    return id
  } catch {
    return undefined
  }
}

export default function ChatKitWidget() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing?: string) {
        // Optionally implement refresh based on `existing`
        const deviceId = getOrCreateDeviceId()
        const res = await fetch('/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId }),
        })
        if (!res.ok) {
          throw new Error('Failed to obtain ChatKit client secret')
        }
        const { client_secret } = await res.json()
        return client_secret as string
      },
    },
  })

  return (
    <ChatKit control={control} className="h-[600px] w-full" />
  )
}



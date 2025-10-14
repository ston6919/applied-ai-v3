'use client'

import { useState } from 'react'

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('')
  const [publicUrl, setPublicUrl] = useState<string>('')

  async function handleUpload() {
    if (!file) {
      setStatus('Pick a file first')
      return
    }
    setStatus('Requesting upload URL...')

    const key = `dev-uploads/${Date.now()}-${file.name}`
    const res = await fetch('http://localhost:8010/api/storage/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, contentType: file.type || 'application/octet-stream', acl: 'public-read' })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      setStatus(`Failed to get URL: ${res.status} ${JSON.stringify(err)}`)
      return
    }
    const data = await res.json()
    setStatus('Uploading...')

    const putRes = await fetch(data.url, {
      method: 'PUT',
      headers: { 'Content-Type': data.headers['Content-Type'] },
      body: file
    })
    if (!putRes.ok) {
      const text = await putRes.text()
      setStatus(`Upload failed: ${putRes.status} ${text}`)
      return
    }
    setStatus('Uploaded!')
    if (data.publicUrl) setPublicUrl(data.publicUrl)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Spaces Upload Test</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpload}>Upload</button>
      <div className="text-sm text-gray-700">{status}</div>
      {publicUrl ? (
        <div className="mt-2">
          <div className="font-medium">Public URL</div>
          <a className="text-blue-700 underline" href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
        </div>
      ) : null}
    </div>
  )
}



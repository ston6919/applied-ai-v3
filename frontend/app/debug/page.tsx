'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [supabaseTest, setSupabaseTest] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
        : 'NOT SET',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    })

    // Test Supabase connection
    if (supabase) {
      supabase
        .from('canonical_news_story')
        .select('count')
        .limit(1)
        .then(({ data, error }: { data: any, error: any }) => {
          setSupabaseTest({
            connected: !error,
            error: error?.message || null,
            tableExists: !error || error.code !== 'PGRST204',
          })
        })
        .catch((err: any) => {
          setSupabaseTest({
            connected: false,
            error: err.message,
            tableExists: false,
          })
          setError(err.message)
        })
    } else {
      setSupabaseTest({
        connected: false,
        error: 'Supabase client is null - environment variables missing',
        tableExists: false,
      })
      setError('Supabase client not initialized')
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
          {supabaseTest ? (
            <div>
              <p className="mb-2">
                <strong>Connected:</strong>{' '}
                <span className={supabaseTest.connected ? 'text-green-600' : 'text-red-600'}>
                  {supabaseTest.connected ? 'Yes ✓' : 'No ✗'}
                </span>
              </p>
              <p className="mb-2">
                <strong>Table Exists:</strong>{' '}
                <span className={supabaseTest.tableExists ? 'text-green-600' : 'text-yellow-600'}>
                  {supabaseTest.tableExists ? 'Yes ✓' : 'Unknown/Error'}
                </span>
              </p>
              {supabaseTest.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <strong className="text-red-800">Error:</strong>
                  <pre className="mt-2 text-sm text-red-700">{supabaseTest.error}</pre>
                </div>
              )}
            </div>
          ) : (
            <p>Testing connection...</p>
          )}
        </section>

        {error && (
          <section className="card p-6 bg-red-50 border border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Error</h2>
            <pre className="text-red-700">{error}</pre>
          </section>
        )}

        <section className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Check that <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> exists in the frontend directory</li>
            <li>Verify environment variables start with <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_</code></li>
            <li>Restart the dev server after changing <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code></li>
            <li>Check browser console (F12) for any runtime errors</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

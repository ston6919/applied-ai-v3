import ToolsPageClient from './ToolsPageClient'

export default async function ToolsPage() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8010'

  const response = await fetch(`${base}/api/tools/?page=1`, {
    // Cache on the server for a short time so most users get an instant render,
    // but data is still reasonably fresh.
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    // If the API is down, still render the page shell without crashing.
    return <ToolsPageClient />
  }

  const data = await response.json()
  const initialTools = data.results || data
  const initialHasMore = !!data.next

  return (
    <ToolsPageClient 
      initialTools={initialTools} 
      initialHasMore={initialHasMore} 
    />
  )
}

export default function MastermindRedirect() {
  // Client-side redirect as a fallback for any deep links
  if (typeof window !== 'undefined') {
    window.open('https://www.skool.com/applied-ai-mastermind-9612', '_blank', 'noopener,noreferrer')
  }
  return null
}

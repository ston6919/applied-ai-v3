import AutomationsList from '@/components/AutomationsList'

export default function AutomationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Automations</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our collection of AI-powered automations designed to 
          simplify complex tasks and boost efficiency.
        </p>
      </div>
      <AutomationsList />
    </div>
  )
}

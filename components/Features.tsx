import Link from 'next/link'

export default function Features() {
  const features = [
    {
      title: 'Latest AI News',
      description: 'Stay updated with the most recent developments in artificial intelligence and machine learning.',
      icon: '📰',
      link: '/news'
    },
    {
      title: 'AI Tools',
      description: 'Discover powerful AI tools and resources to enhance your productivity and workflows.',
      icon: '🛠️',
      link: '/tools'
    },
    {
      title: 'Automations',
      description: 'Explore AI-powered automations that simplify complex tasks and boost efficiency.',
      icon: '⚡',
      link: '/automations'
    },
    {
      title: 'Mastermind Community',
      description: 'Join our exclusive community of AI enthusiasts, entrepreneurs, and innovators.',
      icon: '🧠',
      link: '/mastermind'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to leverage AI for your business and personal projects.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

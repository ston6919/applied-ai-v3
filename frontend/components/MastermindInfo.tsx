export default function MastermindInfo() {
  const benefits = [
    {
      icon: '🤝',
      title: 'Exclusive Community',
      description: 'Connect with like-minded AI enthusiasts, entrepreneurs, and industry leaders.'
    },
    {
      icon: '📚',
      title: 'Expert Knowledge',
      description: 'Access to exclusive content, tutorials, and insights from AI experts.'
    },
    {
      icon: '🚀',
      title: 'Growth Opportunities',
      description: 'Collaborate on projects, find business partners, and accelerate your AI journey.'
    },
    {
      icon: '💡',
      title: 'Innovation Hub',
      description: 'Be part of cutting-edge AI discussions and early access to new technologies.'
    }
  ]

  const membershipTiers = [
    {
      name: 'Basic',
      price: '$29/month',
      features: [
        'Access to community forum',
        'Weekly AI insights newsletter',
        'Basic automation templates',
        'Community support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$79/month',
      features: [
        'Everything in Basic',
        'Exclusive mastermind calls',
        'Advanced automation tools',
        '1-on-1 consultation (monthly)',
        'Early access to new features'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Everything in Pro',
        'Custom automation development',
        'Dedicated account manager',
        'Priority support',
        'Custom training sessions'
      ],
      popular: false
    }
  ]

  return (
    <div className="space-y-16">
      {/* Benefits Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Our Mastermind?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a community of forward-thinking individuals who are leveraging AI to transform their businesses and careers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Tiers */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Membership</h2>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your needs and goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`card relative ${
                tier.popular 
                  ? 'ring-2 ring-primary-600 transform scale-105' 
                  : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">{tier.price}</div>
                {tier.price !== 'Custom' && (
                  <p className="text-gray-500">per month</p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  tier.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your AI Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already leveraging AI to achieve their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Stats() {
  const stats = [
    { number: '500+', label: 'AI Tools Available' },
    { number: '50+', label: 'Automations Created' },
    { number: '1000+', label: 'Community Members' },
    { number: '24/7', label: 'Support Available' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

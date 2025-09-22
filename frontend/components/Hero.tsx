import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          AI that drives results, not just looks smart
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover the power of artificial intelligence with our cutting-edge tools, 
          automations, and insights. Transform your business with AI solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tools" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Explore Tools
          </Link>
          <a
            href="https://www.skool.com/applied-ai-mastermind-9612"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600"
          >
            Join Mastermind
          </a>
        </div>
      </div>
    </section>
  )
}

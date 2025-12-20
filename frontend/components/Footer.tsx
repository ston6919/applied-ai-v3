import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Applied AI</h3>
            <p className="text-gray-400">
              Your trusted partner in AI solutions and innovation.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-white transition-colors">News</Link></li>
              <li><Link href="/tools" className="text-gray-400 hover:text-white transition-colors">Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-gray-400 hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="/mastermind" className="text-gray-400 hover:text-white transition-colors">Mastermind</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 mb-4">
              Get in touch with our team for AI solutions and support.
            </p>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Applied AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

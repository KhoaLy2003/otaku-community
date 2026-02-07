import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Project Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Otaku Community
              </span>
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              A social platform built for anime, manga, and otaku culture lovers. Connect, create, and share with like-minded fans.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <Link to={ROUTES.LOGIN} className="text-gray-400 hover:text-purple-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="text-gray-400 hover:text-purple-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FEEDBACK} className="text-gray-400 hover:text-purple-400 transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Otaku Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


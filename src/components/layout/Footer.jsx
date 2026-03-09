import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-border-light mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="text-xl font-bold text-text-dark">APIMart</span>
            </div>
            <p className="text-text-secondary text-sm">
              One API for 500+ AI models. Simple, fast, and reliable.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-text-dark mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-text-secondary hover:text-primary text-sm">API Marketplace</Link></li>
              <li><Link to="/pricing" className="text-text-secondary hover:text-primary text-sm">Pricing</Link></li>
              <li><Link to="/docs" className="text-text-secondary hover:text-primary text-sm">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-text-dark mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-primary text-sm">About</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary text-sm">Blog</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary text-sm">Careers</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-text-dark mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-primary">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-primary">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border-light mt-8 pt-8 text-center">
          <p className="text-text-secondary text-sm">
            © {currentYear} APIMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

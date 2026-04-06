import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { FaDiscord, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const marketLinks = [
    { name: 'Seedream 5.0 Lite API', path: '/api/seedream-5-lite' },
    { name: 'Seedream 4.5 API', path: '/api/seedream-4-5' },
    { name: 'Sora 2 API', path: '/api/sora-2' },
    { name: 'Sora 2 Pro API', path: '/api/sora-2-pro' },
    { name: 'Veo 3.1 API', path: '/api/veo-3-1' },
    { name: 'Nano Banana 2 API', path: '/api/nano-banana-2' },
    { name: '4o Image API', path: '/api/gpt-4o-image' },
    { name: 'ALL Models', path: '/marketplace' },
  ];

  const alternativeLinks = [
    { name: 'Fal.ai Alternative', path: '#' },
    { name: 'Replicate Alternative', path: '#' },
    { name: 'AIMLAPI Alternative', path: '#' },
  ];

  const resourceLinks = [
    { name: 'API Documentation', path: '/docs' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
    { name: 'Cookie Policy', path: '#' },
  ];

  return (
    <footer className="bg-surface border-t border-border-light mt-auto circuit-bg">
      <div className="section-container py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Market */}
          <div>
            <h4 className="font-semibold text-text-dark mb-4 text-sm">Market</h4>
            <ul className="space-y-2.5">
              {marketLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-text-secondary hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternative */}
          <div>
            <h4 className="font-semibold text-text-dark mb-4 text-sm">Alternative</h4>
            <ul className="space-y-2.5">
              {alternativeLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-text-secondary hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-text-dark mb-4 text-sm">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-text-secondary hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logoNIcon/supremind-ai-2.png" alt="supremind.ai" className="h-7 w-auto" />
              <span className="text-base font-bold text-text-dark">supremind.ai</span>
            </div>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              One API for 500+ AI models. Simple, fast, and reliable.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                <FaDiscord size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                <FaXTwitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                <FiMail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border-light mt-10 pt-6 text-center">
          <p className="text-text-muted text-xs">
            &copy; {currentYear} supremind.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../atoms';
import { useAuth } from '../../context';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Docs', path: '/docs' },
  ];

  return (
    <header className="bg-white border-b-2 border-border-light sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold text-text-dark">APIMart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-text-dark hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  <FiUser className="inline mr-2" />
                  {user?.name}
                </Button>
                <Button variant="primary" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => navigate('/login')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-light">
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-text-dark hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border-light">
                {isLoggedIn ? (
                  <>
                    <Button variant="secondary" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                      Dashboard
                    </Button>
                    <Button variant="primary" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                      Login
                    </Button>
                    <Button variant="primary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

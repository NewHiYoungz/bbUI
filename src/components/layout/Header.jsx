import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { FiMenu, FiX, FiChevronDown, FiExternalLink, FiUser, FiKey, FiLogOut } from 'react-icons/fi';

const navMenus = [
  {
    label: 'API Market',
    path: '/marketplace',
  },
  {
    label: 'AI Video API',
    children: [
      { name: 'Sora 2 API', id: 'sora-2' },
      { name: 'Sora 2 Pro API', id: 'sora-2-pro', badge: 'NEW' },
      { name: 'Veo 3.1 API', id: 'veo-3-1', badge: 'NEW' },
      { name: 'WAN 2.6 API', id: 'wan-2-6' },
      { name: 'Hailuo 02 API', id: 'hailuo-02' },
    ],
  },
  {
    label: 'AI Image API',
    badge: 'NEW',
    children: [
      { name: 'Seedream 5.0 Lite', id: 'seedream-5-lite', badge: 'NEW' },
      { name: 'Seedream 4.5 API', id: 'seedream-4-5' },
      { name: 'Nano Banana 2', id: 'nano-banana-2', badge: 'NEW' },
      { name: '4o Image API', id: 'gpt-4o-image' },
      { name: 'DALL-E 3 API', id: 'dall-e-3' },
    ],
  },
  {
    label: 'AI Chat',
    path: '/chat',
  },
  {
    label: 'API Docs',
    path: '/docs',
    external: true,
  },
];

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (idx) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(idx);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header className="bg-surface border-b border-border-light sticky top-0 z-50">
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logoNIcon/supremind-ai.png" alt="supremind.ai" className="h-8 w-auto" />
            <span className="text-lg font-bold text-text-dark">supremind.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navMenus.map((menu, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => menu.children && handleMouseEnter(idx)}
                onMouseLeave={menu.children ? handleMouseLeave : undefined}
              >
                {menu.children ? (
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${openDropdown === idx ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-dark hover:bg-surface-light'}`}
                  >
                    {menu.label}
                    {menu.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-md leading-none">
                        {menu.badge}
                      </span>
                    )}
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={menu.path}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${location.pathname === menu.path ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-dark hover:bg-surface-light'}`}
                  >
                    {menu.label}
                    {menu.external && <FiExternalLink className="w-3 h-3" />}
                  </Link>
                )}

                {/* Dropdown */}
                {menu.children && openDropdown === idx && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-surface rounded-[10px] border border-border-light shadow-dropdown py-2 z-50">
                    {menu.children.map((child) => (
                      <Link
                        key={child.id}
                        to={`/api/${child.id}`}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-light hover:text-primary transition-colors"
                      >
                        <span>{child.name}</span>
                        {child.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-md leading-none">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-text-secondary hover:bg-surface-light transition-colors"
                >
                  <div className="w-7 h-7 bg-primary/15 rounded-full flex items-center justify-center">
                    <FiUser className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-text-dark">{user?.name}</span>
                  <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface rounded-[10px] border border-border-light shadow-dropdown py-2 z-50">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-light hover:text-primary transition-colors">
                      <FiKey className="w-4 h-4" /> API Keys
                    </Link>
                    <Link to="/dashboard?tab=billing" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-light hover:text-primary transition-colors">
                      <FiUser className="w-4 h-4" /> Billing
                    </Link>
                    <div className="border-t border-border-light my-1" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-dark transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/login?mode=signup')}
                  className="btn-primary !py-2 !px-5 text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:bg-surface-light rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border-light">
          <div className="section-container py-4 space-y-1">
            {navMenus.map((menu, idx) => (
              <div key={idx}>
                {menu.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                      className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-light"
                    >
                      <span className="flex items-center gap-2">
                        {menu.label}
                        {menu.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-md">
                            {menu.badge}
                          </span>
                        )}
                      </span>
                      <FiChevronDown className={`w-4 h-4 transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === idx && (
                      <div className="ml-4 space-y-1">
                        {menu.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/api/${child.id}`}
                            className="flex items-center justify-between px-3 py-2.5 text-sm text-text-muted hover:text-primary rounded-lg"
                          >
                            <span>{child.name}</span>
                            {child.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-md">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={menu.path}
                    className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-light"
                  >
                    {menu.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="border-t border-border-light pt-4 mt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full text-sm">
                    Dashboard
                  </button>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="btn-secondary w-full text-sm">
                    Log in
                  </button>
                  <button onClick={() => navigate('/login?mode=signup')} className="btn-primary w-full text-sm">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

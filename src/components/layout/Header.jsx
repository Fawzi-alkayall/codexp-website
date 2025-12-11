import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Search, Sparkles, Menu, X } from 'lucide-react';
import { COMPANY, NAV_LINKS } from '../../constants';
import { useAIChat } from '../../context';

/**
 * Header/AppBar component
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-bar">
      <div className="header-content">
        <Logo />
        <NavMenu onNavigate={closeMobileMenu} />
        <SearchBar />
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onNavigate={closeMobileMenu} />
      <ProgressiveBlur />
    </header>
  );
}

/**
 * Navigation Menu with smooth scroll
 */
function NavMenu({ onNavigate }) {
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Add highlighting animation to target section
      targetElement.classList.add('section-highlight');
      setTimeout(() => {
        targetElement.classList.remove('section-highlight');
      }, 1500);

      // Smooth scroll with offset for header
      const headerHeight = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    if (onNavigate) onNavigate();
  }, [onNavigate]);

  return (
    <nav className="nav-menu">
      {NAV_LINKS.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className="nav-link"
          onClick={(e) => handleNavClick(e, link.href)}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="nav-link-text">{link.label}</span>
          <span className="nav-link-underline" />
        </a>
      ))}
    </nav>
  );
}

NavMenu.propTypes = {
  onNavigate: PropTypes.func,
};

/**
 * Mobile Navigation Menu
 */
function MobileMenu({ isOpen, onNavigate }) {
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.classList.add('section-highlight');
      setTimeout(() => {
        targetElement.classList.remove('section-highlight');
      }, 1500);

      const headerHeight = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    if (onNavigate) onNavigate();
  }, [onNavigate]);

  return (
    <div className={`mobile-menu ${isOpen ? 'mobile-menu-open' : ''}`}>
      <nav className="mobile-nav">
        {NAV_LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={(e) => handleNavClick(e, link.href)}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func,
};

/**
 * Logo component with company branding
 */
export function Logo() {
  return (
    <a href="/" className="app-title">
      <img src="/logo.png" alt={COMPANY.name} className="logo" />
      <span
        style={{
          fontSize: '24px',
          fontWeight: '700',
          marginLeft: '12px',
          background: 'linear-gradient(135deg, #007af4, #00c6ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {COMPANY.name}
      </span>
    </a>
  );
}

/**
 * Search bar component for header - Opens AI Chat
 */
export function SearchBar({ placeholder = 'Ask AI about our services...' }) {
  const [inputValue, setInputValue] = useState('');
  const { openChat } = useAIChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    openChat(inputValue.trim());
    setInputValue('');
  };

  const handleClick = () => {
    if (!inputValue.trim()) {
      openChat('');
    }
  };

  return (
    <form className="header-search shine" onSubmit={handleSubmit}>
      <div className="header-ai-badge">
        <Sparkles size={12} />
      </div>
      <input
        type="text"
        className="header-search-input"
        placeholder={placeholder}
        aria-label="Ask AI"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={handleClick}
      />
      <button type="submit" className="header-search-button" aria-label="Search with AI">
        <Search size={20} />
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

/**
 * Progressive blur effect for header
 */
function ProgressiveBlur() {
  return (
    <div className="progressive-blur">
      <div className="gradient" />
      <div className="blur-filter" />
    </div>
  );
}

export default Header;

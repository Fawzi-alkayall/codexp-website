import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Search, Sparkles, Menu, X } from 'lucide-react';
import { COMPANY, NAV_LINKS } from '../../constants';
import { useAIChat } from '../../context';
import { useNavigation } from '../../hooks';

/**
 * Header/AppBar component
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

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
          aria-expanded={mobileMenuOpen}
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
const NavMenu = memo(function NavMenu({ onNavigate }) {
  const handleNavClick = useNavigation({ onNavigate });

  return (
    <nav className="nav-menu" role="navigation" aria-label="Main navigation">
      {NAV_LINKS.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className="nav-link"
          onClick={(e) => handleNavClick(e, link.href)}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="nav-link-text">{link.label}</span>
          <span className="nav-link-underline" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
});

NavMenu.propTypes = {
  onNavigate: PropTypes.func,
};

/**
 * Mobile Navigation Menu
 */
const MobileMenu = memo(function MobileMenu({ isOpen, onNavigate }) {
  const handleNavClick = useNavigation({ onNavigate });

  return (
    <div 
      className={`mobile-menu ${isOpen ? 'mobile-menu-open' : ''}`}
      aria-hidden={!isOpen}
    >
      <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
        {NAV_LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={(e) => handleNavClick(e, link.href)}
            style={{ animationDelay: `${index * 80}ms` }}
            tabIndex={isOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
});

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onNavigate: PropTypes.func,
};

/**
 * Logo component with company branding
 */
export const Logo = memo(function Logo() {
  return (
    <a href="/" className="app-title" aria-label={`${COMPANY.name} - Home`}>
      <img 
        src="/logo.png" 
        alt="" 
        className="logo" 
        loading="eager"
        width="150"
        height="auto"
      />
      <span className="logo-text">
        {COMPANY.name}
      </span>
    </a>
  );
});

/**
 * Search bar component for header - Opens AI Chat
 */
export const SearchBar = memo(function SearchBar({ placeholder = 'Ask AI about our services...' }) {
  const [inputValue, setInputValue] = useState('');
  const { openChat } = useAIChat();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    openChat(inputValue.trim());
    setInputValue('');
  }, [inputValue, openChat]);

  const handleClick = useCallback(() => {
    if (!inputValue.trim()) {
      openChat('');
    }
  }, [inputValue, openChat]);

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <form className="header-search shine" onSubmit={handleSubmit}>
      <div className="header-ai-badge" aria-hidden="true">
        <Sparkles size={12} />
      </div>
      <input
        type="text"
        className="header-search-input"
        placeholder={placeholder}
        aria-label="Ask AI"
        value={inputValue}
        onChange={handleChange}
        onClick={handleClick}
      />
      <button type="submit" className="header-search-button" aria-label="Search with AI">
        <Search size={20} />
      </button>
    </form>
  );
});

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

/**
 * Progressive blur effect for header
 */
const ProgressiveBlur = memo(function ProgressiveBlur() {
  return (
    <div className="progressive-blur" aria-hidden="true">
      <div className="gradient" />
      <div className="blur-filter" />
    </div>
  );
});

export default Header;

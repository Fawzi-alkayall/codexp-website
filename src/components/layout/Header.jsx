import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { COMPANY } from '../../constants';

/**
 * Header/AppBar component
 */
export function Header() {
  return (
    <header className="app-bar">
      <div className="header-content">
        <Logo />
        <SearchBar />
      </div>
      <ProgressiveBlur />
    </header>
  );
}

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
 * Search bar component for header
 */
export function SearchBar({ placeholder = 'Search services...' }) {
  return (
    <div className="header-search shine">
      <input
        type="text"
        className="header-search-input"
        placeholder={placeholder}
        aria-label="Search"
      />
      <button className="header-search-button" aria-label="Search">
        <Search size={20} />
      </button>
    </div>
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

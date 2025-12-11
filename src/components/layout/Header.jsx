import { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, Sparkles } from 'lucide-react';
import { COMPANY } from '../../constants';
import { useAIChat } from '../../context';

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

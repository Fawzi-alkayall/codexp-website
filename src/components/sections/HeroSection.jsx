import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { COMPANY } from '../../constants';
import { useAIChat } from '../../context';

/**
 * Hero section - Main landing section with AI-powered search
 */
export function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <HeroTitle />
      <HeroDescription />
      <HeroSearch />
      <HeroBackground />
    </section>
  );
}

/**
 * Hero title with company name
 */
function HeroTitle() {
  return <h1>{COMPANY.name}</h1>;
}

/**
 * Hero description text
 */
function HeroDescription() {
  return <p>{COMPANY.description}</p>;
}

/**
 * Hero search input - AI powered
 */
function HeroSearch() {
  const [inputValue, setInputValue] = useState('');
  const { openChat } = useAIChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    openChat(inputValue.trim());
    setInputValue('');
  };

  return (
    <form className="search-container shine" onSubmit={handleSubmit}>
      <div className="search-ai-badge">
        <Sparkles size={14} />
        <span>AI</span>
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="How can we help your business today?"
        aria-label="Ask AI about our services"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="search-button" aria-label="Search with AI">
        <Search size={24} />
      </button>
    </form>
  );
}

/**
 * Hero background glow effect
 */
function HeroBackground() {
  return (
    <div className="hero-background">
      <div className="hero-glow" />
    </div>
  );
}

export default HeroSection;

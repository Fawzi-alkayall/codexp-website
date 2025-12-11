import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Search, Sparkles, Code2, Brain, Cpu, Terminal } from 'lucide-react';
import { COMPANY } from '../../constants';
import { useAIChat } from '../../context';

/**
 * Hero section - Main landing section with AI-powered search
 */
export function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <FloatingIcons />
      <HeroTitle />
      <HeroDescription />
      <HeroSearch />
      <HeroBackground />
    </section>
  );
}

/**
 * Floating icon configuration
 */
const FLOATING_ICONS = [
  { Icon: Code2, delay: 0, position: { top: '15%', left: '10%' } },
  { Icon: Brain, delay: 0.5, position: { top: '25%', right: '12%' } },
  { Icon: Cpu, delay: 1, position: { bottom: '30%', left: '8%' } },
  { Icon: Terminal, delay: 1.5, position: { bottom: '25%', right: '10%' } },
];

/**
 * Floating tech icons around the hero
 */
const FloatingIcons = memo(function FloatingIcons() {
  return (
    <div className="hero-floating-icons" aria-hidden="true">
      {FLOATING_ICONS.map(({ Icon, delay, position }, index) => (
        <div
          key={index}
          className="floating-icon"
          style={{
            ...position,
            animationDelay: `${delay}s`,
          }}
        >
          <Icon size={24} />
        </div>
      ))}
    </div>
  );
});

/**
 * Hero title with company name and typing effect
 */
function HeroTitle() {
  const [displayText, setDisplayText] = useState('');
  const fullText = useMemo(() => COMPANY.name, []);
  
  useEffect(() => {
    let index = 0;
    let isMounted = true;
    
    const timer = setInterval(() => {
      if (!isMounted) return;
      
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 150);
    
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [fullText]);

  return (
    <h1 className="hero-title">
      <span className="hero-title-text">{displayText}</span>
      <span className="hero-cursor" aria-hidden="true">|</span>
    </h1>
  );
}

/**
 * Hero description text
 */
const HeroDescription = memo(function HeroDescription() {
  return <p className="hero-description">{COMPANY.description}</p>;
});

/**
 * Hero search input - AI powered
 */
function HeroSearch() {
  const [inputValue, setInputValue] = useState('');
  const { openChat } = useAIChat();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (query || query === '') {
      openChat(query);
      setInputValue('');
    }
  }, [inputValue, openChat]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

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
        onChange={handleInputChange}
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
const HeroBackground = memo(function HeroBackground() {
  return (
    <div className="hero-background">
      <div className="hero-glow" />
    </div>
  );
});

export default HeroSection;

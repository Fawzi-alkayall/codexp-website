import { Search } from 'lucide-react';
import { COMPANY } from '../../constants';

/**
 * Hero section - Main landing section
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
 * Hero search input
 */
function HeroSearch() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
  };

  return (
    <form className="search-container shine" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="How can we help you today?"
        aria-label="Search for services"
      />
      <button type="submit" className="search-button" aria-label="Search">
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

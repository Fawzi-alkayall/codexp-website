/**
 * CodeXp Website
 * 
 * A modern, component-based React application built with best practices.
 * 
 * Architecture:
 * - /components/ui - Reusable UI components (Button, Card, Icon, Section)
 * - /components/layout - Layout components (Header, Footer, Container)
 * - /components/sections - Page sections (Hero, Services, About, Industries, CTA)
 * - /constants - Static data and configuration
 * - /hooks - Custom React hooks
 * - /utils - Utility functions
 * - /styles - Global styles and CSS modules
 * 
 * @author CodeXp Team
 * @version 2.0.0
 */

import {
  Header,
  Footer,
  HeroSection,
  ServicesSection,
  AboutSection,
  IndustriesSection,
  CTASection,
} from './components';

/**
 * Main App component
 * Renders the complete website structure
 */
function App() {
  return (
    <div className="app">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

/**
 * Main content wrapper
 * Contains all page sections
 */
function Main() {
  return (
    <main className="app-main">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <IndustriesSection />
      <CTASection />
    </main>
  );
}

export default App;

/**
 * CodeXp Website
 * 
 * A modern, component-based React application built with best practices.
 * 
 * Architecture:
 * - /components/ui - Reusable UI components (Button, Card, Icon, Section)
 * - /components/layout - Layout components (Header, Footer, Container)
 * - /components/sections - Page sections (Hero, Services, About, Industries, CTA)
 * - /components/ai - AI-powered components (AIChat)
 * - /context - React Context providers (AIChatContext)
 * - /constants - Static data and configuration
 * - /hooks - Custom React hooks
 * - /utils - Utility functions
 * 
 * @author CodeXp Team
 * @version 2.1.0
 */

import {
  Header,
  Footer,
  HeroSection,
  ServicesSection,
  AboutSection,
  IndustriesSection,
  CTASection,
  AIChat,
} from './components';
import { AIChatProvider, useAIChat } from './context';

/**
 * Main App component
 * Renders the complete website structure with AI Chat support
 */
function App() {
  return (
    <AIChatProvider>
      <div className="app">
        <Header />
        <Main />
        <Footer />
        <GlobalAIChat />
      </div>
    </AIChatProvider>
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

/**
 * Global AI Chat component
 * Controlled by the AIChatContext
 */
function GlobalAIChat() {
  const { isOpen, initialQuery, closeChat } = useAIChat();
  
  return (
    <AIChat 
      isOpen={isOpen} 
      onClose={closeChat} 
      initialQuery={initialQuery}
    />
  );
}

export default App;

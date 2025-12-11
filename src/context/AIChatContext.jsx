import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * AI Chat Context - Global state management for AI chat
 */
const AIChatContext = createContext(null);

/**
 * AI Chat Provider Component
 */
export function AIChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openChat = useCallback((query = '') => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
  }, []);

  const value = {
    isOpen,
    initialQuery,
    openChat,
    closeChat,
  };

  return (
    <AIChatContext.Provider value={value}>
      {children}
    </AIChatContext.Provider>
  );
}

AIChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use AI Chat context
 */
export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
}

export default AIChatContext;

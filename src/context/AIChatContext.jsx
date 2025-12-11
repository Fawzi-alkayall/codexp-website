import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Storage key for persisting chat messages
 */
const STORAGE_KEY = 'codexp_chat_messages';
const SESSION_EXPIRY_KEY = 'codexp_chat_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Load messages from localStorage
 */
function loadStoredMessages() {
  try {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    const now = Date.now();
    
    // Check if session has expired
    if (expiry && now > parseInt(expiry, 10)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_EXPIRY_KEY);
      return [];
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat messages:', error);
    return [];
  }
}

/**
 * Save messages to localStorage
 */
function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    // Set expiry time if not already set
    if (!localStorage.getItem(SESSION_EXPIRY_KEY)) {
      localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
    }
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
}

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
  const [messages, setMessages] = useState(() => loadStoredMessages());
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // Check for existing messages on mount
  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      setHasUnreadMessages(true);
    }
  }, []);

  const openChat = useCallback((query = '') => {
    setInitialQuery(query);
    setIsOpen(true);
    setHasUnreadMessages(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
  }, []);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
  }, []);

  const value = {
    isOpen,
    initialQuery,
    messages,
    hasUnreadMessages,
    openChat,
    closeChat,
    addMessage,
    clearMessages,
    setMessages,
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

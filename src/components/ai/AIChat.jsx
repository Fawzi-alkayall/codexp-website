import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, ArrowRight, MessageCircle, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { COMPANY, CONTACT, SERVICES, INDUSTRIES, FEATURES } from '../../constants';
import { useAIChat } from '../../context';

/**
 * AI Knowledge Base - Contains all information about CodeXp
 */
const KNOWLEDGE_BASE = {
  company: {
    name: COMPANY.name,
    fullName: COMPANY.fullName,
    tagline: COMPANY.tagline,
    description: COMPANY.description,
    founded: COMPANY.founded,
    ...CONTACT,
  },
  services: SERVICES,
  industries: INDUSTRIES,
  features: FEATURES,
  faqs: [
    {
      keywords: ['contact', 'reach', 'call', 'email', 'phone', 'talk'],
      response: `You can reach us at:\n📧 Email: ${CONTACT.email}\n📱 Phone: ${CONTACT.phone}\n📍 Address: ${CONTACT.address}\n\nWe'd love to hear from you!`,
    },
    {
      keywords: ['price', 'cost', 'pricing', 'quote', 'budget', 'how much'],
      response: `Our pricing is tailored to each project's unique requirements. We offer competitive rates and flexible engagement models.\n\nContact us at ${CONTACT.email} for a free consultation and custom quote!`,
    },
    {
      keywords: ['who', 'about', 'company', 'codexp', 'what is'],
      response: `${COMPANY.name} (${COMPANY.fullName}) is a technology company founded in ${COMPANY.founded}.\n\n${COMPANY.description}\n\nWe specialize in delivering innovative software solutions that help businesses thrive in the digital age.`,
    },
    {
      keywords: ['location', 'where', 'based', 'office', 'address'],
      response: `We're based in Amman, Jordan 🇯🇴\n\n📍 ${CONTACT.address}\n\nWe work with clients globally and offer both on-site and remote collaboration options.`,
    },
    {
      keywords: ['hire', 'work with', 'project', 'start', 'begin', 'get started'],
      response: `Ready to start your project? Here's how:\n\n1️⃣ Contact us via email or phone\n2️⃣ Schedule a free consultation\n3️⃣ We'll discuss your requirements\n4️⃣ Receive a custom proposal\n5️⃣ Kick off your project!\n\n📧 ${CONTACT.email}\n📱 ${CONTACT.phone}`,
    },
  ],
};

/**
 * AI Response Generator - Processes queries and generates contextual responses
 */
function generateAIResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Check for service-related queries
  for (const service of KNOWLEDGE_BASE.services) {
    const serviceKeywords = service.title.toLowerCase().split(' ');
    const descKeywords = service.description.toLowerCase().split(' ').slice(0, 5);
    
    if (serviceKeywords.some(kw => lowerQuery.includes(kw)) || 
        lowerQuery.includes(service.id.replace('-', ' '))) {
      return {
        text: `**${service.title}**\n\n${service.description}\n\nAt ${COMPANY.name}, we excel in ${service.title.toLowerCase()} with a focus on quality and innovation.\n\nWould you like to discuss your ${service.title.toLowerCase()} needs? Contact us at ${CONTACT.email}`,
        service: service,
        type: 'service',
      };
    }
  }
  
  // Check for industry-related queries
  for (const industry of KNOWLEDGE_BASE.industries) {
    if (lowerQuery.includes(industry.title.toLowerCase()) || 
        lowerQuery.includes(industry.id)) {
      return {
        text: `**${industry.title} Solutions**\n\n${industry.description}\n\nWe have extensive experience in the ${industry.title.toLowerCase()} sector, delivering tailored solutions that address industry-specific challenges.\n\nLet's discuss how ${COMPANY.name} can transform your ${industry.title.toLowerCase()} business!`,
        industry: industry,
        type: 'industry',
      };
    }
  }
  
  // Check FAQ patterns
  for (const faq of KNOWLEDGE_BASE.faqs) {
    if (faq.keywords.some(kw => lowerQuery.includes(kw))) {
      return {
        text: faq.response,
        type: 'faq',
      };
    }
  }
  
  // Service-related general queries
  if (lowerQuery.includes('service') || lowerQuery.includes('offer') || lowerQuery.includes('do you')) {
    const serviceList = KNOWLEDGE_BASE.services.map(s => `• **${s.title}**: ${s.description}`).join('\n');
    return {
      text: `At ${COMPANY.name}, we offer a comprehensive range of services:\n\n${serviceList}\n\nWhich service interests you most? I'd be happy to provide more details!`,
      type: 'services-list',
    };
  }
  
  // AI/ML specific queries
  if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence') || 
      lowerQuery.includes('machine learning') || lowerQuery.includes('ml')) {
    const aiService = KNOWLEDGE_BASE.services.find(s => s.id === 'ai-ml');
    return {
      text: `**AI & Machine Learning Solutions**\n\n${aiService.description}\n\nOur AI expertise includes:\n• Predictive Analytics\n• Natural Language Processing\n• Computer Vision\n• Custom ML Models\n• AI Integration & Automation\n\n${COMPANY.name} helps businesses leverage AI to gain competitive advantages. Ready to explore AI for your business?`,
      service: aiService,
      type: 'service',
    };
  }
  
  // Default response for unmatched queries
  return {
    text: `Thank you for your question! At ${COMPANY.name}, we're committed to helping businesses succeed with technology.\n\nHere's what we can help you with:\n• Custom Software Development\n• Web & Mobile Applications\n• AI & Machine Learning\n• Data Analytics\n• IT Consulting\n\nFor personalized assistance, reach out to us:\n📧 ${CONTACT.email}\n📱 ${CONTACT.phone}\n\nHow can I help you further?`,
    type: 'default',
  };
}

/**
 * Quick suggestion buttons for common queries
 */
const QUICK_SUGGESTIONS = [
  { text: 'What services do you offer?', icon: 'services' },
  { text: 'Tell me about AI solutions', icon: 'ai' },
  { text: 'How can I contact you?', icon: 'contact' },
  { text: 'Get a quote for my project', icon: 'quote' },
];

/**
 * Main AI Chat Component
 */
export function AIChat({ isOpen, onClose, initialQuery = '' }) {
  const { messages, addMessage, clearMessages } = useAIChat();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialQueryProcessed = useRef(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial query from search
  useEffect(() => {
    if (isOpen && initialQuery && !initialQueryProcessed.current) {
      initialQueryProcessed.current = true;
      handleSendMessage(initialQuery);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialQuery]);

  // Reset initial query flag when chat closes
  useEffect(() => {
    if (!isOpen) {
      initialQueryProcessed.current = false;
      setInputValue('');
    }
  }, [isOpen]);

  const handleSendMessage = async (text) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Generate AI response
    const response = generateAIResponse(messageText);
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      text: response.text,
      meta: response,
      timestamp: new Date().toISOString(),
    };
    
    addMessage(aiMessage);
    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleQuickSuggestion = (suggestion) => {
    handleSendMessage(suggestion.text);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        <ChatHeader onClose={onClose} onClear={clearMessages} hasMessages={messages.length > 0} />
        
        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <WelcomeMessage onSuggestionClick={handleQuickSuggestion} />
          )}
          
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        <form className="ai-chat-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about CodeXp..."
            className="ai-chat-input"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="ai-chat-send-btn"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

AIChat.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialQuery: PropTypes.string,
};

/**
 * Chat Header Component
 */
function ChatHeader({ onClose, onClear, hasMessages }) {
  return (
    <div className="ai-chat-header">
      <div className="ai-chat-header-info">
        <div className="ai-chat-avatar">
          <Bot size={24} />
        </div>
        <div>
          <h3>CodeXp AI Assistant</h3>
          <span className="ai-chat-status">
            <span className="status-dot"></span>
            Online
          </span>
        </div>
      </div>
      <div className="ai-chat-header-actions">
        {hasMessages && (
          <button 
            className="ai-chat-clear-btn" 
            onClick={onClear}
            aria-label="Clear chat history"
            title="Clear chat history"
          >
            <Trash2 size={18} />
          </button>
        )}
        <button 
          className="ai-chat-close-btn" 
          onClick={onClose}
          aria-label="Close chat"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}

ChatHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  hasMessages: PropTypes.bool,
};

/**
 * Welcome Message with Quick Suggestions
 */
function WelcomeMessage({ onSuggestionClick }) {
  return (
    <div className="ai-chat-welcome">
      <div className="ai-chat-welcome-icon">
        <Sparkles size={40} />
      </div>
      <h3>Welcome to CodeXp AI Assistant</h3>
      <p>I'm here to help you learn about our services and guide you to the right solutions for your business.</p>
      
      <div className="ai-chat-suggestions">
        <p className="suggestions-label">Quick questions:</p>
        {QUICK_SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            className="ai-suggestion-btn"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <span>{suggestion.text}</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

WelcomeMessage.propTypes = {
  onSuggestionClick: PropTypes.func.isRequired,
};

/**
 * Individual Chat Message Component
 */
function ChatMessage({ message }) {
  const isUser = message.type === 'user';
  
  return (
    <div className={`ai-chat-message ${isUser ? 'user' : 'ai'}`}>
      <div className="message-avatar">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="message-content">
        <div className="message-text">
          {formatMessageText(message.text)}
        </div>
        {!isUser && message.meta?.type === 'service' && (
          <a href="#contact" className="message-cta">
            Get Started with {message.meta.service.title}
            <ArrowRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    meta: PropTypes.object,
  }).isRequired,
};

/**
 * Typing Indicator Component
 */
function TypingIndicator() {
  return (
    <div className="ai-chat-message ai typing">
      <div className="message-avatar">
        <Bot size={18} />
      </div>
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

/**
 * Format message text with basic markdown support
 */
function formatMessageText(text) {
  // Split by newlines and process each line
  return text.split('\n').map((line, index) => {
    // Bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let formattedLine = line;
    const boldMatches = [...line.matchAll(boldRegex)];
    
    if (boldMatches.length > 0) {
      const parts = [];
      let lastIndex = 0;
      
      boldMatches.forEach((match) => {
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${index}-${match.index}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      });
      
      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }
      
      return (
        <span key={index}>
          {parts}
          <br />
        </span>
      );
    }
    
    return (
      <span key={index}>
        {formattedLine}
        <br />
      </span>
    );
  });
}

/**
 * Floating Chat Button Component
 * Shows a persistent chat icon that opens the AI assistant
 */
export function FloatingChatButton() {
  const { openChat, isOpen, hasUnreadMessages, messages } = useAIChat();
  
  // Don't show the button when chat is open
  if (isOpen) return null;
  
  return (
    <button 
      className={`floating-chat-btn ${hasUnreadMessages ? 'has-notification' : ''}`}
      onClick={() => openChat('')}
      aria-label="Open AI Chat Assistant"
      title="Chat with AI Assistant"
    >
      <div className="floating-chat-btn-inner">
        <MessageCircle size={28} />
        <span className="floating-chat-btn-pulse"></span>
      </div>
      {(hasUnreadMessages || messages.length > 0) && (
        <span className="floating-chat-badge">
          {messages.length > 0 ? Math.ceil(messages.length / 2) : '!'}
        </span>
      )}
      <span className="floating-chat-tooltip">
        {messages.length > 0 ? 'Continue conversation' : 'Ask AI Assistant'}
      </span>
    </button>
  );
}

export default AIChat;

import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Section, SectionTitle } from '../ui';
import { FAQS, COMPANY } from '../../constants';
import { useAIChat } from '../../context';

/**
 * FAQ Section - Frequently Asked Questions
 */
export function FAQSection() {
  return (
    <Section variant="default" id="faq">
      <div className="faq-section">
        <div className="faq-header">
          <SectionTitle>
            Frequently Asked Questions
          </SectionTitle>
          <p className="faq-subtitle">
            Find answers to common questions about {COMPANY.name} and our services.
            Can't find what you're looking for? Ask our AI assistant!
          </p>
        </div>
        <FAQList faqs={FAQS} />
        <AskAICard />
      </div>
    </Section>
  );
}

/**
 * List of FAQ items with accordion functionality
 */
function FAQList({ faqs }) {
  const [openId, setOpenId] = useState(null);
  const [previousId, setPreviousId] = useState(null);
  const itemRefs = useRef({});

  const toggleFAQ = useCallback((id) => {
    setPreviousId(openId);
    setOpenId(openId === id ? null : id);
  }, [openId]);

  // Auto-scroll to opened FAQ item
  useEffect(() => {
    if (openId && itemRefs.current[openId]) {
      const element = itemRefs.current[openId];
      const headerHeight = 100;
      
      setTimeout(() => {
        const elementRect = element.getBoundingClientRect();
        const isAboveViewport = elementRect.top < headerHeight;
        const isBelowViewport = elementRect.bottom > window.innerHeight;
        
        if (isAboveViewport || isBelowViewport) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  }, [openId]);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <FAQItem
          key={faq.id}
          ref={(el) => { itemRefs.current[faq.id] = el; }}
          faq={faq}
          isOpen={openId === faq.id}
          wasOpen={previousId === faq.id}
          onToggle={() => toggleFAQ(faq.id)}
          index={index}
        />
      ))}
    </div>
  );
}

FAQList.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ).isRequired,
};

/**
 * Single FAQ item with expand/collapse functionality
 */
import { forwardRef } from 'react';

const FAQItem = forwardRef(function FAQItem({ faq, isOpen, wasOpen, onToggle, index }, ref) {
  const answerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(isOpen ? answerRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const itemClasses = [
    'faq-item',
    isOpen ? 'faq-item-open' : '',
    wasOpen ? 'faq-item-closing' : '',
    isOpen ? 'faq-item-entering' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={ref}
      className={itemClasses}
      style={{ 
        animationDelay: `${index * 50}ms`,
        '--answer-height': `${height}px`
      }}
    >
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <HelpCircle size={20} className={`faq-icon ${isOpen ? 'faq-icon-active' : ''}`} />
        <span className="faq-question-text">{faq.question}</span>
        <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'faq-chevron-open' : ''}`} />
      </button>
      <div
        ref={answerRef}
        id={`faq-answer-${faq.id}`}
        className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}
        role="region"
        aria-labelledby={`faq-question-${faq.id}`}
        style={{ maxHeight: isOpen ? `${height}px` : '0' }}
      >
        <div className="faq-answer-content">
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
});

FAQItem.propTypes = {
  faq: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  wasOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.number,
};

/**
 * Card prompting users to ask AI for more help
 */
function AskAICard() {
  const { openChat } = useAIChat();

  return (
    <div className="faq-ai-card shine">
      <div className="faq-ai-card-content">
        <div className="faq-ai-icon">
          <MessageCircle size={28} />
        </div>
        <div className="faq-ai-text">
          <h3>Still have questions?</h3>
          <p>Our AI assistant can help answer any questions about our services, pricing, or how we can help your business.</p>
        </div>
        <button 
          className="faq-ai-button"
          onClick={() => openChat('')}
        >
          Ask AI Assistant
        </button>
      </div>
    </div>
  );
}

export default FAQSection;

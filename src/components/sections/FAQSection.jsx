import { useState } from 'react';
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

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="faq-list">
      {faqs.map((faq) => (
        <FAQItem
          key={faq.id}
          faq={faq}
          isOpen={openId === faq.id}
          onToggle={() => toggleFAQ(faq.id)}
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
function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <HelpCircle size={20} className="faq-icon" />
        <span>{faq.question}</span>
        <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'faq-chevron-open' : ''}`} />
      </button>
      <div
        id={`faq-answer-${faq.id}`}
        className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}
        role="region"
        aria-labelledby={`faq-question-${faq.id}`}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
}

FAQItem.propTypes = {
  faq: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
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

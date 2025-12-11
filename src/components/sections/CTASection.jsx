import { ArrowRight } from 'lucide-react';
import { Section, SectionTitle } from '../ui';
import { Icon } from '../ui/Icon';
import { CONTACT, COMPANY } from '../../constants';

/**
 * CTA section - Call to action with contact information
 */
export function CTASection() {
  return (
    <Section variant="browser" id="contact">
      <div className="browser-section-content">
        <SectionTitle>Ready to Transform Your Business?</SectionTitle>
        <BrowserMockup />
      </div>
    </Section>
  );
}

/**
 * Browser mockup with CTA button
 */
function BrowserMockup() {
  return (
    <div className="desktop-graphic">
      <div className="screen">
        <div className="screen-content">
          <BrowserBar />
          <CTAButton />
        </div>
      </div>
      <div className="base" />
    </div>
  );
}

/**
 * Browser bar with dots and address bar
 */
function BrowserBar() {
  return (
    <div className="browser-bar">
      <div className="browser-dots">
        <div className="dot red" />
        <div className="dot yellow" />
        <div className="dot green" />
      </div>
      <div className="address-bar" />
    </div>
  );
}

/**
 * CTA button inside browser mockup
 */
function CTAButton() {
  return (
    <a href={`mailto:${CONTACT.email}`} className="browser-section-cta shine">
      <div className="browser-section-cta-content">
        <img 
          src="/logo.png" 
          alt={COMPANY.name}
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
        />
        <p>Get in Touch</p>
        <span className="arrow">
          <ArrowRight size={16} />
        </span>
      </div>
    </a>
  );
}

export default CTASection;

import { Section, SectionTitle } from '../ui';
import { Icon } from '../ui/Icon';
import { INDUSTRIES } from '../../constants';

/**
 * Industries section - Display industries served
 */
export function IndustriesSection() {
  return (
    <Section variant="sticky" id="industries">
      <div className="sticky-section-content">
        <div className="split-sections">
          <IndustriesContent />
        </div>
      </div>
    </Section>
  );
}

/**
 * Industries content with title and list
 */
function IndustriesContent() {
  return (
    <div className="split-section">
      <div>
        <SectionTitle>Industries We Serve</SectionTitle>
        <p>
          From startups to enterprise organizations, we deliver tailored 
          solutions across multiple industries.
        </p>
      </div>
      <IndustryList industries={INDUSTRIES} />
    </div>
  );
}

/**
 * List of industries
 */
function IndustryList({ industries }) {
  return (
    <ul className="icon-list">
      {industries.map((industry) => (
        <li key={industry.id}>
          <Icon name={industry.icon} size={26} />
          <div>
            <strong>{industry.title}</strong>
            <span style={{ display: 'block', fontSize: '14px', color: 'var(--neutral)', marginTop: '4px' }}>
              {industry.description}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default IndustriesSection;

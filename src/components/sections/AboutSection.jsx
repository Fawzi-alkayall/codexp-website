import { Section, SectionTitle } from '../ui';
import { FeatureCard, CTACard } from '../ui/Card';
import { COMPANY, FEATURES } from '../../constants';

/**
 * About section - Company information and features
 */
export function AboutSection() {
  return (
    <Section variant="sticky" id="about">
      <div className="sticky-section-content">
        <div className="split-sections">
          <AboutContent />
        </div>
      </div>
    </Section>
  );
}

/**
 * About content with title, description, and features
 */
function AboutContent() {
  return (
    <div className="split-section">
      <div>
        <SectionTitle>
          Why Choose {COMPANY.name}?
        </SectionTitle>
        <p>
          We combine technical expertise with creative innovation to deliver 
          solutions that drive real business results. Our team of experts is 
          dedicated to your success.
        </p>
      </div>
      <FeatureList features={FEATURES} />
      <CTACard
        icon="Phone"
        title="Get in Touch"
        href="#contact"
      />
    </div>
  );
}

/**
 * List of feature cards
 */
function FeatureList({ features }) {
  return (
    <ul className="icon-grid">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </ul>
  );
}

export default AboutSection;

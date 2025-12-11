import { Section, SectionTitle } from '../ui';
import { ServiceCard } from '../ui/Card';
import { SERVICES } from '../../constants';

/**
 * Services section - Display company services
 */
export function ServicesSection() {
  return (
    <Section variant="featured" id="services">
      <SectionTitle>Our Services</SectionTitle>
      <ServiceGrid services={SERVICES} />
    </Section>
  );
}

/**
 * Grid of service cards
 */
function ServiceGrid({ services }) {
  return (
    <div className="repositories-grid">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          icon={service.icon}
          title={service.title}
          description={service.description}
        />
      ))}
    </div>
  );
}

export default ServicesSection;

import { memo } from 'react';

/**
 * Partner/Client data
 */
const PARTNERS = [
  {
    id: 'rpe',
    name: 'RPE',
    logo: 'https://portal.rpe.ae/assets/logo.a78afc12.png',
    url: 'http://rpe.ae/',
  },
  {
    id: 'sky-jordan',
    name: 'Sky Jordan For Travel Solutions',
    logo: '/partners/sky-jordan-logo.png',
    url: 'https://sky-jordan.com',
  },
  {
    id: 'ward',
    name: 'Ward Pyjama And More',
    logo: '/partners/ward-logo.png',
    url: '#',
  },
];

/**
 * Trusted By Section - Showcases partner companies and clients
 */
export const TrustedBySection = memo(function TrustedBySection() {
  return (
    <section className="trusted-section" id="partners">
      <div className="trusted-content">
        <h2 className="trusted-title">Trusted By</h2>
        <p className="trusted-subtitle">
          Proud to work with industry leaders across various sectors
        </p>
        
        <div className="partners-grid">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
});

/**
 * Individual Partner Card
 */
const PartnerCard = memo(function PartnerCard({ partner }) {
  const CardWrapper = partner.url && partner.url !== '#' ? 'a' : 'div';
  const cardProps = partner.url && partner.url !== '#' 
    ? { href: partner.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <CardWrapper 
      className="partner-card"
      {...cardProps}
      title={partner.name}
    >
      <div className="partner-logo-wrapper">
        <img 
          src={partner.logo} 
          alt={`${partner.name} logo`}
          className="partner-logo"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span class="partner-logo-fallback">${partner.name.charAt(0)}</span>`;
          }}
        />
      </div>
      <span className="partner-name">{partner.name}</span>
    </CardWrapper>
  );
});

export default TrustedBySection;

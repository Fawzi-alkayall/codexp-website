import { COMPANY, CONTACT, NAV_LINKS } from '../../constants';

/**
 * Footer component
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <FooterLogo />
        <FooterNav />
        <FooterCopyright year={currentYear} />
      </div>
    </footer>
  );
}

/**
 * Footer logo section
 */
function FooterLogo() {
  return (
    <div className="footer-logo">
      <img src="/logo.png" alt={COMPANY.name} />
      <span>{COMPANY.name}</span>
    </div>
  );
}

/**
 * Footer navigation links
 */
function FooterNav() {
  return (
    <nav className="footer-nav" style={{ display: 'flex', gap: '24px' }}>
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Footer copyright text
 */
function FooterCopyright({ year }) {
  return (
    <a href={`mailto:${CONTACT.email}`}>
      © {year} {COMPANY.fullName}
    </a>
  );
}

export default Footer;

import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * Reusable Card component with multiple variants
 * @param {string} variant - 'default' | 'service' | 'feature' | 'cta'
 */
export function Card({
  children,
  variant = 'default',
  className = '',
  href,
  ...props
}) {
  const baseStyles = 'repo-card shine';
  
  const combinedClassName = `${baseStyles} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={combinedClassName} {...props}>
        <div className="repo-content">
          {children}
        </div>
      </a>
    );
  }
  
  return (
    <div className={combinedClassName} {...props}>
      <div className="repo-content">
        {children}
      </div>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'service', 'feature', 'cta']),
  className: PropTypes.string,
  href: PropTypes.string,
};

/**
 * Service Card component
 */
export function ServiceCard({ icon, title, description }) {
  return (
    <Card>
      <div className="repo-header">
        <h3>{title}</h3>
        <div className="icon-wrapper" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
          <Icon name={icon} size={20} />
        </div>
      </div>
      <p className="repo-description">{description}</p>
    </Card>
  );
}

ServiceCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

/**
 * Feature Card component with icon
 */
export function FeatureCard({ icon, title, description }) {
  return (
    <li>
      <div className="icon-wrapper">
        <Icon name={icon} size={26} />
      </div>
      <span>{title}</span>
      <p>{description}</p>
    </li>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

/**
 * CTA Card component
 */
export function CTACard({ icon, title, href = '#contact' }) {
  return (
    <a href={href} className="cta-card shine">
      <div className="cta-content">
        <div className="cta-title">
          <Icon name={icon} size={28} />
          {title}
        </div>
      </div>
    </a>
  );
}

CTACard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
};

export default Card;

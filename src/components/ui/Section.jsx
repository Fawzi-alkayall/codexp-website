import PropTypes from 'prop-types';
import { useScrollAnimation } from '../../hooks';

/**
 * Section wrapper component for consistent styling
 * @param {string} id - Section ID for navigation
 * @param {string} variant - 'default' | 'featured' | 'split' | 'browser'
 * @param {boolean} animate - Enable scroll-triggered animation
 */
export function Section({
  children,
  id,
  variant = 'default',
  className = '',
  animate = true,
  ...props
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
  
  const variants = {
    default: '',
    featured: 'featured-section',
    split: 'split-section',
    browser: 'browser-section',
    sticky: 'sticky-section',
  };
  
  const animationClass = animate ? `animate-on-scroll ${isVisible ? 'visible' : ''}` : '';
  const combinedClassName = `${variants[variant]} ${animationClass} ${className}`.trim();
  
  return (
    <section ref={ref} id={id} className={combinedClassName} {...props}>
      {children}
    </section>
  );
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'featured', 'split', 'browser', 'sticky']),
  className: PropTypes.string,
  animate: PropTypes.bool,
};

/**
 * Section Title component
 */
export function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={className}>
      {children}
    </h2>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * Section Description component
 */
export function SectionDescription({ children, className = '' }) {
  return (
    <p className={className}>
      {children}
    </p>
  );
}

SectionDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Section;

import PropTypes from 'prop-types';
import { ArrowRight } from 'lucide-react';

/**
 * Reusable Button component with multiple variants
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'cta'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} withArrow - Show arrow icon
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  href,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-full';
  
  const variants = {
    primary: 'bg-accent text-white hover:opacity-90',
    secondary: 'bg-accent-surface text-on-surface hover:bg-accent/20',
    ghost: 'bg-transparent text-on-surface hover:bg-accent-surface',
    cta: 'cta-card',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const content = (
    <>
      {children}
      {withArrow && <ArrowRight size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
    </>
  );
  
  if (href) {
    return (
      <a href={href} className={combinedClassName} {...props}>
        {content}
      </a>
    );
  }
  
  return (
    <button className={combinedClassName} {...props}>
      {content}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'cta']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  withArrow: PropTypes.bool,
  href: PropTypes.string,
  className: PropTypes.string,
};

export default Button;

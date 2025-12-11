import PropTypes from 'prop-types';
import {
  Code2,
  Globe,
  BarChart3,
  Users,
  GraduationCap,
  Brain,
  Phone,
  Mail,
  MapPin,
  Building2,
  Sparkles,
  Star,
  Search,
  ArrowRight,
} from 'lucide-react';

// Map of icon names to components
const iconMap = {
  Code2,
  Globe,
  BarChart3,
  Users,
  GraduationCap,
  Brain,
  Phone,
  Mail,
  MapPin,
  Building2,
  Sparkles,
  Star,
  Search,
  ArrowRight,
};

/**
 * Icon component that renders Lucide icons
 * @param {string} name - Name of the icon
 * @param {number} size - Size of the icon
 * @param {string} className - Additional CSS classes
 */
export function Icon({ name, size = 24, className = '', ...props }) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconMap).join(', ')}`);
    return null;
  }
  
  return <IconComponent size={size} className={className} {...props} />;
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Icon;

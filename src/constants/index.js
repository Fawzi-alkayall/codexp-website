// Company Information
export const COMPANY = {
  name: 'CodeXp',
  fullName: 'First Creators for Technology L.L.C',
  tagline: 'Code Experts',
  description: 'Transforming ideas into powerful digital solutions. We build innovative software that drives business growth.',
  founded: 2020,
};

// Contact Information
export const CONTACT = {
  email: 'developer@codexp.co',
  phone: '+962 7 9900 6608',
  address: 'P.O. Box 799006608, Amman 11954, Jordan',
  website: 'codexp.co',
};

// Social Media Links
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/codexp',
  twitter: 'https://twitter.com/codexp',
  github: 'https://github.com/codexp',
};

// Navigation Links
export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Contact', href: '#contact' },
];

// Services Data
export const SERVICES = [
  {
    id: 'web-development',
    icon: 'Code2',
    title: 'Web Development',
    description: 'Custom web applications built with modern frameworks and best practices for optimal performance.',
  },
  {
    id: 'mobile-apps',
    icon: 'Globe',
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps that deliver exceptional user experiences.',
  },
  {
    id: 'data-analytics',
    icon: 'BarChart3',
    title: 'Data Analytics',
    description: 'Transform your data into actionable insights with advanced analytics solutions.',
  },
  {
    id: 'consulting',
    icon: 'Users',
    title: 'IT Consulting',
    description: 'Strategic technology consulting to help you make informed decisions and optimize operations.',
  },
  {
    id: 'training',
    icon: 'GraduationCap',
    title: 'Training & Development',
    description: 'Comprehensive training programs to upskill your team in the latest technologies.',
  },
  {
    id: 'ai-ml',
    icon: 'Brain',
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by cutting-edge artificial intelligence and machine learning.',
  },
];

// Industries Data
export const INDUSTRIES = [
  {
    id: 'healthcare',
    icon: 'Building2',
    title: 'Healthcare',
    description: 'Digital health solutions for better patient outcomes.',
  },
  {
    id: 'finance',
    icon: 'BarChart3',
    title: 'Finance',
    description: 'Secure fintech solutions for modern banking.',
  },
  {
    id: 'education',
    icon: 'GraduationCap',
    title: 'Education',
    description: 'EdTech platforms for enhanced learning.',
  },
  {
    id: 'retail',
    icon: 'Globe',
    title: 'Retail',
    description: 'E-commerce and retail technology solutions.',
  },
];

// Features for About Section
export const FEATURES = [
  {
    id: 'innovation',
    icon: 'Sparkles',
    title: 'Innovation First',
    description: 'We stay ahead of technology trends to deliver cutting-edge solutions.',
  },
  {
    id: 'quality',
    icon: 'Star',
    title: 'Quality Assured',
    description: 'Rigorous testing and best practices ensure reliable, high-quality deliverables.',
  },
  {
    id: 'support',
    icon: 'Users',
    title: 'Dedicated Support',
    description: '24/7 support and maintenance to keep your systems running smoothly.',
  },
];

// Theme Configuration
export const THEME = {
  colors: {
    primary: '#007af4',
    primaryLight: '#00c6ff',
    surface: '#000000',
    onSurface: '#ffffff',
    neutral: '#818181',
    accentSurface: '#253145',
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
};

// Animation Variants (for future use with Framer Motion)
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

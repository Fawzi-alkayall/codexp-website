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
  { label: 'Partners', href: '#partners' },
  { label: 'FAQ', href: '#faq' },
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

// FAQ Data
export const FAQS = [
  {
    id: 'what-services',
    question: 'What services does CodeXp offer?',
    answer: 'CodeXp offers a comprehensive range of software development services including web development, mobile applications, AI & machine learning solutions, data analytics, IT consulting, and training programs. We specialize in building custom solutions tailored to your business needs.',
  },
  {
    id: 'technologies',
    question: 'What technologies do you work with?',
    answer: 'We work with modern technologies including React, Flutter, Node.js, Python, cloud platforms (AWS, Google Cloud, Azure), and AI/ML frameworks. We choose the best technology stack based on your project requirements and business goals.',
  },
  {
    id: 'project-timeline',
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while a complex enterprise application could take 3-6 months. We provide detailed timelines during our initial consultation after understanding your requirements.',
  },
  {
    id: 'pricing',
    question: 'How do you price your services?',
    answer: 'We offer flexible pricing models including fixed-price projects, hourly rates, and retainer agreements. After an initial consultation to understand your needs, we provide a detailed proposal with transparent pricing. Contact us for a free quote.',
  },
  {
    id: 'support',
    question: 'Do you provide ongoing support and maintenance?',
    answer: 'Yes! We offer comprehensive support and maintenance packages to ensure your applications run smoothly. This includes bug fixes, security updates, performance optimization, and feature enhancements. Our support team is available 24/7.',
  },
  {
    id: 'location',
    question: 'Where is CodeXp located?',
    answer: 'CodeXp (First Creators for Technology L.L.C) is headquartered in Amman, Jordan. However, we work with clients globally and have experience delivering projects for businesses across the Middle East, Europe, and North America.',
  },
  {
    id: 'start-project',
    question: 'How do I start a project with CodeXp?',
    answer: 'Getting started is easy! Simply contact us via email at developer@codexp.co or call us at +962 7 9900 6608. We\'ll schedule a free consultation to discuss your project, understand your requirements, and provide a tailored solution.',
  },
  {
    id: 'communication',
    question: 'How do you handle project communication?',
    answer: 'We believe in transparent and regular communication. You\'ll have a dedicated project manager, access to project tracking tools, regular progress updates, and direct communication channels with our development team. We use tools like Slack, Jira, and regular video calls.',
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

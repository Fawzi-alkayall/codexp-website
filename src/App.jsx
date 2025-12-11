import { useState } from 'react';
import { 
  Moon,
  Sun,
  Code2,
  Globe,
  BarChart3,
  Users,
  GraduationCap,
  Smartphone,
  ShoppingCart,
  Briefcase,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Heart,
  Building2,
  Shield,
  Plane,
  CheckCircle2,
  Brain
} from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`app ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <AppBar isDark={isDark} setIsDark={setIsDark} />
      <main className="app-main">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <IndustriesSection />
        <CTASection />
      </main>
      <AppFooter />
    </div>
  );
}

// App Bar / Header
function AppBar({ isDark, setIsDark }) {
  return (
    <header className="app-bar">
      <div className="header-content">
        <a href="/" className="app-title">
          <img src="/logo.png" alt="CodeXp logo" className="logo" />
          <span className="logo-text">CodeXp</span>
        </a>

        <nav className="header-nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#industries">Industries</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="actions">
          <button
            className="theme-button"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="progressive-blur">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="blur-filter" />
        ))}
        <div className="gradient" />
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="hero-section">
      <h1>CodeXp</h1>
      <p>
        Transforming Ideas into Digital Reality
      </p>
      <p className="hero-subtitle">
        Software Development & IT Solutions Specialist in Jordan
      </p>

      <a href="#contact" className="cta-button shine">
        <span>Partner with Experts</span>
        <ArrowUpRight size={20} />
      </a>

      <div className="hero-background">
        <div className="hero-glow" />
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <div className="about-badge shine">
          <span>Est. 2025</span>
        </div>
        <h2>About CodeXp</h2>
        <p className="about-tagline">Code Experts — Where Technical Innovation Meets Practical Expertise</p>
        <div className="about-text">
          <p>
            CodeXp, legally registered as <strong>First Creators for Technology L.L.C</strong> (شركة المبدعون الأوائل للتكنولوجيا), 
            is a Jordanian Limited Liability Company established in 2025 and headquartered in Amman. 
            Our mission is to drive digital transformation across the region through expert software development, 
            professional system installation, and specialized IT training programs.
          </p>
          <p>
            We combine cutting-edge technology with deep industry knowledge to deliver solutions that 
            empower businesses to thrive in the digital age. From custom software to enterprise portals, 
            our team of dedicated professionals is committed to excellence in every project we undertake.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-number">6+</span>
            <span className="stat-label">Core Services</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Industries Served</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Commitment</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    {
      icon: <Code2 size={28} />,
      title: 'Software & Application Development',
      description: 'Custom software design, web development, and mobile application development for iOS and Android. We build scalable, secure, and user-friendly solutions tailored to your business needs.'
    },
    {
      icon: <Brain size={28} />,
      title: 'AI & Machine Learning Solutions',
      description: 'Harness the power of artificial intelligence to automate processes, gain predictive insights, and create intelligent applications. From chatbots to computer vision, we bring AI innovation to your business.'
    },
    {
      icon: <Globe size={28} />,
      title: 'Web Portals & E-Commerce',
      description: 'Developing robust web portals and e-commerce platforms that drive engagement and sales. From B2B portals to online stores, we create digital experiences that convert.'
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Business Intelligence (BI)',
      description: 'Transform your data into actionable insights with our BI solutions. We help you make data-driven decisions through advanced analytics, dashboards, and reporting tools.'
    },
    {
      icon: <Users size={28} />,
      title: 'Consulting & Outsourcing',
      description: 'Strategic IT consulting, Business Process Outsourcing (BPO), and IT outsourcing services. We provide expert guidance and reliable resources to optimize your operations.'
    },
    {
      icon: <GraduationCap size={28} />,
      title: 'Professional Training',
      description: 'Specialized training programs on computer usage, software applications, and technical skills. Empower your team with the knowledge they need to excel in the digital workplace.'
    }
  ];

  return (
    <section className="featured-section" id="services">
      <h2>Our Services</h2>
      <p className="section-subtitle">Comprehensive IT solutions to power your digital transformation</p>
      <div className="repositories-grid">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="repo-card shine">
      <div className="repo-content">
        <div className="service-icon">
          {icon}
        </div>
        <h3>{title}</h3>
        <p className="repo-description">{description}</p>
      </div>
    </div>
  );
}

// Industries Section
function IndustriesSection() {
  const industries = [
    { icon: <Heart size={24} />, name: 'Healthcare', description: 'Digital health solutions and medical systems' },
    { icon: <Building2 size={24} />, name: 'Government & Public Sector', description: 'E-government and public service platforms' },
    { icon: <Shield size={24} />, name: 'Insurance', description: 'Insurance management and claims systems' },
    { icon: <Briefcase size={24} />, name: 'Management', description: 'Enterprise solutions and ERP systems' },
    { icon: <Plane size={24} />, name: 'Travel & Tourism', description: 'Booking systems and travel platforms' }
  ];

  return (
    <section className="sticky-section" id="industries">
      <div className="sticky-section-content">
        <div className="split-sections">
          <div className="split-section">
            <div>
              <h2>Industries We Serve</h2>
              <p>
                We deliver specialized solutions across multiple sectors, understanding the unique 
                challenges and requirements of each industry we serve.
              </p>

              <ul className="icon-grid">
                {industries.map((industry, index) => (
                  <li key={index}>
                    <div className="icon-wrapper">
                      {industry.icon}
                    </div>
                    <span>{industry.name}</span>
                    <p>{industry.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="split-section">
            <div>
              <h2>Why Choose CodeXp?</h2>
              <p>
                Partner with a team that combines technical excellence with a deep understanding 
                of your business goals.
              </p>

              <ul className="icon-list">
                <li><CheckCircle2 size={24} /> Expert team with diverse technical skills</li>
                <li><CheckCircle2 size={24} /> Tailored solutions for your specific needs</li>
                <li><CheckCircle2 size={24} /> Commitment to quality and timely delivery</li>
                <li><CheckCircle2 size={24} /> Ongoing support and maintenance</li>
                <li><CheckCircle2 size={24} /> Competitive pricing with transparent processes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="browser-section" id="contact">
      <div className="browser-section-content">
        <h2>Ready to Transform Your Business?</h2>
        <p className="cta-description">
          Let's discuss how CodeXp can help you achieve your digital goals.
        </p>

        <div className="contact-cards">
          <div className="contact-card shine">
            <div className="contact-card-content">
              <Phone size={24} />
              <h3>Call Us</h3>
              <a href="tel:+962799006608">+962 7 9900 6608</a>
            </div>
          </div>
          <div className="contact-card shine">
            <div className="contact-card-content">
              <Mail size={24} />
              <h3>Email Us</h3>
              <a href="mailto:developer@codexp.co">developer@codexp.co</a>
            </div>
          </div>
          <div className="contact-card shine">
            <div className="contact-card-content">
              <MapPin size={24} />
              <h3>Visit Us</h3>
              <p>Amman, Jordan</p>
            </div>
          </div>
        </div>

        <a href="mailto:developer@codexp.co" className="browser-section-cta">
          <div className="browser-section-cta-content">
            <img src="/logo.png" alt="CodeXp" className="cta-logo" />
            <p>Get in Touch</p>
            <span className="arrow">
              <ArrowUpRight size={20} />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}

// Footer
function AppFooter() {
  return (
    <footer className="app-footer" id="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.png" alt="CodeXp" />
            <span>CodeXp</span>
          </div>
          <p className="footer-tagline">Software Development & IT Solutions Specialist</p>
          <p className="footer-legal">First Creators for Technology L.L.C</p>
          <p className="footer-legal-ar">شركة المبدعون الأوائل للتكنولوجيا</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Services</h4>
            <a href="#services">Software Development</a>
            <a href="#services">AI & Machine Learning</a>
            <a href="#services">Web Portals</a>
            <a href="#services">Business Intelligence</a>
            <a href="#services">Consulting</a>
            <a href="#services">Training</a>
          </div>
          <div className="footer-column">
            <h4>Industries</h4>
            <a href="#industries">Healthcare</a>
            <a href="#industries">Government</a>
            <a href="#industries">Insurance</a>
            <a href="#industries">Management</a>
            <a href="#industries">Travel & Tourism</a>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <a href="tel:+962799006608">+962 7 9900 6608</a>
            <a href="mailto:developer@codexp.co">developer@codexp.co</a>
            <a href="https://codexp.co" target="_blank" rel="noopener noreferrer">codexp.co</a>
            <p className="footer-address">P.O. Box 799006608<br/>Amman 11954, Jordan</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 CodeXp. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

// CodeXp Star SVG Component
function CodeXpStar() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 16.032C27.8484 16.2868 23.9332 18.0509 20.9921 20.9921C18.0509 23.9332 16.2868 27.8484 16.032 32H15.968C15.7136 27.8482 13.9497 23.9328 11.0084 20.9916C8.06716 18.0504 4.15176 16.2864 0 16.032V15.968C4.15176 15.7136 8.06716 13.9497 11.0084 11.0084C13.9497 8.06716 15.7136 4.15176 15.968 0H16.032C16.2868 4.15162 18.0509 8.06677 20.9921 11.0079C23.9332 13.9491 27.8484 15.7132 32 15.968V16.032Z"
        fill="url(#codexp-gradient)"
      />
      <defs>
        <radialGradient
          id="codexp-gradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(3.176 13.006) rotate(18.6832) scale(34.06 272.842)"
        >
          <stop offset="0.067" stopColor="#007af4" />
          <stop offset="0.343" stopColor="#44a2ff" />
          <stop offset="0.672" stopColor="#8ab4f8" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default App;

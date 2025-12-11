import { 
  Search, 
  ArrowRight,
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
  Star
} from 'lucide-react';

function App() {
  return (
    <div className="app">
      <AppBar />
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

function AppBar() {
  return (
    <header className="app-bar">
      <div className="header-content">
        <a href="/" className="app-title">
          <img src="/logo.png" alt="CodeXp" className="logo" />
          <span style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginLeft: '12px',
            background: 'linear-gradient(135deg, #007af4, #00c6ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>CodeXp</span>
        </a>
        
        <div className="header-search shine">
          <input 
            type="text" 
            className="header-search-input" 
            placeholder="Search services..."
          />
          <button className="header-search-button">
            <Search size={20} />
          </button>
        </div>
      </div>
      <div className="progressive-blur">
        <div className="gradient"></div>
        <div className="blur-filter"></div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <h1>CodeXp</h1>
      <p>
        First Creators for Technology L.L.C — Empowering businesses with innovative 
        software solutions, digital transformation, and cutting-edge technology services.
      </p>
      <div className="search-container shine">
        <input 
          type="text" 
          className="search-input" 
          placeholder="How can we help your business?"
        />
        <button className="search-button">
          <Search size={24} />
        </button>
      </div>
      <div className="hero-background">
        <div className="hero-glow"></div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="featured-section">
      <h2>About CodeXp</h2>
      <div className="repositories-grid">
        <div className="repo-card shine">
          <div className="repo-content">
            <div className="repo-header">
              <h3>Our Mission</h3>
              <Building2 size={24} />
            </div>
            <p className="repo-description">
              To deliver exceptional technology solutions that drive business growth 
              and digital innovation for our clients across the globe.
            </p>
            <div className="star-count">
              <Star size={16} />
              <span>Excellence in Every Line of Code</span>
            </div>
          </div>
        </div>

        <div className="repo-card shine">
          <div className="repo-content">
            <div className="repo-header">
              <h3>Our Vision</h3>
              <Sparkles size={24} />
            </div>
            <p className="repo-description">
              To be the leading technology partner for businesses seeking digital 
              transformation and innovative software solutions in the MENA region.
            </p>
            <div className="star-count">
              <Star size={16} />
              <span>Pioneering Digital Excellence</span>
            </div>
          </div>
        </div>

        <div className="repo-card shine">
          <div className="repo-content">
            <div className="repo-header">
              <h3>Our Values</h3>
              <Users size={24} />
            </div>
            <p className="repo-description">
              Innovation, integrity, and client success drive everything we do. 
              We believe in building lasting partnerships through trust and excellence.
            </p>
            <div className="star-count">
              <Star size={16} />
              <span>Client-Centric Approach</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="sticky-section">
      <div className="sticky-section-content">
        <div className="split-sections">
          <div className="split-section">
            <div>
              <h2>
                Our Services
                <span className="tag shine">
                  <span className="tag-content">Expert Solutions</span>
                </span>
              </h2>
              <p>
                We offer comprehensive technology services tailored to meet your 
                business needs. From custom software development to digital transformation, 
                our team of experts is here to help you succeed.
              </p>
              
              <ul className="icon-grid">
                <li>
                  <div className="icon-wrapper">
                    <Code2 size={28} />
                  </div>
                  <span>Custom Software Development</span>
                  <p>Tailored solutions built with cutting-edge technologies to meet your unique requirements.</p>
                </li>
                <li>
                  <div className="icon-wrapper">
                    <Globe size={28} />
                  </div>
                  <span>Web & Mobile Applications</span>
                  <p>Responsive, scalable applications that deliver exceptional user experiences.</p>
                </li>
                <li>
                  <div className="icon-wrapper">
                    <BarChart3 size={28} />
                  </div>
                  <span>Business Intelligence</span>
                  <p>Data-driven insights and analytics to power your business decisions.</p>
                </li>
                <li>
                  <div className="icon-wrapper">
                    <Users size={28} />
                  </div>
                  <span>IT Consulting</span>
                  <p>Strategic technology guidance to optimize your operations and growth.</p>
                </li>
                <li>
                  <div className="icon-wrapper">
                    <GraduationCap size={28} />
                  </div>
                  <span>Training & Support</span>
                  <p>Comprehensive training programs and ongoing technical support.</p>
                </li>
                <li>
                  <div className="icon-wrapper">
                    <Brain size={28} />
                  </div>
                  <span>AI & Machine Learning</span>
                  <p>Intelligent solutions powered by artificial intelligence and machine learning technologies.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="sticky-section">
      <div className="sticky-section-content">
        <div className="split-sections">
          <div className="split-section">
            <div>
              <h2>Industries We Serve</h2>
              <p>
                Our expertise spans across multiple industries, delivering specialized 
                solutions that address sector-specific challenges and opportunities.
              </p>
              
              <div className="media-card shine">
                <div className="media-card-content">
                  <div className="media-card-icon">
                    <Building2 size={28} />
                  </div>
                  <span className="media-card-title">Enterprise Solutions</span>
                  <p className="media-card-description">
                    Scalable enterprise software for large organizations, including ERP systems, 
                    workflow automation, and digital transformation initiatives.
                  </p>
                </div>
              </div>

              <ul className="icon-list">
                <li>
                  <BarChart3 size={24} />
                  Financial Services & Banking
                </li>
                <li>
                  <Users size={24} />
                  Healthcare & Life Sciences
                </li>
                <li>
                  <Globe size={24} />
                  E-Commerce & Retail
                </li>
                <li>
                  <GraduationCap size={24} />
                  Education & E-Learning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="browser-section">
      <div className="browser-section-content">
        <h2>Ready to Transform Your Business?</h2>
        
        <div className="desktop-graphic">
          <div className="screen">
            <div className="screen-content">
              <div className="browser-bar">
                <div className="browser-dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div className="address-bar"></div>
              </div>
            </div>
          </div>
          
          <a href="mailto:developer@codexp.co" className="browser-section-cta">
            <div className="browser-section-cta-content">
              <img src="/logo.png" alt="CodeXp" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              <p>Get in Touch</p>
              <span className="arrow">
                <ArrowRight size={18} />
              </span>
            </div>
          </a>
          
          <div className="base"></div>
        </div>
      </div>
    </section>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/logo.png" alt="CodeXp" />
          <span>CodeXp</span>
        </div>
        
        <a href="tel:+962799006608" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone size={16} />
          +962 7 9900 6608
        </a>
        
        <a href="mailto:developer@codexp.co" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={16} />
          developer@codexp.co
        </a>
        
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} />
          Amman, Jordan
        </a>
        
        <a href="https://codexp.co" target="_blank" rel="noopener noreferrer">
          codexp.co
        </a>
      </div>
    </footer>
  );
}

export default App;

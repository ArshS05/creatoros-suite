// Advanced Website HTML Generator with animations and modern design

interface WebsiteData {
  name: string;
  headline?: string;
  subheadline?: string;
  bio: string;
  about?: {
    title?: string;
    content?: string;
    highlights?: string[];
  };
  links: { title: string; url: string; icon?: string; isPrimary?: boolean }[];
  services?: { 
    name: string; 
    price: string; 
    description: string; 
    features?: string[];
    popular?: boolean;
  }[];
  testimonials?: {
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }[];
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
  contactIntro?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  theme: string;
  includeSections?: {
    hero?: boolean;
    about?: boolean;
    features?: boolean;
    services?: boolean;
    testimonials?: boolean;
    contact?: boolean;
    links?: boolean;
  };
}

const defaultColors = {
  dark: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    muted: '#94a3b8'
  },
  light: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#0891b2',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b'
  },
  gradient: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255,255,255,0.1)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.7)'
  },
  neon: {
    primary: '#00ff88',
    secondary: '#00d4ff',
    accent: '#ff00ff',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    muted: '#888888'
  },
  minimal: {
    primary: '#000000',
    secondary: '#333333',
    accent: '#666666',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    muted: '#666666'
  },
  warm: {
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fbbf24',
    background: '#fffbeb',
    surface: '#ffffff',
    text: '#1c1917',
    muted: '#78716c'
  }
};

export function generateAdvancedWebsiteHTML(website: WebsiteData): string {
  const themeKey = website.theme as keyof typeof defaultColors;
  const colors = website.colorScheme || defaultColors[themeKey] || defaultColors.dark;
  const isGradientBg = website.theme === 'gradient';
  const bgValue = isGradientBg ? colors.background : colors.background;
  const sections = website.includeSections || {
    hero: true,
    about: true,
    features: true,
    services: true,
    testimonials: true,
    contact: true,
    links: true
  };

  const heroSection = sections.hero !== false ? `
    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <div class="hero-avatar" data-aos="zoom-in">
          ${website.name.charAt(0).toUpperCase()}
        </div>
        <h1 class="hero-title" data-aos="fade-up" data-aos-delay="100">
          ${website.name}
        </h1>
        ${website.headline ? `<p class="hero-headline" data-aos="fade-up" data-aos-delay="200">${website.headline}</p>` : ''}
        ${website.subheadline ? `<p class="hero-subheadline" data-aos="fade-up" data-aos-delay="300">${website.subheadline}</p>` : ''}
        <p class="hero-bio" data-aos="fade-up" data-aos-delay="400">${website.bio}</p>
        <div class="hero-cta" data-aos="fade-up" data-aos-delay="500">
          <a href="#contact" class="btn btn-primary">Get In Touch</a>
          <a href="#about" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-arrow"></div>
      </div>
    </section>` : '';

  const linksSection = sections.links !== false && website.links?.length > 0 ? `
    <!-- Links Section -->
    <section class="links-section" id="links">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Quick Links</h2>
        <div class="links-grid">
          ${website.links.map((link, i) => `
          <a href="${link.url}" class="link-card ${link.isPrimary ? 'primary' : ''}" target="_blank" data-aos="fade-up" data-aos-delay="${i * 100}">
            <span class="link-icon">${getLinkIcon(link.icon || 'link')}</span>
            <span class="link-text">${link.title}</span>
            <span class="link-arrow">→</span>
          </a>`).join('')}
        </div>
      </div>
    </section>` : '';

  const aboutSection = sections.about !== false && website.about ? `
    <!-- About Section -->
    <section class="about-section" id="about">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">${website.about.title || 'About Me'}</h2>
        <div class="about-content" data-aos="fade-up" data-aos-delay="100">
          <div class="about-text">
            ${website.about.content || website.bio}
          </div>
          ${website.about.highlights ? `
          <div class="about-highlights">
            ${website.about.highlights.map((h, i) => `
            <div class="highlight-item" data-aos="fade-left" data-aos-delay="${i * 100}">
              <span class="highlight-icon">✓</span>
              <span>${h}</span>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>
    </section>` : '';

  const featuresSection = sections.features !== false && website.features?.length ? `
    <!-- Features Section -->
    <section class="features-section" id="features">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Why Work With Me</h2>
        <div class="features-grid">
          ${website.features.map((f, i) => `
          <div class="feature-card" data-aos="fade-up" data-aos-delay="${i * 100}">
            <div class="feature-icon">${getFeatureIcon(f.icon)}</div>
            <h3 class="feature-title">${f.title}</h3>
            <p class="feature-desc">${f.description}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>` : '';

  const servicesSection = sections.services !== false && website.services?.length ? `
    <!-- Services Section -->
    <section class="services-section" id="services">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Services</h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">Choose the perfect package for your needs</p>
        <div class="services-grid">
          ${website.services.map((s, i) => `
          <div class="service-card ${s.popular ? 'popular' : ''}" data-aos="fade-up" data-aos-delay="${i * 150}">
            ${s.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
            <h3 class="service-name">${s.name}</h3>
            <div class="service-price">${s.price}</div>
            <p class="service-desc">${s.description}</p>
            ${s.features ? `
            <ul class="service-features">
              ${s.features.map(f => `<li><span class="check">✓</span> ${f}</li>`).join('')}
            </ul>` : ''}
            <a href="#contact" class="btn ${s.popular ? 'btn-primary' : 'btn-secondary'}">Get Started</a>
          </div>`).join('')}
        </div>
      </div>
    </section>` : '';

  const testimonialsSection = sections.testimonials !== false && website.testimonials?.length ? `
    <!-- Testimonials Section -->
    <section class="testimonials-section" id="testimonials">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">What Clients Say</h2>
        <div class="testimonials-grid">
          ${website.testimonials.map((t, i) => `
          <div class="testimonial-card" data-aos="fade-up" data-aos-delay="${i * 150}">
            <div class="testimonial-content">
              <div class="quote-icon">"</div>
              <p class="testimonial-text">${t.content}</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">${t.avatar || t.name.charAt(0)}</div>
              <div class="author-info">
                <div class="author-name">${t.name}</div>
                <div class="author-role">${t.role}</div>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>` : '';

  const contactSection = sections.contact !== false ? `
    <!-- Contact Section -->
    <section class="contact-section" id="contact">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Let's Connect</h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          ${website.contactIntro || 'Ready to start your project? Get in touch and let\'s make something amazing together.'}
        </p>
        <form class="contact-form" data-aos="fade-up" data-aos-delay="200">
          <div class="form-group">
            <input type="text" name="name" placeholder="Your Name" required>
          </div>
          <div class="form-group">
            <input type="email" name="email" placeholder="Your Email" required>
          </div>
          <div class="form-group">
            <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Send Message</button>
        </form>
        ${website.socialLinks ? `
        <div class="social-links" data-aos="fade-up" data-aos-delay="300">
          ${website.socialLinks.instagram ? `<a href="${website.socialLinks.instagram}" target="_blank" class="social-link">📷</a>` : ''}
          ${website.socialLinks.youtube ? `<a href="${website.socialLinks.youtube}" target="_blank" class="social-link">▶️</a>` : ''}
          ${website.socialLinks.tiktok ? `<a href="${website.socialLinks.tiktok}" target="_blank" class="social-link">🎵</a>` : ''}
          ${website.socialLinks.twitter ? `<a href="${website.socialLinks.twitter}" target="_blank" class="social-link">𝕏</a>` : ''}
        </div>` : ''}
      </div>
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.name} - ${website.headline || 'Personal Website'}</title>
  <meta name="description" content="${website.bio}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <style>
    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --background: ${isGradientBg ? '#0f172a' : colors.background};
      --surface: ${colors.surface};
      --text: ${colors.text};
      --muted: ${colors.muted};
      --radius: 16px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${bgValue};
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 80px 0;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at top, var(--primary)15, transparent 50%),
                  radial-gradient(ellipse at bottom right, var(--secondary)10, transparent 50%);
      pointer-events: none;
    }

    .hero-content {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .hero-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin: 0 auto 2rem;
      box-shadow: 0 20px 60px -15px var(--primary);
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--text), var(--muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-headline {
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .hero-subheadline {
      font-size: 1.125rem;
      color: var(--muted);
      margin-bottom: 1rem;
    }

    .hero-bio {
      font-size: 1.125rem;
      color: var(--muted);
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      animation: bounce 2s infinite;
    }

    .scroll-arrow {
      width: 24px;
      height: 24px;
      border-right: 2px solid var(--muted);
      border-bottom: 2px solid var(--muted);
      transform: rotate(45deg);
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 32px;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition);
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      box-shadow: 0 10px 30px -10px var(--primary);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px -15px var(--primary);
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .btn-secondary:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-3px);
    }

    .btn-full { width: 100%; }

    /* Section Styles */
    section { padding: 100px 0; }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      text-align: center;
      color: var(--muted);
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto 3rem;
    }

    /* Links Section */
    .links-section { background: var(--surface); }

    .links-grid {
      display: grid;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .link-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: var(--background);
      border-radius: var(--radius);
      text-decoration: none;
      color: var(--text);
      transition: var(--transition);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .link-card:hover {
      transform: translateX(8px);
      border-color: var(--primary);
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
    }

    .link-card.primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
    }

    .link-icon { font-size: 1.5rem; }
    .link-text { flex: 1; font-weight: 500; }
    .link-arrow { opacity: 0; transition: var(--transition); }
    .link-card:hover .link-arrow { opacity: 1; }

    /* About Section */
    .about-content {
      display: grid;
      gap: 3rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .about-text {
      font-size: 1.125rem;
      color: var(--muted);
      line-height: 1.8;
    }

    .about-highlights {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--surface);
      border-radius: var(--radius);
    }

    .highlight-icon {
      color: var(--primary);
      font-weight: bold;
    }

    /* Features Section */
    .features-section { background: var(--surface); }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: var(--background);
      border-radius: var(--radius);
      transition: var(--transition);
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -20px rgba(0,0,0,0.3);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .feature-desc {
      color: var(--muted);
      font-size: 0.95rem;
    }

    /* Services Section */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .service-card {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 2.5rem;
      position: relative;
      transition: var(--transition);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .service-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
    }

    .service-card.popular {
      border-color: var(--primary);
      box-shadow: 0 20px 60px -20px var(--primary);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .service-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .service-price {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    .service-desc {
      color: var(--muted);
      margin-bottom: 1.5rem;
    }

    .service-features {
      list-style: none;
      margin-bottom: 2rem;
    }

    .service-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
      color: var(--text);
    }

    .service-features .check {
      color: var(--primary);
      font-weight: bold;
    }

    /* Testimonials Section */
    .testimonials-section { background: var(--surface); }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      background: var(--background);
      border-radius: var(--radius);
      padding: 2rem;
      transition: var(--transition);
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
    }

    .quote-icon {
      font-size: 4rem;
      color: var(--primary);
      opacity: 0.3;
      line-height: 1;
      margin-bottom: -1rem;
    }

    .testimonial-text {
      font-size: 1.05rem;
      color: var(--text);
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: white;
    }

    .author-name {
      font-weight: 600;
    }

    .author-role {
      font-size: 0.875rem;
      color: var(--muted);
    }

    /* Contact Section */
    .contact-form {
      max-width: 500px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 1rem;
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius);
      color: var(--text);
      font-family: inherit;
      font-size: 1rem;
      transition: var(--transition);
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: var(--muted);
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .social-link {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      border-radius: 50%;
      font-size: 1.25rem;
      text-decoration: none;
      transition: var(--transition);
    }

    .social-link:hover {
      background: var(--primary);
      transform: translateY(-3px);
    }

    /* Footer */
    footer {
      text-align: center;
      padding: 3rem 0;
      color: var(--muted);
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      section { padding: 60px 0; }
      .hero { padding: 40px 0; }
      .hero-avatar { width: 100px; height: 100px; font-size: 2.5rem; }
      .hero-cta { flex-direction: column; }
      .btn { width: 100%; }
      .services-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  ${heroSection}
  ${linksSection}
  ${aboutSection}
  ${featuresSection}
  ${servicesSection}
  ${testimonialsSection}
  ${contactSection}

  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} ${website.name}. All rights reserved.</p>
      <p style="margin-top: 0.5rem; opacity: 0.6;">Made with CreatorOS</p>
    </div>
  </footer>

  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script>
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });

    // Form submission
    document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! I\\'ll get back to you soon.');
      this.reset();
    });
  </script>
</body>
</html>`;
}

function getLinkIcon(icon: string): string {
  const icons: Record<string, string> = {
    'youtube': '▶️',
    'instagram': '📷',
    'tiktok': '🎵',
    'twitter': '𝕏',
    'podcast': '🎙️',
    'headphones': '🎧',
    'gift': '🎁',
    'calendar': '📅',
    'arrow-right': '→',
    'link': '🔗',
    'email': '✉️',
    'shop': '🛒',
  };
  return icons[icon] || '🔗';
}

function getFeatureIcon(icon: string): string {
  const icons: Record<string, string> = {
    'zap': '⚡',
    'shield': '🛡️',
    'heart': '❤️',
    'trending-up': '📈',
    'star': '⭐',
    'clock': '⏰',
    'users': '👥',
    'check': '✅',
  };
  return icons[icon] || '✨';
}

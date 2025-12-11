import { useEffect, useRef, useMemo } from 'react';

/**
 * AnimatedBackground Component
 * Creates an immersive, code/AI themed animated background
 * Features floating code symbols, neural network particles, and gradient effects
 */
export function AnimatedBackground() {
  const canvasRef = useRef(null);
  
  // Code symbols and AI-related characters
  const codeSymbols = useMemo(() => [
    '{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']',
    '0', '1', 'AI', '< >', '/*', '*/', '=>', '++', '&&', '||',
    'fn', 'let', 'var', 'if', 'for', '{ }', '...', '01', '10',
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let codeParticles = [];
    let connections = [];
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle class for neural network effect
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Pulse effect
        this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset));
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 122, 244, ${this.currentOpacity})`;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(0, 122, 244, ${this.currentOpacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Code symbol particle class
    class CodeParticle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.vy = -(Math.random() * 0.8 + 0.3);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        this.fontSize = Math.random() * 14 + 10;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.15 + 0.05;
        this.fadeIn = true;
        this.rotation = (Math.random() - 0.5) * 0.5;
        this.rotationAngle = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.rotationAngle += this.rotation * 0.01;
        
        // Fade in/out
        if (this.fadeIn) {
          this.opacity += 0.005;
          if (this.opacity >= this.maxOpacity) this.fadeIn = false;
        }
        
        if (this.y < -50) {
          this.reset();
        }
        
        // Fade out near top
        if (this.y < canvas.height * 0.2) {
          this.opacity = Math.max(0, this.opacity - 0.002);
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);
        ctx.font = `${this.fontSize}px "Fira Code", monospace`;
        ctx.fillStyle = `rgba(0, 198, 255, ${this.opacity})`;
        ctx.textAlign = 'center';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    const codeParticleCount = Math.min(30, Math.floor((canvas.width * canvas.height) / 40000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    for (let i = 0; i < codeParticleCount; i++) {
      const particle = new CodeParticle();
      particle.y = Math.random() * canvas.height; // Start at random positions
      codeParticles.push(particle);
    }

    // Draw connections between nearby particles
    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 122, 244, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    // Draw gradient orbs
    const drawGradientOrbs = () => {
      const time = Date.now() * 0.0005;
      
      // Large gradient orb 1
      const orb1X = canvas.width * 0.3 + Math.sin(time) * 100;
      const orb1Y = canvas.height * 0.3 + Math.cos(time * 0.7) * 80;
      const gradient1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 300);
      gradient1.addColorStop(0, 'rgba(0, 122, 244, 0.1)');
      gradient1.addColorStop(0.5, 'rgba(0, 122, 244, 0.03)');
      gradient1.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Large gradient orb 2
      const orb2X = canvas.width * 0.7 + Math.cos(time * 0.8) * 120;
      const orb2Y = canvas.height * 0.6 + Math.sin(time * 0.6) * 100;
      const gradient2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 350);
      gradient2.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      gradient2.addColorStop(0.5, 'rgba(168, 85, 247, 0.02)');
      gradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Accent orb
      const orb3X = canvas.width * 0.5 + Math.sin(time * 1.2) * 150;
      const orb3Y = canvas.height * 0.8 + Math.cos(time * 0.9) * 60;
      const gradient3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, 250);
      gradient3.addColorStop(0, 'rgba(0, 198, 255, 0.06)');
      gradient3.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient orbs
      drawGradientOrbs();
      
      // Update and draw neural network particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw connections
      drawConnections();
      
      // Update and draw code particles
      codeParticles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [codeSymbols]);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      aria-hidden="true"
    />
  );
}

export default AnimatedBackground;

import { useEffect, useRef, useMemo } from 'react';

/**
 * AnimatedBackground Component
 * Creates an immersive, code/AI themed animated background
 * Features floating code symbols, neural network particles, and gradient effects
 * With interactive mouse movement similar to GitHub Spark stars
 * Particles have depth layers and smoothly follow/react to cursor with parallax effect
 */
export function AnimatedBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, isActive: false });
  const targetMouseRef = useRef({ x: null, y: null });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: null, y: null });
  
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
    
    // Mouse interaction settings - GitHub Spark style
    const mouseRadius = 250; // Larger radius of mouse influence
    const returnSpeed = 0.03; // Speed at which particles return to original path
    
    // Smoothed mouse position for fluid movement
    let smoothMouse = { x: null, y: null };
    let mouseVelocity = { x: 0, y: 0 };
    let lastMouse = { x: null, y: null };
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Mouse event handlers
    const handleMouseMove = (e) => {
      targetMouseRef.current.x = e.clientX;
      targetMouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouseRef.current.x = e.touches[0].clientX;
        targetMouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.isActive = true;
      }
    };
    
    const handleTouchEnd = () => {
      mouseRef.current.isActive = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Particle class for neural network effect with parallax depth
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        this.radius = Math.random() * 2 + 1.5;
        this.baseRadius = this.radius;
        this.opacity = Math.random() * 0.35 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        
        // Parallax depth layer (0.3 = far/slow, 1.0 = close/fast) - GitHub Spark style
        this.depth = Math.random() * 0.7 + 0.3;
        
        // Mouse interaction properties with momentum
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Adjust properties based on depth (far = smaller, dimmer)
        this.radius *= this.depth;
        this.baseRadius = this.radius;
        this.opacity *= this.depth;
      }
      
      update() {
        // Smooth mouse position interpolation
        if (targetMouseRef.current.x !== null) {
          if (smoothMouse.x === null) {
            smoothMouse.x = targetMouseRef.current.x;
            smoothMouse.y = targetMouseRef.current.y;
            lastMouse.x = smoothMouse.x;
            lastMouse.y = smoothMouse.y;
          } else {
            // Track mouse velocity for momentum effect
            const newX = smoothMouse.x + (targetMouseRef.current.x - smoothMouse.x) * 0.12;
            const newY = smoothMouse.y + (targetMouseRef.current.y - smoothMouse.y) * 0.12;
            mouseVelocity.x = newX - smoothMouse.x;
            mouseVelocity.y = newY - smoothMouse.y;
            smoothMouse.x = newX;
            smoothMouse.y = newY;
          }
        }
        
        // GitHub Spark style parallax - particles drift based on mouse position relative to center
        if (smoothMouse.x !== null) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          // Calculate offset from center (normalized)
          const offsetX = (smoothMouse.x - centerX) / centerX;
          const offsetY = (smoothMouse.y - centerY) / centerY;
          
          // Parallax movement - deeper particles move more with mouse
          const parallaxStrength = 30;
          const targetOffsetX = offsetX * parallaxStrength * this.depth;
          const targetOffsetY = offsetY * parallaxStrength * this.depth;
          
          // Add mouse velocity influence for momentum/drift effect
          const momentumStrength = 3 * this.depth;
          const targetVelX = mouseVelocity.x * momentumStrength;
          const targetVelY = mouseVelocity.y * momentumStrength;
          
          // Smooth spring animation toward target
          this.velocityX += (targetOffsetX - this.mouseOffsetX) * 0.02;
          this.velocityY += (targetOffsetY - this.mouseOffsetY) * 0.02;
          
          // Add momentum from mouse movement
          this.velocityX += targetVelX * 0.1;
          this.velocityY += targetVelY * 0.1;
          
          // Apply damping for smooth deceleration
          this.velocityX *= 0.92;
          this.velocityY *= 0.92;
          
          // Update offsets
          this.mouseOffsetX += this.velocityX;
          this.mouseOffsetY += this.velocityY;
          
          // Additional attraction effect when mouse is near
          const dx = (this.baseX + this.mouseOffsetX) - smoothMouse.x;
          const dy = (this.baseY + this.mouseOffsetY) - smoothMouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            // Subtle attraction/repulsion wave effect
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            
            // Gentle push away from cursor
            this.velocityX += Math.cos(angle) * force * 0.3 * this.depth;
            this.velocityY += Math.sin(angle) * force * 0.3 * this.depth;
            
            // Increase size slightly when near mouse
            this.radius = this.baseRadius * (1 + force * 0.4);
          } else {
            this.radius = this.baseRadius;
          }
        } else {
          // Gradually return to zero when no mouse
          this.velocityX *= 0.95;
          this.velocityY *= 0.95;
          this.mouseOffsetX += this.velocityX;
          this.mouseOffsetY += this.velocityY;
          this.mouseOffsetX *= 0.98;
          this.mouseOffsetY *= 0.98;
          this.radius = this.baseRadius;
        }
        
        // Apply base velocity (autonomous movement)
        this.baseX += this.baseVx;
        this.baseY += this.baseVy;
        
        // Calculate final position with mouse offset
        this.x = this.baseX + this.mouseOffsetX;
        this.y = this.baseY + this.mouseOffsetY;
        
        // Wrap around screen (for base position)
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = canvas.height;
        if (this.baseY > canvas.height) this.baseY = 0;
        
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
        gradient.addColorStop(0, `rgba(0, 122, 244, ${this.currentOpacity * 0.35})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Code symbol particle class with parallax depth
    class CodeParticle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vy = -(Math.random() * 0.8 + 0.3);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        this.fontSize = Math.random() * 8 + 6;
        this.baseFontSize = this.fontSize;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.08 + 0.02;
        this.fadeIn = true;
        this.rotation = (Math.random() - 0.5) * 0.5;
        this.rotationAngle = Math.random() * Math.PI * 2;
        
        // Parallax depth layer (0.2 = far/slow, 1.0 = close/fast)
        this.depth = Math.random() * 0.8 + 0.2;
        
        // Mouse interaction properties with momentum
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Adjust properties based on depth
        this.fontSize *= this.depth;
        this.baseFontSize = this.fontSize;
        this.maxOpacity *= this.depth;
      }
      
      update() {
        // GitHub Spark style parallax - code particles drift with mouse
        if (smoothMouse.x !== null) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          // Calculate offset from center (normalized)
          const offsetX = (smoothMouse.x - centerX) / centerX;
          const offsetY = (smoothMouse.y - centerY) / centerY;
          
          // Parallax movement
          const parallaxStrength = 40;
          const targetOffsetX = offsetX * parallaxStrength * this.depth;
          const targetOffsetY = offsetY * parallaxStrength * this.depth;
          
          // Add mouse velocity influence for momentum effect
          const momentumStrength = 4 * this.depth;
          const targetVelX = mouseVelocity.x * momentumStrength;
          const targetVelY = mouseVelocity.y * momentumStrength;
          
          // Smooth spring animation toward target
          this.velocityX += (targetOffsetX - this.mouseOffsetX) * 0.015;
          this.velocityY += (targetOffsetY - this.mouseOffsetY) * 0.015;
          
          // Add momentum from mouse movement
          this.velocityX += targetVelX * 0.08;
          this.velocityY += targetVelY * 0.08;
          
          // Apply damping
          this.velocityX *= 0.9;
          this.velocityY *= 0.9;
          
          // Update offsets
          this.mouseOffsetX += this.velocityX;
          this.mouseOffsetY += this.velocityY;
          
          // Swirl effect when mouse is near
          const dx = (this.baseX + this.mouseOffsetX) - smoothMouse.x;
          const dy = (this.baseY + this.mouseOffsetY) - smoothMouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius * 1.2) {
            const force = (mouseRadius * 1.2 - distance) / (mouseRadius * 1.2);
            const angle = Math.atan2(dy, dx);
            
            // Create a swirling effect - push away with slight rotation
            const swirlAngle = angle + Math.PI * 0.25;
            this.velocityX += Math.cos(swirlAngle) * force * 0.4 * this.depth;
            this.velocityY += Math.sin(swirlAngle) * force * 0.4 * this.depth;
            
            // Increase opacity and size when near mouse
            this.fontSize = this.baseFontSize * (1 + force * 0.3);
            this.maxOpacity = Math.min(0.25, this.maxOpacity + force * 0.01);
            
            // Add extra rotation when near mouse
            this.rotationAngle += force * 0.03 * this.depth;
          } else {
            this.fontSize = this.baseFontSize;
          }
        } else {
          // Gradually return to zero when no mouse
          this.velocityX *= 0.93;
          this.velocityY *= 0.93;
          this.mouseOffsetX += this.velocityX;
          this.mouseOffsetY += this.velocityY;
          this.mouseOffsetX *= 0.97;
          this.mouseOffsetY *= 0.97;
          this.fontSize = this.baseFontSize;
        }
        
        // Update base position
        this.baseY += this.vy;
        this.baseX += this.vx;
        this.rotationAngle += this.rotation * 0.01;
        
        // Calculate final position
        this.x = this.baseX + this.mouseOffsetX;
        this.y = this.baseY + this.mouseOffsetY;
        
        // Fade in/out
        if (this.fadeIn) {
          this.opacity += 0.005;
          if (this.opacity >= this.maxOpacity) this.fadeIn = false;
        }
        
        if (this.baseY < -50) {
          this.reset();
        }
        
        // Fade out near top
        if (this.baseY < canvas.height * 0.2) {
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

    // Initialize particles - REDUCED for better performance
    const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000));
    const codeParticleCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 80000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    for (let i = 0; i < codeParticleCount; i++) {
      const particle = new CodeParticle();
      particle.y = Math.random() * canvas.height; // Start at random positions
      particle.baseY = particle.y;
      codeParticles.push(particle);
    }

    // Draw connections between nearby particles - OPTIMIZED
    const drawConnections = () => {
      const maxDistance = 120;
      const maxDistanceSq = maxDistance * maxDistance;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;
          
          // Skip sqrt if clearly out of range
          if (distanceSq > maxDistanceSq) continue;
          
          const distance = Math.sqrt(distanceSq);
          let opacity = (1 - distance / maxDistance) * 0.2;
            
            // Brighten connections near mouse
            if (mouseRef.current.isActive && smoothMouse.x !== null) {
              const midX = (particles[i].x + particles[j].x) / 2;
              const midY = (particles[i].y + particles[j].y) / 2;
              const mouseDistSq = 
                (midX - smoothMouse.x) * (midX - smoothMouse.x) + 
                (midY - smoothMouse.y) * (midY - smoothMouse.y);
              const mouseRadiusSq = mouseRadius * mouseRadius;
              if (mouseDistSq < mouseRadiusSq) {
                const mouseInfluence = 1 - Math.sqrt(mouseDistSq) / mouseRadius;
                opacity = Math.min(0.4, opacity + mouseInfluence * 0.15);
              }
            }
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 122, 244, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
      }
      
      // Draw connection lines from particles to mouse cursor (GitHub Spark effect)
      if (mouseRef.current.isActive && smoothMouse.x !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - smoothMouse.x;
          const dy = particles[i].y - smoothMouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius * 0.8) {
            const opacity = (1 - distance / (mouseRadius * 0.8)) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(smoothMouse.x, smoothMouse.y);
            ctx.strokeStyle = `rgba(0, 198, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    
    // Draw mouse glow effect
    const drawMouseGlow = () => {
      if (mouseRef.current.isActive && smoothMouse.x !== null) {
        // Outer glow
        const gradient = ctx.createRadialGradient(
          smoothMouse.x, smoothMouse.y, 0,
          smoothMouse.x, smoothMouse.y, mouseRadius
        );
        gradient.addColorStop(0, 'rgba(0, 122, 244, 0.1)');
        gradient.addColorStop(0.4, 'rgba(0, 122, 244, 0.03)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(
          smoothMouse.x - mouseRadius, 
          smoothMouse.y - mouseRadius, 
          mouseRadius * 2, 
          mouseRadius * 2
        );
        
        // Inner bright spot
        const innerGradient = ctx.createRadialGradient(
          smoothMouse.x, smoothMouse.y, 0,
          smoothMouse.x, smoothMouse.y, 30
        );
        innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        innerGradient.addColorStop(0.5, 'rgba(0, 198, 255, 0.1)');
        innerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(smoothMouse.x, smoothMouse.y, 30, 0, Math.PI * 2);
        ctx.fill();
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
      
      // Draw mouse glow
      drawMouseGlow();
      
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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

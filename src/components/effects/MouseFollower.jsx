import { useEffect, useRef, useState } from 'react';

/**
 * MouseFollower Component
 * Creates an interactive cursor effect with a glowing orb that follows mouse movement
 * Similar to dxbinteract.com
 */
export function MouseFollower() {
  const cursorRef = useRef(null);
  const cursorOuterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const outerPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorOuter = cursorOuterRef.current;
    
    if (!cursor || !cursorOuter) return;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    // Mouse enter/leave handlers for interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, .repo-card, .cta-card, .ai-suggestion-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Animation loop for smooth following
    let animationId;
    const animate = () => {
      // Smooth interpolation for inner cursor (faster)
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * 0.15;
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * 0.15;
      
      // Smooth interpolation for outer cursor (slower, more trailing)
      outerPosition.current.x += (mousePosition.current.x - outerPosition.current.x) * 0.08;
      outerPosition.current.y += (mousePosition.current.y - outerPosition.current.y) * 0.08;

      cursor.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`;
      cursorOuter.style.transform = `translate(${outerPosition.current.x}px, ${outerPosition.current.y}px)`;

      animationId = requestAnimationFrame(animate);
    };

    // Hide cursor when leaving window
    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  // Re-attach hover listeners when DOM changes - FIXED memory leak
  useEffect(() => {
    const hoverEnter = () => setIsHovering(true);
    const hoverLeave = () => setIsHovering(false);
    
    // Track elements we've added listeners to
    const trackedElements = new WeakSet();
    
    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, .repo-card, .cta-card, .ai-suggestion-btn');
      interactiveElements.forEach(el => {
        if (!trackedElements.has(el)) {
          el.addEventListener('mouseenter', hoverEnter);
          el.addEventListener('mouseleave', hoverLeave);
          trackedElements.add(el);
        }
      });
    };
    
    // Debounce observer callbacks
    let timeoutId;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(attachListeners, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners(); // Initial attach
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Inner cursor - small dot */}
      <div
        ref={cursorRef}
        className={`mouse-cursor-inner ${isVisible ? 'visible' : ''} ${isHovering ? 'hovering' : ''}`}
      />
      {/* Outer cursor - glowing orb */}
      <div
        ref={cursorOuterRef}
        className={`mouse-cursor-outer ${isVisible ? 'visible' : ''} ${isHovering ? 'hovering' : ''}`}
      />
    </>
  );
}

export default MouseFollower;

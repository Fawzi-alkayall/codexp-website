import { useCallback } from 'react';

/**
 * Custom hook for smooth scroll navigation
 * Handles scrolling to sections with header offset and highlighting
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.headerOffset - Offset for fixed header (default: 80)
 * @param {number} options.highlightDuration - Duration of highlight effect (default: 1500)
 * @param {Function} options.onNavigate - Callback after navigation
 * @returns {Function} handleNavClick - Navigation click handler
 */
export function useNavigation(options = {}) {
  const {
    headerOffset = 80,
    highlightDuration = 1500,
    onNavigate,
  } = options;

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Add highlighting animation to target section
      targetElement.classList.add('section-highlight');
      setTimeout(() => {
        targetElement.classList.remove('section-highlight');
      }, highlightDuration);

      // Smooth scroll with offset for header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    
    // Call optional callback
    if (onNavigate) {
      onNavigate();
    }
  }, [headerOffset, highlightDuration, onNavigate]);

  return handleNavClick;
}

export default useNavigation;

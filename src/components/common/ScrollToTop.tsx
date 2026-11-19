import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures scroll position is reset to the top upon route navigation.
 * Preserves native momentum scroll while avoiding scroll-offset inheritance.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Avoid jarring jumps if user is scrolling within a hash anchor
    if (!window.location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    }
  }, [pathname, search]);

  return null;
};

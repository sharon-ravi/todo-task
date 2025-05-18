// frontend/src/components/RouteBackgroundManager.js
import { useEffect } from 'react'; // React import is not needed if not using JSX
import { useLocation } from 'react-router-dom';

const RouteBackgroundManager = () => {
  const location = useLocation();

  useEffect(() => {
    const classList = document.body.classList;
    const allBgClasses = [ // Define all possible background classes here
      'landing-bg',
      'auth-bg',
      'app-tasks-bg',
      'app-profile-bg',
      'app-today-bg',
      'app-important-bg',
      'app-default-bg', // For generic app pages
      'default-bg'      // For truly default/unmatched
    ];

    // Remove any existing background classes from our list
    allBgClasses.forEach(cls => {
      if (classList.contains(cls)) {
        classList.remove(cls);
      }
    });

    // Clear any inline background image style (if you were testing that way before)
    document.body.style.backgroundImage = '';

    let newBgClass = 'default-bg'; // Fallback

    // Determine the new class based on the pathname
    // Make sure these paths match your <Route path="..."> definitions in App.js
    if (location.pathname === '/' || location.pathname === '/welcome') {
      newBgClass = 'landing-bg';
    } else if (location.pathname === '/login' || location.pathname === '/register') {
      newBgClass = 'auth-bg';
    } else if (location.pathname === '/app/tasks') {
      newBgClass = 'app-tasks-bg';
    } else if (location.pathname === '/app/profile') {
      newBgClass = 'app-profile-bg';
    } else if (location.pathname === '/app/today') {
      newBgClass = 'app-today-bg';
    } else if (location.pathname === '/app/important') {
      newBgClass = 'app-important-bg';
    } else if (location.pathname.startsWith('/app/')) { // Catch-all for other /app/ routes
      newBgClass = 'app-default-bg';
    }
    // No specific class for other non-app routes, so 'default-bg' will apply

    classList.add(newBgClass);

  }, [location.pathname]); // Re-run effect when pathname changes

  return null; // This component does not render anything visible
};

export default RouteBackgroundManager;
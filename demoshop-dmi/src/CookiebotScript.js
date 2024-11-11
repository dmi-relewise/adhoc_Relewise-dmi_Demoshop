import { useEffect } from 'react';

const CookiebotScript = () => {
  useEffect(() => {
    // Create the Cookiebot script element
    const script = document.createElement('script');
    
    // Set up Cookiebot script attributes
    script.id = "Cookiebot";
    script.src = "https://consent.cookiebot.com/uc.js";
    script.setAttribute('data-cbid', process.env.REACT_APP_COOKIEBOT_ID);  
    script.type = "text/javascript";
    script.async = true;
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []); // Empty dependency array ensures the script is loaded only once (on mount)
  
  return null;  // No visible content from this component
};

export default CookiebotScript;

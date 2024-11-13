import { useEffect } from 'react';

const CookiebotScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    
    script.id = "Cookiebot";
    script.src = "https://consent.cookiebot.com/uc.js";
    script.setAttribute('data-cbid', process.env.REACT_APP_COOKIEBOT_ID);  
    script.type = "text/javascript";
    script.async = true;
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return null;  
};

export default CookiebotScript;

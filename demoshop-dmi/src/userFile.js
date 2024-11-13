import {UserFactory} from '@relewise/client';

const getUser = () => {
    
    return window.CookieConsent &&
           window.CookieConsent.consent &&
           window.CookieConsent.consent.marketing &&
           window.CookieConsent.consentID !== '0'
      ? UserFactory.byTemporaryId(window.CookieConsent.consentID)
      : UserFactory.anonymous();
  };

  

  export default getUser;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "services": "Services",
      "all_services": "All Services",
      "trade": "Trade",
      "dashboard": "Dashboard",
      "login": "Login",
      "get_started": "Get Started",
      "search_placeholder": "Search forex concepts, services, guides..."
    }
  },
  fr: {
    translation: {
      "home": "Accueil",
      "services": "Services",
      "all_services": "Tous les services",
      "trade": "Commerce",
      "dashboard": "Tableau de bord",
      "login": "Connexion",
      "get_started": "Commencer",
      "search_placeholder": "Rechercher des concepts forex..."
    }
  },
  es: {
    translation: {
      "home": "Inicio",
      "services": "Servicios",
      "all_services": "Todos los servicios",
      "trade": "Comercio",
      "dashboard": "Panel",
      "login": "Acceso",
      "get_started": "Empezar",
      "search_placeholder": "Buscar conceptos de forex..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: ["en", "ar"],
  ns: ["translation"],
  defaultNS: "translation",
  supportedLngs: ["en", "ar", "zh", "zht", "ur", "es", "fr"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

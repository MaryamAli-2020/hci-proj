import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

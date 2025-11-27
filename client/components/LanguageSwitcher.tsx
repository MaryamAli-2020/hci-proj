import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    // Set RTL for Arabic and Urdu
    document.documentElement.dir = (language === "ar" || language === "ur") ? "rtl" : "ltr";
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-fit border-gray-300 bg-gray-900 text-white">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t("common.english")}</SelectItem>
        <SelectItem value="ar">{t("common.arabic")}</SelectItem>
        <SelectItem value="zh">{t("common.chineseSimplified")}</SelectItem>
        <SelectItem value="zht">{t("common.chineseTraditional")}</SelectItem>
        <SelectItem value="ur">{t("common.urdu")}</SelectItem>
        <SelectItem value="es">{t("common.spanish")}</SelectItem>
        <SelectItem value="fr">{t("common.french")}</SelectItem>
      </SelectContent>
    </Select>
  );
}

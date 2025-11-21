import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatDrawer } from "./ChatDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Logo and Home Link */}
            <Link
              to="/"
              className={`flex items-center gap-2 group ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label="QANOON Home"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ff46060a51def4581996706726593bb17%2F847e2fca57024abbaa68546de032858b"
                alt="QANOON"
                className="h-10 w-auto hidden sm:block"
              />
              <span className="font-bold text-xl text-white hidden sm:inline group-hover:text-[#BF9140] transition-colors">
                QANOON
              </span>
            </Link>

            {/* Navigation Links - Hidden on Mobile */}
            <nav className={`hidden md:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link
                to="/"
                className="text-gray-100 hover:text-[#BF9140] transition-colors font-medium text-sm"
              >
                {t("header.browse")}
              </Link>
              <a
                href="#features"
                className="text-gray-100 hover:text-[#BF9140] transition-colors font-medium text-sm"
              >
                {t("header.features")}
              </a>
              <a
                href="#about"
                className="text-gray-100 hover:text-[#BF9140] transition-colors font-medium text-sm"
              >
                {t("header.about")}
              </a>
            </nav>

            {/* Search and Action Buttons */}
            <div className={`flex items-center gap-2 sm:gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Search - Responsive */}
              <form
                onSubmit={handleSearch}
                className="relative hidden sm:flex items-center"
              >
                <Input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 h-9 text-sm pr-3 border-gray-400 bg-gray-800 text-white placeholder-gray-300"
                  aria-label="Search laws"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-gray-300 hover:text-white"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(!searchOpen)}
                className="sm:hidden text-gray-300 hover:text-white"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Chat Button */}
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-[#BF9140] hover:bg-[#A67C2E] text-white gap-2 hidden sm:flex font-medium"
                size="sm"
                aria-label="Open AI chat assistant"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t("header.askAI")}</span>
              </Button>

              {/* Chat Button - Mobile */}
              <Button
                onClick={() => setIsChatOpen(true)}
                variant="ghost"
                size="sm"
                className="sm:hidden text-gray-300 hover:text-white"
                aria-label="Open AI chat assistant"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className={`mt-4 flex sm:hidden items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 text-sm"
                aria-label="Search laws"
              />
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ${isRTL ? "text-right" : ""}`}>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t("footer.categories")}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    to="/?category=criminal"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.criminalLaw")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=corporate"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.corporateLaw")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=family"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.familyLaw")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t("footer.resources")}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.helpCenter")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.blog")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.contact")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.privacyPolicy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.termsOfService")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.disclaimer")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.aboutUs")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.careers")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    {t("footer.updates")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={`border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600 ${isRTL ? "text-right" : ""}`}>
            <p dangerouslySetInnerHTML={{ __html: t("footer.copyright") }} />
          </div>
        </div>
      </footer>

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

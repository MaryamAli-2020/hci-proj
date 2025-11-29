import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatDrawer } from "./ChatDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AccessibilitySettings } from "./AccessibilitySettings";

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
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl overflow-x-hidden border-b border-[#BF9140]/20">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Top Section - Logo & Main Controls */}
          <div className={`flex items-center justify-between gap-6 py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Logo and Brand */}
            <Link
              to="/"
              className={`flex items-center gap-3 group flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label="QANOON Home"
            >
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ff46060a51def4581996706726593bb17%2F847e2fca57024abbaa68546de032858b"
                  alt="QANOON"
                  className="h-11 w-auto hidden sm:block transition-transform group-hover:scale-110"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-xl text-white group-hover:text-[#BF9140] transition-colors">
                  QANOON
                </span>
                <span className="text-xs text-gray-400 font-medium">Legal Intelligence</span>
              </div>
            </Link>

            {/* Center Navigation - Hidden on Mobile */}
            <nav className={`hidden lg:flex items-center gap-1 flex-1 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link
                to="/"
                className="px-4 py-2 text-gray-200 hover:text-[#BF9140] hover:bg-gray-800/50 rounded-lg transition-all font-medium text-sm"
              >
                {t("header.browse")}
              </Link>
              <a
                href="#features"
                className="px-4 py-2 text-gray-200 hover:text-[#BF9140] hover:bg-gray-800/50 rounded-lg transition-all font-medium text-sm"
              >
                {t("header.features")}
              </a>
              <a
                href="#about"
                className="px-4 py-2 text-gray-200 hover:text-[#BF9140] hover:bg-gray-800/50 rounded-lg transition-all font-medium text-sm"
              >
                {t("header.about")}
              </a>
            </nav>

            {/* Right Actions - Organized */}
            <div className={`flex items-center gap-2 sm:gap-3 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Search - Hidden on Mobile */}
              <form
                onSubmit={handleSearch}
                className="relative hidden sm:flex items-center bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-700 transition-colors"
              >
                <input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 bg-transparent text-white placeholder-gray-400 text-sm outline-none focus:text-white"
                  aria-label="Search laws"
                />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-[#BF9140] transition-colors"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="hidden sm:block h-6 w-px bg-gray-700"></div>

              {/* Language & Accessibility */}
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <LanguageSwitcher />
                <AccessibilitySettings />
              </div>

              {/* Primary CTA Button */}
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-[#BF9140] to-[#A67C2E] hover:from-[#D4A574] hover:to-[#B8944A] text-white gap-2 font-semibold hidden sm:flex shadow-lg hover:shadow-xl transition-all"
                size="sm"
                aria-label="Open AI chat assistant"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden md:inline">{t("header.askAI")}</span>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                onClick={() => setSearchOpen(!searchOpen)}
                variant="ghost"
                size="icon"
                className="sm:hidden text-gray-300 hover:text-[#BF9140] hover:bg-gray-800"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Mobile Chat Button */}
              <Button
                onClick={() => setIsChatOpen(true)}
                variant="ghost"
                size="icon"
                className="sm:hidden text-gray-300 hover:text-[#BF9140] hover:bg-gray-800"
                aria-label="Open AI chat assistant"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              className={`mt-3 mb-3 flex sm:hidden items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Input
                type="text"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 text-sm bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                aria-label="Search laws"
              />
              <Button type="submit" size="sm" className="bg-[#BF9140] hover:bg-[#A67C2E] text-white">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="container max-w-7xl mx-auto px-4 w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16 overflow-x-hidden">
        <div className="container max-w-7xl mx-auto px-4 py-12 w-full">
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

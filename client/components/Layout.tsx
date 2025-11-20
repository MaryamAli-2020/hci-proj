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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-slate-900">
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
              <span className="font-bold text-xl text-white hidden sm:inline group-hover:text-amber-500 transition-colors">
                QANOON
              </span>
            </Link>

            {/* Navigation Links - Hidden on Mobile */}
            <nav className={`hidden md:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link
                to="/"
                className="text-gray-200 hover:text-amber-400 transition-colors font-medium text-sm"
              >
                {t("header.browse")}
              </Link>
              <a
                href="#features"
                className="text-gray-200 hover:text-amber-400 transition-colors font-medium text-sm"
              >
                {t("header.features")}
              </a>
              <a
                href="#about"
                className="text-gray-200 hover:text-amber-400 transition-colors font-medium text-sm"
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
                  className="w-48 h-9 text-sm pr-3 border-gray-600 bg-slate-800 text-white placeholder-gray-500"
                  aria-label="Search laws"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-gray-500 hover:text-gray-300"
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
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2 hidden sm:flex font-medium"
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
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    to="/?category=criminal"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Criminal Law
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=corporate"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Corporate Law
                  </Link>
                </li>
                <li>
                  <Link
                    to="/?category=family"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Family Law
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>
              &copy; 2025 Qanoon. All rights reserved. This is educational
              content and not legal advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { categories, laws } from "@/data/laws";
import { ArrowRight, CheckCircle, Clock, Star, Users, FileText, Scale, Heart, Building2, Lightbulb } from "lucide-react";

// Map category IDs to their respective icons
const getCategoryIcon = (categoryId: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    labor: <Users className="w-16 h-16 text-gray-400" />,
    civil: <FileText className="w-16 h-16 text-gray-400" />,
    criminal: <Scale className="w-16 h-16 text-gray-400" />,
    family: <Heart className="w-16 h-16 text-gray-400" />,
    corporate: <Building2 className="w-16 h-16 text-gray-400" />,
    intellectual: <Lightbulb className="w-16 h-16 text-gray-400" />,
  };
  return iconMap[categoryId] || <FileText className="w-16 h-16 text-gray-400" />;
};

export default function Index() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-24 -mx-4 -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)] px-[calc(50vw-50%+1rem)] py-20 sm:py-36 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className={`max-w-4xl mx-auto text-center mb-12 ${isRTL ? "text-right" : ""}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t("hero.title")} <span className="text-[#BF9140]">Qanoon</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button className="bg-[#BF9140] hover:bg-[#A67C2E] text-white gap-2 px-8 py-3 h-auto text-base font-semibold rounded-sm transition-all duration-200">
              {t("hero.exploreCategories")} <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-white hover:bg-gray-700 gap-2 px-8 py-3 h-auto text-base font-semibold rounded-sm bg-gray-800 bg-opacity-50"
            >
              {t("hero.askLegalAssistant")}
            </Button>
          </div>
        </div>

        {/* Features Overview */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 ${isRTL ? "text-right" : ""}`}>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-7 h-7 text-[#08AA78] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-base">
                {t("features.comprehensiveCoverage")}
              </h3>
              <p className="text-sm text-gray-100">
                {t("features.comprehensiveCoverageDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-7 h-7 text-[#08AA78] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-base">{t("features.aiAssistant")}</h3>
              <p className="text-sm text-gray-100">
                {t("features.aiAssistantDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-7 h-7 text-[#08AA78] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-base">
                {t("features.alwaysAvailable")}
              </h3>
              <p className="text-sm text-gray-100">
                {t("features.alwaysAvailableDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Updates & Most Viewed Section */}
      <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Updates */}
        <div>
          <div className={`mb-8 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Clock className="w-6 h-6 text-black flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("sections.recentUpdates")}
            </h2>
          </div>
          <div className="space-y-4">
            {laws
              .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
              .slice(0, 5)
              .map((law) => {
                const cat = categories.find((c) => c.id === law.category);
                return (
                  <Link
                    key={law.id}
                    to={`/law/${law.id}`}
                    className="block p-4 border border-gray-200 rounded-sm hover:border-red-400 hover:shadow-md transition-all bg-white group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                        {law.title}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-sm whitespace-nowrap font-medium">
                        {new Date(law.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {law.description}
                    </p>
                    {cat && (
                      <p className="text-xs text-gray-500 mt-2">{cat.title}</p>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Most Viewed */}
        <div>
          <div className={`mb-8 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Star className="w-6 h-6 text-black flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("sections.mostViewed")}
            </h2>
          </div>
          <div className="space-y-4">
            {laws
              .filter((l) => l.versions && l.versions.length > 0)
              .slice(0, 5)
              .map((law, idx) => {
                const cat = categories.find((c) => c.id === law.category);
                return (
                  <Link
                    key={law.id}
                    to={`/law/${law.id}`}
                    className="block p-4 border border-gray-200 rounded-sm hover:border-[#BF9140] hover:shadow-md transition-all bg-white group"
                  >
                    <div className="flex items-start gap-4 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-black rounded-sm flex-shrink-0">
                        <span className="text-sm font-bold text-[#BF9140]">
                          {idx + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#BF9140] transition-colors flex-1">
                        {law.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1 ml-12">
                      {law.description}
                    </p>
                    {cat && (
                      <p className="text-xs text-gray-500 mt-2 ml-12">
                        {cat.title}
                      </p>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className={`mb-24 ${isRTL ? "text-right" : ""}`}>
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("categories.title")}
          </h2>
          <p className="text-gray-600 text-lg">
            {t("categories.description")}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group"
            >
              <div className="h-full rounded-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#BF9140] hover:shadow-lg bg-white">
                {/* Card Header with Gradient */}
                <div
                  className={`h-32 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden flex items-center justify-end pr-4`}
                >
                  <div className="opacity-20">
                    {getCategoryIcon(category.id)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#BF9140] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-[#BF9140] text-xs font-semibold rounded-sm">
                      {category.count} {t("sections.topics")}
                    </span>
                    <ArrowRight className={`w-4 h-4 text-gray-400 group-hover:text-[#BF9140] transition-all ${isRTL ? "rotate-180" : "group-hover:translate-x-1"}`} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`rounded-sm bg-[#BF9140] text-white py-16 px-8 text-center ${isRTL ? "text-right" : ""}`}>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {t("cta.title")}
        </h2>
        <p className="text-gray-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          {t("cta.description")}
        </p>
        <Button className={`bg-white hover:bg-gray-100 text-black font-semibold gap-2 px-8 py-3 h-auto text-base rounded-sm transition-all duration-200 ${isRTL ? "flex-row-reverse" : ""}`}>
          {t("cta.startConversation")} <ArrowRight className="w-4 h-4" />
        </Button>
      </section>
    </Layout>
  );
}

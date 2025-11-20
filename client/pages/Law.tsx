import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { categories, laws } from "@/data/laws";
import { ArrowLeft, Share2, Bookmark, Check, ChevronDown, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatDrawer } from "@/components/ChatDrawer";

export default function Law() {
  const { lawId } = useParams<{ lawId: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [savedLaws, setSavedLaws] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("savedLaws");
    return new Set(saved ? JSON.parse(saved) : []);
  });
  const { toast } = useToast();

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const law = laws.find((l) => l.id === lawId);
  const category = categories.find((c) => c.id === law?.category);

  if (!law || !category) {
    return (
      <Layout>
        <div className="min-h-96 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Law Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The law information you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("common.back")}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedLaws = laws.filter(
    (l) => l.category === law.category && l.id !== law.id
  );

  const handleSave = () => {
    if (!law) return;

    const newSavedLaws = new Set(savedLaws);
    if (newSavedLaws.has(law.id)) {
      newSavedLaws.delete(law.id);
      toast({
        title: "Removed",
        description: `"${law.title}" removed from saved items.`,
      });
    } else {
      newSavedLaws.add(law.id);
      toast({
        title: "Saved",
        description: `"${law.title}" saved successfully.`,
      });
    }
    setSavedLaws(newSavedLaws);
    localStorage.setItem("savedLaws", JSON.stringify(Array.from(newSavedLaws)));
  };

  const handleShare = async () => {
    if (!law) return;

    const shareUrl = `${window.location.origin}/law/${law.id}`;
    const shareText = `${law.title} - QANOON Legal Resource`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: law.description,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link Copied",
        description: "Law link copied to clipboard.",
      });
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className={`mb-6 flex items-center gap-2 text-sm text-gray-600 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Link to="/" className="hover:text-amber-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/category/${category.id}`}
          className="hover:text-amber-600 transition-colors"
        >
          {category.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{law.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
            {category.title}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {law.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">{law.description}</p>

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              Last updated on{" "}
              <span className="font-semibold">
                {new Date(law.lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="inline-block px-3 py-2 bg-amber-50 border-l-4 border-amber-600 text-sm">
              <p className="text-gray-900 font-semibold">Legal Reference</p>
              <p className="text-amber-700 font-mono text-xs mt-1">
                {law.legalReference}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant={savedLaws.has(law.id) ? "default" : "outline"}
              size="sm"
              className={`gap-2 ${
                savedLaws.has(law.id)
                  ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                  : "border-gray-300"
              }`}
              aria-label="Save this law"
            >
              {savedLaws.has(law.id) ? (
                <Check className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {savedLaws.has(law.id) ? "Saved" : t("law.save")}
              </span>
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="gap-2 border-gray-300 hover:border-amber-600 hover:text-amber-600"
              aria-label="Share this law"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t("law.share")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Content */}
        <div className="lg:col-span-2">
          <article className="prose prose-sm max-w-none text-gray-700">
            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded mb-6">
              <p className="text-sm">
                <strong>Disclaimer:</strong> This information is provided for
                educational purposes only and is not legal advice. For legal
                advice, please consult with a qualified attorney licensed in
                your jurisdiction.
              </p>
            </div>

            {/* AI Summary Section */}
            {law.aiSummary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">✨</span> {t("law.aiSummary")}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {law.aiSummary}
                </p>
              </div>
            )}

            {/* Content Sections */}
            {law.sections && law.sections.length > 0 ? (
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-bold text-gray-900">{t("law.sections")}</h3>
                {law.sections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <h4 className="font-semibold text-gray-900 text-left">
                        {section.title}
                      </h4>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedSections.has(section.title) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections.has(section.title) && (
                      <div className="px-6 py-4 border-t border-gray-200 bg-white">
                        <p className="text-gray-700 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {law.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Version History */}
            {law.versions && law.versions.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className="w-full flex items-center justify-between mb-4 hover:bg-gray-100 p-2 rounded transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {t("law.versionHistory")}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      showVersionHistory ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showVersionHistory && (
                  <div className="space-y-4 ml-4 border-l-2 border-amber-600 pl-6">
                    {law.versions.map((version, index) => (
                      <div key={index} className="pb-4 last:pb-0">
                        <div className="absolute w-3 h-3 bg-amber-600 rounded-full -left-1.5 mt-2"></div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {version.title}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {new Date(version.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-700">{version.changes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cross References */}
            {law.crossReferences && law.crossReferences.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  {t("law.relatedLaws")}
                </h3>
                <div className="space-y-3">
                  {law.crossReferences.map((refId) => {
                    const refLaw = laws.find((l) => l.id === refId);
                    return refLaw ? (
                      <Link
                        key={refId}
                        to={`/law/${refLaw.id}`}
                        className="block p-3 bg-white border border-purple-200 rounded hover:border-purple-400 hover:shadow-md transition-all"
                      >
                        <p className="font-semibold text-purple-700 hover:text-purple-900">
                          {refLaw.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {refLaw.description}
                        </p>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Facts */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 font-medium mb-1">Category</dt>
                <dd>
                  <Link
                    to={`/category/${category.id}`}
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    {category.title}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium mb-1">Last Updated</dt>
                <dd className="text-gray-700">
                  {new Date(law.lastUpdated).toLocaleDateString(i18n.language === "ar" ? "ar-AE" : "en-US")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium mb-1">Status</dt>
                <dd className="text-gray-700">Current Information</dd>
              </div>
            </dl>
          </div>

          {/* Need Help */}
          <div className="bg-amber-600 text-white rounded-lg p-6">
            <h3 className="font-bold mb-2">Need Legal Help?</h3>
            <p className="text-sm text-amber-100 mb-4">
              Use our AI assistant to ask questions or get more information about
              this topic.
            </p>
            <Button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-white hover:bg-gray-100 text-amber-600 font-semibold"
            >
              {t("law.askAIAssistant")}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Laws */}
      {relatedLaws.length > 0 && (
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Laws
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedLaws.slice(0, 4).map((relatedLaw) => (
              <Link
                key={relatedLaw.id}
                to={`/law/${relatedLaw.id}`}
                className="group"
              >
                <div className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-amber-300 hover:shadow-md bg-white hover:bg-amber-50 h-full">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors mb-2">
                    {relatedLaw.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedLaw.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextLaw={law}
      />
    </Layout>
  );
}

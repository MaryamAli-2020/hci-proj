import { useSearchParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories, laws } from "@/data/laws";
import { ArrowRight, Filter, ArrowLeft } from "lucide-react";

interface SearchResult {
  law: typeof laws[0];
  relevanceScore: number;
  matchedContent: string;
  matchType: "title" | "description" | "content" | "keyword";
}

function calculateSemanticRelevance(query: string, law: typeof laws[0]): number {
  const queryTerms = query.toLowerCase().split(/\s+/);
  let totalScore = 0;
  let matchCount = 0;

  // Title matches (highest weight)
  const titleLower = law.title.toLowerCase();
  const titleMatches = queryTerms.filter((term) => titleLower.includes(term));
  totalScore += titleMatches.length * 30;
  if (titleMatches.length > 0) matchCount += 1;

  // Description matches
  const descriptionLower = law.description.toLowerCase();
  const descriptionMatches = queryTerms.filter((term) =>
    descriptionLower.includes(term)
  );
  totalScore += descriptionMatches.length * 20;
  if (descriptionMatches.length > 0) matchCount += 1;

  // Content matches (full text search)
  const contentLower = law.content.toLowerCase();
  const contentMatches = queryTerms.filter((term) =>
    contentLower.includes(term)
  );
  totalScore += contentMatches.length * 10;
  if (contentMatches.length > 0) matchCount += 1;

  // Keyword matches
  const keywordMatches = queryTerms.filter((term) =>
    law.keywords.some((kw) => kw.toLowerCase().includes(term))
  );
  totalScore += keywordMatches.length * 15;
  if (keywordMatches.length > 0) matchCount += 1;

  // Calculate normalized relevance score (0-100)
  const normalizedScore = Math.min(
    100,
    (totalScore / (queryTerms.length * 30)) * 100
  );
  return matchCount > 0 ? normalizedScore : 0;
}

function extractMatchedContent(
  query: string,
  law: typeof laws[0]
): { content: string; type: "title" | "description" | "content" | "keyword" } {
  const queryTerms = query.toLowerCase().split(/\s+/);

  // Check title
  const titleLower = law.title.toLowerCase();
  if (queryTerms.some((term) => titleLower.includes(term))) {
    return { content: law.title, type: "title" };
  }

  // Check description
  const descriptionLower = law.description.toLowerCase();
  if (queryTerms.some((term) => descriptionLower.includes(term))) {
    return { content: law.description, type: "description" };
  }

  // Check content with context
  const contentLower = law.content.toLowerCase();
  for (const term of queryTerms) {
    const index = contentLower.indexOf(term);
    if (index !== -1) {
      const startIndex = Math.max(0, index - 50);
      const endIndex = Math.min(law.content.length, index + 100);
      const context =
        (startIndex > 0 ? "..." : "") +
        law.content.substring(startIndex, endIndex) +
        (endIndex < law.content.length ? "..." : "");
      return { content: context, type: "content" };
    }
  }

  // Check keywords
  for (const term of queryTerms) {
    if (law.keywords.some((kw) => kw.toLowerCase().includes(term))) {
      return { content: law.keywords.join(", "), type: "keyword" };
    }
  }

  return { content: law.description, type: "description" };
}

function generateAISuggestions(query: string, results: SearchResult[]) {
  if (results.length === 0) {
    return [
      "No direct matches found. Try using different keywords.",
      "Consider searching for related terms or browse by category.",
    ];
  }

  const topMatch = results[0];
  const category = categories.find((c) => c.id === topMatch.law.category);

  return [
    `Found ${results.length} relevant legal document${results.length !== 1 ? "s" : ""}.`,
    `Top match: "${topMatch.law.title}" from ${category?.title}.`,
    `Your search also relates to: ${results
      .slice(1, 4)
      .map((r) => `"${r.law.title}"`)
      .join(", ")}.`,
  ];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const scored: SearchResult[] = laws
      .map((law) => ({
        law,
        relevanceScore: calculateSemanticRelevance(query, law),
        matchedContent: extractMatchedContent(query, law).content,
        matchType: extractMatchedContent(query, law).type,
      }))
      .filter((result) => result.relevanceScore > 0)
      .filter((result) =>
        selectedCategory ? result.law.category === selectedCategory : true
      )
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scored;
  }, [query, selectedCategory]);

  const suggestions = useMemo(() => generateAISuggestions(query, results), [
    query,
    results,
  ]);

  const filteredCategories = useMemo(() => {
    const cats = new Set(results.map((r) => r.law.category));
    return categories.filter((c) => cats.has(c.id));
  }, [results]);

  return (
    <Layout>
      {/* Search Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        <p className="text-lg text-gray-600">
          {query && (
            <>
              Results for "<span className="font-semibold">{query}</span>"
            </>
          )}
        </p>
      </div>

      {query && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-3">
            {/* AI Suggestions */}
            {results.length > 0 && (
              <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  AI Insights
                </h2>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    No results found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Try searching with different keywords or browse by category.
                  </p>
                  <Link to="/">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                      Browse Categories <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  Found <span className="font-semibold">{results.length}</span>{" "}
                  result{results.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {results.map((result) => {
                const category = categories.find(
                  (c) => c.id === result.law.category
                );
                return (
                  <Link
                    key={result.law.id}
                    to={`/law/${result.law.id}`}
                    className="block group"
                  >
                    <div className="p-6 border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all duration-200 bg-white">
                      {/* Header with Relevance */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {category && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {category.title}
                              </Badge>
                            )}
                            {result.relevanceScore >= 75 && (
                              <Badge className="bg-green-100 text-green-700">
                                Highly Relevant
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {result.law.title}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-amber-600">
                            {Math.round(result.relevanceScore)}
                          </div>
                          <div className="text-xs text-gray-500">
                            relevance
                          </div>
                        </div>
                      </div>

                      {/* Relevance Bar */}
                      <div className="mb-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-600 h-full transition-all duration-300"
                          style={{ width: `${result.relevanceScore}%` }}
                        />
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3">
                        {result.law.description}
                      </p>

                      {/* Matched Content Preview */}
                      <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          {result.matchType === "title" && "Title Match"}
                          {result.matchType === "description" &&
                            "Description Match"}
                          {result.matchType === "content" && "Content Match"}
                          {result.matchType === "keyword" && "Keyword Match"}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {result.matchedContent}
                        </p>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.law.keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      {/* Legal Reference */}
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold">Reference:</span>{" "}
                        {result.law.legalReference}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <h2 className="font-bold text-gray-900">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                      selectedCategory === null
                        ? "bg-amber-100 text-amber-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {filteredCategories.map((category) => {
                    const categoryResults = results.filter(
                      (r) => r.law.category === category.id
                    ).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                          selectedCategory === category.id
                            ? "bg-amber-100 text-amber-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.title}</span>
                          <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">
                            {categoryResults}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Relevance Filter Info */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm text-gray-900 mb-2">
                  About Relevance
                </h3>
                <p className="text-xs text-gray-700">
                  Scores are calculated based on keyword matches in titles,
                  descriptions, full content, and legal keywords.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Start searching the law
          </h2>
          <p className="text-gray-600">
            Use the search bar to find legal information across all our
            resources.
          </p>
        </div>
      )}
    </Layout>
  );
}

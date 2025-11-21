import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { categories, laws } from "@/data/laws";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Users, FileText, Scale, Heart, Building2, Lightbulb } from "lucide-react";

// Map category IDs to their gradient styles
const getCategoryGradient = (categoryId: string): string => {
  const gradientMap: { [key: string]: string } = {
    labor: "from-teal-700 to-green-500",
    civil: "from-teal-700 to-green-500",
    criminal: "from-teal-700 to-green-500",
    family: "from-teal-700 to-green-500",
    corporate: "from-teal-700 to-green-500",
    intellectual: "from-teal-700 to-green-500",
  };
  return gradientMap[categoryId] || "from-blue-500 to-cyan-500";
};

// Map category IDs to their respective icons
const getCategoryIcon = (categoryId: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    labor: <Users className="w-6 h-6 text-gray-600" />,
    civil: <FileText className="w-6 h-6 text-gray-600" />,
    criminal: <Scale className="w-6 h-6 text-gray-600" />,
    family: <Heart className="w-6 h-6 text-gray-600" />,
    corporate: <Building2 className="w-6 h-6 text-gray-600" />,
    intellectual: <Lightbulb className="w-6 h-6 text-gray-600" />,
  };
  return iconMap[categoryId] || <FileText className="w-6 h-6 text-gray-600" />;
};

const getHeaderIcon = (categoryId: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    labor: <Users className="w-16 h-16" />,
    civil: <FileText className="w-16 h-16" />,
    criminal: <Scale className="w-16 h-16" />,
    family: <Heart className="w-16 h-16" />,
    corporate: <Building2 className="w-16 h-16" />,
    intellectual: <Lightbulb className="w-16 h-16" />,
  };
  return iconMap[categoryId] || <FileText className="w-16 h-16" />;
};

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  const category = categories.find((c) => c.id === categoryId);
  const categoryLaws = laws.filter((law) => law.category === categoryId);

  if (!category) {
    return (
      <Layout>
        <div className="min-h-96 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>

        <div
          className={`bg-gradient-to-br opacity-80 ${getCategoryGradient(category.id)}  p-8 text-white mb-8`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 mb-2">Category</p>
              <h1 className="text-4xl sm:text-5xl font-bold">{category.title}</h1>
            </div>
            <div className="text-5xl opacity-80">
              {getHeaderIcon(category.id)}
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            {category.description}
          </p>
          <div className="mt-6 inline-block px-4 py-2 bg-white/20 rounded-lg">
            <p className="text-white font-semibold">{categoryLaws.length} topics in this category</p>
          </div>
        </div>
      </div>

      {/* Laws List */}
      <div className="grid grid-cols-1 gap-4">
        {categoryLaws.length > 0 ? (
          categoryLaws.map((law, index) => (
            <Link
              key={law.id}
              to={`/law/${law.id}`}
              className="group"
            >
              <div className="border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-md bg-white hover:bg-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {law.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {law.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Last updated: {new Date(law.lastUpdated).toLocaleDateString()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No laws available in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Related Categories */}
      {categories.length > 1 && (
        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .filter((c) => c.id !== categoryId)
              .slice(0, 3)
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="group"
                >
                  <div className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md bg-white">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getCategoryIcon(cat.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-gray-500">{cat.count} topics</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}
    </Layout>
  );
}

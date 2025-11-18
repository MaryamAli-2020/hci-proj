import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { categories, laws } from "@/data/laws";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();

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
          className={`bg-gradient-to-br ${category.color} rounded-xl p-8 text-white mb-8`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 mb-2">Category</p>
              <h1 className="text-4xl sm:text-5xl font-bold">{category.title}</h1>
            </div>
            <div className="text-6xl opacity-80">{category.icon}</div>
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
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
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
                      <span className="text-3xl">{cat.icon}</span>
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

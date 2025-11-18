import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/laws";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Understand the Law with <span className="text-blue-600">LegalHub</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Explore comprehensive legal information across multiple practice
            areas. Get answers to your questions with our AI-powered assistant
            available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6 py-2 h-auto text-base">
              Explore Categories <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-900 gap-2 px-6 py-2 h-auto text-base"
            >
              Ask AI Legal Assistant
            </Button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Comprehensive Coverage
              </h3>
              <p className="text-sm text-gray-600">
                Access information across multiple legal practice areas
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
              <p className="text-sm text-gray-600">
                Get instant answers and explanations from our AI assistant
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Always Available
              </h3>
              <p className="text-sm text-gray-600">
                Access legal information anytime, anywhere from any device
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="mb-20">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore Legal Practice Areas
          </h2>
          <p className="text-gray-600 text-lg">
            Choose from our comprehensive collection of legal topics and get
            detailed information about each area.
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
              <div className="h-full rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-blue-300 hover:shadow-lg bg-white">
                {/* Card Header with Gradient */}
                <div
                  className={`h-32 bg-gradient-to-br ${category.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 text-5xl">
                      {category.icon}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {category.count} topics
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Still have questions about the law?
        </h2>
        <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
          Our AI-powered legal assistant is available 24/7 to help you
          understand complex legal concepts and find answers to your questions.
        </p>
        <Button className="bg-white hover:bg-gray-100 text-blue-600 font-semibold gap-2">
          Start a Conversation <ArrowRight className="w-4 h-4" />
        </Button>
      </section>
    </Layout>
  );
}

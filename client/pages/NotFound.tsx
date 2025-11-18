import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="text-7xl font-bold text-gray-900 mb-2">404</div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            The page you're looking for doesn't exist. This might be a mistyped
            URL or the page may have been moved.
          </p>
          <a href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

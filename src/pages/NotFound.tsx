
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold text-brand-700 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Button className="bg-brand-600 hover:bg-brand-700" asChild>
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

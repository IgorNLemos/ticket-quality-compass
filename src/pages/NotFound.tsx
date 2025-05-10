
import { useJira } from "@/contexts/JiraContext";
import { useEffect } from "react";

const NotFound = () => {
  const { moduleKey } = useJira();

  useEffect(() => {
    console.error(
      "404 Error: Invalid module key or route:",
      moduleKey || "unknown"
    );
  }, [moduleKey]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Module not found</p>
        <p className="text-gray-500 mb-6">
          The requested module "{moduleKey || 'unknown'}" could not be found or is not configured correctly.
        </p>
        {/* We don't use links here since we're module-based now */}
        <div className="text-blue-500">
          Please check your Forge app configuration.
        </div>
      </div>
    </div>
  );
};

export default NotFound;

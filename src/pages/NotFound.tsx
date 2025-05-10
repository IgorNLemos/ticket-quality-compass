
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
      <div className="text-center p-6 max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Module not found</p>
        <p className="text-gray-500 mb-6">
          The requested module "{moduleKey || 'unknown'}" could not be found or is not configured correctly.
        </p>
        <div className="text-blue-500 mb-6">
          Please check your Forge app configuration.
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 border border-yellow-200">
          <p className="font-semibold mb-2">Development Tips:</p>
          <ul className="list-disc pl-5 text-left">
            <li className="mb-1">Add <code>?panel=true</code> to URL for issue panel view</li>
            <li className="mb-1">Add <code>?admin=true</code> to URL for admin dashboard view</li>
            <li>Verify manifest.yml has correct module keys configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

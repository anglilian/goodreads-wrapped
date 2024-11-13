import { useBookData } from "@/hooks/useBookData";

const DevTools = () => {
  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const { clearBooks } = useBookData();

  const handleClearData = () => {
    clearBooks();
    // Force reload to ensure clean state
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleClearData}
        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
      >
        Clear Data (Dev Only)
      </button>
    </div>
  );
};

export default DevTools;

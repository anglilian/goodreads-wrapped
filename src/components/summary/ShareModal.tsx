import { useState } from "react";
import { useBookData } from "@/hooks/useBookData";
import { ClipboardCopy, ClipboardCheck } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { books, genreAnalysis } = useBookData();
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(
    (book) => book.dateRead.getFullYear() === currentYear
  );

  const getShareMessage = (link: string) => {
    return `📚 Check out my ${currentYear} in books! I read ${booksThisYear.length} books this year.\n\n${link}`;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bookData: { books, genreAnalysis },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate shareable link");
      }

      const shareableLink = `${window.location.origin}?id=${data.id}`;
      const shareMessage = getShareMessage(shareableLink);

      setShareableLink(shareableLink);
      await navigator.clipboard.writeText(shareMessage);
      setCopySuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate shareable link"
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleCopy = async () => {
    if (!shareableLink) return;

    const shareMessage = getShareMessage(shareableLink);
    await navigator.clipboard.writeText(shareMessage);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full gap-4">
        <h5 className="mb-2">Share your reading journey!</h5>
        {!shareableLink ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? "Creating..." : "Create shareable link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className={`w-full p-2 border rounded bg-gray-50 ${
                  copySuccess ? "bg-green-50 transition-colors" : ""
                }`}
              />
              <button
                onClick={handleCopy}
                className="btn-primary relative flex items-center gap-2"
              >
                {copySuccess ? (
                  <>
                    <ClipboardCheck /> Copied!
                  </>
                ) : (
                  <>
                    <ClipboardCopy /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

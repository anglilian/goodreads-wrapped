import { useBookData } from "@/hooks/useBookData";

interface NoDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoDataModal({ isOpen, onClose }: NoDataModalProps) {
  const { goodreadsYear } = useBookData();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg p-6 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h5 className="font-bold mb-4">No books this year?</h5>
        <p className="mb-4">
          We couldn't find any books read in {goodreadsYear}. You can
          easily <a href="https://www.goodreads.com/review/list">add books</a>{" "}
          to this list by setting 'Date Read' for each book to any time in{" "}
          {goodreadsYear}.
        </p>
      </div>
    </div>
  );
}

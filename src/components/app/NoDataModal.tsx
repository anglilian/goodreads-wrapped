interface NoDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoDataModal({ isOpen, onClose }: NoDataModalProps) {
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
          We couldn&apos;t find any books read in {new Date().getFullYear()}.
          You can easily{" "}
          <a href="https://www.goodreads.com/review/list">add books</a> to this
          list by setting &lsquo;Date Read&rsquo; for each book to any time in{" "}
          {new Date().getFullYear()}.
        </p>
      </div>
    </div>
  );
}

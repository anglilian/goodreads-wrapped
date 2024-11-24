interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h5 className="font-bold mb-4">How to export your Goodreads library</h5>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Go to the{" "}
            <a
              href="https://www.goodreads.com/review/import"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold">Import and export</span>
            </a>{" "}
            in your Goodreads account.
          </li>
          <li>
            Click on the <span className="font-bold">Export Library</span>{" "}
            button at the top of the screen, below the Export heading.
          </li>
          <li>
            Click on{" "}
            <span className="font-bold">Your export from (date) - (time)</span>{" "}
            below the button to download the csv file.
          </li>
        </ol>
        <div className="mt-4">
          <h6 className="font-bold mb-2">Troubleshooting Tips:</h6>
          <ul className="list-disc list-inside space-y-2">
            <li>
              The file may take time to generate if you have a large library.
            </li>
            <li>
              On iPhone: Open the generated download link in Safari or another
              web browser.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

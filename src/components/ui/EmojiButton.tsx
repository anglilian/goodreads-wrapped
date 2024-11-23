import { useState } from "react";

interface EmojiButtonProps {
  emoji: string;
}

export default function EmojiButton({ emoji }: EmojiButtonProps) {
  const [emojis, setEmojis] = useState<Array<{ id: number; left: number }>>([]);

  const createEmoji = () => {
    const id = Math.random();
    const left = Math.floor(Math.random() * 101) - 100; // Random integer between -50 and +50

    setEmojis((prev) => [...prev, { id, left }]);

    // Remove emoji after animation completes
    setTimeout(() => {
      setEmojis((prev) => prev.filter((emoji) => emoji.id !== id));
    }, 1000);
  };

  return (
    <div className="relative">
      <button
        onClick={createEmoji}
        className="bg-primary-button p-3 rounded-full hover:scale-110 transition-transform duration-200 text-xl"
        aria-label="Show love"
      >
        {emoji}
      </button>

      {/* Emoji container */}
      <div className="absolute bottom-full left-1/2 right-0 pointer-events-none">
        {emojis.map((emojiItem) => (
          <div
            key={emojiItem.id}
            className="absolute bottom-0 animate-float-up -translate-x-1/2 text-xl"
            style={{ left: `${emojiItem.left}%` }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <Image
        src="/images/flipping_book.gif"
        width={48}
        height={48}
        alt="Loading animation"
        priority
      />
      <p>Looking through your library...</p>
    </div>
  );
}

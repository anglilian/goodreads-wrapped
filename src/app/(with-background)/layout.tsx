import { useBookData } from "@/hooks/useBookData";
import BackgroundContainer from "@/context/BackgroundContainer";

export default function BackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center">
      <BackgroundContainer />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

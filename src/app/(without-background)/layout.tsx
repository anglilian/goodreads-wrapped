import React from "react";

export default function WithoutBackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl px-4">{children}</div>
    </main>
  );
}

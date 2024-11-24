// src/components/ui/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="fixed bottom-4 right-4 bg-background opacity-50 lg:block hidden">
      <p className="text-sm text-primary opacity-90">
        Made with ♡ by{" "}
        <a href="https://anglilian.com" target="_blank">
          Ang Li-Lian
        </a>{" "}
        © {currentYear}
      </p>
    </footer>
  );
}

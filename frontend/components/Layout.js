// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col">
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-[#1E1E1E]">
        <Link href="/" className="inline-block">
          <img
            src="/logo.png"
            alt="Snikah logo"
            className="h-8 max-h-10 w-auto max-w-[160px] object-contain"
          />
        </Link>
        <nav className="space-x-4 text-sm">
          <Link href="/comparador" className="hover:text-[#32CD32]">Comparador</Link>
          <Link href="/explorar" className="hover:text-[#32CD32]">Explorar</Link>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="border-t border-[#1E1E1E] py-6 text-center text-sm text-gray-500">
        © 2025 Snikah. Hecho con 💚 en Chile.
      </footer>
    </div>
  );
}

// components/Layout.js
import Link from "next/link";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col">
      <header className="w-full px-6 py-5 flex justify-between items-center border-b border-[#1E1E1E]">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Snikah logo"
              width={160}
              height={36}
              priority
            />
          </Link>
        </div>

        <nav className="space-x-6 text-sm">
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

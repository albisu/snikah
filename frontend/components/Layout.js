import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [isScrollingUp, setIsScrollingUp] = useState(true);

  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrollingUp(currentScroll < lastScroll || currentScroll < 50);
      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col">
      {/* Header estilo Nike con scroll-aware */}
      <header
        className={`w-full z-50 fixed top-0 left-0 transition-transform duration-300 ${
          isScrollingUp ? "translate-y-0" : "-translate-y-full"
        } bg-[#121212] border-b border-[#1E1E1E]`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo bien espaciado */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Snikah logo"
              width={140}
              height={36}
              priority
            />
          </Link>

          {/* Navegación */}
          <nav className="flex gap-8 text-sm font-medium">
            <Link href="/explorar" className="hover:text-[#32CD32]">Explorar</Link>
            <Link href="/comparador" className="hover:text-[#32CD32]">Comparador</Link>
          </nav>
        </div>
      </header>

      {/* Empujar contenido hacia abajo */}
      <div className="pt-[70px]">
        <main className="flex-grow">{children}</main>
        <footer className="border-t border-[#1E1E1E] py-6 text-center text-sm text-gray-500">
          © 2025 Snikah. Hecho con 💚 en Chile.
        </footer>
      </div>
    </div>
  );
}

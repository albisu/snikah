// frontend/pages/explorar.js

import Link from "next/link";
import Layout from "../components/Layout";

export default function Explorar() {
  return (
    <Layout>
      <div className="bg-[#121212] text-white min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Explora Sneakers</h1>
          <p className="text-gray-400 mb-12">Selecciona el género para explorar el catálogo disponible.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/catalogo/hombre">
              <div className="bg-[#1E1E1E] border border-[#32CD32] p-8 rounded-xl cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-2xl font-semibold mb-2">Sneakers Hombre</h2>
                <p className="text-gray-400 text-sm">Descubre las mejores zapatillas para hombre disponibles en Chile.</p>
              </div>
            </Link>

            <Link href="/catalogo/mujer">
              <div className="bg-[#1E1E1E] border border-[#32CD32] p-8 rounded-xl cursor-pointer hover:scale-105 transition-transform">
                <h2 className="text-2xl font-semibold mb-2">Sneakers Mujer</h2>
                <p className="text-gray-400 text-sm">Explora el catálogo exclusivo de zapatillas para mujer.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

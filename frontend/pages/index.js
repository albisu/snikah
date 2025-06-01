import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) {
        console.error('Error al obtener productos:', error);
      } else {
        setProductos(data);
      }
    }

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="flex items-center gap-4 mb-6">
        <img src="/logo.png" alt="Logo Snikah" className="h-10" />
      </header>

      <p className="mb-8 text-gray-400">Encuentra los mejores precios en zapatillas urbanas.</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <li key={p.id} className="flex flex-col p-4 rounded-xl bg-[#1E1E1E] hover:bg-[#2c2c2c] transition">
            <img
              src={p.imagen}
              alt={p.titulo}
              className="w-full h-48 object-contain mb-4"
            />
            <div className="mt-auto text-center">
              <p className="text-base font-semibold">{p.titulo}</p>
              <p className="text-lime font-semibold">{p.precio}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block bg-lime text-black font-bold py-1 px-3 rounded hover:opacity-90 transition"
              >
                Ver oferta
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
